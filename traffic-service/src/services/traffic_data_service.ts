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

const insertTrafficData = async (request: InsertTrafficRequest): Promise<InsertTrafficResponse> => {
  await insertTrafficDataInRepository(request.data);
  return { success: true };
};

const getCountryWiseTrafficMetrics = async (
  request: GetCountryWiseTrafficMetricsRequest,
): Promise<GetCountryWiseTrafficMetricsResponse> => {
  const year = Number(request.year);
  const month = request.month === undefined ? undefined : Number(request.month);
  const data = await getCountryWiseTrafficMetricsFromRepository(year, month);
  return { data };
};

const getVehicleWiseTrafficMetrics = async (
  request: GetVehicleWiseTrafficMetricsRequest,
): Promise<GetVehicleWiseTrafficMetricsResponse> => {
  const year = Number(request.year);
  const month = request.month === undefined ? undefined : Number(request.month);
  const data = await getVehicleWiseTrafficMetricsFromRepository(year, month);
  return { data };
};

export { getCountryWiseTrafficMetrics, getVehicleWiseTrafficMetrics, insertTrafficData };
