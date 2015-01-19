'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:SplashCtrl
 * @description
 * # SplashCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('SplashController', function ($scope, $sce, $location,information,pollView) {
    $scope.msg = $sce.trustAsHtml( information.msg.text );
    $scope.go = function(path, view) {
    	pollView.view = view;
	  	$location.path(path);
		};

});