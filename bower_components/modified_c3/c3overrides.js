// // function override
// c3.chart.internal.fn.redrawText = function (durationForExit) {
//   var $$ = this, config = $$.config,base = this.__proto__, CLASS = base.CLASS,
//       barOrLineData = $$.barOrLineData.bind($$),
//       classText = $$.classText.bind($$);
//   $$.mainText = $$.main.selectAll('.' + CLASS.texts).selectAll('.' + CLASS.text)
//       .data(barOrLineData);
//   $$.mainText.enter().append('text')
//       .attr("class", classText)
//       .attr('text-anchor', function (d) { return config.axis_rotated ? (d.value < 0 ? 'start' : 'end') : 'middle'; }) // switched `end` and `start`
//       .style("stroke", 'none')
//       .style("fill", function (d) { return $$.color(d); })
//       .style("fill-opacity", 0);
//   $$.mainText
//       .text(function (d, i, j) { return $$.formatByAxisId($$.getAxisId(d.id))(d.value, d.id, i, j); });
//   $$.mainText.exit()
//       .transition().duration(durationForExit)
//       .style('fill-opacity', 0)
//       .remove();
// }

// var legendItemTextBox = {};
// c3.chart.internal.fn.updateLegend = function (targetIds, options, transitions) {
//     var $$ = this, config = $$.config, base = this.__proto__, CLASS = base.CLASS;
//     var getOption = base.getOption,
//         isDefined = base.isDefined;
//     var xForLegend, xForLegendText, xForLegendRect, yForLegend, yForLegendText, yForLegendRect;
//     var paddingTop = 4, paddingRight = 10, maxWidth = 0, maxHeight = 0, posMin = 10, tileWidth = 15;
//     var l, totalLength = 0, offsets = {}, widths = {}, heights = {}, margins = [0], steps = {}, step = 0;
//     var withTransition, withTransitionForTransform;
//     var hasFocused = $$.legend.selectAll('.' + CLASS.legendItemFocused).size();
//     var texts, rects, tiles, background;

//     // change this
//     var legendRadius = 5;

//     options = options || {};
//     withTransition = getOption(options, "withTransition", true);
//     withTransitionForTransform = getOption(options, "withTransitionForTransform", true);

//     function getTextBox(textElement, id) {
//         if (!legendItemTextBox[id]) {
//             legendItemTextBox[id] = $$.getTextRect(textElement.textContent, CLASS.legendItem);
//         }
//         return legendItemTextBox[id];
//     }

//     function updatePositions(textElement, id, index) {
//         var reset = index === 0, isLast = index === targetIds.length - 1,
//             box = getTextBox(textElement, id),
//             itemWidth = box.width + tileWidth + (isLast && !($$.isLegendRight || $$.isLegendInset) ? 0 : paddingRight),
//             itemHeight = box.height + paddingTop,
//             itemLength = $$.isLegendRight || $$.isLegendInset ? itemHeight : itemWidth,
//             areaLength = $$.isLegendRight || $$.isLegendInset ? $$.getLegendHeight() : $$.getLegendWidth(),
//             margin, maxLength;

//         // MEMO: care about condifion of step, totalLength
//         function updateValues(id, withoutStep) {
//             if (!withoutStep) {
//                 margin = (areaLength - totalLength - itemLength) / 2;
//                 if (margin < posMin) {
//                     margin = (areaLength - itemLength) / 2;
//                     totalLength = 0;
//                     step++;
//                 }
//             }
//             steps[id] = step;
//             margins[step] = $$.isLegendInset ? 10 : margin;
//             offsets[id] = totalLength;
//             totalLength += itemLength;
//         }

//         if (reset) {
//             totalLength = 0;
//             step = 0;
//             maxWidth = 0;
//             maxHeight = 0;
//         }

//         if (config.legend_show && !$$.isLegendToShow(id)) {
//             widths[id] = heights[id] = steps[id] = offsets[id] = 0;
//             return;
//         }

//         widths[id] = itemWidth;
//         heights[id] = itemHeight;

//         if (!maxWidth || itemWidth >= maxWidth) { maxWidth = itemWidth; }
//         if (!maxHeight || itemHeight >= maxHeight) { maxHeight = itemHeight; }
//         maxLength = $$.isLegendRight || $$.isLegendInset ? maxHeight : maxWidth;

//         if (config.legend_equally) {
//             Object.keys(widths).forEach(function (id) { widths[id] = maxWidth; });
//             Object.keys(heights).forEach(function (id) { heights[id] = maxHeight; });
//             margin = (areaLength - maxLength * targetIds.length) / 2;
//             if (margin < posMin) {
//                 totalLength = 0;
//                 step = 0;
//                 targetIds.forEach(function (id) { updateValues(id); });
//             }
//             else {
//                 updateValues(id, true);
//             }
//         } else {
//             updateValues(id);
//         }
//     }

//     if ($$.isLegendInset) {
//         step = config.legend_inset_step ? config.legend_inset_step : targetIds.length;
//         $$.updateLegendStep(step);
//     }

//     if ($$.isLegendRight) {
//         xForLegend = function (id) { return maxWidth * steps[id]; };
//         yForLegend = function (id) { return margins[steps[id]] + offsets[id]; };
//     } else if ($$.isLegendInset) {
//         xForLegend = function (id) { return maxWidth * steps[id] + 10; };
//         yForLegend = function (id) { return margins[steps[id]] + offsets[id]; };
//     } else {
//         xForLegend = function (id) { return margins[steps[id]] + offsets[id]; };
//         yForLegend = function (id) { return maxHeight * steps[id]; };
//     }
//     xForLegendText = function (id, i) { return xForLegend(id, i) + 14; };
//     yForLegendText = function (id, i) { return yForLegend(id, i) + 9 - legendRadius; };
//     xForLegendRect = function (id, i) { return xForLegend(id, i); };
//     yForLegendRect = function (id, i) { return yForLegend(id, i) - 7 + legendRadius; };

//     // Define g for legend area
//     l = $$.legend.selectAll('.' + CLASS.legendItem)
//         .data(targetIds)
//         .enter().append('g')
//         .attr('class', function (id) { return $$.generateClass(CLASS.legendItem, id); })
//         .style('visibility', function (id) { return $$.isLegendToShow(id) ? 'visible' : 'hidden'; })
//         .style('cursor', 'pointer')
//         .on('click', function (id) {
//             if (config.legend_item_onclick) {
//                 config.legend_item_onclick.call($$, id);
//             } else {
//                 if ($$.d3.event.altKey) {
//                     $$.api.hide();
//                     $$.api.show(id);
//                 } else {
//                     $$.api.toggle(id);
//                     $$.isTargetToShow(id) ? $$.api.focus(id) : $$.api.revert();
//                 }
//             }
//         })
//         .on('mouseover', function (id) {
//             $$.d3.select(this).classed(CLASS.legendItemFocused, true);
//             if (!$$.transiting && $$.isTargetToShow(id)) {
//                 $$.api.focus(id);
//             }
//             if (config.legend_item_onmouseover) {
//                 config.legend_item_onmouseover.call($$, id);
//             }
//         })
//         .on('mouseout', function (id) {
//             $$.d3.select(this).classed(CLASS.legendItemFocused, false);
//             $$.api.revert();
//             if (config.legend_item_onmouseout) {
//                 config.legend_item_onmouseout.call($$, id);
//             }
//         });
//     l.append('text')
//         .text(function (id) { return isDefined(config.data_names[id]) ? config.data_names[id] : id; })
//         .each(function (id, i) { updatePositions(this, id, i); })
//         .style("pointer-events", "none")
//         .attr('x', $$.isLegendRight || $$.isLegendInset ? xForLegendText : -200)
//         .attr('y', $$.isLegendRight || $$.isLegendInset ? -200 : yForLegendText);
//     l.append('rect')
//         .attr("class", CLASS.legendItemEvent)
//         .style('fill-opacity', 0)
//         .attr('x', $$.isLegendRight || $$.isLegendInset ? xForLegendRect : -200)
//         .attr('y', $$.isLegendRight || $$.isLegendInset ? -200 : yForLegendRect);
//     l.append('circle')
//         .attr("class", CLASS.legendItemTile)
//         .style("pointer-events", "none")
//         .style('fill', $$.color)
//         .attr('cx', $$.isLegendRight || $$.isLegendInset ? xForLegendText : -200)
//         .attr('cy', $$.isLegendRight || $$.isLegendInset ? -200 : yForLegend)
//         .attr('r', legendRadius)
//         .attr('width', 10)
//         .attr('height', 10);

//     // Set background for inset legend
//     background = $$.legend.select('.' + CLASS.legendBackground + ' rect');
//     if ($$.isLegendInset && maxWidth > 0 && background.size() === 0) {
//         background = $$.legend.insert('g', '.' + CLASS.legendItem)
//             .attr("class", CLASS.legendBackground)
//             .append('rect');
//     }

//     texts = $$.legend.selectAll('text')
//         .data(targetIds)
//         .text(function (id) { return isDefined(config.data_names[id]) ? config.data_names[id] : id; }) // MEMO: needed for update
//         .each(function (id, i) { updatePositions(this, id, i); });
//     (withTransition ? texts.transition() : texts)
//         .attr('x', xForLegendText)
//         .attr('y', yForLegendText);

//     rects = $$.legend.selectAll('rect.' + CLASS.legendItemEvent)
//         .data(targetIds);
//     (withTransition ? rects.transition() : rects)
//         .attr('width', function (id) { return widths[id]; })
//         .attr('height', function (id) { return heights[id]; })
//         .attr('x', xForLegendRect)
//         .attr('y', yForLegendRect);

//     tiles = $$.legend.selectAll('circle.' + CLASS.legendItemTile)
//         .data(targetIds);
//     (withTransition ? tiles.transition() : tiles)
//         .style('fill', $$.color)
//         .attr('cx', xForLegend)
//         .attr('cy', yForLegend);

//     if (background) {
//         (withTransition ? background.transition() : background)
//             .attr('height', $$.getLegendHeight() - 12)
//             .attr('width', maxWidth * (step + 1) + 10);
//     }

//     // toggle legend state
//     $$.legend.selectAll('.' + CLASS.legendItem)
//         .classed(CLASS.legendItemHidden, function (id) { return !$$.isTargetToShow(id); })
//         .transition()
//         .style('opacity', function (id) {
//             var This = $$.d3.select(this);
//             if ($$.isTargetToShow(id)) {
//                 return !hasFocused || This.classed(CLASS.legendItemFocused) ? $$.opacityForLegend(This) : $$.opacityForUnfocusedLegend(This);
//             } else {
//                 return null; // c3-legend-item-hidden will be applied
//             }
//         });

//     // Update all to reflect change of legend
//     $$.updateLegendItemWidth(maxWidth);
//     $$.updateLegendItemHeight(maxHeight);
//     $$.updateLegendStep(step);
//     // Update size and scale
//     $$.updateSizes();
//     $$.updateScales();
//     $$.updateSvgSize();
//     // Update g positions
//     $$.transformAll(withTransitionForTransform, transitions);
//     $$.legendHasRendered = true;
// };



c3.chart.internal.fn.additionalConfig = {
    bar_radius: 18
};

c3.chart.internal.fn.isOrderDesc = function () {
        var config = this.config;
        if(this.isFunction(config.data_order)) {
            return false;
        }else {
            return config.data_order && config.data_order.toLowerCase() === 'desc';
        }
};


c3.chart.internal.fn.isOrderAsc = function () {
        var config = this.config;
        if(this.isFunction(config.data_order)) {
            return false;
        }else {
            return config.data_order && config.data_order.toLowerCase() === 'asc';
        }
};

c3.chart.internal.fn.generateDrawBar = function (barIndices, isSub) {
    var $$ = this, config = $$.config,
        getPoints = $$.generateGetBarPoints(barIndices, isSub);
    return function (d, i) {
        // 4 points that make a bar
        var points = getPoints(d, i),
            groups = config.data_groups,
            path = '';

        // switch points if axis is rotated, not applicable for sub chart
        var indexX = config.axis_rotated ? 1 : 0;
        var indexY = config.axis_rotated ? 0 : 1;
        
        var bar_radius = config.bar_radius;


        if (bar_radius != 0) {
            if(config.axis_rotated) {
                path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' ' +
                    'L' + (points[1][indexX]-bar_radius) + ',' + points[1][indexY] + ' ' +
                    'Q' + points[1][indexX] + ',' + points[1][indexY] + ' ' + points[1][indexX] + ',' + (points[1][indexY]+bar_radius) + ' ' +
                    'L' + points[2][indexX] + ',' + (points[2][indexY]-bar_radius) + ' ' +
                    'Q' + points[2][indexX] + ',' + points[2][indexY] + ' ' + (points[2][indexX]-bar_radius) + ',' + points[2][indexY] + ' ' +
                    'L' + points[3][indexX] + ',' + points[3][indexY] + ' ' +
                    'z';
            } else {
                path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' ' +
                    'L' + points[1][indexX] + ',' + (points[1][indexY]+bar_radius) + ' ' +
                    'Q' + points[1][indexX] + ',' + points[1][indexY] + ' ' + (points[1][indexX]+bar_radius) + ',' + points[1][indexY] + ' ' +
                    'L' + (points[2][indexX]-bar_radius) + ',' + points[2][indexY] + ' ' +
                    'Q' + points[2][indexX] + ',' + points[2][indexY] + ' ' + points[2][indexX] + ',' + (points[2][indexY]+bar_radius) + ' ' +
                    'L' + points[3][indexX] + ',' + points[3][indexY] + ' ' +
                    'z';
            }
        } else {
            path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' ' +
                'L' + points[1][indexX] + ',' + (points[1][indexY]) + ' ' +
                'L' + (points[2][indexX]) + ',' + points[2][indexY] + ' ' +
                'L' + points[3][indexX] + ',' + points[3][indexY] + ' ' +
                'z';
        }

        return path;
    };

};