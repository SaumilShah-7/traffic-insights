import { eq, gte, lt } from 'drizzle-orm';
import { CountryCode, VehicleType } from '../../../src/constants';
import { getDependency } from '../../../src/dependencies';
import { DependencyType, type PostgresDependencyClient } from '../../../src/dependencies/interface';
import { trafficData } from '../../../src/db/models/traffic_data';
import {
  getCountryWiseTrafficMetrics,
  getTrafficData,
  getVehicleWiseTrafficMetrics,
  insertTrafficData,
  updateTrafficData,
} from '../../../src/db/repositories/traffic_data_repository';
import { TrafficDataDocument } from '../../../src/db/repositories/interface';

jest.mock('../../../src/dependencies', () => ({
  getDependency: jest.fn(),
}));

jest.mock('drizzle-orm', () => ({
  ...jest.requireActual('drizzle-orm'),
  and: jest.fn(),
  eq: jest.fn(),
  gte: jest.fn(),
  lt: jest.fn(),
}));

const dataPoint: TrafficDataDocument = {
  countryCode: CountryCode.US,
  vehicleType: VehicleType.CAR,
  date: '2026-03-12',
  vehicleCount: 20,
  totalTravelDistanceKms: 500,
  totalTravelTimeHours: 10,
};

const mockDatabase = {
  insert: jest.fn(),
  update: jest.fn(),
  select: jest.fn(),
};

const mockDependency: PostgresDependencyClient = {
  type: DependencyType.DB_POSTGRESQL,
  database: mockDatabase as unknown as PostgresDependencyClient['database'],
  close: jest.fn(),
};

describe('traffic data repository', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(getDependency).mockReturnValue(mockDependency);
  });

  describe('insertTrafficData', () => {
    it('does nothing when there are no data points', async () => {
      await insertTrafficData([]);

      expect(mockDatabase.insert).not.toHaveBeenCalled();
    });

    it('deduplicates data points and ignores database conflicts', async () => {
      const mockOnConflictDoNothing = jest.fn().mockResolvedValue(undefined);
      const mockValues = jest.fn().mockReturnValue({
        onConflictDoNothing: mockOnConflictDoNothing,
      });
      mockDatabase.insert.mockReturnValue({ values: mockValues });

      const duplicate = { ...dataPoint, vehicleCount: 999 };
      const anotherDataPoint = {
        ...dataPoint,
        vehicleType: VehicleType.BUS,
        vehicleCount: 5,
      };

      await insertTrafficData([dataPoint, duplicate, anotherDataPoint]);

      expect(mockDatabase.insert).toHaveBeenCalledWith(trafficData);
      expect(mockValues).toHaveBeenCalledWith([dataPoint, anotherDataPoint]);
      expect(mockOnConflictDoNothing).toHaveBeenCalledWith({
        target: [trafficData.countryCode, trafficData.vehicleType, trafficData.date],
      });
    });
  });

  describe('updateTrafficData', () => {
    it('updates only the metrics for the matching data point', async () => {
      const mockWhere = jest.fn().mockResolvedValue(undefined);
      const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
      mockDatabase.update.mockReturnValue({ set: mockSet });

      await updateTrafficData(dataPoint);

      expect(mockDatabase.update).toHaveBeenCalledWith(trafficData);
      expect(mockSet).toHaveBeenCalledWith({
        vehicleCount: 20,
        totalTravelDistanceKms: 500,
        totalTravelTimeHours: 10,
      });
      expect(eq).toHaveBeenNthCalledWith(1, trafficData.countryCode, CountryCode.US);
      expect(eq).toHaveBeenNthCalledWith(2, trafficData.vehicleType, VehicleType.CAR);
      expect(eq).toHaveBeenNthCalledWith(3, trafficData.date, '2026-03-12');
    });
  });

  describe('getTrafficData', () => {
    it('returns monthly traffic data ordered by date', async () => {
      const rows = [dataPoint];
      const mockOrderBy = jest.fn().mockResolvedValue(rows);
      const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      mockDatabase.select.mockReturnValue({ from: mockFrom });

      const result = await getTrafficData(CountryCode.US, VehicleType.CAR, 2026, 3);

      expect(result).toEqual(rows);
      expect(mockFrom).toHaveBeenCalledWith(trafficData);
      expect(eq).toHaveBeenNthCalledWith(1, trafficData.countryCode, CountryCode.US);
      expect(eq).toHaveBeenNthCalledWith(2, trafficData.vehicleType, VehicleType.CAR);
      expect(gte).toHaveBeenCalledWith(trafficData.date, '2026-03-01');
      expect(lt).toHaveBeenCalledWith(trafficData.date, '2026-04-01');
      expect(mockOrderBy).toHaveBeenCalledWith(trafficData.date);
    });
  });

  describe('getCountryWiseTrafficMetrics', () => {
    it('maps aggregated rows to country names', async () => {
      const mockGroupBy = jest.fn().mockResolvedValue([
        {
          countryCode: CountryCode.US,
          vehicleCount: 30,
          totalTravelDistanceKms: 750,
          totalTravelTimeHours: 15,
        },
      ]);
      const mockWhere = jest.fn().mockReturnValue({ groupBy: mockGroupBy });
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      mockDatabase.select.mockReturnValue({ from: mockFrom });

      const result = await getCountryWiseTrafficMetrics(2026, 3);

      expect(result).toEqual({
        [CountryCode.US]: {
          countryName: 'United States',
          vehicleCount: 30,
          totalTravelDistanceKms: 750,
          totalTravelTimeHours: 15,
        },
      });
      expect(mockFrom).toHaveBeenCalledWith(trafficData);
      expect(gte).toHaveBeenCalledWith(trafficData.date, '2026-03-01');
      expect(lt).toHaveBeenCalledWith(trafficData.date, '2026-04-01');
      expect(mockGroupBy).toHaveBeenCalledWith(trafficData.countryCode);
    });
  });

  describe('getVehicleWiseTrafficMetrics', () => {
    it('maps aggregated rows to vehicle names', async () => {
      const mockGroupBy = jest.fn().mockResolvedValue([
        {
          vehicleType: VehicleType.BUS,
          vehicleCount: 12,
          totalTravelDistanceKms: 400,
          totalTravelTimeHours: 8,
        },
      ]);
      const mockWhere = jest.fn().mockReturnValue({ groupBy: mockGroupBy });
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      mockDatabase.select.mockReturnValue({ from: mockFrom });

      const result = await getVehicleWiseTrafficMetrics(2026, 12);

      expect(result).toEqual({
        [VehicleType.BUS]: {
          vehicleName: VehicleType.BUS,
          vehicleCount: 12,
          totalTravelDistanceKms: 400,
          totalTravelTimeHours: 8,
        },
      });
      expect(mockFrom).toHaveBeenCalledWith(trafficData);
      expect(gte).toHaveBeenCalledWith(trafficData.date, '2026-12-01');
      expect(lt).toHaveBeenCalledWith(trafficData.date, '2027-01-01');
      expect(mockGroupBy).toHaveBeenCalledWith(trafficData.vehicleType);
    });
  });
});
