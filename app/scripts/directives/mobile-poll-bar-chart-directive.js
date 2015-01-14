'use strict';

angular.module('electionPollsApp')
  .directive('mobilePollBarChart', ['$rootScope','$location','d3Service', function($rootScope,$location,d3Service) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          scope.$watch('selectedPoll', function (poll) {

            var chart = c3.generate({
                bindto: '#main-chart-container-mobile',
                data: {
                  columns: [
                    [poll.source].concat(_.map(poll.results,"mandates"))
                  ],
                  type: 'bar',
                  onclick: function (e) {
                    var p_id = poll.results[e.index].party_id
                    navigateToPartyPage(p_id);
                  },
                  color: function (color, d) {
                    if(d.id) {
                      return scope.partyColor(poll.results[d.index].party_id);
                    }
                  },
                  labels: true
                },
                bar: {
                  width: {
                    ratio: 0.8 // this makes bar width 50% of length between ticks
                  }
                },
                tooltip: {
                  show: false
                },
                axis: {
                  rotated: true,
                  x: {
                    type: 'category',
                    categories: _.map(poll.results,function(r){
                      return scope.partyName(r.party_id);
                    })
                  },
                  y: {
                    show: false,
                    // min: 0,
                    // max: 30
                  }
                },
                // grid: {
                //   y: {
                //     show: true
                //   }
                // },
                legend: {
                  show: false
                },
                padding: {
                  left: 100, // enlarged for better display of categories
                  right: 30,
                  top: 30
                },
                // onresized: repositionLabels
            });
            
            // setTimeout(function() {
            //   repositionLabels();
            // },400);
          }); 
        });

        function navigateToPartyPage(party_id) {
          $rootScope.$apply(function() {
            $location.path("/parties/"+party_id);
          });
        }

        // var repositionLabels = function() {
        //   setTimeout(function(){
        //     d3.selectAll('.c3-text').attr('y',250);
        //   },0) 
        // }
      }
    };
  }]);