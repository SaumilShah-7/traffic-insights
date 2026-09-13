import {
  CountryWiseTrafficMetrics,
  TrafficDataDocument,
  VehicleWiseTrafficMetrics,
} from '../db/repositories/interface';
import { CountryCode, VehicleType } from '../constants';

interface InsertTrafficRequest {
  data: TrafficDataDocument[];
}

interface InsertTrafficResponse {
  success: boolean;
}

type UpdateTrafficRequest = TrafficDataDocument;

interface UpdateTrafficResponse {
  success: boolean;
}

interface GetTrafficDataRequest {
  countryCode: CountryCode;
  vehicleType: VehicleType;
  year: number;
  month: number;
}

interface GetTrafficDataResponse {
  data: TrafficDataDocument[];
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

interface GetTrafficDataFiltersResponse {
  data: {
    countries: Array<{
      countryCode: CountryCode;
      countryName: string;
    }>;
    vehicleTypes: VehicleType[];
  };
}

export {
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
};
