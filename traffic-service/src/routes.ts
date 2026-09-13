import { FastifyInstance } from 'fastify';
import {
  getCountryWiseTrafficMetricsQuerySchema,
  getTrafficDataQuerySchema,
  getVehicleWiseTrafficMetricsQuerySchema,
  insertTrafficBodySchema,
  updateTrafficBodySchema,
} from './schemas';
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
} from './services/interface';
import {
  getCountryWiseTrafficMetrics,
  getTrafficData,
  getTrafficDataFilters,
  getVehicleWiseTrafficMetrics,
  insertTrafficData,
  updateTrafficData,
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
  app.patch<{ Body: UpdateTrafficRequest }>(
    '/traffic-data',
    { schema: { body: updateTrafficBodySchema } },
    async (request): Promise<UpdateTrafficResponse> => updateTrafficData(request.body),
  );
  app.get<{ Querystring: GetTrafficDataRequest }>(
    '/traffic-data',
    { schema: { querystring: getTrafficDataQuerySchema } },
    async (request): Promise<GetTrafficDataResponse> => getTrafficData(request.query),
  );
  app.get('/traffic-data/filters', async (): Promise<GetTrafficDataFiltersResponse> =>
    getTrafficDataFilters(),
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
