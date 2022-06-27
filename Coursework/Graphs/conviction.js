//global variables
var pay;
var series;
var filter;
var non_numerical;

var colour = d3.scale.category10();
var formatDate = d3.time.format("%Y").parse; 

//reading in data
d3.csv("Data/convictionProcessed.csv", function(data) {
    //nesting data
    colour.domain(d3.keys(data[0]).filter(function (id) { return id !== 'Year';}));

    data.forEach(function(d){ d.Year = formatDate(d.Year);});
    pay = data;

    //mapping colours to categories
    series = colour.domain().map(function(ethnicity){
        non_numerical = data.map(function(d){
            return {Year: d.Year, number: +d[ethnicity]};
        })
        
        filter = non_numerical.filter (function (d) { return !isNaN(d.number)});
        return {
            name: ethnicity,
            values: filter
        };
    });
//    console.log(series);
  //  console.log(stop_search); 
    
    conviction_graph();
});


/*Function to draw the graph 
This includes:
 > The setting up of the parameters for the svg elements
 > Adding of text, titles and labels
 > Scaling of axes, data, lines and circles 
 > Adding of tooltip interactivity 
 > Adding of legend
*/
function conviction_graph() {

    //Setting up parameters for the graph
    var w = 1600;
    var h = 1000;

    var margin = {top: 70, bottom: 100, right: 120, left:70};
    width = w - (margin.left + margin.right);
    height = h - (margin.top  + margin.bottom); 

    //declaring svg element
    var svg = d3.select("#fourth")
                .append("svg")
                .attr('class', 'axis')
                .attr('width', w)
                .attr('height', h)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //adding text to the axis 
    svg.append("text")
                .attr("x", -50)
                .attr("y", -45)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Percentage")
                .style("font", "40px avenir")
                .style("fill", "#000000")
                .style("font-weight", "500");
    
    svg.append("text")
                .attr("x", 700)
                .attr("y", 900)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Years")
                .style("font", "40px avenir")
                .style("fill", "#000000")
                .style("font-weight", "500");
    //Scale
    //xScale to map range from start earliest year to latest
    var xScale = d3.time.scale()
                        .range([0, width])
                        .domain(d3.extent(pay, function(d){ return d.Year;}));
                        
    //yScale to map the range from min to max number                    
    var yScale = d3.scale.linear()
                        .range([height, 0])
                        .domain([d3.min(series, function(d) { return d3.min(d.values, function(e) {return e.number; }); }),
                                 d3.max(series, function(d) { return d3.max(d.values, function(e) {return e.number; }); })
                                    ]);
                        
    //Axes
    //Creating x-axis scaled to the xscale, oriented bottom
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');
    
    //Creating y-axis scaled to the yscale, oriented left 
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')

    //Creating line that uses values from x and y scale, linear interpolation means it is scaled accurately
    var line_data = d3.svg.line()
                    .interpolate("linear")
                    .x(function(d) {return xScale(d.Year); })
                    .y(function (d) {
                        return yScale(d.number); });
  
    //adding axes and text , translating to the right place
    var gx = svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0, "+ height +")" )
                .call(xAxis)
                .selectAll('text')
                .attr("transform", "rotate(45)")
                .style("text-anchor", "start");

    
    var gy = svg.append("g")
                .attr("class", "axis")
                .call(yAxis);
    
    //adding title
    svg.append("text")
        .attr("x", width/2)
        .attr("y", h - height - margin.top - margin.bottom - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "50px")
        .style("font-weight", "Bold")
        .text("Conviction rate percentage by Ethnicity");

    //creating variable to store the data for the lines    
    var linechart = svg.selectAll(".number")
                            .data(series)
                            .enter()
                            .append("g")
                            .attr("class", "number");
     
    
    //tooltip
    var tooltip = d3.tip()
                    .attr('class', 'tooltip')
                    .offset([10, 0])
                    .html(function(d,i, j){
                        var year = d.Year.getFullYear();
                        return  "<pre><strong>Race: </strong> <span style ='color:white'>" + series[j].name + "</span></pre>" + 
                                "<pre><strong>Year: </strong> <span style ='color:white'>" + year + "</span></pre>" + 
                                "<pre><strong>Percent:</strong> <span style ='color:white'>" + d.number  + "<strong>%</strong>" + "</span></pre>";
                                    });
                   
    svg.call(tooltip);

    //adding path lines 
    linechart.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line_data(d.values);})
            .attr("data-legend", function(d) {return d.name;})
            .style("stroke", function(d) { return colour(d.name);});
     
    //adding dots         
    linechart.selectAll("circle")
                    .data(function(d) { return d.values})
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return xScale(d.Year);})
                    .attr("cy", function(d) {
                        return yScale(d.number);})
                    .attr("r", 9)
                    .style("fill", function (d, i, j) { return colour(series[j].name);})
                    .on("mouseover", tooltip.show)
                    .on("mouseout", function(){
                        d3.select(".tooltip.n")
                            .transition()
                            .delay(200)
                            .duration(400)
                            .style("opacity", 0)
                            .style('pointer-events', 'none');
                    });
    
    //adding legend
    var legend = svg.append("g")
                        .attr("class", "legend")
                        .attr("transform", "translate(1430, 30)")
                        .style("font-size", "25px")
                        .call(d3.legend);
}