'use strict';

angular.module('electionPollsApp')
  .directive('partyBarChart', ['d3Service','$location','$rootScope', function(d3Service,$location,$rootScope) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          // Resposive chart: update size on widow resize
          d3.select(window).on('resize', resize); 
          var margin = {top: 20, right: 20, bottom: 70, left: 40};
          var width = parseInt(d3.select("#party-chart-container").style("width")) - margin.top*2;
          var height = parseInt(d3.select("#party-chart-container").style("height")) - margin.top*2;
              // width = 600 - margin.left - margin.right,
              // height = 300 - margin.top - margin.bottom;

          var svg,xAxis,yAxis,bars,resultCache;

          // Parse the date / time
          var parseDate = d3.time.format("%Y-%m-%d").parse;

          var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

          var y = d3.scale.linear().range([height, 0]);

          scope.$watch('partyResults.results', function (results) {
            if(results) {
              results = _.sortBy(results.slice(0,10), function(r) {
                return Date.parse(r.poll.date);
              });

              resultCache = results;

              xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

              yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);
          
              
              // Remove existing chart
              $('#party-chart-container').html('');

              svg = d3.select("#party-chart-container").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              results.forEach(function(d) {
                d.id = d.id;//parseDate(d.poll.date);
                d.value = d.mandates;
              });

              x.domain(results.map(function(d) { return d.id; }));
              y.domain([0, d3.max(results, function(d) { return d.value; })]);

              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis)
                .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", "-.55em")
                  .attr("transform", "rotate(-60)" )
                  .data(results)
                  .text(function(d){ return d.poll.date; });
                  //.call(wrap, x.rangeBand());;

              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Mandates");
              
              bars = svg.selectAll("bar")
                  .data(results)
                .enter().append("rect")
                  .style("fill", "steelblue")
                  .attr("x", function(d) { return x(d.id); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d.value); })
                  .attr("height", function(d) { return height - y(d.value); });

              resize();
            }
          });

          function resize() {
            /* Update graph using new width and height (code below) */
            var width = parseInt(d3.select("#party-chart-container").style("width")) - margin.top*2,
            height = parseInt(d3.select("#party-chart-container").style("height")) - margin.top*2;
             
            /* Update the range of the scale with new width/height */
            x.rangeRoundBands([0, width], .05);
            y.range([height, 0]);
             
            /* Update the axis with the new scale */
            svg.select('.x.axis')
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
             
            svg.select('.y.axis')
              .call(yAxis);
             
            /* Force D3 to recalculate and update the line */
            svg.selectAll('rect')
              .data(resultCache)
              .attr("x", function(d) { return x(d.id); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) { return height - y(d.value); });
          }


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
        }); // End of d3Service.d3()
      }
    };
  }]);