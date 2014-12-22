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