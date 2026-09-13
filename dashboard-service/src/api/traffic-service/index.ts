import {
  CountryTrafficMetrics,
  TrafficResponse,
  VehicleTrafficMetrics,
} from './interface';

interface TrafficFilters {
  year: number;
  month: number;
}

const getCountryTrafficMetrics = async (
  { year, month }: TrafficFilters,
  signal: AbortSignal,
): Promise<CountryTrafficMetrics[]> => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  const response = await fetch(`/traffic-data/country-wise-metrics?${params}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Traffic service returned ${String(response.status)}`);
  }

  const body = (await response.json()) as TrafficResponse<
    Omit<CountryTrafficMetrics, 'countryKey'>
  >;

  return Object.entries(body.data).map(([countryKey, metrics]) => ({
    ...metrics,
    countryKey,
  }));
};

const getVehicleTrafficMetrics = async (
  { year, month }: TrafficFilters,
  signal: AbortSignal,
): Promise<VehicleTrafficMetrics[]> => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  const response = await fetch(`/traffic-data/vehicle-wise-metrics?${params}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Traffic service returned ${String(response.status)}`);
  }

  const body = (await response.json()) as TrafficResponse<
    Omit<VehicleTrafficMetrics, 'vehicleKey'>
  >;

  return Object.entries(body.data).map(([vehicleKey, metrics]) => ({
    ...metrics,
    vehicleKey,
  }));
};

export { getCountryTrafficMetrics, getVehicleTrafficMetrics };
