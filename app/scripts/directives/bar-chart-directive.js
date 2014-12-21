'use strict';

angular.module('electionPollsApp')
  .directive('simpleLineChart', ['d3Service','$location','$rootScope', function(d3Service,$location,$rootScope) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var margin = {top: 20, right: 20, bottom: 70, left: 40},
          width = 600 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;
          
          scope.$watch('selectedPoll.results', function (pollResults, oldVal) {
            if(pollResults) {
              // Remove existing chart
              $('#main-chart-container').html('');

              var svg = d3.select("#main-chart-container").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              var x = d3.scale.ordinal()
                        .domain(_.map(pollResults, function(p) {
                          return scope.partyName(p.party_id); 
                        }))
                        .rangeRoundBands([0, width], 0.55);

              var y = d3.scale.linear()
                        .domain([
                          _.min(_.pluck(pollResults, "mandates")),
                          _.max(_.pluck(pollResults, "mandates"))
                        ])
                        .range([height, 0]);

              var xAxis = d3.svg.axis().scale(x).orient("bottom");

              var yAxis = d3.svg.axis().scale(y).orient("left");
              
              svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
                // Text wrapping for labels
                // .selectAll(".tick text")
                // .call(wrap, x.rangeBand());


              var ticks = svg.select(".axis.x").selectAll(".tick")
                .data(pollResults)
                .append("svg:image")
                .attr("xlink:href", function(d) { return "data:image/png;base64,"+scope.partyImage(d.party_id) })
                .attr("width", 32)
                .attr("height", 32)
                .attr("x", -20)
                .attr("y", 20);

              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)

              svg.selectAll("bar")
                .data(pollResults)
                .enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", function(d) { return x(scope.partyName(d.party_id)); })
                .attr("width", "20px")
                .attr("y", function(d) { return y(d.mandates); })
                .attr("height", function(d) { return height - y(d.mandates); })
                .on("click",function(d) { navigateToParyPage(d.party_id) });
              } 
          });

          function navigateToParyPage(party_id) {
            $rootScope.$apply(function() {
              $location.path("/parties/"+party_id);
            });
          }
        }); // End of d3Service.d3()
        // Text Wrapping for labels
        // function wrap(text, width) {
        //   text.each(function() {
        //     var text = d3.select(this),
        //         words = text.text().split(/\s+/).reverse(),
        //         word,
        //         line = [],
        //         lineNumber = 0,
        //         lineHeight = 1.1, // ems
        //         y = text.attr("y"),
        //         dy = parseFloat(text.attr("dy")),
        //         tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        //     while (word = words.pop()) {
        //       line.push(word);
        //       tspan.text(line.join(" "));
        //       if (tspan.node().getComputedTextLength() > width) {
        //         line.pop();
        //         tspan.text(line.join(" "));
        //         line = [word];
        //         tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        //       }
        //     }
        //   });
        // }
      }
    };
    }]);