import {
  getCountryWiseTrafficMetrics as getCountryWiseTrafficMetricsFromRepository,
  getTrafficData as getTrafficDataFromRepository,
  getVehicleWiseTrafficMetrics as getVehicleWiseTrafficMetricsFromRepository,
  insertTrafficData as insertTrafficDataInRepository,
  updateTrafficData as updateTrafficDataInRepository,
} from '../db/repositories/traffic_data_repository';
import {
  GetCountryWiseTrafficMetricsRequest,
  GetCountryWiseTrafficMetricsResponse,
  GetTrafficDataRequest,
  GetTrafficDataResponse,
  GetTrafficDataFiltersResponse,
  GetVehicleWiseTrafficMetricsRequest,
  GetVehicleWiseTrafficMetricsResponse,
  InsertTrafficRequest,
  InsertTrafficResponse,
  UpdateTrafficRequest,
  UpdateTrafficResponse,
} from './interface';
import {
  getCountryWiseMetricsFromCache,
  getVehicleWiseMetricsFromCache,
  invalidateTrafficMetricsForDates,
  setCountryWiseMetricsInCache,
  setVehicleWiseMetricsInCache,
} from './traffic_metrics_cache';
import { COUNTRY_CODE_TO_NAME, CountryCode, VehicleType } from '../constants';

const insertTrafficData = async (request: InsertTrafficRequest): Promise<InsertTrafficResponse> => {
  await insertTrafficDataInRepository(request.data);
  invalidateTrafficMetricsForDates(request.data.map(({ date }) => date));
  return { success: true };
};

const getTrafficData = async (request: GetTrafficDataRequest): Promise<GetTrafficDataResponse> => {
  const { countryCode, vehicleType, year, month } = request;
  const data = await getTrafficDataFromRepository(countryCode, vehicleType, year, month);
  return { data };
};

const updateTrafficData = async (request: UpdateTrafficRequest): Promise<UpdateTrafficResponse> => {
  await updateTrafficDataInRepository(request);
  invalidateTrafficMetricsForDates([request.date]);
  return { success: true };
};

const getCountryWiseTrafficMetrics = async (
  request: GetCountryWiseTrafficMetricsRequest,
): Promise<GetCountryWiseTrafficMetricsResponse> => {
  const { year, month } = request;
  const cachedData = getCountryWiseMetricsFromCache(year, month);
  if (cachedData) {
    return { data: cachedData };
  }

  const data = await getCountryWiseTrafficMetricsFromRepository(year, month);
  setCountryWiseMetricsInCache(year, month, data);
  return { data };
};

const getVehicleWiseTrafficMetrics = async (
  request: GetVehicleWiseTrafficMetricsRequest,
): Promise<GetVehicleWiseTrafficMetricsResponse> => {
  const { year, month } = request;
  const cachedData = getVehicleWiseMetricsFromCache(year, month);
  if (cachedData) {
    return { data: cachedData };
  }

  const data = await getVehicleWiseTrafficMetricsFromRepository(year, month);
  setVehicleWiseMetricsInCache(year, month, data);
  return { data };
};

const getTrafficDataFilters = (): GetTrafficDataFiltersResponse => ({
  data: {
    countries: Object.values(CountryCode).map((countryCode) => ({
      countryCode,
      countryName: COUNTRY_CODE_TO_NAME[countryCode],
    })),
    vehicleTypes: Object.values(VehicleType),
  },
});

export {
  getCountryWiseTrafficMetrics,
  getTrafficData,
  getTrafficDataFilters,
  getVehicleWiseTrafficMetrics,
  insertTrafficData,
  updateTrafficData,
};
