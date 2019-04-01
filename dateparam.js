

$(document).ready(function() {
// Hook up an event handler for the load button click.
// Wait to initialize until the button is clicked.

var dateformat = new Date().toLocaleDateString("en-US");
	tableau.extensions.initializeAsync().then(function() {

						var parameter;
						tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(params => {
						parameter = params.find(param => param.name === "EndDate");
						parameter.changeValueAsync(dateformat);
        
						});
		
	}, function(err) {
	// something went wrong in initialization
	$("#resultBox").html("Error while Initializing: " + err.toString());
	});
});