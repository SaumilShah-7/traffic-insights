# Traffic Insights

[Assignment brief](https://drive.google.com/file/d/1Adv1scd5nQPteQi8HykPaFsjRqWD0xDQ/view)

Traffic Insights is a dashboard for viewing traffic metrics and records. Its system components include:
 - React frontend ([dashboard-service](dashboard-service/README.md))
 - Fastify API backend ([traffic-service](traffic-service/README.md))
 - PostgreSQL database
   - Hosted on Render's free tier (available until October 13, 2026) with seed data added for August & September 2026
   - Hosted externally to avoid repeating role, database, table and seed data setup on every new machine

## Dashboard Features

- View monthly traffic metrics grouped by country and vehicle type. Switch between different metrics and different periods
- View and update traffic records by country, vehicle type, month and year

## Assumptions

- Traffic record is unique for a country, vehicle type and date (composite key). Each record stores vehicle count, total travel distance in kilometres and total travel time in hours
- An external data provider sends traffic records in batches over `http://{gateway-url}/traffic-data`. These are purely insert ops. Duplicate records with same composite key are ignored
- Workload is primarily read-heavy driven by dashboard queries whereas write workload consisting of traffic data inserts/updates is comparatively low

## Design decisions for 500 RPS:

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

Kubernetes manifests use immutable image digests published to GitHub Container Registry.

### Prerequisites

- Docker
- Minikube
- kubectl
- `traffic-service/.env` containing the PostgreSQL credentials

Run the following commands from repository root:

```bash
open -a Docker
minikube start --driver=docker
minikube addons enable metrics-server

kubectl create secret generic traffic-service-secret \
  --from-env-file=traffic-service/.env

kubectl apply -f k8s/workloads/overlays/development/environment-config.yaml

kubectl apply -k k8s/workloads/overlays/development/traffic-service
kubectl rollout status deployment/traffic-deployment
kubectl get hpa traffic-deployment-hpa --watch

kubectl apply -k k8s/workloads/overlays/development/dashboard-service
kubectl rollout status deployment/dashboard-deployment
```

Install Emissary-ingress and its CRDs:

```bash
export EMISSARY_VERSION=4.1.0

helm upgrade --install emissary-crds \
  oci://ghcr.io/emissary-ingress/emissary-crds-chart \
  --version "$EMISSARY_VERSION" \
  --namespace emissary \
  --create-namespace \
  --wait

helm upgrade --install emissary \
  oci://ghcr.io/emissary-ingress/emissary-ingress \
  --version "$EMISSARY_VERSION" \
  --namespace emissary \
  --wait

kubectl rollout status deployment/emissary -n emissary

kubectl apply -k k8s/ingress
minikube service emissary -n emissary --url
```

Emissary-ingress is the single external entry point. Use its address for dashboard-service at `/dashboard/` and traffic-service at `/traffic-data/`.

### Argo CD

Install Argo CD and register the GitOps Applications:

```bash
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl apply -f k8s/argocd/project.yaml
kubectl apply -f k8s/argocd/development.yaml
```

When finished:

```bash
minikube stop
```

## CI/CD

CI pipelines test both services, publish immutable images to GHCR, and open
deployment pull requests. Argo CD runs inside the Kubernetes cluster and
deploys the merged Git state, so GitHub-hosted runners do not need network
access to the Minikube API server.

## Tests

Added basic UTs.

## Fresh cluster with Argo CD

Run these commands from the repository root. The initial image digests must be
populated in the development workload overlays before Argo CD syncs them.

```bash
open -a Docker
minikube start --driver=docker
minikube addons enable metrics-server

kubectl create secret generic traffic-service-secret \
  --from-env-file=traffic-service/.env

export EMISSARY_VERSION=4.1.0

helm upgrade --install emissary-crds \
  oci://ghcr.io/emissary-ingress/emissary-crds-chart \
  --version "$EMISSARY_VERSION" \
  --namespace emissary \
  --create-namespace \
  --wait

helm upgrade --install emissary \
  oci://ghcr.io/emissary-ingress/emissary-ingress \
  --version "$EMISSARY_VERSION" \
  --namespace emissary \
  --wait

kubectl rollout status deployment/emissary -n emissary

kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl apply -f k8s/argocd/project.yaml
kubectl apply -f k8s/argocd/development.yaml

minikube service emissary -n emissary --url
```
