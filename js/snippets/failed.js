		/* BIKE ROUTES ATTEMPT #1
		
		
		theNum=0 													// local iterator 
		theAssessorHtml +="<a name='BookmarkBikeRoutes'></a>" 		// link from top of page
		if (isLayerVisible("SFMTA Bike Network April 2015")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BIKE ROUTES: </span><input class='NoPrint' onclick='showHideMap(\"SFMTA Bike Network April 2015\");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='SFMTA Bike Network April 2015' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BIKE ROUTES: </span><input class='NoPrint' onclick='showHideMap(\"SFMTA Bike Network April 2015\");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='SFMTA Bike Network April 2015' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "bikeroutebuffer") {
				theNum = theNum + 1  // add table headers in first iteration, set header names below
				if (theNum==1) {
					theAssessorHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Street</b></td><td><b>Facility Type</b></td><td><b>Bike Route Number</b></td></tr>"
				}
				if (result.feature.attributes["NUMBER_"] != null) {
				//theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>"+ result.feature.attributes["NUMBER_"] + "</td><td class='NoPrint'> </td><td class='NoPrint'> &nbsp; </tr></table>"
				theAssessorHtml += "<tr><td style='width:250px;'>" + result.feature.attributes["STREETNAME"] + " " + result.feature.attributes["TYPE"] + "</td><td>" +result.feature.attributes["FACILITY_T"] + "</td><td>" + result.feature.attributes["_NUMBER"] + "</td></tr>"
				theNum=theNum+1
				}
			}
		}
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		// END OF BIKE ROUTES SECTION
		*/
