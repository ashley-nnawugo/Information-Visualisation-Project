//global variables
var fullData;
var nestedData;
var legend_data
var formatDate = d3.time.format("%Y").parse; 

//reading in data 
d3.csv("Data/infantCleaned.csv", function(data) {

    fullData = data;
    legend_data = d3.keys(data[0]).filter(function(id) { return id !== "Year";})
    colour.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
    //making each value into an integer
    data.forEach(function(d) {    d.Year = formatDate(d.Year); 
    
    d.Asian = +d.Asian;
    d.Black = +d.Black;
    d.Other = +d.Other;
    d.Mixed = +d.Mixed;
    d.White = +d.White;

    });
    nestedData = data;
    areaGraph();
});




function areaGraph() {

//Setting up parameters
var w = 1600;
var h = 1000;

var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;


var svg = d3.select("#infant").append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//adding text for axes labels and titles
svg.append("text")
    .attr("x", -100)
    .attr("y", -40)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Deaths")
    .style("font", "40px avenir")
    .style("fill", "#000000")
    .style("font-weight", "700");

svg.append("text")
    .attr("x", 650)
    .attr("y", 840)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Years")
    .style("font", "36px avenir")
    .style("fill", "#000000")
    .style("font-weight", "700");

svg.append("text")
        .attr("x", width/2)
        .attr("y", h - height - margin.top - margin.bottom - 60)
        .attr("text-anchor", "middle")
        .style("font-size", "43px")
        .style("font-weight", "bold")
        .text("Infant Mortality by Ethnicity");


//Setting up axis and scales
var xScale = d3.time.scale()
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    //.tickFormat(formatPercent);

//creating area graph
var area = d3.svg.area()
    .x(function(d) { return xScale(d.date); })
    .y0(function(d) { 
        return yScale(d.y0); })
    .y1(function(d) { return yScale(d.y0 + d.y); });

//laying out stacked area graph
var stack = d3.layout.stack()
    .values(function(d) { return d.values; });

//assinging each area a colour 
  var areaFill = stack(colour.domain().map(function(name) {
    return {
      name: name,
      values: nestedData.map(function(d) {
        return {date: d.Year, y: d[name] * 1};
      })
    };
  }));


  // Find the value of the day with highest total value
  var maxDate = d3.max(fullData, function(d){
    var vals = d3.keys(d).map(function(key){ return key !== "Year" ? d[key] : 0 });
    return d3.sum(vals);
  });

  // Set domains for axes
  xScale.domain(d3.extent(nestedData, function(d) { return d.Year; }));
  
  yScale.domain([0, maxDate])

  //adding graph and path for stacked area chart
  var graph = svg.selectAll(".graph")
      .data(areaFill)
    .enter().append("g")
      .attr("class", "graph");

  graph.append("path")
      .attr("class", "area")
      .attr("d", function(d) { 
        console.log(d.values);  
        return area(d.values); })
      .style("fill", function(d) { return colour(d.name); });

// Calling axis
var gx =  svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

var gy =  svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

//creating legend
var legend = svg.selectAll(".infantLegend")
      .data(legend_data.slice())
      .enter().append("g")
      .attr("class", "infantLegend")
      .attr("transform", function (d, i) { return "translate(0, "+ i * 20 + ")";});

legend.append("rect")
      .attr("x", width - 130)
      .attr("width", 16)
      .attr("height", 16)
      .style("fill", colour);

legend.append("text")
      .attr("x", width -30)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d;});

}

