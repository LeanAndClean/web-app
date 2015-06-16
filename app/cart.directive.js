angular
  .module('cart', ['ngSDK'])
  .service('cartService', function($window, http){
    var cartId = $window.localStorage['web-app-cart-id'] || '';
    var cart = {};
    
    http = http({
      discovery: { servers: ['http://46.101.191.124:8500']}
    });

    return {
      find: find,
      add: add,
      remove: remove,
      cartId: function(){ return cartId; },
      cart: function(){ return cart; }
    };

    function add(item){
      cart.orders.push(item);

      return http
        .post('order-service', '/cart/' + cartId, cart.orders)
        .then(function(result){
          cartId = result.data.id;
          $window.localStorage['web-app-cart-id'] = cartId;
          return cartId;
        })
        .then(find);
    }

    function remove(item){
      item.removed = true;
      cart.orders.push(item);

      return http
        .post('order-service', '/cart/' + cartId, cart.orders)
        .then(function(result){
          cartId = result.data.id;
          $window.localStorage['web-app-cart-id'] = cartId;          
          return cartId;
        })
        .then(find);
    }

    function find(){
      var url = '/cart/' + cartId;
      return http
        .get('order-service', url)
        .then(function(result){
          cart = result.data;
          return cart;
        });
    }
  })  
  .directive('cart', function () {
    return {
      restrict: 'E',
      templateUrl: 'cart.tpl.html',
      controller: function ($scope, cartService) {
        $scope.cart = cartService.cart;
        $scope.removeFromCart = cartService.remove;
        cartService.find();
      }
    };
  });