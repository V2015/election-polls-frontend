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
    'ngResource',
    'ngRoute',
    // 'ngTouch',
    'restangular',
    'd3'
  ])
  .factory('superCache', ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('super-cache');
  }])
  .config(function ($routeProvider,RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/splash.html',
        controller: 'SplashController',
        resolve: {
          information: function(Restangular) {
            return {
              "msg": {
                "title": "גוש השמאל מתחזק",
                "text":  "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
              }
            };
          }
        }
      })
      .when('/parties', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        resolve: {
          pollData: function(Restangular){
            return Restangular.all('polls.json').getList().then(function (data) {
                    return data;
                  }, function () {
                    return []; // failure
                  });
          },
          partyData: function(Restangular){
            return Restangular.all('parties.json').getList().then(function (data) {
              return data;
            }, function () {
              return []; // failure
            });
          }
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/parties/:id', {
        templateUrl: 'views/party.html',
        controller: 'PartyController',
        resolve: {
          partyResults: function(Restangular,$route){
            return Restangular.service('parties').one($route.current.params.id+'.json').get().then(function (data) {
              return data;
            }, function () {
              return []; // failure
            });
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
      // For dev (if you have the election-polls-backend running)
      //RestangularProvider.setBaseUrl('http://localhost:3000');
      // For production
      RestangularProvider.setBaseUrl('https://v15electionpolls.herokuapp.com');
      RestangularProvider.setDefaultHttpFields({cache: true});
  });
