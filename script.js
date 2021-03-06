
var filterflag = 0;

//$(document).ready(function() {



	tableau.extensions.initializeAsync().then(function() {

		// Initialization succeeded! Get the dashboard
		var dashboard = tableau.extensions.dashboardContent.dashboard;
		// Display the name of dashboard in the UI
		const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

		// Find a specific worksheet 
		var worksheet = worksheets.find(function (sheet) {
		return sheet.name === "Extension Data";
		});
		

		dataload(worksheet);

		unregisterEventHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.FilterChanged, function (filterChangedHandler) {
		//alert("filter changed");
		filterflag = 1;
		dataload(worksheet);
		filterflag = 0;
		});

		// remove the event listener when done
		// unregisterEventHandlerFunction();
		
	}, function(err) {
	// something went wrong in initialization
	$("#resultBox").html("Error while Initializing: " + err.toString());
	});
	
//});

function dataload(worksheet)
{

	// get the summary data for the sheet
		worksheet.getSummaryDataAsync().then(function (sumdata) {
	
		var worksheetData = sumdata.data
		var jsonObj = [];
		var jsonObj1 = [];
	        var jsonObj3 = [];
					
		for (var i=0; i < worksheetData.length; i++) {
			
				if(i<16)
				{					
					item = {}
					item ["axis"] = worksheetData[i][3].value;
					item ["value"] = worksheetData[i][4].value;
					jsonObj.push(item);
				}

				if(i>15)
				{
					item = {}
					item ["axis"] = worksheetData[i][3].value;
					item ["value"] = worksheetData[i][4].value;
					jsonObj1.push(item);
					
				}
				
			}

			jsonObj3.push(jsonObj);
			jsonObj3.push(jsonObj1);
			
			var data=jsonObj3;
			
			//alert(JSON.stringify(jsonObj3));
			
			/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */
      
			////////////////////////////////////////////////////////////// 
			//////////////////////// Set-Up ////////////////////////////// 
			////////////////////////////////////////////////////////////// 
			var margin = {top: 100, right: 100, bottom: 100, left: 100},
				width = Math.min(900, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
					
			
			////////////////////////////////////////////////////////////// 
			//////////////////// Draw the Chart ////////////////////////// 
			////////////////////////////////////////////////////////////// 
			var color = d3.scale.ordinal()
				.range(["#1aa9a7","#1b365d","#ed7c31"]);
				
			var radarChartOptions = {
			  w: width,
			  h: height,
			  margin: margin,
			  maxValue: 5,
			  levels: 5,
			  roundStrokes: true,
			  color: color
			};
			//Call function to draw the Radar chart
			RadarChart(".radarChart", data, radarChartOptions);
		});
}
