var count=1;
var clickcount=0;
var filterflag = 0;
$(document).ready(function() {
// Hook up an event handler for the load button click.
// Wait to initialize until the button is clicked.

	tableau.extensions.initializeAsync().then(function() {

		// Initialization succeeded! Get the dashboard
		var dashboard = tableau.extensions.dashboardContent.dashboard;
		// Display the name of dashboard in the UI
		const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
		//const worksheets = tableau.extensions.dashboardContent.worksheets;
		
		/*var worksheet = worksheets.forEach(function (sheet) {
			alert(sheet.name);
			return sheet.name === "Extension Testing";
    });*/

		// Find a specific worksheet 
		var worksheet = worksheets.find(function (sheet) {
		return sheet.name === "Extension Testing";
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
});

function dataload(worksheet)
{
	
	if(filterflag ==1)
	{
		d3.select("#TreeGraph").remove();
	}
	count++;
	// get the summary data for the sheet
		worksheet.getSummaryDataAsync().then(function (sumdata) {

			// The getSummaryDataAsync() method returns a DataTable
			// Map the DataTable (worksheetData) into a format for display, etc.

			var jsonObj = [];
			var worksheetData = sumdata.data;
			var prev=worksheetData[0][0].value;

			for (var i=0; i < worksheetData.length; i++) {
			
				if(i==0)
				{
					
					item = {}
					item ["name"] = "Verbatim";
					item ["parent"] = "-";
					jsonObj.push(item);
					
					item = {}
					item ["name"] = worksheetData[i][0].value;
					item ["parent"] = "Verbatim";
					jsonObj.push(item);
				}
				if(prev==worksheetData[i][0].value)
				{
					item = {}
					item ["name"] = worksheetData[i][1].value;
					item ["parent"] = worksheetData[i][0].value;
					jsonObj.push(item);
				}
				else
				{
					item = {}
					item ["name"] = worksheetData[i][0].value;
					item ["parent"] = "Verbatim";
					jsonObj.push(item);
					
					item = {}
					item ["name"] = worksheetData[i][1].value;
					item ["parent"] = worksheetData[i][0].value;
					jsonObj.push(item);
					
					prev=worksheetData[i][0].value;
				}
			}

			
			var data = (jsonObj);
			//$("#resultBox").html(JSON.stringify(jsonObj));
			var dataMap = data.reduce(function(map, node) {
			    map[node.name] = node;
			    return map;
			}, {});


			// create the tree array
			var treeData = [];
			data.forEach(function(node) {
			    // add to parent
			    var parent = dataMap[node.parent];
			    if (parent) {
				// create child array if it doesn't exist
				(parent.children || (parent.children = []))
				    // add node to child array
				    .push(node);
			    } else {
				// parent is null or missing
				treeData.push(node);
			    }
			});
			
			var margin = {top: 20, right: 120, bottom: 20, left: 120},
			width = 960 - margin.right - margin.left,
			height = 500 - margin.top - margin.bottom;

			var i = 0,
				duration = 750,
				root;

			var tree = d3.layout.tree()
				.size([height, width]);

			var diagonal = d3.svg.diagonal()
				.projection(function(d) { return [d.y, d.x]; });

			var svg = d3.select("body").append("svg")
			    .attr("id","TreeGraph")
				.attr("width", width + margin.right + margin.left)
				.attr("height", height + margin.top + margin.bottom)
			    .append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			root = treeData[0];
			root.x0 = height / 2;
			root.y0 = 0;
			
			function toggleAll(d) {
				if (d.children) {
					d.children.forEach(toggleAll);
					click(d);
				}
			}

			  // Initialize the display to show a few nodes.
			root.children.forEach(toggleAll);
			selected = root.name[0];
			colored = selected;
			click(selected);
			update(root);

			//d3.select(self.frameElement).style("height", "500px");
			function update(source) {

			  // Compute the new tree layout.
			  var nodes = tree.nodes(root).reverse(),
				  links = tree.links(nodes);

			  // Normalize for fixed-depth.
			  nodes.forEach(function(d) { d.y = d.depth * 180; });

			  // Update the nodes…
			  var node = svg.selectAll("g.node")
				  .data(nodes, function(d) { return d.id || (d.id = ++i); });

			  // Enter any new nodes at the parent's previous position.
			  var nodeEnter = node.enter().append("g")
				  .attr("class", "node")
				  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
				  //.on("click", click);
				  .on("click", function(d) {
		  //on first click, hide explainer div
		  //document.getElementById("intro").style.display = "none";

		  //expand if clicked node is not root & not selected
		  //todo: set filter on parents where one bureau exists in multiple agencies
		  if(d.depth==1 && d!=selected){ 
		   
			click(selected);
			 clickcount=1; 
			click(d); 
			update(d); 
		  } else {
			
			colored=d;
			update(d);
		  }
		});

			  nodeEnter.append("circle")
				  .attr("r", 4.5)
				  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeEnter.append("text")
				  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
				  .attr("dy", ".35em")
				  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
				  .attr("font-size",function(d) { return d.depth==0?"14px":"11px"})
				  .text(function(d) { return d.name; })
				  .style("fill-opacity", 1e-6);

			  // Transition nodes to their new position.
			  var nodeUpdate = node.transition()
				  .duration(duration)
				  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

			  nodeUpdate.select("circle")
				  .attr("r", 4.5)
				  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeUpdate.select("text")
				  .style("fill-opacity", 1);

			  // Transition exiting nodes to the parent's new position.
			  var nodeExit = node.exit().transition()
				  .duration(duration)
				  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
				  .remove();

			  nodeExit.select("circle")
				  .attr("r", 4.5);

			  nodeExit.select("text")
				  .style("fill-opacity", 1e-6);

			  // Update the links…
			  var link = svg.selectAll("path.link")
				  .data(links, function(d) { return d.target.id; });

			  // Enter any new links at the parent's previous position.
			  link.enter().insert("path", "g")
				  .attr("class", "link")
				  .attr("d", function(d) {
					var o = {x: source.x0, y: source.y0};
					return diagonal({source: o, target: o});
				  });

			  // Transition links to their new position.
			  link.transition()
				  .duration(duration)
				  .attr("d", diagonal);

			  // Transition exiting nodes to the parent's new position.
			  link.exit().transition()
				  .duration(duration)
				  .attr("d", function(d) {
					var o = {x: source.x, y: source.y};
					return diagonal({source: o, target: o});
				  })
				  .remove();

			  // Stash the old positions for transition.
			  nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			  });
			}

			// Toggle children on click.
			function click(d) {
				  selected = d;
				  colored = selected;
			  if (d.children) {
				d._children = d.children;
				d.children = null;
			  } else {
				d.children = d._children;
				d._children = null;
			  }
			  
			if(filterflag==0 && clickcount==1)
				{
					clickcount=0;

					try{	
						var fieldname="Category 1";
						var fieldvalue=d.name;
						//var dashboard1 = tableau.extensions.dashboardContent.dashboard;
							
						//const worksheets1 = tableau.extensions.dashboardContent.dashboard.worksheets;
							
						/*var worksheet1 = worksheets1.find(function (sheet) {
						return sheet.name === "Filter Testing";
						});*/

						//alert("work: "+ worksheet1.name);
						
						//worksheet1.clearFilterAsync(fieldname);
						//worksheet1.applyFilterAsync(fieldname,fieldvalue,tableau.FilterUpdateType.REPLACE);
						var parameter;
						tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(params => {
						parameter = params.find(param => param.name === "Test_Param");
						//alert(parameter.name);
						 parameter.changeValueAsync(fieldvalue);
        
						});
						
					}
						catch(err) 
						{
							  alert(err.message);
						}
						 // update(d);
				}
			}
									
		});
}
