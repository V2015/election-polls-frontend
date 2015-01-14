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
                axis: {
                  rotated: true,
                  x: {
                    type: 'category',
                    categories: _.map(poll.results,function(r){
                      return scope.partyName(r.party_id);
                    }),
                    tick: {
                      fit: true,
                      multiline: true
                    }
                  },
                  y: {
                    show: false,
                    // min: 0,
                    // max: 30
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
                padding: {
                  left: 20,
                  right: 20,
                  top: 30
                },
                onresized: function() {
                  setTimeout(function(){
                    handleResize(poll);
                  },500);
                }
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

        var handleResize = function(poll) {
          
          $rootScope.$apply(function(){
              d3.selectAll('.c3-axis-x line,.domain').remove();
            var chart = $('#main-chart-container-mobile .c3-chart:first')
            chart.find('.c3-party-names').remove();
            chart.append($("<g class='c3-party-names'></g>"));
            var partyNames = $('.c3-party-names');
            _.each(poll.results,function(r,i) {
              var c3TextClone = $('#main-chart-container-mobile .c3-text-'+i).clone();
              c3TextClone.html("testing");
              partyNames.append(c3TextClone);
            });  
          });

           
        }
      }
    };
  }]);