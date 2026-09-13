import {
  CountryWiseTrafficMetrics,
  TrafficDataDocument,
  VehicleWiseTrafficMetrics,
} from '../db/repositories/interface';

interface InsertTrafficRequest {
  data: TrafficDataDocument[];
}

interface InsertTrafficResponse {
  success: boolean;
}

interface GetCountryWiseTrafficMetricsRequest {
  year: number;
  month: number;
}

interface GetCountryWiseTrafficMetricsResponse {
  data: CountryWiseTrafficMetrics;
}

interface GetVehicleWiseTrafficMetricsRequest {
  year: number;
  month: number;
}

interface GetVehicleWiseTrafficMetricsResponse {
  data: VehicleWiseTrafficMetrics;
}

export {
  GetCountryWiseTrafficMetricsRequest,
  GetCountryWiseTrafficMetricsResponse,
  GetVehicleWiseTrafficMetricsRequest,
  GetVehicleWiseTrafficMetricsResponse,
  InsertTrafficRequest,
  InsertTrafficResponse,
};
