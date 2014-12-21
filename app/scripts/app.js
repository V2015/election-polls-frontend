'use strict';

/**
 * @ngdoc overview
 * @name electionPollsApp
 * @description
 * # electionPollsApp
 *
 * Main module of the application.
 */
angular
  .module('electionPollsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular',
    'd3'
  ])
  .config(function ($routeProvider,RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      RestangularProvider.setBaseUrl('https://v15electionpolls.herokuapp.com');
  })
  .run(['dataService', function(dataService){
    dataService.getData();
  }]);
