import {
  CountryTrafficMetrics,
  TrafficDataFilterOptions,
  TrafficDataFilters,
  TrafficDataRecord,
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

const getTrafficDataFilterOptions = async (
  signal: AbortSignal,
): Promise<TrafficDataFilterOptions> => {
  const response = await fetch('/traffic-data/filters', { signal });

  if (!response.ok) {
    throw new Error(`Traffic service returned ${String(response.status)}`);
  }

  const body = (await response.json()) as { data: TrafficDataFilterOptions };
  return body.data;
};

const getTrafficData = async (
  filters: TrafficDataFilters,
  signal: AbortSignal,
): Promise<TrafficDataRecord[]> => {
  const params = new URLSearchParams({
    countryCode: filters.countryCode,
    vehicleType: filters.vehicleType,
    year: String(filters.year),
    month: String(filters.month),
  });
  const response = await fetch(`/traffic-data?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`Traffic service returned ${String(response.status)}`);
  }

  const body = (await response.json()) as { data: TrafficDataRecord[] };
  return body.data;
};

const updateTrafficData = async (record: TrafficDataRecord): Promise<void> => {
  const response = await fetch('/traffic-data', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error(`Traffic service returned ${String(response.status)}`);
  }
};

export {
  getCountryTrafficMetrics,
  getTrafficData,
  getTrafficDataFilterOptions,
  getVehicleTrafficMetrics,
  updateTrafficData,
};
