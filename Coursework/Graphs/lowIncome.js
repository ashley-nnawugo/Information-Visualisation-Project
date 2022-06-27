//global variables 
var lowIncome;

var w = 1000;
var h = 600;




//nesting data and reading in csv
d3.csv("Data/lowIncome.csv", function(data) {
    //sorting data
    data = data.sort(function(a, b) {
        return d3.ascending(a.Percent, b.Percent);
      });
    lowIncome = data;
    console.log(lowIncome);
    renderGraph();
});

/*Function to draw the graph 
This includes:
 > The setting up of the parameters for the svg elements
 > Adding of text, titles and labels
 > Scaling of axes, data, rectangles 
 > Adding of tooltip interactivity 
 > Adding of legend
*/
function renderGraph() 
{
    //Setting up parameters for the graph
    var w = 1600;
    var h = 1000;

   var margin = { top: 80, bottom: 100, right: 120, left:100};
   width = w - (margin.left + margin.right);
   height = h - (margin.top  + margin.bottom);

   //declaring svg element
   var svg = d3.select("#sixth")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// adding axis to graph 
    svg.append("text")
            .attr("x", -100)
            .attr("y", -25)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Percent")
            .style("font", "40px avenir")
            .style("fill", "#000000")
            .style("font-weight", "700");
           
    svg.append("text")
            .attr("x", 650)
            .attr("y", 880)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Ethnic Group")
            .style("font", "40px avenir")
            .style("fill", "#000000")
            .style("font-weight", "700");
        
    //Scale
    //xScale to map range from start of non-numerical list
    var xScale = d3.scale.ordinal()
                    .domain(lowIncome.map(function(d) { return d.Ethnicity; }))
                    .rangeRoundBands([0, width], .4);      
       
    //yScale to map the range from 0 to max number
    var yScale = d3.scale.linear()
                    .domain([0, d3.max(lowIncome, function(d) { 
                        return d.Percent * 1.6;})])
                    .range([height, 0]);
  

    //Axis
    //xAxis oriented bottom, yAxis oriented left
    var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");                
    
    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10);
                
    //Adding and or translating axis
    var gy = svg.append("g")
                .attr("class", "axis")
                .call(yAxis);

    var gx = svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0, "+ height +")" )
                .call(xAxis);
 
    //title
    svg.append("text")
        .attr("x", width/2)
        .attr("y", h - height - margin.top - margin.bottom - 30)
        .attr("text-anchor", "middle")
        .style("font-size", "43px")
        .style("font-weight", "bold")
        .text("Percentage Living in low income homes by Ethnicity");

    //tooltip
    var tooltip = d3.tip()
                    .attr('class', 'tooltip')
                    .offset([0, 10])
                    .html(function(d){
                        return "<pre><strong>Ethnicity: </strong> <span style ='color:white'>" + d.Ethnicity + "</span></pre>" + 
                        "<pre><strong>Percent:</strong> <span style ='color:white'>" + d.Percent + "<strong>%</strong>" +"</span></pre>";
                    });
   
    svg.call(tooltip);
        
    //adding data to the bar variable to draw bars
    var bars = svg.selectAll(".incomeBar")
            .data(lowIncome)
            .enter()
            .append("rect")
            .attr("class", "incomeBar")
            .attr("y", function(d) {return yScale(d.Percent);})
            .attr("height",function(d) { return height - yScale(d.Percent);})
            .attr("x", function(d) {return xScale(d.Ethnicity)})
            .attr("width", xScale.rangeBand())
            .on("mouseover",tooltip.show)
            .on("mouseout",  function(){
                d3.select(".tooltip.n")
                    .transition()
                    .delay(100)
                    .duration(400)
                    .style("opacity", 0)
                    .style('pointer-events', 'none');
            })
            .attr("fill", "red");
    
    bars.append("text")
            .attr("class", "label")
            .attr("y", function(d) { return xScale(d.Ethnicity) + xScale.rangeBand() / 2 + 4;})
 
/*    bars.append("line")
            .attr("x", function(d) {return xScale(d.Ethnicity)})
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) {return d['National Average'];})
            .attr("height", function(d) {return height - d['National Average'];});
   */         

    //adding line to signify national average
    var line = d3.svg.line()
            .x(function (d) { return xScale(d.Ethnicity);})
            .y(function (d) { return yScale(d['National Average']);})
            .interpolate('linear');

    //drawing path of the line 
    var draw = svg.append('path')
                    .attr('class', "line")
                    .attr("stroke", "black")
                    .attr("transform", "scale(1.1, 1)")
                    .attr("d", function (d) {return line(lowIncome)});

 //   var lineEnd = 710;
    //adding text to the end of the line to label national average
    svg.append("text")
                .attr("y", height - 200)
                .attr("x", width - 55)
                .attr('text-anchor', 'start')
                .style('font-size', '17px')
                .style('font-weight', "bold")
                .style("fill", "black")
                .text('National Average');
}