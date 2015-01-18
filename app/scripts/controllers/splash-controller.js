'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:SplashCtrl
 * @description
 * # SplashCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('SplashController', function ($scope,$location,information,pollView) {
    $scope.msg = information.msg;
    $scope.go = function(path, view) {
    	pollView.view = view;
	  	$location.path(path);
		};

});