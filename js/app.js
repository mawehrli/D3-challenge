// @TODO: YOUR CODE HERE!
// Level 1 Requirement, D3:  Create a scatter plot for visualization of data based on the 2014 ACS 1 year estimates.  
// SVG canvas definiton
var svgWidth = 960;
var svgHeight = 800;

// SVG border variables
var margin = {
    top: 80,
    right: 40,
    bottom: 100,
    left: 80
};

// Subtract border variables to SVG canvas
var chartWidth = svgWidth - margin.right - margin.left;
var chartHeight = svgHeight - margin.top - margin.bottom;

// append a div class to the scatter element
var chart = d3.select('#scatter')
    // We append our chart here. Dicv class "chart"
    .append('div').classed('chart', true);

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = chart.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// ChartGroup that shall hold the chart
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
////////////////////////////////////////////////////////////////////


// Retrieve data from the csv provided
d3.csv('assets/data/data.csv').then(function (census) {

    // Show results on console log
    console.log(census);
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    census.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(census, d => d.poverty)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(census, d => d.healthcare)])
        .range([chartHeight, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(census)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "Crimson")
        .attr("opacity", ".5");

    // circle text to display
    chartGroup.selectAll()
        .data(census)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("data-toggle", "tooltip")
        .style("background", "darkblue")
        .style("color", "white")
        .style("text-align", "center")
        .style("border-radius", "6px")
        .style("padding", "5px 10px")
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}%`);
        });


    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this)
            .transition()
            .duration(5000);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data)
                .transition()
                .duration(1000);
        });

    // Create x axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lack Healthcare (%)");

    // Create y axes labels
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");


}).catch(function (error) {
    console.log(error);
});
