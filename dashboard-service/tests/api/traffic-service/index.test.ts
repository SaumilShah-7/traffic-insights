import {
  getCountryTrafficMetrics,
  getVehicleTrafficMetrics,
} from '../../../src/api/traffic-service';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('traffic service API', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getCountryTrafficMetrics', () => {
    it('returns country metrics with their country keys', async () => {
      const signal = new AbortController().signal;
      const responseBody = {
        data: {
          US: {
            countryName: 'United States',
            vehicleCount: 30,
            totalTravelDistanceKms: 750,
            totalTravelTimeHours: 15,
          },
          IN: {
            countryName: 'India',
            vehicleCount: 20,
            totalTravelDistanceKms: 400,
            totalTravelTimeHours: 10,
          },
        },
      };
      const mockJson = jest.fn().mockResolvedValue(responseBody);
      mockFetch.mockResolvedValue({ ok: true, json: mockJson });

      const result = await getCountryTrafficMetrics(
        { year: 2026, month: 3 },
        signal,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        '/traffic-data/country-wise-metrics?year=2026&month=3',
        { signal },
      );
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          countryKey: 'US',
          countryName: 'United States',
          vehicleCount: 30,
          totalTravelDistanceKms: 750,
          totalTravelTimeHours: 15,
        },
        {
          countryKey: 'IN',
          countryName: 'India',
          vehicleCount: 20,
          totalTravelDistanceKms: 400,
          totalTravelTimeHours: 10,
        },
      ]);
    });

    it('throws when the traffic service returns an error', async () => {
      const signal = new AbortController().signal;
      mockFetch.mockResolvedValue({ ok: false, status: 503 });

      await expect(
        getCountryTrafficMetrics({ year: 2026, month: 3 }, signal),
      ).rejects.toThrow('Traffic service returned 503');
    });
  });

  describe('getVehicleTrafficMetrics', () => {
    it('returns vehicle metrics with their vehicle keys', async () => {
      const signal = new AbortController().signal;
      const responseBody = {
        data: {
          car: {
            vehicleName: 'car',
            vehicleCount: 30,
            totalTravelDistanceKms: 750,
            totalTravelTimeHours: 15,
          },
          bus: {
            vehicleName: 'bus',
            vehicleCount: 12,
            totalTravelDistanceKms: 400,
            totalTravelTimeHours: 8,
          },
        },
      };
      const mockJson = jest.fn().mockResolvedValue(responseBody);
      mockFetch.mockResolvedValue({ ok: true, json: mockJson });

      const result = await getVehicleTrafficMetrics(
        { year: 2026, month: 12 },
        signal,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        '/traffic-data/vehicle-wise-metrics?year=2026&month=12',
        { signal },
      );
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          vehicleKey: 'car',
          vehicleName: 'car',
          vehicleCount: 30,
          totalTravelDistanceKms: 750,
          totalTravelTimeHours: 15,
        },
        {
          vehicleKey: 'bus',
          vehicleName: 'bus',
          vehicleCount: 12,
          totalTravelDistanceKms: 400,
          totalTravelTimeHours: 8,
        },
      ]);
    });

    it('throws when the traffic service returns an error', async () => {
      const signal = new AbortController().signal;
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      await expect(
        getVehicleTrafficMetrics({ year: 2026, month: 12 }, signal),
      ).rejects.toThrow('Traffic service returned 500');
    });
  });
});
