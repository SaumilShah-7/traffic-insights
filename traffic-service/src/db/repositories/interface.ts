import { CountryCode, VehicleType } from '../../constants';

interface TrafficDataDocument {
  countryCode: CountryCode;
  vehicleType: VehicleType;
  date: string; // YYYY-MM-DD format
  year: number;
  month: number;
  vehicleCount: number;
  totalTravelDistanceKms: number;
  totalTravelTimeHours: number;
}

type CountryWiseTrafficMetrics = Partial<
  Record<
    CountryCode,
    {
      countryName: string;
      vehicleCount: number;
      totalTravelDistanceKms: number;
      totalTravelTimeHours: number;
    }
  >
>;

type VehicleWiseTrafficMetrics = Partial<
  Record<
    VehicleType,
    {
      vehicleName: string;
      vehicleCount: number;
      totalTravelDistanceKms: number;
      totalTravelTimeHours: number;
    }
  >
>;

export { CountryWiseTrafficMetrics, TrafficDataDocument, VehicleWiseTrafficMetrics };
