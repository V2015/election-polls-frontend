// function override
c3.chart.internal.fn.redrawText = function (durationForExit) {
  var $$ = this, config = $$.config,base = this.__proto__, CLASS = base.CLASS,
      barOrLineData = $$.barOrLineData.bind($$),
      classText = $$.classText.bind($$);
  $$.mainText = $$.main.selectAll('.' + CLASS.texts).selectAll('.' + CLASS.text)
      .data(barOrLineData);
  $$.mainText.enter().append('text')
      .attr("class", classText)
      .attr('text-anchor', function (d) { return config.axis_rotated ? (d.value < 0 ? 'start' : 'end') : 'middle'; }) // switched `end` and `start`
      .style("stroke", 'none')
      .style("fill", function (d) { return $$.color(d); })
      .style("fill-opacity", 0);
  $$.mainText
      .text(function (d, i, j) { return $$.formatByAxisId($$.getAxisId(d.id))(d.value, d.id, i, j); });
  $$.mainText.exit()
      .transition().duration(durationForExit)
      .style('fill-opacity', 0)
      .remove();
}