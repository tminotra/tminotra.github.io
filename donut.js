var margin = {top: 60, right: 0, bottom: 0, left: 0};

var width = 700-margin.left-margin.right;
var height = 500-margin.top - margin.bottom;
var fullWidth = width + margin.left+margin.right;
var fullHeight = height+margin.top+margin.bottom;
var radius = Math.min(width, height) / 2;

var color = d3.scaleOrdinal(d3.schemeCategory20b);

var svg = d3.select("#chart").append("svg")
    .attr("width", fullWidth)
    .attr("height", fullHeight);

var g = svg.append("g")
    .attr("transform","translate(" + (fullWidth / 2) + "," + (fullHeight / 2) +")")
    .attr("class","chartGroup");

var donutWidth = ( (500-margin.left-margin.right) / 4);

var arc = d3.arc()
    .innerRadius(donutWidth)
    .outerRadius(radius);

var pie = d3.pie()
    .value(function(d) { return d.count})
    .sort(null)
    .startAngle(1.1 * Math.PI)
  .endAngle(3.1 * Math.PI);

var tooltip = d3.select('#chart')
    .append('div')
    .attr('class','tooltip')

tooltip.append('div')
    .attr('class','label');
tooltip.append('div')
    .attr('class', 'count');
tooltip.append('div')
    .attr('class','percent');



 d3.csv('weekdays.csv', function(error, dataset) {
          dataset.forEach(function(d) {
            d.count = +d.count;
            d.enabled = true;
          });

var path = g.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
        //.attr('d',arc)
        .style('fill', function(d,i){
            return color(d.data.label);
        })
    .each(function(d){this._current = d;})

    path.transition().delay(function(d, i) {
    return i * 500;
  }).duration(500)
  .attrTween('d', function(d) {
    var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
    return function(t) {
      d.endAngle = i(t);
      return arc(d);
    }
  });



path.on('mousemove', function(d){
      var xposSub = document.getElementById("chart").getBoundingClientRect().left;
      var xpos = d3.event.x - xposSub + 20
      var ypos = d3.event.y
      tooltip.style("left" ,xpos + "px")
      tooltip.style("top", ypos + "px")
    var total = d3.sum(dataset.map(function(d){
      return (d.enabled) ? d.count : 0;
    }));
  var percent = Math.round(10000 * d.data.count / total) / 100;
  tooltip.select('.label').html(d.data.label);
  tooltip.select('.count').html(d.data.count+ '%');
  tooltip.select('.percent').html(percent + '%');
  tooltip.style('display', 'block');
});



path.on('mouseout', function(d){
    tooltip.style('display','none');

});

var legendRectSize = 18;
var legendSpacing = 10;

var legend = g.selectAll('.legend')
    .data(color.domain())
    .enter()
        .append('g')
        .attr('class','legend')
        .attr('transform', function(d,i){
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = 15 * legendRectSize;
            var vert = i * height-offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width',legendRectSize)
        .attr('height',legendRectSize)
        .style('fill',color)
        .style('stroke',color)

        .on('click', function(label){
        var rect = d3.select(this);
  var enabled = true;
  var totalEnabled = d3.sum(dataset.map(function(d) {
    return (d.enabled) ? 1 : 0;
  }));

  if (rect.attr('class') === 'disabled') {
    rect.attr('class', '');
  } else {
    if (totalEnabled < 2) return;
    rect.attr('class', 'disabled');
    enabled = false;
  }

  pie.value(function(d) {
    if (d.label === label) d.enabled = enabled;
    return (d.enabled) ? d.count : 0;
  });

  path = path.data(pie(dataset));
    });


legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .attr('style','font-size: 18')
  .attr('alignment-baseline','middle')
  .text(function(d) { return d; });

 });
