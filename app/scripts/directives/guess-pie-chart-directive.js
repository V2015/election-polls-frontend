'use strict';

angular.module('electionPollsApp')
  .directive('guessPieChart', [function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        scope.$watch('guess',function(data){
          var chart = c3.generate({
            bindto: '#guess-chart-container',
            data: {
              columns: _.map(data,function(party){
                return [party.name,parseInt(party.mandates)]
              }).concat([["Remaining",scope.getRemaining()]]),
              type : 'pie'
            }
          });
        },true);
      }
    };
  }]);