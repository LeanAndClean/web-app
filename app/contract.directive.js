angular
  .module('contract', ['ngSDK'])
  .service('contractService', function($window, http, cardService){
    var contract = undefined;

    http = http({
      discovery: { servers: ['http://46.101.191.124:8500'] }
    });

    return {
      find: find,
      add: add,
      contract: function(){ return contract; }
    };

    function add(customer){
      var contract = {
        customer: customer,
        card: cardService.card().card
      };
      var cardId = cardService.cardId();

      return http
        .post('contract-service', '/contracts/' + cardId, contract)
        .then(function(result){
          
          if(!result.data.contract) throw new Error(result.data.message);

          if(result.data.contract) contract = result.data.contract;
          return contract.contractId;
        })
        .then(find)
        .catch(function(error){
          alert(error.message)
        });
    }

    function find(cardId){
      var url = '/contracts/' + cardId;
      return http
        .get('contract-service', url)
        .then(function(result){
          contract = result.data;
          return contract;
        });
    }
  })  
  .directive('contract', function () {
    return {
      restrict: 'E',
      templateUrl: 'contract.tpl.html',
      controller: function ($scope, contractService) {                
        $scope.contract = contractService.contract;
        $scope.pay = contractService.add;
      }
    };
  });