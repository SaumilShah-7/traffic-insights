import { FastifyInstance } from 'fastify';
import {
  getCountryWiseTrafficMetricsQuerySchema,
  getVehicleWiseTrafficMetricsQuerySchema,
  insertTrafficBodySchema,
} from './schemas';
import {
  GetCountryWiseTrafficMetricsRequest,
  GetCountryWiseTrafficMetricsResponse,
  GetVehicleWiseTrafficMetricsRequest,
  GetVehicleWiseTrafficMetricsResponse,
  InsertTrafficRequest,
  InsertTrafficResponse,
} from './services/interface';
import {
  getCountryWiseTrafficMetrics,
  getVehicleWiseTrafficMetrics,
  insertTrafficData,
} from './services/traffic_data_service';

const registerRoutes = (app: FastifyInstance): void => {
  app.get('/health', () => ({ status: 'ok' }));
  app.post<{ Body: InsertTrafficRequest }>(
    '/traffic-data',
    { schema: { body: insertTrafficBodySchema } },
    async (request): Promise<InsertTrafficResponse> => {
      return insertTrafficData(request.body);
    },
  );
  app.get<{ Querystring: GetCountryWiseTrafficMetricsRequest }>(
    '/traffic-data/country-wise-metrics',
    { schema: { querystring: getCountryWiseTrafficMetricsQuerySchema } },
    async (request): Promise<GetCountryWiseTrafficMetricsResponse> => {
      return getCountryWiseTrafficMetrics(request.query);
    },
  );
  app.get<{ Querystring: GetVehicleWiseTrafficMetricsRequest }>(
    '/traffic-data/vehicle-wise-metrics',
    { schema: { querystring: getVehicleWiseTrafficMetricsQuerySchema } },
    async (request): Promise<GetVehicleWiseTrafficMetricsResponse> => {
      return getVehicleWiseTrafficMetrics(request.query);
    },
  );
};

export { registerRoutes };
