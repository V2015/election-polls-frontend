'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('MainController', function ($scope,pollData,partyData,pollService,pollView) {
  	$scope.pollData = pollService.addAveragePoll(pollData);
  	$scope.selectedPoll = $scope.pollData[0];
    if (pollView == undefined) {
      $scope.pollView = "bar";
    } else {
      $scope.pollView = pollView.view;
    }
  	$scope.partyData = partyData;
  	
  	$scope.pieData = [];

  	$scope.$watch("selectedPoll",function(poll) {
  		$scope.pieData = pollService.getPieData(poll);
  	});

    $scope.selectPoll = function(poll) {
      $scope.selectedPoll = poll;
    }

	  $scope.partyName = function(p_id) {
	  	return _.findWhere($scope.partyData, {id: p_id}).name;
	  }; 

    $scope.partyColor = function(p_id) {
      return _.findWhere($scope.partyData, {id: p_id}).color;
    }

	  $scope.partyImage = function(p_id) {
	  	return _.findWhere($scope.partyData, {id: p_id}).image;
	  }; 

	  $scope.navigateToPartyPage = function (party_id) {
      alert(party_id);
    }; 

    $scope.togglePollView = function() {
      if ($scope.pollView == 'bar') {
        $scope.pollView = 'pie';
      } else {
        $scope.pollView = 'bar';
      }
    };

    $scope.shareOnFacebook = function() {
      FB.ui({
        method: 'share',
        href: window.location.href,
      },function(response) {});
    }

	});