angular
  .module('search', ['ngSDK'])
  .service('searchService', function(http){
    var items = [];
    http = http({
      discovery: { servers: ['http://46.101.191.124:8500'] }
    });

    return {
      find: find,
      items: function(){
        return items;
      }
    };

    function find(){
      return http
        .get('search-service', '/')
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
      controller: function ($scope, searchService, cardService) {
        $scope.items = searchService.items;
        $scope.addToCard = cardService.add;
        searchService.find();
      }
    };
  });