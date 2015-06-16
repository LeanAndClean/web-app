(function(angular){

  'use strict';
  angular
    .module('app',['ngRoute','cart','search','contract'])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'main.tpl.html'
        })
        .when('/checkout', {
          templateUrl: 'checkout.tpl.html'
        })        
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    });

}(angular));