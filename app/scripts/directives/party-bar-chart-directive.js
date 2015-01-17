'use strict';

angular.module('electionPollsApp')
  .directive('partyBarChart', ['d3Service',function(d3Service) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var data = _.sortBy(scope.partyResults.results.slice(0,10), function(r) {
            return Date.parse(r.poll.date);
          });
          var chart = c3.generate({
              bindto: '#party-chart-container',
              data: {
                columns: [
                  [scope.partyResults.name].concat(_.map(data,"mandates"))
                ],
                type: 'bar',
                color: function (color, d) { return scope.partyResults.color; },
                labels: true
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
                    // helper
                    function pad(num,size){var s = num+"";while(s.length<size)s="0"+s;return s;}
                    var dt = new Date(r.poll.date),
                        d = dt.getDate(), m = dt.getMonth() + 1;
                    return pad(d,2)+"/"+m;
                  })
                },
                y: {
                  show: false,
                }
              },
              grid: {
                y: {
                  show: true
                }
              },
              legend: {
                show: false
              },
              tooltip: {
                show: false
              },
              padding: {
                left: 10,
                right: 10,
                top: 30,
                bottom: 50
              },
              onresized: repositionLabels
          });
          
          setTimeout(function() {
              repositionLabels();
            },400);
        });

        var repositionLabels = function() {
          setTimeout(function(){
            d3.selectAll('#party-chart-container .c3-text').attr('y',190);
          },0) 
        }
      }
    };
  }]);