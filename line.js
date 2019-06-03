var margin = {top: 0, right: 0, bottom: 0, left: 0};
var svg = d3.select("#chart").append("svg")
  .attr("width", 1200)
  .attr("height", 500)

var width = 1100;
var height = 400;

var parseDate = d3.timeParse("%Y");
var displayDate = d3.timeFormat("%Y");
var displayValue = d3.format(",.0f");

function transition(path) {
        path.transition()
            .duration(2000)
            .attrTween("stroke-dasharray", tweenDash);
    }
    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }
// Ordinal scale
var x = d3.scaleBand()
          .rangeRound([0, width])
          .padding([0.5]);

var y = d3.scaleLinear()
    .range([height, height - 200]);

var line = d3.line()
    .x(function(d) { return x(d.name); })
    .y(function(d) { return y(d.value); });

var g = svg.append("g")
  .attr("transform", "translate(50, 0)")

d3.json("dataset.json", function(data) {

  // Pre-processing
  data.forEach(function(d) {
    d.value;// = +d.value;
    d["date"] = parseDate(d["date"]);
  });

  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.selectAll("text").data(data).enter()
   .append("text")
    .text(function(d, i) { return displayDate(d.date); })
    .attr("y", 420)
    .attr("x", function(d) { return x(d.name) + 35; })
    .style("font-size", 15)
    .style("font-family", "monospace");

  g.selectAll(".value").data(data).enter()
   .append("text")
    .text(function(d, i) { return displayValue(d.value); })
    .attr("class", "value")
    .attr("y", function(d) { return y(d.value)-20; })
    .attr("x", function(d) { return x(d.name);})
    .style("font-size", 20)
    .style("opacity",0)
    .style("font-family", "monospace");

  g.selectAll("path").data([data]).enter().append("path")
    .attr("class", "line")
    .attr("d", line)
    .call(transition);

 g.selectAll("line").data(data).enter().append("line")
                .attr('x1',function(d) { return x(d.name); })
                .attr('y1',function(d) { return y(0); })
                .attr('x2',function(d) { return x(d.name); })
                .attr('y2',function(d) { return y(d.value); })
                .style("stroke-width", 2)
                .style("stroke", "gray")
                .style("stroke-dasharray", ("2, 2"))
                .style("opacity",0);


  g.selectAll("circle").data(data).enter()
  .append("circle")
  .attr("cx",function(d) { return x(d.name); })
  .attr("cy",function(d) { return y(d.value); })
  .attr("r",8)
  .attr("opacity",0.15)
   .on("mouseover", function(d) {
    d3.select(this).attr("opacity",1).style("fill", "red");
    d3.selectAll(".value").filter(function(e) {
      return d === e;
    })
    .style("opacity",1)
    .style("font-size", 30);
    d3.selectAll("line").filter(function(e) {
      return d === e;
    })
    .style("opacity",1)

  })

  .on("mouseout", function(d) {
        d3.select(this).transition().duration(50).style("fill","black").attr("opacity",0.15);
    d3.selectAll(".value").filter(function(e) {
      return d === e;})
      .style("opacity",0)
    .transition().duration(100);


   d3.selectAll("line").filter(function(e) {
      return d === e;
    })
    .style("opacity",0)
   .transition().duration(100);
    });

});