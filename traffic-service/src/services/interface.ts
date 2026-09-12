import {
  CountryWiseTrafficMetrics,
  TrafficDataDocument,
  VehicleWiseTrafficMetrics,
} from '../db/repositories/interface';

interface InsertTrafficRequest {
  data: Omit<TrafficDataDocument, 'year' | 'month'>[];
}

interface InsertTrafficResponse {
  success: boolean;
}

interface GetCountryWiseTrafficMetricsRequest {
  year: string;
  month?: string;
}

interface GetCountryWiseTrafficMetricsResponse {
  data: CountryWiseTrafficMetrics;
}

interface GetVehicleWiseTrafficMetricsRequest {
  year: string;
  month?: string;
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
