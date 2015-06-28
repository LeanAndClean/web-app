angular
  .module('cart', ['lcSDK'])
  .service('cartService', function($window, lcServiceClient){
    var http = lcServiceClient({ 
      discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500'],
      servicesRefreshInterval: 30000
    });
    var cartId = $window.localStorage['web-app-cart-id'] || '';
    var cart = undefined;    
    
    return {
      find: find,
      add: add,
      remove: remove,
      close: close,
      cartId: function(){ return cartId; },
      cart: function(){ return cart; }
    };

    function add(item){
      cart.orders.push(item);

      return http
        .post('cart-service', '/cart/' + cartId, cart.orders)
        .then(function(result){
          cart = result.data.cart;
          cartId = result.data.cart.cartId;
          $window.localStorage['web-app-cart-id'] = cartId;
          return cart;
        });
    }

    function remove(item){
      item.removed = true;
      return add(item);
    }

    function find(){
      var url = '/cart/' + cartId;
      return http
        .get('cart-service', url)
        .then(function(result){
          cart = result.data;
          return cart;
        })
        .catch(function(){
          if(!cart) {
            cart = {
              cartId: undefined,
              orders: []
            };
          }
          return cart;
        });
    }

    function close(){
      return http
        .post('cart-service', '/cart/' + cartId + '/close', {})
        .then(function(){
          cart = undefined;
        })
        .then(find);
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