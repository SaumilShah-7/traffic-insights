# Traffic Service

## Key Features

* Fastify server with AJV-powered API schema validation
* Starts listening for API requests only after dependency initialisation
* External Render PostgreSQL integration with service credentials and connection pooling
* Optimized for a read-heavy database access pattern:
  * In-memory cache for monthly country/vehicle metrics with cache-aside reads and invalidation on writes
  * Traffic data schema with:
    * Composite primary key on `(country, vehicle_type, date)`
    * Index on `date`

## NOTE:

* `.env` has been intentionally included for assignment infra setup convenience; wouldn't have done so otherwise

