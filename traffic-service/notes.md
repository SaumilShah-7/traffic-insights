To run service locally: npm run build && npm start

postgresql

CREATE TABLE traffic_data (
country_code VARCHAR(2) NOT NULL,
vehicle_type TEXT NOT NULL,
date DATE NOT NULL,
year INTEGER NOT NULL,
month INTEGER NOT NULL,

vehicle_count INTEGER NOT NULL,
total_travel_distance_kms INTEGER NOT NULL,
total_travel_time_hours INTEGER NOT NULL,

PRIMARY KEY (country_code, vehicle_type, date)
);

CREATE INDEX traffic_data_year_month_idx
ON traffic_data (year, month);

\d traffic_data

ALTER DEFAULT PRIVILEGES FOR ROLE saumil
IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLES TO traffic_service;
ALTER DEFAULT PRIVILEGES

for existing tables

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO traffic_service;
