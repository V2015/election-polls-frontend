'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('GuessController', function ($scope,partyData) {
  	$scope.partyData = partyData;
  	$scope.guess = [];
  	initGuess();
  	$scope.getRemaining = function () {
  		return 120 - _.reduce($scope.guess, function(sum, el) {
			  return sum + parseInt(el.mandates);
			}, 0);
  	}

  	function initGuess() {
  		_.each(partyData,function(party) {
  			$scope.guess.push({
  				name: party.name,
  				mandates: 0
  			})
  		})
  	}
	});