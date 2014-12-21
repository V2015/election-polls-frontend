'use strict';

angular.module('electionPollsApp')
.service('dataService', ['Restangular','$rootScope', function(Restangular,$rootScope){
	var self = this;
	var polls = Restangular.all('polls.json');
	var parties = Restangular.all('parties.json');
	this.pollData = null;
	this.partyData = null;

	this.getData = function() {
		this.getParties();
		this.getPolls();
	};

	this.getPolls = function() {
		return polls.getList().then(function(data){
      self.pollData = data;
      notifyObservers("getPolls");
		});
	};

	this.getParties = function() {
		return parties.getList().then(function(data){
      self.partyData = data;
      notifyObservers("getParties");
		});
	};

	var observerCallbacks = {};

  //register an observer
  this.registerObserverCallback = function(observer,callback){
    observerCallbacks[observer] = callback;
  };

  //call this when you know 'foo' has been changed
  var notifyObservers = function(observer){
    // angular.forEach(observerCallbacks, function(callback){
    //   callback();
    // });
		observerCallbacks[observer]();
  };
}]);