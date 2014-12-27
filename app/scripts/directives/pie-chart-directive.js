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
              type : 'pie'
            }
          });
        });
      }
    };
  }]);