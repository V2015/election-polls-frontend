'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('MainCtrl', function ($scope,pollService) {
  	// Init
  	$scope.allPolls = [];

  	pollService.getPolls().then(function(polls) {
		  $scope.allPolls = pollService.addAveragePoll(polls);
		  $scope.selectedPoll = $scope.allPolls[0];
		});

  	
  });
