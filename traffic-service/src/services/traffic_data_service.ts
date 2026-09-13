import {
  getCountryWiseTrafficMetrics as getCountryWiseTrafficMetricsFromRepository,
  getVehicleWiseTrafficMetrics as getVehicleWiseTrafficMetricsFromRepository,
  insertTrafficData as insertTrafficDataInRepository,
} from '../db/repositories/traffic_data_repository';
import {
  GetCountryWiseTrafficMetricsRequest,
  GetCountryWiseTrafficMetricsResponse,
  GetVehicleWiseTrafficMetricsRequest,
  GetVehicleWiseTrafficMetricsResponse,
  InsertTrafficRequest,
  InsertTrafficResponse,
} from './interface';
import {
  getCountryWiseMetricsFromCache,
  getVehicleWiseMetricsFromCache,
  invalidateTrafficMetricsForDates,
  setCountryWiseMetricsInCache,
  setVehicleWiseMetricsInCache,
} from './traffic_metrics_cache';

const insertTrafficData = async (request: InsertTrafficRequest): Promise<InsertTrafficResponse> => {
  await insertTrafficDataInRepository(request.data);
  invalidateTrafficMetricsForDates(request.data.map(({ date }) => date));
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

export { getCountryWiseTrafficMetrics, getVehicleWiseTrafficMetrics, insertTrafficData };
