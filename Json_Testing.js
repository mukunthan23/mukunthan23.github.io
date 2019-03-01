
$(document).ready(function() {
// Hook up an event handler for the load button click.
// Wait to initialize until the button is clicked.

	tableau.extensions.initializeAsync().then(function() {

		// Initialization succeeded! Get the dashboard
		var dashboard = tableau.extensions.dashboardContent.dashboard;
		// Display the name of dashboard in the UI

		const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

		// Find a specific worksheet 
		var worksheet = worksheets.find(function (sheet) {
		return sheet.name === "Extension Testing";
		});

		// get the summary data for the sheet
		worksheet.getSummaryDataAsync().then(function (sumdata) {

			// The getSummaryDataAsync() method returns a DataTable
			// Map the DataTable (worksheetData) into a format for display, etc.
			var labels = [];
			var data = [];
			var worksheetData = sumdata.data;

			for (var i=0; i < worksheetData.length; i++) {
			labels.push(worksheetData[i][0].formattedValue);
			data.push(worksheetData[i][1].value);
		        //alert(worksheetData[i][0].formattedValue);
			//alert(worksheetData[i][1].value);
			}

			$("#resultBox").html(JSON.stringify(output));
		});

	}, function(err) {
	// something went wrong in initialization
	$("#resultBox").html("Error while Initializing: " + err.toString());
	});
});
