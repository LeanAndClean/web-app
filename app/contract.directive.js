angular
  .module('contract', ['lcSDK'])
  .service('contractService', function($window, $q, lcServiceClient, cartService){
    var contract = undefined;

    var http = lcServiceClient({ discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500'] });

    return {
      find: find,
      add: add,
      close: close,
      contract: function(){ return contract; }
    };

    function add(customer){
      var newContract = {
        customer: customer,
        cart: cartService.cart().cart
      };
      var cartId = cartService.cartId();

      return http
        .post('contract-service', '/contracts/' + cartId, newContract)
        .then(function(result){
          
          if(!result.data.contract) throw new Error(result.data.message);

          if(result.data.contract) contract = result.data.contract;
          return contract.contractId;
        })        
        .then(find)
        .then(cartService.close)
        .catch(function(error){
          alert(error.message)
        });
    }

    function find(cartId){
      var url = '/contracts/' + cartId;
      return http
        .get('contract-service', url)
        .then(function(result){
          contract = result.data;
          return contract;
        });
    }

    function close(){
      return $q.when(contract = undefined);
    }
  })  
  .directive('contract', function () {
    return {
      restrict: 'E',
      templateUrl: 'contract.tpl.html',
      controller: function ($scope, contractService) {                
        $scope.contract = contractService.contract;
        $scope.pay = contractService.add;
        $scope.close = contractService.close;
      }
    };
  });