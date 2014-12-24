'use strict';

angular.module('electionPollsApp')
.service('pollService', [function(){
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

	// this.getResultsByParty = function(party_id) {
	// 	var results = [];
	// 	_.each(dataService.pollData,function(poll) {
	// 		results.push({
	// 			date: poll.date,
	// 			mandates: getPartyMandates(poll,party_id)
	// 		})
	// 	});
	// 	return results;
	// };

	function getPartyMandates(poll,party_id) {
		var result = _.findWhere(poll.results,{party_id: party_id})
		return result.mandates;
	}
}]);