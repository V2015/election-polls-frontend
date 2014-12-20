'use strict';

angular.module('electionPollsApp')
.service('pollService', ['Restangular', function(Restangular){
	var polls = Restangular.all('polls.json');

	this.getPolls = function() {
		return polls.getList();
	};

	this.addAveragePoll = function(polls) {
		var averagePoll = {
			source: "ממוצע",
			results: this.averageResults(polls)
		}
		polls.push(averagePoll);
		return polls;
	};

	this.averageResults = function(polls) {
		var averageHash = {};
		_.each(polls,function(poll) {
			_.each(poll.results,function(result){
				if(_.isUndefined(averageHash[result.party_id])){
					averageHash[result.party_id] = {
						party_id: result.party_id,
						mandates: 0
					};
				}
				averageHash[result.party_id].mandates += result.mandates;
			});
		});
		var len = polls.length;
		return _.map(averageHash,function(party) {
			return { 
				party_id: party.party_id,
				mandates: party.mandates / len
			}
		})
	};
}]);