#ECommerce Web App

##Configuration parameters

```
export SERVICE_PORT=5555
export SHUTDOWN_TIMEOUT_MS=10000
```

##Build

`docker build -t ecommerce-web-app .`

##Run locally

`docker run -t -i -p 5555:5555 ecommerce-web-app`

##Release into private repository

```
docker tag ecommerce-web-app 46.101.191.124:5000/ecommerce-web-app:0.0.18
docker push 46.101.191.124:5000/ecommerce-web-app:0.0.18
```

##Deploy via Shipyard

```
curl -X POST \
-H 'Content-Type: application/json' \
-H 'X-Service-Key: pdE4.JVg43HyxCEMWvsFvu6bdFV7LwA7YPii' \
http://46.101.191.124:8080/api/containers?pull=true \
-d '{  
  "name":"46.101.191.124:5000/ecommerce-web-app:0.0.18",
  "cpus":0.1,
  "memory":32,
  "environment":{
    "SERVICE_CHECK_SCRIPT":"curl -s http://46.101.191.124:5555/healthcheck",
    "SERVICE_PORT":"5555",
    "SHUTDOWN_TIMEOUT_MS":"10000",
    "LOG":"true"
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
       "port":5555,
       "container_port":5555
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
