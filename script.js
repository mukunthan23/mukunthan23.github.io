/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */
      
			////////////////////////////////////////////////////////////// 
			//////////////////////// Set-Up ////////////////////////////// 
			////////////////////////////////////////////////////////////// 
			var margin = {top: 100, right: 100, bottom: 100, left: 100},
				width = Math.min(2000, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
					
			////////////////////////////////////////////////////////////// 
			////////////////////////// Data ////////////////////////////// 
			////////////////////////////////////////////////////////////// 
			var data = [



					[//Samsung
						{axis:"GOAL & STRATEGY SETTING",value:1},
						{axis:"GOVERNANCE",value:2},
						{axis:"CX ROADMAP",value:2},
						{axis:"PROGRAM MANAGEMENT",value:2},
						{axis:"BEHAVIORAL MEASUREMENT",value:1},
						{axis:"INSIGHT ARCHITECTURE",value:1},
						{axis:"EXPERIENCE MAPPING",value:4},
						{axis:"OPERATIONAL SYSTEMS",value:2},
						{axis:"PORTFOLIO MANAGEMENT",value:2},	
						{axis:"RESOURCE ALLOCATION",value:1},	
						{axis:"EXPERIENCE DESIGN",value:3},	
						{axis:"CAUSAL MODELING",value:3},	
						{axis:"COMMUNICATION",value:3},	
						{axis:"COMPETENCY BUILDING",value:1},	
						{axis:"PERFORMANCE MANAGEMENT",value:3},	
						{axis:"EMPLOYEE AND PARTNER EXPERIENCE",value:2}
					  ],[//Nokia Smartphone
						{axis:"GOAL & STRATEGY SETTING",value:3},
						{axis:"GOVERNANCE",value:4},
						{axis:"CX ROADMAP",value:4},
						{axis:"PROGRAM MANAGEMENT",value:5},
						{axis:"BEHAVIORAL MEASUREMENT",value:2},
						{axis:"INSIGHT ARCHITECTURE",value:3},
						{axis:"EXPERIENCE MAPPING",value:5},
						{axis:"OPERATIONAL SYSTEMS",value:4},
						{axis:"PORTFOLIO MANAGEMENT",value:3},	
						{axis:"RESOURCE ALLOCATION",value:2},	
						{axis:"EXPERIENCE DESIGN",value:4},	
						{axis:"CAUSAL MODELING",value:5},	
						{axis:"COMMUNICATION",value:4},	
						{axis:"COMPETENCY BUILDING",value:3},	
						{axis:"PERFORMANCE MANAGEMENT",value:5},	
						{axis:"EMPLOYEE AND PARTNER EXPERIENCE",value:3}
					  ]
					];
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
