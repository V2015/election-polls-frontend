'use strict';

angular.module('electionPollsApp')
.service('pollService', [function(){
	var right = [14,15,16,19];
	var center = [17,18];
	var religious = [20,21];
	var left = [22,23];
	var arabs = [24,25,26];

	this.addAveragePoll = function(polls) {
		var averagePoll = {
			source: "ממוצע 7 סקרים אחרונים",
			results: this.averageResults(polls.slice(0,7))
		}
		polls.unshift(averagePoll);
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
		return _.sortBy(_.map(averageHash,function(party) {
			return { 
				party_id: party.party_id,
				mandates: parseInt(party.mandates / len)
			}
		}),function(r) {
			return r.mandates;
		}).reverse();
	};

	this.getPieData = function(poll) {
		var pieData = [
			{ chunk: "right", mandates: 0 },
			{ chunk: "center", mandates: 0 },
			{ chunk: "religious", mandates: 0 },
			{ chunk: "left", mandates: 0 },
			{ chunk: "arabs", mandates: 0 }
		];

		_.each(poll.results, function(r){
			if(_.contains(right,parseInt(r.party_id))) {
				pieData[0].mandates += r.mandates;
			}
			if(_.contains(center,parseInt(r.party_id))) {
				pieData[1].mandates += r.mandates;
			}
			if(_.contains(religious,parseInt(r.party_id))) {
				pieData[2].mandates += r.mandates;
			}
			if(_.contains(left,parseInt(r.party_id))) {
				pieData[3].mandates += r.mandates;
			}
			if(_.contains(arabs,parseInt(r.party_id))) {
				pieData[4].mandates += r.mandates;
			}
		});

		return pieData;
	}
}]);