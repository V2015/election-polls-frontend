'use strict';

angular.module('electionPollsApp')
  .directive('pollBarChart', ['$rootScope','$location', function($rootScope,$location) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        scope.$watch('selectedPoll', function (poll) {
          var chart = c3.generate({
              bindto: '#main-chart-container',
              data: {
                columns: [
                  [poll.source].concat(_.map(poll.results,"mandates"))
                ],
                type: 'bar',
                onclick: function (e) {
                  var p_id = poll.results[e.index].party_id
                  navigateToPartyPage(p_id);
                },
              },
              bar: {
                width: {
                  ratio: 0.5 // this makes bar width 50% of length between ticks
                }
              },
              axis: {
                x: {
                  type: 'category',
                  categories: _.map(poll.results,function(r){
                    return scope.partyName(r.party_id);
                  })
                }
              }
          });
        }); 

        function navigateToPartyPage(party_id) {
          $rootScope.$apply(function() {
            $location.path("/parties/"+party_id);
          });
        }
      }
    };
  }]);