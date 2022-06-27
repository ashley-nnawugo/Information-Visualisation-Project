//global variables
var fullData;
var seriesData;
var filterN;
var non_numericalN;

//D3 library of 10 colours
var colourN = d3.scale.category10();

//function to format date, so D3 can recognise it
var formatDate = d3.time.format("%Y").parse; 




//nesting data and reading in csv
d3.csv("Data/normalised.csv", function(data) {
    //sorting data
    colourN.domain(d3.keys(data[0]).filter(function (id) { return id !== 'Date';}));

    data.forEach(function(d){ d.Date = formatDate(d.Date);});
    fullData = data;

    //mapping colours to categories
    seriesData = colourN.domain().map(function(ethnicity){
        non_numericalN = data.map(function(d){
            return {Date: d.Date, number: +d[ethnicity]};
        })
    //filtering data     
    filterN = non_numericalN.filter (function (d) { return !isNaN(d.number)});
        return {
            name: ethnicity,
            values: filterN
        };
    });
    console.log(data);
    //calling function
    create_graph2();
});
            
/*
Function to draw the graph 
This includes:
 > The setting up of the parameters for the svg elements
 > Adding of text, titles and labels
 > Scaling of axes, data, lines and circles 
 > Adding of tooltip interactivity 
 > Adding of legend
*/
function create_graph2() {

    var w = 1600;
    var h = 1000;

    var margin = {top: 80, bottom: 70, right: 20, left:70};
    width = w - (margin.left + margin.right);
    height = h - (margin.top  + margin.bottom); 

    //declaring svg element
    var svg = d3.select("#normalised")
            .append("svg")
            .attr('class', 'axis')
            .attr('width', w)
            .attr('height', h)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");            

    //adding text to axis
    svg.append("text")
                .attr("x", - 70)
                .attr("y", -35)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Number of Searches")
                .style("font", "40px avenir")
                .style("fill", "#000000")
                .style("font-weight", "500");

    svg.append("text")
                .attr("x", 710)
                .attr("y", 890)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Years")
                .style("font", "40px avenir")
                .style("fill", "#000000")
                .style("font-weight", "500");

    //Scales
    //xScale to map range from start earliest year to latest
    var xScale = d3.time.scale()
                        .range([0, width])
                        .domain(d3.extent(fullData, function(d){ return d.Date;}));

    //yScale to map the range from min to max number                                
    var yScale = d3.scale.linear()
                    .range([height, 0])
                    .domain([d3.min(seriesData, function(d) { return d3.min(d.values, function(e) {return e.number; }); }),
                            d3.max(seriesData, function(d) { return d3.max(d.values, function(e) {return e.number; }); }) ]);
                        
    //Axes

    //Creating x-axis scaled to the xscale, oriented bottom
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');
    //Creating y-axis scaled to the yScale, oriented left 
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
    //Creating line that uses values from x and y scale, linear interpolation means it is scaled accurately
    var line_data = d3.svg.line()
                    .interpolate("linear")
                    .x(function(d) {return xScale(d.Date); })
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
        .attr("y", h - height - margin.top - margin.bottom -45)
        .attr("text-anchor", "middle")
        .style("font-size", "42px")
        .style("font-weight", "bold")
        .text("Stop and Search Statistics normalised by Race per Thousand");

    //adding data to the linechart
    var linechart = svg.selectAll(".number")
                            .data(seriesData)
                            .enter()
                            .append("g")
                            .attr("class", "number");
        
    
    //tooltip
    var tooltip = d3.tip()
                    .attr('class', 'tooltip')
                    .offset([10, 0])
                    .html(function(d,i, j){
                        var year = d.Date.getFullYear();
                        return  "<pre><strong>Race: </strong> <span style ='color:white'>" + stopSeries[j].name + "</span></pre>" + 
                                "<pre><strong>Year: </strong> <span style ='color:white'>" + year + "</span></pre>" + 
                                "<pre><strong>Number:</strong> <span style ='color:white'>" + d.number + "</span></pre>";
                                    });
                    
    svg.call(tooltip);

    //adding path lines 
    linechart.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line_data(d.values);})
            .attr("data-legend", function(d) {return d.name;})
            .style("stroke", function(d) { return colourN(d.name);});
        
    //adding dots to linecchart         
    linechart.selectAll("circle")
                    .data(function(d) { return d.values})
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return xScale(d.Date);})
                    .attr("cy", function(d) {
                        return yScale(d.number);})
                    .attr("r", 9)
                    .style("fill", function (d, i, j) { return colourN(seriesData[j].name);})
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
    var legendN = svg.append("g")
                        .attr("class", "legend")
                        .attr("transform", "translate(1350, 30)")
                        .style("font-size", "25px")
                        .call(d3.legend);
}