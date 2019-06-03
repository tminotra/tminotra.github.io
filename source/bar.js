var svg = d3.select("#chart").append("svg").attr("width",1200).attr("height",600),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin

    svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 500)
       .attr("y", 600)
       .attr("font-size", "24px")
       .text("States");

    var xScale = d3.scaleBand().range([0, width]).padding(0.4);
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");



    d3.csv("XYZ.csv", function(error, data) {
        if (error) {
            throw error;
        }

        xScale.domain(data.map(function(d) { return d.States; }));
        yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale))
         .selectAll("text")
         //.attr("y", height - 250)
        // .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", ".15em")
         .attr("transform", "rotate(-70)");
      //   .attr("stroke", "black")
         //.text("States")

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return  d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("font-size", "15px")
         .attr("stroke", "black")
         .text("percentage");

        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .transition()
         .duration(500)
         .ease(d3.easeLinear)
         .attr("x", function(d) { return xScale(d.States); })
         .attr("y", function(d) { return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.value); })
         .attr("fill","brown");

         var registerMouseovers = function() {
             svg.selectAll("rect")

             .on("mouseover", function(d) {
               d3.select(this)
                 .attr("fill", "orange");
                 svg.append("text")
                 .text(d.value + "%")
                 .attr("id", "tooltip")
                 .attr("x", parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width"))/2 + 85)
                 .attr("y", parseFloat(d3.select(this).attr("y")) + 85)
             })
             .on("mouseout", function() {
             d3.select(this)
               .attr("fill", "brown")

             d3.select("#tooltip")
               .remove()
           })
         }
         registerMouseovers();

    });