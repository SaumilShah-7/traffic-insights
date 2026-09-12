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
      maxItems: 100,
      items: trafficDataItemSchema,
    },
  },
};

const getCountryWiseTrafficMetricsQuerySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['year'],
  properties: {
    month: {
      type: 'string',
      pattern: '^(?:[1-9]|1[0-2])$',
    },
    year: {
      type: 'string',
      pattern: '^[1-9][0-9]*$',
    },
  },
};

const getVehicleWiseTrafficMetricsQuerySchema = getCountryWiseTrafficMetricsQuerySchema;

export {
  getCountryWiseTrafficMetricsQuerySchema,
  getVehicleWiseTrafficMetricsQuerySchema,
  insertTrafficBodySchema,
};
