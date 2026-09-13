# Traffic Insights

[Assignment brief](https://docs.google.com/document/d/1pYhFJRQEZCgCXNv-Cw_Tb2sR-FpPs_lm2X_uLKOY6po/edit?usp=sharing)

Traffic Insights is a dashboard for viewing traffic metrics and records. Its system components include:
 - React frontend (dashboard-service)
 - Fastify API backend (traffic-service)
 - External PostgreSQL database hosted on Render

## Dashboard Features

- View monthly traffic metrics grouped by country and vehicle type. Switch between different metrics and different periods
- View and update traffic records by country, vehicle type, month and year

## Assumptions

- Traffic record is unique for a country, vehicle type and date (composite key). Each record stores vehicle count, total travel distance in kilometres and total travel time in hours
- An external provider sends traffic data in batches over `http://{traffic-service-url}/traffic-data`. These are purely insert ops. Duplicate records with same composite key are to be ignored
- Workload is primarily read-heavy driven by dashboard queries whereas write workload consisting of traffic data inserts/updates is comparatively low

## Design decisions for 500 read QPS:

- Traffic metrics are restricted to monthly windows to limit the amount of data scanned
- Traffic-service (backend) uses an in-memory cache to serve metric queries (TTL: 60 seconds) with cache-aside pattern
- Appropriate indexes are added to `traffic_data` PostgreSQL table
- Dashboard-service (React App) deployment uses Nginx to serve built static files
- Frontend and backend are deployed separately to allow for independent scaling as they differ in resource requirements

## Local Setup

### Prerequisites

- Node.js 26
- npm
- PostgreSQL credentials in `traffic-service/.env`. It is intentionally included to make the assignment easier to run. Else, the file would not have been committed

To start Traffic Service (port: 7777):

```bash
cd traffic-service
npm ci
npm run build && npm start
```

To start Dashboard Service (port: 9999):

```bash
cd dashboard-service
npm ci
npm run dev
```

## Kubernetes Setup

Kubernetes manifests use latest images published to GitHub Container Registry.

### Prerequisites

- Docker
- Minikube
- kubectl
- `traffic-service/.env` containing the PostgreSQL credentials

Run the following commands from repository root:

```bash
open -a Docker
minikube start --driver=docker

kubectl create secret generic traffic-service-secret \
  --from-env-file=traffic-service/.env

kubectl apply -f k8s/traffic-service-deployment.yaml
kubectl rollout status deployment/traffic-deployment

kubectl apply -f k8s/dashboard-service-deployment.yaml
kubectl rollout status deployment/dashboard-deployment
```

To get dashboard URL:

```bash
minikube service dashboard-service --url
```

To get Traffic Service URL (useful when you want to call `http://{traffic-service-url}/traffic-data` API to ingest new traffic records):

```bash
minikube service traffic-service --url
```

To deploy a newly published `latest` docker image:

```bash
kubectl rollout restart deployment/traffic-deployment
kubectl rollout restart deployment/dashboard-deployment
```

When finished:

```bash
minikube stop
```

## CI/CD

CI pipelines have been established for both services. Check `.github/workflows` folder.
Deployment remains manual because GitHub-hosted runner cannot reach local Minikube cluster. After CI publishes an image, restart relevant k8 deployment using command mentioned above.

## Tests

Pending
