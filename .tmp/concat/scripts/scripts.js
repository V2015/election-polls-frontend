'use strict';

/**
 * @ngdoc overview
 * @name electionPollsApp
 * @description
 * # electionPollsApp
 *
 * Main module of the application.
 */
angular
  .module('electionPollsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular',
    'd3'
  ])
  .config(["$routeProvider", "RestangularProvider", function ($routeProvider,RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        resolve: {
          pollData: ["Restangular", function(Restangular){
            return Restangular.all('polls.json').getList().then(function (data) {
              return data;
            }, function () {
              return []; // failure
            });
          }],
          partyData: ["Restangular", function(Restangular){
            return Restangular.all('parties.json').getList().then(function (data) {
              return data;
            }, function () {
              return []; // failure
            });
          }]
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/parties/:id', {
        templateUrl: 'views/party.html',
        controller: 'PartyController',
        resolve: {
          partyResults: ["Restangular", "$route", function(Restangular,$route){
            return Restangular.service('parties').one($route.current.params.id+'.json').get().then(function (data) {
              return data;
            }, function () {
              return []; // failure
            });
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
      // For dev (if you have the election-polls-backend running)
      //RestangularProvider.setBaseUrl('http://localhost:3000');
      // For production
      RestangularProvider.setBaseUrl('https://v15electionpolls.herokuapp.com');
  }]);

'use strict';

angular.module('d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope', function($document, $q, $rootScope) {
    var d = $q.defer();
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function() { d.resolve(window.d3); });
    }
    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'bower_components/d3/d3.js';
    scriptTag.onreadystatechange = function () {
    if (this.readyState === 'complete') { onScriptLoad(); }
  };
  scriptTag.onload = onScriptLoad;

  var s = $document[0].getElementsByTagName('body')[0];
  s.appendChild(scriptTag);

  return {
    d3: function() { return d.promise; }
  };
}]);
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
'use strict';

angular.module('electionPollsApp')
  .directive('simpleLineChart', ['d3Service','$location','$rootScope', function(d3Service,$location,$rootScope) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var margin = {top: 20, right: 20, bottom: 70, left: 40},
          width = 600 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;
          
          scope.$watch('selectedPoll.results', function (pollResults, oldVal) {
            if(pollResults) {
              // Remove existing chart
              $('#main-chart-container').html('');

              var svg = d3.select("#main-chart-container").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              var x = d3.scale.ordinal()
                        .domain(_.map(pollResults, function(p) {
                          return scope.partyName(p.party_id); 
                        }))
                        .rangeRoundBands([0, width], 0.55);

              var y = d3.scale.linear()
                        .domain([
                          _.min(_.pluck(pollResults, "mandates")),
                          _.max(_.pluck(pollResults, "mandates"))
                        ])
                        .range([height, 0]);

              var xAxis = d3.svg.axis().scale(x).orient("bottom");

              var yAxis = d3.svg.axis().scale(y).orient("left");
              
              svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
                // Text wrapping for labels
                // .selectAll(".tick text")
                // .call(wrap, x.rangeBand());


              var ticks = svg.select(".axis.x").selectAll(".tick")
                .data(pollResults)
                .append("svg:image")
                .attr("xlink:href", function(d) { return "data:image/png;base64,"+scope.partyImage(d.party_id) })
                .attr("width", 32)
                .attr("height", 32)
                .attr("x", -20)
                .attr("y", 20);

              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)

              svg.selectAll("bar")
                .data(pollResults)
                .enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", function(d) { return x(scope.partyName(d.party_id)); })
                .attr("width", "20px")
                .attr("y", function(d) { return y(d.mandates); })
                .attr("height", function(d) { return height - y(d.mandates); })
                .on("click",function(d) { navigateToParyPage(d.party_id) });
              } 
          });

          function navigateToParyPage(party_id) {
            $rootScope.$apply(function() {
              $location.path("/parties/"+party_id);
            });
          }
        }); // End of d3Service.d3()
        // Text Wrapping for labels
        // function wrap(text, width) {
        //   text.each(function() {
        //     var text = d3.select(this),
        //         words = text.text().split(/\s+/).reverse(),
        //         word,
        //         line = [],
        //         lineNumber = 0,
        //         lineHeight = 1.1, // ems
        //         y = text.attr("y"),
        //         dy = parseFloat(text.attr("dy")),
        //         tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        //     while (word = words.pop()) {
        //       line.push(word);
        //       tspan.text(line.join(" "));
        //       if (tspan.node().getComputedTextLength() > width) {
        //         line.pop();
        //         tspan.text(line.join(" "));
        //         line = [word];
        //         tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        //       }
        //     }
        //   });
        // }
      }
    };
    }]);
'use strict';

angular.module('electionPollsApp')
  .directive('partyBarChart', ['d3Service','$location','$rootScope', function(d3Service,$location,$rootScope) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var margin = {top: 20, right: 20, bottom: 70, left: 40},
          width = 600 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

          var parseDate = d3.time.format("%Y-%m-%d").parse;
          
          scope.$watch('results', function (pollResults, oldVal) {
            if(pollResults) {
              // Remove existing chart
              $('#party-chart-container').html('');

              var svg = d3.select("#party-chart-container").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              var x = d3.scale.ordinal().rangeRoundBands([0, width], .05)
                        .domain(pollResults.map(function(d) { return parseDate(d.date); }));

              var y = d3.scale.linear()
                        .domain([
                          0,
                          _.max(_.pluck(pollResults, "mandates"))
                        ])
                        .range([height, 0]);

              var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format("%Y-%m-%d"));;

              var yAxis = d3.svg.axis().scale(y).orient("left");
              
              svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)

              svg.selectAll("bar")
                .data(pollResults)
                .enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", function(d) { return x(parseDate(d.date)); })
                .attr("width", "20px")
                .attr("y", function(d) { return y(d.mandates); })
                .attr("height", function(d) { return height - y(d.mandates); })
              } 
          });

        }); // End of d3Service.d3()
      }
    };
    }]);
'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('MainController', ["$scope", "pollData", "partyData", "pollService", "$route", function ($scope,pollData,partyData,pollService,$route) {
  	$scope.pollData = pollService.addAveragePoll(pollData);
  	$scope.selectedPoll = $scope.pollData[0];
  	$scope.partyData = partyData

	  $scope.partyName = function(p_id) {
	  	return _.findWhere($scope.partyData, {id: p_id}).name;
	  }; 

	  $scope.partyImage = function(p_id) {
	  	return _.findWhere($scope.partyData, {id: p_id}).image;
	  }; 

	  $scope.navigateToPartyPage = function (party_id) {
      alert(party_id);
    };  	
	}]);
'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('PartyController', ["$scope", "partyResults", function ($scope,partyResults) {
  	$scope.partyResults = partyResults;
	}]);
'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('AboutCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
