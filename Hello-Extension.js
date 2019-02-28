'use strict';
$(document).ready(function() {
  // Hook up an event handler for the load button click.
  // Wait to initialize until the button is clicked.
  $("#initializeButton").click(function() {
	  
    alert("click sucess");
    // Disable the button after it's been clicked
    $("#initializeButton").prop('disabled', true);
    tableau.extensions.initializeAsync().then(function() {
    alert("tableau function sucess");
      // Initialization succeeded! Get the dashboard
      var dashboard = tableau.extensions.dashboardContent.dashboard;
      // Display the name of dashboard in the UI
      $("#resultBox").html("I'm running in a dashboard named <strong>" + dashboard.name + "</strong>");
	  
	 // var worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    
	    
//$("#resultBox1").html("I'm running in a dashboard named <strong>" + worksheet.name + "</strong>");
	
	// get the summary data for the sheet
	
    }, function(err) {
      // something went wrong in initialization
      $("#resultBox").html("Error while Initializing: " + err.toString());
    });
	   alert("after tableau fucntion");
  });
  
  
});
