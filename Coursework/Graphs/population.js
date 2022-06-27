
//global variable 
var population;






//reading in csv
d3.csv("Data/populationEthnicity.csv", function(data) {
    //sorting data
    data = data.sort(function(a, b) {
        return d3.ascending(a.Percent, b.Percent);
      });
    population = data;
    console.log(population);
    dataManipulation();
});


/*Function to draw the graph 
This includes:
 > The setting up of the parameters for the svg elements
 > Adding of text, titles and labels
 > Scaling of axes, data and rectangles 
 > Adding of tooltip interactivity 
*/
function dataManipulation() 
{
    var w = 1600;
    var h = 1000;
    //setting up parameters for the graph 
   var margin = { top: 80, bottom: 100, right: 0, left:330};
   width = w - (margin.left + margin.right);
   height = h - (margin.top  + margin.bottom);


   var svg = d3.select("#first")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // text for axis
    svg.append("text")
        .attr("x", -180)
        .attr("y", -30)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Ethnicity")
        .style("font", "40px avenir")
        .style("fill", "#000000")
        .style("font-weight", "bold");
    
     svg.append("text")
        .attr("x", 550)
        .attr("y", 870)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Percentage")
        .style("font", "40px avenir")
        .style("fill", "#000000")
        .style("font-weight", "bold");

    //Scales 
    //xScale to map the range from 0 to max number 
    var xScale = d3.scale.linear()
                    .domain([0, d3.max(population, function(d) { return d.Percent * 1.125;})])
                    .range([0, width]);

    //yScale to map range from start of non-numerical list 
    var yScale = d3.scale.ordinal()
                    .domain(population.map(function(d) { return d.Ethnicity; }))
                    .rangeRoundBands([height, 0], .1);      
                    
    //Axis
    //Creating x-axis scaled to the xscale, oriented bottom, with 10 ticks
    var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")                
                .ticks(10);

    //Creating y-axis scaled to the yScale, oriented left 
    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

    //adding axes, translating to the right place
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
        .attr("y", h - height - margin.top - margin.bottom - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "50px")
        .style("font-weight", "bold")
        .text("Population Ethnicity Percentage UK");

    //tooltip
    var tooltip = d3.tip()
                    .attr('class', 'tooltip')
                    .offset([0, 10])
                    .html(function(d){
                        return "<pre><strong>Ethnicity: </strong> <span style ='color:white'>" + d.Ethnicity + "</span></pre>" + 
                        "<pre><strong>Percent:</strong> <span style ='color:white'>" + d.Percent + "<strong>%</strong>" +"</span></pre>" +
                        "<pre><strong>Number:</strong> <span style ='color:white'>" + d.Number + "</span></pre>";
                    });
   
    svg.call(tooltip);
      
    //Adding bar charts 
    var bars = svg.selectAll(".bar")
            .data(population)
            .enter()
            .append("g");
    
    //Adding rectangles to the bars class to draw the scaled data
    bars.append("rect")
            .on("mouseover",tooltip.show)
            .on("mouseout",  function(){
                d3.select(".tooltip.n")
                    .transition()
                    .delay(100)
                    .duration(400)
                    .style("opacity", 0)
                    .style('pointer-events', 'none');
            })
            .attr("class", "bar")
            .attr("y", function(d) {return yScale(d.Ethnicity);})
            .attr("height", yScale.rangeBand())
            .attr("x", 0)
            .attr("width", function(d){ return xScale(d.Percent);})
            .attr("fill", "steelblue");
    
    
    //adding labels to the bar charts 
    bars.append("text")
            .attr("class", "label")
            .attr("y", function(d) { return yScale(d.Ethnicity) + yScale.rangeBand() / 2 + 4;})

}