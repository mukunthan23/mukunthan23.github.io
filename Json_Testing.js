
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

			
			var data1 = JSON.stringify(jsonObj);
			$("#resultBox").html(data1);
			
			alert("before data map");
			try {
			var dataMap = data1.reduce(function(map, node) {
			    map[node.name] = node;
			    return map;
			}, {});
			}
			catch(err) {
			 alert("error: "+err.message);
			}
			alert("after data map");

			// create the tree array
			var treeData = [];
			data1.forEach(function(node) {
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

			alert("after data tree");
			
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
				.attr("width", width + margin.right + margin.left)
				.attr("height", height + margin.top + margin.bottom)
			  .append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			root = treeData[0];
			root.x0 = height / 2;
			root.y0 = 0;

			update(root);

			d3.select(self.frameElement).style("height", "500px");

			alert("after d3 append");
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
				  .on("click", click);

			  nodeEnter.append("circle")
				  .attr("r", 1e-6)
				  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeEnter.append("text")
				  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
				  .attr("dy", ".35em")
				  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
				  .text(function(d) { return d.name; })
				  .style("fill-opacity", 1e-6);

			  // Transition nodes to their new position.
			  var nodeUpdate = node.transition()
				  .duration(duration)
				  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

			  nodeUpdate.select("circle")
				  .attr("r", 10)
				  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeUpdate.select("text")
				  .style("fill-opacity", 1);

			  // Transition exiting nodes to the parent's new position.
			  var nodeExit = node.exit().transition()
				  .duration(duration)
				  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
				  .remove();

			  nodeExit.select("circle")
				  .attr("r", 1e-6);

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
			  if (d.children) {
				d._children = d.children;
				d.children = null;
			  } else {
				d.children = d._children;
				d._children = null;
			  }
			  update(d);
			}
						
			alert("d3 end");

			
		});

	}, function(err) {
	// something went wrong in initialization
	$("#resultBox").html("Error while Initializing: " + err.toString());
	});
});
