

$(document).ready(function() {

  // Hook up an event handler for the load button click.
  // Wait to initialize until the button is clicked.
  $("#initializeButton").click(function() {
	  
	  // Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

    // Disable the button after it's been clicked
    $("#initializeButton").prop('disabled', true);

    tableau.extensions.initializeAsync().then(function() {

      // Initialization succeeded! Get the dashboard
      var dashboard = tableau.extensions.dashboardContent.dashboard;

      // Display the name of dashboard in the UI
      $("#resultBox").html("I'm running in a dashboard named <strong>" + dashboard.name + "</strong>");
	  
	  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

    // Find a specific worksheet 
    var worksheet = worksheets.find(function (sheet) {
      return sheet.name === "Extension Testing";
    });
	 $("#resultBox1").html("I'm accessing worksheet named <strong>" + worksheet.name + "</strong>");
	// get the summary data for the sheet
 worksheet.getSummaryDataAsync().then(function (sumdata) {

  const worksheetData = sumdata;
  // The getSummaryDataAsync() method returns a DataTable
  // Map the DataTable (worksheetData) into a format for display, etc.
  /*
  // set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data


  // add the x Axis
  var x = d3.scaleLinear()
            .domain([0, 1000])
            .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.01]);
  svg.append("g")
      .call(d3.axisLeft(y));

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
  var density =  kde( worksheetData.map(function(d){  return d.price; }) )

  // Plot the area
  svg.append("path")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );*/

 });
 
 
 


	
    }, function(err) {

      // something went wrong in initialization
      $("#resultBox").html("Error while Initializing: " + err.toString());
    });
  });
  
  
});


