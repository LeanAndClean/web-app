angular
  .module('search', ['lcSDK'])
  .service('searchService', function(lcServiceClient){
    var items = [];
    var http = lcServiceClient({ 
      discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500'],
      servicesRefreshInterval: 30000
    });

    return {
      find: find,
      items: function(){
        return items;
      }
    };

    function find(number){
      number = number || 10;
      return http
        .get('search-service', '/?number=' + number)
        .then(function(result){
          items = result.data;
          return items;
        });
    }
  })
  .directive('search', function () {
    return {
      restrict: 'E',
      templateUrl: 'search.tpl.html',
      controller: function ($scope, searchService, cartService) {
        $scope.items = searchService.items;
        $scope.addToCart = cartService.add;
        $scope.find = searchService.find;
        
        searchService.find();
      }
    };
  });