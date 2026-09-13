using node version: 26.8.2

ci - added trigger for commits to main

-------------


k8s setup (from traffic - insights folder):

brew install minikube

open -a Docker
minikube start --driver=docker
kubectl create secret generic traffic-service-secret \
--from-env-file=traffic-service/.env
kubectl apply -f k8s/traffic-service-deployment.yaml

minikube service traffic-service --url
minikube service dashboard-service --url

minikube stop

kubectl rollout restart deployment/traffic-deployment


kubectl describe deployment traffic-deployment
kubectl get pods -A

kubectl delete deployment traffic-deployment
kubectl delete service traffic-service



