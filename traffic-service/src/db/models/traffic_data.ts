import { date, index, integer, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';
import { CountryCode, VehicleType } from '../../constants';

const trafficData = pgTable(
  'traffic_data',
  {
    countryCode: varchar('country_code', { length: 2 }).$type<CountryCode>().notNull(),
    vehicleType: text('vehicle_type').$type<VehicleType>().notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    vehicleCount: integer('vehicle_count').notNull(),
    totalTravelDistanceKms: integer('total_travel_distance_kms').notNull(),
    totalTravelTimeHours: integer('total_travel_time_hours').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.countryCode, table.vehicleType, table.date] }),
    index('traffic_data_date_idx').on(table.date),
  ],
);

export { trafficData };
