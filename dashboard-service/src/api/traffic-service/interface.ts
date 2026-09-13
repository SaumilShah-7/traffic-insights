interface TrafficMetrics {
  vehicleCount: number;
  totalTravelDistanceKms: number;
  totalTravelTimeHours: number;
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
  CountryTrafficMetrics,
  TrafficMetrics,
  TrafficResponse,
  VehicleTrafficMetrics,
};
