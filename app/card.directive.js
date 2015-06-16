angular
  .module('card', ['ngSDK'])
  .service('cardService', function($window, http){
    var cardId = $window.localStorage['web-app-card-id'] || '';
    var card = {};
    
    http = http({
      discovery: { servers: ['http://46.101.191.124:8500']}
    });

    return {
      find: find,
      add: add,
      remove: remove,
      cardId: function(){ return cardId; },
      card: function(){ return card; }
    };

    function add(item){
      card.orders.push(item);

      return http
        .post('order-service', '/card/' + cardId, card.orders)
        .then(function(result){
          cardId = result.data.id;
          $window.localStorage['web-app-card-id'] = cardId;
          return cardId;
        })
        .then(find);
    }

    function remove(item){
      item.removed = true;
      card.orders.push(item);

      return http
        .post('order-service', '/card/' + cardId, card.orders)
        .then(function(result){
          cardId = result.data.id;
          $window.localStorage['web-app-card-id'] = cardId;          
          return cardId;
        })
        .then(find);
    }

    function find(){
      var url = '/card/' + cardId;
      return http
        .get('order-service', url)
        .then(function(result){
          card = result.data;
          return card;
        });
    }
  })  
  .directive('card', function () {
    return {
      restrict: 'E',
      templateUrl: 'card.tpl.html',
      controller: function ($scope, cardService) {
        $scope.card = cardService.card;
        $scope.removeFromCard = cardService.remove;
        cardService.find();
      }
    };
  });