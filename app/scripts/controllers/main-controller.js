'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('MainController', function ($scope,dataService,pollService) {
  	var updatePollData = function(){
	    $scope.pollData = pollService.addAveragePoll(dataService.pollData);
	  	$scope.selectedPoll = $scope.pollData[0];
	  };

	  var updatePartyData = function() {
	  	$scope.partyData = dataService.partyData;
	  };

	  $scope.partyName = function(p_id) {
	  	return _.findWhere($scope.partyData, {id: p_id}).name;
	  }; 

	  $scope.partyImage = function(p_id) {
	  	return _.findWhere($scope.partyData, {id: p_id}).image;
	  }; 

	  $scope.navigateToPartyPage = function (party_id) {
      alert(party_id);
    };

  	dataService.registerObserverCallback("getPolls",updatePollData);
  	dataService.registerObserverCallback("getParties",updatePartyData);

  	
	});