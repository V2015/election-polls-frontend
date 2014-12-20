'use strict';

angular.module('electionPollsApp')
  .directive('simpleLineChart', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {
        data: "="
      },
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var margin = {top: 20, right: 20, bottom: 70, left: 40},
          width = 600 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;
          
          scope.$watch('data', function (newVal, oldVal) {
            if(newVal) {
              // Remove existing chart
              $('#main-chart-container').html('');

              var svg = d3.select("#main-chart-container").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              var x = d3.scale.linear()
                        .domain([
                          _.min(_.pluck(newVal, "party_id")),
                          _.max(_.pluck(newVal, "party_id"))
                        ])
                        .range([0, width]);

              var y = d3.scale.linear()
                        .domain([
                          _.min(_.pluck(newVal, "mandates")),
                          _.max(_.pluck(newVal, "mandates"))
                        ])
                        .range([height, 0]);

              var xAxis = d3.svg.axis().scale(x).orient("bottom")

              var yAxis = d3.svg.axis().scale(y).orient("left")
              
              svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)

              svg.selectAll("bar")
                .data(newVal)
                .enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", function(d) { return x(d.party_id); })
                .attr("width", "5px")
                .attr("y", function(d) { return y(d.mandates); })
                .attr("height", function(d) { return height - y(d.mandates); });
              } 
          });
        }); // End of d3Service.d3()
      }};
    }]);