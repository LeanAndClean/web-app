#ECommerce Web App

##Configuration

```
export SERVICE_PORT=5555
export SHUTDOWN_TIMEOUT_MS=10000
export PUBLISH_SERVICE=<ip>:<port>
export SERVICE_VERSION=0.0.21
```

##Build

`docker build -t ecommerce-web-app .`

##Run locally

`docker run -it -p $SERVICE_PORT:$SERVICE_PORT ecommerce-web-app`

##Publish into private repository

```
docker tag ecommerce-web-app $PUBLISH_SERVICE/ecommerce-web-app:$SERVICE_VERSION
docker push $PUBLISH_SERVICE/ecommerce-web-app:$SERVICE_VERSION
```

##API

###Health check

```
curl -X GET \
-H 'Content-Type: application/json' \
http://localhost:$SERVICE_PORT/healthcheck
```
