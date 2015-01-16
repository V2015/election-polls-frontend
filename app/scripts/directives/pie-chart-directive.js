'use strict';

angular.module('electionPollsApp')
  .directive('pieChart', [function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        scope.$watch('pieData',function(data){
          var chart = c3.generate({
            bindto: '#pie-chart-container',
            data: {
              columns: _.map(data,function(slice){
                return [slice.chunk,slice.mandates]
              }),
              type : 'donut',
              colors: {
                "שמאל": '#1f3a93',
                "ימין": '#96281b',
                "מרכז": '#8e44ad',
                "חרדים": '#d35400',
                "ערבים": '#26a65b'
              }
            },
            donut: {
              label: {
                format: function(value, ratio, id) {
                  return value;
                }
              }
            },
            tooltip: {
              show: false
            },
            legend: {
              position: 'right'
            }
          });
        });
      }
    };
  }]);