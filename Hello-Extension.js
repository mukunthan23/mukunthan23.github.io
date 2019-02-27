

$(document).ready(function() {

  // Hook up an event handler for the load button click.
  // Wait to initialize until the button is clicked.
  $("#initializeButton").click(function() {
	  


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
	
	// get the summary data for the sheet
 worksheet.getSummaryDataAsync().then(function (sumdata) {

  const worksheetData = sumdata;
  // The getSummaryDataAsync() method returns a DataTable
  // Map the DataTable (worksheetData) into a format for display, etc.
  $("#resultBox1").html("I'm running in a dashboard named <strong>" + dashboard.name + "</strong>");
  
 });
  

 
 
 


	
    }, function(err) {

      // something went wrong in initialization
      $("#resultBox").html("Error while Initializing: " + err.toString());
    });
  });
  
  
});


