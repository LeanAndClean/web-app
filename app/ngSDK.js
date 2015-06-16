angular
  .module('ngSDK',[])
  .provider('http', function(){

    this.$get = function($http, $q){
      var CONFIG = {
        discovery: {
          servers: []
        },
        services: {

        }
      };

      return function(config){
        angular.extend(CONFIG, config);

        return {
          get: get,
          post: post,
          put: put,
          delete: del
        };
      };

      function resolve(serviceName){
        var DISCOVERY_SERVICE_URLS = CONFIG.discovery.servers.map(function(itm){
          return itm + '/v1/catalog/service/';
        });

        return $http.get(DISCOVERY_SERVICE_URLS[0] + serviceName)
          .then(function(result){
            return result.data.map(function(itm){
              return itm.Address + ':' + itm.ServicePort;
            });
          });
      }

      function get(serviceName, path){
        return ajax('get', serviceName, path);
      }

      function post(serviceName, path, value){
        return ajax('post', serviceName, path, value);
      }

      function put(serviceName, path, value){
        return ajax('put', serviceName, path, value);
      }

      function del(serviceName, path){
        return ajax('delete', serviceName, path, value);
      }

      function ajax(method, serviceName, path, value){
        return resolve(serviceName)
            .then(function(result){
              if(!CONFIG.services[serviceName]) CONFIG.services[serviceName] = result;              
              return CONFIG.services[serviceName];
            })
            .then(function(urls){
              if(!urls.length) throw Error('No endpoint configured for service ' + serviceName);

              //map url to a list of operations
              var promises = urls.map(function(url){
                return function(){
                  return $http[method]('http://' + url + path, value, { timeout: 1000 });
                }.bind(this);
              });

              //invoke promises sequentially and resolve first success result
              //return resolved promise on success
              //invoke next promise on fail
              return promises
                .reduce(function(prev, itm){
                  return prev.then(prev).catch(itm);
                }, promises[0]());
            });
      }

    };
  });
