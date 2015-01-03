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
      .when('/guess', {
        templateUrl: 'views/guess.html',
        controller: 'GuessController',
        resolve: {
          partyData: function(Restangular){
            return Restangular.all('parties.json').getList().then(function (data) {
              return data;
            }, function () {
              return []; // failure
            });
          }
        }
      })
      .when('/contact', {
        templateUrl: 'views/contact.html'
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
  });
