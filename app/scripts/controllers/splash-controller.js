'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:SplashCtrl
 * @description
 * # SplashCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('SplashController', function ($scope,$location,information) {
    $scope.isSplash = true;
    $scope.msg = information.msg;
    $scope.go = function(path, view) {
      $scope.pollView = view;
	  $location.path(path);
	};

});