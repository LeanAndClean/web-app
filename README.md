#Web App

##Configuration parameters

```
export SERVICE_PORT=5050
export DISCOVERY_SERVICE_URL=http://46.101.191.124:8500
```

##Build

`docker build -t web-app-service .`

##Run locally

`docker run -t -i -p 5050:5050 web-app-service`

##Release into private repository

```
docker tag web-app-service 46.101.191.124:5000/web-app-service:0.0.14
docker push 46.101.191.124:5000/web-app-service:0.0.14
```

##Deploy via Shipyard

```
curl -X POST \
-H 'Content-Type: application/json' \
-H 'X-Service-Key: pdE4.JVg43HyxCEMWvsFvu6bdFV7LwA7YPii' \
http://46.101.191.124:8080/api/containers?pull=true \
-d '{  
  "name":"46.101.191.124:5000/web-app-service:0.0.14",
  "cpus":0.1,
  "memory":64,
  "environment":{
    "SERVICE_CHECK_SCRIPT":"curl -s http://46.101.191.124:80/healthcheck",
    "SERVICE_PORT":"80",
    "DISCOVERY_SERVICE_URL":"http://46.101.191.124:8500"
  },
  "hostname":"",
  "domain":"",
  "type":"service",
  "network_mode":"bridge",
  "links":{},
  "volumes":[],
  "bind_ports":[  
    {  
       "proto":"tcp",
       "host_ip":null,
       "port":80,
       "container_port":80
    }
  ],
  "labels":[],
  "publish":false,
  "privileged":false,
  "restart_policy":{  
    "name":"no"
  }
}'
```

##API

###Health check

```
curl -X GET \
-H 'Content-Type: application/json' \
http://46.101.191.124:80/healthcheck
```