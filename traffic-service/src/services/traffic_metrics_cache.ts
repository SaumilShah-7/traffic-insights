import { CountryWiseTrafficMetrics, VehicleWiseTrafficMetrics } from '../db/repositories/interface';

const CACHE_TTL_MS = 60000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const countryWiseCache = new Map<string, CacheEntry<CountryWiseTrafficMetrics>>();
const vehicleWiseCache = new Map<string, CacheEntry<VehicleWiseTrafficMetrics>>();

const getCountryWiseKey = (year: number, month: number): string => `country:${year}:${month}`;
const getVehicleWiseKey = (year: number, month: number): string => `vehicle:${year}:${month}`;

const getCachedValue = <T>(cache: Map<string, CacheEntry<T>>, key: string): T | undefined => {
  const entry = cache.get(key);
  if (entry === undefined) {
    return undefined;
  }

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }

  return entry.data;
};

const getCountryWiseMetricsFromCache = (
  year: number,
  month: number,
): CountryWiseTrafficMetrics | undefined =>
  getCachedValue(countryWiseCache, getCountryWiseKey(year, month));

const setCountryWiseMetricsInCache = (
  year: number,
  month: number,
  data: CountryWiseTrafficMetrics,
): void => {
  countryWiseCache.set(getCountryWiseKey(year, month), {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
};

const getVehicleWiseMetricsFromCache = (
  year: number,
  month: number,
): VehicleWiseTrafficMetrics | undefined =>
  getCachedValue(vehicleWiseCache, getVehicleWiseKey(year, month));

const setVehicleWiseMetricsInCache = (
  year: number,
  month: number,
  data: VehicleWiseTrafficMetrics,
): void => {
  vehicleWiseCache.set(getVehicleWiseKey(year, month), {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
};

const invalidateTrafficMetricsForDates = (dates: string[]): void => {
  const affectedMonths = new Set(dates.map((date) => date.slice(0, 7)));

  for (const affectedMonth of affectedMonths) {
    const [year, month] = affectedMonth.split('-').map(Number);
    countryWiseCache.delete(getCountryWiseKey(year, month));
    vehicleWiseCache.delete(getVehicleWiseKey(year, month));
  }
};

export {
  getCountryWiseMetricsFromCache,
  getVehicleWiseMetricsFromCache,
  invalidateTrafficMetricsForDates,
  setCountryWiseMetricsInCache,
  setVehicleWiseMetricsInCache,
};
