//global variables
var wealth;
var wholeData;




//data will only work if it is loaded as d3 is async
//nesting data and reading in csv
d3.csv("Data/wealthProcessed.csv", function(data) {
    //sorting data
    wholeData = data;
    wealth = d3.keys(data[0]).filter(function(id) { return id !== "Ethnicity";})
    data.forEach(function(d){ 
        d.wealthGroup = wealth.map(function(name) {  return {name: name, value: +d[name]}; });})
    console.log(wealth);
    //calling function
    wealth_group_bar();
});

/*Function to draw the graph 
This includes:
 > The setting up of the parameters for the svg elements
 > Adding of text, titles and labels
 > Scaling of axes, data, rectangles 
 > Adding of tooltip interactivity 
 > Adding of legend
*/
function wealth_group_bar()
{
    //setting up graph parameters
    var w = 1600;
    var h = 1000;
     
    var margin = { top: 80, bottom: 90, right: 0, left:100, padding: .2};
    width = w - (margin.left + margin.right);
    height = h - (margin.top  + margin.bottom);
    var colour = d3.scale.ordinal()
                    .range(["#008C8C","#FF0000"]);

    //declaring svg element
    var svg = d3.select("#third")
                 .append("svg")
                 .attr("width", w)
                 .attr("height", h)
                 .append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //adding text to axis
    svg.append("text")
                 .attr("x", -100)
                 .attr("y", -40)
                 .attr("dy", "0.71em")
                 .attr("fill", "#000")
                 .text("Wealth in £")
                 .style("font", "40px avenir")
                 .style("fill", "#000000")
                 .style("font-weight", "700");
     
     svg.append("text")
                 .attr("x", 650)
                 .attr("y", 880)
                 .attr("dy", "0.71em")
                 .attr("fill", "#000")
                 .text("Ethnic Group")
                 .style("font", "36px avenir")
                 .style("fill", "#000000")
                 .style("font-weight", "700");
                
    
    //Scales
    //xScale to map range from start of non-numerical list
    var xScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width -150], .1)
                    .domain(wholeData.map(function (d){ return d.Ethnicity}));
    
    //Second scale to map each ethnic group
    var xScale1 = d3.scale.ordinal()
                        .domain(wealth).rangeRoundBands([0, xScale.rangeBand()]);

    //yScale to map the range from min to max number
    var yScale = d3.scale.linear()
                    .range([height,0])
                    .domain([0, d3.max(wholeData, function(d) {
                        return d3.max( d.wealthGroup, function(d) {
                        return d.value;});})]);
    //Axes
    //Creating x-axis scaled to the xscale, oriented bottom
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

    //Creating y-axis scaled to the yScale, oriented left        
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickFormat(d3.format(".2s"));

    var gx = svg.append("g")
                .attr("class", "x_axis")
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxis);
                
    var gy = svg.append("g")
                .attr("class", "axis")
                .call(yAxis);
    //tooltip
    var tooltip = d3.tip()
                .attr('class', 'tooltip')
                .offset([0, 10])
                .html(function(d){
                    return "<pre><span style ='color:white'>" +d.name + ": " + d.value + "</span></pre>";
                });
       
        
    svg.call(tooltip);
    
    //Adding the elements and translating them to right ethnic group
    var bar = svg.selectAll(".ethnicity")
                .data(wholeData)
                .enter()
                .append("g")
                .attr("class", "ethnicity")
                .attr("transform", function(d){
                    console.log(xScale(d.Ethnicity));
                    return "translate(" + xScale(d.Ethnicity) + ",0)"; });

    //Adding rectangles for the bars and scaling them 
    bar.selectAll("rect")
        .data(function(d){ 
            return d.wealthGroup;})
        .enter()
        .append("rect")
        .attr("width", xScale1.rangeBand())
        .attr("x", function(d) { 
            return xScale1(d.name); })
        .style("fill", function(d) { return colour(d.name);})
        .on("mouseover", tooltip.show)
        .on("mouseout", function(){
            d3.select(".tooltip.n")
            .transition()
            .delay(100)
            .duration(400)
            .style("opacity", 0)
            .style('pointer-events', 'none');
        })
        .attr("y", function(d) { return yScale(d.value); })
        .attr("height", function(d) {return height - yScale(d.value);});
    
    //Adding title 
    svg.append("text")
        .attr("x", width/2)
        .attr("y", h - height - margin.top - margin.bottom - 30)
        .attr("text-anchor", "middle")
        .style("font-size", "60px")
        .style("font-weight", "Bold")
        .text("Household wealth by Ethnicity");
    
    //Legend
    var legend = svg.selectAll(".wealthLegend")
                    .data(wealth.slice())
                    .enter().append("g")
                    .attr("class", "wealthLegend")
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