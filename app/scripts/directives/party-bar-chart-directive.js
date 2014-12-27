'use strict';

angular.module('electionPollsApp')
  .directive('partyBarChart', [function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var data = _.sortBy(scope.partyResults.results.slice(0,10), function(r) {
          return Date.parse(r.poll.date);
        });
        var chart = c3.generate({
            bindto: '#party-chart-container',
            data: {
              columns: [
                [scope.partyResults.name].concat(_.map(data,"mandates"))
              ],
              type: 'bar'
            },
            bar: {
              width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
              }
            },
            axis: {
              x: {
                type: 'category',
                categories: _.map(data,function(r){
                  return r.poll.date + "("+r.poll.source+")";
                })
              }
            }
        });
      }
    };
  }]);