import { date, index, integer, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';
import { CountryCode, VehicleType } from '../../constants';

const trafficData = pgTable(
  'traffic_data',
  {
    countryCode: varchar('country_code', { length: 2 }).$type<CountryCode>().notNull(),
    vehicleType: text('vehicle_type').$type<VehicleType>().notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    year: integer('year').notNull(),
    month: integer('month').notNull(),
    vehicleCount: integer('vehicle_count').notNull(),
    totalTravelDistanceKms: integer('total_travel_distance_kms').notNull(),
    totalTravelTimeHours: integer('total_travel_time_hours').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.countryCode, table.vehicleType, table.date] }),
    index('traffic_data_year_month_idx').on(table.year, table.month),
  ],
);

export { trafficData };
