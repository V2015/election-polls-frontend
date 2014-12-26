'use strict';

angular.module('electionPollsApp')
  .directive('pieChart', ['d3Service','$rootScope', function(d3Service,$rootScope) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var width = 960,
              height = 500,
              radius = Math.min(width, height) / 2;
          var color = d3.scale.ordinal()
                        .range(["#98abc5", "#8a89a6", "#7b6888","#6b486b", "#a05d56"]);

          var arc = d3.svg.arc()
                      .outerRadius(radius - 10)
                      .innerRadius(0);

          var pie = d3.layout.pie()
                      .sort(null)
                      .value(function(d) { return d.mandates; });


          scope.$watch('pieData', function (pieData, oldVal) {
            if(pieData) {
              // Remove existing chart
              $('#pie-chart-container').html('');

              var svg = d3.select("#pie-chart-container").append("svg")
                          .attr("width", width)
                          .attr("height", height)
                        .append("g")
                          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

              var g = svg.selectAll(".arc")
                        .data(pie(pieData))
                      .enter().append("g")
                        .attr("class", "arc");

              g.append("path")
                  .attr("d", arc)
                  .style("fill", function(d) { return color(d.data.chunk); });

              g.append("text")
                  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                  .attr("dy", ".35em")
                  .style("text-anchor", "middle")
                  .text(function(d) { return d.data.chunk+ "("+d.data.mandates+")"; });
              } 
          });
        }); // End of d3Service.d3()
      }
    };
  }]);