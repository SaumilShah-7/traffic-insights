import { COUNTRY_CODE_TO_NAME, CountryCode, VehicleType } from '../../src/constants';
import {
  getCountryWiseTrafficMetrics as getCountryWiseTrafficMetricsFromRepository,
  getTrafficData as getTrafficDataFromRepository,
  getVehicleWiseTrafficMetrics as getVehicleWiseTrafficMetricsFromRepository,
  insertTrafficData as insertTrafficDataInRepository,
  updateTrafficData as updateTrafficDataInRepository,
} from '../../src/db/repositories/traffic_data_repository';
import { TrafficDataDocument } from '../../src/db/repositories/interface';
import {
  getCountryWiseTrafficMetrics,
  getTrafficData,
  getTrafficDataFilters,
  getVehicleWiseTrafficMetrics,
  insertTrafficData,
  updateTrafficData,
} from '../../src/services/traffic_data_service';
import {
  getCountryWiseMetricsFromCache,
  getVehicleWiseMetricsFromCache,
  invalidateTrafficMetricsForDates,
  setCountryWiseMetricsInCache,
  setVehicleWiseMetricsInCache,
} from '../../src/services/traffic_metrics_cache';

jest.mock('../../src/db/repositories/traffic_data_repository', () => ({
  getCountryWiseTrafficMetrics: jest.fn(),
  getTrafficData: jest.fn(),
  getVehicleWiseTrafficMetrics: jest.fn(),
  insertTrafficData: jest.fn(),
  updateTrafficData: jest.fn(),
}));

jest.mock('../../src/services/traffic_metrics_cache', () => ({
  getCountryWiseMetricsFromCache: jest.fn(),
  getVehicleWiseMetricsFromCache: jest.fn(),
  invalidateTrafficMetricsForDates: jest.fn(),
  setCountryWiseMetricsInCache: jest.fn(),
  setVehicleWiseMetricsInCache: jest.fn(),
}));

const dataPoint: TrafficDataDocument = {
  countryCode: CountryCode.US,
  vehicleType: VehicleType.CAR,
  date: '2026-03-12',
  vehicleCount: 20,
  totalTravelDistanceKms: 500,
  totalTravelTimeHours: 10,
};

describe('traffic data service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('insertTrafficData', () => {
    it('inserts the data and invalidates metrics for its dates', async () => {
      const anotherDataPoint = { ...dataPoint, date: '2026-04-01' };

      const result = await insertTrafficData({ data: [dataPoint, anotherDataPoint] });

      expect(insertTrafficDataInRepository).toHaveBeenCalledWith([dataPoint, anotherDataPoint]);
      expect(invalidateTrafficMetricsForDates).toHaveBeenCalledWith(['2026-03-12', '2026-04-01']);
      expect(result).toEqual({ success: true });
    });
  });

  describe('getTrafficData', () => {
    it('returns the data from the repository', async () => {
      jest.mocked(getTrafficDataFromRepository).mockResolvedValue([dataPoint]);

      const result = await getTrafficData({
        countryCode: CountryCode.US,
        vehicleType: VehicleType.CAR,
        year: 2026,
        month: 3,
      });

      expect(getTrafficDataFromRepository).toHaveBeenCalledWith(
        CountryCode.US,
        VehicleType.CAR,
        2026,
        3,
      );
      expect(result).toEqual({ data: [dataPoint] });
    });
  });

  describe('updateTrafficData', () => {
    it('updates the data and invalidates metrics for its date', async () => {
      const result = await updateTrafficData(dataPoint);

      expect(updateTrafficDataInRepository).toHaveBeenCalledWith(dataPoint);
      expect(invalidateTrafficMetricsForDates).toHaveBeenCalledWith(['2026-03-12']);
      expect(result).toEqual({ success: true });
    });
  });

  describe('getCountryWiseTrafficMetrics', () => {
    const metrics = {
      [CountryCode.US]: {
        countryName: COUNTRY_CODE_TO_NAME[CountryCode.US],
        vehicleCount: 30,
        totalTravelDistanceKms: 750,
        totalTravelTimeHours: 15,
      },
    };

    it('returns cached metrics without querying the repository', async () => {
      jest.mocked(getCountryWiseMetricsFromCache).mockReturnValue(metrics);

      const result = await getCountryWiseTrafficMetrics({ year: 2026, month: 3 });

      expect(getCountryWiseMetricsFromCache).toHaveBeenCalledWith(2026, 3);
      expect(getCountryWiseTrafficMetricsFromRepository).not.toHaveBeenCalled();
      expect(setCountryWiseMetricsInCache).not.toHaveBeenCalled();
      expect(result).toEqual({ data: metrics });
    });

    it('queries and caches metrics when they are not cached', async () => {
      jest.mocked(getCountryWiseMetricsFromCache).mockReturnValue(undefined);
      jest.mocked(getCountryWiseTrafficMetricsFromRepository).mockResolvedValue(metrics);

      const result = await getCountryWiseTrafficMetrics({ year: 2026, month: 3 });

      expect(getCountryWiseMetricsFromCache).toHaveBeenCalledWith(2026, 3);
      expect(getCountryWiseTrafficMetricsFromRepository).toHaveBeenCalledWith(2026, 3);
      expect(setCountryWiseMetricsInCache).toHaveBeenCalledWith(2026, 3, metrics);
      expect(result).toEqual({ data: metrics });
    });
  });

  describe('getVehicleWiseTrafficMetrics', () => {
    const metrics = {
      [VehicleType.CAR]: {
        vehicleName: VehicleType.CAR,
        vehicleCount: 30,
        totalTravelDistanceKms: 750,
        totalTravelTimeHours: 15,
      },
    };

    it('returns cached metrics without querying the repository', async () => {
      jest.mocked(getVehicleWiseMetricsFromCache).mockReturnValue(metrics);

      const result = await getVehicleWiseTrafficMetrics({ year: 2026, month: 3 });

      expect(getVehicleWiseMetricsFromCache).toHaveBeenCalledWith(2026, 3);
      expect(getVehicleWiseTrafficMetricsFromRepository).not.toHaveBeenCalled();
      expect(setVehicleWiseMetricsInCache).not.toHaveBeenCalled();
      expect(result).toEqual({ data: metrics });
    });

    it('queries and caches metrics when they are not cached', async () => {
      jest.mocked(getVehicleWiseMetricsFromCache).mockReturnValue(undefined);
      jest.mocked(getVehicleWiseTrafficMetricsFromRepository).mockResolvedValue(metrics);

      const result = await getVehicleWiseTrafficMetrics({ year: 2026, month: 3 });

      expect(getVehicleWiseMetricsFromCache).toHaveBeenCalledWith(2026, 3);
      expect(getVehicleWiseTrafficMetricsFromRepository).toHaveBeenCalledWith(2026, 3);
      expect(setVehicleWiseMetricsInCache).toHaveBeenCalledWith(2026, 3, metrics);
      expect(result).toEqual({ data: metrics });
    });
  });

  describe('getTrafficDataFilters', () => {
    it('returns all supported countries and vehicle types', () => {
      const result = getTrafficDataFilters();

      expect(result).toEqual({
        data: {
          countries: Object.values(CountryCode).map((countryCode) => ({
            countryCode,
            countryName: COUNTRY_CODE_TO_NAME[countryCode],
          })),
          vehicleTypes: Object.values(VehicleType),
        },
      });
    });
  });
});
