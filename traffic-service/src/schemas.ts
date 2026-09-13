import { CountryCode, VehicleType } from './constants';

const trafficDataItemSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'countryCode',
    'vehicleType',
    'date',
    'vehicleCount',
    'totalTravelDistanceKms',
    'totalTravelTimeHours',
  ],
  properties: {
    countryCode: { type: 'string', enum: Object.values(CountryCode) },
    vehicleType: { type: 'string', enum: Object.values(VehicleType) },
    date: { type: 'string', format: 'date' },
    vehicleCount: { type: 'integer', minimum: 1 },
    totalTravelDistanceKms: { type: 'integer', minimum: 1 },
    totalTravelTimeHours: { type: 'integer', minimum: 1 },
  },
};

const insertTrafficBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['data'],
  properties: {
    data: {
      type: 'array',
      minItems: 1,
      maxItems: 500,
      items: trafficDataItemSchema,
    },
  },
};

const getCountryWiseTrafficMetricsQuerySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['year', 'month'],
  properties: {
    year: {
      type: 'integer',
      minimum: 1,
    },
    month: {
      type: 'integer',
      minimum: 1,
      maximum: 12,
    },
  },
};

const getVehicleWiseTrafficMetricsQuerySchema = getCountryWiseTrafficMetricsQuerySchema;

export {
  getCountryWiseTrafficMetricsQuerySchema,
  getVehicleWiseTrafficMetricsQuerySchema,
  insertTrafficBodySchema,
};
