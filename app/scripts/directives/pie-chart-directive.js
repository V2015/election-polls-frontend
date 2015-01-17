'use strict';

angular.module('electionPollsApp')
  .directive('pieChart', [function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        scope.$watch('pieData',function(data){

          var names = {}
          _.map(data, function(slice) {
            names[slice.chunk] = slice.heb
          });
          
          var chart = c3.generate({
            bindto: '#pie-chart-container',
            data: {
              columns: _.map(data,function(slice){
                return [slice.chunk,slice.mandates]
              }),
              type : 'donut',
              colors: {
                "left": '#1f3a93',
                "right": '#96281b',
                "center": '#8e44ad',
                "religious": '#d35400',
                "arabs": '#26a65b'
              },
              names: names
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