To run service locally: npm run build && npm start

postgresql local setup:

installation:
brew install postgresql@17
brew services start postgresql@17

psql postgres

CREATE ROLE traffic_service
WITH LOGIN PASSWORD 'your_password';

CREATE DATABASE traffic_db
OWNER traffic_service;

\c traffic_db traffic_service

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

---

TO-DO :
batching support during insert - any dead lock possible ?
insert api returns success even if conflict
data generation script ?
