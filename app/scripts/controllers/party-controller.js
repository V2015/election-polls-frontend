'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('PartyController', function ($scope,$routeParams,pollService,dataService) {
  	$scope.partyId = parseInt($routeParams.partyId);
  	var updatePollData = function(){
	    $scope.results = pollService.getResultsByParty($scope.partyId);
	  };
	  // poll data is already loaded
	  if(dataService.pollData) {
	  	updatePollData();

	  }
	  // poll data isn't loaded yet 
	  else {
	  	dataService.registerObserverCallback("getPolls",updatePollData);
	  }
  	
	});