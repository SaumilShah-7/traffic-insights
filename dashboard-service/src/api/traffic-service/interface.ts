interface TrafficMetrics {
  vehicleCount: number;
  totalTravelDistanceKms: number;
  totalTravelTimeHours: number;
}

interface CountryFilterOption {
  countryCode: string;
  countryName: string;
}

interface TrafficDataFilterOptions {
  countries: CountryFilterOption[];
  vehicleTypes: string[];
}

interface TrafficDataFilters {
  countryCode: string;
  vehicleType: string;
  year: number;
  month: number;
}

interface TrafficDataRecord extends TrafficMetrics {
  countryCode: string;
  vehicleType: string;
  date: string;
}

interface CountryTrafficMetrics extends TrafficMetrics {
  countryKey: string;
  countryName: string;
}

interface VehicleTrafficMetrics extends TrafficMetrics {
  vehicleKey: string;
  vehicleName: string;
}

interface TrafficResponse<T extends TrafficMetrics> {
  data: Record<string, T>;
}

export {
  CountryFilterOption,
  CountryTrafficMetrics,
  TrafficDataFilterOptions,
  TrafficDataFilters,
  TrafficDataRecord,
  TrafficMetrics,
  TrafficResponse,
  VehicleTrafficMetrics,
};
