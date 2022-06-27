
//global variables
var pay;
var paySeries;
var filter;
var non_numerical;

var colour = d3.scale.category10();
var formatDate = d3.time.format("%Y").parse; 

//reading in data
d3.csv("Data/payProcessed.csv", function(data) {
    //nesting data
    colour.domain(d3.keys(data[0]).filter(function (id) { return id !== 'Year';}));

    data.forEach(function(d){ d.Year = formatDate(d.Year);});
    pay = data;

    //mapping colours to categories
    paySeries = colour.domain().map(function(ethnicity){
        non_numerical = data.map(function(d){
            return {Year: d.Year, number: +d[ethnicity]};
        })
        //filtering data     
        filter = non_numerical.filter (function (d) { return !isNaN(d.number)});
        return {
            name: ethnicity,
            values: filter
        };
    });
    
    pay_graph();
});

/*Function to draw the graph 
This includes:
 > The setting up of the parameters for the svg elements
 > Adding of text, titles and labels
 > Scaling of axes, data, lines and circles 
 > Adding of tooltip interactivity 
 > Adding of legend
*/
function pay_graph() {

    //setting up parameters
    var w = 1600;
    var h = 1000;

    var margin = {top: 80, bottom: 70, right: 180, left:100};
    width = w - (margin.left + margin.right);
    height = h - (margin.top  + margin.bottom); 

    //declaring svg element
    var svg = d3.select("#fifth")
                .append("svg")
                .attr('class', 'axis')
                .attr('width', w)
                .attr('height', h)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //adding text to axis
    svg.append("text")
                .attr("x", -70)
                .attr("y", -35)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Percentage")
                .style("font", "40px avenir")
                .style("fill", "#000000")
                .style("font-weight", "500");
    
    svg.append("text")
                .attr("x", 650)
                .attr("y", 890)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Years")
                .style("font", "40px avenir")
                .style("fill", "#000000")
                .style("font-weight", "500");
    //Scale
    var xScale = d3.time.scale()
                        .range([0, width])
                        .domain(d3.extent(pay, function(d){ return d.Year;}));
                        
    var yScale = d3.scale.linear()
                        .range([height, 0])
                        .domain([d3.min(paySeries, function(d) { return d3.min(d.values, function(e) {return e.number; }); }),
                                 d3.max(paySeries, function(d) { return d3.max(d.values, function(e) {return e.number; }); })
                                    ]);
                        
    //Axes
    //Creating x-axis scaled to the xscale, oriented bottom
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');
    //Creating y-axis scaled to the yScale, oriented left 
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .ticks(25);

    //Creating line that uses values from x and y scale, linear interpolation means it is scaled accurately
    var line_data = d3.svg.line()
                    .interpolate("linear")
                    .x(function(d) {return xScale(d.Year); })
                    .y(function (d) {
                        return yScale(d.number); });
            
    //adding axes and text, translating to the right place    
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
        .attr("y", h - height - margin.top - margin.bottom - 30)
        .attr("text-anchor", "middle")
        .style("font-size", "50px")
        .style("font-weight", "Bold")
        .text("Pay Gap percentage difference against White British");

    //creating linechart element   
    var linechart = svg.selectAll(".number")
                            .data(paySeries)
                            .enter()
                            .append("g")
                            .attr("class", "number");
     
    
    //tooltip
    var tooltip = d3.tip()
                    .attr('class', 'tooltip')
                    .offset([10, 0])
                    .html(function(d,i, j){
                        var year = d.Year.getFullYear();
                        return  "<pre><strong>Race: </strong> <span style ='color:white'>" + paySeries[j].name + "</span></pre>" + 
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
                    .style("fill", function (d, i, j) { return colour(paySeries[j].name);})
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
                        .attr("class", "paysLegend")
                        .attr("transform", "translate(1350, 30)")
                        .style("font-size", "23px")
                        .call(d3.legend);
}