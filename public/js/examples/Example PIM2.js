//ACCELA_DEV2

/************************************************************************************************************

Title:		San Francisco Property Information Map
Author: 	Mike Wynne (mike.wynne@sfgov.org)
		City & County of San Francisco Planning Department
Created:	April 2011
Description:	Searches for an address, parcel, block, place name, Planning Dept project or Dept of Building Inspections 
		permit and then creates reports displaying relevant property information, Planning Dept zoning, Planning 
		Dept projects, Dept of Building Inspections permits, Miscellaneous Permits routed through the Planning 
		Dept by other City departments, Board of Appeals decisions and Planning Dept enforcement complaints.
Technology:	HTML
		JavaScript
		Google Maps API v3
		ArcGIS Server Javascript API v3.5
		ArcGIS Server REST API
		.net web services
		Ajax
		IIS 8
		JQuery
		Hosted on Amazon Cloud (Amazon Web Services)
		
************************************************************************************************************/	
	//set the window resize event
	window.onresize = window_resize;

	var polyline;
	var dynamicMap = null;
	var dynamicMap2 = null;
	var imageParams = null;
	var findTask = null;
	var findTaskBlock = null;
	var findTaskCase = null;
	var params = null;
	var paramsBlock = null;
	var mapExtension = null;
	var theSearchType = null;
	var theSearchString = null;
	var globaltmpString = null;
	var geometryService;
	var amIMeasuring = false;
	var polygon = null;
	var theSearch = null;
	var gsvc;
	var buffParams;
	var buffOvs = [];
	var identifyOvs = [];
	var theBufferDist= null;
	var imbuffering=false;
	var imidentifying=false;
	var findResults=[];
	var theSearchType = null;
	var theSearchString = null;
	var qtask = null;
	var query = null;
	var clicked = null;
	var theClickedCoord = null;
	var marker = null;
	var overlay= null;
	var latLng = null;
	var theZoningHtml = "";
	var theAssessorHtml = "";
	var theSurveyRatingsHtml = "";
	var theCaseTrackingHtml = "";
	var thePermitsHtml = "";
	var theMiscPermitsHtml = "";
	var theEnforcementHtml = "";
	var theAppealsHtml = "";
	var theBBNsHtml = "";
	var theNeighborhood=""
	var isNeighborhood=false;
	var isDistrict=false;
	var theSFFindElectedHtml = "";
	var theSFFindPlacesHtml = "";
	var theSFFindServicesHtml = "";
	var theSFFindInfoHtml = "";
	var polygonCenter = null;
	var theBlock = null;
	var theLot = null;
	var idResults = null;
	var instructions = null;
	var tabwidth;
	var iPadUser = null;
	var iPhoneUser = null;
	var iPodUser = null;
	var startScale = 12;
	var viewportwidth = null;
	var viewportheight = null;
	var myheight = null;
	var init = true;
	var theYearBuilt="";
	var theMapSize="small";
	var theServerName = window.location.host;
	var theArcGISServerName = "http://"+theServerName+"/arcgis/rest/services/PIM_v2_8/MapServer";
	var theVersion="2.8.2"
	
	//Use this with secure service and token based access
	//var theArcGISServerName = "http://"+theServerName+"/arcgis/rest/services/PIM_v2_3/MapServer?token=y6eMuthiwBPDwx0hkzq8zasvwpA_R88VCcv-d4Pl0Cq7ftj3v39lNVCHctTB6JCQ7my7oepVUxWlv2nvyS4STQ..";
	var theSFFindServerName = "http://"+theServerName+"/arcgis/rest/services/SFFind/MapServer";
	var theSFFindNeighborhoodServerName = "http://"+theServerName+"/arcgis/rest/services/SFFindNeighborhoods/MapServer";
	//prompt("",theSFFindNeighborhoodServerName)
	var thefindResults = null;
	var theNum;
	var theAddressLot = "";
	var themapblklot="";
	var theLinkAddress="";
	var tabNo = 0;
	var lastSearchClick=false;
	var theGeometry = null;
	var polygonBounds = null;
	var theGeometries = null;
	var theReportTitle = null;
	var theXWGSAux =null;
	var theYWGSAux =null;
	var coordProjected=false;
	
	//Set up variables to be used to check if the user is within CCSF network or not and which dept
	var theLoc="Out of City";
	var theLocMaster="Out of City";
	var theURLtmp = 'http://' + theServerName +'/GetHost/GetIP.asmx/GetIP';
	var dept="";
	var sitename="";
	var theOrigType="";
	var theNeighborhoodParam="";
	var theDistrictParam="";
	var thetempAddress="";
	var LastDBIUpdate = "";
	var projHash = {};
	var theRes;
	var theBuffGeoms = new Array;
	var theSearchGraphic = null;
	var theGeom;
	var tabsReady=false;
	var tb =  null;
	var lengthParams = null;
	var resizeTimer;
	var withlatlong=false;
	var theBM=null;
	var bufferonmap=false;
	var queryTask;
	var query;
	var theAPN="";
	var theParcels=0;
	var theHistRes=""
	var themapblklotnum=0;
	var theParcelList = null;
	var theParcelListForAccela=""
	var theParcelListForAccelaPart2=""
		
	var accelaParcelListForPlanning
	var theSearchTypeDetailed=""
	var lookinRetired=false;
	var retiredParcelList=""
	var retiredParcels=""

    function initialize() {
	//Runs when page initially loads (from the html <body> onLoad event)
	//Creates the Google map and creates the ArcGIS Server dynamic map service which will be used to add GIS data to the Google Map.  
	//Also creates the find, query and identify tasks within ArcGIS Server.
	    
	//Check whether the user is in the CCSF network
	//If outside, the user will be shown a clearer, more concise version of the data.
	//Some department's want the ability to further filter the data to be more appropriate for their staff, so also check for a 'dept' specified in a URL parameter.
	//This calls an Ajax web service to check the user's IP to determine if in or out of the City network.

	theURLtmp = 'http://' + theServerName +'/GetHost/GetIP.asmx/GetIP'

	dept=gup("dept").toUpperCase();
	sitename=gup("name").toUpperCase();
	theNeighborhoodParam=gup("neighborhood")//.toUpperCase();
	theDistrictParam=gup("district")
	    
	if (sitename=="SFFIND") {
		//set up SFFind UI
		document.getElementById('mapTitle').innerHTML = ""//"SFFind"
		document.getElementById('searchExamples').innerHTML = ""
		document.getElementById('step1a').innerHTML = "Select a District or Neighborhood:<p style='margin:1px;'></p>"
		document.getElementById('addressInput').style.fontSize= "16px" 
		document.getElementById('addressInput').value ="e.g. 1 Dr Carlton B Goodlett Pl"
		document.getElementById('addressInput').style.height= "26px" 
		document.getElementById('addressInput').style.width= "230px" // ="display: inline; margin: 0; border-style:inset; border-color: #ffffff; vertical-align: middle; font-size: 25px; height: 34px; width: 335px"
		document.getElementById('findButton').style.height= "26px"
		document.title= "SFFind"
		document.getElementById('lnkHelp').innerHTML ="SF Find Help"
		document.getElementById('lnkHelp').href="SFFindHelp.html"
		document.getElementById('lnkHelpDisclaimer').href="SFFindHelp.html#Disclaimer"
		document.getElementById('feedbackLink').href="SFFindHelp.html#Feedback"
		document.getElementById('logos').innerHTML="<a alt='DT' title='DT' target='_blank' href='http://www.sfgov3.org/index.aspx?page=1421'><img border=0 height='28px' alt='San Francisco Department of Technology' title='San Francisco Department of Technology' src='images/dt_circle_logo_30.png' ></a>&nbsp; &nbsp; &nbsp; &nbsp;<a alt='EmpowerSF' title='EmpowerSF' target='_blank' href='http://empowersf.org'><img border=0 height='28px' alt='San Francisco Neighborhood Empowerment Network' title='San Francisco Neighborhood Empowerment Network' src='images/nenlogo.png' ></a>&nbsp; &nbsp; &nbsp; &nbsp;<a alt='MONS' title='MONS' target='_blank' href='http://www.sfmayor.org/index.aspx?page=20'><img border=0 height='28px' alt='San Francisco Mayors Office of Neighborhood Services' title='San Francisco Mayors Office of Neighborhood Services' src='images/monswhite.png' ></a>&nbsp; &nbsp; &nbsp; &nbsp;<a alt='San Francisco Planning Department' title='San Francisco Planning Department' target='_blank' href='http://www.sfplanning.org'><img border=0 alt='San Francisco Planning Department' title='San Francisco Planning Department' src='images/DCP_Logotrans.gif' ></a>"
		document.getElementById('translatecell').innerHTML=""
		
		var elX = document.getElementById('tabpane').offsetLeft
		var theTranslatePos = elX-160
		document.getElementById('mapTag').innerHTML="<table border=0><tr><td width='" +theTranslatePos + "px'>&nbsp;</td><td ><div id='google_translate_element'></div></td></tr></table>"
		
		if (document.getElementsByTagName('body')[0].clientWidth>1100) {
			document.getElementById('sffinddropdowncell').style.width= "70px"
		} else {
			document.getElementById('sffinddropdowncell').style.width= "50px"
		}
		document.getElementById('searchformcell').style.textAlign="left"
		
		document.getElementById('SFFindNeighborhoodDropDownInstructions').innerHTML = "<p style='margin:3px;'></p>Or Type an Address and Click Search:"
		var htmltemp = ""
		htmltemp +="<table width='100%'><tr><td style='text-align:left;'><form id='neighborhoodForm' style='display: inline; margin: 0; vertical-align:bottom; padding: 0px;' action=''; onsubmit='clicked=false; theSearchType=null; showAddress(this.address.value); return false'>"
		htmltemp +="<p style='margin:3px;'></p>"
		htmltemp +="<select onChange='javascript:isNeighborhood=true; showAddress(this.value);' id='neighborhoodSelect' title='Select a neighborhood or Supervisor District from the list...' alt='Select a neighborhood or Supervisor District from the list...' style='font-size:16px;width:230px'>"
		htmltemp +="  <option value='...select a neighborhood'>select one...</option>"
		htmltemp +="  <option value='Supervisor District 1'>Supervisor District 1</option>"
		htmltemp +="  <option value='Supervisor District 2'>Supervisor District 2</option>"
		htmltemp +="  <option value='Supervisor District 3'>Supervisor District 3</option>"
		htmltemp +="  <option value='Supervisor District 4'>Supervisor District 4</option>"
		htmltemp +="  <option value='Supervisor District 5'>Supervisor District 5</option>"
		htmltemp +="  <option value='Supervisor District 6'>Supervisor District 6</option>"
		htmltemp +="  <option value='Supervisor District 7'>Supervisor District 7</option>"
		htmltemp +="  <option value='Supervisor District 8'>Supervisor District 8</option>"
		htmltemp +="  <option value='Supervisor District 9'>Supervisor District 9</option>"
		htmltemp +="  <option value='Supervisor District 10'>Supervisor District 10</option>"
		htmltemp +="  <option value='Supervisor District 11'>Supervisor District 11</option>"
		htmltemp +="  <option value='Alamo Square'>Alamo Square</option>"
		htmltemp +="  <option value='Anza Vista'>Anza Vista</option>"
		htmltemp +="  <option value='Apparel City'>Apparel City</option>"
		htmltemp +="  <option value='Aquatic Park / Ft. Mason'>Aquatic Park / Ft. Mason</option>"
		htmltemp +="  <option value='Ashbury Heights'>Ashbury Heights</option>"
		htmltemp +="  <option value='Balboa Terrace'>Balboa Terrace</option>"
		htmltemp +="  <option value='Bayview'>Bayview</option>"
		htmltemp +="  <option value='Bernal Heights'>Bernal Heights</option>"
		htmltemp +="  <option value='Bret Harte'>Bret Harte</option>"
		htmltemp +="  <option value='Buena Vista'>Buena Vista</option>"
		htmltemp +="  <option value='Candlestick Point SRA'>Candlestick Point SRA</option>"
		htmltemp +="  <option value='Castro'>Castro</option>"
		htmltemp +="  <option value='Cathedral Hill'>Cathedral Hill</option>"
		htmltemp +="  <option value='Cayuga'>Cayuga</option>"
		htmltemp +="  <option value='Central Waterfront'>Central Waterfront</option>"
		htmltemp +="  <option value='Chinatown'>Chinatown</option>"
		htmltemp +="  <option value='Civic Center'>Civic Center</option>"
		htmltemp +="  <option value='Clarendon Heights'>Clarendon Heights</option>"
		htmltemp +="  <option value='Cole Valley'>Cole Valley</option>"
		htmltemp +="  <option value='Corona Heights'>Corona Heights</option>"
		htmltemp +="  <option value='Cow Hollow'>Cow Hollow</option>"
		htmltemp +="  <option value='Crocker Amazon'>Crocker Amazon</option>"
		htmltemp +="  <option value='Diamond Heights'>Diamond Heights</option>"
		htmltemp +="  <option value='Dogpatch'>Dogpatch</option>"
		htmltemp +="  <option value='Dolores Heights'>Dolores Heights</option>"
		htmltemp +="  <option value='Downtown / Union Square'>Downtown / Union Square</option>"
		htmltemp +="  <option value='Duboce Triangle'>Duboce Triangle</option>"
		htmltemp +="  <option value='Eureka Valley'>Eureka Valley</option>"
		htmltemp +="  <option value='Excelsior'>Excelsior</option>"
		htmltemp +="  <option value='Fairmount'>Fairmount</option>"
		htmltemp +="  <option value='Financial District'>Financial District</option>"
		htmltemp +="  <option value='Fishermans Wharf'>Fisherman's Wharf</option>"
		htmltemp +="  <option value='Forest Hill'>Forest Hill</option>"
		htmltemp +="  <option value='Forest Knolls'>Forest Knolls</option>"
		htmltemp +="  <option value='Glen Park'>Glen Park</option>"
		htmltemp +="  <option value='Golden Gate Heights'>Golden Gate Heights</option>"
		htmltemp +="  <option value='Golden Gate Park'>Golden Gate Park</option>"
		htmltemp +="  <option value='Haight Ashbury'>Haight Ashbury</option>"
		htmltemp +="  <option value='Hayes Valley'>Hayes Valley</option>"
		htmltemp +="  <option value='Holly Park'>Holly Park</option>"
		htmltemp +="  <option value='Hunters Point'>Hunters Point</option>"
		htmltemp +="  <option value='India Basin'>India Basin</option>"
		htmltemp +="  <option value='Ingleside'>Ingleside</option>"
		htmltemp +="  <option value='Ingleside Terraces'>Ingleside Terraces</option>"
		htmltemp +="  <option value='Inner Richmond'>Inner Richmond</option>"
		htmltemp +="  <option value='Inner Sunset'>Inner Sunset</option>"
		htmltemp +="  <option value='Japantown'>Japantown</option>"
		htmltemp +="  <option value='Laguna Honda'>Laguna Honda</option>"
		htmltemp +="  <option value='Lake Street'>Lake Street</option>"
		htmltemp +="  <option value='Lakeshore'>Lakeshore</option>"
		htmltemp +="  <option value='Laurel Heights / Jordan Park'>Laurel Heights / Jordan Park</option>"
		htmltemp +="  <option value='Lincoln Park / Ft. Miley'>Lincoln Park / Ft. Miley</option>"
		htmltemp +="  <option value='Little Hollywood'>Little Hollywood</option>"
		htmltemp +="  <option value='Lone Mountain'>Lone Mountain</option>"
		htmltemp +="  <option value='Lower Haight'>Lower Haight</option>"
		htmltemp +="  <option value='Lower Nob Hill'>Lower Nob Hill</option>"
		htmltemp +="  <option value='Lower Pacific Heights'>Lower Pacific Heights</option>"
		htmltemp +="  <option value='Marina'>Marina</option>"
		htmltemp +="  <option value='McLaren Park'>McLaren Park</option>"
		htmltemp +="  <option value='Merced Heights'>Merced Heights</option>"
		htmltemp +="  <option value='Merced Manor'>Merced Manor</option>"
		htmltemp +="  <option value='Midtown Terrace'>Midtown Terrace</option>"
		htmltemp +="  <option value='Mint Hill'>Mint Hill</option>"
		htmltemp +="  <option value='Miraloma Park'>Miraloma Park</option>"
		htmltemp +="  <option value='Mission'>Mission</option>"
		htmltemp +="  <option value='Mission Bay'>Mission Bay</option>"
		htmltemp +="  <option value='Mission Dolores'>Mission Dolores</option>"
		htmltemp +="  <option value='Mission Terrace'>Mission Terrace</option>"
		htmltemp +="  <option value='Monterey Heights'>Monterey Heights</option>"
		htmltemp +="  <option value='Mt. Davidson Manor'>Mt. Davidson Manor</option>"
		htmltemp +="  <option value='Nob Hill'>Nob Hill</option>"
		htmltemp +="  <option value='Noe Valley'>Noe Valley</option>"
		htmltemp +="  <option value='North Beach'>North Beach</option>"
		htmltemp +="  <option value='Northern Waterfront'>Northern Waterfront</option>"
		htmltemp +="  <option value='Oceanview'>Oceanview</option>"
		htmltemp +="  <option value='Outer Mission'>Outer Mission</option>"
		htmltemp +="  <option value='Outer Richmond'>Outer Richmond</option>"
		htmltemp +="  <option value='Outer Sunset'>Outer Sunset</option>"
		htmltemp +="  <option value='Pacific Heights'>Pacific Heights</option>"
		htmltemp +="  <option value='Panhandle'>Panhandle</option>"
		htmltemp +="  <option value='Parkmerced'>Parkmerced</option>"
		htmltemp +="  <option value='Parkside'>Parkside</option>"
		htmltemp +="  <option value='Parnassus Heights'>Parnassus Heights</option>"
		htmltemp +="  <option value='Peralta Heights'>Peralta Heights</option>"
		htmltemp +="  <option value='Polk Gulch'>Polk Gulch</option>"
		htmltemp +="  <option value='Portola'>Portola</option>"
		htmltemp +="  <option value='Potrero Hill'>Potrero Hill</option>"
		htmltemp +="  <option value='Presidio Heights'>Presidio Heights</option>"
		htmltemp +="  <option value='Presidio National Park'>Presidio National Park</option>"
		htmltemp +="  <option value='Presidio Terrace'>Presidio Terrace</option>"
		htmltemp +="  <option value='Produce Market'>Produce Market</option>"
		htmltemp +="  <option value='Rincon Hill'>Rincon Hill</option>"
		htmltemp +="  <option value='Russian Hill'>Russian Hill</option>"
		htmltemp +="  <option value='Seacliff'>Seacliff</option>"
		htmltemp +="  <option value='Sherwood Forest'>Sherwood Forest</option>"
		htmltemp +="  <option value='Showplace Square'>Showplace Square</option>"
		htmltemp +="  <option value='Silver Terrace'>Silver Terrace</option>"
		htmltemp +="  <option value='South Beach'>South Beach</option>"
		htmltemp +="  <option value='South of Market'>South of Market</option>"
		htmltemp +="  <option value='St. Francis Wood'>St. Francis Wood</option>"
		htmltemp +="  <option value='St. Marys Park'>St. Mary's Park</option>"
		htmltemp +="  <option value='Stonestown'>Stonestown</option>"
		htmltemp +="  <option value='Sunnydale'>Sunnydale</option>"
		htmltemp +="  <option value='Sunnyside'>Sunnyside</option>"
		htmltemp +="  <option value='Sutro Heights'>Sutro Heights</option>"
		htmltemp +="  <option value='Telegraph Hill'>Telegraph Hill</option>"
		htmltemp +="  <option value='Tenderloin'>Tenderloin</option>"
		htmltemp +="  <option value='Treasure Island'>Treasure Island</option>"
		htmltemp +="  <option value='Union Street'>Union Street</option>"
		htmltemp +="  <option value='University Mound'>University Mound</option>"
		htmltemp +="  <option value='Upper Market'>Upper Market</option>"
		htmltemp +="  <option value='Visitacion Valley'>Visitacion Valley</option>"
		htmltemp +="  <option value='West Portal'>West Portal</option>"
		htmltemp +="  <option value='Western Addition'>Western Addition</option>"
		htmltemp +="  <option value='Westwood Highlands'>Westwood Highlands</option>"
		htmltemp +="  <option value='Westwood Park'>Westwood Park</option>"
		htmltemp +="  <option value='Yerba Buena Island'>Yerba Buena Island</option>"
		htmltemp +="</select></td></tr></table>"
		
		htmltemp +="</form>"
		document.getElementById('SFFindNeighborhoodDropDown').innerHTML = htmltemp
		document.getElementById('SFFindMapInstructions').innerHTML = "<p style='margin:3px;'></p>Or Click on the Map:"
		document.getElementById('step2a').innerHTML='Review Neighborhood Information'
		document.getElementById('searchPaneText').innerHTML='Click tabs below to view neighborhood information'
		document.getElementById('appHeader1a').innerHTML = '<a href="javascript:publicVersion();"> <img style="height: 61px; text-decoration: none; border: 0 none;" id="bannerIcon" src="images/SFFindLogoColor.png"/></a>'
		theArcGISServerName = theSFFindServerName
		
		
		
	} else {
		//getLastDBIUpdate();
		//set up Property Information Map UI
		//map title set by the getLocation function which will be run next (changes the PIM title based on the location of the user (inside the City network - internal version)
		document.getElementById('searchExamples').innerHTML ='<table style="padding: 3px;" class="searchExamples" border=0><tr><td><span><i>Search Examples: </i>&nbsp &nbsp<span></td><td> <span>400 Van Ness Ave</span></td><td><span> 0787/001</span></td></tr><tr><td></td><td> <span>Mission and Van Ness &nbsp; &nbsp;</span></td><td><span>2011.0218</span></td></tr><tr><td></td><td><span >Ferry Building</span></td><td></td></tr></table>'
		document.getElementById('step2a').innerHTML='Review Property Information'
		document.getElementById('mapTag').innerHTML='Public Access to Useful Property Information & Resources at the Click of a Mouse'
		document.getElementById('searchPaneText').innerHTML='Click tabs below to view property or parcel information'
		
	}
	 
	getLocation(theURLtmp)
	    
	//set up the window to work best with the browser shape and size
	window_resize();
	init=false;
	
	//create the HTML that will be used to populate the reports inside the tabs.  Initially just display a message saying this is where the reports will appear.
	instructions = "<div border=0 style=' margin-left:" + (tabwidth/4) + "px; margin-top:" + (myheight/4) + "px'><table border=0><tr><td class='introText' >This area will remain empty until you search or click on the map.</td></tr></table></div>"
	document.getElementById('AssessorReport').innerHTML = instructions
	document.getElementById('ZoningReport').innerHTML = instructions
	document.getElementById('SurveyRatingsReport').innerHTML = instructions
	document.getElementById('CaseTrackingReport').innerHTML = instructions
	document.getElementById('PermitsReport').innerHTML = instructions
	document.getElementById('MiscPermitsReport').innerHTML = instructions
	document.getElementById('EnforcementReport').innerHTML = instructions 
	document.getElementById('AppealsReport').innerHTML = instructions 
	document.getElementById('BBNsReport').innerHTML = instructions 
	
	document.getElementById('version').innerHTML = theVersion
    
	//Set up the ArcGIS server dynamic map service
	
	var imageParams = new esri.layers.ImageParameters();
	imageParams.layerIds = [9999];
	//imageParams.layerOption = "show"
	imageParams.transparent = true;
	dynamicMap = null;

        //imageParams.format = "jpeg";  //set the image type to PNG24, note default is PNG8.
        //Takes a URL to a non cached map service.
	dynamicMap = new esri.layers.ArcGISDynamicMapServiceLayer(theArcGISServerName, {"opacity":0.75, "imageParameters":imageParams});
	if (sitename=="SFFIND") {
		dynamicMap2 = new esri.layers.ArcGISDynamicMapServiceLayer(theSFFindNeighborhoodServerName, {"opacity":0.75, "imageParameters":imageParams});
		identifyTask2 = new esri.tasks.IdentifyTask(theSFFindNeighborhoodServerName);
	}
	
        dynamicMap.setVisibleLayers([9999]);
	map.addLayer(dynamicMap);

	findTask = new esri.tasks.FindTask(theArcGISServerName);
	//Set up the ArcGIS Server Identify Task
	identifyTask = new esri.tasks.IdentifyTask(theArcGISServerName);
	
	
	
	//identify proxy page to use if the toJson payload to the geometry service is greater than 2000 characters.  
	esriConfig.defaults.io.proxyUrl ="../proxy/proxy.ashx";
	esri.config.defaults.io.alwaysUseProxy = false;
	
	gsvc = new esri.tasks.GeometryService("http://" + theServerName +"/arcgis/rest/services/Utilities/Geometry/GeometryServer");
	//prompt("","http://" + theServerName +"/arcgis/rest/services/Utilities/Geometry/GeometryServer")
	
	//Set up the buffer parameters for later use
	buffParams = new esri.tasks.BufferParameters();
	buffParams.unit = esri.tasks.GeometryService.UNIT_FOOT
	buffParams.unionResults = true;
	
	
	dojo.connect(map, "onClick", onMapClick)
	locator = new esri.tasks.Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");        
	//dojo.connect(locator, "onAddressToLocationsComplete", showGeocodeResults);
	
	dojo.connect(locator, "address-to-locations-complete", showGeocodeResults);
	
	//Creates a variable to hold the ArcGIS Server Find Task's parameters
	//params = new esri.arcgis.gmaps.FindParameters();
	params = new esri.tasks.FindParameters();
	
	zoomInDiv=document.getElementById("maximizeMap")
	
	dojo.connect(gsvc, "onLengthsComplete", outputDistance)
	if (sitename=="SFFIND") {
		dojo.connect(dynamicMap, "onLoad", function(){ 
		//dojo.connect(map, "onLoad", function(){ 
			if (theNeighborhoodParam!="") {
				isNeighborhood=true; 
				//showAddress(theNeighborhoodParam);
				whenMapReadyRunSearch(theNeighborhoodParam)				
				//setTimeout('showAddress(theNeighborhoodParam);',500)
			} else {
				if (theDistrictParam!="") {
					//alert(theDistrictParam);
					//setTimeout('showAddress(theDistrictParam);',500)
					//showAddress(theDistrictParam);	
					whenMapReadyRunSearch(theDistrictParam)
					isDistrict=true;
				} else {
					if (gup("search") != "")  {
						theSearchString = gup("search")
						document.getElementById("addressInput").value = theSearchString
						//setTimeout('showAddress(theSearchString);',500)
						//showAddress(theSearchString)
						whenMapReadyRunSearch(theSearchString)	
					}
				}
			}
		});
	} else {
		//dojo.connect(dynamicMap, "onLoad", function(){ 
			//alert("map.loaded "+map.loaded + "\ndynamicMap.loaded: " + dynamicMap.loaded)
			//dojo.connect(map, "onLoad", function(){
				if (gup("search") != "")  {
					theSearchString = gup("search")
					document.getElementById("addressInput").value = theSearchString
					whenMapReadyRunSearch(theSearchString);
				}	
					//			if (map.loaded && dynamicMap.loaded) {
		//				showAddress(theSearchString);
		//			} else {
		//				setTimeout('showAddress(theSearchString);',3000)
		//			}
					//setTimeout('showAddress(theSearchString);',1000)
		//		}
				//alert("map.loaded "+map.loaded + "\ndynamicMap.loaded: " + dynamicMap.loaded)
			//});
		//});
	}
	setTimeout(areTabsReady,50);
	setTimeout(googleStreetView,1200)
	//alert("aboput to run")
	theParamstmp="";
	runningUpdates(theParamstmp);
	//alert("here")
	
}

function whenMapReadyRunSearch(theSer){
	if (map.loaded && dynamicMap.loaded) {
		showAddress(theSer);
		
	} else {
		setTimeout('whenMapReadyRunSearch(theSearchString);',100)
	}
}

	function MeasureTool() {
		
		var theMessage = "<div style='text-align:left;'>To measure a distance:<br>  - Click on the map to start tracing a line to measure<br>  - Click again at any corner<br>  - Double click to finish<br><br>Click OK to continue or Cancel to stop measuring.</div>"
		//new Messi(theMessage, {title: 'Distance', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});
		new Messi(theMessage, {title: 'Distance', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK', val:0},{id: 1, label: 'Cancel', val:1}], callback: function(val){
			if (val==0){
				amIMeasuring=true;
				tb = new esri.toolbars.Draw(map);    
				lengthParams = new esri.tasks.LengthsParameters(); 	
				//on draw end add graphic, project it, and get new length      
				dojo.connect(tb, "onDrawEnd", function(geometry) {              
					lengthParams.polylines = [geometry];        
					lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_FOOT;        
					lengthParams.geodesic = true;               
					gsvc.lengths(lengthParams);        
					var graphic = map.graphics.add(new esri.Graphic(geometry, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]),2)));      
				});      
				//tb.activate(esri.toolbars.Draw.FREEHAND_POLYLINE);    
				tb.activate(esri.toolbars.Draw.POLYLINE);    
			} else {
				tb.deactivate();
			}
		}});
	}
	var lastResult=""
	function outputDistance(result) {  
		//sometimes calls function twice, if sending the result second time don't open the alert 
		if (result.lengths[0]!=lastResult) {
			theDist = dojo.number.format(result.lengths[0],{places: 1}) + " feet";
			new Messi(theDist, {title: 'Distance', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});
		}
		tb.deactivate();
		amIMeasuring=false;
		lastResult=result.lengths[0]
	}
    function areTabsReady() {
	if(!tabsReady) {
		setTimeout(areTabsReady, 50);//wait 50 millisecnds then recheck
		return;
	}
	if (gup("tab") !="") {
		//if there is a tab parameter in the URL switch to the tab the user stated.
		showTab('dhtmlgoodies_tabView1',gup("tab"));
	}
	theBM=gup("bookmark").toUpperCase()
	//alert(theBM)
    }


 function viewPort() {
	var h = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
	var w = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
	return { width : w , height : h }
 }


function window_resize() {
	//Runs after the web page is first loaded.  Also run whenever the browser is resized,
	//Deals with setting the size of the divs for the map and the tabs to fill the browser window (tab height needs to be set to a pixel size rather than 100%) 
	//There are different versions of the page for lower resolution browsers and mobile devices (just iPhone and iPad so far).
	    
	viewportwidth = viewPort().width
	viewportheight = viewPort().height
	//alert(viewportwidth + " x " + viewportheight)
	myheight = viewportheight-200
	var mapheight=""
	var tabHeight=myheight
	var isMob=false;

	if (  (navigator.userAgent.indexOf('iPhone')>0) || (navigator.userAgent.indexOf('iPod')>0) || (navigator.userAgent.indexOf('iPad')>0) || (navigator.userAgent.indexOf('Mobile')>0) ) {  
		isMob=true;
	}
	
	if (!isMob) {
		
		if (navigator.userAgent.indexOf('MSIE')>0) { 
			//document.getElementById("map_canvas").style.height = "100%" 
			document.getElementById("map_canvas").style.height = myheight -100  + "px"
			if (sitename=="SFFIND") {
				//alert("tabHeight: " + tabHeight)
				document.getElementById("map_canvas").style.height = myheight -118  + "px"
				mapHeight = myheight -108 
				tabHeight = myheight - 18
				//alert("tabHeight: " + tabHeight)
				
			} else {
				mapHeight = myheight -98 
				tabHeight = myheight - 10
			}
			//alert("large IE")
			
		} else {
			theoff = 185
			myheight = (viewportheight - 227)
			tabHeight=myheight
			if (sitename=="SFFIND") {
				document.getElementById("map_canvas").style.height = myheight -111  + "px"
				mapHeight = myheight -111 
			} else {
				//alert("non IE large")
				document.getElementById("map_canvas").style.height = myheight -97  + "px"
				mapHeight = myheight -97

			}
		}

		tabwidth=viewportwidth - 494;
		//tabwidth=2000
		if (viewportwidth < 1100 ) {
			if (sitename!="SFFIND") {
				document.getElementById("map_canvas").style.width= "392px"
				
			}
			//alert("small")
			document.getElementById("addressInput").style.width= "230px"
			//document.getElementById("addressInput").style.width= "180px"
			document.getElementById("addressInput").style.height="26px"
			document.getElementById("addressInput").style.fontSize="16px";
			document.getElementById("mapTitle").style.fontSize="23px";
			document.getElementById("mapTag").style.fontSize="13px";
			document.getElementById("step1").style.fontSize="18px";
			document.getElementById("step1a").style.fontSize="18px";
			document.getElementById("step2").style.fontSize="18px";
			document.getElementById("step2a").style.fontSize="18px";
			document.getElementById("topRow").style.height= "110px";
			document.getElementById("secondRow").style.height="14px";
			document.getElementById("blankRow2").style.height="0px";
			
			
			startScale=11;

			tabwidth=viewportwidth - 430;
	
			if (navigator.userAgent.indexOf('MSIE')>0) { 
				if (sitename=="SFFIND") {
					document.getElementById("map_canvas").style.height = myheight -108  + "px"
					tabHeight = myheight - 18
				} else {
					document.getElementById("map_canvas").style.height = myheight -88  + "px"
					tabHeight = myheight - 16
				}
			} else {
				theoff = 145
				if (sitename=="SFFIND") { 
					document.getElementById("map_canvas").style.height = myheight - 100 + "px"
					mapHeight = myheight -100
				} else {
					document.getElementById("map_canvas").style.height = myheight - 78  + "px"
					mapHeight = myheight -78
				}
			
			}
		} else {
			if (viewportwidth <1155) {
				//alert("medium")
				if (sitename!="SFFIND") {
					document.getElementById("map_canvas").style.width= "440px"
					document.getElementById("addressInput").style.width= "230px"
					document.getElementById("addressInput").style.height="26px"
					document.getElementById("addressInput").style.fontSize="16px";
					document.getElementById("mapTitle").style.fontSize="23px";
					document.getElementById("mapTag").style.fontSize="13px";
					document.getElementById("step1").style.fontSize="18px";
					document.getElementById("step1a").style.fontSize="18px";
					document.getElementById("step2").style.fontSize="18px";
					document.getElementById("step2a").style.fontSize="18px";
					document.getElementById("topRow").style.height= "110px";
					document.getElementById("secondRow").style.height="14px";
					document.getElementById("blankRow2").style.height="0px";
					if (navigator.userAgent.indexOf('MSIE')<0) {
						document.getElementById("map_canvas").style.height = myheight - 78 + "px"
						mapHeight = myheight -78
					} else {
						//alert("medium IE")
						document.getElementById("map_canvas").style.height = myheight - 98 + "px"
						tabHeight = myheight - 28
					}
					
				} else {
					
					document.getElementById("mapTitle").style.fontSize="30px";
					document.getElementById("mapTag").style.fontSize="18px";
					document.getElementById("step1").style.fontSize="24px";
					document.getElementById("step1a").style.fontSize="24px";
					document.getElementById("step2").style.fontSize="24px";
					document.getElementById("step2a").style.fontSize="24px";
					document.getElementById("topRow").style.height= "140px";
					document.getElementById("secondRow").style.height="15px";
					document.getElementById("blankRow2").style.height="5px";
					if (navigator.userAgent.indexOf('MSIE')<0) {
						document.getElementById("map_canvas").style.height = myheight - 111 + "px"
						mapHeight = myheight -111
						tabHeight = myheight
					} else {
						document.getElementById("map_canvas").style.height = myheight - 115 + "px"
						tabHeight = myheight - 16
					}
				}

			} else {
				document.getElementById("map_canvas").style.width= "496px"
				if (sitename=="SFFIND") { 
					document.getElementById("addressInput").style.width= "230px"
					if (navigator.userAgent.indexOf('MSIE')<0) {
						document.getElementById("map_canvas").style.height = myheight - 111+ "px"
						mapHeight = myheight -111
					}
					
				} else {
					document.getElementById("addressInput").style.width= "335px"
					document.getElementById("addressInput").style.height="34px"
					document.getElementById("addressInput").style.fontSize="25px";
					document.getElementById("mapTitle").style.fontSize="30px";
					document.getElementById("mapTag").style.fontSize="18px";
					document.getElementById("step1").style.fontSize="24px";
					document.getElementById("step1a").style.fontSize="24px";
					document.getElementById("step2").style.fontSize="24px";
					document.getElementById("step2a").style.fontSize="24px";
					document.getElementById("topRow").style.height= "140px";
					document.getElementById("secondRow").style.height="15px";
					document.getElementById("blankRow2").style.height="5px";
				}
			}
		}
	}
	//deal with iphone, ipod and ipad
	if ( isMob) { 
		myheight = (viewportheight - 205)
		document.getElementById("addressInput").style.width="200px";
		if (sitename=="SFFIND") {
			document.getElementById("map_canvas").style.width="450px"
			document.getElementById("addressInput").style.width= "250px"
			document.getElementById("addressInput").style.height="34px"
			document.getElementById("addressInput").style.fontSize="24px";
			document.getElementById("step1").style.fontSize="24px";
			document.getElementById("step1a").style.fontSize="24px";
			document.getElementById("step2").style.fontSize="24px";
			document.getElementById("step2a").style.fontSize="24px"
			document.getElementById('findButton').style.height= "30px"
			document.getElementById('neighborhoodSelect').style.width= "275px"
			document.getElementById('neighborhoodSelect').style.fontSize="24px"
			document.getElementById("map_canvas").style.height = (viewportheight - 410) + "px"
			tabHeight= (viewportheight - 260) 
			
		} else {
			document.getElementById("addressInput").style.height="24px"
			document.getElementById("addressInput").style.fontSize="17px";
			
			document.getElementById("map_canvas").style.width="387px"
			document.getElementById("mapTitle").style.fontSize="25px";
			
			document.getElementById("map_canvas").style.height = (viewportheight - 360) + "px"
			mapHeight = (viewportheight - 360)
			tabHeight= (viewportheight - 270) 
		}
	}
	if ((navigator.userAgent.indexOf('iPad')>0 )) { 
		iPadUser = true;
	}
	if ((navigator.userAgent.indexOf('iPhone')>0 )) { 
		 iPhoneUser = true;
	}
	if ((navigator.userAgent.indexOf('iPod')>0 )) { 
		 iPodUser = true;
	}
	//setTimeout('map.resize();',3000);
	//setTimeout('map.reposition();',3000);
	map.resize();
	map.reposition();


	//now set the tabs run initTabs if this is the first time the page is loading. run reset tab heights if the browser window size is changed.
	if (init) {
		if (sitename=="SFFIND") {
			tabsNo=3
			initTabs('dhtmlgoodies_tabView1',Array('Elected Officials','Places & Services','Other Information'),0,'100%',tabHeight,Array(false,true,true,true));
		} else {
			//if (theLoc=="City") {
				tabNo=9
				initTabs('dhtmlgoodies_tabView1',Array('Property','Zoning','Preservation','Planning Apps','Building Permits','Other Permits','Complaints','Appeals','BBNs'),0,'100%',tabHeight,Array(false,true,true,true));
			//} else {
			//	tabNo=8
			//	initTabs('dhtmlgoodies_tabView1',Array('Property','Zoning','Preservation','Projects','Building Permits','Other Permits','Complaints','Appeals'),0,'100%',tabHeight,Array(false,true,true,true));
			//}
		}
		tabsReady=true;

	} else {
		resetTabHeights('dhtmlgoodies_tabView1', tabHeight)
	}	
	var divHeight = document.getElementById("mapContainer").offsetHeight
	document.getElementById('map_canvas').style.height = divHeight;
	var divWidth = document.getElementById("mapContainer").offsetWidth;
	document.getElementById('map_canvas').style.width = divWidth;
    }
    


function gup( thename ){  
	//Returns paramters from the URL
	thename = thename.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
	var regexS = "[\\?&]"+thename+"=([^&#]*)";  
	var regex = new RegExp( regexS );  
	var results = regex.exec( unescape(window.location.href) );  
	if( results == null )    return "";  else    return results[1];
}

function openPrintVersion() {
	//Opens a new page with a printable version of the reports - at present just basic text with little formating and images/map removed.
	theZoningHtml = theZoningHtml.replace(/class='noprint'/gi,"style='display:none'");
	theZoningHtml = "<html>\n" + "  <head>\n" +  "    <link href='Print.css' type='text/css' rel='stylesheet' media='all' />" + "\n  </head>\n" + "<body>\n" + theZoningHtml + "\n  </body\n</html>"
	OpenWindow=window.open("", "ZoningReport", "height=600, width=800, toolbar=yes, scrollbars=yes, menubar=yes, resizable=yes , status=yes");
	OpenWindow.document.write(theZoningHtml)
	OpenWindow.document.close()
	self.name="main"
}
function onMapClick(evt) { 
	map.infoWindow.hide();
	theSearchType = "mapClick"
	theOrigType="mapClick"
	theSearchString=""
	//alert("here")
	//googleStreetView();
	identifyClick(evt)
}

function searchWithLatLong(tmpLat,tmpLong) {
	var source = new Proj4js.Proj("WGS84");
	var dest = new Proj4js.Proj("EPSG:102113"); 
	var p = new Proj4js.Point(tmpLong,tmpLat);  
	Proj4js.transform(source, dest, p); 
	withlatlong = true;
	var p2 = new esri.geometry.Point(p.x, p.y, new esri.SpatialReference({ wkid: 102113 }));
	onMapClick(p2)
	
	
}
var clickedLat
var clickedLong
var clickedMap
function identifyClick(evt) { 
	//Runs when a user clicks on the map.  Checks whether the user is using the measure tool (currently deactivated), if not get the lat/long and send to the identify task
	if (amIMeasuring) return;
	if (withlatlong) {
	} else {
		evt.y=evt.y+40
	}
	clicked = true;
	theClickedCoord = latLng
	isNeighborhood=false;
	isDistrict=false;
	if (withlatlong) {
		theGeom=evt;
	} else {
		theGeom=evt.mapPoint;
	}
	withlatlong=false;
	var source = new Proj4js.Proj("EPSG:102113"); 
	var dest = new Proj4js.Proj("WGS84");
	var p = new Proj4js.Point(theGeom.x,theGeom.y);   
	Proj4js.transform(source, dest, p); 

	latLng=p
	imbuffering=false
	clickedMap=true;
	clickedLat=roundNumber(p.y,5)
	clickedLong=roundNumber(p.x,5)
	//alert(clickedLat)
	googleStreetView();
	if (latLng) {
		if (theOrigType=="Address" && theSearchString !="") {
			theLinkAddress = theSearchString
		} else {
			theSearchString = "Latitude: " + roundNumber(p.y,5) + " Longitude: " + roundNumber(p.x,5)
			theLinkAddress = roundNumber(p.y,5)  + " " + roundNumber(p.x,5)
		}
		map.graphics.clear();
		bufferonmap=false;
		var IDsymbol = new esri.symbol.PictureMarkerSymbol('http://' + theServerName + '/PIM/images/blue.png', 32, 32).setOffset(0,16);
		var graphic = new esri.Graphic(theGeom, IDsymbol);
		theSearchGraphic = graphic
		map.graphics.add(graphic);
		document.getElementById('ImBusy').style.visibility = 'hidden'; 
		document.getElementById('ZoningReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('AssessorReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('SurveyRatingsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('CaseTrackingReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('PermitsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('MiscPermitsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('EnforcementReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('PermitsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big></td> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></tr></table>"
		document.getElementById('AppealsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('BBNsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	}
	identify(null, theGeom);
}


function identify(overlay, latLng) {
	
	// One of the key functions.
	// At this point either the user has either clicked on the map OR the user has clicked the search button. If the latter the Find Task has been successfully 
	// run which has returned the geography of the found object (parcel, address, case boundary, etc).  This function will then be used with the found object's 
	// geography (or the lat/long of the map click) to perform an Identify Task against the key GIS layers.  It will use the results of the Identify Task to populate the report tabs.

	//alert("in identify")
	var theNum =0
	theAddressLot = "";
	themapblklot="";
	clickedMap=false;
	
	// First, work out if the function was fired as a result of an onclick event associated with a buffer, a measure or an click on the map on top of a previous search result.  
	// In these cases exit the function.
	if (imbuffering) { 
		imbuffering=false
		return
	} else {
		identifyOvs = [];
	}
	if (overlay)  return;
        if (amIMeasuring)  return;

	var identifyParameters = new esri.tasks.IdentifyParameters();
	//set the identify tolerance to 3 pixels if the user clicked the map
	//if the user has clicked on the map add a marker and set things up so that they can later drag the marker to a new location
	if (clicked) {

		lastSearchClick=true;
		identifyParameters.tolerance = 0;
		//Deal with clicks outside San Francisco - issue a warning and clear the report	
		//alert("x: " + latLng.x + "\ny: " + latLng.y)
		if (clicked &&(latLng.x < -13638800 || latLng.x > -13620761 || latLng.y > 4556181 || latLng.y < 4538163)){
			document.getElementById('ZoningReport').innerHTML =  instructions 
			document.getElementById('AssessorReport').innerHTML = instructions 
			document.getElementById('SurveyRatingsReport').innerHTML = instructions 
			document.getElementById('CaseTrackingReport').innerHTML = instructions 
			document.getElementById('PermitsReport').innerHTML = instructions 
			document.getElementById('MiscPermitsReport').innerHTML = instructions 
			document.getElementById('EnforcementReport').innerHTML = instructions 
			document.getElementById('PermitsReport').innerHTML = instructions 
			document.getElementById('AppealsReport').innerHTML = instructions 
			document.getElementById('BBNsReport').innerHTML = instructions 
			
			var theMessage = "You clicked outside San Francisco.<br>Sorry, we only have data for properties in San Francisco."
			new Messi(theMessage, {title: 'Outside San Francisco', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});
			
			return;
		}
		//alert("coords fine")
		clicked=false;
	} else {
		lastSearchClick=false
		identifyParameters.tolerance = 0;
		
	}

	
	// We now have the geogrpahy of the search result (lat/long or boundary of property, project, etc). We will now 
	// prepare to send this to the identify task.
	
	//Clear the variables that will hold the HTML used to populate each of the report tabs
	theZoningHtml = null;
	theAssessorHtml = null;
	theSurveyRatingsHtml = null;
	theCaseTrackingHtml = null;
	thePermitsHtml = null;
	theMiscPermitsHtml = null;
	theEnforcementHtml = null;
	thePermitsHtml = null;

	identifyParameters.geometry = latLng //esri.geometry.webMercatorToGeographic(latLng);
	identifyParameters.returnGeometry = false;
	identifyParameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
	

	//Here we create 2 strings that later will be used to create arrays of the layer IDs to identify against
	var tmpArray = new Array();
	globaltmpString = 'layers = { "' + tmpArray[1] + '": []'
	for ( i=2; i < tmpArray.length; i++) {
		globaltmpString = globaltmpString + ', "' + tmpArray[i] + '": []'
	}
	tmpString = "["

	for (i=0; i< dynamicMap.layerInfos.length; i++) {
		//adds the IDs of the layers to identify against to the text string; all those other than the ones listed below - parcel dimensions, parcels, etc.  The parcel results come from the parcel labels layer.
		switch (dynamicMap.layerInfos[i].name)
		{
			//case "Parcels":
			//	break;
			case "Parcel Dimensions":
				break;	
			case "Zoning - Height District Dimensions":
				break;
			case "Zoning - District Dimensions":
				break;
			case "Planning Cases Unmap":
				break;
			case "Private School":
				break;
			case "Public School":
				break;
			case "Sea Wall Lots":
				break;
			case "Master Address Database":
				break;
			case "DPR Forms":
				break;
			case "Miscellaneous Permits":
				break;
			case "Enforcement":
				break;
			case "Planning Records":
				break;
			case "Zoning Letters":
				break;
			case "HRERs - old":
				break;
			//case "City Owned Land":
			//	break;
			//case "City Facilities":
			//	break;
			
			default:
				if (tmpString =="[") { 
					tmpString = tmpString + dynamicMap.layerInfos[i].id;
				} else {
					tmpString = tmpString + ", " + dynamicMap.layerInfos[i].id;
				}
		}	
	}
	
	tmpString = tmpString + " ]"
	globaltmpString = globaltmpString + "};"
	tmpString = "identifyParameters.layerIds = " + tmpString

	//run the string to set the identify parameters to only look through the layers we listed
	eval(tmpString)
	
	identifyParameters.width  = map.width;        
	identifyParameters.height = map.height;
	identifyParameters.mapExtent = map.extent;

	//set up identify parameter basics
	if (sitename=="SFFIND" && (isNeighborhood||isDistrict)) {
		//alert("its a district or neighborhood")
		var identifyParameters2 = new esri.tasks.IdentifyParameters();
		identifyParameters2.geometry = latLng 
		identifyParameters2.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
		identifyParameters2.returnGeometry = false;
		
		//set the identify tolerance to 3 pixels if the user clicked the map
		if (clicked) {
			identifyParameters2.tolerance = 3;
		} else { 
			identifyParameters2.tolerance = 0;
		}
		var tmpArray = new Array();
		globaltmpString = 'layers = { "' + tmpArray[1] + '": []'
		for ( i=2; i < tmpArray.length; i++) {
			globaltmpString = globaltmpString + ', "' + tmpArray[i] + '": []'
		}
		tmpString = "["
		
		for (i=0; i< dynamicMap2.layerInfos.length; i++) {
			//adds the IDs of the layers to identify against to the text string; all those other than the ones listed below - parcel dimensions, parcels, etc.  The parcel results come from the parcel labels layer.
			switch (dynamicMap2.layerInfos[i].name)
			{
				case "Parcels":
					break;
				case "Parcel Dimensions":
					break;	
				case "Zoning - Height District Dimensions":
					break;
				case "Zoning - District Dimensions":
					break;
				case "Planning Cases Unmap":
					break;
				default:
					if (tmpString =="[") { 
						tmpString = tmpString + dynamicMap2.layerInfos[i].id;
					} else {
						tmpString = tmpString + ", " + dynamicMap2.layerInfos[i].id;
					}
			}	
		}
		//close off the strings
		tmpString = tmpString + " ]"
		globaltmpString = globaltmpString + "};"
		tmpString = "identifyParameters2.layerIds = " + tmpString
		
		//run the string to set the identify parameters to only look through the layers we listed
		eval(tmpString)
		//only need to identify in the current map window (which has previously been zoomed to the extents of the found parcel, case, block, permit or address.
		identifyParameters2.width  = map.width;        
		identifyParameters2.height = map.height;
		identifyParameters2.mapExtent = map.extent;
		

		
	}

	

	//set up the function which will run when the Identify Task returns its results, this function will process the results (this is key to filling the report tabs)
	//alert(isNeighborhood)
	//alert(isDistrict)
	if (isNeighborhood || isDistrict) {
		identifyTask2.execute(identifyParameters2, function(response, error) {
		if (hasErrorOccurred(error)) return;
			//fill the idResults array with the results
			idResults = response;
			//alert("Number of Results: " + idResults.length)
			 //order the results so that they display in correct order in the tabs (orders by case number, address, misc permit number, etc)
			//Chrome bug results in the sort failing in Chrome - Chrome uses a different sort algorithm which is "unstable" 
			 idResults.sort(idresultsort)
			 iPadText=""
			 if (iPadUser || iPhoneUser || iPodUser) {
				if ((navigator.userAgent.indexOf('OS_4') >0) || (navigator.userAgent.indexOf('OS_3') >0) || (navigator.userAgent.indexOf('OS_2') >0)) {
					iPadText="<font class='NoPrint'>Use 2 fingers to scroll down reports.<br><br></font>"
					}
				}
				 printLink = " <a class='NoPrint' style='float:right; font-size: 14px; font-family:Arial, Helvetica, sans-serif; color: #33b5ff; text-decoration: underline;' href='javascript: printReports();'> Printable Version of Reports</a>"
				
				//start to populate the variables with the HTML that will later be used to populate the report tabs
				//the iPadText is instructions for iPhone, iPod and iPad users to help them scroll through the reports.   Other users will not see this text.
				
				if (sitename=="SFFIND") {
					var theSFFindSearchType=""
					if (isDistrict) {
						theSFFindSearchType = "Supervisor District "
					}
					if (isNeighborhood) {
						theSFFindSearchType = ""
					}
					theSFFindElectedHtml = printLink + "<a name='ElectedTop'><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Elected Officials Report:  </span><span style='color: #000000;'>" +theSFFindSearchType+ theSearchString + "</span></div><br>"
					theSFFindServicesHtml = printLink + "<a name='ServiceTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Places & Services Report:  </span><span style='color: #000000;'>" + theSFFindSearchType + theSearchString + "</span></div><br>"
					theSFFindInfoHtml = printLink + "<a name='OtherInfoTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Other Information Report:  </span><span style='color: #000000;'>" + theSFFindSearchType + theSearchString + "</span></div><br>"
				} else {
					theAssessorHtml = printLink + "<div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Property Report:  </span><span style='color: #000000;'>" + theSearchString + "</span></div><br>"
			
				theZoningHtml = printLink + "<div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Zoning Report:  </span><span style='color: #000000;'>" +  theSearchString + "</span></div>"
				theMiscPermitsHtml = printLink + "<div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Miscellaneous Permits Report: </span><span style='color: #000000;'>"  +  theSearchString + "</span></div><br>"
				theCaseTrackingHtml = printLink + "<div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Planning Applications Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div>"
				theEnforcementHtml = printLink + "<div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Complaints Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
				thePermitsHtml = printLink + "<div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Building Permits Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
				theAppealsHtml = printLink + "<div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Appeals Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
				theBBNsHtml = printLink + "<div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Block Book Notifications Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
			}		
				
			//
			//This is key to populating the report tabs.
			//Run a function for each of the tabs.  Each function fills a variable with the HTML that will later be applied to it's tab.
			//
			if (sitename=="SFFIND") {
				//will add different functions for each of the SFFind tabs later, for testing just use the property tab
				updateSFFindElectedHtml();
				updateSFFindServicesHtml();
				updateSFFindInfoHtml();
			} else {			
				updatePropertyHtml();
				updateZoningHtml();
				updatePreservationHtml();
				updateProjectsHtml();
				updateBuildingPermitsHtml();
				updateOtherPermitsHtml();
				updateComplaintsHtml();
				updateAppealsHtml();
				//if (theLoc=="City") {
					updateBBNsHtml();
				//}
			}
		});

		
	} else {
		
		//slownessTimer();

		identifyTask.execute(identifyParameters, function(response) {

			
			//fill the idResults array with the results
			idResults = response;
			 //order the results so that they display in correct order in the tabs (orders by case number, address, misc permit number, etc)
			//Chrome bug results in the sort failing in Chrome - Chrome uses a different sort algorithm which is "unstable" 
			 idResults.sort(idresultsort)
			 iPadText=""
			 if (iPadUser || iPhoneUser || iPodUser) {
				if ((navigator.userAgent.indexOf('OS_4') >0) || (navigator.userAgent.indexOf('OS_3') >0) || (navigator.userAgent.indexOf('OS_2') >0)) {
					iPadText="<font class='NoPrint'>Use 2 fingers to scroll down reports.<br><br></font>"
				}
			}
			 printLink = " <div style='width:178px; float:right; font-size: 14px; font-family:Arial, Helvetica, sans-serif; color: #33b5ff; text-decoration: underline;'><a class='NoPrint'  href='javascript: printReports();'> Printable Version of Reports</a></div>"
			
			
			//start to populate the variables with the HTML that will later be used to populate the report tabs
			//the iPadText is instructions for iPhone, iPod and iPad users to help them scroll through the reports.   Other users will not see this text.
			
			if (sitename=="SFFIND") {
				theSFFindElectedHtml = printLink + "<a name='ElectedTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Elected Officials Report:  </span><span style='color: #000000;'>" + theSearchString + "</span></div><br>"
				theSFFindServicesHtml = printLink + "<a name='ServiceTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Places & Services Report:  </span><span style='color: #000000;'>" + theSearchString + "</span></div><br>"
				theSFFindInfoHtml = printLink + "<a name='OtherInfoTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Other Information Report:  </span><span style='color: #000000;'>" + theSearchString + "</span></div><br>"
			} else {
				
				theAssessorHtml = printLink + "<a name='BookmarkPropertyTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Property Report:  </span><span style='color: #000000;'>" + theSearchString + "</span></div><br>"
				theZoningHtml = printLink + "<a name='BookmarkZoningTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Zoning Report:  </span><span style='color: #000000;'>" +  theSearchString + "</span></div>"
				theMiscPermitsHtml = printLink + "<a name='BookmarkMiscPermitsTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Miscellaneous Permits Report: </span><span style='color: #000000;'>"  +  theSearchString + "</span></div><br>"
				theCaseTrackingHtml = printLink + "<a name='BookmarkProjectsTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Planning Applications Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div>"
				theEnforcementHtml = printLink + "<a name='BookmarkComplaintsTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Complaints Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
				thePermitsHtml = printLink + "<a name='BookmarkPermitsTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Building Permits Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
				theAppealsHtml = printLink + "<a name='BookmarkAppealsTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Appeals Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
				theBBNsHtml = printLink + "<a name='BookmarkBBNsTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Block Book Notifications Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
			}		
				
			//
			//This is key to populating the report tabs.
			//Run a function for each of the tabs.  Each function fills a variable with the HTML that will later be applied to it's tab.
			//
			
			
			if (sitename=="SFFIND") {
				//will add different functions for each of the SFFind tabs later, for testing just use the property tab
				updateSFFindElectedHtml();
				updateSFFindServicesHtml();
				updateSFFindInfoHtml();
			} else {
				updatePropertyHtml();
				updateZoningHtml();
				updatePreservationHtml()
				updateProjectsHtml()
				//setTimeout("updatePreservationHtml()",1000);
				
				//setTimeout("updateProjectsHtml()",1500)
				
				updateBuildingPermitsHtml();
				updateOtherPermitsHtml()
				//setTimeout("updateOtherPermitsHtml()",2000)
				//setTimeout("updateComplaintsHtml()",2500)
				updateComplaintsHtml()
				updateAppealsHtml();
				//if (theLoc=="City") {
					updateBBNsHtml();
				//}
				
			}
			
		//},taskError);
		});
	}
	//alert("here")
	setTimeout(googleStreetView,2000);
	//alert("here")
}
var canceltimer=false;
var start=null;
function slownessTimer() {
	start = new Date().getTime();
	window.setTimeout(slowone,6000)
}
function slowone() {
	var now = new Date().getTime();
	if ((now-start) > 6000){
		if (document.getElementById('AssessorReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('AssessorReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('ZoningReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('ZoningReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('SurveyRatingsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('SurveyRatingsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('CaseTrackingReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('CaseTrackingReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('PermitsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('PermitsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('MiscPermitsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('MiscPermitsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('EnforcementReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('EnforcementReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('AppealsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('AppealsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('BBNsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('BBNsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
	}
	//alert("It's slow")
}

      function addMapServiceLayer(layer, error) {
        // display error message (if any) and return
        if (hasErrorOccurred(error)) return;
        // add layer to the map
        mapExtension.addToMap(layer);
      }



      function hasErrorOccurred(error) {
	//display ArcGIS Server error
        if (error) {
          alert("Error " + error.code + ": " + (error.message || (error.details && error.details.join(" ")) || "Unknown error" ));
          return true;
        }
        return false;
      }

    function findCompleteCallback(findResults) {

	//Function is run when the server returns results from the Find Task.  This should have returned the geography of whatever the user searched for (parcel, case, block, address, etc) 
	//Clear the map and reports, zooms the map to the Find Result then buffer by -0.95 ft.  The buffer task will then kick off the identify task
	thefindResults = findResults
	//alert(findResults.length)
	
	//alert(theBuffGeoms.length)
	theRes = findResults[0]
	theBuffGeoms= [] //null; //new Array();
	for (i=0; i< findResults.length; i++) {
		theBuffGeoms.push(findResults [i])
	}
	//alert(theSearchType)
	if ((findResults.length==0) || (theRes == 'undefined') || (theRes == null) ) {
		
		document.getElementById('ImBusy').style.visibility = 'hidden'; 
		//alert("here")
			if (theSearchType == "Address") {
				
				showAddress(theSearchString)
			} else {
				
				if (theSearchType=="Case") {
					//NOW HANDLED BY unmappedAccela function
					//User is looking for a case but we can't find it in the mapped version....now search through the tabular version of the cases and case actions
					//params.searchFields = ["CASENO"];
					//params.searchText = theSearchString.toUpperCase();
					//theSearchType = "Case Unmapped"
					//if (theSearchType == "Case Unmapped") {
					//	params.layerIds=[]
					//	for (i=0; i< dynamicMap.layerInfos.length -1; i++) {
					//		if (dynamicMap.layerInfos[i].name == "Planning_Cases_Table_Layer") {
					//			params.layerIds.push(dynamicMap.layerInfos[i].id);
					//			params.searchFields = ["CaseNo"];
					//			params.searchText = theSearchString.toUpperCase();
					//			theSearchType = "Case Unmapped"
					//			params.contains = false;
					//		}
					//		if (dynamicMap.layerInfos[i].name == "ProjActions") {
					//			params.layerIds.push(dynamicMap.layerInfos[i].id);
					//		}
					//	}
					//	findTask.execute(params, findCompleteCallback);
					//}
				} else {
					//alert(theSearchType)
					//alert("Sorry, I can't find '" + theSearchString + "'" + ", please try again.");  
					
					if (theSearchType=='Parcel') {
						//alert("-"+theSearchString +"-")
						var theBlocktest=theSearchString.substring(4,5)
						var theBlock=""
						var theLotTest=theSearchString.substring(theSearchString.length-1,theSearchString.length)
						var theLot=""
						var fiveLetterBlock=false
						
						//Check to see it it's a 4 or 5 character block
						if (IsNumeric(theBlocktest)||theBlocktest=='/'||theBlocktest==' ') {
							theBlock=  theSearchString.substring(0,4)
						} else {
							theBlock=  theSearchString.substring(0,5)
							fiveLetterBlock=true
						}
						
						var theBlockDig1=theBlock.substring(0,1)
						var theBlockDig2=theBlock.substring(1,2)
						var theBlockDig3=theBlock.substring(2,3)
						var theBlockDig4=theBlock.substring(3,4)
						
						//alert("theBlockDig1: " + theBlockDig1 + "\ntheBlockDig2: " + theBlockDig2 + "\ntheBlockDig3: " + theBlockDig3 + "\ntheBlockDig4: " + theBlockDig4)
						
						if (IsNumeric(theLotTest)) {
							theLot = theSearchString.substring(theSearchString.length-3,theSearchString.length)
						} else {
							theLot = theSearchString.substring(theSearchString.length-4,theSearchString.length)
						}
						
						//alert("Block1: " + theBlock + "\n+Lot: " + theLot)
						
						var theRetiredParcelLayerID						
						for (i=0; i< dynamicMap.layerInfos.length; i++) {
							if (dynamicMap.layerInfos[i].name == "Retired Parcels") {
								theRetiredParcelLayerID=i
							}
						}
						theRetiredParcelLayer = theArcGISServerName+"/"+theRetiredParcelLayerID
						
						var theWhereClause = " (OLDBLKLOT = '" + theBlock.toUpperCase() + theLot.toUpperCase()+"') ";
						
						//Try to account for possible block typos, search for anything within 1 digit of the block (all 4 numbers being one up or down,  or with the letter removed if there is one
						
						//alert(theWhereClause)
						var queryTask = new esri.tasks.QueryTask(theRetiredParcelLayer);
						var query = new esri.tasks.Query();
						query.outFields = ["*"]
						query.returnGeometry=false;
						query.where=theWhereClause
						query.orderByFields=["BLKLOT"]
						//alert("1")
						queryTask.execute(query, handleQueryResultRetiredParcel, taskError);
						return
					} 
					
					var theMessage = "Sorry, I can't find '" + theSearchString + "'" + ", please try again."
					var theTitle = 'No Properties Found'
					if (theSearchType=="Case Unmapped") {
						theTitle = 'No Cases Found'
					}
					new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});
					document.getElementById('ZoningReport').innerHTML =  instructions 
					document.getElementById('AssessorReport').innerHTML = instructions 
					document.getElementById('SurveyRatingsReport').innerHTML = instructions 
					document.getElementById('CaseTrackingReport').innerHTML = instructions 
					document.getElementById('PermitsReport').innerHTML = instructions 
					document.getElementById('MiscPermitsReport').innerHTML = instructions 
					document.getElementById('EnforcementReport').innerHTML = instructions 
					document.getElementById('PermitsReport').innerHTML = instructions 
					document.getElementById('AppealsReport').innerHTML = instructions 
					document.getElementById('BBNsReport').innerHTML = instructions 
					
					
				}
			}
	} else {
		if (theSearchType=="Case Unmapped") {
			imidentifying = true;
			unMappedCases();
			return null;
		}
		//Get the bounds of the geometry of the find result.  We will then zoom the map to those bounds.  Get the first geometry object then loop through others if its a multipart polygon.
		theGeometries=theRes.feature.geometry
		theGeometry = theRes.feature.geometry; 
		var polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]), 2), new dojo.Color([100,100,255,0.5]));        

		//Set up a very basic info window that will open if they click on the result on the map
		//alert(theSearchType)
		if (theSearchType=="Case") {
			imbuffering=false; 
			map.graphics.clear();
			var graphic =theRes.feature
			graphic.setSymbol(polygonSymbol);
			theSearchGraphic = graphic
			var infoTemplate = new esri.InfoTemplate();	
			infoTemplate.setTitle("${CASENO}"); 
			content = "<div overflow='auto' >Buffer by:<table border=0 ><tr></td><td style='width:40px'> <a id='lnkBuffer150' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,190.5);' title= 'Buffer this area by 150ft'> 150ft;</a>&nbsp </td>"
			content += "<td style='width:40px'> <a id='lnkBuffer300' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,381);' title= 'Buffer this area by 300ft'> 300ft;</a>&nbsp</td>  "
			content += "<td style='width:50px'> <a id='lnkBuffer1000' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1270);' title= 'Buffer this area by 1,000ft'> 1000ft;</a>&nbsp</td>"
			content += "<td style='width:70px'> <a id='lnkBuffer1320' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1676.4);' title= 'Buffer this area by 1/4 of a mile'> 1/4 mile</a>&nbsp</td></tr>"
			content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; clearBuffer();' title= 'Clear Buffer'>Clear buffers</a></td></tr>"
			content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; removeBlue();' title= 'Clear Buffer'>Remove boundary from map</a></td></tr></table></div>"
			
			infoTemplate.setContent(content)
			graphic.setInfoTemplate(infoTemplate);
			map.graphics.add(graphic);
			zoomExtent = graphic.geometry.getExtent().expand(3);
			map.setExtent(zoomExtent); 
			map.infoWindow.resize(235,230);
		};
		if (theSearchType=="Block") {
			imbuffering=false; 
			map.graphics.clear();
			var graphic =theRes.feature
			graphic.setSymbol(polygonSymbol);
			theSearchGraphic = graphic
			var infoTemplate = new esri.InfoTemplate();	
			infoTemplate.setTitle("${BLOCK}"); 
			var infoTemplate = new esri.InfoTemplate();	
			infoTemplate.setTitle("${blklot}"); 
			content = "<div overflow='auto' >Buffer by:<table border=0 ><tr></td><td style='width:40px'> <a id='lnkBuffer150' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,190.5);' title= 'Buffer this area by 150ft'> 150ft;</a>&nbsp </td>"
			content += "<td style='width:40px'> <a id='lnkBuffer300' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,381);' title= 'Buffer this area by 300ft'> 300ft;</a>&nbsp</td>  "
			content += "<td style='width:50px'> <a id='lnkBuffer1000' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1270);' title= 'Buffer this area by 1,000ft'> 1000ft;</a>&nbsp</td>"
			content += "<td style='width:70px'> <a id='lnkBuffer1320' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1676.4);' title= 'Buffer this area by 1/4 of a mile'> 1/4 mile</a>&nbsp</td></tr>"
			content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; clearBuffer();' title= 'Clear Buffer'>Clear buffers</a></td></tr>"
			content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; removeBlue();' title= 'Clear Buffer'>Remove boundary from map</a></td></tr></table></div>"
			infoTemplate.setContent(content)
			graphic.setInfoTemplate(infoTemplate);
			map.graphics.add(graphic);
			zoomExtent = graphic.geometry.getExtent().expand(3);
			map.setExtent(zoomExtent); 
			map.infoWindow.resize(235,230);

		};

		if (theSearchType=="Parcel") {
			
			imbuffering=false; 
			map.graphics.clear();
			var graphic =theRes.feature
			graphic.setSymbol(polygonSymbol);
			theSearchGraphic = graphic
			var infoTemplate = new esri.InfoTemplate();	
			
			infoTemplate.setTitle("${blklot}"); 
			content = "<div overflow='auto' >Buffer by:<table border=0 ><tr></td><td style='width:40px'> <a id='lnkBuffer150' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,190.5);' title= 'Buffer this area by 150ft'> 150ft;</a>&nbsp </td>"
			content += "<td style='width:40px'> <a id='lnkBuffer300' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,381);' title= 'Buffer this area by 300ft'> 300ft;</a>&nbsp</td>  "
			content += "<td style='width:50px'> <a id='lnkBuffer1000' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1270);' title= 'Buffer this area by 1,000ft'> 1000ft;</a>&nbsp</td>"
			content += "<td style='width:70px'> <a id='lnkBuffer1320' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1676.4);' title= 'Buffer this area by 1/4 of a mile'> 1/4 mile</a>&nbsp</td></tr>"
			content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; clearBuffer();' title= 'Clear Buffer'>Clear buffers</a></td></tr>"
			content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; removeBlue();' title= 'Clear Buffer'>Remove boundary from map</a></td></tr></table></div>"
			
			infoTemplate.setContent(content)
			graphic.setInfoTemplate(infoTemplate);
			map.graphics.add(graphic);
			zoomExtent = graphic.geometry.getExtent().expand(3);
			map.setExtent(zoomExtent); 
			map.infoWindow.resize(235,230);

		};
		if (theSearchType=="Permit") {
			imbuffering=false; 
			map.graphics.clear();
			var graphic =theRes.feature
			graphic.setSymbol(polygonSymbol);
			theSearchGraphic = graphic
			var infoTemplate = new esri.InfoTemplate();	
			infoTemplate.setTitle("${APPL_NO}"); 
			content = "<div overflow='auto' >Buffer by:<table border=0 ><tr></td><td style='width:40px'> <a id='lnkBuffer150' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,190.5);' title= 'Buffer this area by 150ft'> 150ft;</a>&nbsp </td>"
			content += "<td style='width:40px'> <a id='lnkBuffer300' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,381);' title= 'Buffer this area by 300ft'> 300ft;</a>&nbsp</td>  "
			content += "<td style='width:50px'> <a id='lnkBuffer1000' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1270);' title= 'Buffer this area by 1,000ft'> 1000ft;</a>&nbsp</td>"
			content += "<td style='width:70px'> <a id='lnkBuffer1320' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1676.4);' title= 'Buffer this area by 1/4 of a mile'> 1/4 mile</a>&nbsp</td></tr>"
			content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; clearBuffer();' title= 'Clear Buffer'>Clear buffers</a></td></tr>"
			content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; removeBlue();' title= 'Clear Buffer'>Remove boundary from map</a></td></tr></table></div>"
			graphic.setInfoTemplate(infoTemplate);
			map.graphics.add(graphic);
			zoomExtent = graphic.geometry.getExtent().expand(3);
			map.setExtent(zoomExtent); 
			map.infoWindow.resize(235,230);
		};
		if (theSearchType=="Address") {
			imbuffering=false; 
			map.graphics.clear();
			for (i=0; i< findResults.length; i++) {
				//theBuffGeoms.push(findResults[i])
				var graphic =findResults[i].feature
				theRes=findResults[i]
				graphic.setSymbol(polygonSymbol);
				theSearchGraphic = graphic    
				
				var infoTemplate = new esri.InfoTemplate();	
				infoTemplate.setTitle("${ADDRESSSIMPLE}"); 
				content = "<div style='BORDER: #b7d8ed 0px solid;' overflow='auto' >Buffer by:<table border=0 ><tr></td><td style='width:40px'> <a id='lnkBuffer150' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,190.5);' title= 'Buffer this area by 150ft'> 150ft;</a>&nbsp </td>"
				content += "<td style='width:40px'> <a id='lnkBuffer300' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,381);' title= 'Buffer this area by 300ft'> 300ft;</a>&nbsp</td>  "
				content += "<td style='width:50px'> <a id='lnkBuffer1000' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1270);' title= 'Buffer this area by 1,000ft'> 1000ft;</a>&nbsp</td>"
				content += "<td style='width:70px'> <a id='lnkBuffer1320' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1676.4);' title= 'Buffer this area by 1/4 of a mile'> 1/4 mile</a>&nbsp</td></tr>"
				content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; clearBuffer();' title= 'Clear Buffer'>Clear buffers</a></td></tr>"
				content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; removeBlue();' title= 'Clear Buffer'>Remove boundary from map</a></td></tr></table></div>"
				
				infoTemplate.setContent(content)
				graphic.setInfoTemplate(infoTemplate);
				map.graphics.add(graphic);
			}
			zoomExtent = graphic.geometry.getExtent().expand(3);
			map.setExtent(zoomExtent); 
			map.infoWindow.resize(235,230);
			

		};
		if (theSearchType=="Neighborhood") {
			imbuffering=false; 
			map.graphics.clear();
			var graphic =theRes.feature
			graphic.setSymbol(polygonSymbol);
			theSearchGraphic = graphic
			var infoTemplate = new esri.InfoTemplate();	
			infoTemplate.setTitle("SFFind"); 
			content = "<table><tr><td><b>Neighborhood: </b></td></tr><tr><td> ${name} </td></tr></table><br><a href='javascript:removeBlue()'>Remove Boundary from Map</a><br><br>"
			infoTemplate.setContent(content)
			graphic.setInfoTemplate(infoTemplate);
			map.graphics.add(graphic);
			zoomExtent = graphic.geometry.getExtent().expand(1.5);
			map.setExtent(zoomExtent); 
			map.infoWindow.resize(210,230);
		};
		if (theSearchType=="District") {
			imbuffering=false; 
			map.graphics.clear();
			var graphic =theRes.feature
			graphic.setSymbol(polygonSymbol);
			theSearchGraphic = graphic
			var infoTemplate = new esri.InfoTemplate();	
			infoTemplate.setTitle("SFFind"); 
			content="<table><tr><td><b>Supervisor District ${supervisor}</td></tr><tr><td> ${supname} </td></tr></table><br><a href='javascript:removeBlue()'>Remove Boundary from Map</a><br><br>"
			infoTemplate.setContent(content)
			graphic.setInfoTemplate(infoTemplate);
			map.graphics.add(graphic);
			zoomExtent = graphic.geometry.getExtent().expand(1.5);
			map.setExtent(zoomExtent); 	
			map.infoWindow.resize(210,230);
			//map.infoWindow.resize(230,200);
		};

	imidentifying = true;
	
	//Buffer the find result by 0.95ft.  Without doing this the Identify Task will return results for any neighboring feature that shares a boundary with the result 
	//  (e.g. if searched for a parcel will return info for all neighboring parcels).
	//Theoretically could have buffered by a smaller amount but 0.95ft also deals with most digitizing errors (where boundaries should have been snapped together but were not. Anything
	//  larger than 0.95ft risks elimiating the smaller legislative setbacks
	if (isNeighborhood || isDistrict) {
		//bufferCurrentOverlays(theRes,-15);
		bufferCurrentOverlays(theBuffGeoms,-15);
	} else {
		
		//alert(theRes.feature.geometry.length)
		//alert(theRes.length)
		
		//alert(theRes.length)
		bufferCurrentOverlays(theBuffGeoms,-0.95);
	}
	

	document.getElementById('ImBusy').style.visibility = 'hidden'; 

	}
	// googleStreetView();
    }
   function addCommas(nStr) {
    //function to add convert a number to a currency format
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
   }

   
   function isLayerVisible(theLayerName, theDef) {
	//Checks whether a specified layer is turned on (visible on the map) or not - returns true or false.
	   var LayerVis = new Array();
	   LayerVis = dynamicMap.visibleLayers;

		for (i=0; i< dynamicMap.layerInfos.length; i++) {
			if (dynamicMap.layerInfos[i].name == theLayerName)  {
			var tmpLayerList = "+" + LayerVis.join("+") + "+"
			var tmpLayer = "+" + dynamicMap.layerInfos[i].id + "+"

				if  (tmpLayerList.indexOf(tmpLayer) =="-1") {
					return false;
				} else {
					return true;
				}
			}
		}

    }
    var theLastLayer;
    var isPPon=false
    var theLastLayerName=""
    function ToggleOnOff(theLayerList, OnOff, theDef) {
	    
	//alert(theLastMapLayer)
	    //alert(theDef)
	    //alert("in toggleOnOff")
	//Switches layers on/off (adds/removes them from the map)
	//alert(theLayerList + "\n"+OnOff)
	// Show the 'busy' icon
	var theX= document.body.clientWidth * 0.2 - 32
	var theY= 0 - (document.body.clientHeight * 0.45)   
	document.getElementById('ImBusy').style.left = theX 
	document.getElementById('ImBusy').style.top = theY 
	document.getElementById('ImBusy').style.visibility = 'visible'; 
	var LayerVis = new Array();

	//LayerVis = dynamicMap.getVisibleLayers();
	LayerVis = dynamicMap.visibleLayers;

	    
	var thePPID = ""
	
	if (theLastMapLayer=="Planning Provisions") {
		for (i=0; i< dynamicMap.layerInfos.length; i++) {
			if (dynamicMap.layerInfos[i].name == "Planning Provisions" )  {
				//alert(theLastLayer)
				//alert(theDef)
				//alert(OnOff)
				
				if (theLastLayer && theDef){
					map.removeLayer(theLastLayer);
					
				}
				if (OnOff) {
					thePPID = i
					var fieldLayer = new esri.layers.FeatureLayer(theArcGISServerName+"/"+i, {
						mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
					});
					theDefExp = "PROVISION_TYPE="+"'" + theDef + "'"
					fieldLayer.setDefinitionExpression(theDefExp);
					fieldLayer.opacity=0.75
					
					map.addLayer(fieldLayer);
					theLastLayer=fieldLayer
					isPPon=true;
					theLastLayerName=theDef
					
				} else  {
					isPPon=false;
					theLastLayerName=""
				}
				
			}

			
		}
	}	
	    
	    
	//Get an array of the currently visible layers from which to add or remove.  The array will then be sent back to ArcGIS Server
	var NewLayerVis = new Array();
	NewLayerVis = dynamicMap.visibleLayers;
	for (k=0;k< theLayerList.length;k++) {
		if (theLayerList instanceof Array) {
			theLayer=theLayerList[k]
		} else {
			theLayer = theLayerList
		}
		if (OnOff==false) {
			//switching the layer off
			var NewLayerVis = new Array();
			//deal with either a layer ID number or the name of the layer
			if (IsNumeric(theLayer)) {
				for (i=0; i < LayerVis.length; i++) {
					if (LayerVis[i] != theLayer) {
						//add all layers other than the one we are switching off
						
						NewLayerVis.push(LayerVis[i]);
						
					}
				}
			} else {
				for (i=0; i< dynamicMap.layerInfos.length; i++) {
					if (dynamicMap.layerInfos[i].name == theLayer) {
						myID = dynamicMap.layerInfos[i].id;
					}
				}
				for (i=0; i < LayerVis.length; i++) {
					if (LayerVis[i] != myID) {
						//add all layers other than the one we are switching off
						NewLayerVis.push(LayerVis[i]);
					}
				}
			}
		} else { 
			//switching the layer on
			if (IsNumeric(theLayer)) {
				LayerVis.push(theLayer);
			} else {
				for (i=0; i< dynamicMap.layerInfos.length; i++) {
					if (dynamicMap.layerInfos[i].name == theLayer) {
						if (i!=thePPID) {
							//alert("here")
							NewLayerVis.push(dynamicMap.layerInfos[i].id);
						}
					}
				}
			}
		}
		if (theLayerList instanceof Array) {
		} else {
		//exit the loop if its not an array
			break;
		}
	}
	//Send the array of layer IDs that should be visible back to ArcGIS Server
	//alert("dffd")
	dynamicMap.setVisibleLayers(NewLayerVis);
	document.getElementById('ImBusy').style.visibility = 'hidden'; 

	if (theLayer=="Schools 1000ft Buffer") {
		//If turning the Parcels on/ff also switch on/off the parcel labels
		if (OnOff) {
			ToggleOnOff("Public School",true)
			ToggleOnOff("Private School",true)
		} else {
			ToggleOnOff("Public School", false)
			ToggleOnOff("Private School", false)
		}
	}
	if (theLayer=="Parcels") {
		//If turning the Parcels on/ff also switch on/off the parcel labels
		if (OnOff) {
			ToggleOnOff("Parcel Labels",true)
			ToggleOnOff("Sea Wall Lots",true)
		} else {
			ToggleOnOff("Parcel Labels", false)
			ToggleOnOff("Sea Wall Lots",false)
		}
	}
	if (theLayer=="Zoning - NCDs") {
		//If turning the NCDs on/ff also switch on/off the NCD buffers
		if (OnOff) {
			ToggleOnOff("Within 0.25 miles of",true)
		} else {
			ToggleOnOff("Within 0.25 miles of", false)
		}
	}
	
	if (theLayer=="Zoning - Special Sign Districts") {
		//If turning the SSD's on/ff also switch on/off the Scenic Street SSD's
		if (OnOff) {
			ToggleOnOff("Zoning - SSD Scenic Streets",true)
		} else {
			ToggleOnOff("Zoning - SSD Scenic Streets", false)
		}
		
	}
	if (theLayer=="Transit Routes") {
		//If turning the Parcels on/ff also switch on/off the parcel labels
		if (OnOff) {
			ToggleOnOff("Transit Stops",true)
		} else {
			ToggleOnOff("Transit Stops", false)
		}
	}
	if (theLayer=="City Owned Land") {
		//If turning the Parcels on/ff also switch on/off the parcel labels
		if (OnOff) {
			ToggleOnOff("City Facilities",true)
		} else {
			ToggleOnOff("City Facilities", false)
		}
	}
	//document.getElementById('ImBusy').style.visibility = 'hidden'; 
    }
    

   function is_string(input){    
	return typeof(input)=='string';  
   }
    var addressMarker;
   function showAddress(address) {
	   
	//alert("address: " + address)
	   //alert(document.getElementById("mapContainer").offsetHeight)
	if (address=="...select a neighborhood") {
		return;
	}
	if (isNeighborhood) {
		if (address.indexOf("Supervisor District")==0) {
			if (address.indexOf("Supervisor District")==0) {
				address=address.substring(20,address.length)
			}
			theDistrictParam = address
			isDistrict=true;
			isNeighborhood=false;
		} else {
			isDistrict=false;
			isNeighborhood=true
		}
	}

	   address = address.replace("e.g. ","");
	   theLinkAddress = address
	   theReportTitle = address
	//  This is one of the key functions.  
	//  Takes the contents of the search box, identifies if the text is an address, parcel, block, case or permit and then sends it to ArcGIS Server to search through the appropriate GIS layer.
	//  When gets a response from ArcGIS Server it will then run the findCompleteCallback() function to process the results and compile the reports by comparing the geography of the search will the key GIS layers.
	//  If nothing is found in the GIS layers the function then sends the search string to Google to geocode it.  It will then call identifyClick() which will run as if the user clicked on the map.
	   	   
	//standardize the address string.  Later it will add " San Francisco, CA" to the address string.  This section removes anything similar that the user may have added.
	//var re1 = /, SF/gi;
	//var re2 = /, San Francisco/gi;
	//var re3 = /, California/gi;
	//var re4 = /, CA/gi;
	//address = address.replace(re2, '')
	//address = address.replace(re3, '')
	//address = address.replace(re4, '')
	
	var re1 = /, SF/gi
	var re2 = /, SAN FRANCISCO, CA/gi;
	var re3 = /, SAN FRANCISCO CA/gi;
	var re4 = / SAN FRANCISCO CA/gi;
	var re5 = /, CALIFORNIA/gi;
	var re6 = /, CA/gi;
	var re7 = /,/gi;
	var re8 = / SAN FRANCISCO CA/gi;
	var re9 = / SAN FRANCISCO/gi;
	//alert("address: " + address)
	
	if (address=="") {
		return;		
	}
	if (!isNeighborhood) {
		address = address.toUpperCase().replace(re1, '')
		address = address.toUpperCase().replace(re2, '')
		address = address.toUpperCase().replace(re3, '')
		address = address.toUpperCase().replace(re4, '')
		address = address.toUpperCase().replace(re5, '')
		address = address.toUpperCase().replace(re6, '')
		address = address.toUpperCase().replace(re7, '')
		address = address.toUpperCase().replace(re8, '')
		address = address.toUpperCase().replace(re9, '')
	
	}
	//Clear any previous report and add Add "please wait" to each of the reports tabs.   
   	document.getElementById('ZoningReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('AssessorReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('SurveyRatingsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('CaseTrackingReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('PermitsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('MiscPermitsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('EnforcementReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('PermitsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('AppealsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('BBNsReport').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table>"
	
	//remove anything that may be on the map (previous searches, etc)
	clearMap();
	
	// Display the 'busy' icon
	var theX= document.body.clientWidth * 0.2 - 32
	var theY= 0 - (document.body.clientHeight * 0.45)   
	document.getElementById('ImBusy').style.left = theX 
	document.getElementById('ImBusy').style.top = theY 
	document.getElementById('ImBusy').style.visibility = 'visible'; 

	//remove special characters from the search text
	address = address.replace(/^\s*/, "").replace(/\s*$/, "");

	//address = address.replace("-","");
	theDashLoc = address.indexOf("-")
	if ( theDashLoc > 0) {
		if (IsNumeric(address.substring(theDashLoc-1,theDashLoc))) {
			//address = address.replace("-","");
		}
	}

	if (!isNeighborhood){
		address = address.replace("/","");
	}
	address = address.replace("\\","");
	address = address.replace("%20"," ");

	//searh defaults - search for whatever is in the search box and search as if wildcard before and after the search text
	theSearchString = address
	params.contains=true;

	//Now attempt to find out what they are searching for (block, parcel, case, permit, address, neighborhood, etc).
	//alert(isNeighborhood)
	if (isNeighborhood==true) {
		//Searching for a Neighborhood
		theSearchType = "Neighborhood"
		theSearchString = address
		//mapExtension.removeFromMap(gOverlays);

		//set up the layer and field to search through then execute the find task
		for (i=0; i< dynamicMap.layerInfos.length -1; i++) {
			if (dynamicMap.layerInfos[i].name == "Neighborhoods") {
				params.outSpatialReference = {"wkid":102113};
				params.returnGeometry = true;
				params.layerIds = [dynamicMap.layerInfos[i].id];
				params.searchFields = ["name"];
				//alert(address)
				//address="Bayview"
				params.searchText = address //.toUpperCase();
				theSearchType = "Neighborhood"
				theOrigType="Neighborhood"
				params.contains = false;
				findTask.execute(params, findCompleteCallback);
				break;
			}
		}
		theSearch="neighborhood="+ address;
		return;
	} 
	
	if (isDistrict==true) {
		//Searching for a District
		theSearchType = "District"
		theSearchString = address
		//mapExtension.removeFromMap(gOverlays);
		//set up the layer and field to search through then execute the find task
		for (i=0; i< dynamicMap.layerInfos.length -1; i++) {
			if (dynamicMap.layerInfos[i].name == "Supervisor Districts 2012") {
				params.layerIds = [dynamicMap.layerInfos[i].id];
				params.searchFields = ["supervisor"];
				params.outSpatialReference = {"wkid":102113};
				params.returnGeometry = true;
				params.searchText = address //.toUpperCase();
				theSearchType = "District"
				theOrigType="District"
				params.contains = false;
				
				findTask.execute(params, findCompleteCallback);
				break;
			}
		}
		theSearch="district="+ address;
		return;
	}
	if ((parseInt(address.length)==4) && IsNumeric(address) || ((parseInt(address.length)==5) &! IsNumeric(address.substr(0,5) )) ) {
		//Searching for a BLOCK
		//alert("block")
		theSearchType = "Block"
		theSearchString = address
		//mapExtension.removeFromMap(gOverlays);
		
		//set up the layer and field to search through then execute the find task
		for (i=0; i< dynamicMap.layerInfos.length -1; i++) {
			if (dynamicMap.layerInfos[i].name == "Blocks") {
				params.layerIds = [dynamicMap.layerInfos[i].id];
				params.searchFields = ["BLOCK_NUM"];
				params.outSpatialReference = {"wkid":102113};
				params.returnGeometry = true;
				params.contains = false;
				params.searchText = address.toUpperCase();
				theSearchType = "Block"
				theOrigType="Block"
				
				findTask.execute(params, findCompleteCallback);
				break;
			}
		}
		theSearch="block="+ address;
		return;
	}
	if (IsNumeric(address.substr(0,4)) && parseInt(address.length) <  11){
		address = address.replace("-","");
		
	}
	if ( (address.substr(4,1)!=".") && (parseInt(address.length) > 6) && (parseInt(address.length) < 10) && (IsNumeric(address.substr(0,4) ) )  && (IsNumeric(address.substr(5,2) ) ) )  {
		//Searching for a PARCEL
		//alert('parcel')
		
		//mapExtension.removeFromMap(gOverlays);
		for (i=0; i< dynamicMap.layerInfos.length -1; i++) {
			if (dynamicMap.layerInfos[i].name == "Parcels") {
				params.layerIds = [dynamicMap.layerInfos[i].id];
				params.searchFields = ["BLKLOT"];
				params.searchText = address.toUpperCase();
				params.outSpatialReference = {"wkid":102113};
				params.returnGeometry = true;
				params.contains = false;
				theSearchType = "Parcel"
				theOrigType="Parcel"
				//document.getElementById('ImBusy').style.visibility = 'visible'; 
				//alert("about to send to FindTask")
				findTask.execute(params, findCompleteCallback);
				break;
			}
		}
		theSearch="parcel="+ address;
		return;

	}
	if (((parseInt(address.length) >= 8 && parseInt(address.length) <=13) && (address.substr(4,1)=="." || (address.substr(3,1)=="."))) //Old case
	  || ((parseInt(address.length) >= 12) && (address.indexOf("-")>0 ) && (IsNumeric(address.substr(address.indexOf("-"),4)) ) && (address.indexOf(" ")<0) ) //new case
	  || ((parseInt(address.length) == 9)  && (address.substr(0,2)=="MB" || address.substr(0,2)=="MA")) ) { // old misc permit
		//Above is searching for old case syntax (top bit) AND new sytax (bottom bit)
		//alert("Case")
	
		theSearch="case="+ address;
		theSearchType = "Case";
		var theFieldList = ' "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr"  '
		//example: SELECT  "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" from "3b63c2ea-1ea7-4232-be53-24751ff15dde" where "record_id" ='2014-000020GPR'
		var queryString ='SELECT '+ theFieldList + ' from "3b63c2ea-1ea7-4232-be53-24751ff15dde" where "record_id" = ' + "'" +address + "'"
		//prompt("",queryString)
		//var data = {
		//	sql: queryString
		//};
		var data = JSON.stringify({"sql" : queryString});
		$.ajax({
			url: "http://www.civicdata.com/api/action/datastore_search_sql", 
			type: 'POST',
			dataType: 'json',
			cache: false,
			data: data,
			success: function(data) {
			recordTotal=data.result.records.length
			if (data.result.records.length==0) {
				//theHtml = "No records found"
				//theCaseTrackingHtml+=theHtml
				//alert(address)
				
				unMappedAccelaPlanning(address);
			} else {
				var tempDate = new Date() 
				accelaParcelListForPlanning=""
				for (i=0; i<data.result.records.length;i++) {
					var obj = data.result.records[i]
					if (accelaParcelListForPlanning=="") {
						accelaParcelListForPlanning="'"+obj['parcel_nbr']+"'"
					} else {
						accelaParcelListForPlanning+=", '"+obj['parcel_nbr']+"'"
					}
	
				}
				//alert(accelaParcelListForPlanning)
				var theMADLayerID						
				for (i=0; i< dynamicMap.layerInfos.length; i++) {
					//alert(dynamicMap.layerInfos[i].name)
					if (dynamicMap.layerInfos[i].name == "MAD_Parcel") {
						theMADLayerID=i
						//alert("found theMADLayerID: " + theMADLayerID)
					}
				}
				theMADLayer = theArcGISServerName+"/"+theMADLayerID
				
				var theWhereClause = "  blklot in ("+ accelaParcelListForPlanning +")";
				//alert(theWhereClause)
				//prompt("",theMADLayer)
				var queryTask = new esri.tasks.QueryTask(theMADLayer);
				var query = new esri.tasks.Query();
				query.outFields = ["blklot"]
				query.returnGeometry=true;
				query.where=theWhereClause
				query.outSpatialReference = { "wkid": 102100 };
				
				//alert(accelaParcelListForPlanning)
				lookinRetired=false;
				if (accelaParcelListForPlanning!="") {
					queryTask.execute(query, handleQueryResultAccelaPlanning, taskError);
				} else {
					unMappedAccelaPlanning(address);
				}
				
			}
			
			
		
		},
		error: function(xhr, status, error) {
			alert("Error searching for Planning Application, the Accela API appears to be down, if this continues please contact the system administrator")
			//theHtmlMisc=status + "<br><br>" + error + "<br><br>" + xhr.error
			//theMiscPermitsHtml +="<table  class='reportData' style='width:100%; border-bottom: solid;'><tr><td style='width:15px'><td> Error connecting to Accela Permitting data!  If this problem persists please contact the system administrator.</td></tr></table>"
			//document.getElementById('MiscPermitsReport').innerHTML = theMiscPermitsHtml	
		}
	});	
	
	
		return;
	}
	
		//Searching for DBI Building Permit (only works for those recorded since 2000, earlier records had same app num format as blocklot so can't distinguish this from a parcel.
		if ((address.substr(2,1)!=".") &&(parseInt(address.length) > 9) && (IsNumeric(address.substr(0,7))) ) {
			//alert("permit")
			//e.g. 201105025170 
			//mapExtension.removeFromMap(gOverlays);
			//set up the layer and field to search through then execute the find task
			for (i=0; i< dynamicMap.layerInfos.length -1; i++) {
				if (dynamicMap.layerInfos[i].name == "DBI - Building Permits") {
					params.layerIds = [dynamicMap.layerInfos[i].id];
					params.searchFields = ["app_no"];
					params.outSpatialReference = {"wkid":102113};
					params.returnGeometry = true;
					params.searchText = address;
					theSearchType = "Permit"
					theOrigType="Permit"
					params.contains=false;
					//Execute the search - sending the search parameters to ArcGIS Server and firing findCompleteCallback when get a response from the ArcGIS Server
					findTask.execute(params, findCompleteCallback);
					break;
				}
			}
			theSearch="permit="+ address;
			return;
		} 
				//Searching for an address
				//alert(theSearchType)
				//alert(address)
				var theAddressArray=address.split(" ")
				//alert(IsNumeric(theAddressArray[0]))
				if(theAddressArray.length==2 && IsNumeric(theAddressArray[0]) && IsNumeric(theAddressArray[1]) ){
					//alert("its a coordinate")
					searchWithLatLong(theAddressArray[0],theAddressArray[1])
					return;
				} 
				if (theSearchType!="Address") {
					//mapExtension.removeFromMap(gOverlays);
					//alert(dynamicMap.layerInfos.length)
					//alert(address)
					for (i=0; i< dynamicMap.layerInfos.length ; i++) {
						//alert(i + " " +dynamicMap.layerInfos[i].name)
						if (dynamicMap.layerInfos[i].name == "MAD_Parcel") {
							//alert("dfgdff")
							params.layerIds = [dynamicMap.layerInfos[i].id];
							params.searchFields = ["ADDRESSSIMPLE"];
							params.outSpatialReference = {"wkid":102113};
							params.returnGeometry = true;
							params.contains=false;
							address = address.toUpperCase();
							//standardize the address string to match with MAD format
							address = address.replace("      "," ");
							address = address.replace("     "," ");
							address = address.replace("    "," ");
							address = address.replace("   "," ");
							address = address.replace("  "," ");
							address = address.replace(" 1ST"," 01ST");
							address = address.replace(" FIRST STREET"," 01ST");
							address = address.replace(" FIRST ST"," 01ST");
							address = address.replace(" 2ND"," 02ND");
							address = address.replace(" SECOND"," 02ND");
							address = address.replace(" 3RD"," 03RD");
							address = address.replace(" THIRD"," 03RD");
							address = address.replace(" 4TH"," 04TH");
							address = address.replace(" FOURTH"," 04TH");
							address = address.replace(" 5TH"," 05TH");
							address = address.replace(" FIFTH"," 05TH");
							address = address.replace(" 6TH"," 06TH");
							address = address.replace(" SIXTH"," 06TH");
							address = address.replace(" 7TH"," 07TH");
							address = address.replace(" SEVENTH"," 07TH");
							address = address.replace(" 8TH"," 08TH");
							address = address.replace(" EIGHTH"," 08TH");
							address = address.replace(" 9TH"," 09TH");
							address = address.replace(" NINETH"," 09TH");
							address = address.replace(" TENTH"," 10TH");
							address = address.replace(" ELEVENTH"," 11TH");
							address = address.replace(" TWELTH"," 12TH");
							address = address.replace(" THIRTEENTH"," 13TH");
							address = address.replace(" FOURTEENTH"," 14TH");
							address = address.replace(" FIFTHTEENTH"," 15TH");
							address = address.replace(" SIXTEENTH"," 16TH");
							address = address.replace(" SEVENTEENTH"," 17TH");
							address = address.replace(" EIGHTEENTH"," 18TH");
							address = address.replace(" NINETEENTH"," 19TH");
							address = address.replace(" TWENTIETH"," 20TH");
							address = address.replace(" TWENTY-FIRST"," 21ST");
							address = address.replace(" TWENTYFIRST"," 21ST");
							address = address.replace(" TWENTY-SECOND"," 22ND");
							address = address.replace(" TWENTYSECOND"," 22ND");
							address = address.replace(" TWENTY-THIRD"," 23RD");
							address = address.replace(" TWENTYTHIRD"," 23RD");
							address = address.replace(" TWENTY-FOURTH"," 24TH");
							address = address.replace(" TWENTYFOURTH"," 24TH");
							address = address.replace(" TWENTY-FIFTH"," 25TH");
							address = address.replace(" TWENTYFIFTH"," 25TH");
							address = address.replace(" TWENTY-SIXTH"," 26TH");
							address = address.replace(" TWENTYSIXTH"," 26TH");
							address = address.replace(" TWENTY-SEVENTH"," 27TH");
							address = address.replace(" TWENTYSEVENTH"," 27TH");
							address = address.replace(" TWENTY-EIGHTH"," 28TH");
							address = address.replace(" TWENTYEIGHTH"," 28TH");
							address = address.replace(" TWENTY-NINETH"," 29TH");
							address = address.replace(" TWENTYNINETH"," 29TH");
							address = address.replace(" THIRTIETH"," 30TH");
							address = address.replace(" THIRTY-FIRST"," 31ST");
							address = address.replace(" THIRTYFIRST"," 31ST");
							address = address.replace(" THIRTY-SECOND"," 32ND");
							address = address.replace(" THIRTYSECOND"," 32ND");
							address = address.replace(" THIRTY-THIRD"," 33RD");
							address = address.replace(" THIRTYTHIRD"," 33RD");
							address = address.replace(" THIRTY-FOURTH"," 34TH");
							address = address.replace(" THIRTYFOURTH"," 34TH");
							address = address.replace(" THIRTY-FIFTH"," 35TH");
							address = address.replace(" THIRTYFIFTH"," 35TH");
							address = address.replace(" THIRTY-SIXTH"," 36TH");
							address = address.replace(" THIRTYSIXTH"," 36TH");
							address = address.replace(" THIRTY-SEVENTH"," 37TH");
							address = address.replace(" THIRTYSEVENTH"," 37TH");
							address = address.replace(" THIRTY-EIGHTTH"," 38TH");
							address = address.replace(" THIRTYEITGHTH"," 38TH");
							address = address.replace(" THIRTY-NINETH"," 39TH");
							address = address.replace(" THIRTYNINETH"," 39TH");
							address = address.replace(" FOURTIETH"," 40TH");
							address = address.replace(" FOURTY-FIRST"," 41ST");
							address = address.replace(" FOURTYFIRST"," 41ST");
							address = address.replace(" FOURTY-SECOND"," 42ND");
							address = address.replace(" FOURTYSECOND"," 42ND");
							address = address.replace(" FOURTY-THIRD"," 43RD");
							address = address.replace(" FOURTYTHIRD"," 43RD");
							address = address.replace(" FOURTY-FOURTH"," 44TH");
							address = address.replace(" FOURTYFOURTH"," 44TH");
							address = address.replace(" FOURTY-FIFTH"," 45TH");
							address = address.replace(" FOURTYFIFTH"," 45TH");
							address = address.replace(" FOURTY-SIXTH"," 46TH");
							address = address.replace(" FOURTYSIXTH"," 46TH");
							address = address.replace(" FOURTY-SEVENTH"," 47TH");
							address = address.replace(" FOURTYSEVENTH"," 47TH");
							address = address.replace(" FOURTY-EIGHTH"," 48TH");
							address = address.replace(" FOURTYEIGHTH"," 48TH");
							//alert(address)
							//address = address.replace(" SAN FRANCISCO, CA","");
							//address = address.replace(" SAN FRANCISCO CA","");
							//address = address.replace(", SAN FRANCISCO, CA","");
							//address = address.replace(", SAN FRANCISCO CA","");
							//", san francisco ca"
							
					//alert("here")		
							if (address.indexOf("#")>-1) {
								address=address.substring(0,address.indexOf("#")-1)
							}
							//There are some street names in SF where avenue, lane and terrace appear in the middle of the address (they are not the street type), only replace these if they appear at the end of the address string
							if (address.substring(address.length,address.length-7)==" AVENUE") {
								address = address.substring(0,address.length-7) + " AVE"
							}
							if (address.substring(address.length,address.length-5)==" LANE") {
								address = address.substring(0,address.length-5) + " LN"
							}
							if (address.substring(address.length,address.length-6)==" PLAZA") {
								address = address.substring(0,address.length-6) + " PLZ"
							}
							if (address.substring(address.length,address.length-8)==" TERRACE") {
								address = address.substring(0,address.length-8) + " TER"
							}
							//alert(address)
							address = address.replace(" STREET"," ST");
							address = address.replace(" PLACE"," PL");
							//address = address.replace(" AVENUE"," AVE");
							address = address.replace(" ALLEY"," ALY");
							address = address.replace(" BOULEVARD"," BLVD");
							address = address.replace(" CIRCLE"," CIR");
							address = address.replace(" COURT"," CT");
							address = address.replace(" DRIVE"," DR");
							//address = address.replace(" HILL"," HL");
							address = address.replace(" HIGHWAY"," HWY");
							//address = address.replace(" LANE"," LN");
							//address = address.replace(" PLAZA"," PLZ");
							address = address.replace(" ROAD"," RD");
							//address = address.replace(" TERRACE"," TER");
							//alert(address)
							
							address = address.replace("'","")
							//alert(address)
							var stTypeExists = "false"
							switch (address.substring(address.length,address.length-3))
							{
							case " ST":
								stTypeExists = "true"
								break;
							case " PL":
								stTypeExists = "true"
								break;
							case " CT":
								stTypeExists = "true"
								break;
							case " DR":
								stTypeExists = "true"
								break;
							//case " HL":
							//	stTypeExists = "true"
							//	break;
							case " LN":
								stTypeExists = "true"
								break;
							case " RD":
								stTypeExists = "true"
								break;
							}
							
							switch (address.substring(address.length,address.length-4))
							{
							case " AVE":
								stTypeExists = "true"
								break;
							case " ALY":
								stTypeExists = "true"
								break;
							case " HWY":
								stTypeExists = "true"
								break;
							case " CIR":
								stTypeExists = "true"
								break;
							case " PLZ":
								stTypeExists = "true"
								break;
							case " TER":
								stTypeExists = "true"
								break;
							case " WAY":
								stTypeExists = "true"
								break;
							}
							
							switch (address.substring(address.length,address.length-5))
							{
							case " BLVD":
								stTypeExists = "true"
								break;
							case " WEST":
								stTypeExists = "true"
								break;
							case " EAST":
								stTypeExists = "true"
								break;
							}
							
							switch (address.substring(address.length,address.length-6))
							{
							case " SOUTH":
								stTypeExists = "true"
								break;
							case " NORTH":
								stTypeExists = "true"
								break;
							
							}
							
							
							
							//alert(stTypeExists)
							//If the user has not entered a street type switch the search to look though the MAD field that doesn't include street type
							if (stTypeExists=="false") {
								params.searchFields = ["ADDRESSNOTY"];
							}
							//alert(address)
							params.searchText = address ;
							//alert(address)
							//alert(params.searchFields)
							theSearchType = "Address"
							theOrigType="Address"
							//Execute the search - sending the search parameters to ArcGIS Server and firing findCompleteCallback when get a response from the ArcGIS Server
							//alert("About to send to find task")
							
							findTask.execute(params, findCompleteCallback);
							
							break;
						}
					}
					theSearch="Address="+ address;
				} else {
					//alert("here2")
					address=address.replace("'","")
					var theAddressArray=address.split(" ")
					var theAddressNum
					var theAddressStreet
					var searchForCloseAddresses=false
					
					//alert("theAddressArray: " + theAddressArray)
					if (theAddressArray.length==1) {
						
						//Its a one word search string that isn't a case, permit or parcel, send it to the geocoder
						theOrigType="Address"
						
						document.getElementById('ImBusy').style.visibility = 'hidden'; 
						address = address + ", San Francisco, CA";
						//alert(address)
						//address = address + ", San Francisco, CA";
						theSearchType = "Geocode"
						theSearch="geocode="+ address;
						map.graphics.clear();        
						var address2 = {"SingleLine":address};
						locator.outSpatialReference= map.spatialReference;        
						var options = {          
							address:address2,          
							outFields:["Loc_name"]        
							}        
						locator.addressToLocations(options,showGeocodeResults,geocodeError);
						return;
					}
					if (IsNumeric(theAddressArray[0])) {
						//alert("Its Numeric")
						theAddressNum=theAddressArray[0]
						theAddressStreet = theAddressArray[1].toUpperCase()
						searchForCloseAddresses=true
					} else {
						//alert("Its Not Numeric")
						if (IsNumeric(theAddressArray[0].substring(0,theAddressArray[0].length-1))) {
							theAddressNum=theAddressArray[0].substring(0,theAddressArray[0].length-1)
							theAddressStreet = theAddressArray[1].toUpperCase()
							searchForCloseAddresses=true
						}
					}
					if (searchForCloseAddresses) {
						//alert("search for close addresses\n" +"Num: "+ theAddressNum + "\nStreet: "+ theAddressStreet	)
						var theMADLayerID						
						for (i=0; i< dynamicMap.layerInfos.length; i++) {
							//alert(dynamicMap.layerInfos[i].name)
							if (dynamicMap.layerInfos[i].name == "MAD_Parcel") {
								theMADLayerID=i
								//alert("found theMADLayerID: " + theMADLayerID)
							}
						}
						theMADLayer = theArcGISServerName+"/"+theMADLayerID
						//prompt("",theMADLayer)
						var add_num_Low = parseInt(theAddressNum)-30
						var add_num_High = parseInt(theAddressNum)+30 
						
						//var theWhereClause = "  street_name like '%" + theAddressStreet + "%' AND ( CAST(base_address_num  as INTEGER) >= " + add_num_Low + "  AND CAST(base_address_num  as INTEGER) <= " + add_num_High +")";
						var theWhereClause = "  street_name like '%" + theAddressStreet + "%' AND ( base_address_num  >= " + add_num_Low + "  AND base_address_num <= " + add_num_High +")";
						
						//prompt("",theWhereClause)
						//var theWhereClause = "  STREETNAME = 'ULLOA ST' "
						//alert("theMADLayer: "+ theMADLayer)
						var queryTask = new esri.tasks.QueryTask(theMADLayer);
						var query = new esri.tasks.Query();
						query.outFields = ["street_name","base_address_num","unit_address","ADDRESS"]
						//query.outFields = ["*"]
						query.returnGeometry=false;
						query.where=theWhereClause
						
						//query.orderByFields=["street_name","base_address_num","unit_address"]
						//query.orderByFields=["street_name"]
						
						//query.orderByFields=[ADDRESS]
						
						//alert("query.orderByFields: " + query.orderByFields)
						//alert("about to send")
						//queryTask.execute(query, handleQueryResult);
						queryTask.execute(query, handleQueryResult, taskError);
						return;
						
					}
					var coordArray=address.split(" ")					
					if (coordArray[0].substring(0,3)=="37." && coordArray[1].substring(0,5)=="-122.") {
						searchWithLatLong(coordArray[0],coordArray[1])
					} else {
						theOrigType="Address"
						//alert("using geocoder")
						//Not sure what it is, send it to ESRI to attempt to geocode it. ESRI will return a lat/long, the marker will be placed on the map and the 'identifyClick()' function will be run as if the user clicked on the map.
						//This will only run if it was not identified as a block, lot, case or permit and it didn't find anything in MAD.
						document.getElementById('ImBusy').style.visibility = 'hidden'; 
						address = address + ", San Francisco, CA";
						//address = address + ", San Francisco, CA";
						theSearchType = "Geocode"
						theSearch="geocode="+ address;
						map.graphics.clear();        
						var address2 = {"SingleLine":address};
						locator.outSpatialReference= map.spatialReference;        
						var options = {          
							address:address2,          
							outFields:["Loc_name"]        
							}        
						locator.addressToLocations(options,showGeocodeResults,geocodeError);
					}
					
				}
			
		
	
	
	
	
	//isDistrict=false
	//isNeighborhood=false;
     }
function unMappedAccelaPlanning(theRecID) {
	//alert("In unMappedAccela")
	var theFieldList = ' "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."APN" '
	theFieldList +=', "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE OPENED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."ADDRESS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE CATEGORY" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS DATE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."JOB VALUE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE CLOSED" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE COMPLETED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE TYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DESCRIPTION" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE SUBTYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."TEMPLATE ID" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER EMAIL" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER PHONE" '
	theFieldList +=', "c10252c9-bcc3-4ec4-b8ae-f863452bd27f"."PARENT_ID" '
	theFieldList +=', "c10252c9-bcc3-4ec4-b8ae-f863452bd27f"."CHILD_ID" '
	
	if (!theParcelListForAccela) {
		theParcelListForAccela="'9'"
	}
	var queryString = 'SELECT ' + theFieldList + ' from  "32fee353-3469-4307-bdcd-54ddbe9b5fae" '
	queryString += 'LEFT JOIN "3b63c2ea-1ea7-4232-be53-24751ff15dde" ON "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" = "3b63c2ea-1ea7-4232-be53-24751ff15dde"."record_id" '
	queryString += 'LEFT JOIN "c10252c9-bcc3-4ec4-b8ae-f863452bd27f" ON "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" = "c10252c9-bcc3-4ec4-b8ae-f863452bd27f"."PARENT_ID" '
	//queryString += 'where ("parcel_nbr" in(' + theParcelList +  ') OR "APN"  in(' + theParcelList + ' ) ) and "RECORD TYPE" <> ' + "'Misc. Permits-REF (MIS)'" + ' order by "record_id" desc, "CHILD_ID" asc'
	queryString += 'where "RECORD ID" = ' +"'"+ theRecID + "' "
	//queryString +=  'and "RECORD TYPE" <> ' + "'Misc. Permits-REF (MIS)'" +  ' and "RECORD TYPE" <> ' + "'Enforcement (ENF)'" +  ' and "RECORD TYPE" not like ' + "'Zoning Administrator%'" + ' order by "DATE OPENED" desc'
	queryString +=  ' and "RECORD TYPE" not like ' + "'Zoning Administrator%'" + ' order by "DATE OPENED" desc'
	//prompt("Query For UnMapped Planning Apps",queryString)
	
	printLink = " <a class='NoPrint' style='float:right; font-size: 14px; font-family:Arial, Helvetica, sans-serif; color: #33b5ff; text-decoration: underline;' href='javascript: printReports();'> Printable Version of Reports</a>"
				
	//theMiscPermitsHtml = printLink + "<div class='searchPaneSectionHeader'> </div><div class='reportHeader'><span style='color: #0099ff;'>Miscellaneous Permits Report: </span><span style='color: #000000;'>"  +  theSearchString + "</span></div><br>"
	theCaseTrackingHtml = printLink + "<div class='searchPaneSectionHeader'> </div><div class='reportHeader'><span style='color: #0099ff;'>Planning Records Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div>"
				
	var theHtmlCase='';
	var theHtmlCase1='';
	
	//theCaseTrackingHtml +="<br><table class='reportData' width=100%><tr><td style='width:10px'></td><td>Permits are required in San Francisco to operate a businesses or to perform construction activity. The Planning Department reviews most applications for these permits in order to ensure that the projects comply with the <a alt='PlanningCode' href='http://planningcode.sfplanning.org' target='_blank'>Planning Code</a>. The 'Project' is the activity being proposed.</td></tr></table>"
	
	theCaseTrackingHtml += "<table class='NoPrint'><tr><td style='padding-left:15px'><a target='_blank' href='MapHelp.html#ProjectsGlossary'>Glossary </a></td></tr></table><br>"
	theCaseTrackingHtml +="<br><br><div class='NoPrint'><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theCaseTrackingHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkProjects'>Planning Records</a></td></tr></table>"
	theCaseTrackingHtml +="<br></div>"
	theCaseTrackingHtml +="<a name='BookmarkProjects'/>"
	theCaseTrackingHtml +="<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PLANNING RECORD: </SPAN></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	
	theCaseNum = 0
	var theCaseActive=0
	//var data = {
	//	sql: queryString
	//};
	var data = JSON.stringify({"sql" : queryString});
	$.ajax({
		url: "http://www.civicdata.com/api/action/datastore_search_sql", 
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function(data) {
			recordTotal=data.result.records.length
			//alert("Total Planning records returned from Accela: " + recordTotal)
			var tmpRecordID = ""
			//var tmpRecordTypeDetailed = ""
			var tmpOpened = ""
			if (data.result.records.length==0) {
				var theTitle="I Can't Find It"
				var theMessage = "I'm sorry, I can't find '"+theSearchString+"', it does not appear to be a valid record number.  If you know the address or parcel try searching for that instead."
				new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}], callback: function(){
					document.getElementById('AssessorReport').innerHTML = instructions
					document.getElementById('ZoningReport').innerHTML = instructions
					document.getElementById('SurveyRatingsReport').innerHTML = instructions
					document.getElementById('CaseTrackingReport').innerHTML = instructions
					document.getElementById('PermitsReport').innerHTML = instructions
					document.getElementById('MiscPermitsReport').innerHTML = instructions
					document.getElementById('EnforcementReport').innerHTML = instructions 
					document.getElementById('AppealsReport').innerHTML = instructions 
					document.getElementById('BBNsReport').innerHTML = instructions 	
				}});
				//theHtml = "No records found"
				//theCaseTrackingHtml+=theHtml
			} else {
				theCaseTrackingHtml+="<p><table width='100%'><tr><td style='padding-left: 10px;font-family:Verdana, Arial, Helvetica, sans-serif;font-weight: bold;font-size: 13px;' >Planning Record " +theSearchString + " is not associated with any valid parcels so cannot be mapped or linked to other parcel or property information.  All other sections (Property, Preservation, Zoning, etc. will remain empty).</td><td align='right'>&nbsp &nbsp</td></tr></table><br>"
				if (dept=="PLANNING" && theLoc=="City") {
					theCaseTrackingHtml+="<table width='100%' class='NoPrint'><tr><td style='padding-left: 10px;font-family:Verdana, Arial, Helvetica, sans-serif;font-weight: bold;font-size: 13px;' >Planning Records can be associated with parcels through Accela Automation.  If you need help with this please contact OASIS.</td><td align='right'>&nbsp &nbsp</td></tr></table><br><br>"
				}
				tmpPRJ=""
				var tempDate = new Date() 
				
				for (i=0; i<data.result.records.length;i++) {
					var obj = data.result.records[i]
					if (tmpRecordID!=obj['RECORD ID'] || tmpOpened != obj['DATE OPENED']) {
						//alert(i)
						tmpRecordID = obj['RECORD ID']
						//tmpRecordTypeDetailed = obj['RECORD TYPE']
						tmpOpened = obj['DATE OPENED']
						theCaseNum= i+1
						
						//display those records with no associated Project record.
						tmpCase=obj['RECORD ID'].substring(0,obj['RECORD ID'].length-3)
						tmpCasePRJ=tmpCase+"PRJ"
						PRJExists=false;
						for (k=0; k<data.result.records.length;k++) {
							var obj3 = data.result.records[k]
							if (tmpCasePRJ==obj3['RECORD ID']) {
								PRJExists=true;
							}
						}
							
						theHtmlCase +="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'><b>Record ID: </b> </td><td><b>" + obj['RECORD ID']+ "</b></td></tr>"
						var plannerName=obj['PLANNER NAME']
						var plannerEmail=obj['PLANNER EMAIL']
						var plannerPhone=obj['PLANNER PHONE']
						if (plannerName.length<2) {
							plannerName="Planning Information Center"
						} 
						if (plannerEmail.indexOf("@")<1) {
							plannerEmail="pic@sfgov.org"
						} 
						if (plannerPhone.length<7) {
							plannerPhone="415-558-6377"
						} 
						if ((theLoc=="City") && (dept=="PLANNING")) {
									
						} else {
							var baseYear = new Date (1960, 10, 1)
							var decisDate = new Date(obj["DATE CLOSED"])
							if (decisDate > baseYear) {
								var today = new Date()
								var yearAgo = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 365))
								if (decisDate < yearAgo) {
									plannerName = "Planning Information Center";
									plannerPhone = "415-558-6377";
									plannerEmail = "pic@sfgov.org";
								}
							}
						}
								
						var plannerEmailLink = "<a href='mailto:"+plannerEmail+"'>"+plannerName+"</a> Tel: "+plannerPhone
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'><b>Planner: </b> </td><td><b>" + plannerEmailLink+ "</b></td></tr>"
						
						
						var theRecType = obj['RECORD TYPE']
						//theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + obj['RECORD TYPE TYPE'] + " / " + obj['RECORD TYPE SUBTYPE'] +  "</td></tr>"
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType +  "</td></tr>"
						//theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Template ID:  </td><td>" + obj['TEMPLATE ID'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE OPENED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
								
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + obj['RECORD NAME'] + "</td></tr>"
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + obj['DESCRIPTION'] + "</td></tr>"
								
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + obj['APN'] + "</td></tr>"
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + obj['ADDRESS'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['RECORD STATUS DATE'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						var theStatus = obj['STATUS']
						if (!theStatus) {
							theStatus=''
						}
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus  + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE CLOSED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Closed:  </td><td>" + dateString + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE COMPLETED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						//theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(obj['JOB VALUE']) + "</td></tr>"
						var ACALinkData = obj['TEMPLATE ID'].split("/");
						var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
						var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
									
						//theLinkText="View"
						if ((theLoc=="City") && (dept=="PLANNING")) {
							theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						} else {
							theHtmlCase += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						}
						
						
						theHtmlCase += "</td></tr>"
						theHtmlCase += "</table><br>" 
								
						//if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed") {
						if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed"&&theStatus!= "Expired"&&theStatus!= "Issued"&&theStatus!= "Revoked"&&theStatus!= "Void"&&theStatus!= "Withdrawn"&&theStatus!= "Cancelled"&&theStatus!= "Case Closed") {
							
							theCaseActive=theCaseActive +1
						}
					}
				}
			} 
			theCaseTrackingHtml +=theHtmlCase
			if (theCaseNum==0) {
				theCaseTrackingHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
			}
			if (theCaseActive==0) {
				document.getElementById('tabTitle'+'3').style.color= ""//"#828282"
				document.getElementById('tabTitle'+'3').style.fontWeight=""//"normal"
				document.getElementById('tabTitle'+'3').style.fontSize=""//"11px" 
			} else {
				document.getElementById('tabTitle'+'3').style.color="black" 
				document.getElementById('tabTitle'+'3').style.fontWeight="bold" 
				document.getElementById('tabTitle'+'3').style.fontSize="15px" 
			}
			
			//clean out 'null's and 'undefined's
			theCaseTrackingHtml = theCaseTrackingHtml.replace(/Null/gi,"&nbsp");
			theCaseTrackingHtml = theCaseTrackingHtml.replace(/undefined/gi,"&nbsp");
			
			//add some room to the bottom of the report
			theCaseTrackingHtml += "<p class='NoPrint'><br></p>"
			theCaseTrackingHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkProjectsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
			theCaseTrackingHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
			//alert(theMiscPermitsHtml)
			document.getElementById('CaseTrackingReport').innerHTML = theCaseTrackingHtml
			document.getElementById('AssessorReport').innerHTML = instructions
			document.getElementById('ZoningReport').innerHTML = instructions
			document.getElementById('SurveyRatingsReport').innerHTML = instructions
			//document.getElementById('CaseTrackingReport').innerHTML = instructions
			document.getElementById('PermitsReport').innerHTML = instructions
			document.getElementById('MiscPermitsReport').innerHTML = instructions
			document.getElementById('EnforcementReport').innerHTML = instructions 
			document.getElementById('AppealsReport').innerHTML = instructions 
			document.getElementById('BBNsReport').innerHTML = instructions 
			showTab('dhtmlgoodies_tabView1',3);
			document.getElementById('ImBusy').style.visibility = 'hidden'; 
			
			
			//var theTitle="Found Orphaned Record(s)"
			//new Messi(theHtmlCase, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}]});
			
			
		},
		error: function(xhr, status, error) {
			theHtmlMisc=status + "<br><br>" + error + "<br><br>" + xhr.error
			theCaseTrackingHtml +="<table  class='reportData' style='width:100%; border-bottom: solid;'><tr><td style='width:15px'><td> Error connecting to Accela Permitting data!  If this problem persists please contact the system administrator.</td></tr></table>"
			document.getElementById('CaseTrackingReport').innerHTML = theCaseTrackingHtml	
			document.getElementById('CaseTrackingReport').innerHTML = theCaseTrackingHtml
			document.getElementById('AssessorReport').innerHTML = instructions
			document.getElementById('ZoningReport').innerHTML = instructions
			document.getElementById('SurveyRatingsReport').innerHTML = instructions
			//document.getElementById('CaseTrackingReport').innerHTML = instructions
			document.getElementById('PermitsReport').innerHTML = instructions
			document.getElementById('MiscPermitsReport').innerHTML = instructions
			document.getElementById('EnforcementReport').innerHTML = instructions 
			document.getElementById('AppealsReport').innerHTML = instructions 
			document.getElementById('BBNsReport').innerHTML = instructions 
			showTab('dhtmlgoodies_tabView1',3);
			document.getElementById('ImBusy').style.visibility = 'hidden'; 
		}
	});	
	
	
	
	
}

function handleQueryResultAccelaPlanning(results) {
	//alert("in handleQueryResultAccelaPlanning, No results: " + results.features.length)
	
	if (results.features.length==0  && theSearchType=="Case") {
		if (lookinRetired==true) {
			lookinRetired=false
			unMappedAccelaPlanning(theSearchString);
		} else {
			var theRetiredLayerID	
	 
			for (i=0; i< dynamicMap.layerInfos.length; i++) {
				//alert(dynamicMap.layerInfos[i].name)
				if (dynamicMap.layerInfos[i].name == "Retired Parcels") {
					theRetiredLayerID=i
					//alert("found theMADLayerID: " + theMADLayerID)
				}
			}
			
			theRetiredLayer = theArcGISServerName+"/"+theRetiredLayerID
			retiredParcels=accelaParcelListForPlanning
			//alert(accelaParcelListForPlanning)
			var theWhereClause = "  OLDBLKLOT in ("+ accelaParcelListForPlanning +")";
			//alert(theWhereClause)
			var queryTask = new esri.tasks.QueryTask(theRetiredLayer);
			var query = new esri.tasks.Query();
			query.outFields = ["BLKLOT"]
			query.returnGeometry=true;
			query.where=theWhereClause
			query.outSpatialReference = { "wkid": 102100 };
			lookinRetired=true;
			queryTask.execute(query, handleQueryResultAccelaPlanning, taskError);
		
		
		
		
		}
	} else {
	
		var features = results.features;
		var polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]), 2), new dojo.Color([100,100,255,0.5])); 
		var featureCount = features.length;
		var infoTemplate = new esri.InfoTemplate();
		infoTemplate.setTitle("${blklot}"); 
		content = "<div overflow='auto' >Buffer by:<table border=0 ><tr></td><td style='width:40px'> <a id='lnkBuffer150' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,190.5);' title= 'Buffer this area by 150ft'> 150ft;</a>&nbsp </td>"
		content += "<td style='width:40px'> <a id='lnkBuffer300' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,381);' title= 'Buffer this area by 300ft'> 300ft;</a>&nbsp</td>  "
		content += "<td style='width:50px'> <a id='lnkBuffer1000' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1270);' title= 'Buffer this area by 1,000ft'> 1000ft;</a>&nbsp</td>"
		content += "<td style='width:70px'> <a id='lnkBuffer1320' href ='#Buffer' onclick='imbuffering=true; bufferCurrentOverlays(theBuffGeoms,1676.4);' title= 'Buffer this area by 1/4 of a mile'> 1/4 mile</a>&nbsp</td></tr>"
		content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; clearBuffer();' title= 'Clear Buffer'>Clear buffers</a></td></tr>"
		content += "<tr><td colspan=4><a id='lnkClearBuffer' href ='#Buffer' onclick='imbuffering=true; removeBlue();' title= 'Clear Buffer'>Remove boundary from map</a></td></tr></table></div>"
		infoTemplate.setContent(content)
		
		theBuffGeoms= []
		var bufferPolys = [];
		var myExtent = features[0].geometry.getExtent()
		
		
		for (var i = 0; i < featureCount; i++) {
			//Get the current feature from the featureSet. 
			var graphic = features[i];
			//Feature is a graphic
			graphic.setSymbol(polygonSymbol);
			graphic.setInfoTemplate(infoTemplate);
			map.graphics.add(graphic);
			bufferPolys.push(graphic.geometry)
			tmpExtent = features[i].geometry.getExtent()
			myExtent = myExtent.union(tmpExtent)
			//alert(myExtent.getWidth())
		}
		
		//zoomExtent = graphic.geometry.getExtent().expand(3);
		zoomExtent = myExtent.expand(2)
		map.setExtent(zoomExtent); 
		map.infoWindow.resize(235,230);

		theBuffGeoms.push(results)
		
		theBufferDist= -0.95
		buffParams.distances = [1, theBufferDist];
		buffParams.geometries = bufferPolys
		buffParams.unionsResults = true;
		
		gsvc.buffer(buffParams,buffCallback, taskError);
	}
	
	return;
}
     
     
     
function handleQueryResultRetiredParcel(results) {
	//alert(results.features.length)
	
	//USE this as a test address: 4280005
	//alert("1")
	theParcelList=""
	var theRecDate=""
	//var d=null
	var the_date = null
	var the_month = null
	var the_year = null
	
	for (var i = 0; i < results.features.length; i++) {
		var featureAttributes = results.features[i].attributes;
		var theParcel = featureAttributes["BLKLOT"]
		if (featureAttributes["RECORDED"]) {
			var d = new Date(featureAttributes["RECORDED"]);
			if (d==null ||d==" " || d=="" || d== "Null" ) {
			} else {
				the_date = d.getDate();
				the_month = d.getMonth() + 1; //Months are zero based
				the_year = d.getFullYear();
				
			}
		}
		theParcelList+= "<div height='275px' overflow='auto' onmouseover=" + '"' + "this.style.background='lightgray';" +'"' + 'onmouseout="this.style.background=' + "'" + "white" + "'" + ";" + '"'+" onClick='javascript:gotit(" + '"' +theParcel+ '"' + ");'>" + theParcel+"</div>";
	}
	
	if (results.features.length==0) {
		if (theSearchType=='Parcel') {
			//alert("-"+theSearchString +"-")
			var theBlocktest=theSearchString.substring(4,5)
			var theBlock=""
			var theLotTest=theSearchString.substring(theSearchString.length-1,theSearchString.length)
			var theLot=""
			var fiveLetterBlock=false
						
			//Check to see it it's a 4 or 5 character block
			if (IsNumeric(theBlocktest)||theBlocktest=='/'||theBlocktest==' ') {
				theBlock=  theSearchString.substring(0,4)
				
			} else {
				theBlock=  theSearchString.substring(0,5)
				fiveLetterBlock=true
			}
			
			var theBlockDig1=theBlock.substring(0,1)
			var theBlockDig2=theBlock.substring(1,2)
			var theBlockDig3=theBlock.substring(2,3)
			var theBlockDig4=theBlock.substring(3,4)
			
			if (IsNumeric(theLotTest)) {
				theLot = theSearchString.substring(theSearchString.length-3,theSearchString.length)
			} else {
				theLot = theSearchString.substring(theSearchString.length-4,theSearchString.length)
			}
						
			
			var theParcelLayerID						
			for (i=0; i< dynamicMap.layerInfos.length -1; i++) {
				if (dynamicMap.layerInfos[i].name == "Parcels") {
					theParcelLayerID=i
				}
			}
			theParcelLayer = theArcGISServerName+"/"+theParcelLayerID
						
			var theWhereClause = " (block_num = '" + theBlock.toUpperCase() + "') ";
						
			//Try to account for possible block typos, search for anything within 1 digit of the block (all 4 numbers being one up or down,  or with the letter removed if there is one
			theWhereClause+=" OR ( ( "
			if (fiveLetterBlock) {
				theWhereClause+=" (block_num = '" + theBlockDig1 + theBlockDig2+theBlockDig3+theBlockDig4 +"') OR"
			}
			theWhereClause+="  (block_num = '" + ((parseInt(theBlockDig1)+1)==10 ? 0: parseInt(theBlockDig1)+1)  + theBlockDig2+theBlockDig3+theBlockDig4 +"') "
			theWhereClause+=" OR (block_num = '" + theBlockDig1 + ((parseInt(theBlockDig2)+1)==10 ? 0: parseInt(theBlockDig2)+1) +theBlockDig3+theBlockDig4 +"') "
			theWhereClause+=" OR (block_num = '" + theBlockDig1 + theBlockDig2+((parseInt(theBlockDig3)+1)==10 ? 0: parseInt(theBlockDig3)+1)+theBlockDig4 +"') "
			theWhereClause+=" OR (block_num = '" + theBlockDig1 + theBlockDig2+theBlockDig3+((parseInt(theBlockDig4)+1)==10 ? 0: parseInt(theBlockDig4)+1) +"') "
			theWhereClause+=" OR (block_num = '" + Math.abs(parseInt(theBlockDig1)-1) + theBlockDig2+theBlockDig3+theBlockDig4 +"') "
			theWhereClause+=" OR (block_num = '" + theBlockDig1 + Math.abs(parseInt(theBlockDig2)-1) +theBlockDig3+theBlockDig4 +"') "
			theWhereClause+=" OR (block_num = '" + theBlockDig1 + theBlockDig2+Math.abs(parseInt(theBlockDig3)-1)+theBlockDig4 +"') "
			theWhereClause+=" OR (block_num = '" + theBlockDig1 + theBlockDig2+theBlockDig3+Math.abs(parseInt(theBlockDig4)-1) +"') "
			theWhereClause+= " ) AND ( lot_num = '" + theLot.toUpperCase() + "') )  "
						
			//alert(theWhereClause)
			var queryTask = new esri.tasks.QueryTask(theParcelLayer);
			var query = new esri.tasks.Query();
			query.outFields = ["*"]
			query.returnGeometry=false;
			query.where=theWhereClause
			query.orderByFields=["BLKLOT"]
			//alert("ddd")	
			queryTask.execute(query, handleQueryResultParcel, taskError);
			return
		} 
		
	} else {
		var theMessage = "<div style='text-align:left;'>This parcel no longer exists, it was retired "
		if (the_date) {
			theMessage+= " on "+ the_month + "/" + the_date + "/" + the_year
		}
		theMessage+=" and replaced by the parcel"
		if (results.features.length>1) {
			theMessage+="s"
		}
		theMessage+=" below."
		theMessage+= " Please select a parcel to continue:</div>" + theParcelList
		var theTitle="Select a Parcel"
		//var theMessage = "<div style='text-align:left;'>This parcel was retired and replaced by the parcel(s) below, please select a parcel to continue:</div>" + theParcelList
		//new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}]});
		
		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}], callback: function(){
			document.getElementById('AssessorReport').innerHTML = instructions
			document.getElementById('ZoningReport').innerHTML = instructions
			document.getElementById('SurveyRatingsReport').innerHTML = instructions
			document.getElementById('CaseTrackingReport').innerHTML = instructions
			document.getElementById('PermitsReport').innerHTML = instructions
			document.getElementById('MiscPermitsReport').innerHTML = instructions
			document.getElementById('EnforcementReport').innerHTML = instructions 
			document.getElementById('AppealsReport').innerHTML = instructions 
			document.getElementById('BBNsReport').innerHTML = instructions 	
		}});
	}
} 
function handleQueryResultParcel (results) {
	//USE this as a test address: 680 MARKET ST #2001
	//alert("1")
	//theAddressList="<table><tbody>"
	theParcelList=""
	for (var i = 0; i < results.features.length; i++) {
		var featureAttributes = results.features[i].attributes;
		var theParcel = featureAttributes["blklot"]
		theParcelList+= "<div height='275px' overflow='auto' onmouseover=" + '"' + "this.style.background='lightgray';" +'"' + 'onmouseout="this.style.background=' + "'" + "white" + "'" + ";" + '"'+" onClick='javascript:gotit(" + '"' +theParcel+ '"' + ");'>" + theParcel+"</div>";
	}
	if (results.features.length==0) {
		//alert("cant' find it")
		var theTitle="I Can't Find It"
		var theMessage = "I'm sorry, I can't find '"+theSearchString+"', it does not appear to be a valid parcel number.  If you know the address try searching for that instead."
		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}], callback: function(){
			document.getElementById('AssessorReport').innerHTML = instructions
			document.getElementById('ZoningReport').innerHTML = instructions
			document.getElementById('SurveyRatingsReport').innerHTML = instructions
			document.getElementById('CaseTrackingReport').innerHTML = instructions
			document.getElementById('PermitsReport').innerHTML = instructions
			document.getElementById('MiscPermitsReport').innerHTML = instructions
			document.getElementById('EnforcementReport').innerHTML = instructions 
			document.getElementById('AppealsReport').innerHTML = instructions 
			document.getElementById('BBNsReport').innerHTML = instructions 	
		}});
		
	} else {
		var theTitle="Select a Parcel"
		var theMessage = "<div style='text-align:left;'>This does not appear to be a valid parcel number, please select from this list of similar sounding parcels:</div>" + theParcelList
		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}], callback: function(){
			document.getElementById('AssessorReport').innerHTML = instructions
			document.getElementById('ZoningReport').innerHTML = instructions
			document.getElementById('SurveyRatingsReport').innerHTML = instructions
			document.getElementById('CaseTrackingReport').innerHTML = instructions
			document.getElementById('PermitsReport').innerHTML = instructions
			document.getElementById('MiscPermitsReport').innerHTML = instructions
			document.getElementById('EnforcementReport').innerHTML = instructions 
			document.getElementById('AppealsReport').innerHTML = instructions 
			document.getElementById('BBNsReport').innerHTML = instructions 	
		}});
	}
}
function handleQueryResult(results) {
	//USE this as a test address: 680 MARKET ST #2001
	//alert("here")
	//alert("results.features.length: "+results.features)
	//alert('here2')
	
	//alert(results.length)
	
	var idResults2=new Array();
	idResults2 = results.features;
	
	theAddressList="<table><tbody>"
	theAddressList=""
	if (results.features==undefined) {
		theOrigType="Address"
		theSearchString = theSearchString.replace("SAN FRANCISCO","")
		theSearchString = theSearchString + ", San Francisco, CA";
		theSearchType = "Geocode"
		theSearch="geocode="+ theSearchString;
		map.graphics.clear();   
		//alert("theSearchString: " + theSearchString)		
		var address2 = {"SingleLine":theSearchString};
		
		locator.outSpatialReference= map.spatialReference;        
		var options = {          
			address:address2,          
			outFields:["Loc_name"]        
			}        
		locator.addressToLocations(options,showGeocodeResults,geocodeError);
		return;

	}

	if (results.features.length==0) {
		theOrigType="Address"
		theSearchString = theSearchString + ", San Francisco, CA";
		theSearchType = "Geocode"
		theSearch="geocode="+ theSearchString;
		map.graphics.clear();        
		var address2 = {"SingleLine":theSearchString};
		locator.outSpatialReference= map.spatialReference;        
		var options = {          
			address:address2,          
			outFields:["Loc_name"]        
			}        
		locator.addressToLocations(options,showGeocodeResults,geocodeError);
		return;
	} else {
		idResults2.sort(idresultsort2)
		
		for (var i = 0; i < idResults2.length; i++) {
			var featureAttributes = idResults2[i].attributes;
			var theAddress = featureAttributes["ADDRESS"]
			theAddressList+= "<div height='275px' overflow='auto' onmouseover=" + '"' + "this.style.background='lightgray';" +'"' + 'onmouseout="this.style.background=' + "'" + "white" + "'" + ";" + '"'+" onClick='javascript:gotit(" + '"' +theAddress+ '"' + ");'>" + theAddress+"</div>";
		}
		//for (var i = 0; i < results.features.length; i++) {
		//	var featureAttributes = results.features[i].attributes;
		//	var theAddress = featureAttributes["ADDRESS"]
			//tmpArr[i]=theAddress
		//	theAddressList+= "<div height='275px' overflow='auto' onmouseover=" + '"' + "this.style.background='lightgray';" +'"' + 'onmouseout="this.style.background=' + "'" + "white" + "'" + ";" + '"'+" onClick='javascript:gotit(" + '"' +theAddress+ '"' + ");'>" + theAddress+"</div>";
		//}
		var theTitle="Select an Offiicial Address"
		var theMessage = theAddressList
		//new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}]});
		
		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}], callback: function(){
			document.getElementById('AssessorReport').innerHTML = instructions
			document.getElementById('ZoningReport').innerHTML = instructions
			document.getElementById('SurveyRatingsReport').innerHTML = instructions
			document.getElementById('CaseTrackingReport').innerHTML = instructions
			document.getElementById('PermitsReport').innerHTML = instructions
			document.getElementById('MiscPermitsReport').innerHTML = instructions
			document.getElementById('EnforcementReport').innerHTML = instructions 
			document.getElementById('AppealsReport').innerHTML = instructions 
			document.getElementById('BBNsReport').innerHTML = instructions 	
		}});
	}
}
function gotit(theaddress) {
	theOrigType=""
	theSearchType=""
	$('.messi,.messi-modal').remove();
	document.getElementById("addressInput").value =theaddress
	showAddress(theaddress)
}
function errorHandler(error) {
	alert("I'm sorry, there has been an error with this search, please try again.")	
}
	     	     
     
function geocodeError() {
	alert("You entered a non-official address.  The service that deals with non-official address searching is presently not available, you can continue by either entering an official address or parcel number or by clicking on the map. This error is most likely to affect Firefox, using another browser may solve the problem. ")
	document.getElementById('AssessorReport').innerHTML = instructions
	document.getElementById('ZoningReport').innerHTML = instructions
	document.getElementById('SurveyRatingsReport').innerHTML = instructions
	document.getElementById('CaseTrackingReport').innerHTML = instructions
	document.getElementById('PermitsReport').innerHTML = instructions
	document.getElementById('MiscPermitsReport').innerHTML = instructions
	document.getElementById('EnforcementReport').innerHTML = instructions 
	document.getElementById('AppealsReport').innerHTML = instructions 
	document.getElementById('BBNsReport').innerHTML = instructions 
	
}
function showGeocodeResults(candidates) {   
	//alert("Candidates: " + candidates.length)
	var candidate;
	var bestCandidate;
	var reserveCandidate;
	map.graphics.clear();
	var IDsymbol = new esri.symbol.PictureMarkerSymbol('http://' + theServerName + '/PIM/images/blue.png', 32, 32).setOffset(0,16);
	var geom;
	for (i=0;i<candidates.length;i++) {
		var candidate = candidates[i]
		//alert(candidates[i].score + "\n" + candidates[i].address + "\n" +candidates[i].attributes.Loc_name)
		if ((candidate.score > 80) && (candidate.attributes.Loc_name=="Gaz.WorldGazetteer.POI1" || candidate.attributes.Loc_name=="USA.StreetAddress")) {   
			bestCandidate = candidate
			break;
		}
		if ((candidate.score > 80) && (candidate.attributes.Loc_name=="Gaz.WorldGazetteer.POI2")) {   
			reserveCandidate = candidate
		}
	}
	if (!bestCandidate) {
		bestCandidate = reserveCandidate
	}
	if (bestCandidate) {
		//alert("bestCandidate")
		var attributes = { address: candidate.address, score:candidate.score, locatorName:candidate.attributes.Loc_name };
		geom = candidate.location;
		//var infoTemplate = new esri.InfoTemplate("Location", "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}");
		var infoTemplate = new esri.InfoTemplate();
		infoTemplate.setTitle(candidate.address); 
		content="<table><tr><td>If this isn't the correct location please click the correct location on the map.<br><br>It is important to click inside a property boundary.</td></tr></table>"
		infoTemplate.setContent(content)
		var graphic = new esri.Graphic(geom, IDsymbol, attributes, infoTemplate);
		graphic.setInfoTemplate(infoTemplate);
		theSearchGraphic = graphic
		map.graphics.add(graphic);
		map.centerAndZoom(geom,18);   
		identify(null,geom);
	} else {
		document.getElementById('AssessorReport').innerHTML = instructions
		document.getElementById('ZoningReport').innerHTML = instructions
		document.getElementById('SurveyRatingsReport').innerHTML = instructions
		document.getElementById('CaseTrackingReport').innerHTML = instructions
		document.getElementById('PermitsReport').innerHTML = instructions
		document.getElementById('MiscPermitsReport').innerHTML = instructions
		document.getElementById('EnforcementReport').innerHTML = instructions 
		document.getElementById('AppealsReport').innerHTML = instructions 
		document.getElementById('BBNsReport').innerHTML = instructions 
		var theTitle="I Can't Find It."
		var theMessage = "Sorry, I can't find '" + theLinkAddress+ "', please check the spelling and try again."
		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}]});
		//alert("Sorry, I can't find '" + theLinkAddress+ "', please check the spelling and try again.")
	}
}
      
function showPermit(address) {
	mapExtension.removeFromMap(gOverlays);
	if (dynamicMap.layerInfos.length > 0) {
		for (i=0; i< dynamicMap.layerInfos.length -1; i++) {
			if (dynamicMap.layerInfos[i].name == "DBI - Building Permits") {
				params.layerIds = [dynamicMap.layerInfos[i].id];
				params.searchFields = ["app_no"];
				params.searchText = address;
				theSearchType = "Permit"
				findTask.execute(params, findCompleteCallback);
				break;
			}
		}
	}
}
function IsNumeric(sText)
{
   var ValidChars = "-0123456789.";
   var IsNumber=true;
   var Char;
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
}

    function doSimplify() {
      geometry.simplify([[ polygon ]], simplifyCallback);
    }

    function simplifyCallback(simplifyResults) {
      //alert("Number of Rings returned by Simplify operation = " + simplifyResults.geometries[0].length);
      //doQuery(simplifyResults.geometries[0]);
    }

    function doQuery(query_geometry) {
      mapExtension.removeFromMap(overlays);
      var query = new esri.arcgis.gmaps.Query();
      query.queryGeometry = query_geometry;
      query.spatialRelationship = esri.arcgis.gmaps.SpatialRelationship.CONTAINS;

      queryTask.execute(query, null, queryCallback);
    }
    function getInternetExplorerVersion()
	// Returns the version of Internet Explorer or a -1
	// (indicating the use of another browser).
	{
	  var rv = -1; // Return value assumes failure.
	  if (navigator.appName == 'Microsoft Internet Explorer')
	  {
	    var ua = navigator.userAgent;
	    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	    if (re.exec(ua) != null)
	      rv = parseFloat( RegExp.$1 );
	  }
	  return rv;
}
function printResultError(theError) {
	alert(theError)
}
function printPlanningReportPreservation() {
//if user clicked on the list of possible parcels the function will restart but the messi message will still be visible so clear any messi dialogs that may be visible.
	$('.messi,.messi-modal').remove();
	var multiParcel=false;
	
	//alert(themapblklot)
	//alert(themapblklotnum)
	if (themapblklot=="" || themapblklotnum>1) {
		if (themapblklot=="" ) {
			theMessage= "<div style='text-align:left;'>A preservation report can only be printed for a single parcel, your search returned no parcels.  Please search for a single parcel.</div>"
		} else {
			theMessage= "<div style='text-align:left;'>A preservation report can only be printed for a single parcel, your search returned multiple parcels.  Please search for a single parcel.</div>"
		}
		var theTitle="Multiple Properties Found"
		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}], callback: function(){
			return;
		}});
		return;
	}
	
	//if (themapblklot=="" || themapblklotnum>1) {
	//	var theParcelList=""
	//	var theMessage=""
	//	var parcelNum=0
	//	for (var i = 0; i < idResults.length; i++) {
	//		var result = idResults[i];
	//		if (result.layerName == "Parcels") {
	//			parcelNum=parcelNum +1
	//			theParcel= result.feature.attributes["mapblklot"] 
				//alert(theParcel)
	//			theParcelList+= "<div height='275px' overflow='auto' onmouseover=" + '"' + "this.style.background='lightgray';" +'"' + 'onmouseout="this.style.background=' + "'" + "white" + "'" + ";" + '"'+" onClick='javascript:theAPN=" + '"'+ theParcel.trim() + '"; themapblklot="' +  theParcel.trim() + '"; themapblklotnum=1; theParcels=1; printPlanningReportPreservation();' + "'>" + theParcel +"</div>";
	//		}
	//	}
	//	prompt("",theParcelList)
	//	if (parcelNum==0) {
	//		theMessage= "<div style='font-align:left;'>The Planning Report is a summary report for a parcel, there were no parcels found for your search so a Planning Report cannot be created.</div>" 
	//		var theTitle="No Parcels"
	//		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}], callback: function(){
	//		return;
	//		}});
	//	}
	//	if (parcelNum==1) {
	//		theAPN = theParcel
	//		printPlanningReportPreservation();
	//		return
	//	} 
	//	if (parcelNum>1) {
	//		theMessage= "<div  style='text-align:left;'>Which parcel would you like to create a report for? Please select a parcel to continue:</div>" + theParcelList
	//		var theTitle="Select a Parcel"
	//		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}], callback: function(){
	//		return;
	//		}});
	//	}
	//return;
	//}
	//alert("here")
	var pRepHTML= "<!DOCTYPE html>"
	pRepHTML +="\n<html lang='en-US'>"
	pRepHTML +="\n<head>"
	pRepHTML +="\n<meta charset='UTF-8' />"
	pRepHTML +='<meta content="IE=edge" http-equiv="X-UA-Compatible">'
	pRepHTML +="\n<LINK REL='SHORTCUT ICON' HREF='http://" + theServerName + "/PIM/images/bannericonTransSmall.ico'>"
	pRepHTML +="\n<title></title>"
	pRepHTML +='<link href="css/print.css" type="text/css" rel="stylesheet" media="all" />'
	pRepHTML += "\n<style type='text/css'>"
	pRepHTML += "\n@media print {"
	pRepHTML += "\n    .NoPrint {display: none;}"
	pRepHTML += "\n}"
	pRepHTML += "\n</style>"
	pRepHTML +="\n</head>"
	pRepHTML +="\n<body>"
	pRepHTML +="\n<div style='width:700px;'>"
	pRepHTML +="\n<div class='reportTitle1' style='text-align:center'>San Francisco Planning Department</div>"
	pRepHTML +="\n<div class='reportTitle2' style='text-align:center'>HISTORIC PRESERVATION REPORT</div><br>"
	pRepHTML +="\n<div style='position:relative;'>"
	
	var theLot=""
	var theBlock=""
	
	
	pRepHTML +="\n<div style='padding-right:10px; display:inline-block; vertical-align:top;'>"
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Parcels" && result.feature.attributes["blklot"]==themapblklot) {
			theBlock = result.feature.attributes["block_num"]
			theLot = result.feature.attributes["lot_num"]
			pRepHTML += "\n<table class='reportData'><tr><td class='cellHead'>Block:</td><td>" + result.feature.attributes["block_num"] + "</td><td class='cellHead'> Lot:</td><td>" +  result.feature.attributes["lot_num"] + "</td></tr></table>"
		}
	}
	pRepHTML +="\n</div>"
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Historic Database" && result.feature.attributes["MAPBLKLOT"]==themapblklot) {
			pRepHTML +="\n<div style='padding-right:10px; display:inline-block; vertical-align:top;'>"
			pRepHTML += "<table class='reportData' ><tr><td class='cellHead'>Building Name: </td><td>" +result.feature.attributes["LMORBLDGNAME"]+"</td></tr></table>"
			pRepHTML +="\n</div>"
			pRepHTML +="\n<div style='padding-right:10px; display:inline-block; vertical-align:top;'>"
			var theHistAddress = ""
			if ((result.feature.attributes["HISTNO"] != "Null") && (result.feature.attributes["LOSTNO"] != result.feature.attributes["HISTNO"] )) {
					theHistAddress = result.feature.attributes["LOSTNO"] + " - " + result.feature.attributes["HISTNO"] + " " + result.feature.attributes["STREETNAME"] +" " + result.feature.attributes["STTYPE"] 
				} else {
					theHistAddress = result.feature.attributes["LOSTNO"] + " " + result.feature.attributes["STREETNAME"] +" " + result.feature.attributes["STTYPE"] 
			}
			if (theHistAddress=='0 Null Null'){
				theHistAddress = ''
			}
			pRepHTML += "<table class='reportData' ><tr><td class='cellHead'>Address: </td><td>" + theHistAddress+"</td></tr></table>"
			pRepHTML +="\n</div>"
			break;
		}
	}
	
	var theYearBuilttmp=""
	var theBLKLOTtmp=""
	var theYearBuilt="";
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Assessor"  ) {
			//theYearBuilttmp = result.feature.attributes["YRBUILT"] 
			//alert(theYearBuilttmp)
			if ((theYearBuilttmp=="" || theYearBuilt>result.feature.attributes["YRBUILT"]) && result.feature.attributes["YRBUILT"]!="0" ) {
				theYearBuilttmp = result.feature.attributes["YRBUILT"] 
				theYearBuilt=theYearBuilttmp
				//alert(theYearBuiltForPres)
			}
		}
	}
	
	
	
	//for (var i = 0; i < idResults.length; i++) {
	//	var result = idResults[i];
	//	if (themapblklot==result.feature.attributes["BLKLOT"]) {
	//		if (result.layerName == "Assessor"  && theBLKLOTtmp!=result.feature.attributes["BLKLOT"]) {
	//			theYearBuilttmp = result.feature.attributes["YRBUILT"] 
	//			if ((theYearBuilttmp < theYearBuilt) || (theYearBuilt==0)) {
	//				theYearBuilt=theYearBuilttmp
	//			}
	//			if (theYearBuilttmp>1800) {
	//			} else {
	//				theYearBuilttmp="-"
	//			}		
	//			theBLKLOTtmp=result.feature.attributes["BLKLOT"]
	//		}
	//	}
	//}
	pRepHTML +="\n<div style='display:inline-block; vertical-align:top;'>"
	pRepHTML += "<table class='reportData' ><tr><td class='cellHead'>Year Built: </td><td>" + theYearBuilt+"</td></tr></table>"
	pRepHTML +="\n</div>"
	
	
	var theA10Dist=""
	pRepHTML +="\n<br><br><div class='reportTitle3' style='text-align:center'>TENTATIVE CEQA CATEGORY: <span id='deptstat'>" + document.getElementById('histreslink').innerHTML +  "</span></div><br>"
	//for (var i = 0; i < idResults.length; i++) {
	//	var result = idResults[i];
	//	if (result.layerName == "Historic Database" && themapblklot == result.feature.attributes["MAPBLKLOT"]) {
	//		theNum=theNum+1
	//		switch (result.feature.attributes["CEQACATEGORY"]) {
	//			case 'A':
	//				theHistRes = "A - Historic Resource Present"
	//				break;
	//			case 'B':
	//				theHistRes = "B - Potential Historic Resource"
	//				break;
	//			case 'C':
	//				theHistRes = "C - Not a Historic Resource"
	//				break;
	//			default:
	//				var myDate = new Date();
	//				var yrsAgo50 = myDate.getFullYear() - 45  //changed from 50 to 48 years on request of Preservation team, then in Feb 2014 changed to 45 to avoid permits not being sent to them for borderline properties.
	//				var theYearBuiltForPres=""
	//				for (var x = 0; x < idResults.length; x++) {
	//					var resultHistTemp = idResults[x];
	//					if ( resultHistTemp.layerName == "Assessor")  {
	//						if (theYearBuiltForPres=="" || theYearBuiltForPres>resultHistTemp.feature.attributes["YRBUILT"] ) {
	//							theYearBuiltForPres = resultHistTemp.feature.attributes["YRBUILT"] 
								//alert(theYearBuiltForPres)
	//						}
	//					}
	//				}
	//				if (theYearBuiltForPres != 'Null' && theYearBuiltForPres != '0' && theYearBuiltForPres > yrsAgo50) {
						//alert("young")
	//					theHistRes = "C - Not a Historic Resource"
	//				} else {
	//					//alert("old or don't know")
	//					theHistRes = "B - Potential Historic Resource"
	//				}
	//				break;
	//		}
	//		pRepHTML +="\n<br><br><div class='reportTitle3' style='text-align:center'>TENTATIVE CEQA CATEGORY: <span id='deptstat'>" + theHistRes +  "</span></div><br>"
			//pRepHTML += "\n<table  class='reportData' style='text-align:left;'><tr><td><b>PLANNING DEPARTMENT HISTORIC RESOURCE STATUS:</B> </td><td id='deptstat'><b>" + theHistRes +  "</b></td></tr></table><br><br>"
			
			
	//	}
	//}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Historic Database" && themapblklot == result.feature.attributes["MAPBLKLOT"]) {
			pRepHTML +="\n<div style='width:250px; display:inline-block; vertical-align:top;'>"
			pRepHTML +="\n<div class='reportData' style='text-align:left'><b>ARTICLE 10</b></div>"
			pRepHTML +=  "\n<table  class='reportData' style='text-align:left;'>"
			pRepHTML +=  "\n  <tr><td><b>Landmark Building No.:</b></td><td>" + result.feature.attributes["LMNO"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Landmark District:</b></td><td>" + result.feature.attributes["EXISTDIST"] +  "</td></tr>"
			pRepHTML +="\n</table>"
			pRepHTML +="\n</div>"
			break;
		}
	}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Historic Database" && theAPN == result.feature.attributes["MAPBLKLOT"]) {
			pRepHTML +="\n<div style='width:250px; display:inline-block; vertical-align:top;'>"
			pRepHTML +="\n<div class='reportData' style='text-align:left'><b>ARTICLE 11</b></div>"
			pRepHTML +=  "\n<table  class='reportData' style='text-align:left;'>"
			pRepHTML +=  "\n  <tr><td><b>Conservation District:</b></td><td>" + result.feature.attributes["DWTNCONSERVDIST"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Article 11 Rating:</b></td><td>" + result.feature.attributes["DWTNRATING"] +  "</td></tr>"
			pRepHTML +="\n</table>"
			pRepHTML +="\n</div>"
			break;
		}
	}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Historic Database" && themapblklot == result.feature.attributes["MAPBLKLOT"]) {
			pRepHTML +="\n<div style='display:inline-block; vertical-align:top;'>"
			pRepHTML +="\n<div class='reportData' style='text-align:left'><b>REGISTER SUMMARY</b></div>"
			pRepHTML +=  "\n<table  class='reportData' style='text-align:left;'>"
			pRepHTML +=  "\n  <tr><td><b>California Register:</b></td><td>" + result.feature.attributes["CALIFREGISTER"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>National Register:</b></td><td>" + result.feature.attributes["NATLREGISTER"] +  "</td></tr>"
			pRepHTML +="\n</table>"
			pRepHTML +="\n</div>"
			break;
		}
	}
	pRepHTML += "\n<br><br><div class='reportTitle4'>SURVEY HISTORY</div>"
	
	pRepHTML += "\n<table  class='reportData' >"
	pRepHTML += "\n<tr><td style='width:80px' class='cellHead'>Evaluated</td><td  class='cellHead'>Survey</td><td style='width:50px' class='cellHead'>Rating</td><td class='cellHead'>Explanation</td></tr>"
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Survey Ratings" && themapblklot == result.feature.attributes["MAPBLKLOT"]) {
			var evalDate = result.feature.attributes["EVAL_DATE"]
			var theSurvey = result.feature.attributes["SURVEY_NAME"]
			var theRating =  result.feature.attributes["RATINGS_CODE"] 
			var theExplanation = result.feature.attributes["RATINGS_NAME"]
			pRepHTML += "\n<tr><td>" + evalDate + "</td><td>"+theSurvey+"</td><td>"+theRating+"</td><td>"+theExplanation+"</td></tr>"
		}
	}
	
	
	pRepHTML += "\n</table><br><br>"
	
	pRepHTML += "\n<div class='reportTitle4'>HISTORIC RESOURCE EVALUATIONS</div>"
	pRepHTML += "\n<table  class='reportData' >"
	pRepHTML += "\n<tr><td style='width:80px' class='cellHead'>Evaluated</td><td  style='width:80px' class='cellHead'>Case No.</td><td style='width:80px' class='cellHead'>Filed</td><td class='cellHead'>Action</td></tr>"
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "HRER Decisions") {
			var evalDate = result.feature.attributes["ACTION_DATE"]
			var theCaseNo = result.feature.attributes["CASENO"] + result.feature.attributes["SUFFIX"]
			var theFileDate =  result.feature.attributes["FILING_DATE"] 
			var theAction = result.feature.attributes["ACTION"]
			pRepHTML += "\n<tr><td>" + evalDate + "</td><td>"+theCaseNo+"</td><td>"+theFileDate+"</td><td>"+theAction+"</td></tr>"
		}
	}
	
	
	pRepHTML += "\n</table><br><br>"
	
	pRepHTML += "\n<div class='reportTitle4'>ARCHITECTURE</div>"
	
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Historic Database" && themapblklot == result.feature.attributes["MAPBLKLOT"]) {
			pRepHTML +="\n<div style='width:330px; display:inline-block; vertical-align:top;'>"
			pRepHTML +=  "\n<table  class='reportData' style='text-align:left;'>"
			pRepHTML +=  "\n  <tr><td style='width:100px'><b>Architect:</b></td><td>" + result.feature.attributes["ARCHITECT"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Style:</b></td><td>" + result.feature.attributes["STYLE"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Stories:</b></td><td>" + result.feature.attributes["STORIES"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Height (ft):</b></td><td>" + result.feature.attributes["HEIGHT"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Original Use:</b></td><td>" + result.feature.attributes["ORIGUSE"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Current Use:</b></td><td>" + result.feature.attributes["CURRENTUSE"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Original Owner:</b></td><td>" + result.feature.attributes["ORIGOWNER"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td ><b>Original Tenant:</b></td><td>" + result.feature.attributes["ORIGTENANT"] +  "</td></tr>"
			pRepHTML +="\n</table>"
			pRepHTML +="\n</div>"
		}
	}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Historic Database" && themapblklot == result.feature.attributes["MAPBLKLOT"]) {
			pRepHTML +="\n<div style='width:330px; display:inline-block; vertical-align:top;'>"
			pRepHTML +=  "\n<table  class='reportData' style='text-align:left;'>"
			pRepHTML +=  "\n  <tr><td style='width:100px'><b>Builder:</b></td><td>" + result.feature.attributes["BUILDER"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Construction Type:</b></td><td>" + result.feature.attributes["CONSTRUCTION"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Foundation:</b></td><td>" + result.feature.attributes["FOUNDATION"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Detail:</b></td><td>" + result.feature.attributes["DETAIL"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Exterior:</b></td><td>" + result.feature.attributes["EXTERIORMATERIAL"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Misc. Notes:</b></td><td>" + result.feature.attributes["NOTES"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Source:</b></td><td>" + result.feature.attributes["SOURCES"] +  "</td></tr>"
			pRepHTML +=  "\n  <tr><td><b>Other Info:</b></td><td>" + result.feature.attributes["OTHERINFORMATION"] +  "</td></tr>"
			pRepHTML +="\n</table>"
			pRepHTML +="\n</div>"
		}
	}
	
	
	pRepHTML += "\n</table><br><br>"
	
	pRepHTML +="\n<br><br><div class='disclaimer'>The Disclaimer: The City and County of San Francisco (CCSF) does not guarantee the accuracy, adequacy, completeness or usefulness of any information. CCSF provides this information on an 'as is' basis without warranty of any kind, including but not limited to warranties of merchantability or fitness for a particular purpose, and assumes no responsibility for anyone's use of the information.</div>"
	pRepHTML +="\n</div>"
	pRepHTML +="\n</body>"
	pRepHTML +="\n</html>"
	pRepHTML = pRepHTML.replace(/Null/gi,"&nbsp");
	pRepHTML = pRepHTML.replace(/undefined/gi,"&nbsp");
	//OpenWindow=window.open("", "Planning Report Preservation", "height=650, width=750, status=yes, toolbar=yes,scrollbars=yes,menubar=yes,resizable=yes");
	OpenWindow=window.open("", "_blank");
	if (OpenWindow == null || typeof(OpenWindow)=='undefined') {
		var theMessage = "Your browser is blocking the report from opening.  You need to allow popups to open the printable report."
		new Messi(theMessage, {title: 'Pop Up Blocked By Your Browser', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});	
		
	} else {
		OpenWindow.document.write(pRepHTML)	
		OpenWindow.document.close()
	}
	//themapblklot=""

}
function printPlanningReport() {
	//alert(theAPN)
	//if user clicked on the list of possible parcels the function will restart but the messi message will still be visible so clear any messi dialogs that may be visible.
	$('.messi,.messi-modal').remove();
	//alert(theParcels)
	var multiParcel=false;
	//alert(theParcels)
	if (theAPN=="" || theParcels>1) {
		var theParcelList=""
		var theMessage=""
		var parcelNum=0
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Parcels") {
				parcelNum=parcelNum +1
				theParcel= result.feature.attributes["blklot"] 
				//alert(theParcel)
				theParcelList+= "<div height='275px' overflow='auto' onmouseover=" + '"' + "this.style.background='lightgray';" +'"' + 'onmouseout="this.style.background=' + "'" + "white" + "'" + ";" + '"'+" onClick='javascript:theAPN=" + '"' + theParcel.trim() + '"' + "; theParcels=1; printPlanningReport();'>" + theParcel +"</div>";
			}
		}
		if (parcelNum==0) {
			theMessage= "<div style='font-align:left;'>The Planning Report is a summary report for a parcel, there were no parcels found for your search so a Planning Report cannot be created.</div>" 
			var theTitle="No Parcels"
			new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}], callback: function(){
			return;
			}});
		}
		if (parcelNum==1) {
			theAPN = theParcel
			printPlanningReport();
			return
		} 
		if (parcelNum>1) {
			theMessage= "<div  style='text-align:left;'>Which parcel would you like to create a report for? Please select a parcel to continue:</div>" + theParcelList
			var theTitle="Select a Parcel"
			new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}], callback: function(){
				
			return;
			}});
			
			
			
		}
	return;
	}
	//alert(theAPN)
	var pRepHTML= "<!DOCTYPE html>"
	pRepHTML +="\n<html lang='en-US'>"
	pRepHTML +="\n<head>"
	pRepHTML +="\n<meta charset='UTF-8' />"
	pRepHTML +='<meta content="IE=edge" http-equiv="X-UA-Compatible">'
	pRepHTML +="\n<LINK REL='SHORTCUT ICON' HREF='http://" + theServerName + "/PIM/images/bannericonTransSmall.ico'>"
	pRepHTML +="\n<title></title>"
	pRepHTML +='<link href="css/print.css" type="text/css" rel="stylesheet" media="all" />'
	pRepHTML += "\n<style type='text/css'>"
	pRepHTML += "\n@media print {"
	pRepHTML += "\n    .NoPrint {display: none;}"
	pRepHTML += "\n}"
	pRepHTML += "\n</style>"
	pRepHTML +="\n</head>"
	pRepHTML +="\n<body>"
	pRepHTML +="\n<div style='width:700px;'>"
	pRepHTML +="\n<div class='reportTitle1' style='text-align:center'>San Francisco Planning Department</div>"
	pRepHTML +="\n<div class='reportTitle2' style='text-align:center'>PROPERTY INFORMATION REPORT</div><br>"
	pRepHTML +="\n<div style='position:relative;'>"
	var theLot=""
	var theBlock=""
		pRepHTML +="\n<div style=' width:150px; display:inline-block; vertical-align:top;'>"
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Parcels" && result.feature.attributes["blklot"]==theAPN) {
				theBlock = result.feature.attributes["block_num"]
				theLot = result.feature.attributes["lot_num"]
				pRepHTML += "\n<table class='reportData'><tr><td class='cellHead'>Block:</td><td>" + result.feature.attributes["block_num"] + "</td><td class='cellHead'> Lot:</td><td>" +  result.feature.attributes["lot_num"] + "</td></tr></table>"
			}
		}
		pRepHTML +="\n</div>"
		
		// for (var i = 0; i < idResults.length; i++) {
			//var result = idResults[i];
			//if ((result.layerName == "Parcel Labels") && (theSearchType=="mapClick" || theSearchType=="Parcel" || theSearchType=="Address" || theSearchType=="Case" || theSearchType=="Geocode" || theSearchType=="Block")) {
				//theNum = theNum + 1;
				//if (result.feature.attributes["num_lots"] == 1) { 
					//pRepHTML += "\n<table class='reportData'><tr><td class='cellHead'>Block:</td><td>" + result.feature.attributes["block_num"] + "</td><td class='cellHead'> Lot:</td><td>" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
				//} else {
					//pRepHTML += "\n<table class='reportData'><tr><td class='cellHead'>Block:</td><td>" + result.feature.attributes["block_num"] + "</td><td class='cellHead'> Lots:</td><td>" +  result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
				//}
			//}
		//}
		//pRepHTML +="\n</div>"
		pRepHTML +="\n<div style='width:150px; display:inline-block; vertical-align:top;'>"
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Census Tracts") {
				if (result.feature.attributes["TRACTCE10"] != null) {
					pRepHTML += "<table class='reportData' ><tr><td class='cellHead'>Census Tract: </td><td>" +result.feature.attributes["TRACTCE10"]+"</td></tr></table>"
				}
			}
		}
		pRepHTML +="\n</div>"
		
		pRepHTML +="\n<div style='width:150px; display:inline-block; vertical-align:top;'>"
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "PlanningTab") {
				if (result.feature.attributes["PLANNINGDISTRICT"] != null && theBlock == result.feature.attributes["BLOCK"] && theLot == result.feature.attributes["LOT"]) {
					pRepHTML += "<table class='reportData' ><tr><td class='cellHead'>Planning District: </td><td>" +result.feature.attributes["PLANNINGDISTRICT"]+"</td></tr></table>"
				}
			}
		}
		pRepHTML +="\n</div>"
		pRepHTML +="\n<div style=' width:150px; display:inline-block; vertical-align:top;'>"
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (result.layerName  == "Supervisor Districts 2012") {
					if (result.feature.attributes["supervisor"] != null) {
						pRepHTML += "<table class='reportData' ><tr><td class='cellHead'>Supervisor District: </td><td>" + result.feature.attributes["supervisor"]+"</td></tr></table>"
					}
				}
			}
		pRepHTML +="\n</div>"
	pRepHTML +="\n</div>"
	pRepHTML +="\n<div style='position:relative; border:0px solid;'>"
	var theAddress=""
	var theAddresstmp=""
	var theNum=0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];	
		//THIS CAN NOW BE SIMPLIFIED TO USE ADDRESS FIELD
		if (result.layerName == "MAD_Parcel" && result.feature.attributes["status"]=="A"  && result.feature.attributes["blklot"]==theAPN) {
			if (result.feature.attributes["base_address_num"] !="Null" && result.feature.attributes["base_address_num"] != null && result.feature.attributes["base_address_num"] != "" && result.feature.attributes["base_address_num"] != " ") {
				theAddresstmp=result.feature.attributes["base_address_num"]
			}
			
			if (result.feature.attributes["base_address_suffix"] !="Null" && result.feature.attributes["base_address_suffix"] != null && result.feature.attributes["base_address_suffix"] != "" && result.feature.attributes["base_address_suffix"] != " ") {
				theAddresstmp+=result.feature.attributes["base_address_suffix"]
			}
			
			if (result.feature.attributes["street_full_street_name"] !="Null" && result.feature.attributes["street_full_street_name"] != null && result.feature.attributes["street_full_street_name"] != "" && result.feature.attributes["street_full_street_name"] != " ") {
				theAddresstmp = theAddresstmp + " " +result.feature.attributes["street_full_street_name"] 
			}
			
			if (result.feature.attributes["street_post_direction"] !="Null" && result.feature.attributes["street_post_direction"] != null && result.feature.attributes["street_post_direction"] != "" && result.feature.attributes["street_post_direction"] != " ") {
				theAddresstmp+=" "+result.feature.attributes["street_post_direction"]
			}
			if (result.feature.attributes["unit_address"] !="Null" && result.feature.attributes["unit_address"] != null && result.feature.attributes["unit_address"] != "" && result.feature.attributes["unit_address"] != " ") {
				theAddresstmp+=" #"+result.feature.attributes["unit_address"]
			}
			if (theAddresstmp!="") {
				theNum=theNum+1
				if (theAddress=="") {
					theAddress = theAddresstmp +", SAN FRANCISCO, CA " + result.feature.attributes["zipcode"]
				} else {
					theAddress+= "<br>"+theAddresstmp +", SAN FRANCISCO, CA " + result.feature.attributes["zipcode"]
				}
			}
		}
		//if (result.layerName == "Master Address Database") {
		//	if (result.feature.attributes["ADDRESS"] != null) {
		//		theNum=theNum+1
		//		if (theAddress=="") {
		//			theAddress = result.feature.attributes["ADDRESS"] + ", SAN FRANCISCO, CA " + result.feature.attributes["ZIP"]
		//		} else {
		//			theAddress+= "<br>"+result.feature.attributes["ADDRESS"] + ", SAN FRANCISCO, CA " + result.feature.attributes["ZIP"]
		//		}
		//	}
		//}
	}
	
	//alert("theAddress: " + theAddress)
	if (theNum>1) {
		pRepHTML += "<table class='reportData'><tr><td  class='cellHead'>Site Addresses: </td><td>" + theAddress + "</td></tr></table>"
	} else { 
		pRepHTML += "<table class='reportData'><tr><td  class='cellHead'>Site Address: </td><td>" + theAddress + "</td></tr></table>"
	}
	//pRepHTML +="\n</div>"
	pRepHTML +="\n<br><div style='width:300px; display:inline-block; vertical-align:top;'>"
	var theBLKLOTtmp=""
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		
		if (result.layerName == "Assessor" ) {
			if (theAPN==result.feature.attributes["BLKLOT"]) {
				theBLKLOT = result.feature.attributes["BLKLOT"]
				if (theBLKLOTtmp==theBLKLOT) { 
					var owner = result.feature.attributes["OWNER_NAME"] 
					var address1 = result.feature.attributes["OWNER_ADDRESS"]
					var address2 = result.feature.attributes["OWNER_CITY"]
					var address3 = result.feature.attributes["OWNER_STATE"]
					var address4 = result.feature.attributes["OWNER_ZIP"]
					var thePercentage = result.feature.attributes["OWNER_PERCENTAGE"]
					var theAddress=""
					var theMailingAddress=""
					theAddress = owner + "<br>" + address1 + "<br>" + address2 + " " + address3 + ", " + address4
					theMailingAddress = address1 + "<br>" + address2 + " " + address3 + ", " + address4
					if (parcelNum>1) {
						theMailingAddress+="<br>Parcel: " + theBLKLOT
					}
				} else {
					
					theBLKLOTtmp = theBLKLOT
					var thePercentage = result.feature.attributes["OWNER_PERCENTAGE"]
					var owner = result.feature.attributes["OWNER_NAME"] 
					var address1 = result.feature.attributes["OWNER_ADDRESS"]
					var address2 = result.feature.attributes["OWNER_CITY"]
					var address3 = result.feature.attributes["OWNER_STATE"]
					var address4 = result.feature.attributes["OWNER_ZIP"]
					var thePercentage = result.feature.attributes["OWNER_PERCENTAGE"]
					var theAddress=""
					var theMailingAddress=""
					theAddress = owner + "<br>" + address1 + "<br>" + address2 + " " + address3 + ", " + address4
					theMailingAddress = address1 + "<br>" + address2 + " " + address3 + ", " + address4
					//pRepHTML += "<table><tr><td class='reportTitle3'>OWNER</td></tr></table>"
					pRepHTML +="<div style='display:inline-block;' class='reportTitle3'>OWNER</div>"
					if (thePercentage==100) {
						pRepHTML += "<table><tr><td>" + theAddress + "</td></tr></table>"
					} else {
						for (var ii = 0; ii < idResults.length; ii++) {
							var tempresult = idResults[ii];
							if (tempresult.layerName == "Assessor" && tempresult.feature.attributes["BLKLOT"] == theBLKLOT ){	
								var ownertmp = tempresult.feature.attributes["OWNER_NAME"] 
								var address1tmp = tempresult.feature.attributes["OWNER_ADDRESS"]
								var address2tmp = tempresult.feature.attributes["OWNER_CITY"]
								var address3tmp = tempresult.feature.attributes["OWNER_STATE"]
								var address4tmp = tempresult.feature.attributes["OWNER_ZIP"]
								var thePercentagetmp = tempresult.feature.attributes["OWNER_PERCENTAGE"]
								var theAddresstmp=""
								var theMailingAddresstmp=""
								var theAddresstmp = ownertmp + "<br>" + address1tmp + "<br>" + address2tmp + " " + address3tmp + ", " + address4tmp
								var theMailingAddresstmp = address1tmp + "<br>" + address2tmp + " " + address3tmp + ", " + address4tmp
								var theOwnerDatetmp = tempresult.feature.attributes["OWNER_DATE"]
												
								pRepHTML += "<table class='reportData'><tr><td style='width:50px' class='cellHead'>" + thePercentagetmp + "% </td><td>" + theAddresstmp+ "</td></tr></table>"
								
							}
						}
					}
				}
			}
		}
	}
	
	pRepHTML +="\n</div>"
	pRepHTML +="\n<div style='width:200px; display:inline-block; vertical-align:top;'>"
	var theBLKLOTtmp=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (theAPN==result.feature.attributes["BLKLOT"]) {
			if (result.layerName == "Assessor"  && theBLKLOTtmp!=result.feature.attributes["BLKLOT"]) {
				var RE = result.feature.attributes["LANDVAL"]
				RE= (RE=="0") ? "-" : formatCurrency(RE); 
				var Improvements = result.feature.attributes["STRUCVAL"]
				Improvements= (Improvements=="0") ? "-" : formatCurrency(Improvements); 
				var Fixtures = result.feature.attributes["FIXTVAL"]
				Fixtures= (Fixtures=="0") ? "-" : formatCurrency(Fixtures); 
				var PersonalProperty = result.feature.attributes["OTHRVAL"]
				PersonalProperty= (PersonalProperty=="0") ? "-" : formatCurrency(PersonalProperty); 
				pRepHTML +="<div display:inline-block;' class='reportTitle3'>PROPERTY VALUES</div>"
				pRepHTML += "<table class='reportData'><tr><td style='width:60px' class='cellHead'>Land:</td><td>"+RE+"</td></tr>"
				pRepHTML += "<tr><td class='cellHead'>Structure:</td><td>"+Improvements+"</td>"
				pRepHTML += "<tr><td class='cellHead'>Fixture:</td><td>"+Fixtures+"</td>"
				pRepHTML += "<tr><td class='cellHead'>Other:</td><td>"+PersonalProperty+"</td></table>"
				theBLKLOTtmp=result.feature.attributes["BLKLOT"]
			}
		}
	}
	pRepHTML +="\n</div>"
	pRepHTML +="\n<div style='width:180px; display:inline-block; vertical-align:top;'>"
	var theBLKLOTtmp=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (theAPN==result.feature.attributes["BLKLOT"]) {
			if (result.layerName == "Assessor"  && theBLKLOTtmp!=result.feature.attributes["BLKLOT"]) {
				var curPrice = result.feature.attributes["CURRPRICE"]
				var lastSale = result.feature.attributes["CURRSALEDATE"]
				if (curPrice== 0) {
					curPrice = "-"						
				} else {
					curPrice = formatCurrency(curPrice);
				}
				if ((lastSale == "Null") || (lastSale=="") || (!lastSale) || (lastSale==" ") ) {
					lastSale = "-"
				} else {
					lastSale = lastSale;
				}
				//pRepHTML += "<table class='reportData'><tr><td class='cellHead'>SALES</td></tr></table>"
				pRepHTML +="<div style='display:inline-block;' class='reportTitle3'>SALES</div>"
				pRepHTML += "<table class='reportData'><tr><td class='cellHead'>Sales Date:</td><td>"+lastSale+"</td></tr>"
				pRepHTML += "<tr><td class='cellHead'>Price:</td><td>"+curPrice+"</td></tr></table>"
				theBLKLOTtmp=result.feature.attributes["BLKLOT"]
			}
		}
	}
	pRepHTML +="\n</div>"
	pRepHTML +="\n<div style='width:690px; '>"
	var theBLKLOTtmp=""
	theYearBuilt=0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (theAPN==result.feature.attributes["BLKLOT"]) {
			if (result.layerName == "Assessor"  && theBLKLOTtmp!=result.feature.attributes["BLKLOT"]) {
				var theFrontage = result.feature.attributes["LOTFRONTAGE"]
				if (theFrontage>0) {
					theFrontage += " ft"
				} else {
					theFrontage="-"
				}
				var BldSqFt = result.feature.attributes["BLDGSQFT"]
				if (BldSqFt > 0) {
					BldSqFt = addCommas(BldSqFt) + " sq ft"
				} else {
					 BldSqFt = "-"
				}
				var theDepth = result.feature.attributes["LOTDEPTH"]
				if (theDepth>0) {
					theDepth += " ft"
				} else {
					theDepth="-"
				}
				var theLotArea = addCommas(result.feature.attributes["LOTAREA"]) 
				if (result.feature.attributes["LOTAREA"] > 0) {
					theLotArea = theLotArea + " sq ft"
				} else {
					 theLotArea = "-"
				}
				theYearBuilttmp = result.feature.attributes["YRBUILT"] 
				if ((theYearBuilttmp < theYearBuilt) || (theYearBuilt==0)) {
					theYearBuilt=theYearBuilttmp
				}
				if (theYearBuilttmp>1800) {
				} else {
					theYearBuilttmp="-"
				}
				var theUnits = result.feature.attributes["UNITS"]
				if (theUnits>0) {
				} else {
					theUnits="-"
				}
				var theStories = result.feature.attributes["STORIES"]
				if (theStories>0) {
				} else {
					theStories="-"
				}
				var theUse = result.feature.attributes["DESCRIPTION"] 
				var theConstruction = result.feature.attributes["ConstrDesc"]
				var theRooms = result.feature.attributes["ROOMS"]
				if (theRooms>0) {
				} else {
					theRooms="-"
				}
				var theBedrooms = result.feature.attributes["BEDROOMS"]
				if (theBedrooms>0) {
				} else {
					theBedrooms="-"
				}
				var theBathrooms = result.feature.attributes["BATHROOMS"]
				if (theBathrooms>0) {
				} else {
					theBathrooms="-"
				}
				var theShape = result.feature.attributes["LOTSHAPE"]
				if (theShape=="" || theShape ==" " || theShape=="Null") {
					theShape="-"
				}
				var theUse = result.feature.attributes["DESCRIPTION"] 
				pRepHTML +="\n<br><div class='reportTitle3'>PHYSICAL CHARACTERISTICS</div>"
				pRepHTML += "<table class='reportData'><tr><td class='cellHead' style='width:100px'>Lot Frontage:</td><td style='width:200px'>"+theFrontage+"</td><td class='cellHead' style='width:100px'>Year Built:</td><td >"+theYearBuilt+"</td></tr>"
				pRepHTML += "<tr><td class='cellHead'>Lot Depth:</td><td style='width:100px'>"+theDepth+"</td><td class='cellHead'>Stories:</td><td>"+theStories+"</td></tr>"
				pRepHTML += "<tr><td class='cellHead'>Lot Area:</td><td>"+theLotArea+"</td><td class='cellHead'>Assessor Units:</td><td>"+theUnits+"</td></tr>"
				pRepHTML += "<tr><td class='cellHead'>Lot Shape:</td><td>"+theShape+"</td><td class='cellHead'>Bedrooms:</td><td>"+theBedrooms+"</td></tr>"
				pRepHTML += "<tr><td class='cellHead'>Building Sq Ft:</td><td>"+BldSqFt+"</td><td class='cellHead'>Bathrooms:</td><td>"+theBathrooms+"</td></tr>"
				pRepHTML += "<tr><td class='cellHead'></td><td></td><td class='cellHead'>Rooms:</td><td>"+theRooms+"</td></tr>"
				pRepHTML += "<tr><td class='cellHead'></td><td></td><td class='cellHead'>Assessor Use:</td><td>"+theUse+"</td></tr></table>"
				theBLKLOTtmp=result.feature.attributes["BLKLOT"]
			}
		}
	}
	pRepHTML +="\n</div>"
	theNum=0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];	
		if (theAPN==result.feature.attributes["BLOCK"]+result.feature.attributes["LOT"]) {
			if (result.layerName == "Three-R") {
				theNum=theNum+1
				var theAuth = result.feature.attributes["AUTHORIZED_USE"]
				if (theAuth=="" || theAuth ==" " || theAuth=="Null" || theAuth==null) {
					theAuth = "UNKNOWN"
				}
				var theOrig = result.feature.attributes["ORIGINAL USE"] 
				if (theOrig=="" || theOrig ==" " || theOrig=="Null" || theOrig==null) {
					theOrig = "UNKNOWN"
				}
				pRepHTML +=  "<table class='reportData' ><tr><td class='cellHead'>Authorized Use:</td><td>" +theAuth  +"</td></tr><tr><td class='cellHead'>Original Use:</td><td>" + theOrig+ "</td></tr></table>"
			}
		}
	}
	if (theNum==0) {
		pRepHTML +=  "<table class='reportData' ><tr><td class='cellHead'>Authorized Use:</td><td>Unknown</td></tr><tr><td class='cellHead'>Original Use:</td><td>Unknown</td></tr></table>"
	}
	pRepHTML +="\n<br><div class='reportTitle3'>PLANNING INFORMATION</div>"
	
	var theZoning=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];		
		if (result.layerName == "Zoning - Zoning Districts") {
			if (result.feature.attributes["ZONING_SIM"] != null) {
				if (theZoning==""){
					theZoning = result.feature.attributes["ZONING_SIM"]
				} else {
					theZoning+="/"+result.feature.attributes["ZONING_SIM"]
				}
			}
		}
	}
	var theHeight=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Height Districts") {
			if (result.feature.attributes["HEIGHT"] != null) {
				if (theHeight==""){
					theHeight = result.feature.attributes["HEIGHT"]
				} else {
					theHeight+="/"+result.feature.attributes["HEIGHT"]
				}
			}
		}
	}
	var theSUD=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Special Use Districts") {
			if (result.feature.attributes["NAME"] != null) {
				if (theSUD==""){
					theSUD = result.feature.attributes["NAME"]
				} else {
					theSUD+="/"+result.feature.attributes["NAME"]
				}
			}
		}
	}
	var theSSD=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - SSD Scenic Streets") {
			if (result.feature.attributes["FID_SSTREE"] != null) {
				theSSD = "Scenic Streets SSD"
			}
		}
	}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Special Sign Districts") {
			if (result.feature.attributes["SSD_NAME"] != null) {
				if (theSSD==""){
					theSSD = result.feature.attributes["SSD_NAME"]
				} else {
					theSSD+="/"+result.feature.attributes["SSD_NAME"]
				}
			}
			
		}
	}
	var theQuad=""
	 for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Planning Dept Neighborhood Team") {
			if (result.feature.attributes["QUAD"] != null) {
				if (theQuad==""){
					theQuad = result.feature.attributes["QUAD"]
				} else {
					theQuad+="/"+result.feature.attributes["QUAD"]
				}
			}
		}
	}
	var theRedev=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - SF Redevelopment Areas - 2012") {
			var theExpiration = ""
			
			 if (result.feature.attributes["EXPIRATION"] > 0) {
				if (result.feature.attributes["EXPIRATION"] > 2012) {
					theExpiration = "Expires " + result.feature.attributes["EXPIRATION"]
				} else {
					theExpiration = "Expired " + result.feature.attributes["EXPIRATION"]
				}
			} else {
				theExpiration = ""
			}
			if (result.feature.attributes["PROJECT_AR"] != null) {
				theNum = theNum + 1
				thetempRedev = result.feature.attributes["PROJECT_AR"] + " (" + theExpiration+ ")"
				thetempRedev += ", Jurisdiction: "+ result.feature.attributes["JURISDICTION"]
			}
			if (theRedev==""){
				theRedev = thetempRedev
			} else {
				theRedev+="/"+thetempRedev
			}
		}
	}
	var theSetback=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Setbacks") {
			if (result.feature.attributes["SETBACK_DI"] != null) {
				if (theSetback==""){
					theSetback = result.feature.attributes["SETBACK_DI"] + "ft"
				} else {
					theSetback+="/"+result.feature.attributes["SETBACK_DI"] + "ft"
				}
			}
		}
	}
	var theNSR=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "NSR") {
			if (result.feature.attributes["RESTRICTION"] != null ) {
				if (theNSR==""){
					theNSR = result.feature.attributes["RESTRICTION"]
				} else {
					theNSR+="<br>"+result.feature.attributes["RESTRICTION"]
				}
			}
		}
	}
	var theNCU=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Limited and Nonconforming Uses") {
			if (result.feature.attributes["NL"] != null) {
				if (theNCU==""){
					theNCU = result.feature.attributes["NL"]
				} else {
					theNCU+="/"+result.feature.attributes["NL"]
				}
			}
		}
	}
	var theComment=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "PlanningTab") {
			if (result.feature.attributes["COMMENTS"] != null) {
				theComment=theComment.replace("Null","")
				if (theComment==""){
					theComment = result.feature.attributes["COMMENTS"]
				} else {
					theComment+="<br>"+result.feature.attributes["COMMENTS"]
				}
			}
		}
	}
	pRepHTML += "\n<table  class='reportData'><tr><td style='width:100px' class='cellHead'>Zoning:</td><td style='width:200px'>"+theZoning+"</td><td style='width:150px' class='cellHead'>SSD:</td><td>" + theSSD + "</td></tr>"
	pRepHTML += "                                        <tr><td class='cellHead'>Height Limit:</td><td>"+theHeight+"</td><td class='cellHead'>SUD:</td><td>" + theSUD + "</td></tr>"
	pRepHTML += "                                        <tr><td class='cellHead'>Quadrant:</td><td>"+theQuad+"</td><td class='cellHead'>Redevelopment Area:</td><td>" + theRedev + "</td></tr>"
	pRepHTML += "                                        <tr><td class='cellHead'>Leg. Setback:</td><td>"+theSetback+"</td><td></td><td></td></tr></table>"
	
	pRepHTML += "\n<table  class='reportData'><tr><td style='width:120px;' class='cellHead'>Notice of Special Restrictions:</td><td>"+theNSR+"</td></tr></table>"
	pRepHTML += "\n<table  class='reportData'><tr><td class='cellHead'>Non-Conforming Uses:</td><td>"+theNCU+"</td></tr></table>"
	
	
	pRepHTML += "\n<table  class='reportData'><tr><td class='cellHead'>Comments:</td><td>"+theComment+"</td></tr></table>"
	
	
	pRepHTML += "\n<br><div class='reportTitle4'>APPLICABLE REGULATIONS (Special Zones)</div>"
	
	var theZoningProv=""
	pRepHTML += "<table  class='reportData'><tr><td style='width:200px' class='cellHead'>Type</td><td style='width:100px' class='cellHead'>Value</td><td class='cellHead'>Description</td></tr>"
	var theLastOtherInfo=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Planning Provisions") {
			if (result.feature.attributes["PROVISION_TYPE"] != null && (result.feature.attributes["PROVISION_TYPE"] !=theLastOtherInfo)) {
				theLastOtherInfo = result.feature.attributes["PROVISION_TYPE"] 
				var currentTime = new Date()
				var expireDate = new Date(result.feature.attributes["DATE_EXPIRED"])
				var hasExpired=false;
				
				if (expireDate.getTime() < currentTime.getTime()) {
					hasExpired=true;
				}
				theZoningProv += "<tr><td>" + result.feature.attributes["PROVISION_TYPE"]
				if (hasExpired) {
					theZoningProv += " (EXPIRED)"
				}
				theZoningProv +="</td><td>"
				if ((result.feature.attributes["PROVISION_VALUE"] == null) || (result.feature.attributes["PROVISION_VALUE"] =="") || (result.feature.attributes["PROVISION_VALUE"] ==" ") | (result.feature.attributes["PROVISION_VALUE"] =="Null")){
				} else {
					theZoningProv += result.feature.attributes["PROVISION_VALUE"] 
				}
				theZoningProv += "</td><td>" + result.feature.attributes["TYPE_DESCRIPTION"] +  "</td></tr>"
			}
		}
	}
	pRepHTML += theZoningProv + "</table>"
	
	var theEvent=""
	pRepHTML += "\n<br><div class='reportTitle4'>PARCEL EVENTS (Special Instructions, Determination Letters, Project Reviews)</div>"
	pRepHTML += "<table  class='reportData'><tr><td style='width:100px' class='cellHead'>Date</td><td style='width:100px' class='cellHead'>Type</td><td class='cellHead'>Description</td></tr>"
	
	theControltmp=""
	theDescriptiontmp=""
	theStafftmp=""
	theLetterFiletmp=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Lot Events") {
			theNum = theNum + 1
			theControl=result.feature.attributes["EVENT_TYPE"] 
			theDescription=result.feature.attributes["DESCRIPTION"] 
			theStaff=result.feature.attributes["STAFF"]
			theLetterFile=result.feature.attributes["LETTER_FILE"] 
			if (theControltmp==theControl && theDescriptiontmp==theDescription && theStafftmp==theStaff  && theLetterFiletmp==theLetterFile) {
			} else {
				var tmpDate = ""
				tmpDate = result.feature.attributes["EVENT_DATE"].split(" ");
				theEvent += "<tr><td>" + tmpDate[0] + "</td>"
				theEvent += "<td>" + result.feature.attributes["EVENT_TYPE"] + "</td>"
				theEvent += "<td>" + result.feature.attributes["DESCRIPTION"] + "</td></tr>"
			}
			theControltmp=theControl
			theDescriptiontmp=theDescription
			theStafftmp=theStaff
			theLetterFiletmp=theLetterFile
		}
	}
	pRepHTML += theEvent + "</table>"
	
	pRepHTML += "\n<br><div class='reportTitle4'>ACTIVE BLOCK BOOK NOTATIONS</div>"
	
	var theBBN=""
	pRepHTML += "<table  class='reportData'><tr><td style='width:120px' class='cellHead'>Name</td><td style='width:200px' class='cellHead'>Notify of</td><td class='cellHead'>Notes</td><td  style='width:140px' class='cellHead'>Contact</td></tr>"
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Block Book Notifications") {
			theBBN += "<tr><td >" + result.feature.attributes["FIRSTNAME"]  + " " + result.feature.attributes["LASTNAME"]+ "</td><td>" + result.feature.attributes["NOTIFYOF"] + "</td><td>" + result.feature.attributes["COMMENTS"] + "</td><td>"+ result.feature.attributes["PHONE1"] +"<br>" + result.feature.attributes["EMAIL"]  +  "</td></tr>"
		}
	}
	
	pRepHTML += theBBN + "</table>"
	
	
	pRepHTML += "\n<br><div class='reportTitle4'>BUILDING PERMIT APPLICATIONS</div>"
	var thePermits=""
	pRepHTML += "<table  class='reportData'><tr><td style='width:120px' class='cellHead'>Appl. No.</td><td style='width:80px' class='cellHead'>Act Date</td><td style='width:100px' class='cellHead'>Status</td><td  class='cellHead'>Description</td></tr>"
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "DBI - Building Permits" && theLot==result.feature.attributes["lot"] && theBlock==result.feature.attributes["block"]) {
			thePermits += "<tr><td >" + result.feature.attributes["app_no"] + "</td><td>" + result.feature.attributes["laststatusdate"] + "</td><td>" + result.feature.attributes["laststatus"] + "</td><td>"+result.feature.attributes["description"]  +  "</td></tr>"
		}
	}
	pRepHTML += thePermits + "</table>"
	
	pRepHTML += "\n<br><div class='reportTitle4'>PERMIT APPEALS</div>"
	var thePermits=""
	pRepHTML += "<table  class='reportData'><tr><td style='width:70px' class='cellHead'>Appeal No.</td><td style='width:70px' class='cellHead'>Appl. No.</td><td style='width:70px' class='cellHead'>Case No.</td><td style='width:70px' class='cellHead'>Hearing</td><td  class='cellHead'>Nature of Appeal</td><td style='width:200px' class='cellHead'>Hearing Result</td></tr>"
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Appeals") {
			thePermits += "<tr><td >" + result.feature.attributes["APPEAL_NO"]  + "</td><td>" + result.feature.attributes["APPL_NO"] + "</td><td>" + result.feature.attributes["CASENO"] + "</td><td>" + result.feature.attributes["HEARING_DATE"] + "</td><td>"+ result.feature.attributes["NATURE_APPEAL"] + "</td><td>"+  result.feature.attributes["HEARING_RESULTS"] + "</td></tr>"
		}
	}
	pRepHTML += thePermits + "</table>"
	
	pRepHTML += "\n<br><div class='reportTitle4'>COMPLAINTS</div>"
	var theComplaints=""
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Planning Complaints" && result.feature.attributes["BLOCK"] ==theBlock && result.feature.attributes["LOT"] ==theLot) {
			var theComplaintAddress = result.feature.attributes["ST_NO"] + result.feature.attributes["ST_NO_SFX"] + " " + result.feature.attributes["ST_NAME"] + " " + result.feature.attributes["ST_TYPE"]
			
			theComplaints += "<table class='reportData'><tr><td style='width:132px'><b>Complaint ID:</b> "+ result.feature.attributes["ID"]  + "</td><td style='width:229px'><b>Address: </b>" + theComplaintAddress +  "</td><td style='width:168px'><b>Parcel:</b> " + result.feature.attributes["BLOCK"] + "/" + result.feature.attributes["LOT"] + "<td><b>Planner:</b> " +result.feature.attributes["PLANNER"] +"</td></tr></table>"
			theComplaints += "<table class='reportData' style='width:100%; '><tr>"
			theComplaints += "<td style='width:700px'><b>Complaint Type: &nbsp; </b>" + result.feature.attributes["COMPLAINT_TYPE"] + "</td><tr></table>"
			theComplaints += "<table class='reportData' ><tr>"
			theComplaints += "<td style='width:700px'><b>Description: &nbsp; </b>" + result.feature.attributes["DESCRIPTION"] + "</td><tr></table>"
			
			
			theComplaints += "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
			theComplaints += "<tr><td style='width:65px'><b>Filed:</b></td><td style='width:65px'> " + formatDate(result.feature.attributes["DATEFILED"])    +"</td>"
			theComplaints += "<td style='width:160px'><b>Notice of Alleged Violation:</b></td><td style='width:65px'>" +result.feature.attributes["NAV_DATE"] +  "</td>"
			theComplaints += "<td style='width:100px'><b>Site Visit:</b></td><td style='width:65px'> " + result.feature.attributes["VISIT_DATE"]    +"</td>"
			theComplaints += "<td style='width:85px'><b>City Attorney:</b></td><td  style='width:65px'>" + result.feature.attributes["CITY_ATTY"] +"</td></tr>"
						
			theComplaints += "<tr><td ><b>Assigned:</b></td><td >" + result.feature.attributes["ASSIGNMENT_DATE"]    +"</td>"
			theComplaints += "<td><b>Notice of Violation:</b></td><td>" + result.feature.attributes["NOV_DATE"] +  "</td>"
			theComplaints += "<td ><b>Appeal Hearing:</b></td><td>" + result.feature.attributes["APPEAL_HEARING"] +"</td>"
			theComplaints += "<td><b>Closed:</b></td><td>" + result.feature.attributes["CLOSE_DATE"] +"</td></tr>"
			
			theComplaints +="</table>"
			//theComplaints += "<table class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr>"
			//theComplaints += "<td style='width:351px'><b>Description: &nbsp; </b>" + result.feature.attributes["DESCRIPTION"] + "</td><td style='width:10px'> &nbsp; </td><td %><b>Facts: &nbsp; </b>" +  result.feature.attributes["FACTS"] +"</td><tr></table>"
			//theComplaints += "<td style='width:700px'><b>Description: &nbsp; </b>" + result.feature.attributes["DESCRIPTION"] + "</td><tr></table>"
			
		}
	}
	
	pRepHTML += theComplaints
	
	
	theAPN=""
	pRepHTML +="\n<br><br><div class='disclaimer'>The Disclaimer: The City and County of San Francisco (CCSF) does not guarantee the accuracy, adequacy, completeness or usefulness of any information. CCSF provides this information on an 'as is' basis without warranty of any kind, including but not limited to warranties of merchantability or fitness for a particular purpose, and assumes no responsibility for anyone's use of the information.</div>"
	pRepHTML +="\n</div>"
	pRepHTML +="\n</body>"
	pRepHTML +="\n</html>"
	pRepHTML = pRepHTML.replace(/Null/gi,"&nbsp");
	pRepHTML = pRepHTML.replace(/undefined/gi,"&nbsp");
	//OpenWindow=window.open("", "Planning Report", "height=650, width=750, status=yes, toolbar=yes,scrollbars=yes,menubar=yes,resizable=yes");
	OpenWindow=window.open("", "_blank");
	if (OpenWindow == null || typeof(OpenWindow)=='undefined') {
		var theMessage = "Your browser is blocking the report from opening.  You need to allow popups to open the printable report."
		new Messi(theMessage, {title: 'Pop Up Blocked By Your Browser', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});	
		
	} else {
		OpenWindow.document.write(pRepHTML)	
		OpenWindow.document.close()
	}
	
}

function formatDate(myDate) {
	var d = new Date(myDate);
	var curr_date = d.getDate();   
	var curr_month = d.getMonth() + 1; //months are zero based
	var curr_year = d.getFullYear(); 
	var thetempdate =  curr_month+ "/" + curr_date + "/" + curr_year 
	return thetempdate
}

var theMapPNG=""
var printTask 
var printURL 
var printparams
var ptemplate
var OpenWindow = null;
function printReports () {
	printURL = "http://" + theServerName + "/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export Web Map Task"
	printTask = new esri.tasks.PrintTask(printURL);
	printparams = new esri.tasks.PrintParameters();
	ptemplate = new esri.tasks.PrintTemplate();
	ptemplate.preserveScale = true;
	ptemplate.showAttribution=false;
	ptemplate.exportOptions = {width: 650, height: 400, dpi: 96  };
      	printparams.template = ptemplate;
	printparams.map = map; 
	
	if (iPhoneUser || iPadUser) {
		
	} else {
		OpenWindow=window.open("", "_blank");	
		if (OpenWindow == null || typeof(OpenWindow)=='undefined') {
			var theMessage = "Your browser is blocking the report from opening.  You need to allow popups to open the printable report."
			new Messi(theMessage, {title: 'Pop Up Blocked By Your Browser', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});	
		} else {
			theWaitHTML = "<html><body><table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating printable report </b></big></big> <img src='http://" + theServerName + "/PIM/images/loader_Dots.gif'></td></tr></table></body></html>"
			OpenWindow.document.write(theWaitHTML)	
			OpenWindow.document.close()
		}
	}
	var thehtmltemp = printTask.execute(printparams,printResultCallback,printResultError);
	//alert(thehtmltemp)

}

function printResultCallback(result) {
	theMapPNG = result.url
//	alert("1")
	//window.open(result.url);
	var printHTML = "<!DOCTYPE html>"
	printHTML +="\n<html lang='en-US'>"
	printHTML +="\n<head>"
	printHTML +="\n<meta charset='UTF-8' />"
	printHTML +='<meta http-equiv="X-UA-Compatible" content="IE=7">'
	printHTML +="\n<LINK REL='SHORTCUT ICON' HREF='http://" + theServerName + "/PIM/images/bannericonTransSmall.ico'>"
	printHTML +="\n<title>San Francisco Property Information Map - Print Version</title>"
	printHTML +="\n<link rel='stylesheet' href='http://serverapi.arcgisonline.com/jsapi/arcgis/3.3/js/dojo/dijit/themes/claro/claro.css'>"
	printHTML +="\n<link rel='stylesheet' href='http://serverapi.arcgisonline.com/jsapi/arcgis/3.3/js/esri/css/esri.css'>"
	printHTML +='<link href="css/print.css" type="text/css" rel="stylesheet" media="all" />'
	printHTML += "\n<style type='text/css'>"
	printHTML += "\n@media print {"
	printHTML += "\n    .NoPrint {display: none;}"
	printHTML += "\n}"
	printHTML += "\n</style>"
	printHTML +="\n<script src='js/printable.js'></script>"
	printHTML +="\n<script>\nfunction displayPrintReport() {document.getElementById('mapPrintOptions').style.display='none'; }\n</script>"
	printHTML +="\n</head>"
	printHTML +="\n<body class='claro'>"
	
	printHTML +="\n<table style='width:700px;' id='mapPrintOptions'><tr><td style='width: 15px;'></td><td>"
	printHTML +="\n<span class='NoPrint' style='font-size:20px;' ><p>What do you want to include in your printable report?</p>"
	//printHTML +="\n<table > <tr><td style='font-size:12px;' > Printing works best in Chrome, Firefox or Safari. Some versions of Internet Explorer will not print the map correctly.</td></tr></table><br>"
	printHTML +="\n<table ><tr><td>Map</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'locationmap' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	if (sitename=="SFFIND") {
		printHTML +="<tr><td>Elected Officials Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'property' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="<tr><td>Places & Services Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'zoning' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="<tr><td>Other Information Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'preservation' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		//printHTML +="<tr><td>Info Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'projects' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	} else {
		printHTML +="\n<tr><td>Property Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'property' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Zoning Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'zoning' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Preservation Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'preservation' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Projects Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'projects' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Permits Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'permits' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Other Permits Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'misc' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Complaints Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'complaints' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Appeals Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'appeals' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		//if (theLoc=="City") {
			printHTML +="\n<tr><td>Block Book Notification Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'bbn' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		//}
	}	
	printHTML +="\n</table></span>"
	printHTML +="\n<button class='NoPrint' onclick='javascript:displayPrintReport()' type='button'>Create Printable Report</button><br><br><br></td></tr>"
	printHTML +="\n"
	printHTML +="\n<tr><td colspan=2 ><span class='NoPrint'><table border=0><tr><td align='middle'> ------------------------ Preview Is Shown Below ------------------------ </td></tr></table><br><br><br><br></span></td></tr></table>"
	//printHTML +="\n<div class='NoPrint' id='printButton' style='display:none'> <form> <input type='button' value='Print Report' onClick='window.print()'/></form></div>"
	
	
	printHTML +="\n<img src='/PIM/images/LetterHead.png'>"
	

	
	switch(theSearchType)
	{
		case "Address":
			//printHTML += "<p class='reportHeader'>" + theSearchString +"d</p>"
			printHTML += "\n<p class='printReportHeader' >Report for: " + theSearchString + "</p>"
			break;
		case "Geocode":
			printHTML += "\n<p class='printReportHeader' >Report for: " + theReportTitle +"</p>"
			break;
		case "Case":
			printHTML += "\n<p class='printReportHeader' >Report for Planning Department Project: " + theSearchString +"</p>"
			break;
		case "Permit":
			printHTML += "\n<p class='printReportHeader' >Report for Department of Building Inspections Permit: " + theSearchString +"</p>"
			break;
		case "Parcel":
			printHTML += "\n<p class='printReportHeader' >Report for Parcel: " + theSearchString +"</p>"
			break;
		case "Block":
			printHTML += "\n<p class='printReportHeader' >Report for Block: " + theSearchString +"</p>"
			break;
		case "Case Unmapped":
			printHTML += "\n<p class='printReportHeader' >Report for Planning Department Project: " + theSearchString +"</p>"
			break;
		default:
			printHTML += "\n<p class='printReportHeader' >Report for: " + theSearchString +"</p>"
	}
	if (theSearchType!="Case Unmapped") {
		if (lastSearchClick) {
			printHTML +="\n\n<span id='locationmap'><div id='map_canvas' style='width: 650px; height: 400px;BORDER: #b7d8ed 1px solid;'><img src='" + theMapPNG + "'></img></div><br><br></span>\n"
			printHTML +="\n\n"
		} else {
			printHTML +="\n\n<span id='locationmap'><div id='map_canvas' style='width: 650px; height: 400px;BORDER: #b7d8ed 1px solid;'><img src='" + theMapPNG + "'></img></div><br><br></span>\n"
			printHTML +="\n\n"
		}
	}
	if (sitename=="SFFIND") {
		var theSFFindElectedHtmltoPrint = theSFFindElectedHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		//remove the height limitations for the more/less divs
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:110px/gi,"height:''");
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:1365px/gi,"height:''");  //Assessors - internal
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:660px/gi,"height:''");  // Assessors - public
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:275px/gi,"height:''"); //
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:200px/gi,"height:''"); //street sweeping
		//printHTML += "<span id='property'>" + theSFFindElectedHtmltoPrint + "</span>";

		var theSFFindServicesHtmltoPrint = theSFFindServicesHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		//remove the height limitations for the more.../less... divs
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:110px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:1365px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:660px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:240px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:275px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:200px/gi,"height:''");
		
		//var theSFFindPlacesHtmltoPrint = theSFFindPlacesHtml.replace(/class='noprint'/gi,"style='display:none'");
		//theSFFindPlacesHtmltoPrint = theSFFindPlacesHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		//remove the height limitations for the more.../less... divs
		//theSFFindPlacesHtmltoPrint = theSFFindPlacesHtmltoPrint.replace(/height:110px/gi,"height:''");
		//theSFFindPlacesHtmltoPrint = theSFFindPlacesHtmltoPrint.replace(/height:1365px/gi,"height:''");
		//theSFFindPlacesHtmltoPrint = theSFFindPlacesHtmltoPrint.replace(/height:660px/gi,"height:''");
		//theSFFindPlacesHtmltoPrint = theSFFindPlacesHtmltoPrint.replace(/height:240px/gi,"height:''");
		//theSFFindPlacesHtmltoPrint = theSFFindPlacesHtmltoPrint.replace(/height:275px/gi,"height:''");
		//theSFFindPlacesHtmltoPrint = theSFFindPlacesHtmltoPrint.replace(/height:200px/gi,"height:''");
		
		var theSFFindInfoHtmltoPrint = theSFFindInfoHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		//remove the height limitations for the more.../less... divs
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:110px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:1365px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:660px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:240px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:275px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:200px/gi,"height:''");
		
		
		printHTML += "<div id='property'>" + theSFFindElectedHtmltoPrint + "</div><div id='zoning'><P>" + theSFFindServicesHtmltoPrint + "</p></div><div id='preservation'><P>"+ theSFFindInfoHtmltoPrint + "</p></div>";
	} else {
		var theAssessorHtmltoPrint = theAssessorHtml.replace(/class='noprint'/gi,"style='display:none'");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		//remove the height limitations for the more.../less... divs
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:110px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:1365px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:660px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:240px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:275px/gi,"height:''");
		
		var theZoningHtmltoPrint = theZoningHtml.replace(/class='noprint'/gi,"style='display:none'");
		theZoningHtmltoPrint = theZoningHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theSurveyRatingsHtmltoPrint = theSurveyRatingsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSurveyRatingsHtmltoPrint = theSurveyRatingsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theMiscPermitsHtmltoPrint = theMiscPermitsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theMiscPermitsHtmltoPrint = theMiscPermitsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theCaseTrackingHtmltoPrint = theCaseTrackingHtml.replace(/class='noprint'/gi,"style='display:none'");
		theCaseTrackingHtmltoPrint = theCaseTrackingHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theEnforcementHtmltoPrint = theEnforcementHtml.replace(/class='noprint'/gi,"style='display:none'");
		theEnforcementHtmltoPrint = theEnforcementHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var thePermitsHtmltoPrint = thePermitsHtml.replace(/class='noprint'/gi,"style='display:none'");
		thePermitsHtmltoPrint = thePermitsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theAppealsHtmltoPrint = theAppealsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theAppealsHtmltoPrint = theAppealsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theBBNsHtmltoPrint = theBBNsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theBBNsHtmltoPrint = theBBNsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		
		//ALL
		printHTML += "<div id='property'>" + theAssessorHtmltoPrint + "</div><div id='zoning'><P>" + theZoningHtmltoPrint + "</p></div><div id='preservation'><P>"+ theSurveyRatingsHtmltoPrint + "</p></div><div id='projects'><P>"+ theCaseTrackingHtmltoPrint + "</p></div><div id='permits'><P>"+ thePermitsHtmltoPrint + "</p></div><div id='misc'><P>"+ theMiscPermitsHtmltoPrint + "</p></div><div id='complaints'><P>" + theEnforcementHtmltoPrint + "</p></div><div id='appeals'><P>" + theAppealsHtmltoPrint +"</p></div>";
		
		
		//Missing Property
		//printHTML += "<div id='zoning'><P>" + theZoningHtmltoPrint + "</p></div><div id='preservation'><P>"+ theSurveyRatingsHtmltoPrint + "</p></div><div id='projects'><P>"+ theCaseTrackingHtmltoPrint + "</p></div><div id='permits'><P>"+ thePermitsHtmltoPrint + "</p></div><div id='misc'><P>"+ theMiscPermitsHtmltoPrint + "</p></div><div id='complaints'><P>" + theEnforcementHtmltoPrint + "</p></div><div id='appeals'><P>" + theAppealsHtmltoPrint +"</p></div>";
		
		//Missing Zoning
		//printHTML += "<div id='property'>" + theAssessorHtmltoPrint + "</div><div id='preservation'><P>"+ theSurveyRatingsHtmltoPrint + "</p></div><div id='projects'><P>"+ theCaseTrackingHtmltoPrint + "</p></div><div id='permits'><P>"+ thePermitsHtmltoPrint + "</p></div><div id='misc'><P>"+ theMiscPermitsHtmltoPrint + "</p></div><div id='complaints'><P>" + theEnforcementHtmltoPrint + "</p></div><div id='appeals'><P>" + theAppealsHtmltoPrint +"</p></div>";
		
		//Missing Preservation
		//printHTML += "<div id='property'>" + theAssessorHtmltoPrint + "</div><div id='zoning'><P>" + theZoningHtmltoPrint + "</p></div><div id='projects'><P>"+ theCaseTrackingHtmltoPrint + "</p></div><div id='permits'><P>"+ thePermitsHtmltoPrint + "</p></div><div id='misc'><P>"+ theMiscPermitsHtmltoPrint + "</p></div><div id='complaints'><P>" + theEnforcementHtmltoPrint + "</p></div><div id='appeals'><P>" + theAppealsHtmltoPrint +"</p></div>";
		
		//Just the map
		//printHTML += ""
		
		//Just Property
		//printHTML += "<div id='property'><p>PROPERTY" + theAssessorHtmltoPrint + "</p></div>"
		//printHTML += "<div id='property'><p>PROPERTY</p></div>"
		
		//Just Zoning
		//printHTML += "<div id='zoning2'><P>ZONING" + theZoningHtmltoPrint + "</p></div>"
		//printHTML += "<div id='zoning'><P>ZONING </p></div>"
		//prompt("",theZoningHtmltoPrint)
		
		//Just Preservation
		//printHTML += "<div id='preservation'><P>PRESERVATION"+ theSurveyRatingsHtmltoPrint + "</p></div>"
		//printHTML += "<div id='preservation'><P>PRESERVATION</p></div>"
		
		//Just Cases
		//printHTML += "<div id='projects'><P>PROJECTS"+ theCaseTrackingHtmltoPrint + "</p></div>"
		//printHTML += "<div id='projects'><P>PROJECTS</p></div>"
		
		//Just BPs
		//printHTML += "<div id='permits'><P>BUILDING PERMITS"+ thePermitsHtmltoPrint + "</p></div>"
		//printHTML += "<div id='permits'><P>BUILDING PERMITS</p></div>"
		
		//Just MPs
		//printHTML += "<div id='misc'><P> MISC PERMITS"+ theMiscPermitsHtmltoPrint + "</p></div>"
		//printHTML += "<div id='misc'><P> MISC PERMITS</p></div>"
		
		//Just Complaints
		//printHTML += "<div id='complaints'><p>COMPLAINTS" + theEnforcementHtmltoPrint  + "</p></div>"
		//printHTML += "<div id='complaints'><p>COMPLAINTS</p></div>"
		
		//Just Appeals
		//printHTML += "<div id='appeals' ><p>APPEALS" + theAppealsHtmltoPrint +"</p></div>"
		//printHTML += "<div id='appeals' ><p>APPEALS</p></div>"
		//prompt("",theAppealsHtmltoPrint)
		
		
	}
	printHTML = printHTML.replace(/\*/g, ''); 
	printHTML = printHTML.replace(/Fields marked with an asterisk are only visible to City staff./g,''); 
	printHTML = printHTML.replace(/<br><br>/gi, '<br>'); 
	printHTML = printHTML.replace(/<br><br>/gi, '<br>'); 
	printHTML = printHTML.replace(/<br><br>/gi, '<br>'); 
	
	//if (theLoc=="City") {
		printHTML += "<div id='bbn'>" +theBBNsHtmltoPrint + "</div>"
	//}
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth() + 1; //Months are zero based
	var curr_year = d.getFullYear();
	

	printHTML +="<div style='font-size:9px;'><i>The Disclaimer: The City and County of San Francisco (CCSF) does not guarantee the accuracy, adequacy, completeness or usefulness of any information. CCSF provides this information on an 'as is' basis without warranty of any kind, including but not limited to warranties of merchantability or fitness for a particular purpose, and assumes no responsibility for anyone's use of the information. </i></div><br>"
	printHTML +="<div style=' float:left; font-size:9px;'>Printed: " + curr_month + "/" +  curr_date + "/" + curr_year + "</div>"
	if (sitename=="SFFIND") {
		printHTML += "\n<div style='width: 100%; font-size:9px; text-align:center;'><i>http://SFFind.info</i> </div>"
	} else {
		if (theLoc=='City') {
			printHTML += "\n<div style='width: 100%; font-size:9px; text-align:center;'> <i>http://propertymap.sfplanning.org?dept=planning</i> </div>"
		} else {
			printHTML += "\n<div style='width: 100%; font-size:9px; text-align:center;'> <i>http://propertymap.sfplanning.org</i> </div>"
		}
	}
	printHTML +="</body>"
	printHTML +="</html>"

	if (iPhoneUser || iPadUser) {
		OpenWindow=window.open("", "PrintableReport", "height=650, width=750, status=yes, toolbar=yes,scrollbars=yes,menubar=yes,resizable=yes");
	}
	//OpenWindow=window.open("", "PrintableReport", "height=650, width=750, status=yes, toolbar=yes,scrollbars=yes,menubar=yes,resizable=yes");
	if (OpenWindow == null || typeof(OpenWindow)=='undefined') {
		var theMessage = "Your browser is blocking the report from opening.  You need to allow popups to open the printable report."
		new Messi(theMessage, {title: 'Pop Up Blocked By Your Browser', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});	
		
	} else {
		OpenWindow.document.write(printHTML)	
		OpenWindow.document.close()
	}
}

function printReportsOLD_NO_LONGER_USING() {
	//var printHTML = "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>"
	
	//alert("Buffer on map?  " + bufferonmap + "\nBuffer Dist: " + theBufferDist)
	var printHTML = "<!DOCTYPE html>"
	printHTML +="\n<html lang='en-US'>"
	printHTML +="\n<head>"
	printHTML +="\n<meta charset='UTF-8' />"
	printHTML +='<meta http-equiv="X-UA-Compatible" content="IE=7">'
	printHTML +="\n<LINK REL='SHORTCUT ICON' HREF='http://" + theServerName + "/PIM/images/bannericonTransSmall.ico'>"
	printHTML +="\n<title>San Francisco Property Information Map - Print Version</title>"
	printHTML +="\n<link rel='stylesheet' href='http://serverapi.arcgisonline.com/jsapi/arcgis/3.3/js/dojo/dijit/themes/claro/claro.css'>"
	printHTML +="\n<link rel='stylesheet' href='http://serverapi.arcgisonline.com/jsapi/arcgis/3.3/js/esri/css/esri.css'>"
	printHTML += "\n<style type='text/css'>"
	printHTML += "\n@media print {"
	printHTML += "\n    .NoPrint {display: none;}"
	printHTML += "\n}"
	printHTML += "\n</style>"
	printHTML +="\n<script>var dojoConfig = {parseOnLoad: true};</script>"
	printHTML +="\n<script src='http://js.arcgis.com/3.9/'></script>"
	
	printHTML +="\n<script src='js/printable.js'></script>"
	printHTML +="\n\n<script>\n"
	
	MinY = map.extent.ymin 
	MaxY = map.extent.ymax
	MinX = map.extent.xmin 
	MaxX = map.extent.xmax
	centerY = ((MaxY-MinY)/2 )+ MinY
	centerX= ((MaxX-MinX)/2) + MinX
	
	var visLayers = dynamicMap.visibleLayers
	printHTML +="\n    "
	printHTML +="\n    "
	printHTML +="\n    var map;"
	printHTML +="\n    var theArcGISServerName = '" + theArcGISServerName +"';"
	printHTML +="\n    var myGraphic = window.opener.theSearchGraphic";
	printHTML +="\n    var visLayers = [" + visLayers + "]";
	printHTML +="\n    var IEVersion = "+getInternetExplorerVersion() +";"
	printHTML +="\n    var isChrome = "+ navigator.userAgent.toLowerCase().indexOf('chrome') +";"
	printHTML +="\n    var theBuffDist="+theBufferDist +";"
	printHTML +="\n    var bufferonmap="+bufferonmap +";"
	printHTML +="\n    var theServerName='"+theServerName+"'";
	var thePointX=null;
	var thePointY=null;
	if (theSearchGraphic.geometry.type=="polygon") {
		
		var myPolygon = theSearchGraphic.geometry;
		var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]), 2), new dojo.Color([100,100,255,0.5]));
		myGraphic = new esri.Graphic(myPolygon, symbol);
		printHTML +="\n    var myGraphic = window.opener.myGraphic";
		theGraphicExtent = myPolygon.getExtent();
		if (navigator.userAgent.indexOf('MSIE')>0) { 
			thePointX = ((theGraphicExtent.xmax - theGraphicExtent.xmin)/2) + theGraphicExtent.xmin
			thePointY = ((theGraphicExtent.ymax - theGraphicExtent.ymin)/2) + theGraphicExtent.ymin
		}
	}
	
	if (theSearchGraphic.geometry.type=="point") {
		var myPoint= theSearchGraphic.geometry;
		var symbol = new esri.symbol.PictureMarkerSymbol('http://' + theServerName + '/PIM/images/blue.png', 32, 32) 
		myGraphic = new esri.Graphic(myPoint, symbol);
		thePointX = theSearchGraphic.geometry.x
		thePointY = theSearchGraphic.geometry.y
		printHTML +="\n    var myGraphic = window.opener.myGraphic";
	}
	if (theSearchType=="mapClick" || theSearchType=="Geocode") {
		printHTML +="\n    var thePointX = " + theSearchGraphic.geometry.x //theGeom.x
		printHTML +="\n    var thePointX = " + theSearchGraphic.geometry.x //theGeom.y
	}
	printHTML +="\n    var myGeometry = myGraphic.geometry";
	printHTML +="\n    var thelayerIds = ["+params.layerIds+"];"
	printHTML +="\n    var thesearchFields = '" +params.searchFields+"'"
	printHTML +="\n    var thesearchText = '" + params.searchText + "'";
	printHTML +="\n    var thecontains = " +params.contains;
	printHTML +="\n    var theSearchType ='" + theSearchType + "'";
	printHTML +="\n    var graphic";

	var IDsymbol = new esri.symbol.PictureMarkerSymbol('http://' + theServerName + '/PIM/images/blue.png', 32, 32) //.setOffset(0,16);
	
	printHTML +="\nsetTimeout('init("+centerX +"," + centerY +"," + map.getZoom() + "," + thePointX+"," + thePointY + ");',1250);\n</script>"
	

	
	printHTML +="\n<link href='css/Print.css' type='text/css' rel='stylesheet' media='all' />"
	printHTML +='\n<script type="text/javascript" src="js/printable.js"></script>'
	printHTML +="\n<script>\nfunction displayPrintReport() {document.getElementById('mapPrintOptions').style.display='none'; }\n</script>"

	printHTML +="\n</head>"
	printHTML +="\n<body class='claro'>"
	printHTML +="\n<table style='width:700px;' id='mapPrintOptions'><tr><td style='width: 15px;'></td><td>"
	printHTML +="\n<span class='NoPrint' style='font-size:20px;' ><p>What do you want to include in your printable report?</p>"
	printHTML +="\n<table ><tr><td>Map</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'locationmap' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	if (sitename=="SFFIND") {
		printHTML +="<tr><td>Elected Officials Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'property' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="<tr><td>Places & Services Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'zoning' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="<tr><td>Other Information Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'preservation' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	} else {
		printHTML +="\n<tr><td>Property Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'property' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Zoning Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'zoning' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Preservation Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'preservation' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Projects Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'projects' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Permits Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'permits' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Other Permits Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'misc' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Complaints Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'complaints' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		printHTML +="\n<tr><td>Appeals Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'appeals' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		//if (theLoc=="City") {
			printHTML +="\n<tr><td>Block Book Notifications Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'bbn' + '"' + ")' type='checkbox' checked=true/></td></tr>"
		//}
	}	
	printHTML +="\n</table></span>"
	printHTML +="\n<button class='NoPrint' onclick='javascript:displayPrintReport()' type='button'>Create Printable Report</button><br><br><br></td></tr>"
	printHTML +="\n"
	printHTML +="\n<tr><td colspan=2 ><span class='NoPrint'><table border=0><tr><td align='middle'> ------------------------ Preview Is Shown Below ------------------------ </td></tr></table><br><br><br><br></span></td></tr></table>"
	
	
	printHTML +="\n<img src='/PIM/images/LetterHead.png'><br>"
	if (sitename=="SFFIND") {
		printHTML += "\n<span class='printReportTitle' >SF Find - <i>http://propertymap.sfplanning.org?name=sffind</i> </span>"
	} else {
	}
		
	
	switch(theSearchType)
	{
		case "Address":
			printHTML += "\n<p class='printReportHeader' >Report for: " + theSearchString + "</p>"
			break;
		case "Geocode":
			printHTML += "\n<p class='printReportHeader' >Report for: " + theReportTitle +"</p>"
			break;
		case "Case":
			printHTML += "\n<p class='printReportHeader' >Report for Planning Department Project: " + theSearchString +"</p>"
			break;
		case "Permit":
			printHTML += "\n<p class='printReportHeader' >Report for Department of Building Inspections Permit: " + theSearchString +"</p>"
			break;
		case "Parcel":
			printHTML += "\n<p class='printReportHeader' >Report for Parcel: " + theSearchString +"</p>"
			break;
		case "Block":
			printHTML += "\n<p class='printReportHeader' >Report for Block: " + theSearchString +"</p>"
			break;
		case "Case Unmapped":
			printHTML += "\n<p class='printReportHeader' >Report for Planning Department Project: " + theSearchString +"</p>"
			break;
		default:
			printHTML += "\n<p class='printReportHeader' >Report for: " + theSearchString +"</p>"
	}
	if (theSearchType!="Case Unmapped") {
		if (lastSearchClick) {
			printHTML +="\n\n<span id='locationmap'><div id='map_canvas' style='width: 650px; height: 400px;BORDER: #b7d8ed 1px solid;'></div><br><br></span>\n"
			printHTML +="\n\n"
		} else {
			printHTML +="\n\n<span id='locationmap'><div id='map_canvas' style='width: 650px; height: 400px;BORDER: #b7d8ed 1px solid;'></div><br><br></span>\n"
			printHTML +="\n\n"
		}
	}
	if (sitename=="SFFIND") {
		var theSFFindElectedHtmltoPrint = theSFFindElectedHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:110px/gi,"height:''");
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:1365px/gi,"height:''");  //Assessors - internal
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:660px/gi,"height:''");  // Assessors - public
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:275px/gi,"height:''"); //
		theSFFindElectedHtmltoPrint = theSFFindElectedHtmltoPrint.replace(/height:200px/gi,"height:''"); //street sweeping
	
		var theSFFindServicesHtmltoPrint = theSFFindServicesHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:110px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:1365px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:660px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:240px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:275px/gi,"height:''");
		theSFFindServicesHtmltoPrint = theSFFindServicesHtmltoPrint.replace(/height:200px/gi,"height:''");
		
		
		var theSFFindInfoHtmltoPrint = theSFFindInfoHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:110px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:1365px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:660px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:240px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:275px/gi,"height:''");
		theSFFindInfoHtmltoPrint = theSFFindInfoHtmltoPrint.replace(/height:200px/gi,"height:''");
		
		
		printHTML += "<div id='property'>" + theSFFindElectedHtmltoPrint + "</div><div id='zoning'><P>" + theSFFindServicesHtmltoPrint + "</p></div><div id='preservation'><P>"+ theSFFindInfoHtmltoPrint + "</p></div>";
	} else {
		var theAssessorHtmltoPrint = theAssessorHtml.replace(/class='noprint'/gi,"style='display:none'");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:110px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:1365px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:660px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:240px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:275px/gi,"height:''");
		
		var theZoningHtmltoPrint = theZoningHtml.replace(/class='noprint'/gi,"style='display:none'");
		theZoningHtmltoPrint = theZoningHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theSurveyRatingsHtmltoPrint = theSurveyRatingsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSurveyRatingsHtmltoPrint = theSurveyRatingsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theMiscPermitsHtmltoPrint = theMiscPermitsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theMiscPermitsHtmltoPrint = theMiscPermitsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theCaseTrackingHtmltoPrint = theCaseTrackingHtml.replace(/class='noprint'/gi,"style='display:none'");
		theCaseTrackingHtmltoPrint = theCaseTrackingHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theEnforcementHtmltoPrint = theEnforcementHtml.replace(/class='noprint'/gi,"style='display:none'");
		theEnforcementHtmltoPrint = theEnforcementHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var thePermitsHtmltoPrint = thePermitsHtml.replace(/class='noprint'/gi,"style='display:none'");
		thePermitsHtmltoPrint = thePermitsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theAppealsHtmltoPrint = theAppealsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theAppealsHtmltoPrint = theAppealsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theBBNsHtmltoPrint = theBBNsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theBBNsHtmltoPrint = theBBNsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		
		//ALL
		printHTML += "<div id='property'>" + theAssessorHtmltoPrint + "</div><div id='zoning'><P>" + theZoningHtmltoPrint + "</p></div><div id='preservation'><P>"+ theSurveyRatingsHtmltoPrint + "</p></div><div id='projects'><P>"+ theCaseTrackingHtmltoPrint + "</p></div><div id='permits'><P>"+ thePermitsHtmltoPrint + "</p></div><div id='misc'><P>"+ theMiscPermitsHtmltoPrint + "</p></div><div id='complaints'><P>" + theEnforcementHtmltoPrint + "</p></div><div id='appeals'><P>" + theAppealsHtmltoPrint +"</p></div>";
		
	}
	printHTML = printHTML.replace(/\*/g, ''); 
	printHTML = printHTML.replace(/Fields marked with an asterisk are only visible to City staff./g,''); 
	printHTML = printHTML.replace(/<br><br>/gi, '<br>'); 

	
	//if (theLoc=="City") {
		printHTML += "<div id='bbn'>" +theBBNsHtmltoPrint + "</div>"
	//}
	printHTML +="</body>"
	printHTML +="</html>"
	OpenWindow=window.open("", "PrintableReport", "height=650, width=750, status=yes, toolbar=yes,scrollbars=yes,menubar=yes,resizable=yes");
	OpenWindow.document.write(printHTML)
	OpenWindow.document.close()

}

function Link() {
	//alert(theLinkAddress)
	var sPath = window.location.pathname;
	var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
	var thedeptparam=""
	var thenameparam=""
	var theLink=""
	if (dept!="") {
		thedeptparam = "dept=" + dept
	}
	if (sitename!="") {
		thenameparam="&name="+sitename
	}
	if (sitename=='SFFIND') {
		if (isDistrict) {
			theLink = "http://propertymap.sfplanning.org/" + sPage + "?"+thedeptparam+thenameparam+"&district="+theLinkAddress
		} else {
			if (isNeighborhood) {
				theLink = "http://propertymap.sfplanning.org/" + sPage + "?"+thedeptparam+thenameparam+"&neighborhood="+theLinkAddress
			} else {
				theLink = "http://propertymap.sfplanning.org/" + sPage + "?"+thedeptparam+thenameparam+"&search="+theLinkAddress
			}
		}
	} else {
		theLink = "http://propertymap.sfplanning.org/" + sPage + "?"+thedeptparam+thenameparam+"&search="+theLinkAddress
	}
	var theMessage = "<input style='align:middle; width:470px' type='text' id='myText' value='" + theLink + "'>"
	new Messi(theMessage, {title: 'Link', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});	
	document.getElementById("myText").select();
}

	function addToMap(theLayer,theDef) {
		for (var i=0; i< theLayer.options.length; i++) {
			if (theLayer.options[i].selected) {
				var theSelectedLayer = theLayer.options[i].value
			}
		}
		var LayerAll = new Array();
		LayerAll  = dynamicMap.layerInfos;
		var theLayerinfostring
		theLayerinfostring = ""
		var theLayerinfostring2
		theLayerinfostring2 = ""
		
		for (x=0; x < LayerAll.length ;x++){
			theLayerinfostring = theLayerinfostring + x + "  " + LayerAll[x].name + "\n"
			if (x == 65) {
				theLayerinfostring2 = theLayerinfostring
				theLayerinfostring=  ""
			}
			if (LayerAll[x].name == theSelectedLayer) {
				ToggleOnOff(LayerAll[x].name,true,theDef)
			}
		}
		
		
		

	}
	function clearMap() {
		//remove all 'Other' layers and switch off the TOC layers
		dynamicMap.setVisibleLayers([9999]);
		map.graphics.clear();
		
		theSearch = "";
		bufferonmap=false;
		var arrElements = document.getElementsByTagName("a");
		for (var i=0; i<arrElements.length; i++) {
			//get pointer to current element:
			var element=arrElements[i];
			if (element.innerHTML== "Remove from Map") {
				element.innerHTML="Show on Map"
			}
		}
		
		if (theLastLayer) {
			map.removeLayer(theLastLayer)
		}
		
		isPPon=false;
		var arrElements = document.getElementsByName("Planning Provisions");
		for (var i=0; i<arrElements.length; i++) {
			//get pointer to current element:
			var element=arrElements[i];
			if (element.innerHTML== "Remove from Map") {
				element.innerHTML="Show on Map"
			}
		}
	}
	function removeBlue() {
		map.graphics.clear();
		theSearch = "";
		bufferonmap=false;
	}
	
	function OpenCloseTools() {
		if (document.getElementById('theToolsDIV').style.display == "none") {
			document.getElementById('theToolsDIV').style.display = "inline";
			document.getElementById('lnkTools').innerHTML = "Hide Tools"
		} else {
			document.getElementById('theToolsDIV').style.display = "none";
			document.getElementById('lnkTools').innerHTML = "Tools"
		}
	}
	
	
	
	function roundNumber(num, dec) {
		var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
		return result;
	}

	function enableDrawing() {
		amIMeasuring=true;
		polygon && gmap.removeOverlay(polygon);

		// add a polygon to the map with no vertices
		polygon = new GPolygon([], "#0000FF", 2, 1.0, "#0000FF", 0.5);
		gmap.addOverlay(polygon);

		// register a listener for "endline" event and enable drawing
		GEvent.addListener(polygon, "endline", calculateAreasAndLengths);
		polygon.enableDrawing();
	}
	
	function calculateAreasAndLengths() {
		var geometryService = new esri.arcgis.gmaps.Geometry("http://" + theServerName + "/arcgis/rest/services/Utilities/Geometry/GeometryServer");
		
		geometryService.getAreasAndLengths([ [ polygon ] ], displayAreasAndLengths);
		amIMeasuring=false;
	}

	function displayAreasAndLengths(response, error) {
		// Display error message, if any
		if (error) {
			alert("Error " + error.code + ": " + (error.message || (error.details && error.details.join(" ")) || "Unknown error" ));
		return;
		}

		// Display areas and lengths
		theRealArea = (Math.abs(response.areas[0]) / 1.598684333) / 0.09290304
		theRealLength = (response.lengths[0] * 3.2808399) - ((response.lengths[0] * 3.2808399) * 0.21)
		theRealLengthYards = theRealLength/3
		theRealLengthMiles = theRealLength/5280
		theRealAreaAcres = theRealArea / 43560
		theRealAreaMiles = theRealArea / 27878400
		
		alert("Area: \t\t"+ roundNumber(theRealArea,2)+ " sq ft\n\t\t" + roundNumber(theRealAreaAcres,4) + " acres\n\t\t" + roundNumber(theRealAreaMiles,4) + " miles\n\nPerimeter:\t" + roundNumber(theRealLength,2) + " ft\n\t\t" + roundNumber(theRealLengthYards,3) + " yards\n\t\t" + roundNumber(theRealLengthMiles,3) + " miles");
	}

	function calculateLengths() {
		var geometryServiceLength = new esri.arcgis.gmaps.Geometry("http://" + theServerName + "/arcgis/rest/services/Utilities/Geometry/GeometryServer");
		geometryServiceLength.getLengths([ [ polyline ] ], displayLengths);
		amIMeasuring=false;
	}

	function displayLengths(response, error) {
		// Display error message, if any
		if (error) {
			alert("Error " + error.code + ": " + (error.message || (error.details && error.details.join(" ")) || "Unknown error" ));
		return;
		}

		// Display lengths
		var thelength
		thelength = (response.lengths[0] * 3.2808399) - ((response.lengths[0] * 3.2808399) * 0.21) 
		thelengthYards = thelength/3
		thelengthMiles = thelength/5280
		alert("Length:\n" + roundNumber(thelength,0)  + " feet\n" + roundNumber(thelengthYards,1) +  " yards\n" + roundNumber(thelengthMiles,3) + " miles" );
	}
	

	function ViewLegend() {
		var LayerVis = new Array();
		LayerVis = dynamicMap.visibleLayers;
		//alert(LayerVis)
		LayerVis.length 
		
		if (LayerVis.length < 2 && !isPPon) {
			var theMessage = "<div align='left'>You need to add something to the map before the legend can display. <br><br>Do this by:<br> 1. Create a report (use the Search box or click on the map)<br>2. Each section of the report has a 'MAP' button, click this to add that section to the map.  E.g. click the MAP button in the Parcels section to add the parcels to the map.</div>"
			new Messi(theMessage, {title: 'No Legend To Display', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});
		} else {
			LegWin = window.open( "", "thelegend", "width=275,height=325,status,scrollbars,resizable,screenX=20,screenY=40,left=20,top=40");
			LegWin.document.writeln('<html>');
			LegWin.document.writeln('  <head>');
			LegWin.document.writeln('    <title>' + 'The Legend' + '</title>');
			LegWin.document.writeln('  </head>');	
			LegWin.document.writeln('  <BODY onload= "window.focus()">');
			LegWin.document.writeln('    <center>');
			LegWin.document.writeln('      <table>');
			for (i=1; i < LayerVis.length; i++) {
				theLayerID = LayerVis[i]
				LegWin.document.writeln( "        <tr><td><img src='images/Legend/" + dynamicMap.layerInfos[theLayerID].name + ".gif' /></td></tr>")
			}
			if (isPPon) {
				LegWin.document.writeln( "        <tr><td>" + theLastLayerName + "<br><img src='images/Legend/PlanningProvisions.gif' /></td></tr>")
				
			}
			
			LegWin.document.writeln('      </table>')
			LegWin.document.writeln('    </center>')
			LegWin.document.writeln('  </body>')
			LegWin.document.writeln('</html>');
			LegWin.document.close();
		}
	}
	function madeListwider() {
		document.getElementById('items').style.width = 400;
	}
	function bufferCurrentOverlays(theRestmp,theDist) {
		//The results of the Find Task are buffered by 0.95ft before then being sent to the Identify Task (to eliminate neighboring features which share a boundary).  The 
		//  bufferCallback function then deals with the results of the buffer and sends these to the Identify Task

		var bufferPolys = [];
		theBufferDist= theDist
		buffParams.distances = [1, theBufferDist];
		//buffParams.distances = [10,20];
		//alert(theRestmp.length)
		for (i=0; i < theRestmp.length; i++) {
			var graphic=theRestmp[i].feature
			bufferPolys.push(graphic.geometry)
		}
		//alert(theRestmp.length)
		buffParams.geometries = bufferPolys
		buffParams.unionsResults = true;
		
		//should simplify the input polygon here
		//gsvc.simplify(bufferPolys, function(geometries) {
		//	alert("in simplify")
		
		//	gsvc.buffer(buffParams, buffCallback,buffError);       
		//});			
		//theBufferDist=theDist;
		
		//buffParams.outSpatialReference = {"wkid":102113};
		
		//alert(buffParams.outSpatialReference)
		//alert("About to buffer - line 2861")
		gsvc.buffer(buffParams,buffCallback, taskError);
	}
	function bufferCurrentOverlays2(theRestmp,theDist) {
		//The results of the Find Task are buffered by 0.95ft before then being sent to the Identify Task (to eliminate neighboring features which share a boundary).  The 
		//  bufferCallback function then deals with the results of the buffer and sends these to the Identify Task

		var bufferPolys = [];
		theBufferDist= theDist
		buffParams.distances = [1, theBufferDist];
		alert("Buff1")
		for (i=0; i < theRestmp.length; i++) {
			var graphic=theRestmp[i].feature
			bufferPolys.push(graphic.geometry)
		}
		alert("Buff2")
		buffParams.geometries = bufferPolys
		buffParams.unionsResults = true;
		
		
		gsvc.buffer(buffParams,buffCallback, taskError);
	}
	
	function geomErr() {
		alert("Error in simpify process.")		
	}
	
	function buffCallback(results) {
		//Takes the result of the buffer and sends it to the Identify Task
		var polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]), 1), new dojo.Color([100,100,255,0.5]));        
		//check to see if user is running the buffer tool. if not send the result ot the Identify Task
		
		//imbuffering=false;
		if (imbuffering) {
			map.graphics.add(new esri.Graphic(results[1],polygonSymbol));
			bufferonmap=true;
			imbuffering=false;
		} else {
			imbuffering=false;
			identify("",results[1])    //  [0][0] will return the original polygon
		}
		//alert("here")
		 
	}

	function taskError(theError) {
		var txt=""
		//alert("Error")
		var theErrorSimple="Unknown"
		theErrorSimple = theError.name
		
		for (x in theError) {
			txt=txt+"Error Code: " + x+"\n"
			txt=txt + theError[x] + "\n\n";
			theObj = theError[x];
			if (typeof theObj == 'object') {
				for (xx in theObj) {
					txt=txt+"  Error Code: " + xx+"\n"
					txt=txt +"  " + theObj[xx] + "\n\n";
					theObj2=theObj[xx]
					//if (typeof theObj2 == 'object') {
					//	for (xxx in theObj2) {
					//		txt=txt+"    Error Code: " + xxx+"\n"
					//		txt=txt + "    "+ theObj2[xxx] + "\n\n";
					//	}
					//}
				}
			}
		}
		alert(txt) //more detail
		alert("I'm sorry, there has been an error in this process, if this continues please contact the system administrator (mike.wynne@sfgov.org).  Further details:\n\n" + theErrorSimple)
		
		//prompt("The error message can be copied from here: ",txt)  //use this to get more detailed errors
		
		//myObject = theError
		//for (var name in myObject) {
		//	if (myObject.hasOwnProperty(name)) {
		//		alert(name);
		//	}
		//}
		 
		if (document.getElementById('AssessorReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('AssessorReport').innerHTML = instructions
		}
		if (document.getElementById('ZoningReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('ZoningReport').innerHTML = instructions
		}
		if (document.getElementById('SurveyRatingsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('SurveyRatingsReport').innerHTML = instructions
		}
		if (document.getElementById('CaseTrackingReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('CaseTrackingReport').innerHTML = instructions
		}
		if (document.getElementById('PermitsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('PermitsReport').innerHTML = instructions
		}
		if (document.getElementById('MiscPermitsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('MiscPermitsReport').innerHTML = instructions
		}
		if (document.getElementById('EnforcementReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('EnforcementReport').innerHTML = instructions
		}
		if (document.getElementById('AppealsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('AppealsReport').innerHTML = instructions
		}
		if (document.getElementById('BBNsReport').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('BBNsReport').innerHTML = instructions
		}
	}
	
	
	function clearBuffer() {
		map.graphics.clear()
		bufferonmap=false;
		map.graphics.add(theSearchGraphic)
	}
	theLastMapLayer=""
	function showHideMap(theID, theDef) {
		theLastMapLayer=theID
		//alert(theDef)
		//Run when a user clicks on a 'map' button which is used to add or remove a layer form the map
		//Sets the button to on or off and then calls the ToggleOnOff function which adds or removes the layer from the map
		isLayerVisible(theID, theDef)
		if (theDef) {
			if (document.getElementById(theDef).alt=="Add to map") {
				ToggleOnOff(theID, true, theDef);
				document.getElementById(theDef).src = "images/map-icon-on.png"
				document.getElementById(theDef).alt = "Remove from map"
				document.getElementById(theDef).title = "Remove from map"
			} else {
				document.getElementById(theDef).src="images/map-icon-off.png"
				document.getElementById(theDef).alt = "Add to map"
				document.getElementById(theDef).title = "Add to map"
				ToggleOnOff(theID,false,theDef);
			}
			
		} else {
			if (document.getElementById(theID).alt=="Add to map") {
				ToggleOnOff(theID, true, theDef);
				document.getElementById(theID).src = "images/map-icon-on.png"
				document.getElementById(theID).alt = "Remove from map"
				document.getElementById(theID).title = "Remove from map"
			} else {
				document.getElementById(theID).src="images/map-icon-off.png"
				document.getElementById(theID).alt = "Add to map"
				document.getElementById(theID).title = "Add to map"
				ToggleOnOff(theID,false,theDef);
			}
		}
		//alert(theID)
		var arrElements = document.getElementsByName("Planning Provisions");
		//alert(theDef)
		//alert()
		if (theID=='Planning Provisions') {
			for (var i=0; i<arrElements.length; i++) {
				//get pointer to current element:
				//alert("ff")
				var element=arrElements[i];
				//alert(element.title)
				if (element.title== "Remove from map" && element.id !=theDef) {
					//alert("found one to turn off" + "   " + theDef)
					element.title="Add to map"
					element.src="images/map-icon-off.png"
					element.alt="Add to map"
				}
			}
		}
		
		
		
		
		
	}
	
	function formatCurrency(num) {
		//reformats a number to a currency format
		if (num!=""&& num!="Null" && num!=null && num!="nothing") {
			num = num.toString().replace(/\$|\,/g,'');
			if(isNaN(num))
			num = "0";
			sign = (num == (num = Math.abs(num)));
			num = Math.floor(num*100+0.50000000001);
			cents = num%100;
			num = Math.floor(num/100).toString();
			if(cents<10)
				cents = "0" + cents;
			for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
				num = num.substring(0,num.length-(4*i+3))+','+
				num.substring(num.length-(4*i+3));
			return (((sign)?'':'-') + '$' + num + '.' + cents);
		} else {
			return "-"
		}
	}

	function caseActions(tmpCaseNo, tmpCaseSuffix) {
		//FUNCTION NOT BEING USED
		var tmpID
		for (var i = 0; i < idResults.length; i++) {
			if (idResults[i].layerName=="Case Actions" && idResults[i].feature.attributes["CASENO"]==tmpCaseNo && idResults[i].feature.attributes["SUFFIX"]==tmpCaseSuffix) {
				tmpID = "caseAction"
				document.getElementById("caseAction" + tmpCaseNo + tmpCaseSuffix).innerHTML += "Action: " + idResults[i].feature.attributes["ACTION_DATE"] + ": " + idResults[i].feature.attributes["ACTION"]
			}
		}
	}

function idresultsort2(a, b) {
	//alert("here")
	//sorts the idResults so that they appear in the tabs in the correct order
	//alert(a.layerName+ "\n"+b.layerName)

	//if (a.layerName == "MAD_Parcel" && b.layerName == "MAD_Parcel") {
		//alert("here")
		var unitNoA = ""
		unitNoA = a.attributes["unit_address"];
	//alert("1: " + unitNoA)
	if (unitNoA) {
		switch(unitNoA.length) {
			case 1:
				unitNoA = "000" + unitNoA;
				break;
			case 2:
				unitNoA = "00" + unitNoA;
				break;
			case 3:
				unitNoA = "0" + unitNoA;
				break;			
		}
	}
		var unitNoB = ""
		//alert("1a")
		unitNoB = b.attributes["unit_address"];
		//alert("2")
	if (unitNoB) {
		switch(unitNoB.length) {
		case 1:
			unitNoB = "000" + unitNoB;
			break;
		case 2:
			unitNoB = "00" + unitNoB;
			break;
		case 3:
			unitNoB = "0" + unitNoB;
			break;			
		}
	}
		//alert("3")
		var d1 = a.attributes["street_name"] + a.attributes["base_address_num"] + unitNoA
		var d2 = b.attributes["street_name"] + b.attributes["base_address_num"] + unitNoB
		//alert("4")
		if (d1 < d2) {
			//alert(a.attributes["ADDRESS"] + " before " + b.attributes["ADDRESS"])
			return -1
		}
		if (d1 > d2) {
			//alert(b.attributes["ADDRESS"] + " before " + a.attributes["ADDRESS"])
			return 1
		}
		return 0
	//}
}	
	

function idresultsort(a, b) {
	//sorts the idResults so that they appear in the tabs in the correct order
	//alert(a.layerName+ "\n"+b.layerName)

	if (a.layerName == "MAD_Parcel" && b.layerName == "MAD_Parcel") {
		//alert("here")
		var unitNoA = ""
		unitNoA = a.feature.attributes["unit_address"];
		switch(unitNoA.length) {
		case 1:
			unitNoA = "000" + unitNoA;
			break;
		case 2:
			unitNoA = "00" + unitNoA;
			break;
		case 3:
			unitNoA = "0" + unitNoA;
			break;			
		}
		var unitNoB = ""
		unitNoB = b.feature.attributes["unit_address"];
		switch(unitNoB.length) {
		case 1:
			unitNoB = "000" + unitNoB;
			break;
		case 2:
			unitNoB = "00" + unitNoB;
			break;
		case 3:
			unitNoB = "0" + unitNoB;
			break;			
		}
		var d1 = a.feature.attributes["street_name"] + a.feature.attributes["base_address_num"] + unitNoA
		var d2 = b.feature.attributes["street_name"] + b.feature.attributes["base_address_num"] + unitNoB
		if (d1 < d2) {
			//alert(a.feature.attributes["ADDRESS"] + " before " + b.feature.attributes["ADDRESS"])
			return -1
		}
		if (d1 > d2) {
			//alert(b.feature.attributes["ADDRESS"] + " before " + a.feature.attributes["ADDRESS"])
			return 1
		}
		return 0
	}
	//if (a.layerName == "Assessor" && b.layerName == "Assessor") {
	//	var d1 = a.feature.attributes["STREET"] + a.feature.attributes["STTYPE"] + a.feature.attributes["LOSTNO"] + a.feature.attributes["UNITNO"];
	//	var d2 = b.feature.attributes["STREET"] + b.feature.attributes["STTYPE"] + b.feature.attributes["LOSTNO"] + b.feature.attributes["UNITNO"] 
	//	if (d1 < d2)
	//	return -1
	//	if (d1 > d2)
	//	return 1
	//	return 0
	//}
	if (a.layerName=="Planning Cases" && 	b.layerName=="Planning Cases") {
		//order cases in descending order of case number and then ascending order of suffix.  Put old style cases starting with letters at bottom (ascending of letter)
		var d1 = a.feature.attributes["CASENO"];
		var d2 = b.feature.attributes["CASENO"];
		if (d1==d2) {
			var s1 = a.feature.attributes["SUFFIX"];
			var s2 = b.feature.attributes["SUFFIX"];
			//alert("d1: " + d1 + "\nd2: "+ d2)
			if (s1<s2)
			return -1
			if (s2<s1)
			return 1
		} else {
			if (IsNumeric(d1.substring(0,1)) && IsNumeric(d2.substring(0,1))==false) {
				return -1
			} else {
				if (IsNumeric(d1.substring(0,1))==false && IsNumeric(d2.substring(0,1))) {
					return 1
				} else {
					if (IsNumeric(d1.substring(0,1))==false && IsNumeric(d2.substring(0,1))==false) {
						if (d1<d2)
						return -1
						if (d2<d1)
						return 1
					} else {
						if (d1>d2)
						return -1
						if (d2>d1)
						return 1
					}
				}
			}
		}
		return 0
	}
	//if (a.layerName=="MAD_Parcel" && 	b.layerName=="MAD_Parcel") {
		//order MAD_Parcel in ascending order of APN followed by address
	//	var d1 = a.feature.attributes["blklot"] 
	//	var d2 = b.feature.attributes["blklot"] 
	//	if (d1 > d2)
	//	return -1
	//	if (d1 < d2)
	//	return 1
	//	return 0
	//}
	
	if (a.layerName == "Planning Complaints" && b.layerName == "Planning Complaints") {
		var d1 = a.feature.attributes["ID"];
		var d2 = b.feature.attributes["ID"];
		return d2-d1
		
		//if (casenoA > casenoB)
		//return -1
		//if (casenoA < casenoB)
		//return 1
		//return 0
		
		//var complaintFiledA = new Date(a.feature.attributes["DATEFILED"]);
		//var complaintFiledB = new Date(b.feature.attributes["DATEFILED"]);
		
		//if (complaintFiledA > complaintFiledB)
		//return -1
		//if (complaintFiledA < complaintFiledB)
		//return 1
		//return 0
	} 
	if (a.layerName == "Miscellaneous Permits" && b.layerName == "Miscellaneous Permits") {
		var d1 = a.feature.attributes["MPNO"];
		var d2 = b.feature.attributes["MPNO"];
		//return d2-d1
		
		if (d1 > d2)
		return -1
		if (d1 < d2)
		return 1
		return 0
		//var casenoA = new Date(a.feature.attributes["RECEIVED_DATE"] );
		//var casenoB = new Date(b.feature.attributes["RECEIVED_DATE"]);
	
		//if (casenoA > casenoB)
		//return -1
		//if (casenoA < casenoB)
		//return 1
		//return 0
	}
	if (a.layerName=="DBI - Building Permits" && 	b.layerName=="DBI - Building Permits") {
		var d1 = parseInt(a.feature.attributes["app_no"]);
		var d2 = parseInt(b.feature.attributes["app_no"]);
		
		//var d1 =new Date(a.feature.attributes["app_no"]);
		//var d2 =new Date(b.feature.attributes["app_no"]);
		
		if (d1 > d2)
		return -1
		if (d1 < d2)
		return 1
		return 0
	}
	if (a.layerName == "Appeals" && b.layerName == "Appeals") {
		var appealFiledA = new Date(a.feature.attributes["HEARING_DATE"]);
		var appealFiledB = new Date(b.feature.attributes["HEARING_DATE"]);
		if (appealFiledA > appealFiledB)
		return -1
		if (appealFiledA < appealFiledB)
		return 1
		return 0
	} 
	if (a.layerName == "Historic Database" && b.layerName == "Historic Database") {
		var d1 = a.feature.attributes["MAPBLKLOT"];
		var d2 = b.feature.attributes["MAPBLKLOT"];
		
		if (d1 < d2) return -1;
		if (d1 > d2) return 1;
		return 0;
	} 
	if (a.layerName == "Survey Ratings" && b.layerName == "Survey Ratings") {
		var d1 = a.feature.attributes["MAPBLKLOT"];
		var d2 = b.feature.attributes["MAPBLKLOT"];

		if (d1 < d2) return -1;
		if (d1 > d2) return 1;

		if (b.feature.attributes["EVAL_DATE"]=='Null') {
			return -1;
		}
		if (a.feature.attributes["EVAL_DATE"]=='Null') {
			return 1;
		}
		var d1 = new Date(a.feature.attributes["EVAL_DATE"]);
		var d2 = new Date(b.feature.attributes["EVAL_DATE"]);

		if (d1 > d2) return -1;
		if (d1 < d2) return 1;
		
		return 0;
	} 

	if (a.layerName == "HRER Decisions" && b.layerName == "HRER Decisions") {
		if (b.feature.attributes["ACTION_DATE"]=='Null') {
			return -1;
		}
		if (a.feature.attributes["ACTION_DATE"]=='Null') {
			return 1;
		}
		var d1 = new Date(a.feature.attributes["ACTION_DATE"]);
		var d2 = new Date(b.feature.attributes["ACTION_DATE"]);
		
		if (d1 > d2) return -1;
		if (d1 < d2) return 1;
		return 0;
	} 
	
	if (a.layerName == "Assessor" && b.layerName == "Assessor") {
		//alert("yes")
		var d1 = a.feature.attributes["ADDRESS"] ;
		var d2 = b.feature.attributes["ADDRESS"] ;
		//var d1 = a.feature.attributes["STREETNAME"] + a.feature.attributes["LOSTNO"] + a.feature.attributes["UNIT"];
		//var d2 = b.feature.attributes["STREETNAME"] + b.feature.attributes["LOSTNO"] + b.feature.attributes["UNIT"] 
		if (d1 < d2) {
			return -1
		};
		if (d1 > d2) {
			return 1;
		}
		return 0;
	}
	
	if (a.layerName == "Election Precincts" && b.layerName == "Election Precincts") {
		var d1 = parseInt(a.feature.attributes["PRECNAME"]);
		var d2 = parseInt(b.feature.attributes["PRECNAME"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	if (a.layerName == "Street Sweeping MultiBuffer" && b.layerName == "Street Sweeping MultiBuffer") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}

	if (a.layerName == "City Property Multi Buffer - Fire Stations" && b.layerName == "City Property Multi Buffer - Fire Stations") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	if (a.layerName == "City Property Multi Buffer - Police Stations" && b.layerName == "City Property Multi Buffer - Police Stations") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	if (a.layerName == "City Property Multi Buffer - Libraries" && b.layerName == "City Property Multi Buffer - Libraries") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	if (a.layerName == "Open Spaces Quarter Mile Buffer" && b.layerName == "Open Spaces Quarter Mile Buffer") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	
	if (a.layerName == "Public Schools 1 Mile Buffer" && b.layerName == "Public Schools 1 Mile Buffer") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	if (a.layerName == "Public Schools 1 Mile Buffer Project" && b.layerName == "Public Schools 1 Mile Buffer Project") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	if (a.layerName == "Public Schools 1 Mile Buffer USD" && b.layerName == "Public Schools 1 Mile Buffer USD") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	if (a.layerName == "Public Schools Project" && b.layerName == "Public Schools Project") {
		var d1 = parseInt(a.feature.attributes["land_name"]);
		var d2 = parseInt(b.feature.attributes["land_name"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	
	if (a.layerName == "Transit Routes Quarter Mile Buffer" && b.layerName == "Transit Routes Quarter Mile Buffer") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}
	
	if (a.layerName == "Post Offices 1 Mile Buffer" && b.layerName == "Post Offices 1 Mile Buffer") {
		var d1 = parseInt(a.feature.attributes["BUFF_DIST"]);
		var d2 = parseInt(b.feature.attributes["BUFF_DIST"]);
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}

	if (a.layerName == "Neighborhoods" && b.layerName == "Neighborhoods") {
		var d1 = a.feature.attributes["name"]
		var d2 = b.feature.attributes["name"]
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}

	if (a.layerName == "Off Street Parking MultiRing Buffer" && b.layerName == "Off Street Parking MultiRing Buffer") {

		var d1 = a.feature.attributes["FromBufDst"] //+ a.feature.attributes["address"];
		var d2 = b.feature.attributes["FromBufDst"] //+ b.feature.attributes["address"];
		if (d1 < d2)
		return -1
		if (d1 > d2)
		return 1
		return 0
	}

	return 0
}

function maximizeMap() {
	//expands or contracts the map window
	if (theMapSize=="large") {
		document.getElementById("map_canvas").style.width= "496px";	
		//document.getElementById("mapContainer").style.width= "496px";	
		document.getElementById("dhtmlgoodies_tabView1").style.width= "100%";		
		zoomInDiv.innerHTML = "<img src='http://" + theServerName + "/PIM/images/UpArrow.png' title='Enlarge the Map' alt='Enlarge the Map'>";
		theMapSize="small"
		window_resize();
	} else {
		if (navigator.userAgent.indexOf('MSIE')>0) { 
			document.getElementById("map_canvas").style.width= (viewportwidth - 15) +"px";
		} else {
			document.getElementById("map_canvas").style.width= (viewportwidth - 30) +"px";
		}
		document.getElementById("dhtmlgoodies_tabView1").style.width= "650px";
		document.getElementById("map_canvas").style.height= (viewportheight - 100) +"px";

		for (var i = 0; i < (tabNo); i++) {
			document.getElementById("tabViewdhtmlgoodies_tabView1_" + i).style.height= (viewportheight - 5) +"px";
		}
		zoomInDiv.innerHTML = "<img src='http://" + theServerName + "/PIM/images/DownArrow.png' title='Shrink the Map' alt='Shrink the Map'>";
		theMapSize="large"
		window.location.hash="searchbox"; 
		if (navigator.userAgent.indexOf('MSIE')>0) { 
			setTimeout(resizeMap(true),500);
		} else {
			setTimeout(resizeMap(false),500);
		}
	}
	
	//alert("divHeight: "+ divHeight + "divWidth: " + divWidth)
	
}
var tmpZoomLevel=null
function resizeMap(refreshExtent) {
	tmpZoomLevel=map.getLevel()
	map.resize();
	map.reposition();
	if (refreshExtent) {
		setTimeout(refreshMapExtent,500);
	}
}
function refreshMapExtent() {
	map.graphics.redraw()
	map.setExtent(map.extent, true);
	map.setLevel(tmpZoomLevel);
	map.graphics.redraw();
}
function googleStreetView(){
	
	//Opens Google Street View in another window.
	//ArcGIS Server works with Google Mpas API v2 which does not integrate street view into the map, this code adds basic street view functionality (opens a street view window with the view based on the center of the map)
	MinY = map.extent.ymin 
	MaxY = map.extent.ymax
	MinX = map.extent.xmin 
	MaxX = map.extent.xmax
	centerY = ((MaxY-MinY)/2 )+ MinY
	centerX= ((MaxX-MinX)/2) + MinX
	

	var source = new Proj4js.Proj("EPSG:102113");    //source coordinates will be in Longitude/Latitude
	var dest = new Proj4js.Proj("WGS84");
	var p = new Proj4js.Point(centerX,centerY);   
	Proj4js.transform(source, dest, p); 
	//alert(clickedMap)
	if (clickedMap) {
		p.y=clickedLat
		p.x=clickedLong
	}
	//alert(p.y + " " + p.x)
	if (roundNumber(p.y,3).toString()=='37.779' && roundNumber(p.x,3).toString()=='-122.419') {
		//manual fix for City Hall
		//alert("manual for city hall")
		document.getElementById('streetview').href="http://maps.google.com/maps?layer=c&cbll=37.779415,-122.418443&cbp=12,260.19,0,0,0"
	} else {
		//alert("Lat: " + p.y + "\nLong: " + p.x)
		load_map_and_street_view_from_address(p.y,p.x);
	}
	 
}

function computeAngle(endLatLng, startLatLng) {
      var DEGREE_PER_RADIAN = 57.2957795;
      var RADIAN_PER_DEGREE = 0.017453;
 
      var dlat = endLatLng.lat() - startLatLng.lat();
      var dlng = endLatLng.lng() - startLatLng.lng();
      // We multiply dlng with cos(endLat), since the two points are very closeby,
      // so we assume their cos values are approximately equal.
      var yaw = Math.atan2(dlng * Math.cos(endLatLng.lat() * RADIAN_PER_DEGREE), dlat)
             * DEGREE_PER_RADIAN;
      return wrapAngle(yaw);
}
   
function wrapAngle(angle) {
    if (angle >= 360) {
        angle -= 360;
    } else if (angle < 0) {
        angle += 360;
    }
    return angle;
}

function getPDFDoc(url,params) {
	//Ajax code to check whether a document exists on the server.  If it does, return the path.
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	  }	else	  {
		// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	 if ((navigator.userAgent.indexOf('Firefox/3.')>0 )) {  
		 //deal with Firefox 3 which has a bug affecting non asynchronous ajax calls
		  xmlhttp.onload=xmlhttp.onerror = xmlhttp.onabort = function() {
			  var value = xmlhttp.responseText
				stringStart=value.indexOf('E:/')
				stringEnd=value.indexOf('</string>')
				if (stringStart!=-1) {
					document.getElementById('Doc1').innerHTML = value.substring(stringStart,stringEnd)
					//alert(value)
				} else {
					document.getElementById('Doc1').innerHTML = "Not Found"
				}
		  }
	  } else {
		  //deal with all other browsers
		xmlhttp.onreadystatechange= function()
		  {
			// alert(xmlhttp.readyState)
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				//alert(xmlhttp.responseText)
				var value = xmlhttp.responseText
				stringStart=value.indexOf('E:/')
				stringEnd=value.indexOf('</string>')
				if (stringStart!=-1) {
					document.getElementById('Doc1').innerHTML = value.substring(stringStart,stringEnd)
				} else {
					document.getElementById('Doc1').innerHTML = "Not Found"
				}
			}
		  }
	  }
	xmlhttp.open("POST",url,false);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);
}

function getLastDBIUpdate() {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {
		// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
			{
				if (xmlhttp.readyState==4 && xmlhttp.status==200) {
					var str=xmlhttp.responseText.split(".");//split the string by dot
					//for(var i=0;i<str.length;i++)  {//read the string
						//alert(str[0]);
						LastDBIUpdate = str[0]
						//alert(LastDBIUpdate)
					//}
				}
			}
	
	//xmlhttp.open("GET","http://' + theServerName + '/LastDBIUpdate/DBI_Last_Update.txt",true);
	xmlhttp.open("GET","http://" + theServerName + "/LastDBIUpdate/DBI_Last_Update.txt",true);
	xmlhttp.send();
}




function getLocation(url) {
	//prompt("",url)
	//Ajax code to check where the user is - within the City & County of San Francisco's network, or not.
	//SF City IP addresses are in the range of 208.121.0.0 to 208.121.255.255
	theLoc = "Out of City"
	var city=false;
	var xmlhttp;
		
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange= function()
	  {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var value = xmlhttp.responseText
			var internalIPs = ["73.223.47.17", "63.199.81.30","12.167.102.130","71.156.107","63.194.173.4","208.121.","50.152.130.157", "166.137.186.110", "98.248.146.203","24.7.113.168","10.83.40.","10.83.41.","10.83.42","10.83.43.","50.161.67.212","50.152.130.157"];
			//prompt("",value)
			var startIP = value.indexOf('<string xmlns="http://tempuri.org/">') + 36
			var endIP = value.indexOf('</string>')
			var IPLength = (endIP-startIP)+1
			var clientIP = value.substring(startIP,endIP)
			for (var i = 0; i < internalIPs.length; i++) {
				if (clientIP.indexOf(internalIPs[i])>-1 ) {
					city=true;
				}
			}
			if (sitename!="SFFIND") {
				if (city && dept=="PLANNING") {
					document.getElementById('mapTitle').innerHTML = "San Francisco Property Information Map - Internal Version"
					theLoc = "City"
					theLocMaster="City"
				} else {
					document.getElementById('mapTitle').innerHTML = "San Francisco Property Information Map"
					theLoc = "Out of City"
					theLocMaster="Out of City"
				}
			}
		}
	  }
	xmlhttp.open("POST",url,false);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);
}

function publicVersion() {
	//Allows City worker to view public version of the website
	//alert("theLocMaster: " + theLocMaster + "\n" + "theLoc: " + theLoc)
	if (theLocMaster=="City") {
		if (theLoc=="City" && dept=="PLANNING") {
			theLoc="Out of City"
			document.getElementById('mapTitle').innerHTML = "San Francisco Property Information Map"
			window_resize()

		} else {
			theLoc="City"
			document.getElementById('mapTitle').innerHTML = "San Francisco Property Information Map - Internal Version"	

			window_resize()
			}
	}
}

function updateSFFindServicesHtml() {
	theNum = 0
	var temptheSFFindServicesHtml=""
	var temptheSFFindPlacesHtml=""
	theNum=0
	theSFFindServicesHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>In addition to the data below, please contact <a target='_blank' href='http://www.sf311.org/'>311</a> with inquiries regarding City services or transit or <a target='_blank' href='_http://211bayarea.org/'>211</a> for inquiries regarding social services.</td></tr></table>"
	
	
	theSFFindServicesHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	if (isNeighborhood ||isDistrict) {
	} else {
		theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#Addresses'>Addresses</a></td></tr></table>"
	}
	if (isNeighborhood ||isDistrict) {
	} else {
		theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#AssessorsReport'>Assessor's Report</a></td></tr></table>"
	}
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#FireStations'>Fire Stations</a></td></tr></table>"
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#Libraries'>Libraries</a></td></tr></table>"
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#Neighborhoods'>Neighborhoods</a></td></tr></table>"
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#OffStreetParking'>Off Street Parking</a></td></tr></table>"
	if (isNeighborhood ||isDistrict) {
	} else {
		theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#Parcels'>Parcels</a></td></tr></table>"
	}
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#OpenSpaces'>Parks and Publicly Accessible Open Spaces</a></td></tr></table>"
	
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#PoliceStations'>Police Stations</a></td></tr></table>"
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#PostOffices'>Post Offices</a></td></tr></table>"
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#PublicSchools'>Public Schools</a></td></tr></table>"
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#PublicTransit'>Public Transit</a></td></tr></table>"
	if (isNeighborhood ||isDistrict) {
	} else {
		theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#StreetSweeping'>Street Sweeping</a></td></tr></table>"
	}
	theSFFindServicesHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#ZipCodes'>Zip Codes</a></td></tr></table>"
	theSFFindServicesHtml +="<br></div>"
	if (isNeighborhood ||isDistrict) {
		//go through the results array and look for the Fire Stations that were found nearby (within 1 mile).  Add these to the property report HTML.  
		theNum=0
		theSFFindServicesHtml +="<a name='FireStations'></a>"
		if (isLayerVisible("City Property - Fire Stations")) {
			theSFFindServicesHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>FIRE STATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Fire Stations"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='City Property - Fire Stations' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>FIRE STATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Fire Stations"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='City Property - Fire Stations' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
			
		temptheSFFindServicesHtml=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (dynamicMap2.layerInfos[result.layerId].name == "City Property - Fire Stations" && result.feature.attributes["land_name"].indexOf("FIRE STATION #") > -1) {
				theNum = theNum + 1
				//alert("--"+result.feature.attributes["land_name"].substring(14,16)+"--")
				if (theNum==1) {
					temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Fire Station</b></td><td><b>Address</b></td><td><b>Phone</b></tr>"
				}
				temptheSFFindServicesHtml +="<tr><td style='width:250px;'><a target='_blank' href='http://www.sf-fire.org/index.aspx?page=176'>" +result.feature.attributes["land_name"] +"</a></td><td></td><td></td></tr>"
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitFireHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitFireMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitFireHTML\",\"limitFireMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		//go through the results array and look for the Libraries that were found nearby (within 1 mile).  Add these to the property report HTML.  
		theNum=0
		theSFFindServicesHtml +="<a name='Libraries'></a>"
		if (isLayerVisible("City Property - Libraries")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>LIBRARIES: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Libraries"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='City Property - Libraries' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>LIBRARIES: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Libraries"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='City Property - Libraries' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		temptheSFFindServicesHtml=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (dynamicMap2.layerInfos[result.layerId].name == "City Property - Libraries" && result.feature.attributes["category"]=="Public Library") {
				theNum = theNum + 1
				if (theNum==1) {
					temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Library </b></td><td><b>Address</b></td><td><b>Phone</b></td></tr>"
				}
				temptheSFFindServicesHtml +="<tr><td style='width:250px;'><a target='_blank' href='http://sfpl.org/index.php?pg=0000000501'>" +result.feature.attributes["land_name"] +"</a></td></tr>"
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitLibraryHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitLibraryMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitLibraryHTML\",\"limitLibraryMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		//go through the results array and look for the neightborhoods that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual neighborhoods
		theSFFindServicesHtml +="<a name='Neighborhoods'></a>"
		temptheSFFindServicesHtml=""
		theNum=0
		if (isLayerVisible("Neighborhoods")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOODS: </span><input class='NoPrint' onclick='showHideMap(\"Neighborhoods\");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Neighborhoods' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOODS: </span><input class='NoPrint' onclick='showHideMap(\"Neighborhoods\");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Neighborhoods' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		//var theNeighborhoodtemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			//tmpLayernames +="," +dynamicMap2.layerInfos[result.layerId].name
			if (dynamicMap2.layerInfos[result.layerId].name == "Neighborhoods") {
				if (result.feature.attributes["name"] != null) {
					theNum = theNum + 1
						temptheSFFindServicesHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>" + result.feature.attributes["name"] +"&nbsp;</td></tr></table>"
				}
			}
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitNeighborhoodHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitNeighborhoodMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitNeighborhoodHTML\",\"limitNeighborhoodMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
		//Off Street Parking
		theSFFindServicesHtml +="<a name='OffStreetParking'></a>"
		if (isLayerVisible("Off Street Parking")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>OFF STREET PARKING: </span><input class='NoPrint' onclick='showHideMap(\"Off Street Parking\");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Off Street PArking' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>OFF STREET PARKING: </span><input class='NoPrint' onclick='showHideMap(\"Off Street Parking\");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Off Street PArking' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		temptheSFFindServicesHtml=""
		var theParktemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (dynamicMap2.layerInfos[result.layerId].name == "Off Street Parking") {
				if (in_array(result.feature.attributes["address"],theParktemp)) {
				} else {
					theParktemp.push(result.feature.attributes["address"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Address</b></td><td style='width:250px;'><b>Type</b></td><td><b>Spaces</b></td><td><b>Owner</b></td></tr>"
					}
					var theParkingType=""
					switch (result.feature.attributes["primetype"]) {
					case "PPA":
						theParkingType = "Paid, publicly available (PPA): drive up and pay, typically by the hour or by the day"
						break;
					case "CPO":
						theParkingType = "Customer parking only (CPO): typically for businesses or religious institutions"
						break;
					case "PHO":
						theParkingType = "Permit holder only (PHO, CGO): i.e. employees only, students only, monthly only"
						break;
					case "CGO":
						theParkingType = "Permit holder only (PHO, CGO): i.e. employees only, students only, monthly only"
						break;
					case "FPA":
						theParkingType = "Free publicly available (FPA): free off-street parking"
						break;
					default:
						theParkingType =result.feature.attributes["primetype"]
						break;
					}
					var totalSpaces=0
					totalspaces = parseInt(result.feature.attributes["regcap"]) + parseInt(result.feature.attributes["valetcap"]) + parseInt(result.feature.attributes["mccap"])
					temptheSFFindServicesHtml +="<tr><td>" + result.feature.attributes["address"]+ "</td><td style='width:250px;'>" +theParkingType +"</td><td>"+totalspaces+"</td><td>"+result.feature.attributes["owner"]+"</td></tr>"
				}
			}
		}
			
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitOffStreetParkingHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitOffStreetParkingMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitOffStreetParkingHTML\",\"limitOffStreetParkingMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		//Open Space
		theSFFindServicesHtml +="<a name='OpenSpaces'></a>"
		if (isLayerVisible("Open Spaces")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARKS AND PUBLICLY ACCESSIBLE OPEN SPACES: </span><input class='NoPrint' onclick='showHideMap( " + '"Open Spaces"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Open Spaces' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARKS AND PUBLICLY ACCESSIBLE OPEN SPACES: </span><input class='NoPrint' onclick='showHideMap( " + '"Open Spaces"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Open Spaces' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		temptheSFFindServicesHtml=""
		var theOpenSpacetemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (dynamicMap2.layerInfos[result.layerId].name == "Open Spaces") {
				if (in_array(result.feature.attributes["NAME"],theOpenSpacetemp)) {
				} else {
					theOpenSpacetemp.push(result.feature.attributes["NAME"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td><td><b>Park Size</b></td></tr>"
					}
					if (result.feature.attributes["LINK"] !="" && result.feature.attributes["LINK"]!="Null" && result.feature.attributes["LINK"] !=null) {
						temptheSFFindServicesHtml +="<tr><td> <a target='_blank' href='" + result.feature.attributes["LINK"]+"'>" + result.feature.attributes["NAME"]+ "</a></td><td>" +roundNumber(result.feature.attributes["ACRES"],2) +" acres</td></tr>"
					} else {
						temptheSFFindServicesHtml +="<tr><td>" + result.feature.attributes["NAME"]+ "</td><td>" +roundNumber(result.feature.attributes["ACRES"],2) +" acres</td></tr>"
					}
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitOpenSpaceHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitOpenSpaceMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitOpenSpaceHTML\",\"limitOpenSpaceMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		//go through the results array and look for the police districts that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual police districts
		theNum=0
		theSFFindServicesHtml +="<a name='PoliceStations'></a>"
		if (isLayerVisible("Police Districts")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POLICE STATION SERVING THIS LOCATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Police Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Police Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POLICE STATION SERVING THIS LOCATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Police Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Police Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (dynamicMap2.layerInfos[result.layerId].name == "Police Districts") {
				if (result.feature.attributes["DISTRICT"] != null) {
					theNum = theNum + 1
					tmpDist=" Station"
					if (result.feature.attributes["DISTRICT"]=="US Park Police") {
						tmpDist = ""
					}
					theSFFindServicesHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["Link"]  + "'> " + result.feature.attributes["DISTRICT"] + tmpDist + " </a></td></tr></table>"
				}
			}
		}
			
		//go through the results array and look for the Police Stations that were found nearby (within 1 mile).  Add these to the property report HTML.  
		theNum=0
		if (isLayerVisible("City Property - Police Stations")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POLICE STATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Police Stations"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='City Property - Police Stations' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POLICE STATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Police Stations"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='City Property - Police Stations' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		temptheSFFindServicesHtml=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (dynamicMap2.layerInfos[result.layerId].name == "City Property - Police Stations" && result.feature.attributes["dept"]==38 && result.feature.attributes["land_name"].toUpperCase().indexOf("STATION") > -1) {
				theNum = theNum + 1
				if (theNum==1) {
					temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Police Station</b></td><td><b>Address</b></td><td><b>Phone</b></td></tr>"
				}
				temptheSFFindServicesHtml +="<tr><td style='width:250px;'><a target='_blank' href='http://sf-police.org/index.aspx?page=796'>" +result.feature.attributes["land_name"] +"</a></td><td></td><td></td></tr>"
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitPoliceHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitPoliceMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitPoliceHTML\",\"limitPoliceMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
			
		//go through the results array and look for the Post Offices that were found nearby (within 1 mile).  Add these to the property report HTML.  
		theNum=0
		theSFFindServicesHtml +="<a name='PostOffices'></a>"
		if (isLayerVisible("Post Offices")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POST OFFICES: </span><input class='NoPrint' onclick='showHideMap( " + '"Post Offices"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Post Offices' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POST OFFICES: </span><input class='NoPrint' onclick='showHideMap( " + '"Post Offices"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Post Offices' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		temptheSFFindServicesHtml=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (dynamicMap2.layerInfos[result.layerId].name == "Post Offices") {
				theNum = theNum + 1
				if (theNum==1) {
					temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Post Office</b></td><td><b>Address</b></td><td><b>Phone</b></td></tr>"
				}
				temptheSFFindServicesHtml +="<tr><td style='width:250px;'>" +result.feature.attributes["office_name"] +"</td><td>"+ result.feature.attributes["address"] +"</td><td>"+result.feature.attributes["phone"] + "</td></tr>"
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitPostOfficeHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitPostOfficeMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitPostOfficeHTML\",\"limitPostOfficeMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
			
			
		//Public Schools
		theSFFindServicesHtml +="<a name='PublicSchools'></a>"
		if (isLayerVisible("Public Schools Project")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PUBLIC SCHOOLS: </span><input class='NoPrint' onclick='showHideMap( " + '"Public Schools Project"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Public Schools Project' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PUBLIC SCHOOLS: </span><input class='NoPrint' onclick='showHideMap( " + '"Public Schools Project"'  + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Public Schools Project' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		temptheSFFindServicesHtml=""
		theNum=0
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (dynamicMap2.layerInfos[result.layerId].name == "Public Schools Project") {
				theNum = theNum + 1
				if (theNum==1) {
					temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td></tr>"
				}
				var theLink =""
				if (result.feature.attributes["Website"].indexOf("http:")<0) {
					theLink="http://www.sfusd.edu/en/schools/all-schools.html"
				} else {
					theLink=(result.feature.attributes["Website"])
				}
				temptheSFFindServicesHtml +="<tr><td style='width:250px;'><a target='_blank' href='"+theLink + "'>"  +result.feature.attributes["LAND_NAME"] +"</a></td><td>"+ "</td></tr>"
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitPublicSchoolsHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitPublicSchoolsMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitPublicSchoolsHTML\",\"limitPublicSchoolsMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		//Transit Routes
		theSFFindServicesHtml +="<a name='PublicTransit'></a>"
		if (isLayerVisible("Transit Routes")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PUBLIC TRANSIT ROUTES (MUNI): </span><input class='NoPrint' onclick='showHideMap(\"Transit Routes\");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Transit Routes' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PUBLIC TRANSIT ROUTES (MUNI): </span><input class='NoPrint' onclick='showHideMap(\"Transit Routes\");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Transit Routes' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		temptheSFFindServicesHtml=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (dynamicMap2.layerInfos[result.layerId].name == "Transit Routes") {
				theNum = theNum + 1
				if (theNum==1) {
					temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td><td class='NoPrint'><b>Route Map</b></td></tr>"
				}
				if (result.feature.attributes["Link"] =="" || result.feature.attributes["Link"]=="Null" || result.feature.attributes["Link"] == null) { 
					temptheSFFindServicesHtml +="<tr><td style='width:250px;'>" +result.feature.attributes["linename"] +"</td><td></td></tr>"
				} else {
					temptheSFFindServicesHtml +="<tr><td style='width:250px;'>" +result.feature.attributes["linename"] +"</td> <td class='NoPrint'><a target='_blank' href='" +result.feature.attributes["Link"] + "'>View Route Map</a></td></tr>"
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitTransitHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitTransitMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitTransitHTML\",\"limitTransitMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:35px'></td><td class='NoPrint'><a target='_blank' href='http://www.sfmta.com/cms/mmaps/official.htm'> View MUNI Transit System Maps</a></td></tr></table>"

		//go through the results array and look for the Zip Codes that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual supervisor districts
		theSFFindServicesHtml +="<a name='ZipCodes'></a>"
		if (isLayerVisible("Zip Codes")) {
			
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZIP CODES: </span><input class='NoPrint' onclick='showHideMap( " + '"Zip Codes"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zip Codes' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZIP CODES: </span><input class='NoPrint' onclick='showHideMap( " + '"Zip Codes"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zip Codes' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (dynamicMap2.layerInfos[result.layerId].name == "Zip Codes") {
				if (result.feature.attributes["zip_code"] != null) {
					theNum = theNum + 1
					theSFFindServicesHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>" + result.feature.attributes["zip_code"]  + "</td></tr></table>"
				}
			}
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		//theSFFindServicesHtml += "<div class='NoPrint' style='height: 500px;'><div>"
	} else {
		
		//go through the results array and look for the Addresses that were found at the location.  Add these to the property report HTML.
		theSFFindServicesHtml +="<a name='Addresses'></a>"		
		theSFFindServicesHtml = theSFFindServicesHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ADDRESSES: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		thetempSFFindServicesHtml=""
		var addForLink=""
		var thetempAddress=""
		theNum=0
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];	
			if (result.layerName == "MAD_Parcel") {
				if (result.feature.attributes["ADDRESS"] != null) {
					theNum = theNum + 1
					if (theNum==1) {
						addForLink= "<a class='NoPrint' target='_blank' href='http://" + theServerName + "/PIM/?search=" + result.feature.attributes["ADDRESSSIMPLE"] +"&dept=planning'>View Detailed Information About This Property</a>"
						thetempAddress = result.feature.attributes["ADDRESSSIMPLE"]
					}
					thetempSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["ADDRESS"] + ", SAN FRANCISCO, CA " + result.feature.attributes["zipcode"] + " &nbsp; " + addForLink + "</td></tr></table>"
				}
			}
		}
		if (theNum>5) {
			theSFFindServicesHtml+="<div id='limitAddressHTML' style='height:110px;overflow:hidden'>" + thetempSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitAddressMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitAddressHTML\",\"limitAddressMore\",\"110px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += thetempSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		//go through the results array and look for the Addresses that were found at the location.  Add these to the property report HTML.  
		theNum = 0
			
		//go through the results array and look for the Sanborn Maps that were found at the location.  Add these to the Sanborn variable (which will later be added to the property report HTML).  
		//-----------------------
		var theBlock = ""
		var tmpBlock=""
		var theBlocktmp=""
		var theBLKLOT=""
		var theSanbornMap=""
		var theSanborn=""
		var SanMapNo=0
		var theSanbornMapPDF=""
		//go through the results array and look for the Sanborn Maps that were found at the location.  Add these to the Sanborn variable (which will later be added to the property report HTML). 
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Sanborn Maps") {
				theSanbornMap = result.feature.attributes["MAPFILE"]
				if (theSanbornMap!="") {
					theSanbornMapPDF = theSanbornMap.toUpperCase().replace(".PNG",".PDF")
					SanMapNo=SanMapNo + 1
					tmpSan=""
					if (SanMapNo>1) {
					    tmpSan=SanMapNo
					}
					if (theSanbornMap != "Null") {
						theSanborn += "<table class='reportData'<tr><td style='width:15px'></td><td colspan=2 class='noprint'><a target='_blank' href='/PIM/Sanborn.html?sanborn=" + theSanbornMapPDF + "'>View Historic Sanborn Map " + tmpSan + "</a></td></tr></table>"
					}
				}
			}
		}
		theSanborn +="<br class='NoPrint'>"
		theSFFindServicesHtml +="<a name='BookmarkAssessorsReport'></a>"
		theSFFindServicesHtml +="<a name='AssessorsReport'></a>"	
		theSFFindServicesHtml += "<br><br><table width='100%' ><tr><td align='left'><span class='reportSectionHead'>ASSESSOR'S REPORT: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		theSFFindServicesHtml += "<table class='noPrint'> <tr><td style='width:15px'></td><td><a href='http://crmproxy.sfgov.org/Ef3/SSP_Request_For_City_Services.xml?&LSBranch=no&eformTitle=Request%20for%20City%20Services%20-%20Assessor&departments=assessor_recorder&subType=assessor' target='_blank' title='Send Feedback to the Assessors Office'>Send Feedback to the Assessors Office</a></td></tr></table>"
			
			//display the Public version of Assessor's Maps
			theYearBuilt=0
			theNum=0
			thetempSFFindServicesHtml=""
			var tempAssessorHtml=""		
		
			//go through the results array and look for the Assessors records that were found at the location.  Add these to the property report HTML.  
			for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (result.layerName == "Assessor" ) {
					theNum=theNum+1
					theBLKLOT = result.feature.attributes["BLKLOT"]
					var theAssAddress = result.feature.attributes["ADDRESS"]
					var RE = result.feature.attributes["LANDVAL"]
					var Improvements = result.feature.attributes["STRUCVAL"]
					var Fixtures = result.feature.attributes["FIXTVAL"]
					var PersonalProperty = result.feature.attributes["OTHRVAL"]
					var tmpExempt1 = result.feature.attributes["HOMEEXEMPT"]
					var tmpExempt2 = result.feature.attributes["MISCEXEMPT"]
					var Taxable = parseFloat((parseFloat(RE) + parseFloat(Improvements) + parseFloat(Fixtures) + parseFloat(PersonalProperty)) - (parseFloat(tmpExempt1) + parseFloat(tmpExempt2)))

					var RE = result.feature.attributes["LANDVAL"]
					RE= (RE=="0") ? "-" : formatCurrency(RE); 
					var Improvements = result.feature.attributes["STRUCVAL"]
					Improvements= (Improvements=="0") ? "-" : formatCurrency(Improvements); 
					var Fixtures = result.feature.attributes["FIXTVAL"]
					Fixtures= (Fixtures=="0") ? "-" : formatCurrency(Fixtures); 
					var PersonalProperty = result.feature.attributes["OTHRVAL"]
					PersonalProperty= (PersonalProperty=="0") ? "-" : formatCurrency(PersonalProperty); 
					
					Taxable= (Taxable=="0") ? "-" : formatCurrency(Taxable); 
					var RevenueDistrict = "" //result.feature.attributes["District"]
					var Parcel = result.feature.attributes["BLKLOT"]
					var theYearBuilttmp=""
					
					var BldSqFt = result.feature.attributes["BLDGSQFT"]
					var curPrice = result.feature.attributes["CURRPRICE"]
					var lastSale = result.feature.attributes["CURRSALEDATE"]
					if (BldSqFt > 0) {
						BldSqFt = addCommas(BldSqFt) + " sq ft"
					} else {
						 BldSqFt = "-"
					}
						if (curPrice== 0) {
						curPrice = "-"						
					} else {
						curPrice = formatCurrency(curPrice);
					}
					if ((lastSale == "Null") || (lastSale=="") || (!lastSale) || (lastSale==" ") ) {
						lastSale = "-"
					} else {
						lastSale = lastSale;
					}
					theBlock = result.feature.attributes["BLOCK"]
					var owner = result.feature.attributes["OWNRNAME"] 
					var address1 = result.feature.attributes["ADDRESS1"]
					var address2 = result.feature.attributes["ADDRESS2"]
					var address3 = result.feature.attributes["ADDRESS3"]
					var address4 = result.feature.attributes["ADDRESS4"]
					var address5 = result.feature.attributes["OWNRZIPCODE"]
					var theAddress=""
					var theMailingAddress=""
						
					if (owner==""||owner==" " || owner == "Null"){
					} else{
						theAddress = owner
					}
					if (address1==""||address1==" " || address1 == "Null"){
					} else{
						if (theAddress==""||theAddress==" " || theAddress == "Null") {
							theAddress += address1
						} else {
							theAddress+="<br> " +address1
						}
					}
							
					if (address2==""||address2==" " || address2 == "Null"){
					} else{
						theMailingAddress += address2;
						theAddress += "<br>" + address2
					}
					if (address3==""||address3==" " || address3 == "Null"){
					} else{
						if (theMailingAddress==""||theMailingAddress==" " || theMailingAddress == "Null") {
							theMailingAddress+=address3
							theAddress = address3
						} else {
							theMailingAddress+=", " +address3
							theAddress+="<br> " +address3
						}
					}
					if (address4==""||address4==" " || address4 == "Null"){
					} else{
						if (theMailingAddress==""||theMailingAddress==" " || theMailingAddress == "Null") {
							theMailingAddress+=address4
							theAddress = address4
						} else {
							theMailingAddress+=", " +address4
							theAddress+="<br> " +address4
						}
					}
					if (address5==""||address5==" " || address5 == "Null"){
					} else{
						if (theMailingAddress==""||theMailingAddress==" " || theMailingAddress == "Null") {
							theMailingAddress+=address5
							theAddress = address5
						} else {
							theMailingAddress+=", " +address5
							theAddress+=", " +address5
						}
					}
					theBlocktmp = result.feature.attributes["BLOCK"] //.substring(0,4)
					if (tmpBlock!=theBlocktmp) {
						theURLtmp = 'http://' + theServerName +'/FileSearch/SearchService.asmx/GetLatestPDFinD'
						theParamstmp = "inpath=E:/GIS Data/ParcelInfo/BlockBooks&insearchname=AssessorBlock" + theBlocktmp.substring(0,4)  //result.feature.attributes["BLOCK_NUM"].substring(0,4)
						getPDFDoc(theURLtmp,theParamstmp)
					}
					tmpBlock=theBlocktmp
					theDoc=document.getElementById('Doc1').innerHTML
						
					if (theDoc=="Not Found") {
						theBlockBooktmp="" //"Assessor's Block Map not available"
					}else {
						theDoc = theDoc.replace("E:/GIS Data/ParcelInfo/BlockBooks","" )
						theBlockBooktmp="<a target='_blank' href = 'http://" + theServerName + "/BlockBooks" + theDoc + "'>View Assessor's Block Map</a>"
					}
						
					var theLotArea = addCommas(result.feature.attributes["LOTAREA"]) 
					if (result.feature.attributes["LOTAREA"] > 0) {
						theLotArea = theLotArea + " sq ft"
					} else {
						 theLotArea = "-"
					}
					
					theYearBuilttmp = result.feature.attributes["YRBUILT"] 
					if ((theYearBuilttmp < theYearBuilt) || (theYearBuilt==0)) {
						theYearBuilt=theYearBuilttmp
					}
					if (theYearBuilttmp>1800) {
					} else {
						theYearBuilttmp="-"
					}
					var theUnits = result.feature.attributes["UNITS"]
					if (theUnits>0) {
					} else {
						theUnits="-"
					}
					var theStories = result.feature.attributes["STORIES"]
					if (theStories>0) {
					} else {
						theStories="-"
					}
					var theUse = result.feature.attributes["DESCRIPTION"] 
					var theConstruction = result.feature.attributes["ConstrDesc"]
					var theRooms = result.feature.attributes["ROOMS"]
					if (theRooms>0) {
					} else {
						theRooms="-"
					}
					var theBedrooms = result.feature.attributes["BEDROOMS"]
					if (theBedrooms>0) {
					} else {
						theBedrooms="-"
					}
					var theBathrooms = result.feature.attributes["BATHROOMS"]
					if (theBathrooms>0) {
					} else {
						theBathrooms="-"
					}
					var theShape = result.feature.attributes["LOTSHAPE"]
					if (theShape>0) {
					} else {
						theShape="-"
					}
					var theFrontage = result.feature.attributes["LOTFRONTAGE"]
					if (theFrontage>0) {
						theFrontage += " ft"
					} else {
						theFrontage="-"
					}
					var theDepth = result.feature.attributes["LOTDEPTH"]
					if (theDepth>0) {
						theDepth += " ft"
					} else {
						theDepth="-"
					}
					var theOwnerDate = result.feature.attributes["ENTRYMM"] +"/" + result.feature.attributes["ENTRYDD"] + "/" +result.feature.attributes["ENTRYYY"]
					
					tempAssessorHtml += "<table class='reportData' style='width:100%;'>"
					tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Address:</td><td>" + theAssAddress + "</td></tr>"
					if ((theLoc=="City") && (dept=="PLANNING")) {
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Mailing Address:*</td><td>" + theMailingAddress + "</td></tr>"
					}
					tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Parcel:</td><td>" + Parcel + "</td></tr>"
					tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Assessed Values:</td><td></td></tr>"
					tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'> &nbsp &nbsp Land:</td><td>" + RE + "</td></tr>"
					tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'> &nbsp &nbsp Structure:</td><td>" + Improvements + "</td></tr>"
					tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'> &nbsp &nbsp Fixtures:</td><td>" + Fixtures + "</td></tr>"
					tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'> &nbsp &nbsp Personal Property:</td><td>" + PersonalProperty + "</td></tr>"
					if ((theLoc=="City") && (dept=="PLANNING")) {
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Last Sale:*</td><td>" + lastSale + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Last Sale Price:*</td><td>" + curPrice + "</td></tr>"
					}
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Year Built:</td><td>" + theYearBuilttmp + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Building Area:</td><td>" + BldSqFt + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Parcel Area:</td><td>" + theLotArea + "</td></tr>"
					if ((theLoc=="City") && (dept=="PLANNING")) {
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Parcel Shape:*</td><td>" + theShape+ "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Frontage:*</td><td>" + theFrontage+ "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Depth:*</td><td>" + theDepth + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Construction Type:*</td><td>" + theConstruction + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Use Type:*</td><td>" + theUse + "</td></tr>"
					}
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Units:</td><td>" + theUnits + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Stories:</td><td>" + theStories + "</td></tr>"
					if ((theLoc=="City") && (dept=="PLANNING")) {
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Rooms:*</td><td>" + theRooms + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Bedrooms:*</td><td>" + theBedrooms + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Bathrooms:*</td><td>" + theBathrooms + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Owner:*</td><td>" + theAddress + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Owner Date:*</td><td>" + theOwnerDate + "</td></tr>"
					}
						
					theBlocktmp = result.feature.attributes["BLOCK"] //.substring(0,4)
					theRecordDocLink="http://www.criis.com/cgi-bin/new_get_recorded.cgi/?county=sanfrancisco&SEARCH_TYPE=APN&COUNTY=san%20francisco&YEARSEGMENT=current&ORDER_TYPE=Recorded%20Official&LAST_RECORD=1&SCREENRETURN=doc_search.cgi&SCREEN_RETURN_NAME=Recorded%20Document%20Search"
					theRecordDocLink+="&BLOCK="+theBlocktmp+"&LOT="+result.feature.attributes["LOT"] 
					tempAssessorHtml +=  "<tr><td></td><td colspan=2 class='noprint'><a target='_blank' href='"+ theRecordDocLink+ "'>Recorded Documents for this property</a></td></tr>"
					
					if (tmpBlock!=theBlocktmp) {
						theURLtmp = 'http://' + theServerName +'/FileSearch/SearchService.asmx/GetLatestPDFinD'
						theParamstmp = "inpath=E:/GIS Data/ParcelInfo/BlockBooks&insearchname=AssessorBlock" + theBlocktmp.substring(0,4)  //result.feature.attributes["BLOCK_NUM"].substring(0,4)
						getPDFDoc(theURLtmp,theParamstmp)
					}
					tmpBlock=theBlocktmp
					theDoc=document.getElementById('Doc1').innerHTML
					
					if (theDoc=="Not Found") {
						theBlockBooktmp="" //"Assessor's Block Map not available"
					}else {
						theDoc = theDoc.replace(":/GIS Data/ParcelInfo/BlockBooks","" )
						theBlockBooktmp="<a target='_blank' href = 'http://" + theServerName + "/BlockBooks" + theDoc + "'>View Assessor's Block Map</a>"
					}
					tempAssessorHtml+="<tr><td></td><td colspan=2 class='noprint'>" + theBlockBooktmp +"</td></tr>"
					if ((theLoc=="City") && (dept=="PLANNING")) {
						tempAssessorHtml +=  "<tr><td></td><td colspan=2 class='noprint'><a target='_blank' href='http://cityplan-arc10/InfoVol/Maps/Block Books/"+ theBlocktmp+ ".pdf'>View Planning Department Block Map*</a></td></tr>"
						tempAssessorHtml +=  "<tr><td></td><td colspan=2 class='noprint'><a target='_blank' href='http://cityplan-arc10/InfoVol/Maps/Block Books/"+ theBlocktmp + "_2.pdf'>View Planning Department Historic Block Map*</a></td></tr>"
					}
					tempAssessorHtml += theSanborn
				}
			}
			theSFFindServicesHtml +=tempAssessorHtml
			if (theNum==0) {
				theSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
				
			}
			if (theNum>2) {
				if (theLoc=="City" && dept=="PLANNING") {
					var pixelHeight="1365px"
				} else {
					var pixelHeight="660px"
				}
				theSFFindServicesHtml+="<div id='limitAssessorsReportHTML' style='height:" + pixelHeight + ";overflow:hidden'>" + thetempSFFindServicesHtml + "</div>"
				theSFFindServicesHtml+="<div id='limitAssessorsReportMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitAssessorsReportHTML\",\"limitAssessorsReportMore\",\" "+ pixelHeight + "\");'>more...</a></td></tr></table></div>"
			} else {
				theSFFindServicesHtml += thetempSFFindServicesHtml
			}
	
		
		theNum=0
		temptheSFFindServicesHtml=""
		var theOpenSpacetemp=new Array();
		
		//go through the results array and look for the Fire Stations that were found nearby (within 1 mile).  Add these to the property report HTML.  
		theNum=0
		theSFFindServicesHtml +="<a name='FireStations'></a>"
		if (isLayerVisible("City Property - Fire Stations")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>FIRE STATIONS NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Fire Stations"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='City Property - Fire Stations' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>FIRE STATIONS NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Fire Stations"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='City Property - Fire Stations' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		temptheSFFindServicesHtml=""
		var theOpenSpacetemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "City Property Multi Buffer - Fire Stations") {
				if (in_array(result.feature.attributes["land_name"],theOpenSpacetemp)) {
				} else {
					theOpenSpacetemp.push(result.feature.attributes["land_name"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td><td><b>Distance</b></td></tr>"
					}
					temptheSFFindServicesHtml +="<tr><td><a target='_blank' href='http://www.sf-fire.org/index.aspx?page=176'>" +result.feature.attributes["land_name"] +"</a></td><td>"+addCommas(result.feature.attributes["BUFF_DIST"])+"ft</td></tr>"
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitFireStationsHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitFireStationsMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitFireStationsHTML\",\"limitFireStationsMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		//go through the results array and look for the Libraries that were found nearby (within 1 mile).  Add these to the property report HTML.  
		theNum=0
		theSFFindServicesHtml +="<a name='Libraries'></a>"
		if (isLayerVisible("City Property - Libraries")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>LIBRARIES NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Libraries"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='City Property - Libraries' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>LIBRARIES NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Libraries"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='City Property - Libraries' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		temptheSFFindServicesHtml=""
		var theOpenSpacetemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "City Property Multi Buffer - Libraries") {
				if (in_array(result.feature.attributes["land_name"],theOpenSpacetemp)) {
				} else {
					theOpenSpacetemp.push(result.feature.attributes["land_name"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td><td><b>Distance</b></td></tr>"
					}
					temptheSFFindServicesHtml +="<tr><td><a target='_blank' href='http://sfpl.org/index.php?pg=0000000501'>" +result.feature.attributes["land_name"] +"</a></td><td>"+addCommas(result.feature.attributes["BUFF_DIST"])+"ft</td></tr>"
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitLibrariesHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitLibrariesMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitLibrariesHTML\",\"limitLibrariesMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
		//go through the results array and look for the neightborhoods that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual neighborhoods
		theSFFindServicesHtml +="<a name='theNeighborhoods'></a>"
		temptheSFFindServicesHtml=""
		theNum=0
		if (isLayerVisible("Neighborhoods")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOOD: </span><input class='NoPrint' onclick='showHideMap( " + '"Neighborhoods"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Neighborhoods' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOOD: </span><input class='NoPrint' onclick='showHideMap( " + '"Neighborhoods"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Neighborhoods' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Neighborhoods") {
				if (result.feature.attributes["name"] != null) {
					theNum = theNum + 1
						temptheSFFindServicesHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>" + result.feature.attributes["name"] +"&nbsp;</td></tr></table>"
				}
			}
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitNeighborhoodHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitNeighborhoodMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitNeighborhoodHTML\",\"limitNeighborhoodMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
		
		//Off Street Parking
		theSFFindServicesHtml +="<a name='OffStreetParking'></a>"
		if (isLayerVisible("Off Street Parking")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>OFF STREET PARKING NEARBY: </span><input class='NoPrint' onclick='showHideMap(\"Off Street Parking\");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Off Street PArking' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>OFF STREET PARKING NEARBY: </span><input class='NoPrint' onclick='showHideMap(\"Off Street Parking\");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Off Street PArking' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		temptheSFFindServicesHtml=""
		var theParktemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Off Street Parking MultiRing Buffer") {
				if (in_array(result.feature.attributes["address"],theParktemp)) {
				} else {
					theParktemp.push(result.feature.attributes["address"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Address</b></td><td style='width:250px;'><b>Type</b></td><td><b>Spaces</b></td><td><b>Owner</b></td><td><b>Distance</b></td></tr>"
					}
					var theParkingType=""
					switch (result.feature.attributes["primetype"]) {
					case "PPA":
						theParkingType = "Paid, publicly available (PPA): drive up and pay, typically by the hour or by the day"
						break;
					case "CPO":
						theParkingType = "Customer parking only (CPO): typically for businesses or religious institutions"
						break;
					case "PHO":
						theParkingType = "Permit holder only (PHO, CGO): i.e. employees only, students only, monthly only"
						break;
					case "CGO":
						theParkingType = "Permit holder only (PHO, CGO): i.e. employees only, students only, monthly only"
						break;
					case "FPA":
						theParkingType = "Free publicly available (FPA): free off-street parking"
						break;
					default:
						theParkingType =result.feature.attributes["primetype"]
						break;
					}
					var totalSpaces=0
					totalspaces = parseInt(result.feature.attributes["regcap"]) + parseInt(result.feature.attributes["valetcap"]) + parseInt(result.feature.attributes["mccap"])
					temptheSFFindServicesHtml +="<tr><td>" + result.feature.attributes["address"]+ "</td><td style='width:250px;'>" +theParkingType +"</td><td>"+totalspaces+"</td><td>"+result.feature.attributes["owner"]+"</td><td>"+addCommas(result.feature.attributes["FromBufDst"])+"ft</td></tr>"
				}
			}
		}
		
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitOffStreetParkingHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitOffStreetParkingMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitOffStreetParkingHTML\",\"limitOffStreetParkingMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		theSFFindServicesHtml +="<a name='Parcels'></a>"
		if ((idResults.length> 0) && (theSearchType=="mapClick" || theSearchType=="Parcel" || theSearchType=="Address" || theSearchType=="Case" || theSearchType=="Geocode" || theSearchType=="Block")) {
			if (isLayerVisible("Parcels")) {
				theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARCELS (Block/Lot): </span><input class='NoPrint' onclick='showHideMap( " + '"Parcels"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Parcels' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARCELS (Block/Lot): </span><input class='NoPrint' onclick='showHideMap( " + '"Parcels"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Parcels' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
		 }
		//go through the results array and add the Parcel results to the HTML
		 
		theParcels = 0
		var temptheSFFindServicesHtml=""
		 theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if ((result.layerName == "MAD_Parcel") && (theSearchType=="Address" )) {
				theNum = theNum + 1;
				theAddressLot = result.feature.attributes["mapblklot"]
				themapblklot = theAddressLot
				if (IsNumeric(theAddressLot.substring(4,5))) {
					theAddressLot = theAddressLot.substring(4,theSearchString.length)
				} else {
					theAddressLot = theAddressLot.substring(5,theSearchString.length)
				}
			}
			
			if ((result.layerName == "Parcel Labels") && (theSearchType=="mapClick" || theSearchType=="Parcel" || theSearchType=="Address" || theSearchType=="Case" || theSearchType=="Geocode" || theSearchType=="Block")) {
				theNum = theNum + 1;
				theParcels = theParcels + 1;
				themapblklot = result.feature.attributes["mapblklot"]
				switch (theSearchType) {
					case "mapClick":
						if (result.feature.attributes["num_lots"] ==1) {
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
						} else {
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" + result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						
						break;
					case "Parcel":
						if (result.feature.attributes["num_lots"] == 1) { 
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
						} else {
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Block":
						if (result.feature.attributes["num_lots"] == 1) { 
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
						} else {
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Address":
						if (result.feature.attributes["num_lots"] == 1) { 
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
						} else {
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" + result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+  " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Case":
						if (result.feature.attributes["num_lots"] ==1) {
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
						} else {
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" + result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Geocode":
						if (result.feature.attributes["num_lots"] == 1) { 
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
						} else {
							temptheSFFindServicesHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
				}
			} 
		}
		if (theParcels>5) {
			theSFFindServicesHtml+="<div id='limitParcelsHTML' style='height:110px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitParcelsMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitParcelsHTML\",\"limitParcelsMore\",\"110px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theParcels==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		//Open Space
		theSFFindServicesHtml +="<a name='OpenSpaces'></a>"
		if (isLayerVisible("Open Spaces")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARKS AND PUBLICLY ACCESSIBLE OPEN SPACES NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"Open Spaces"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Open Spaces' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARKS AND PUBLICLY ACCESSIBLE OPEN SPACES NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"Open Spaces"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Open Spaces' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		temptheSFFindServicesHtml=""
		var theOpenSpacetemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Open Spaces Quarter Mile Buffer") {
				if (in_array(result.feature.attributes["NAME"],theOpenSpacetemp)) {
				} else {
					theOpenSpacetemp.push(result.feature.attributes["NAME"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td><td><b>Park Size</b></td><td><b>Distance</b></td></tr>"
					}
					if (result.feature.attributes["LINK"] !="" && result.feature.attributes["LINK"]!="Null" && result.feature.attributes["LINK"] !=null) {
						temptheSFFindServicesHtml +="<tr><td> <a target='_blank' href='" + result.feature.attributes["LINK"]+"'>" + result.feature.attributes["NAME"]+ "</a></td><td>" +roundNumber(result.feature.attributes["ACRES"],2) +" acres</td><td>"+addCommas(result.feature.attributes["BUFF_DIST"])+"ft</td></tr>"
					} else {
						temptheSFFindServicesHtml +="<tr><td>" + result.feature.attributes["NAME"]+ "</td><td>" +roundNumber(result.feature.attributes["ACRES"],2) +" acres</td><td>"+addCommas(result.feature.attributes["BUFF_DIST"])+"ft</td></tr>"
					}
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitOpenSpaceHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div><br>"
			theSFFindServicesHtml+="<div id='limitOpenSpaceMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitOpenSpaceHTML\",\"limitOpenSpaceMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		 		 
		//go through the results array and look for the police districts that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual police districts
		theNum=0
		theSFFindServicesHtml +="<a name='PoliceStations'></a>"
		if (isLayerVisible("Police Districts")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POLICE STATION SERVING THIS LOCATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Police Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Police Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POLICE STATION SERVING THIS LOCATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Police Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Police Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Police Districts") {
				if (result.feature.attributes["DISTRICT"] != null) {
					theNum = theNum + 1
					tmpDist=" Station"
					if (result.feature.attributes["DISTRICT"]=="US Park Police") {
						tmpDist = ""
					}
					theSFFindServicesHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["Link"]  + "'> " + result.feature.attributes["DISTRICT"] + tmpDist + " </a></td></tr></table>"
				}
			}
		}
		
		//go through the results array and look for the Police Stations that were found nearby (within 1 mile).  Add these to the property report HTML.  
		theNum=0
		if (isLayerVisible("City Property - Police Stations")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POLICE STATIONS NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Police Stations"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='City Property - Police Stations' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POLICE STATIONS NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"City Property - Police Stations"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='City Property - Police Stations' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		temptheSFFindServicesHtml=""
		var theOpenSpacetemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "City Property Multi Buffer - Police Stations") {
				if (in_array(result.feature.attributes["land_name"],theOpenSpacetemp)) {
				} else {
					theOpenSpacetemp.push(result.feature.attributes["land_name"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td><td><b>Distance</b></td></tr>"
					}
					temptheSFFindServicesHtml +="<tr><td><a target='_blank' href='http://sf-police.org/index.aspx?page=796'>" +result.feature.attributes["land_name"] +"</a></td><td>"+addCommas(result.feature.attributes["BUFF_DIST"])+"ft</td></tr>"
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitPoliceStationsHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitPoliceStationsMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitPoliceStationsHTML\",\"limitPoliceStationsMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
		//go through the results array and look for the Post Offices that were found nearby (within 1 mile).  Add these to the property report HTML.  
		theNum=0
		theSFFindServicesHtml +="<a name='PostOffices'></a>"
		if (isLayerVisible("Post Offices")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>POST OFFICES NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"Post Offices"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Post Offices' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table border=0 width='100%'><tr><td align='left'><span class='reportSectionHead'>POST OFFICES NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"Post Offices"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Post Offices' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		temptheSFFindServicesHtml=""
		var thePostOfficetemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Post Offices 1 Mile Buffer") {
				if (in_array(result.feature.attributes["office_name"],thePostOfficetemp)) {
				} else {
					thePostOfficetemp.push(result.feature.attributes["office_name"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Post Office</b></td><td><b>Address</b></td><td><b>Phone</b></td><td><b>Distance</b></td></tr>"
						//temptheSFFindElectedHtml +="<table class='reportData' style='border-spacing: 40px 10px;'><tr><td><b>Street</b></td><td><b>Left Side Sweep</b></td><td><b>Right Side Sweep</b></td></tr>"
					}
					temptheSFFindServicesHtml +="<tr><td style='width:250px;'>" +result.feature.attributes["office_name"] +"</td><td>"+ result.feature.attributes["address"] +"</td><td>"+result.feature.attributes["phone"] + "</td><td>"+addCommas(result.feature.attributes["BUFF_DIST"])+"ft</td></tr>"
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitPostOfficeHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitPostOfficeMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitPostOfficeHTML\",\"limitPostOfficeMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
		//Public Schools
		theSFFindServicesHtml +="<a name='PublicSchools'></a>"
		if (isLayerVisible("Public Schools")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PUBLIC SCHOOLS NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"Public Schools Project"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Public Schools Project' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PUBLIC SCHOOLS NEARBY: </span><input class='NoPrint' onclick='showHideMap( " + '"Public Schools Project"'  + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Public Schools Project' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		temptheSFFindServicesHtml=""
		theNum=0
		var thePublicSchoolstemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Public Schools 1 Mile Buffer USD") {
				if (in_array(result.feature.attributes["land_name"],thePublicSchoolstemp)) {
				} else {
					thePublicSchoolstemp.push(result.feature.attributes["land_name"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td><td><b>Distance</b></td></tr>"
					}
					var theLink =""
					if (result.feature.attributes["Website"].indexOf("http:")<0) {
						theLink="http://www.sfusd.edu/en/schools/all-schools.html"
					} else {
						theLink=(result.feature.attributes["Website"])
					}
					
					temptheSFFindServicesHtml +="<tr><td style='width:250px;'><a target='_blank' href='"+theLink + "'>" +result.feature.attributes["land_name"] + "</a></td><td>"+addCommas(result.feature.attributes["BUFF_DIST"]) +"ft</td></tr>"
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitPublicSchoolsHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitPublicSchoolsMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitPublicSchoolsHTML\",\"limitPublicSchoolsMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		//Transit Routes
		theSFFindServicesHtml +="<a name='PublicTransit'></a>"
		if (isLayerVisible("Transit Routes")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PUBLIC TRANSIT ROUTES NEARBY (MUNI): </span><input class='NoPrint' onclick='showHideMap(\"Transit Routes\");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Transit Routes' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PUBLIC TRANSIT ROUTES NEARBY (MUNI): </span><input class='NoPrint' onclick='showHideMap(\"Transit Routes\");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Transit Routes' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		temptheSFFindServicesHtml=""
		var theTransitRoutestemp=new Array();
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Transit Routes Quarter Mile Buffer") {
				if (in_array(result.feature.attributes["linename"],theTransitRoutestemp)) {
				} else {
					theTransitRoutestemp.push(result.feature.attributes["linename"])
					theNum = theNum + 1
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Name</b></td><td><b>Route Map</b></td><td><b>Distance</b></td></tr>"
					}
					if (result.feature.attributes["Link"] =="" || result.feature.attributes["Link"]=="Null" || result.feature.attributes["Link"] == null) { 
						temptheSFFindServicesHtml +="<tr><td style='width:250px;'>" +result.feature.attributes["linename"] +"</td></tr>"
					} else {
						temptheSFFindServicesHtml +="<tr><td style='width:250px;'>" +result.feature.attributes["linename"] +"</td> <td><a target='_blank' href='" +result.feature.attributes["Link"] + "'>View Route Map</a></td><td>"+addCommas(result.feature.attributes["BUFF_DIST"])+"ft</td></tr>"
					}
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table></td></tr></table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitTransitHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitTransitMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitTransitHTML\",\"limitTransitMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:35px'></td><td class='NoPrint'><a target='_blank' href='http://www.sfmta.com/cms/mmaps/official.htm'> View MUNI Transit System Maps</a></td></tr></table>"
		
				
		//Street Sweeping
		theSFFindServicesHtml +="<a name='StreetSweeping'></a>"
		theNum=0
		temptheSFFindServicesHtml=""
		theSFFindServicesHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>STREET SWEEPING SCHEDULE FOR NEARBY STREETS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Street Sweeping MultiBuffer") {
				var lowRange=""
				var highRange=""
				var sweepRange=""
				var theLeftSide=""
				var theRightSide
				if (in_array(result.feature.attributes["cnn"],theOpenSpacetemp)) {
				} else {
					theOpenSpacetemp.push(result.feature.attributes["cnn"])
					theNum=theNum+1
					if (result.feature.attributes["lf_fadd"] < result.feature.attributes["rt_fadd"]) {
						lowRange = result.feature.attributes["lf_fadd"] 
					} else {
						lowRange = result.feature.attributes["rt_fadd"] 
					}
					if (result.feature.attributes["lf_toadd"] < result.feature.attributes["rt_toadd"]) {
						highRange = result.feature.attributes["lf_toadd"] 
					} else {
						highRange = result.feature.attributes["rt_toadd"] 
					}
					if (lowRange==highRange) {
						sweepRange = lowRange + " "
					} else {
						sweepRange = lowRange + "-" + highRange + " "
					}
					theLeftSide = result.feature.attributes["leftreduce"]
					theRightSide = result.feature.attributes["rightreduce"]
					if (theNum==1) {
						temptheSFFindServicesHtml +="<table cellpadding=5px><tr><td style='width:5px;'></td><td style='width:120px;'><b>Street</b></td><td><b>" +theLeftSide +" Side Sweeping Schedule</b></td><td><b>" + theRightSide + " Side Sweeping Schedule</b></td><td><b>Distance</b></td></tr>"
					}
					temptheSFFindServicesHtml +="<tr><td></td><td style='width:150px;'>"+ sweepRange + result.feature.attributes["street"] + " " +result.feature.attributes["st_type"] +"</td><td>"+ result.feature.attributes["leftside"] + "</td><td>"+result.feature.attributes["rightside"] + "</td><td>"+result.feature.attributes["BUFF_DIST"] +"ft</td></tr>"
				}
			}
		}
		if (theNum>0) {
			temptheSFFindServicesHtml += "</table>"
		}
		if (theNum>7) {
			theSFFindServicesHtml+="<div id='limitSweepHTML' style='height:200px;overflow:hidden'>" + temptheSFFindServicesHtml + "</div>"
			theSFFindServicesHtml+="<div id='limitSweepMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitSweepHTML\",\"limitSweepMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindServicesHtml += temptheSFFindServicesHtml
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
		//go through the results array and look for the Zip Codes that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual supervisor districts
		theSFFindServicesHtml +="<a name='ZipCodes'></a>"
		if (isLayerVisible("Zip Codes")) {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZIP CODES: </span><input class='NoPrint' onclick='showHideMap( " + '"Zip Codes"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zip Codes' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindServicesHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZIP CODES: </span><input class='NoPrint' onclick='showHideMap( " + '"Zip Codes"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zip Codes' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Zip Codes") {
				if (result.feature.attributes["zip_code"] != null) {
					theNum = theNum + 1
					theSFFindServicesHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>" + result.feature.attributes["zip_code"]  + "</td></tr></table>"
				}
			}
		}
		if (theNum==0) {
			theSFFindServicesHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
	}
	//Add some empty space so that can jump cleanly to bookmarks near the bottom of the tab
	theSFFindServicesHtml += "<div class='Noprint'><table style='height: 50px;'><tr><td></td></tr></table></div>"
	
	theSFFindServicesHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#ServiceTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	theSFFindServicesHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	//clean out 'null's and 'undefined's
	theSFFindServicesHtml = theSFFindServicesHtml.replace(/Null/gi,"&nbsp");
	theSFFindServicesHtml = theSFFindServicesHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theSFFindServicesHtml = theSFFindServicesHtml + "<p class='NoPrint'><br></p>"
	//publish the HTML to the page
	document.getElementById('ZoningReport').innerHTML = theSFFindServicesHtml
	if (gup("layer")=="Street Sweeping") {
		window.location="#StreetSweeping";
	}
	theBM=gup("bookmark").toUpperCase()
	switch(theBM) {
		case "ADDRESSES":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#Addresses')
			break;
		case "ASSESSORSREPORT":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#AssessorsReport')
			break;
		case "FIRESTATIONS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#FireStations')
			break;
		case "LIBRARIES":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#Libraries')
			break;
		case "NEIGHBORHOODS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#Neighborhoods')
			break;
		case "OFFSTREETPARKING":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#OffStreetParking')
			break;
		case "PARCELS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#Parcels')
			break;
		case "OPENSPACES":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#OpenSpaces')
			break;
		case "POLICESTATIONS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#PoliceStations')
			break;
		case "POSTOFFICES":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#PostOffices')
			break;
		case "PUBLICSCHOOLS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#PublicSchools')
			break;
		case "PUBLICTRANSIT":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#PublicTransit')
			break;
		case "STREETSWEEPING":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#StreetSweeping')
			break;
		case "ZIPCODES":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#ZipCodes')
			break;
		default:
			break;
	}
	

}

function updateSFFindInfoHtml() {
	theNum = 0
	var temptheSFFindInfoHtml=""
	theNum=0
	theSFFindInfoHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Other information for this area.</td></tr></table>"
	theSFFindInfoHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theSFFindInfoHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#CensusTracts'>Census Tracts</a></td></tr></table>"
	theSFFindInfoHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#CommunityBoards'>Conflict Resolution Services</a></td></tr></table>"
	theSFFindInfoHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#Crime'>Crime</a></td></tr></table></div>"
	//theSFFindInfoHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#Groups'>Groups</a></td></tr></table>"
	theSFFindInfoHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BusinessSupport'>Small Business Support</a></td></tr></table>"
	
	
	if (isNeighborhood ||isDistrict) {
		//go through the results array and look for the CENSUS TRACTS that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual police districts
		//Get the centerpoint of the map for the link to the NYTime Census App
		MinY = map.extent.ymin 
		MaxY = map.extent.ymax
		MinX = map.extent.xmin 
		MaxX = map.extent.xmax
		centerY = ((MaxY-MinY)/2 )+ MinY
		centerX= ((MaxX-MinX)/2) + MinX
		var source = new Proj4js.Proj("EPSG:102113");    //source coordinates will be in Longitude/Latitude
		var dest = new Proj4js.Proj("WGS84");
		var p = new Proj4js.Point(centerX,centerY);   
		Proj4js.transform(source, dest, p); 
		theSFFindInfoHtml +="<a name='CensusTracts'></a>"
		if (isLayerVisible("Census Tracts")) {
			theSFFindInfoHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CENSUS TRACTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Census Tracts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Census Tracts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindInfoHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CENSUS TRACTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Census Tracts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Census Tracts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		thetempSFFindInfoHtml=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (dynamicMap2.layerInfos[result.layerId].name == "Census Tracts") {
			
				if (result.feature.attributes["TRACTCE10"] != null) {
					theNum = theNum + 1
					theLink = "http://projects.nytimes.com/census/2010/map?view=PopChangeView&l=14&lat="+p.y+"&lng=" + p.x
					thetempSFFindInfoHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>2010 Census Tract <a target='_blank' href='"+theLink +"'>" +result.feature.attributes["TRACTCE10"]+"</a></td></tr></table>"
				}
			}
		}

		if (theNum>7) {
				theSFFindInfoHtml+="<div id='limitCensusHTML' style='height:200px;overflow:hidden'>" + thetempSFFindInfoHtml + "</div>"
				theSFFindInfoHtml+="<div id='limitCensusMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitCensusHTML\",\"limitCensusMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindInfoHtml += thetempSFFindInfoHtml
		}
		if (theNum==0) {
			theSFFindInfoHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		theSFFindInfoHtml +="<a name='CommunityBoards'></a>"
		theSFFindInfoHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>CONFLICT RESOLUTION SERVICES: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td id='crimeLink'><a target='_blank' href='http://communityboards.org/'>Community Boards - Building Community Through Conflict Resolution</a></td></tr></table>"
		
		
		
		theSFFindInfoHtml +="<a name='Crime'></a>"
		theSFFindInfoHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>CRIME: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td id='communityBoard'><a target='_blank' href='http://www.crimemapping.com/map.aspx?ll=" + centerX+","+ centerY+ "&z=16&mc=world-street'>View Recent Crimes Nearby</a></td></tr></table>"
		
		
		//theSFFindInfoHtml +="<a name='Groups'></a>"
		//theSFFindInfoHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>GROUPS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		//theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td>Find Neighborhood groups and merchant associations: <a target='_blank' href='http://www.citidex.sfgov.org'>Citidex</a></td></tr></table>"
		
		theSFFindInfoHtml +="<a name='BusinessSupport'></a>"
		theSFFindInfoHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>SMALL BUSINESS SUPPORT: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td>Small Business support for Permits and Licenses: <a target='_blank' href='http://sf.license123.com'>sf.license123.com</a></td></tr></table>"
		
		
	} else {
		//go through the results array and look for the CENSUS TRACTS that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual police districts
		//Get the centerpoint of the map for the link to the NYTime Census App
		
		MinY = map.extent.ymin 
		MaxY = map.extent.ymax
		MinX = map.extent.xmin 
		MaxX = map.extent.xmax
		centerY = ((MaxY-MinY)/2 )+ MinY
		centerX= ((MaxX-MinX)/2) + MinX
		var source = new Proj4js.Proj("EPSG:102113");    //source coordinates will be in Longitude/Latitude
		var dest = new Proj4js.Proj("WGS84");
		var p = new Proj4js.Point(centerX,centerY);   
		Proj4js.transform(source, dest, p); 
		if (isLayerVisible("Census Tracts")) {
			theSFFindInfoHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CENSUS TRACTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Census Tracts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Census Tracts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindInfoHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CENSUS TRACTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Census Tracts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Census Tracts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		thetempSFFindInfoHtml=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Census Tracts") {
			
				if (result.feature.attributes["TRACTCE10"] != null) {
					theNum = theNum + 1
					theLink = "http://projects.nytimes.com/census/2010/map?view=PopChangeView&l=14&lat="+p.y+"&lng=" + p.x
					thetempSFFindInfoHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>2010 Census Tract <a target='_blank' href='"+theLink +"'>" +result.feature.attributes["TRACTCE10"]+"</a></td></tr></table>"
				}
			}
		}

		if (theNum>7) {
				theSFFindInfoHtml+="<div id='limitCensusHTML' style='height:200px;overflow:hidden'>" + thetempSFFindInfoHtml + "</div>"
				theSFFindInfoHtml+="<div id='limitCensusMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitCensusHTML\",\"limitCensusMore\",\"200px\");'>more...</a></td></tr></table></div>"
		} else {
			theSFFindInfoHtml += thetempSFFindInfoHtml
		}
		if (theNum==0) {
			theSFFindInfoHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		theSFFindInfoHtml +="<a name='CommunityBoards'></a>"
		theSFFindInfoHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>CONFLICT RESOLUTION SERVICES: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td id='crimeLink'><a target='_blank' href='http://communityboards.org/'>Community Boards - Building Community Through Conflict Resolution</a></td></tr></table>"
		
		
		theNum=0
		
		//Link to the Crime Map for this location.  
		theSFFindInfoHtml +="<a name='Crime'></a>"
		theSFFindInfoHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>CRIME: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		thetempAddress=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];	
			if (result.layerName == "MAD_Parcel") {
				if (result.feature.attributes["ADDRESS"] != null) {
					thetempAddress = result.feature.attributes["ADDRESSSIMPLE"]
					break;
				}
			}
		}
		if (thetempAddress=="") {
			theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td id='crimeLink'><a target='_blank' href='http://www.crimemapping.com/map.aspx?ll=" + centerX+","+ centerY+ "&z=16&mc=world-street'>View Recent Crimes Nearby</a></td></tr></table>"
		} else {
			theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://www.crimemapping.com/Map/Find/" + thetempAddress + ", San Francisco, CA'>Recent Crimes Reported Nearby</a></td></tr></table>"
		}

		//theSFFindInfoHtml +="<a name='Groups'></a>"
		//theSFFindInfoHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>GROUPS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		//theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td>Find Neighborhood groups and merchant associations: <a target='_blank' href='http://www.citidex.sfgov.org'>Citidex</a></td></tr></table>"
		
		theSFFindInfoHtml +="<a name='BusinessSupport'></a>"
		theSFFindInfoHtml += "<br><br><table class='reportData' cellspacing=2 width='100%'><tr><td align='left'><span class='reportSectionHead'>SMALL BUSINESS SUPPORT: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		theSFFindInfoHtml +="<table class='reportData'><tr><td style='width:15px'></td><td>Small Business support for Permits and Licenses: <a target='_blank' href='http://sf.license123.com'>sf.license123.com</a></td></tr></table>"
		
		
	}
	//Add some empty space so that can jump cleanly to bookmarks near the bottom of the tab
	theSFFindInfoHtml += "<div class='Noprint'><table style='height: 50px;'><tr><td></td></tr></table></div>"
	theSFFindInfoHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#OtherInfoTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	//theSFFindInfoHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='#OtherInfoTop'>back to top </a></td><td></td></tr></table></div>"
	theSFFindInfoHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	//clean out 'null's and 'undefined's
	theSFFindInfoHtml = theSFFindInfoHtml.replace(/Null/gi,"&nbsp");
	theSFFindInfoHtml = theSFFindInfoHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theSFFindInfoHtml = theSFFindInfoHtml + "<p class='NoPrint'><br></p>"
	//publish the HTML to the page
	//document.getElementById('CaseTrackingReport').innerHTML = theSFFindInfoHtml
	document.getElementById('SurveyRatingsReport').innerHTML = theSFFindInfoHtml
	
	
	theBM=gup("bookmark").toUpperCase()
	switch(theBM) {
		case "CENSUSTRACTS":
			showTab('dhtmlgoodies_tabView1',"2");
			jumpToBookmark('#CensusTracts')
			break;
		case "CRIME":
			showTab('dhtmlgoodies_tabView1',"2");
			jumpToBookmark('#Crime')
			break;
		case "GROUPS":
			showTab('dhtmlgoodies_tabView1',"2");
			jumpToBookmark('#Groups')
			break;
		case "BUSINESSSUPPORT":
			showTab('dhtmlgoodies_tabView1',"2");
			jumpToBookmark('#BusinessSupport')
			break;
		default:
			break;
	}
}


function updateSFFindElectedHtml() {
//go through the results array and look for the Assessors records that were found at the location.  Add these to the property report HTML.  
	theNum = 0
	var temptheSFFindElectedHtml=""
	theNum=0
	theSFFindElectedHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Elected Officials representing this area.  In addition to the data below please visit the <a target='_blank'  href='http://www.sfgov2.org/index.aspx?page=599'>Department of Elections</a> website for election related information.</td></tr></table>"
	theSFFindElectedHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theSFFindElectedHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#SupervisorDistrict'>Supervisor Districts</a></td></tr></table>"
	theSFFindElectedHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BARTDistrict'>BART Districts</a></td></tr></table>"
	theSFFindElectedHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#CongressionalDistrict'>Congressional Districts</a></td></tr></table>"
	theSFFindElectedHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#StateAssemblyDistrict'>State Assembly Districts</a></td></tr></table>"
	theSFFindElectedHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#StateSenatorialDistrict'>State Senatorial Districts</a></td></tr></table>"
	theSFFindElectedHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#ElectionPrecinct'>Election Precincts</a></td></tr></table></div>"

	if (isNeighborhood ||isDistrict) {
		
			theSFFindElectedHtml +="<a name='SupervisorDistrict'></a>"
			if (isLayerVisible("Supervisor Districts")) {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SUPERVISOR DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Supervisor Districts 2012"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Supervisor Districts 2012' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SUPERVISOR DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Supervisor Districts 2012"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Supervisor Districts 2012' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum=0
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (dynamicMap2.layerInfos[result.layerId].name == "Supervisor Districts 2012") {
					if (result.feature.attributes["supervisor"] != null) {
						theNum = theNum + 1
						theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>District " + result.feature.attributes["supervisor"] + " (" + result.feature.attributes["supname"] + ") </a></td></tr></table>"
					}
				}
			}
			//Add BART Districrs
			theSFFindElectedHtml +="<a name='BARTDistrict'></a>"
			if (isLayerVisible("BART Districts")) {
				theSFFindElectedHtml +=  "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BART DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"BART Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='BART Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BART DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"BART Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='BART Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum=0
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (dynamicMap2.layerInfos[result.layerId].name == "BART Districts") {
					if (result.feature.attributes["bartdist"] != null) {
						theNum = theNum + 1
						theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>" + result.feature.attributes["bartdist"] + " </a></td></tr></table>"
					}
				}
			}
			//Add Congressional Districts
			theSFFindElectedHtml +="<a name='CongressionalDistrict'></a>"
			if (isLayerVisible("Congress Districts")) {
				theSFFindElectedHtml +=  "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CONGRESSIONAL DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Congress Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Congress Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CONGRESSIONAL DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Congress Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Congress Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum=0
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (dynamicMap2.layerInfos[result.layerId].name == "Congress Districts") {
					if (result.feature.attributes["congdist"] != null) {
						theNum = theNum + 1
						theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>" + result.feature.attributes["congdist"] + " </a></td></tr></table>"
					}
				}
			}
			
			//Add State Assembly Districts
			theSFFindElectedHtml +="<a name='StateAssemblyDistrict'></a>"
			if (isLayerVisible("State Assembly Districts")) {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STATE ASSEMBLY DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"State Assembly Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='State Assembly Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STATE ASSEMBLY DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"State Assembly Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='State Assembly Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum=0
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (dynamicMap2.layerInfos[result.layerId].name == "State Assembly Districts") {
					if (result.feature.attributes["caassmd"] != null) {
						theNum = theNum + 1
						theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>" + result.feature.attributes["caassmd"] + " </a></td></tr></table>"
					}
				}
			}
			
			//Add State Senate Districts
			theSFFindElectedHtml +="<a name='StateSenatorialDistrict'></a>"
			if (isLayerVisible("State Senate Districts")) {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STATE SENATORIAL DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"State Senate Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='State Senate Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STATE SENATORIAL DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"State Senate Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='State Senate Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum=0
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (dynamicMap2.layerInfos[result.layerId].name == "State Senate Districts") {
					if (result.feature.attributes["casen"] != null) {
						theNum = theNum + 1
						theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>" + result.feature.attributes["casen"] + " </a></td></tr></table>"
					}
				}
			}
			
			//Add Election Precincts
			theSFFindElectedHtml +="<a name='ElectionPrecinct'></a>"
			if (isLayerVisible("Election Precincts")) {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ELECTION PRECINCT: </span><input class='NoPrint' onclick='showHideMap( " + '"Election Precincts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Election Precincts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ELECTION PRECINCT: </span><input class='NoPrint' onclick='showHideMap( " + '"Election Precincts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Election Precincts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum=0
			temptheSFFindElectedHtml=""
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (dynamicMap2.layerInfos[result.layerId].name == "Election Precincts") {
					if (result.feature.attributes["PRECNAME"] != null) {
						theNum = theNum + 1
						temptheSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>Precinct "+result.feature.attributes["PRECNAME"]+"</td></tr></table>"
					}
				}
			}

			if (theNum>7) {
				theSFFindElectedHtml+="<div id='limitElectedHTML' style='height:200px;overflow:hidden'>" + temptheSFFindElectedHtml + "</div>"
				theSFFindElectedHtml+="<div id='limitElectedMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitElectedHTML\",\"limitElectedMore\",\"200px\");'>more...</a></td></tr></table></div>"
			} else {
				theSFFindElectedHtml += temptheSFFindElectedHtml
			}
			if (theNum==0) {
				theSFFindElectedHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
			}
			
	
	} else {
		
		theSFFindElectedHtml +="<a name='SupervisorDistrict'></a>"
		//go through the results array and look for the supervisor districts that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual supervisor districts
		if (isLayerVisible("Supervisor Districts")) {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SUPERVISOR DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Supervisor Districts 2012"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Supervisor Districts 2012' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SUPERVISOR DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Supervisor Districts 2012"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Supervisor Districts 2012' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Supervisor Districts 2012") {
				if (result.feature.attributes["supervisor"] != null) {
					theNum = theNum + 1
					theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>District " + result.feature.attributes["supervisor"] + " (" + result.feature.attributes["supname"] + ") </a></td></tr></table>"
				}
			}
		}
		//Add BART Districrs
		theSFFindElectedHtml +="<a name='BARTDistrict'></a>"
		if (isLayerVisible("BART Districts")) {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BART DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"BART Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='BART Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BART DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"BART Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='BART Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "BART Districts") {
				if (result.feature.attributes["bartdist"] != null) {
					theNum = theNum + 1
					theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>" + result.feature.attributes["bartdist"] + " </a></td></tr></table>"
				}
			}
		}
		
		//Add Congressional Districts
		theSFFindElectedHtml +="<a name='CongressionalDistrict'></a>"
		if (isLayerVisible("Congress Districts")) {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CONGRESSIONAL DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Congress Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Congress Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CONGRESSIONAL DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Congress Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Congress Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Congress Districts") {
				if (result.feature.attributes["congdist"] != null) {
					theNum = theNum + 1
					theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>" + result.feature.attributes["congdist"] + " </a></td></tr></table>"
				}
			}
		}
		
		//Add State Assembly Districts
		theSFFindElectedHtml +="<a name='StateAssemblyDistrict'></a>"
		if (isLayerVisible("State Assembly Districts")) {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STATE ASSEMBLY DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"State Assembly Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='State Assembly Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STATE ASSEMBLY DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"State Assembly Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='State Assembly Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "State Assembly Districts") {
				if (result.feature.attributes["caassmd"] != null) {
					theNum = theNum + 1
					theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>" + result.feature.attributes["caassmd"] + " </a></td></tr></table>"
				}
			}
		}
		
		//Add State Senate Districts
		theSFFindElectedHtml +="<a name='StateSenatorialDistrict'></a>"
		if (isLayerVisible("State Senate Districts")) {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STATE SENATORIAL DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"State Senate Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='State Senate Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STATE SENATORIAL DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"State Senate Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='State Senate Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "State Senate Districts") {
				if (result.feature.attributes["casen"] != null) {
					theNum = theNum + 1
					theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>" + result.feature.attributes["casen"] + " </a></td></tr></table>"
				}
			}
		}
		
		//Add Election Precincts
		theSFFindElectedHtml +="<a name='ElectionPrecinct'></a>"
		if (isLayerVisible("Election Precincts")) {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ELECTION PRECINCT: </span><input class='NoPrint' onclick='showHideMap( " + '"Election Precincts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Election Precincts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theSFFindElectedHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ELECTION PRECINCT: </span><input class='NoPrint' onclick='showHideMap( " + '"Election Precincts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Election Precincts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Election Precincts") {
				if (result.feature.attributes["PRECNAME"] != null) {
					theNum = theNum + 1
					theSFFindElectedHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>Precinct "+result.feature.attributes["PRECNAME"]+"</td></tr></table>"
				}
			}
		}	
		//theSFFindElectedHtml +="<table class='reportData' ><tr height='5px'><td></td><td></td></tr><tr><td style='width:15px'></td><td>Visit the <a target='_blank'  href='http://www.sfgov2.org/index.aspx?page=599'>Department of Elections Website</a></td></tr></table>"
		
	}
	theSFFindElectedHtml += "<div class='Noprint'><table style='height: 50px;'><tr><td></td></tr></table></div>"
	theSFFindElectedHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#ElectedTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	//theSFFindElectedHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='#ElectedTop'>back to top </a></td><td></td></tr></table></div>"	
	theSFFindElectedHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	//clean out 'null's and 'undefined's
	theSFFindElectedHtml = theSFFindElectedHtml.replace(/Null/gi,"&nbsp");
	theSFFindElectedHtml = theSFFindElectedHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theSFFindElectedHtml = theSFFindElectedHtml + "<p class='NoPrint'><br></p>"
			
	//publish the HTML to the page
	document.getElementById('AssessorReport').innerHTML = theSFFindElectedHtml
	theBM=gup("bookmark").toUpperCase()
	switch(theBM) {
		case "SUPERVISORDISTRICT":
			jumpToBookmark('#SupervisorDistrict')
			break;
		case "BARTDISTRICT":
			jumpToBookmark('#BARTDistrict')
			break;
		case "CONGRESSIONALDISTRICT":
			jumpToBookmark('#CongressionalDistrict')
			break;
		case "STATEASSEMBLYDISTRICT":
			jumpToBookmark('#StateAssemblyDistrict')
			break;
		case "STATESENATORIALDISTRICT":
			jumpToBookmark('#StateSenatorialDistrict')
			break;
		case "ELECTIONPRECINCT":
			jumpToBookmark('#ElectionPrecinct')
			break;
		default:
			break;
	}
	
}

function in_array(needle, haystack){     
	var found = 0;     
	for (var i=0, len=haystack.length;i<len;i++) {         
		if (haystack[i] == needle) return true;             
			found++;     
	}     
	return false; 
}


function updatePreservationHtml() {
	
// Now start the Preservation Report HTML
	theSurveyRatingsHtml = printLink + "<div><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Historic Preservation Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div>"
	//UNCOMMENT TO ADD BACK IN THE PRINT PLANNING REPORT SECTION
	tmpLink = "Printable Version of Reports</a><br><a class='NoPrint'  href='javascript: printPlanningReportPreservation();'>Print Preservation Report</a></div>"
	if ((theLoc=="City") && (dept=="PLANNING") ) {
		theSurveyRatingsHtml = theSurveyRatingsHtml.replace("Printable Version of Reports</a></div>",tmpLink )
	}

	theSurveyRatingsHtml += "<table class='NoPrint'><tr><td style='padding-left:15px;'><a target='_blank' href='MapHelp.html#PreservationGlossary'>Glossary </a></td></tr></table><br>"
	theSurveyRatingsHtml += "<table border=0>"	
	theSurveyRatingsHtml += "<div class='NoPrint'><br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td align='left'>Historic preservation surveys and evaluations. The Historic Resource status shown on this page is tentative, to confirm the status of your property please speak to a Preservation Technical Specialist.  Tel: 415-558-6377; Email: <a href='mailto:pic@sfgov.org'> pic@sfgov.org</a></td></tr></table><br><br></div>"
	//go through the results array and look for the Article 10 districts and landmarks that were found at the location.  Add these to the preservation report HTML.  
	
	if (isLayerVisible("Historic 2011 v2")) {
		theSurveyRatingsHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>HISTORIC EVALUATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Historic 2011 v2"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Historic 2011 v2' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theSurveyRatingsHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>HISTORIC EVALUATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Historic 2011 v2"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Historic 2011 v2' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum=0
	themapblklotnum=0
	var theHistArray = new Array();
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Historic Database") {
			theNum=theNum+1
			themapblklotnum=themapblklotnum+1
			if ((result.feature.attributes["HISTNO"] != "Null") && (result.feature.attributes["LOSTNO"] != result.feature.attributes["HISTNO"] )) {
					theAddress = result.feature.attributes["LOSTNO"] + " - " + result.feature.attributes["HISTNO"] + " " + result.feature.attributes["STREETNAME"] +" " + result.feature.attributes["STTYPE"] 
				} else {
					theAddress = result.feature.attributes["LOSTNO"] + " " + result.feature.attributes["STREETNAME"] +" " + result.feature.attributes["STTYPE"] 
			}
			
			if (theAddress=='0 Null Null'){
				theAddress = ''
			}
			theHistArray[theHistArray.length] = new Array(2);
			theHistArray[theHistArray.length-1][0]=result.feature.attributes["MAPBLKLOT"] 
			
			if (result.feature.attributes["LMNO"]=='Null' && result.feature.attributes["EXISTDIST"]=='Null' && result.feature.attributes["DWTNRATING"]=='Null' && result.feature.attributes["DISTRATING"]=='Null' && result.feature.attributes["DWTNCONSERVDIST"]=='Null' && result.feature.attributes["NATLREGISTER"]=='Null' && result.feature.attributes["CALIFREGISTER"]=='Null') {
				theHistArray[theHistArray.length-1][1]="Survey Rating"
			} else {
				theHistArray[theHistArray.length-1][1]="Historic Database"
			}
			//alert(theHistArray[0][1])
			theHistRes=""
			switch (result.feature.attributes["CEQACATEGORY"]) {
				case 'A':
					theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>A - Historic Resource Present</a>"
					break;
				case 'B':
					theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>B - Potential Historic Resource</a>"
					break;
				case 'C':
					theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>C - Not a Historic Resource</a>"
					break;
				default:
					var myDate = new Date();
					var yrsAgo50 = myDate.getFullYear() - 45  //changed from 50 to 48 years on request of Preservation team, then in Feb 2014 changed to 45 to avoid permits not being sent to them for borderline properties.
					var theYearBuiltForPres=""
					for (var x = 0; x < idResults.length; x++) {
						var resultHistTemp = idResults[x];
						if ( resultHistTemp.layerName == "Assessor")  {
							if ((theYearBuiltForPres=="" || theYearBuiltForPres>resultHistTemp.feature.attributes["YRBUILT"]) && resultHistTemp.feature.attributes["YRBUILT"] != '0') {
								theYearBuiltForPres = resultHistTemp.feature.attributes["YRBUILT"] 
								
							}
						}
					}
					
					if (theYearBuiltForPres != 'Null' && theYearBuiltForPres != '0' && theYearBuiltForPres > yrsAgo50) {
						//alert("young")
						theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>C - Not a Historic Resource</a>"
					} else {
						//alert("old or don't know")
						theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>B - Potential Historic Resource</a>"
					}
					break;
			}
			
			theSurveyRatingsHtml += "<table  class='reportData' style='text-align:left; width:100%; border-bottom: solid; border-width: 0px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:275px'>Parcel: </td><td>" + result.feature.attributes["MAPBLKLOT"] + "</td></tr><tr><td style='width:15px'></td><td style='width:275px'>Building Name: </td><td>" + result.feature.attributes["LMORBLDGNAME"] + "</td></tr><tr><td></td><td>Address: </td><td>" + theAddress+ "</td></tr><tr><td></td><td>Planning Dept. Historic Resource Status: </td><td id='deptstat'>" + theHistRes +  "</td></tr><tr><td></td><td>California Register:</td><td>" + result.feature.attributes["CALIFREGISTER"] +"</td></tr><tr><td></td><td>National Register:</td><td>" + result.feature.attributes["NATLREGISTER"] + " </td></tr></table>"
			
		}	
	}
	
	if (theNum==0) {
		var myDate = new Date();
		var yrsAgo50 = myDate.getFullYear() - 45  //changed from 50 to 48 years on request of Preservation team, then in Feb 2014 changed to 45 to avoid permits not being sent to them for borderline properties.
		var theYearBuiltForPres=""
		for (var x = 0; x < idResults.length; x++) {
			var resultHistTemp = idResults[x];
			if ( resultHistTemp.layerName == "Assessor")  {
				if ((theYearBuiltForPres=="" || theYearBuiltForPres>resultHistTemp.feature.attributes["YRBUILT"]) && resultHistTemp.feature.attributes["YRBUILT"] != '0') {
					theYearBuiltForPres = resultHistTemp.feature.attributes["YRBUILT"] 
					//alert(theYearBuiltForPres)
				}
			}
		}
					
		if (theYearBuiltForPres != 'Null' && theYearBuiltForPres != '0' && theYearBuiltForPres > yrsAgo50) {
			//alert("young")
			theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>C - Not a Historic Resource</a>"
		} else {
			//alert("old or don't know")
			theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>B - Potential Historic Resource</a>"
		}
		
		theSurveyRatingsHtml +=  "<table class='reportData'><tr><td style='width:15px'></td><td>Planning Dept. Historic Resource Status:</td><td>" + theHistRes +"</td></tr></table>"
		
		//theSurveyRatingsHtml += "<table  class='reportData' style='text-align:left; width:100%; border-bottom: solid; border-width: 0px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:275px'>Parcel: </td><td>" + result.feature.attributes["MAPBLKLOT"] + "</td></tr><tr><td style='width:15px'></td><td style='width:275px'>Building Name: </td><td>" + result.feature.attributes["LMORBLDGNAME"] + "</td></tr><tr><td></td><td>Address: </td><td>" + theAddress+ "</td></tr><tr><td></td><td>Planning Dept. Historic Resource Status: </td><td id='deptstat'>" + theHistRes +  "</td></tr><tr><td></td><td>California Register:</td><td>" + result.feature.attributes["CALIFREGISTER"] +"</td></tr><tr><td></td><td>National Register:</td><td>" + result.feature.attributes["NATLREGISTER"] + " </td></tr></table>"
			
		
		
		//theHistRes="B - Potential Historic Resource"
	}
	
	theLM = ""
	theNum=0
	theLMtmp=""
	theDistEx=""
	var anyHistoric=0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Landmarks") {
			if (result.feature.attributes["LMNO"] != "Null" && result.feature.attributes["LMNO"] != "0") {
				theNum=theNum+1
				if (theLMtmp != result.feature.attributes["LMNO"]) {
					theLM = theLM + "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Landmark Number:</td><td><a href='http://" + theServerName + "/docs/landmarks_and_districts/LM" + result.feature.attributes["LMNO"]  + ".pdf' target='_blank'>" + result.feature.attributes["LMNO"] + "</a></td></tr></table>"
				}
				theLMtmp = result.feature.attributes["LMNO"] 
				anyHistoric=anyHistoric+1
			}
					
			if (result.feature.attributes["DISTEXPLANATION"] != "Null" && result.feature.attributes["DISTEXPLANATION"] != "" && result.feature.attributes["DISTEXPLANATION"] != " " && result.feature.attributes["DISTEXPLANATION"] != null && result.feature.attributes["DISTEXPLANATION"] !=theDistEx) {
				theNum=theNum+1
				theLM = theLM + "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Article 10 Rating:</td><td>" + result.feature.attributes["DISTEXPLANATION"]  + "</td></tr></table>"						
				anyHistoric=anyHistoric+1
			}
			theDistEx = result.feature.attributes["DISTEXPLANATION"] 	
		}
	}
	if (isLayerVisible("Article 10")) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ARTICLE 10 DESIGNATED HISTORIC DISTRICTS AND LANDMARKS: </span><input class='NoPrint' onclick='showHideMap( " + '"Article 10"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Article 10' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ARTICLE 10 DESIGNATED HISTORIC DISTRICTS AND LANDMARKS: </span><input class='NoPrint' onclick='showHideMap( " + '"Article 10"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Article 10' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theA10tmp=""
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "A10 Historic Districts") {
			if (result.feature.attributes["Article 10"] != null) {
				theNum=theNum+1
				if (theA10tmp !=result.feature.attributes["Article 10"]) {
					theNum = theNum + 1
					anyHistoric=anyHistoric+1
					theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td  style='width:275px'>Landmark District:</td><td><a target='_blank' href='" + result.feature.attributes["URL"]  +"'>"+ result.feature.attributes["Article 10"] +"</a> - <a class='NoPrint' target='_blank' href='http://" + theServerName + "/docs/landmarks_and_districts/article 10 appendix " + result.feature.attributes["APPENDIX"] + ".pdf'>View Case Report and Ordinance</a></td></tr></table>"
				}
				theA10tmp = result.feature.attributes["Article 10"]
			}
		}
	}
	if (theNum==0) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	theSurveyRatingsHtml = theSurveyRatingsHtml + theLM
			
			

	//go through the results array and look for the Article 11 records that were found at the location.  Add these to the preservation report HTML.  
	if (isLayerVisible("Article 11 Conservation Districts")) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ARTICLE 11 PRESERVATION DESIGNATION:/span><input class='NoPrint' onclick='showHideMap( " + '"Article 11' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Article 11' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ARTICLE 11 PRESERVATION DESIGNATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Article 11"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Article 11' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	theArt11=""
	theArt11tmp=""
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Article 11 Rating") {
			if (result.feature.attributes["DWTNRATING"] != "Null" && result.feature.attributes["DWTNRATING"] != null) {
				theNum=theNum+1
				
				if (theArt11tmp != result.feature.attributes["DWTNRATING"] ) {
					theArt11 = theArt11 + "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Article 11 Category:</td><td><a target='_blank' href='http://www.amlegal.com/nxt/gateway.dll/California/planning/article11preservationofbuildingsanddistr?f=templates$fn=default.htm$3.0$vid=amlegal:sanfrancisco_ca$anc=JD_1102.1'>" +  result.feature.attributes["DWTNRATING"]  + " - "+ result.feature.attributes["EXPLANATION"] + "</a></td></tr></table>"
					theNum=theNum+1
					anyHistoric=anyHistoric+1
				}
				theArt11tmp = result.feature.attributes["DWTNRATING"] 
			}
		}
	}
	theConservtmp=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Article 11 Conservation Districts") {
			if (result.feature.attributes["Article 11"] != null) {
				if (theConservtmp!=result.feature.attributes["Article 11"] ) {
					theNum = theNum + 1
					theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Conservation District:</td><td><a target='_blank' href='" + result.feature.attributes["URL"]  +"'>" + result.feature.attributes["Article 11"] +"</a></td></tr></table>"
					theConservtmp=result.feature.attributes["Article 11"]
					anyHistoric=anyHistoric+1
				}
			}
		}
	}
	if (theNum==0) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	theSurveyRatingsHtml = theSurveyRatingsHtml + theArt11
	if (isLayerVisible("National Register Historic Districts")) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NATIONAL REGISTER HISTORIC DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"National Register Historic Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='National Register Historic Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NATIONAL REGISTER HISTORIC DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"National Register Historic Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='National Register Historic Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
			
			
	theNatRegHistDisttmp=""
	theNum=0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "National Register Historic Districts") {
			if (result.feature.attributes["NAME"] != null) {
				if (theNatRegHistDisttmp!=result.feature.attributes["NAME"] ) {
					theNum = theNum + 1
					anyHistoric=anyHistoric+1
					theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Historic District:</td><td>" + result.feature.attributes["NAME"] +"</td></tr></table>"
					theNatRegHistDisttmp=result.feature.attributes["NAME"]
				}
			}
		}
	}
	if (theNum==0) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	
	if (isLayerVisible("California Register Districts")) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CALIFORNIA REGISTER HISTORIC DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"California Register Historic Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='California Register Historic Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CALIFORNIA REGISTER HISTORIC DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"California Register Historic Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='California Register Historic Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
			
	isinCR=false		
	theCalRegHistDisttmp=""
	theNum=0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "California Register Historic Districts") {
			if (result.feature.attributes["Name"] != null) {
				if (theCalRegHistDisttmp!=result.feature.attributes["Name"] ) {
					theNum = theNum + 1
					anyHistoric=anyHistoric+1
					calRegLink = result.feature.attributes["Link"]
					//alert(calRegLink)
					if (calRegLink !='Null') {
						if (calRegLink.toUpperCase().indexOf("HTTP:")>-1){
							calRegLink = "<a target='_blank' href='" + calRegLink + "'>" + result.feature.attributes["Name"]  + "</a>"
						} else {
							calRegLink = "<a target='_blank' href='../docs/CalRegDistricts/" + calRegLink + "'>" + result.feature.attributes["Name"]  + "</a>"
						}
					} else {
						calRegLink=result.feature.attributes["Name"]
					}
					theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Historic District:</td><td>" + calRegLink +"</td></tr></table>"
					theCalRegHistDisttmp=result.feature.attributes["Name"]
					isinCR=true;
				}
			}
		}
	}
	
	if (theNum==0) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	
	

	if (isLayerVisible("Survey Ratings")) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>HISTORIC SURVEYS: </span><input class='NoPrint' onclick='showHideMap( " + '"Survey Ratings"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Survey Ratings' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>HISTORIC SURVEYS: </span><input class='NoPrint' onclick='showHideMap( " + '"Survey Ratings"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Survey Ratings' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum=0
	var theSurveyName=""
	var theLastSurveyDate = new Date("1/1/1900")
	var thetempEvalDate=  new Date("1/1/1900")
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		
		if (result.layerName == "Survey Ratings") {
			theNum=theNum+1
			theHistRes = ""
			if (result.feature.attributes["CEQA_CATEGORY"] =='A') {
				theHistRes = "<a  id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>Historic Resource Present</a>"
			}
			if (result.feature.attributes["CEQA_CATEGORY"] =='B') {
				theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>Potential Historic Resource</a>"
			}
			if (result.feature.attributes["CEQA_CATEGORY"] =='C') {
				theHistRes = "<a id='histreslink' target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>Not a Historic Resource</a>"
			}
			theSurveyName=result.feature.attributes["SURVEY_NAME"] 
			var the1976Form=""
			if (theSurveyName=="DCP 1976 SURVEY") {
				for (var x = 0; x < idResults.length; x++) {
					var tempresult = idResults[x];
					if (tempresult.layerName == "1976 DCP Survey" && tempresult.feature.attributes["FileList"] != null) {
						the1976Form = "<a target='_blank' href='/docs/1976/" + tempresult.feature.attributes["FileList"] +"'>Survey field form </a>"
					}
				}
				theSurveyName = theSurveyName + " " + the1976Form
			}
			theSurveyRatingsHtml += "<table  class='reportData' style='text-align:left; width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
			
			if ((theLoc=="City") && (dept=="PLANNING") ) {
				theSurveyRatingsHtml += "<tr><td style='width:15px'></td><td style='width:275px'>Evaluation ID:* </td><td>" + result.feature.attributes["EVALUATION_ID"]+ "</td></tr>"
			}
			theSurveyRatingsHtml += "<tr><td style='width:15px'></td><td style='width:275px'>Parcel: </td><td>" + result.feature.attributes["MAPBLKLOT"]+ "</td></tr><tr><td></td><td>Survey Name: </td><td>" + theSurveyName+ "</td></tr><tr><td style='width:15px'></td><td style='width:275px'>CEQA Category: </td><td>" + result.feature.attributes["CEQA_CATEGORY"] + " - " + theHistRes +"</td></tr><tr><td></td><td>Evaluation Date: </td><td>" + result.feature.attributes["EVAL_DATE"]+ "</td></tr><tr><td></td><td>Survey Rating: </td><td>" + result.feature.attributes["RATINGS_CODE"]  +  "</td></tr><tr><td></td><td>Rating Description:</td><td>" + result.feature.attributes["RATINGS_NAME"] +" </td></tr></table>"
			
			thetempEvalDate = new Date(result.feature.attributes["EVAL_DATE"])
			if (thetempEvalDate > theLastSurveyDate) {
				theLastSurveyDate = thetempEvalDate
			}
		}	
		
	}
	if (theNum==0) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	var tmpMBL=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Parcel Labels") {
			if (result.feature.attributes["mapblklot"] !=tmpMBL) {
				theURLtmp = 'http://' + theServerName +'/FileSearch/SearchService.asmx/GetLatestPDFinD'
				theParamstmp = "inpath=E:/GIS Data/ParcelInfo/docs/DPRForms&insearchname=" + result.feature.attributes["mapblklot"]  //result.feature.attributes["BLOCK_NUM"].substring(0,4)
				getPDFDoc(theURLtmp,theParamstmp)
				tmpMBL = result.feature.attributes["mapblklot"]
				theDoc=document.getElementById('Doc1').innerHTML
				if (theDoc=="Not Found") {
					//theBlockBooktmp="" //"Assessor's Block Map not available"
				}else {
					theDoc = theDoc.replace("E:/GIS Data/ParcelInfo/docs/DPRForms","" )
					theSurveyRatingsHtml+="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href = 'http://" + theServerName + "/docs/DPRForms" + theDoc + "'>View DPR Survey Form for Parcel " + tmpMBL + "</a></td></tr></table>"
				}
			}
			
		}
	}
	
	
	
	
	//uncomment this to display the survey forms
	//var tmpSurvForm=""
	//for (var x = 0; x < idResults.length; x++) {
	//	var tempresult = idResults[x];
	//	if (tempresult.layerName == "DPR Forms" && tmpSurvForm!=tempresult.feature.attributes["DPRForms_PDF"]) {
	//		var theDPRLink = "http://" + theServerName + "/"+ "docs/DPRForms/" + tempresult.feature.attributes["DPRForms_PDF"]
	//		theSurveyRatingsHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a href='" + theDPRLink + "' target='_blank'>View Survey Form</a> for parcel " + tempresult.feature.attributes["DPRForms_MAPBLKLOT"] + "</td></tr></table>"
	//		tmpSurvForm = tempresult.feature.attributes["DPRForms_PDF"]
	//	}
	//}
	
		
	//go through the results array and look for the SoMa Historic Resource Survey records that were found at the location.  Add these to the preservation report HTML.  
	
	
	for (var z = 0; z < idResults.length; z++) {
		var result = idResults[z];
		if (result.layerName == "SoMa Survey") {
			anyHistoric=anyHistoric+1
			if (isLayerVisible("SoMa Survey")) {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>SOUTH OF MARKET HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"SoMa Survey"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='SoMa Survey' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>SOUTH OF MARKET HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"SoMa Survey"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='SoMa Survey' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Resource Attribute: </td><td>" + result.feature.attributes["Sheet1_bld"] + "</td></tr><tr><td></td><td>"+ "Year Built: </td><td>" + result.feature.attributes["Sheet1_cor"]  + "</td></tr><tr><td></td><td>"+ "Plan Area: </td><td>" + result.feature.attributes["Sheet1__19"] + "</td></tr><tr><td></td><td>"+ "Retention of Historic Architecture: </td><td>" + result.feature.attributes["Retention"] + "</td></tr><tr><td></td><td>"+ "CHRSC: </td><td>" + result.feature.attributes["Sheet1_D_1"] + "</td></tr><tr><td></td><td>Historic District: </td><td>" + result.feature.attributes["Sheet1_Dis"] + "</td></tr><tr><td></td><td>Notes: </td><td>" + result.feature.attributes["Sheet1_c_b"] + "</td></tr>"
			if (result.feature.attributes["Link"].substr(result.feature.attributes["Link"].length-4,result.feature.attributes["Link"].length).toUpperCase() ==".PDF") {
				theSurveyRatingsHtml = theSurveyRatingsHtml +"<tr><td></td><td>Survey Form: </td><td><a target='_blank' href='" + result.feature.attributes["Link"] + "'>Click to view DPR 523A form</a></td></tr>"
			}
			if (result.feature.attributes["Link"].substr(result.feature.attributes["Link"].length-4,result.feature.attributes["Link"].length).toUpperCase()  ==".JPG") {
				theSurveyRatingsHtml = theSurveyRatingsHtml +"<tr><td></td><td>Photo: </td><td><a target='_blank' href='" + result.feature.attributes["Link"] + "'>Click to view photo</a></td></tr>"
			}
			theSurveyRatingsHtml = theSurveyRatingsHtml + "</table>"
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://www.sf-planning.org/index.aspx?page=2530'>View South of Market Historic Resource Survey Website</a></td></tr></table>"
		}
	}
	//go through the results array and look for the Duboce Historic Resource Survey records that were found at the location.  Add these to the preservation report HTML.  
	for (var z = 0; z < idResults.length; z++) {
		var result = idResults[z];
		if (result.layerName == "Duboce Survey") {
			anyHistoric=anyHistoric+1
			if (isLayerVisible("Duboce Survey")) {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>DUBOCE PARK HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"Duboce Survey"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Duboce Survey' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>DUBOCE PARK HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"Duboce Survey"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Duboce Survey' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Parcel: </td><td>" + result.feature.attributes["APN"] + "</td></tr><tr><td></td><td>"+ "CHRSC: </td><td>" + result.feature.attributes["CHRSC"]  + "</td></tr><tr><td></td><td>"+ "Type: </td><td>" + result.feature.attributes["Type"] + "</td></tr>"
				theSurveyRatingsHtml = theSurveyRatingsHtml +"<tr><td></td><td>Survey Form: </td><td><a target='_blank' href='http://sf-planning.org/ftp/files/gis/Duboce/Docs/" + result.feature.attributes["BlkLot"] + ".pdf'>Click to view DPR 523A form</a></td></tr>"
				theSurveyRatingsHtml = theSurveyRatingsHtml + "</table>"
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://www.sf-planning.org/index.aspx?page=2849'>View Duboce Park Landmark District Website</a></td></tr></table>"
		}
	}
	//go through the results array and look for the NE Mission/Showplace Sq Historic Resource Survey records that were found at the location.  Add these to the preservation report HTML.  
	for (var z = 0; z < idResults.length; z++) {
		var result = idResults[z];
		if (result.layerName == "Showplace Survey") {
			anyHistoric=anyHistoric+1
			if (isLayerVisible("Showplace Survey")) {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SHOWPLACE SQUARE/NORTHEAST MISSION HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"Showplace Survey"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Showplace Survey' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SHOWPLACE SQUARE/NORTHEAST MISSION HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"Showplace Survey"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Showplace Survey' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theAddress = ""
			theAddress = result.feature.attributes["ADDRESS"] 
			theDistrict=""
			if (result.feature.attributes["District"]  == "IED") {
				theDistrict = "Northeast Mission-Showplace Square Industrial Employment District"
			}
			if (result.feature.attributes["District"]  == "HTSF") {
				theDistrict = "Showplace Square Heavy Timber and Steel-frame Brick Warehouse and Factory District"
			}
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Address: </td><td>" + theAddress + "</td></tr><tr><td style='width:15px'></td><td style='width:275px'>Parcel: </td><td>" + result.feature.attributes["Block"] + "/" + result.feature.attributes["Lot"]  + "</td></tr><tr><td></td><td>"+ "Resource Attribute: </td><td>" + result.feature.attributes["Type"]  + "</td></tr><tr><td></td><td>"+ "Year Built: </td><td>" + result.feature.attributes["Built"] + "</td></tr><tr><td></td><td>"+ "CHRSC: </td><td>" + result.feature.attributes["StatusCode"] + "</td></tr><tr><td></td><td>"+ "Historic District: </td><td>" + theDistrict + "</td></tr><tr><td></td><td>"+ "California Register: </td><td>" + result.feature.attributes["CalRegiste"] + "</td></tr><tr><td></td><td>"+ "Architect: </td><td>" + result.feature.attributes["Architect"] + "</td></tr><tr><td></td><td>"+ "Architectural Style: </td><td>" + result.feature.attributes["Style"] + "</td></tr><tr><td></td><td>"+ "Notes: </td><td>" + result.feature.attributes["Notes"] + "</td></tr>"
			theSurveyRatingsHtml = theSurveyRatingsHtml +"<tr><td></td><td>DPR 523A Form: </td><td><a target='_blank' href='http://sf-planning.org/ftp/files/gis/Showplace/Docs/" + result.feature.attributes["Block"] + result.feature.attributes["Lot"]+ ".pdf'>Click to view DPR 523A form</a></td></tr>"
			theSurveyRatingsHtml = theSurveyRatingsHtml + "</table>"
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://www.sf-planning.org/index.aspx?page=2666'>View Showplace Square/Northeast Mission Historic Survey Website</a></td></tr></table>"
		}
	}
	//go through the results array and look for the Inner Mission North Historic Resource Survey records that were found at the location.  Add these to the preservation report HTML.  
	for (var z = 0; z < idResults.length; z++) {
		var result = idResults[z];
		if (result.layerName == "Inner Mission North Survey") {
			anyHistoric=anyHistoric+1
			if (isLayerVisible("Inner Mission North Survey")) {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>INNER MISSION NORTH HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"Inner Mission North Survey"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Inner Mission North Survey' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>INNER MISSION NORTH HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"Inner Mission North Survey"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Inner Mission North Survey' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theAddress = ""
			theTo = result.feature.attributes["ADDR_HI"] 
			theFrom = result.feature.attributes["ADDR_LOW"] 
			theStreet = result.feature.attributes["STREET_NAM"] 
			if (theTo != "Null" && theTo !="" && theTo !=" " && theTo != theFrom) {
					theAddress= theFrom + "-" + theTo + theStreet
			} else {
					theAddress = theFrom + " " + theStreet
			}
					
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Parcel: </td><td>" + result.feature.attributes["BLOCK"] + "/" + result.feature.attributes["LOT"] + "</td></tr><tr><td></td><td>"+ "Address: </td><td>" + theAddress  + "</td></tr><tr><td></td><td>"+ "Resource Attribute 1: </td><td>" + result.feature.attributes["ATTRIB_1"] + "</td></tr><tr><td></td><td>"+ "Resource Attribute 2: </td><td>" + result.feature.attributes["ATTRIB_2"] + "</td></tr><tr><td></td><td>"+ "Year Built: </td><td>" + result.feature.attributes["YR_BLT_VRF"] + "</td></tr><tr><td></td><td>"+ "Year Built Source: </td><td>" + result.feature.attributes["YR_BLT_SRC"] + "</td></tr><tr><td></td><td>"+ "Architectural Style: </td><td>" + result.feature.attributes["ARCH_STYLE"] + "</td></tr><tr><td></td><td>"+ "Integrity: </td><td>" + result.feature.attributes["INTEGRITY"] + "</td></tr><tr><td></td><td>"+ "CHRSC: </td><td>" + result.feature.attributes["CHRSC_2011"] + "</td></tr><tr><td></td><td>"+ "Resource Type: </td><td>" + result.feature.attributes["LIST_TYPE"] + "</td></tr><tr><td></td><td>"+ "Resource Eligibility: </td><td>" + result.feature.attributes["ELIGIBILIT"] + "</td></tr><tr><td></td><td>"+ "Historic District: </td><td>" + result.feature.attributes["HISTD_Form"] + "</td></tr><tr><td></td><td>"+ "Survey Form/Photo: </td><td>" + result.feature.attributes["FormPhoto"] + "</td></tr><tr><td></td><td>"+ "Property Summary Report: </td><td>" + result.feature.attributes["SummaryPDF"] + "</td></tr>"

			theSurveyRatingsHtml = theSurveyRatingsHtml + "</table>"
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://www.sf-planning.org/index.aspx?page=2683'>View Inner Mission North Historic Resource Survey Website</a></td></tr></table>"
		}
	}
	//go through the results array and look for the South Mission Historic Resource Survey records that were found at the location.  Add these to the preservation report HTML.  
	for (var z = 0; z < idResults.length; z++) {
		var result = idResults[z];
		if (result.layerName == "South Mission Survey") {
			anyHistoric=anyHistoric+1
			if (isLayerVisible("South Mission Survey")) {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>SOUTH MISSION HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"South Mission Survey"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='South Mission Survey' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theSurveyRatingsHtml = theSurveyRatingsHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>SOUTH MISSION HISTORIC RESOURCE SURVEY: </span><input class='NoPrint' onclick='showHideMap( " + '"South Mission Survey"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='South Mission Survey' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theAddress = ""
			theTo = result.feature.attributes["ADDR_HI"] 
			theFrom = result.feature.attributes["ADDR_LOW"] 
			theStreet = result.feature.attributes["STREET_NAM"] 
			if (theTo != "Null" && theTo !="" && theTo !=" " && theTo != theFrom) {
					theAddress= theFrom + "-" + theTo + theStreet
			} else {
					theAddress = theFrom + " " + theStreet
			}
			//theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Parcel: </td><td>" + result.feature.attributes["Block"] + "/" + result.feature.attributes["Lot"] + "</td></tr><tr><td></td><td>"+ "Address: </td><td>" + theAddress  + "</td></tr><tr><td></td><td>"+ "Resource Attribute 1: </td><td>" + result.feature.attributes["ATTRIB_1"] + "</td></tr><tr><td></td><td>"+ "Resource Attribute 2: </td><td>" + result.feature.attributes["ATTRIB_2"] + "</td></tr><tr><td></td><td>"+ "Year Built: </td><td>" + result.feature.attributes["YR_BLT_REF"] + "</td></tr><tr><td></td><td>"+ "Year Built Source: </td><td>" + result.feature.attributes["YR_BLT_SRC"] + "</td></tr><tr><td></td><td>"+ "Architectural Style: </td><td>" + result.feature.attributes["ARCH_STYLE"] + "</td></tr><tr><td></td><td>"+ "CHRSC: </td><td>" + result.feature.attributes["CHRSC_2010"] + "</td></tr><tr><td></td><td>"+ "Resource Type: </td><td>" + result.feature.attributes["LIST_TYPE"] + "</td></tr><tr><td></td><td>"+ "Resource Eligibility: </td><td>" + result.feature.attributes["ELIGIBILIT"] + "</td></tr><tr><td></td><td>"+ "Historic District: </td><td>" + result.feature.attributes["HIST_DIST"] + "</td></tr><tr><td></td><td>"+ "Survey Form/Photo: </td><td>" + result.feature.attributes["FORMPHOTO"] + "</td></tr>"
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Parcel: </td><td>" + result.feature.attributes["Block"] + "/" + result.feature.attributes["Lot"] + "</td></tr><tr><td></td><td>"+ "Address: </td><td>" + theAddress  + "</td></tr><tr><td></td><td>"+ "Resource Attribute 1: </td><td>" + result.feature.attributes["ATTRIB_1"] + "</td></tr><tr><td></td><td>"+ "Resource Attribute 2: </td><td>" + result.feature.attributes["ATTRIB_2"] + "</td></tr><tr><td></td><td>"+ "Year Built: </td><td>" + result.feature.attributes["YR_BLT_REF"] + "</td></tr><tr><td></td><td>"+ "Year Built Source: </td><td>" + result.feature.attributes["YR_BLT_SRC"] + "</td></tr><tr><td></td><td>"+ "Architectural Style: </td><td>" + result.feature.attributes["ARCH_STYLE"] + "</td></tr><tr><td></td><td>"+ "CHRSC: </td><td>" + result.feature.attributes["CHRSC_2010"] + "</td></tr><tr><td></td><td>"+ "Resource Type: </td><td>" + result.feature.attributes["LIST_TYPE"] + "</td></tr><tr><td></td><td>"+ "Resource Eligibility: </td><td>" + result.feature.attributes["ELIGIBILIT"] + "</td></tr><tr><td></td><td>"+ "Historic District: </td><td>" + result.feature.attributes["HIST_DIST"] + "</td></tr><tr><td></td><td>"+ "Survey Form/Photo: </td><td>" + result.feature.attributes["FORMPHOTO"] + "</td></tr>"
			theSurveyRatingsHtml = theSurveyRatingsHtml + "</table>"
			theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class ='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://www.sf-planning.org/index.aspx?page=2473'>View South Mission Historic Resource Survey Website</a></td></tr></table>"
		}
	}
	theSurveyRatingsHtml += "<br><a name='HRER'></a>"
	//go through the results array and look for the HRER records that were found at the location.  Add these to the preservation report HTML.  
	if (isLayerVisible("HRERs")) {
		theSurveyRatingsHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>HISTORIC RESOURCE EVALUATION RESPONSES: </span><input class='NoPrint' onclick='showHideMap( " + '"HRERs"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='HRERs' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theSurveyRatingsHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>HISTORIC RESOURCE EVALUATION RESPONSES: </span><input class='NoPrint' onclick='showHideMap( " + '"HRERs"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='HRERs' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	//theSurveyRatingsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>HISTORIC RESOURCE EVALUATION RESPONSES: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	theNum = 0
	var lastHRER = "";
	var lastHRERDec = ""
	var HR = ""
	var signed=""
	var signedDate=  new Date();
	theHRERLinks=""
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		//thrHRERDoc=""
		if (result.layerName == "HRERs") {
			if (lastHRER!=result.feature.attributes["record_id"] ) {
				lastHRER=result.feature.attributes["record_id"] 
				theHRERDec = result.feature.attributes["rating"] 
				lastHRERDec = theHRERDec
				signed = result.feature.attributes["date_rating"] 
				signedDate = new Date(signed)
				theSurveyRatingsHtml +=  "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Planning App. No.:</td><td>" +  result.feature.attributes["record_id"] +"</td></tr></table>"
				theSurveyRatingsHtml +=  "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Date:</td><td>" + result.feature.attributes["date_rating"] +"</td></tr></table>"
				if (theHRERDec != undefined && theHRERDec=="Historic Resource Present") {
					theSurveyRatingsHtml +=  "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Decision:</td><td>Historic Resource Present</td></tr></table>"
					HR="true"
					anyHistoric=anyHistoric+1
				}
				if (theHRERDec != undefined && theHRERDec=="No Historic Resource") {
					theSurveyRatingsHtml +=  "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Decision:</td><td>No Historic Resource Present</td></tr></table>"
					HR="false"
				}
				
				var ACALinkData = result.feature.attributes["template_id"].split("-");
				var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
				var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
				
				if ((theLoc=="City") && (dept=="PLANNING")) {
					theHRERLinks += "<a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
				} else {
					theHRERLinks += "<a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
				}
						
						
				theSurveyRatingsHtml += "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'>Further Information:</td><td>" +theHRERLinks+"</td></tr></table>"
				
	//			var theCasetmp = result.feature.attributes["CASENO"]+ result.feature.attributes["SUFFIX"]//.substring(0,4)
	//			var tmpCase=""
	//			if (tmpCase!=theCasetmp) {
	//				theURLtmp = 'http://' + theServerName +'/FileSearch/SearchService.asmx/GetLatestPDFinD'
	//				theParamstmp = "inpath=E:/GIS Data/ParcelInfo/docs/Decision_Documents/CatEx/CaseNo&insearchname=" +theCasetmp  //result.feature.attributes["BLOCK_NUM"].substring(0,4)
	//				getPDFDoc(theURLtmp,theParamstmp)
	//			}
						
	//			tmpCase=theCasetmp
	//			theDoc=document.getElementById('Doc1').innerHTML
	//			if (theDoc=="Not Found") {
	//			}else {
	//				theDoc = theDoc.replace("E:/GIS Data/ParcelInfo","" )
					
	//				theSurveyRatingsHtml += "<table class='reportData'><tr><td style='width:15px'></td><td style='width:275px'></td><td><a target='_blank' href='" + theDoc + "'>View Historic Resource Evaluation Response</a></td></tr></table>"
	//			}
			}
			theNum=theNum+1
		}

	}
	if (theNum==0) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	if (theNum>0) {
		var pos1="A - Historic Resource Present" // <td id='deptstat'><a target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>A - Historic Resource Present</a></td>"
		var pos2="B - Potential Historic Resource" //  "<td id='deptstat'><a target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>B - Possible Historic Resource</a></td>"
		var pos3="C - Not a Historic Resource" //  "<td id='deptstat'><a target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>C - Not a Historic Resource</a></td>"
		if (theHistArray.length==0 || (theHistArray[0][1]!="Historic Database")) {
			if (theHistArray.length>1) {
				//multiple parcels involved, can't tell which one the HRR refers to, add a note saying to check the HRER
				
				theSurveyRatingsHtml = theSurveyRatingsHtml.replace(/\bA - Historic Resource Present\b/gi,'A - Historic Resource Present (may be affected by HRER)');
				theSurveyRatingsHtml = theSurveyRatingsHtml.replace(/\bB - Potential Historic Resource\b/gi,'B - Potential Historic Resource (may be affected by HRER)');
				theSurveyRatingsHtml = theSurveyRatingsHtml.replace(/\bC - Not a Historic Resource\b/gi,'C - Not a Historic Resource (may be affected by HRER)');
				
			} else {
				if (signedDate > theLastSurveyDate) {
					//alert("go with HRER")
					if (HR=="true") {
						//alert("change to A");
						theSurveyRatingsHtml =theSurveyRatingsHtml.replace(pos2,pos1);
						theSurveyRatingsHtml =theSurveyRatingsHtml.replace(pos3,pos1);
					}
					if (HR=="false") {
						//alert("change to C");
						theSurveyRatingsHtml =theSurveyRatingsHtml.replace(pos1,pos3);
						theSurveyRatingsHtml =theSurveyRatingsHtml.replace(pos2,pos3);
					}
				} else {
					//alert("go with survey, don't need to change anything")
					//No need to change anything
				}	
				
				
			}
		}
	}
	theSurveyRatingsHtml+="<div id='HRER'></div>"
	
	theNum = 0
	if (isLayerVisible("Architecture")) {
		theSurveyRatingsHtml +="<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ARCHITECTURE: </span><input class='NoPrint' onclick='showHideMap( " + '"Architecture"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Architecture' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theSurveyRatingsHtml +="<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ARCHITECTURE: </span><input class='NoPrint' onclick='showHideMap( " + '"Architecture"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Architecture' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Architecture") {	
			theNum=theNum+1
			theSurveyRatingsHtml += "<table class='reportData' style='text-align:left; width:100%; border-bottom: solid; border-width: 0px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:275px'>Historic Name: </td><td>" + result.feature.attributes["LMORBLDGNAME"] + "</td></tr><tr><td></td><td>"+ "Year Built: </td><td>" + result.feature.attributes["YEARBUILT"]  + "</td></tr><tr><td></td><td>"+ "Architect: </td><td>" + result.feature.attributes["ARCHITECT"] + "</td></tr><tr><td></td><td>"+ "Builder: </td><td>" + result.feature.attributes["BUILDER"] + "</td></tr><tr><td></td><td>"+ "Style: </td><td>" + result.feature.attributes["STYLE"] + "</td></tr><tr><td></td><td>"+ "Stories: </td><td>" + result.feature.attributes["STORIES"] + "</td></tr><tr><td></td><td>"+ "Height: </td><td>" + result.feature.attributes["HEIGHT"] + "</td></tr><tr><td></td><td>"+ "Construction Type: </td><td>" + result.feature.attributes["CONSTRUCTION"] + "</td></tr><tr><td></td><td>"+ "Foundation: </td><td>" + result.feature.attributes["FOUNDATION"]+ "</td></tr><tr><td></td><td>"+ "Detail: </td><td>" + result.feature.attributes["DETAIL"] + "</td></tr><tr><td></td><td>"+ "Exterior: </td><td>" + result.feature.attributes["EXTERIORMATERIAL"] + "</td></tr><tr><td></td><td>"+ "Current Use: </td><td>" + result.feature.attributes["CURRENTUSE"] + "</td></tr><tr><td></td><td>"+ "Alterations: </td><td>" + result.feature.attributes["INAPPROPALTERATIONS"] + "</td></tr><tr><td></td><td>"+ "Original Use: </td><td>" + result.feature.attributes["ORIGUSE"] + "</td></tr><tr><td></td><td>"+ "Original Owner: </td><td>" + result.feature.attributes["ORIGOWNER"] + "</td></tr>" + "<tr><td></td><td>"+ "Original Tenant: </td><td>" + result.feature.attributes["ORIGTENANT"] + "</td></tr>" + "<tr><td></td><td>"+ "Misc. Notes: </td><td>" + result.feature.attributes["NOTES"] + "</td></tr>"+ "<tr><td></td><td>"+ "Sources: </td><td>" + result.feature.attributes["SOURCES"] + "</td></tr>"+ "<tr><td></td><td>"+ "Other Information: </td><td>" + result.feature.attributes["OTHERINFORMATION"] + "</td></tr></table>"
		}
	}
	if (theNum==0) {
		theSurveyRatingsHtml = theSurveyRatingsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>Unknown</td></tr></table>"
	}

	//clean out 'null's and 'undefined's
	theSurveyRatingsHtml = theSurveyRatingsHtml.replace(/Null/gi,"&nbsp");
	theSurveyRatingsHtml = theSurveyRatingsHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theSurveyRatingsHtml = theSurveyRatingsHtml + "<p class='NoPrint'><br></p>"
	
	theSurveyRatingsHtml += "<p class='NoPrint'><br></p>"
	theSurveyRatingsHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkPropertyTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	theSurveyRatingsHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"

			
	//publish the HTML to the page
	document.getElementById('SurveyRatingsReport').innerHTML = theSurveyRatingsHtml
	
	//alert(theParcelList)
	
	var theFieldList = ' "b4375513-b22c-4e2c-8a44-c703eca06310"."record_id" '
	theFieldList +=', "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" '
	theFieldList +=', "b4375513-b22c-4e2c-8a44-c703eca06310"."rating_assessment" '
	theFieldList +=', "b4375513-b22c-4e2c-8a44-c703eca06310"."status_date" '
	theFieldList +=', "b4375513-b22c-4e2c-8a44-c703eca06310"."template_id" '
	
	if (!theParcelListForAccela) {
		theParcelListForAccela="'9'"
	}
	var queryString = 'SELECT ' + theFieldList + ' from "b4375513-b22c-4e2c-8a44-c703eca06310" INNER JOIN "3b63c2ea-1ea7-4232-be53-24751ff15dde" ON  "b4375513-b22c-4e2c-8a44-c703eca06310"."record_id" = "3b63c2ea-1ea7-4232-be53-24751ff15dde"."record_id" WHERE ("3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" in (' + theParcelListForAccela + ') )'
	//prompt("",queryString)
	//var data = {
	//	sql: queryString
	//};
	
	//alert(isinCR)
	if (isinCR) {
		//change to an A
		var pos1="A - Historic Resource Present" 
		var pos2="B - Potential Historic Resource" 
		var pos3="C - Not a Historic Resource"
		document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(pos2,pos1);
		document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(pos3,pos1);
		theSurveyRatingsHtml=theSurveyRatingsHtml.replace(pos2,pos1);
		theSurveyRatingsHtml=theSurveyRatingsHtml.replace(pos3,pos1);
		//prompt("",theSurveyRatingsHtml)
		
	}
	//var data = JSON.stringify({"sql" : queryString});
	//$.ajax({
	//	url: "http://www.civicdata.com/api/action/datastore_search_sql", 
	//	type: 'POST',
	//	dataType: 'json',
	//	cache: false,
	//	data: data,
	//	success: function(data) {
	//		var theHRERHtml=""
	//		recordTotal=data.result.records.length
	//		if (recordTotal>0) {
	//			var tmpHRERRecID=""
	//			var tmpHRERDec=""
	//			var tmpHRERDate = new Date() 
	//			var tmpHRERParcel=""
				
	//			for (i=0; i<data.result.records.length;i++) {
	//				var obj = data.result.records[i]
					//alert(obj['parcel_nbr'])
	
	//				if (tmpHRERRecID!=obj['record_id'] && tmpHRERDec!=obj['rating_assessment'] && tmpHRERParcel!=obj['parcel_nbr'] && tmpHRERDate!=dateConvert(obj['status_date'])) {
	//					tmpHRERRecID=obj['record_id']
	//					tmpHRERDec=obj['rating_assessment']
	//					if (tmpHRERDec=="Historic Resource Present") {
	//						HR="true"
	//					} 
	//					if (tmpHRERDec=="No Historic Resource") {
	//						HR="false"
	//					}
	//					if (tmpHRERDec=="Not Applicable") {
	//						HR="N/A"
	//					}
						
	//					tmpHRERDate = dateConvert(obj['status_date'])
	//					tmpHRERParcel=obj['parcel_nbr']
	//					var curr_date=""
	//					var curr_month=""
	//					var curr_year=""
	//					var dateString=""
	//					var HRERdateString=""
	//					if (tmpHRERDate!="") {
	//						signedDate = tmpHRERDate
	//						curr_date = tmpHRERDate.getDate()
							//Switch to Pacific Time (will assume date was entered as UTC
	//						var curr_date2 = new Date(signedDate.getTime() + (8*1000*60*60));
	//						curr_date = curr_date2.getDate()
	//						curr_month = tmpHRERDate.getMonth() + 1; //months are zero based
	//						curr_year = tmpHRERDate.getFullYear(); 
	//						HRERdateString = curr_month+ "/" + curr_date + "/" + curr_year 
							
	//					}
						//alert("Found HRER")
	//					var ACALinkData = obj['template_id'].split("/");
	//					var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
	//					var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
						
	//					theHRERHtml+="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
	//					theHRERLinks=""
						
	//					if ((theLoc=="City") && (dept=="PLANNING")) {
	//						theHRERLinks += "<a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
	//					} else {
	//						theHRERLinks += "<a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
	//					}
						
						
	//					theHRERHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record ID:</td><td>" +tmpHRERRecID+"</td></tr>"
	//					theHRERHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Date:</td><td>" +HRERdateString+"</td></tr>"
	//					theHRERHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Decision:</td><td>" +tmpHRERDec+"</td></tr>"
	//					theHRERHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td>" +theHRERLinks+"</td></tr>"
	//					theHRERHtml+= "</table><br>" 
						
						//alert(recordTotal)
	//					if (recordTotal>0) {
	//						var pos1="A - Historic Resource Present" // <td id='deptstat'><a target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>A - Historic Resource Present</a></td>"
	//						var pos2="B - Potential Historic Resource" //  "<td id='deptstat'><a target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>B - Possible Historic Resource</a></td>"
	//						var pos3="C - Not a Historic Resource" //  "<td id='deptstat'><a target='_blank' href='http://www.sf-planning.org/Modules/ShowDocument.aspx?documentid=5340'>C - Not a Historic Resource</a></td>"
							
							
							//alert(theHistArray[0][1])
	//						if (!isinCR) {
								//if it's in a California Register we've already upgraded to an A, an HRER cannot change this.
	//							if (theHistArray.length==0 || (theHistArray[0][1]!="Historic Database")) {
	//								if (theHistArray.length>1) {
										//multiple parcels involved, can't tell which one the HRR refers to, add a note saying to check the HRER
	//									document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(/\bA - Historic Resource Present\b/gi,'A - Historic Resource Present (may be affected by HRER)');
	//									document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(/\bB - Potential Historic Resource\b/gi,'B - Potential Historic Resource (may be affected by HRER)');
	//									document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(/\bC - Not a Historic Resource\b/gi,'C - Not a Historic Resource (may be affected by HRER)');
										
	//								} else {
										//alert("here")
	//									if (signedDate > theLastSurveyDate) {
											//alert("go with HRER")
	//										if (HR=="true") {
												//alert("change to A");
												
	//											document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(pos2,pos1);
	//											document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(pos3,pos1);
	
	//										}
	//										if (HR=="false") {
	//											//alert("change to C");
	//											document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(pos1,pos3);
												//document.getElementById('SurveyRatingsReport').innerHTML = document.getElementById('SurveyRatingsReport').innerHTML.replace(pos2,pos3);
	//										}
	//									} else {
											//alert("go with survey, don't need to change anything")
											//No need to change anything
	//									}	
										
										
	//								}
	//							}
	//						}
	//					}
						//alert(theHRERHtml)
						
						
	//				}
				
					
	//			}
				
				
	//		} else {
	//			theHRERHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
				//alert("No HRER's")
	//		}
	//		document.getElementById('HRER').innerHTML = theHRERHtml
	//		document.getElementById('ImBusy').style.visibility = 'hidden'; 
			//alert("Finished")
	//		var theBM=gup("bookmark").toUpperCase();
			//alert(theBM)
	//		if (theBM=="HRER") {
	//			showTab('dhtmlgoodies_tabView1',"2");
	//			jumpToBookmark('#HRER')
	//		}
			//updateProjectsHtml();
	//	},
		
	
		
	//error: function(jqXHR, exception) {
			//alert("There's an Error")
			//alert(jqXHR.status)
	//		var theError="Error"
	//		if (jqXHR.status === 0) {
	//			theError = "Cannot connect to Accela database. This is usually caused by either the Accela servers being unusually busy. Other potential causes: network error; Accela services down; request too long (can happen with large condos). Try waiting a few seconds and running the search again.  Clearing your browser's cache (or clicking control-F5 on a Windows machine) may also correct this."
				
	//		} else if (jqXHR.status == 404) {
	//			theError = 'Requested page not found or no response from permitting server. [404]  This may be caused by an unusaully complex request (e.g. many permits being attached to hundreds of parcels).'
				
	//		} else if (jqXHR.status == 414) {
	//			theError = 'Request Too Large. [414]'
				
	//		}else if (jqXHR.status == 500) {
	//			theError='Internal Server Error [500].'
				
	//		} else if (exception === 'parsererror') {
	//			theError='Requested JSON parse failed.'
				
	//		} else if (exception === 'timeout') {
	//			theError='Time out error.'
				
	//		} else if (exception === 'abort') {
	//			theError='Ajax request aborted.'
				
	//		} else {
	//			theError='Uncaught Error.n' + jqXHR.responseText
        //        theError="Error connecting to Accela permitting database.  <br><br>This can happen if your browser has cached an expired connection parameter, if you are using a Windows machine try clicking control-F5, this will clear your browser's cache for this website.  Alternatively, clear your cache entirely then try again. <br>"
				
	//		}
	//		console.log(theError)
	//		document.getElementById('HRER').innerHTML +=  "<table  class='reportData' style='width:100%; border-bottom: none;'><tr><td style='width:15px'><td>" + theError + "<br><br>If this problem persists please email <a href='mike.wynne@sfgov.org'>Mike Wynne</a> and provide details of the property that you searched for, the browser you used and the operating system of your machine.</td></tr></table>"
	//	}
	//})
	//.fail(function(xhr, status, error) {
	//	console.log("Error1");
	//	console.log("Status1: " + status)
	//	console.log("Error1: " + error)
	//})
	//.always(function(jqXHR, exception) {
	//	console.log("complete");
	//	if (jqXHR.status === 0) {
	//		console.log("Cannot connect to Accela database.  This is usually caused by the Accela CivicData servers being very busy. Other potential causes: network error; Accela services down; request too long (can happen with large condos). Try waiting a few seconds and running the search again.  Clearing your browser's cache (or clicking control-F5 on a Windows machine) may also correct this.");
	//	} else if (jqXHR.status == 404) {
	//		console.log('Requested page not found. [404]');
	//	} else if (jqXHR.status == 500) {
	//		console.log('Internal Server Error [500].');
	//	} else if (exception === 'parsererror') {
	//		console.log('Requested JSON parse failed.');
	//	} else if (exception === 'timeout') {
	//		console.log('Time out error.');
	//	} else if (exception === 'abort') {
	//		console.log('Ajax request aborted.');
	//	} 
	//});		

	
}
	
	
function updatePropertyHtml() {
	//alert("starting updatePropertyHtml")
	//var myNum=0
	//alert("updateProperty, No of results: "+ idResults.length + "\ntheSearchType: "+ theSearchType)
	//go through the results array and look for the Assessors records that were found at the location.  Add these to the property report HTML.  
	theNum = 0
	//alert(idResults.length)
	if (isNeighborhood || isDistrict) {
		theAssessorHtml += "its a neighborhood"
		//alert("neeb")
	} else {
		//theAssessorHtml +="<a name='BookmarkPropertyTop'/>"
		
		//prompt("",theAssessorHtml)
		
		//UNCOMMENT TO ADD BACK IN THE PRINT PLANNING REPORT SECTION
		tmpLink = "Printable Version of Reports</a><br><a class='NoPrint'  href='javascript: printPlanningReport();'>Print Planning Report*</a></div>"
		if ((theLoc=="City") && (dept=="PLANNING") ) {
			theAssessorHtml = theAssessorHtml.replace("Printable Version of Reports</a></div>",tmpLink )
		}
		
		//theAssessorHtml += " <a class='NoPrint' style='float:right; font-size: 14px; font-family:Arial, Helvetica, sans-serif; color: #33b5ff; text-decoration: underline;' href='javascript: printReports();'>Planning Report</a>"
		theAssessorHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>General information related to properties at this location.</td></tr></table>"
		theAssessorHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
		if ((idResults.length> 0) && (theSearchType=="Block")) {
			
			theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBlocks'>Blocks</a></td></tr></table>"
		}
		if ((idResults.length> 0) && (theSearchType=="mapClick" || theSearchType=="Parcel" || theSearchType=="Address" || theSearchType=="Case" || theSearchType=="Geocode" || theSearchType=="Block")) {
			theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkParcels'>Parcels</a></td></tr></table>"
		}
		if ((theLoc=="City") && (dept=="PLANNING") ) {
			theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkParcelHistory'>Parcel History*</a></td></tr></table>"
		}
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkAddresses'>Addresses</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkNeighborhood'>Neighborhood</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkCurrentPlanningTeam'>Current Planning Team</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkSupervisorDistrict'>Supervisor District</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkCensusTracts'>Census Tracts</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkTrafficAnalysisZone'>Traffic Analysis Zone</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkPlants'>Recommended Plants</a></td></tr></table>"
		if ((theLoc=="City") && (dept=="PLANNING") ) {
			theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkReportOfResidentialBuildingRecord'>Report Of Residential Building Record (3-R)*</a></td></tr></table>"
		}
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkSFREIS'>City Properties</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkSFPortFacilities'>Port Facilities</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkAssessorsReport'>Assessor's Report</a></td></tr></table>"
		theAssessorHtml +="<br></div>"
		
		//If they searched for a block add a line at the top of the property report for the blocks (this includes a button to add/remove the blocks from the map)
		if ((idResults.length> 0) && (theSearchType=="Block")) {
			theAssessorHtml +="<a name='BookmarkBlocks'></a>"
			if (isLayerVisible("Blocks")) {
				theAssessorHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BLOCKS: </span><input class='NoPrint' onclick='showHideMap( " + '"Blocks"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Blocks' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table><table border=0>"
			} else {
				theAssessorHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BLOCKS: </span><input class='NoPrint' onclick='showHideMap( " + '"Blocks"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Blocks' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table><table border=0>"
			}
				
			//add the Blocks found to the html for the property report
			for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if ((result.layerName == "Blocks") && (result.feature.attributes["BLOCK_NUM"] ==theSearchString)) {
					theAssessorHtml +="<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["BLOCK_NUM"] + "</td></tr></table>"
				}
			}
		}

		 //if they have searched for anything other than a block add a line at the top of the property report for the Parcels (this includes a button to add/remove the parcels from the map) 
		if ((idResults.length> 0) && (theSearchType=="mapClick" || theSearchType=="Parcel" || theSearchType=="Address" || theSearchType=="Case" || theSearchType=="Geocode" || theSearchType=="Block")) {
			theAssessorHtml +="<a name='BookmarkParcels'></a>"
			if (isLayerVisible("Parcels")) {
				theAssessorHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARCELS (Block/Lot): </span><input class='NoPrint' onclick='showHideMap( " + '"Parcels"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Parcels' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theAssessorHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARCELS (Block/Lot): </span><input class='NoPrint' onclick='showHideMap( " + '"Parcels"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Parcels' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
		 }
		
		//go through the results array and add the Parcel results to the HTML
		
		var tempAssessorHtml=""
		//alert(theSearchType)
		 theNum=0
		 theAPN=""
		 //themapblklotnum = 0
		 theParcels=0
		var theTotalParcels=0
		 var theTotalParcelstmp=0
		 theParcelListForAccela=""
		 theParcelListForAccelaPart2=""
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			//if ((result.layerName == "Master Address Database") && (theSearchType=="Address" )) {
			 if ((result.layerName == "MAD_Parcel") && (theSearchType=="Address" )) {
				 
				theNum = theNum + 1;
				theAddressLot = result.feature.attributes["mapblklot"]

				themapblklot = theAddressLot
				if (IsNumeric(theAddressLot.substring(4,5))) {
					theAddressLot = theAddressLot.substring(4,theSearchString.length)
				} else {
					theAddressLot = theAddressLot.substring(5,theSearchString.length)
				}
			}
			//if (result.layerName == "Parcels" && theTotalParcelstmp <300) {
			if (result.layerName == "Parcels" ) {
				//alert(result.feature.attributes["blklot"] )
				if (theParcelListForAccela=="") {
					theParcelListForAccela = "'"+result.feature.attributes["blklot"] +"'"
					theTotalParcelstmp=theTotalParcelstmp+1
				} else {
					if (theParcelListForAccela.indexOf(result.feature.attributes["blklot"])<0) {
						//add a limit for the number of parcels to search for.  If more than around 360 the GET request to Accela becomes too large.  This is a limit set by the browser so it can vary
						//if (theTotalParcelstmp < 700) {
							theParcelListForAccela += "," + "'"+result.feature.attributes["blklot"] +"'"
							theTotalParcelstmp=theTotalParcelstmp+1
						//} else {
						//	if (theParcelListForAccelaPart2=="") {
						//		theParcelListForAccelaPart2 = "'"+result.feature.attributes["blklot"] +"'"
						//		theTotalParcelstmp=theTotalParcelstmp+1
						//	} else {
						//		theParcelListForAccelaPart2 += "," + "'"+result.feature.attributes["blklot"] +"'"
						//	}
						//}
					}	
				}
			}
			//add a limit for the number of parcels to search for.  If more than around 360 the GET request to Accela becomes too large. This is a limit set by the browser so it can vary
			//if (theTotalParcelstmp < 700) {
				if (result.layerName == "Retired Parcels") {
					//alert(result.feature.attributes["blklot"] )
					if (theParcelList=="") {
						theParcelListForAccela = "'"+result.feature.attributes["OLDBLKLOT"] +"'"
						theTotalParcels=theTotalParcels+1
					} else {
						if (theParcelListForAccela.indexOf(result.feature.attributes["OLDBLKLOT"])<0) {
							theParcelListForAccela += "," + "'"+result.feature.attributes["OLDBLKLOT"] +"'"
							theTotalParcelstmp=theTotalParcelstmp+1
						}
					}
				}
			//} else {
			//	if (result.layerName == "Retired Parcels") {
					//alert(result.feature.attributes["blklot"] )
			//		if (theParcelList=="") {
			//			theParcelListForAccelaPart2 = "'"+result.feature.attributes["OLDBLKLOT"] +"'"
			//			theTotalParcels=theTotalParcels+1
			//		} else {
			//			if (theParcelListForAccelaPart2.indexOf(result.feature.attributes["OLDBLKLOT"])<0) {
			//				theParcelListForAccelaPart2 += "," + "'"+result.feature.attributes["OLDBLKLOT"] +"'"
			//				theTotalParcelstmp=theTotalParcelstmp+1
			//			}
			//		}
			//	}
				
				
			//}
			
			//alert("result.layerId: " + result.layerId + "\nName: " + result.layerName)
			if ((result.layerName == "Parcel Labels") && (theSearchType=="mapClick" || theSearchType=="Parcel" || theSearchType=="Address" || theSearchType=="Case" || theSearchType=="Geocode" || theSearchType=="Block")) {
				theNum = theNum + 1;
				theParcels = theParcels + 1;
				//if (themapblklot!=result.feature.attributes["mapblklot"]) { themapblklotnum=themapblklotnum+1}
				themapblklot = result.feature.attributes["mapblklot"]
				if (IsNumeric(result.feature.attributes["num_lots"])) {
					theTotalParcels = theTotalParcels + parseInt(result.feature.attributes["num_lots"])
				}
				
				switch (theSearchType) {
					case "mapClick":
						if (result.feature.attributes["num_lots"] ==1) {
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
							theAPN=result.feature.attributes["block_num"] + result.feature.attributes["lotmin"]
							//theAPN=result.feature.attributes["mapblklot"] 
						} else {
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" + result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Parcel":
						theAPN= theSearchString.toUpperCase();
						//alert("theAPN" + theAPN)
						if (result.feature.attributes["num_lots"] == 1) { 
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
							
						} else {
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Block":
						if (result.feature.attributes["num_lots"] == 1) { 
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
							theAPN=result.feature.attributes["block_num"] + result.feature.attributes["lotmin"]
						} else {
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Address":
						if (result.feature.attributes["num_lots"] == 1) { 
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
							theAPN=result.feature.attributes["block_num"] + result.feature.attributes["lotmin"]
						} else {
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" + result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+  " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Case":
						if (result.feature.attributes["num_lots"] ==1) {
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
							theAPN=result.feature.attributes["block_num"] + result.feature.attributes["lotmin"]
						} else {
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" + result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
					case "Geocode":
						if (result.feature.attributes["num_lots"] == 1) { 
							tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "</td></tr></table>"
							theAPN=result.feature.attributes["block_num"] + result.feature.attributes["lotmin"]
						} else {
								tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["block_num"] + "/" +  result.feature.attributes["lotmin"] + "-" + result.feature.attributes["lotmax"]+ " (" + result.feature.attributes["num_lots"] + " lots)</td></tr></table>"
						}
						break;
				}
			} 
			
		}
		//alert(theTotalParcelstmp)
		var portName = ""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Port Facilities") {
				portName = result.feature.attributes["NAME"] 
				if (portName.indexOf("Seawall Lot")>-1) {
					theNum = theNum + 1;
					tempAssessorHtml +=  "<table class='reportData' ><tr><td style='width:15px'></td><td>" + portName + "</td></tr></table>"
				}
			}
		}

		if (theParcels>5) {
			theAssessorHtml+="<div id='limitParcelsHTML' style='height:110px;overflow:hidden'>" + tempAssessorHtml + "</div>"
			theAssessorHtml+="<div id='limitParcelsMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitParcelsHTML\",\"limitParcelsMore\",\"110px\");'>more...</a></td></tr></table></div>"
		} else {
			theAssessorHtml += tempAssessorHtml
		}
		if (theParcels==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		if ((theSearchType=="mapClick") && (theParcels==0) ) {
			theAssessorHtml = theAssessorHtml + "<table class='reportData'><tr><td style='width:15px'></td><td><b>You did not click inside a property boundary.  Most of the information in this website is only available for properties.  To correct this, click on the map inside a property boundary.</b></td></tr></table>"
			//setTimeout('alert("You did not click inside a property boundary.  Most of the information in this website is only available for properties.  To correct this, click on the map inside a property boundary.");',1250)
			setTimeout("new Messi('You did not click inside a property boundary.  Most of the information in this website is only available for properties.  To correct this, click on the map inside a property boundary.', {title: 'No Properties Found', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});",750)
		}

		if ((theOrigType=="Address") && (theParcels==0) && (theSearchType=="Geocode")) {
			theAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td ><b>The exact location of this address cannot be found as the address you typed does not appear to be an official address. An approximate location is being used.<br><br> <span class='NoPrint'>Most of the information in this web site is only available for properties. If the blue marker on the map is not inside a property boundary the web site will only show limited information.  <br><br>You can correct this by either typing an official address into the search box or by clicking inside the property boundary on the map.</span></b></td></tr></table>"
			
			//var theTitle="No Properties Found"
			//var theMessage = "The exact location of this address cannot be found as the address you typed does not appear to be an official address. An approximate location is being used. <br><br>You can correct this either by typing an official address into the search box or by clicking inside the property boundary on the map."
			//new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});
			//setTimeout('alert("The exact location of this address cannot be found as the address you typed does not appear to be an official address. An approximate location is being used. \\n\\nYou can correct this either by typing an official address into the search box or by clicking inside the property boundary on the map.");',1250)
			//setTimeout("javascript: new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});",1250)
			//new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});
			theMessage = '<div style="text-align:left;">The exact location of this address cannot be found as the address you typed does not appear to be an official address. An approximate location is being used. <br><br>If you think the location shown on the map is incorrect try clicking on the map at the correct location or search for an official address.</div>'
			setTimeout("new Messi('"+ theMessage+"', {title: 'No Properties Found', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});",750)
		}
		
		if ((theLoc=="City") && (dept=="PLANNING") ) {
			theNum=0
			theAssessorHtml +="<a name='BookmarkParcelHistory'></a>"
			if (isLayerVisible("Retired Parcels")) {
				theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARCEL HISTORY:* </span><input class='NoPrint' onclick='showHideMap( " + '"Retired Parcels"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Retired Parcels' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARCEL HISTORY:* </span><input class='NoPrint' onclick='showHideMap( " + '"Retired Parcels"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Retired Parcels' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			tempAssessorHtml=""
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (result.layerName == "Retired Parcels") {
					if (result.feature.attributes["OLDBLKLOT"] != null) {
						theNum = theNum + 1
						theRecordedDate = result.feature.attributes["RECORDED"]
						//alert("--" + theRecordedDate + "--")
						if (theRecordedDate==null||theRecordedDate=="Null"||theRecordedDate==""||theRecordedDate==" ") {
							theRecordedDate = " an unknown date"
						} 
						tempAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>" + result.feature.attributes["OLDBLOCK"] + "/" + result.feature.attributes["OLDLOT"] +" became " +result.feature.attributes["BLOCK"] +"/" + result.feature.attributes["LOT"] + " on " + theRecordedDate  + "</td></tr></table>"
					}
				}
			}
			
			if (theNum>5) {
				theAssessorHtml+="<div id='limitRetiredHTML' style='height:110px;overflow:hidden'>" + tempAssessorHtml + "</div>"
				theAssessorHtml+="<div id='limitRetiredMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitRetiredHTML\",\"limitRetiredMore\",\"110px\");'>more...</a></td></tr></table></div>"
			} else {
				theAssessorHtml += tempAssessorHtml
			}
			if (theNum==0) {
				theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
			}
		}
		//alert(theTotalParcels)
		theNum=0
		//go through the results array and look for the Addresses that were found at the location.  Add these to the property report HTML.  
		theAssessorHtml +="<a name='BookmarkAddresses'></a>"
		theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ADDRESSES: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		tempAssessorHtml=""
		tmpAddForSFFind=""
		var theParcelNote =""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "MAD_Parcel") {
				if (result.feature.attributes["ADDRESS"] != null) {
					theNum = theNum + 1
					if (theTotalParcels >1) {
						theParcelNote= " (parcel " + result.feature.attributes["block_num"] + "/" + result.feature.attributes["lot_num"] + ")"
					}
					tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["ADDRESS"] + ", SAN FRANCISCO, CA " + result.feature.attributes["zipcode"] + theParcelNote +"</td></tr></table>"
					tmpAddForSFFind = result.feature.attributes["ADDRESS"]
				}
			}
		}
		theTotalParcels=0
		if (theNum>5) {
			theAssessorHtml+="<div id='limitAddressHTML' style='height:110px;overflow:hidden'>" + tempAssessorHtml + "</div>"
			theAssessorHtml+="<div id='limitAddressMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitAddressHTML\",\"limitAddressMore\",\"110px\");'>more...</a></td></tr></table></div>"
		} else {
			theAssessorHtml += tempAssessorHtml
		}
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		//go through the results array and look for the neightborhoods that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual neighborhoods
		theAssessorHtml +="<a name='BookmarkNeighborhood'></a>"
		if (isLayerVisible("Neighborhoods")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOOD: </span><input class='NoPrint' onclick='showHideMap( " + '"Neighborhoods"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Neighborhoods' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOOD: </span><input class='NoPrint' onclick='showHideMap( " + '"Neighborhoods"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Neighborhoods' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

		MinY = map.extent.ymin 
		MaxY = map.extent.ymax
		MinX = map.extent.xmin 
		MaxX = map.extent.xmax
		centerY = ((MaxY-MinY)/2 )+ MinY
		centerX= ((MaxX-MinX)/2) + MinX
		
		var source = new Proj4js.Proj("EPSG:102113");    //source coordinates will be in Longitude/Latitude
		var dest = new Proj4js.Proj("WGS84");
		var p = new Proj4js.Point(centerX,centerY);   
		Proj4js.transform(source, dest, p); 

		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Neighborhoods") {
				if (result.feature.attributes["NEIGHBORHOOD"] != null) {
					theNum = theNum + 1
					theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>"+ result.feature.attributes["NEIGHBORHOOD"] + "&nbsp;</td><td class='NoPrint'> <a target='_blank' href='http://www.sf-planning.org/index.aspx?page=1654'>View Neighborhood Groups Map</a></td><td class='NoPrint'> &nbsp; </tr></table>"
				}
			}
		}
		
		if (tmpAddForSFFind=="") {
			theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td class='NoPrint'><a target='_blank' href='http://propertymap.sfplanning.org?name=sffind&tab=1&search=" + p. y+" " + p.x +"'>Find services nearby (street cleaning, parks, MUNI, etc)</a></td><td class='NoPrint'> &nbsp; </tr></table>"
		} else {
			theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td class='NoPrint'><a target='_blank' href='http://propertymap.sfplanning.org?name=sffind&tab=1&search=" + tmpAddForSFFind+"'>Find services nearby (street cleaning, parks, MUNI, etc)</a></td><td class='NoPrint'> &nbsp; </tr></table>"
		}
		
		
		//go through the results array and look for the neightborhood teams that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual neighborhood teams
		theAssessorHtml +="<a name='BookmarkCurrentPlanningTeam'></a>"
		if (isLayerVisible("Planning Dept Neighborhood Team")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CURRENT PLANNING TEAM: </span><input class='NoPrint' onclick='showHideMap( " + '"Planning Dept Neighborhood Team"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Planning Dept Neighborhood Team' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CURRENT PLANNING TEAM: </span><input class='NoPrint' onclick='showHideMap( " + '"Planning Dept Neighborhood Team"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Planning Dept Neighborhood Team' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Planning Dept Neighborhood Team") {
				if (result.feature.attributes["QUAD"] != null) {
					theNum = theNum + 1
					theAssessorHtml = theAssessorHtml + "<table  class='reportData'><tr><td style='width:15px'></td><td><a href='http://www.sf-planning.org/index.aspx?page=1656' target='_blank'>" + result.feature.attributes["QUAD"] + " Team</a></td></tr></table>"
				}
			}
		}

		//go through the results array and look for the supervisor districts that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual supervisor districts
		theAssessorHtml +="<a name='BookmarkSupervisorDistrict'></a>"
		if (isLayerVisible("Supervisor Districts")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SUPERVISOR DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Supervisor Districts 2012"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Supervisor Districts 2012' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SUPERVISOR DISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"Supervisor Districts 2012"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Supervisor Districts 2012' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		 for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Supervisor Districts 2012") {
				if (result.feature.attributes["supervisor"] != null) {
					theNum = theNum + 1
					theAssessorHtml = theAssessorHtml + "<table class='reportData' ><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["LINK"]  + "'>District " + result.feature.attributes["supervisor"] + " (" + result.feature.attributes["supname"] + ") </a></td></tr></table>"
				}
			}
		}

		theAssessorHtml +="<a name='BookmarkCensusTracts'></a>"
		if (isLayerVisible("Census Tracts")) {
			theAssessorHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CENSUS TRACTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Census Tracts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Census Tracts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CENSUS TRACTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Census Tracts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Census Tracts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum=0
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Census Tracts") {
			
				if (result.feature.attributes["TRACTCE10"] != null) {
					theNum = theNum + 1
					theLink=""
					theLink = "http://projects.nytimes.com/census/2010/map?view=PopChangeView&l=14&lat="+p.y+"&lng=" + p.x
					theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>2010 Census Tract <a target='_blank' href='"+theLink +"'>" +result.feature.attributes["TRACTCE10"]+"</a></td></tr></table>"
				}
			}
		}
		if (theNum==0) {
				theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}

		theNum=0

			//go through the results array and look for the Traffic Analysis Zones that were found at the location.  Add these to the property report HTML.  Start by adding the title (incl. add map button) then the actual supervisor districts
			theAssessorHtml +="<a name='BookmarkTrafficAnalysisZone'></a>"	
			if (isLayerVisible("Traffic Analysis Zones")) {
				
				theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC ANALYSIS ZONE: </span><input class='NoPrint' onclick='showHideMap( " + '"Traffic Analysis Zones"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Traffic Analysis Zones' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				
				theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC ANALYSIS ZONE: </span><input class='NoPrint' onclick='showHideMap( " + '"Traffic Analysis Zones"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Traffic Analysis Zones' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum=0
			 for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				 theNum=theNum+1
				if (result.layerName == "Traffic Analysis Zones") {
					if (result.feature.attributes["TAZ"] != null) {
						theNum = theNum + 1
						theAssessorHtml = theAssessorHtml + "<table class='reportData' ><tr><td style='width:15px'></td><td style='width:150px'>Traffic Analysis Zone:</td><td> " + result.feature.attributes["TAZ"] +"</td></tr></table>"
					}
				}
			}
			if (theNum==0) {
					theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
			}

		theAssessorHtml +="<a name='BookmarkPlants'></a>"
		theAssessorHtml +="<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>RECOMMENDED PLANTS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		//alert("-"+tmpAddForSFFind + "-"+ "\n" + theLinkAddress)
		var thePlantSearch=""
		if (theSearchType=="Address" && theLinkAddress!="" ){
			thePlantSearch=theLinkAddress
		} else {
			if (tmpAddForSFFind!="" && tmpAddForSFFind!=null ) {
				thePlantSearch=tmpAddForSFFind
			} 
		}
		//theAssessorHtml +="<table class='reportData' ><tr><td style='width:15px'></td><td>Would you like to see what grows best on this property?  Check out <a target='_blank' href='http://SFPlantFinder.org?place=" + thePlantSearch+ "' >SF Plant Finder</a>.</td></tr></table>"
		theAssessorHtml +="<table class='reportData' ><tr><td style='width:15px'></td><td>Would you like to grow plants that create habitat and save water?  Check out the plants that we would recommend for this property at <a target='_blank' href='http://SFPlantFinder.org?place=" + thePlantSearch+ "' >SF Plant Finder</a>.</td></tr></table>"
			
			
		//go through the results array and look for the Addresses that were found at the location.  Add these to the property report HTML.  
		if ((theLoc=="City") && (dept=="PLANNING")) {
			theAssessorHtml +="<a name='BookmarkReportOfResidentialBuildingRecord'></a>"
			if (isLayerVisible("Three-R")) {
				theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>REPORT OF RESIDENTIAL BUILDING RECORD (3-R):* </span><input class='NoPrint' onclick='showHideMap( " + '"Three-R"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Three-R' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>REPORT OF RESIDENTIAL BUILDING RECORD (3-R):* </span><input class='NoPrint' onclick='showHideMap( " + '"Three-R"' + ");' title =                  'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Three-R' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum = 0 
			tempAssessorHtml=""
			for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];		
				if (result.layerName == "Three-R") {
					theNum=theNum + 1
					tempAssessorHtml +=  "<table class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'>Authorized Use:* </td><td>" + result.feature.attributes["AUTHORIZED_USE"] +"</td></tr><tr><td></td><td>Original Use:*</td><td>" + result.feature.attributes["ORIGINAL USE"] + "</td></tr><tr><td></td><td>Occupancy Code:*" + "</td><td>" + result.feature.attributes["OCCUPANCY_CODE"] + "</td></tr><tr><td></td><td>No. of Units:*</td><td>" + result.feature.attributes["NO_OF_UNITS"] + "</td></tr><tr><td></td><td>Parcel:*</td><td>" + result.feature.attributes["BLOCK"]+"/" + result.feature.attributes["LOT"] +"</td></tr><tr><td></td><td>Last Updated:*" + "</td><td>" + result.feature.attributes["UPDATED"] + "</td></tr></table>"
				}
			}
			if (theNum==0) {
				tempAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
			}
			if (theNum>2) {
				theAssessorHtml+="<div id='limitThreeRHTML' style='height:240px;overflow:hidden'>" + tempAssessorHtml + "</div>"
				theAssessorHtml+="<div id='limitThreeRMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitThreeRHTML\",\"limitThreeRMore\",\"240px\");'>more...</a></td></tr></table></div>"
			} else {
				theAssessorHtml += tempAssessorHtml
			}
		}
		
		//SFREIS
		theAssessorHtml +="<a name='BookmarkSFREIS'></a>"
		if (isLayerVisible("City Owned Land")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CITY PROPERTIES: </span><input class='NoPrint' onclick='showHideMap( " + '"City Owned Land"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='City Owned Land' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CITY PROPERTIES: </span><input class='NoPrint' onclick='showHideMap( " + '"City Owned Land"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='City Owned Land' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum = 0 
		tempAssessorHtml=""
		var SFREISStatus=""
		var theSFREISAgency=""
		var theSFREISName= "" 
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "City Owned Land") {
				theNum=theNum + 1
				SFREISStatus=""
				theSFREISAgency = result.feature.attributes["category"] 
				theSFREISName = result.feature.attributes["land_name"] 
				if (theSFREISAgency=="Non-City"){
					theSFREISAgency='Leased from Non-City entity, contact the City & County of San Francisco <a href="http://sfgsa.org/index.aspx?page=11">Real Estate Division</a> for more information.'
				}
				if (result.feature.attributes["Link"]=='' || result.feature.attributes["Link"] ==' ' || result.feature.attributes["Link"] == null || result.feature.attributes["Link"] =="Null") {
					theSFREISLink = theSFREISAgency
				} else {
					var theSFREISLink = "<a target='_blank' href = '" + result.feature.attributes["Link"] + "'>"+ theSFREISAgency +"</a>"
				}
				if (result.feature.attributes["surplus"] ==1) {
					SFREISStatus="Surplus to requirements"
				} else {
					SFREISStatus="Active"
				}
				var SFREISVacant=""
				if (result.feature.attributes["vacant"] ==1) {
					SFREISVacant="Yes"
				} else {
					SFREISVacant="No"
				}
				tempAssessorHtml +=  "<table class='reportData' style='width:100%; border-bottom: solid; border-width: 0px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'>Jurisdiction (Land):</td><td>" + theSFREISName+"</td></tr><tr><td></td><td>Agency:</td><td>" + theSFREISLink + "</td></tr><tr><td></td><td>Status:" + "</td><td>" + SFREISStatus+ "</td></tr><tr><td></td><td>Vacant:</td><td>" + SFREISVacant + "</td></tr></table><br>"
			}
		}
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "City Facilities") {
				if (result.feature.attributes["deptname"] ==theSFREISAgency && result.feature.attributes["facility_n"] ==theSFREISName) {
					//skip it, same as previous
				} else {
					theNum=theNum + 1
					SFREISStatus=""
					theSFREISAgency = result.feature.attributes["deptname"] 
					theSFREISLink = result.feature.attributes["Link"] 
					theSFREISName = result.feature.attributes["facility_n"] 
					if (theSFREISAgency=='Non-City'){
						theSFREISAgency='Leased from a non-City entity, contact the City & County of San Francisco <a href="http://sfgsa.org/index.aspx?page=11">Real Estate Division</a> for more information.'
					}
					if (result.feature.attributes["Link"]=='' || result.feature.attributes["Link"] ==' ' || result.feature.attributes["Link"] == null || result.feature.attributes["Link"] =="Null") {
						theSFREISLink = theSFREISAgency
					} else {
						var theSFREISLink = "<a target='_blank' href = '" + result.feature.attributes["Link"] + "'>"+ theSFREISAgency +"</a>"
					}
					if (result.feature.attributes["surplus"] ==1) {
						SFREISStatus="Surplus to requirements"
					} else {
						SFREISStatus="Active"
					}
					var SFREISVacant=""
					if (result.feature.attributes["vacant"] ==1) {
						SFREISVacant="Yes"
					} else {
						SFREISVacant="No"
					}
					tempAssessorHtml +=  "<table class='reportData' style='width:100%; border-bottom: solid; border-width: 0px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'>Jurisdiction (Facility):</td><td>" + theSFREISName+"</td></tr><tr><td></td><td>Agency:</td><td>" + theSFREISLink + "</td></tr><tr><td></td><td>Status:" + "</td><td>" + SFREISStatus+ "</td></tr><tr><td></td><td>Vacant:</td><td>" + SFREISVacant + "</td></tr></table><br>"
				}
			}
		}
		if (theNum==0) {
			tempAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		if (theNum>3) {
			theAssessorHtml+="<div id='limitCityOwnedHTML' style='height:280px;overflow:hidden'>" + tempAssessorHtml + "</div>"
			theAssessorHtml+="<div id='limitCityOwnedMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitCityOwnedHTML\",\"limitCityOwnedMore\",\"280px\");'>more...</a></td></tr></table></div>"
		} else {
			theAssessorHtml += tempAssessorHtml
		}
		
		
		//PORT FACILITIES
		theAssessorHtml +="<a name='BookmarkSFPortFacilities'></a>"
		if (isLayerVisible("Port Facilities")) {
			theAssessorHtml = theAssessorHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PORT FACILITIES: </span><input class='NoPrint' onclick='showHideMap( " + '"Port Facilities"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Port Facilities' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PORT FACILITIES: </span><input class='NoPrint' onclick='showHideMap( " + '"Port Facilities"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Port Facilities' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum = 0 
		var portFCAS_NO  =""
		var portName = ""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Port Facilities") {
				theNum=theNum + 1
				portFCAS_NO = result.feature.attributes["FCAS_NO"] 
				portName = result.feature.attributes["NAME"] 
				theAssessorHtml +=  "<table class='reportData' style='width:100%; border-bottom: solid; border-width: 0px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'>Port Facility No.:</td><td>" + portFCAS_NO+"</td></tr><tr><td></td><td>Name:</td><td>" + portName + "</td></tr></table>"
			}
		}
		
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		if (theNum>3) {
			theAssessorHtml+="<div id='limitPortFacilitiesHTML' style='height:280px;overflow:hidden'>" + tempAssessorHtml + "</div>"
			theAssessorHtml+="<div id='limitPortFacilitiesMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitPortFacilitiesHTML\",\"limitPortFacilitiesMore\",\"280px\");'>more...</a></td></tr></table></div>"
		} 

		var theBlock = ""
		var tmpBlock=""
		var theBlocktmp=""
		var theBLKLOT=""
		var theSanbornMap=""
		var theSanborn=""
		var theSanbornMapPDF=""
		var SanMapNo=0
		//go through the results array and look for the Sanborn Maps that were found at the location.  Add these to the Sanborn variable (which will later be added to the property report HTML). 
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Sanborn Maps") {
				theSanbornMap = result.feature.attributes["MAPFILE"]
				if (theSanbornMap!="") {
					theSanbornMapPDF = theSanbornMap.toUpperCase().replace(".PNG",".PDF")
					SanMapNo=SanMapNo + 1
					tmpSan=""
					if (SanMapNo>1) {
					    tmpSan=SanMapNo
					}
					if (theSanbornMap != "Null") {
						theSanborn += "<table class='reportData'><tr><td style='width:15px'></td><td colspan=2 class='noprint'><a target='_blank' href='Sanborn.html?sanborn=" + theSanbornMapPDF + "'>View Historic Sanborn Map " + tmpSan + "</a></td></tr></table>"
					}
				}
			}
		}
		
		
		theAssessorHtml +="<a name='BookmarkAssessorsReport'></a>"
		if (isLayerVisible("Assessors")) {
			theAssessorHtml = theAssessorHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ASSESSOR'S REPORT: </span><input class='NoPrint' onclick='showHideMap( " + '"Assessor"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Assessor' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ASSESSOR'S REPORT: </span><input class='NoPrint' onclick='showHideMap( " + '"Assessor"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Assessor' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		
		theAssessorHtml += "<table class='noPrint'> <tr><td style='width:15px'></td><td><a href='http://crmproxy.sfgov.org/Ef3/SSP_Request_For_City_Services.xml?&LSBranch=no&eformTitle=Request%20for%20City%20Services%20-%20Assessor&departments=assessor_recorder&subType=assessor' target='_blank' title='Send Feedback to the Assessors Office'>Send Feedback to the Assessors Office</a></td></tr></table>"
		
		theNum = 0
		tempAssessorHtml=""
		
			//Display the internal Assessor's Report
			var theBLKLOTtmp=""
			for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (result.layerName == "Assessor" ) {
					theNum=theNum+1
					theBLKLOT = result.feature.attributes["BLKLOT"]
					if (theBLKLOTtmp==theBLKLOT) { 
						var owner = result.feature.attributes["OWNER_NAME"] 
						var address1 = result.feature.attributes["OWNER_ADDRESS"]
						var address2 = result.feature.attributes["OWNER_CITY"]
						var address3 = result.feature.attributes["OWNER_STATE"]
						var address4 = result.feature.attributes["OWNER_ZIP"]
						var thePercentage = result.feature.attributes["OWNER_PERCENTAGE"]
						var theAddress=""
						var theMailingAddress=""
						theAddress = owner + "<br>" + address1 + "<br>" + address2 + " " + address3 + ", " + address4
						theMailingAddress = address1 + "<br>" + address2 + " " + address3 + ", " + address4
					} else {
						
						theBLKLOTtmp = theBLKLOT
						var theAssAddress = result.feature.attributes["ADDRESS"]
						
						var RE = result.feature.attributes["LANDVAL"]
						var Improvements = result.feature.attributes["STRUCVAL"]
						var Fixtures = result.feature.attributes["FIXTVAL"]
						var PersonalProperty = result.feature.attributes["OTHRVAL"]
						var tmpExempt1 = result.feature.attributes["HOMEEXEMPT"]
						var tmpExempt2 = result.feature.attributes["MISCEXEMPT"]
						var Taxable = parseFloat((parseFloat(RE) + parseFloat(Improvements) + parseFloat(Fixtures) + parseFloat(PersonalProperty)) - (parseFloat(tmpExempt1) + parseFloat(tmpExempt2)))
						
						var RE = result.feature.attributes["LANDVAL"]
						RE= (RE=="0") ? "-" : formatCurrency(RE); 
						var Improvements = result.feature.attributes["STRUCVAL"]
						Improvements= (Improvements=="0") ? "-" : formatCurrency(Improvements); 
						var Fixtures = result.feature.attributes["FIXTVAL"]
						Fixtures= (Fixtures=="0") ? "-" : formatCurrency(Fixtures); 
						var PersonalProperty = result.feature.attributes["OTHRVAL"]
						PersonalProperty= (PersonalProperty=="0") ? "-" : formatCurrency(PersonalProperty); 
						
						Taxable= (Taxable=="0") ? "-" : formatCurrency(Taxable); 
						var RevenueDistrict = "" //result.feature.attributes["District"]
						var Parcel = result.feature.attributes["BLKLOT"]
						var theYearBuilttmp=""
						
						var BldSqFt = result.feature.attributes["BLDGSQFT"]
						var curPrice = result.feature.attributes["CURRPRICE"]
						var lastSale = result.feature.attributes["CURRSALEDATE"]
						if (BldSqFt > 0) {
							BldSqFt = addCommas(BldSqFt) + " sq ft"
						} else {
							 BldSqFt = "-"
						}
							if (curPrice== 0) {
							curPrice = "-"						
						} else {
							curPrice = formatCurrency(curPrice);
						}
						if ((lastSale == "Null") || (lastSale=="") || (!lastSale) || (lastSale==" ") ) {
							lastSale = "-"
						} else {
							lastSale = lastSale;
						}
						theBlock = result.feature.attributes["BLOCK"]
						var owner = result.feature.attributes["OWNER_NAME"] 
						var address1 = result.feature.attributes["OWNER_ADDRESS"]
						var address2 = result.feature.attributes["OWNER_CITY"]
						var address3 = result.feature.attributes["OWNER_STATE"]
						var address4 = result.feature.attributes["OWNER_ZIP"]
						var thePercentage = result.feature.attributes["OWNER_PERCENTAGE"]
						var theAddress=""
						var theMailingAddress=""
						
						theAddress = owner + "<br>" + address1 + "<br>" + address2 + " " + address3 + ", " + address4
						theMailingAddress = address1 + "<br>" + address2 + " " + address3 + ", " + address4
								
						theBlocktmp = result.feature.attributes["BLOCK"] //.substring(0,4)
						if (tmpBlock!=theBlocktmp) {
							theURLtmp = 'http://' + theServerName +'/FileSearch/SearchService.asmx/GetLatestPDFinD'
							theParamstmp = "inpath=E:/GIS Data/ParcelInfo/BlockBooks&insearchname=AssessorBlock" + theBlocktmp.substring(0,4)  //result.feature.attributes["BLOCK_NUM"].substring(0,4)
							getPDFDoc(theURLtmp,theParamstmp)
						}
						
						tmpBlock=theBlocktmp
						theDoc=document.getElementById('Doc1').innerHTML
							
						if (theDoc=="Not Found") {
							theBlockBooktmp="" //"Assessor's Block Map not available"
						}else {
							theDoc = theDoc.replace("E:/GIS Data/ParcelInfo/BlockBooks","" )
							theBlockBooktmp="<a target='_blank' href = 'http://" + theServerName + "/BlockBooks" + theDoc + "'>View Assessor's Block Map</a>"
						}
							
						var theLotArea = addCommas(result.feature.attributes["LOTAREA"]) 
						if (result.feature.attributes["LOTAREA"] > 0) {
							theLotArea = theLotArea + " sq ft"
						} else {
							 theLotArea = "-"
						}
						
						theYearBuilttmp = result.feature.attributes["YRBUILT"] 
						if ((theYearBuilttmp < theYearBuilt) || (theYearBuilt==0)) {
							theYearBuilt=theYearBuilttmp
						}
						if (theYearBuilttmp>1800) {
						} else {
							theYearBuilttmp="-"
						}
						var theUnits = result.feature.attributes["UNITS"]
						if (theUnits>0) {
						} else {
							theUnits="-"
						}
						var theStories = result.feature.attributes["STORIES"]
						if (theStories>0) {
						} else {
							theStories="-"
						}
						var theUse = result.feature.attributes["DESCRIPTION"] 
						var theConstruction = result.feature.attributes["ConstrDesc"]
						var theRooms = result.feature.attributes["ROOMS"]
						if (theRooms>0) {
						} else {
							theRooms="-"
						}
						var theBedrooms = result.feature.attributes["BEDROOMS"]
						if (theBedrooms>0) {
						} else {
							theBedrooms="-"
						}
						var theBathrooms = result.feature.attributes["BATHROOMS"]
						if (theBathrooms>0) {
						} else {
							theBathrooms="-"
						}
						var theShape = result.feature.attributes["LOTSHAPE"]
						if (theShape=="" || theShape ==" " || theShape=="Null") {
							theShape="-"
						}
						var theFrontage = result.feature.attributes["LOTFRONTAGE"]
						if (theFrontage>0) {
							theFrontage += " ft"
						} else {
							theFrontage="-"
						}
						var theDepth = result.feature.attributes["LOTDEPTH"]
						if (theDepth>0) {
							theDepth += " ft"
						} else {
							theDepth="-"
						}
						var theOwnerDate = result.feature.attributes["OWNER_DATE"] //result.feature.attributes["ENTRYMM"] +"/" + result.feature.attributes["ENTRYDD"] + "/" +result.feature.attributes["ENTRYYY"]
							
						tempAssessorHtml += "<table class='reportData' style='width:100%;border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Address:</td><td>" + theAssAddress + "</td></tr>"
						if ((theLoc=="City") && (dept=="PLANNING")) {
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Mailing Address:*</td><td>" + theMailingAddress + "</td></tr>"
						}
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Parcel:</td><td>" + Parcel + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Assessed Values:</td><td></td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'> &nbsp &nbsp Land:</td><td>" + RE + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'> &nbsp &nbsp Structure:</td><td>" + Improvements + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'> &nbsp &nbsp Fixtures:</td><td>" + Fixtures + "</td></tr>"
						tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'> &nbsp &nbsp Personal Property:</td><td>" + PersonalProperty + "</td></tr>"
						if ((theLoc=="City") && (dept=="PLANNING")) {
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Last Sale:*</td><td>" + lastSale + "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Last Sale Price:*</td><td>" + curPrice + "</td></tr>"
						}
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Year Built:</td><td>" + theYearBuilttmp + "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Building Area:</td><td>" + BldSqFt + "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Parcel Area:</td><td>" + theLotArea + "</td></tr>"
						if ((theLoc=="City") && (dept=="PLANNING")) {
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Parcel Shape:*</td><td>" + theShape+ "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Frontage:*</td><td>" + theFrontage+ "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Depth:*</td><td>" + theDepth + "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Construction Type:*</td><td>" + theConstruction + "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Use Type:*</td><td>" + theUse + "</td></tr>"
						}
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Units:</td><td>" + theUnits + "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Stories:</td><td>" + theStories + "</td></tr>"
						if ((theLoc=="City") && (dept=="PLANNING")) {
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Rooms:*</td><td>" + theRooms + "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Bedrooms:*</td><td>" + theBedrooms + "</td></tr>"
							tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Bathrooms:*</td><td>" + theBathrooms + "</td></tr>"
							if (thePercentage==100) {
									tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Owner:*</td><td>" + theAddress + "</td></tr>"
									tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Owner Date:*</td><td>" + theOwnerDate + "</td></tr>"
								} else {
									for (var ii = 0; ii < idResults.length; ii++) {
										var tempresult = idResults[ii];
										if (tempresult.layerName == "Assessor" && tempresult.feature.attributes["BLKLOT"] == theBLKLOT ){	
											var ownertmp = tempresult.feature.attributes["OWNER_NAME"] 
											var address1tmp = tempresult.feature.attributes["OWNER_ADDRESS"]
											var address2tmp = tempresult.feature.attributes["OWNER_CITY"]
											var address3tmp = tempresult.feature.attributes["OWNER_STATE"]
											var address4tmp = tempresult.feature.attributes["OWNER_ZIP"]
											var thePercentagetmp = tempresult.feature.attributes["OWNER_PERCENTAGE"]
											var theAddresstmp=""
											var theMailingAddresstmp=""
											var theAddresstmp = ownertmp + "<br>" + address1tmp + "<br>" + address2tmp + " " + address3tmp + ", " + address4tmp
											var theMailingAddresstmp = address1tmp + "<br>" + address2tmp + " " + address3tmp + ", " + address4tmp
											var theOwnerDatetmp = tempresult.feature.attributes["OWNER_DATE"]
											
											tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Owner:*<br>(" + thePercentagetmp + "%) </td><td>" + theAddresstmp+ "</td></tr>"
											tempAssessorHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Owner Date:*</td><td>" + theOwnerDatetmp + "</td></tr>"
										}
									}
									
								}
							
						}
							
						//theBlocktmp = result.feature.attributes["BLOCK"] //.substring(0,4)
						//if (tmpBlock!=theBlocktmp) {
						//	theURLtmp = 'http://' + theServerName +'/FileSearch/SearchService.asmx/GetLatestPDFinD'
						//	theParamstmp = "inpath=E:/GIS Data/ParcelInfo/BlockBooks&insearchname=AssessorBlock" + theBlocktmp.substring(0,4)  //result.feature.attributes["BLOCK_NUM"].substring(0,4)
						//	getPDFDoc(theURLtmp,theParamstmp)
						//}
						tmpBlock=theBlocktmp
						theRecordDocLink="http://www.criis.com/cgi-bin/new_get_recorded.cgi/?county=sanfrancisco&SEARCH_TYPE=APN&COUNTY=san%20francisco&YEARSEGMENT=current&ORDER_TYPE=Recorded%20Official&LAST_RECORD=1&SCREENRETURN=doc_search.cgi&SCREEN_RETURN_NAME=Recorded%20Document%20Search"
						theRecordDocLink+="&BLOCK="+theBlocktmp+"&LOT="+result.feature.attributes["LOT"] 
						tempAssessorHtml +=  "<tr><td></td><td colspan=2 class='noprint'><a target='_blank' href='"+ theRecordDocLink+ "'>Recorded Documents for this property</a></td></tr></table><br>"
						
						//theDoc=document.getElementById('Doc1').innerHTML
						
						//if (theDoc=="Not Found") {
						//	theBlockBooktmp="" //"Assessor's Block Map not available"
						//}else {
						//	theDoc = theDoc.replace("E:/GIS Data/ParcelInfo/BlockBooks","" )
						//	theBlockBooktmp="<a target='_blank' href = 'http://" + theServerName + "/BlockBooks" + theDoc + "'>View Assessor's Block Map</a>"
						//}
						//tempAssessorHtml+="<tr><td></td><td colspan=2 class='noprint'>" + theBlockBooktmp +"</td></tr>"
						//if ((theLoc=="City") && (dept=="PLANNING")) {
						//	tempAssessorHtml +=  "<tr><td></td><td colspan=2 class='noprint'><a target='_blank' href='http://cityplan-arc10/InfoVol/Maps/Block Books/"+ theBlocktmp+ ".pdf'>View Planning Department Block Map*</a></td></tr>"
						//	tempAssessorHtml +=  "<tr><td></td><td colspan=2 class='noprint'><a target='_blank' href='http://cityplan-arc10/InfoVol/Maps/Block Books/"+ theBlocktmp + "_2.pdf'>View Planning Department Historic Block Map*</a></td></tr>"
						//}
						//tempAssessorHtml += theSanborn
						
					}
				}
			}
			if (theNum==0) {
				tempAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table><br>"
			}
			if (theNum>2) {
				if (theLoc=="City" && dept=="PLANNING") {
					var pixelHeight="1365px"
				} else {
					var pixelHeight="660px"
				}
				theAssessorHtml+="<div id='limitAssessorsReportHTML' style='height:" + pixelHeight + ";overflow:hidden'>" + tempAssessorHtml + "</div>"
				theAssessorHtml+="<div id='limitAssessorsReportMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitAssessorsReportHTML\",\"limitAssessorsReportMore\",\" "+ pixelHeight + "\");'>more...</a></td></tr></table></div><br>"
			} else {
				theAssessorHtml += tempAssessorHtml
			}
	tempAssessorHtml2=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Blocks" ) {
			tempAssessorHtml2 += "<table class='reportData' style='width:100%;'>"
			theBlocktmp = result.feature.attributes["BLOCK_NUM"] //.substring(0,4)
			if (tmpBlock!=theBlocktmp) {
				theURLtmp = 'http://' + theServerName +'/FileSearch/SearchService.asmx/GetLatestPDFinD'
				theParamstmp = "inpath=E:/GIS Data/ParcelInfo/BlockBooks&insearchname=AssessorBlock" + theBlocktmp.substring(0,4)  //result.feature.attributes["BLOCK_NUM"].substring(0,4)
				getPDFDoc(theURLtmp,theParamstmp)
			}
			tmpBlock=theBlocktmp
			//theRecordDocLink="http://www.criis.com/cgi-bin/new_get_recorded.cgi/?county=sanfrancisco&SEARCH_TYPE=APN&COUNTY=san%20francisco&YEARSEGMENT=current&ORDER_TYPE=Recorded%20Official&LAST_RECORD=1&SCREENRETURN=doc_search.cgi&SCREEN_RETURN_NAME=Recorded%20Document%20Search"
			//theRecordDocLink+="&BLOCK="+theBlocktmp+"&LOT="+result.feature.attributes["LOT"] 
			//tempAssessorHtml2 +=  "<tr><td style='width:15px'><td colspan=2 class='noprint'><a target='_blank' href='"+ theRecordDocLink+ "'>Recorded Documents for this property</a></td></tr>"
				
			theDoc=document.getElementById('Doc1').innerHTML
				
			if (theDoc=="Not Found") {
				theBlockBooktmp="" //"Assessor's Block Map not available"
			}else {
				theDoc = theDoc.replace("E:/GIS Data/ParcelInfo/BlockBooks","" )
				theBlockBooktmp="<a target='_blank' href = 'http://" + theServerName + "/BlockBooks" + theDoc + "'>View Assessor's Block Map</a>"
			}
			tempAssessorHtml2+="<tr><td style='width:15px'></td><td colspan=2 class='noprint'>" + theBlockBooktmp +"</td></tr>"
			if ((theLoc=="City") && (dept=="PLANNING")) {
				tempAssessorHtml2 +=  "<tr><td></td><td colspan=2 class='noprint'><a target='_blank' href='http://cityplan-arc10/InfoVol/Maps/Block Books/"+ theBlocktmp+ ".pdf'>View Planning Department Block Map*</a></td></tr>"
				tempAssessorHtml2 +=  "<tr><td></td><td colspan=2 class='noprint'><a target='_blank' href='http://cityplan-arc10/InfoVol/Maps/Block Books/"+ theBlocktmp + "_2.pdf'>View Planning Department Historic Block Map*</a></td></tr>"
			}
			tempAssessorHtml2 += "</table>"
			//prompt("",theSanborn)
			tempAssessorHtml2 += theSanborn
		}
	}
	theAssessorHtml += tempAssessorHtml2

				
	if (theLoc=="City") {
		theAssessorHtml += "<br><table class='reportData' ><tr><td style='width:15px'></td><td>* Fields marked with an asterisk are only visible to City staff. </td></tr></table>"
	}

	theAssessorHtml = theAssessorHtml.replace(/Null/gi,"&nbsp");
	theAssessorHtml = theAssessorHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theAssessorHtml += "<p class='NoPrint'><br></p>"
	theAssessorHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkPropertyTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	theAssessorHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	
	//publish the HTML to the page
	document.getElementById('AssessorReport').innerHTML = theAssessorHtml
	}
	var theBM=gup("bookmark").toUpperCase()
	switch(theBM) {
		case "BLOCKS":
			jumpToBookmark('#BookmarkBlocks')
			break;
		case "PARCELS":
			jumpToBookmark('#BookmarkParcels')
			break;
		case "PARCELHISTORY":
			jumpToBookmark('#BookmarkParcelHistory')
			break;
		case "ADDRESSES":
			jumpToBookmark('#BookmarkAddresses')
			break;
		case "NEIGHBORHOOD":
			jumpToBookmark('#BookmarkNeighborhood')
			break;
		case "CURRENTPLANNINGTEAM":
			jumpToBookmark('#BookmarkCurrentPlanningTeam')
			break;
		case "SUPERVISORDISTRICT":
			jumpToBookmark('#BookmarkSupervisorDistrict')
			break;
		case "CENSUSTRACTS":
			jumpToBookmark('#BookmarkCensusTracts')
			break;
		case "TRAFFICANALYSISZONE":
			jumpToBookmark('#BookmarkTrafficAnalysisZone')
			break;
		case "REPORTOFRESIDENTIALBUILDINGRECORD":
			jumpToBookmark('#BookmarkReportOfResidentialBuildingRecord')
			break;
		case "SFREIS":
			jumpToBookmark('#BookmarkSFREIS')
			break;
		case "ASSESSORSREPORT":
			jumpToBookmark('#BookmarkAssessorsReport')
		default:
			break;
	}
	//updateZoningHtml();
	
}

function updateZoningHtml() {
//go through the results array and look for the Zoning Districts that were found at the location.  Add these to the zoning report HTML.  
	//alert("here")
	var showProx=false;
	 for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];		
		if (result.layerName == "Zoning - Zoning Districts") {
			if (result.feature.attributes["ZONING_SIM"] != null) {
				if (result.feature.attributes["ZONING_SIM"] =="NC-1") {
					showProx=true;
					break;
				}
			}
		}
	}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Limited and Nonconforming Uses") {
				showProx=true;
				break;
		}
	}
	theZoningHtml += "<table class='NoPrint'><tr><td style='padding-left:15px'><a target='_blank' href='MapHelp.html#ZoningGlossary'>Glossary </a></td></tr></table><br>"
	theZoningHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Planning Department Zoning and other regulations.</td></tr></table>"
	theZoningHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkZoningDistricts'>Zoning Districts</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkHeightAndBulkDistricts'>Height & Bulk Districts</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkSpecialUseDistricts'>Special Use Districts</a></td></tr></table>"
	if (showProx) {
		theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkProximityToNCD'>Proximity to Neighborhood-Commercial Districts/Restricted Use Districts</a></td></tr></table>"
	}
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkSpecialSignDistricts'>Special Sign Districts</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkLegislativeSetbacks'>Legislative Setbacks</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkCoastalZone'>Coastal Zone</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkPort'>Port</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkLimitedAndNonconformingUses'>Limited And Nonconforming Uses</a></td></tr></table>"
	
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkNeighborhoodSpecificImpactFeeAreas'>Neighborhood-Specific Impact Fee Areas</a></td></tr></table>"
	
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkRedevelopmentAreas'>Redevelopment Areas</a></td></tr></table>"
	
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkOtherInformation'>Other Information</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkPlanningAreas'>Planning Areas</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkMayorsInvestinNeighborhoodsInitiativeArea'>Mayor's Invest in Neighborhoods Initiative Area</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkCommunityBenefitDistrict'>Community Benefit District</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkSchools'>Schools</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkNoticeOfSpecialRestrictions'>Notice Of Special Restrictions</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkZoningLettersOfDetermination'>Zoning Letters Of Determination</a></td></tr></table>"
	theZoningHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkOfficialZoningMaps'>Official Zoning Maps</a></td></tr></table>"
	
	theZoningHtml +="<br></div>"
	
	
	
	
	
	theZoningHtml +="<a name='BookmarkZoningDistricts'></a>"
	if (isLayerVisible("Zoning - Zoning Districts")) {
		theZoningHtml = theZoningHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZONING DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Zoning Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Zoning Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZONING DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Zoning Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Zoning Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	 for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];		
		if (result.layerName == "Zoning - Zoning Districts") {
			if (result.feature.attributes["ZONING_SIM"] != null) {
				theNum = theNum + 1
				theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["ZONING_SIM"] + " - <a target='_blank' href = '" + result.feature.attributes["URL"] +"'>" + result.feature.attributes["DISTRICTNAME"] + "</a></td></tr></table>"
				if (result.feature.attributes["ZONING_SIM"] =="NC-1") {
					showProx=true;
				}
			}
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
			
	//go through the results array and look for the Height Districts that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkHeightAndBulkDistricts'></a>"
	if (isLayerVisible("Zoning - Height Districts")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>HEIGHT & BULK DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Height Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Height Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>HEIGHT & BULK DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Height Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Height Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Height Districts") {
			theHeight = String(result.feature.attributes["HEIGHT"])
			if (result.feature.attributes["HEIGHT"] != undefined && theHeight !='Null') {
				theNum = theNum + 1
				theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://www.amlegal.com/nxt/gateway.dll/California/planning/article25heightandbulkdistricts?f=templates$fn=default.htm$3.0$vid=amlegal:sanfrancisco_ca'>" + result.feature.attributes["HEIGHT"] + "</a></td></tr></table>"
			}
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
			
	//go through the results array and look for the SUDs that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkSpecialUseDistricts'></a>"
	if (isLayerVisible("Zoning - Special Use Districts")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SPECIAL USE DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Special Use Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Special Use Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SPECIAL USE DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Special Use Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Special Use Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Special Use Districts") {
			if (result.feature.attributes["NAME"] != null) {
				theNum = theNum + 1
				if (result.feature.attributes["URL"] != "Null") {
					theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td><a href='" + result.feature.attributes["URL"] + "' target='_blank'>" + result.feature.attributes["NAME"] + "</a></td></tr></table>"
				} else {
					theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["NAME"] + "</td></tr></table>"
				}
			}
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}

			
	//go through the results array and look for the NCD/RUD 0.25 mile buffer areas that were found at the location.  Add these to the zoning report HTML.  
	if (showProx) {
		theZoningHtml +="<a name='BookmarkProximityToNCD'></a>"
		if (isLayerVisible("NCD RUD 0.25Mile Buffer")) {
			theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PROXIMITY TO NEIGHBORHOOD-COMMERCIAL</span><br><span class='reportSectionHead'>DISTRICTS AND RESTRICTED USE DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"NCD RUD 0.25Mile Buffer"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='NCD RUD 0.25Mile Buffer' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PROXIMITY TO NEIGHBORHOOD-COMMERCIAL</span><br><span class='reportSectionHead'>DISTRICTS AND RESTRICTED USE DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"NCD RUD 0.25Mile Buffer"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='NCD RUD 0.25Mile Buffer' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		theNum = 0
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "NCD RUD 0.25Mile Buffer") {
				if (result.feature.attributes["DISTRICTNAME"] != null) {
					theNum = theNum + 1
					if (result.feature.attributes["URL"] != "Null") {
						theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>Within 1/4 mile of <a href='" + result.feature.attributes["URL"] + "' target='_blank'>" + result.feature.attributes["DISTRICTNAME"] + "</a></td></tr></table>"
					} else {
						theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>Within 1/4 mile of  " + result.feature.attributes["DISTRICTNAME"] + "</td></tr></table>"
					}
				}
			}
		}
		if (theNum==0) {
			theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None within 1/4 mile.</td></tr></table>"
		}
	}
	//go through the results array and look for the SSDs that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkSpecialSignDistricts'></a>"
	if (isLayerVisible("Zoning - Special Sign Districts")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SPECIAL SIGN DISTRICTS: </SPAN><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Special Sign Districts"' + ");' title = 'Add to map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Special Sign Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SPECIAL SIGN DISTRICTS: </SPAN><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Special Sign Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Special Sign Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Special Sign Districts") {
			if (result.feature.attributes["SSD_NAME"] != null) {
				theNum = theNum + 1
				if (result.feature.attributes["URL"] != "Null") {
					theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td style='width:150px'>Name:</td><td>" + result.feature.attributes["SSD_NAME"] + "</td></tr><tr><td></td><td> Code Section: </td><td><a target='_blank' href='" + result.feature.attributes["URL"] + "'>" + result.feature.attributes["CODE_SEC"] + "</a></td></tr><tr><td></td><td> Restriction: </td><td>" + result.feature.attributes["RESTRICT"] + "</td></tr></table>"
				} else {
					theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td style='width:150px'>Name:</td><td>" + result.feature.attributes["SSD_NAME"] + "</td></tr><tr><td></td><td> Code Section: </td><td>" + result.feature.attributes["CODE_SEC"] + "</td></tr><tr><td></td><td> Restriction: </td><td>" + result.feature.attributes["RESTRICT"] + "</td></tr></table>"
				}
			}
		}
	}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - SSD Scenic Streets") {
			if (result.feature.attributes["FID_SSTREE"] != null) {
				theNum = theNum + 1
				theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>In a <a target='_blank' href = 'http://www.amlegal.com/nxt/gateway.dll/California/planning/article6signs?f=templates$fn=default.htm$3.0$vid=amlegal:sanfrancisco_ca$anc=JD_609.6'> Scenic Streets SSD</a></td></tr></table>"
			}
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
			
	//go through the results array and look for the Setbacks that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkLegislativeSetbacks'></a>"
	if (isLayerVisible("Zoning - Setbacks")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>LEGISLATIVE SETBACKS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Setbacks"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Setbacks' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>LEGISLATIVE SETBACKS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Setbacks"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Setbacks' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Setbacks") {
			if (result.feature.attributes["SETBACK_DI"] != null) {
				theNum = theNum + 1
				theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://www.amlegal.com/nxt/gateway.dll/California/planning/article12dimensionsareasandopenspaces?f=templates$fn=default.htm$3.0$vid=amlegal:sanfrancisco_ca$anc=JD_132'>" + result.feature.attributes["SETBACK_DI"] + " ft</a></td></tr></table>"
			}
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
			
	//go through the results array and look for the Coastal Zone that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkCoastalZone'></a>"
	if (isLayerVisible("Zoning - Coastal Zone")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>COASTAL ZONE: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Coastal Zone"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Coastal Zone' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>COASTAL ZONE: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Coastal Zone"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Coastal Zone' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Coastal Zone") {
			if (result.feature.attributes["LABEL"] == "Coastal Zone1") {
				theNum = theNum + 1
				theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>In the <a target='_blank' href='http://www.amlegal.com/nxt/gateway.dll/California/planning/article3zoningprocedures?f=templates$fn=default.htm$3.0$vid=amlegal:sanfrancisco_ca$anc=JD_330'> Coastal Zone<a/></td></tr></table>"
			}
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>Not in the Coastal Zone</td></tr></table>"
	}
			
	//go through the results array and look for the Port Jurisdiction that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkPort'></a>"
	if (isLayerVisible("Zoning - Port Jurisdiction")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PORT: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Port Jurisdiction"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Port Jurisdiction' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PORT: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Port Jurisdiction"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Port Jurisdiction' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Port Jurisdiction") {
			if (result.feature.attributes["PORTJUR_ID"] != null) {
				theNum = theNum + 1
				theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>Under the jurisdiction of <a href='http://www.sfport.com/' target='_blank'>SF Port </a></td></tr></table>"
			}
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>Not under Port Jurisdiction</td></tr></table>"
	}
			
	//go through the results array and look for the NCUs and LCUs that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkLimitedAndNonconformingUses'></a>"
	if (isLayerVisible("Zoning - Limited and Nonconforming Uses")) {
		theZoningHtml +="<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>LIMITED AND NONCONFORMING USES: <input class='NoPrint' onclick='showHideMap( " + '"Zoning - Limited and Nonconforming Uses"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Limited and Nonconforming Uses' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>LIMITED AND NONCONFORMING USES: <input class='NoPrint' onclick='showHideMap( " + '"Zoning - Limited and Nonconforming Uses"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Limited and Nonconforming Uses' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zoning - Limited and Nonconforming Uses") {
			if (result.feature.attributes["NL"] != null) {
				theNum = theNum + 1
				theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["NL"] + " " + result.feature.attributes["VIOL"] + " Block: "+ result.feature.attributes["BLOCK_NUM"] + " Lot: " + result.feature.attributes["LOT_NUM"] + "</td></tr></table>"
				
				if ((theLoc=="City") && (dept=="PLANNING")) {
					theURLtmp = 'http://' + theServerName +'/FileSearch/SearchService.asmx/GetLatestPDFinD'
					theParamstmp = "inpath=E:/GIS Data/ParcelInfo/docs/NCULCU&insearchname=" + result.feature.attributes["BLOCK_NUM"] + result.feature.attributes["LOT_NUM"] + "-1"
					getPDFDoc(theURLtmp,theParamstmp)
					theDoc=""
					theDoc=document.getElementById('Doc1').innerHTML
					if (theDoc!="Not Found") {
						theDoc = theDoc.replace("E:/GIS Data/ParcelInfo/","http://" + theServerName + "/")
						theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + theDoc + "'>View " +result.feature.attributes["NL"] +" Doc 1*</a></td></tr></table>"
					}
					theParamstmp = "inpath=E:/GIS Data/ParcelInfo/docs/NCULCU&insearchname=" + result.feature.attributes["BLOCK_NUM"] + result.feature.attributes["LOT_NUM"] + "-2"
					getPDFDoc(theURLtmp,theParamstmp)
					theDoc=""
					theDoc=document.getElementById('Doc1').innerHTML
					if (theDoc!="Not Found") {
						theDoc = theDoc.replace("E:/GIS Data/ParcelInfo/","http://" + theServerName + "/")
						theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + theDoc + "'>View " +result.feature.attributes["NL"] +" Doc 2*</a></td></tr></table>"
					}
					theParamstmp = "inpath=E:/GIS Data/ParcelInfo/docs/NCULCU&insearchname=" + result.feature.attributes["BLOCK_NUM"] + result.feature.attributes["LOT_NUM"] + "-3"
					getPDFDoc(theURLtmp,theParamstmp)
					theDoc=""
					theDoc=document.getElementById('Doc1').innerHTML
					if (theDoc!="Not Found") {
						theDoc = theDoc.replace("E:/GIS Data/ParcelInfo/","http://" + theServerName + "/")
						theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + theDoc + "'>View " +result.feature.attributes["NL"] +" Doc 3*</a></td></tr></table>"
					}
				}
				
			}
		}
	}
	if (theNum==0) {
		theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	//go through the results array and look for the Impact Fee Areas that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkNeighborhoodSpecificImpactFeeAreas'></a>"
	if (isLayerVisible("Neighborhood-Specific Impact Fee Areas")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOOD-SPECIFIC IMPACT FEE AREAS: </SPAN><input class='NoPrint' onclick='showHideMap( " + '"Neighborhood-Specific Impact Fee Areas"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Neighborhood-Specific Impact Fee Areas' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOOD-SPECIFIC IMPACT FEE AREAS: </SPAN><input class='NoPrint' onclick='showHideMap( " + '"Neighborhood-Specific Impact Fee Areas"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Neighborhood-Specific Impact Fee Areas' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>In addition to those impact fees that apply throughout the City, the following neighborhood-specific impact fees apply to this particular property:</td></tr></table><br>"
			
	var foundENTier=false;
	var foundEN=false;
			
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Neighborhood-Specific Impact Fee Areas") {
			if (result.feature.attributes["FEE"] == "Eastern Neighborhoods Infrastructure Impact Fee") {
				foundEN=true;
			}
			if (result.feature.attributes["FEE"].substring(0,54) == "Eastern Neighborhoods Infrastructure Impact Fee - Tier") {
				foundENTier=true;
			}
		}
	}

	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Neighborhood-Specific Impact Fee Areas") {
			if (result.feature.attributes["FEE"] == "Eastern Neighborhoods Infrastructure Impact Fee") {
				if (foundENTier && foundEN) {
					
				} else  {
					theNum = theNum + 1
					theZoningHtml += "<table class='reportData'><tr><td style='width:30px'></td><td><a target='_blank' href='" + result.feature.attributes["URL"] + "'>"+ result.feature.attributes["FEE"] + "</a></td></tr></table>"
				}
			} else {
				if (result.feature.attributes["FEE"] != null) {
					theNum = theNum + 1
					theZoningHtml += "<table class='reportData'><tr><td style='width:30px'></td><td><a target='_blank' href='" + result.feature.attributes["URL"] + "'>"+ result.feature.attributes["FEE"] + "</a></td></tr></table>"
				}
			}
		}
	}
		
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:30px'></td><td>None</td></tr></table>"
	} 
	
	theZoningHtml += "<br><table class='reportData'><tr><td style='width:15px'></td><td>An overview of Development Impact Fees can be found on the <a target='_blank' href='http://impactfees.sfplanning.org'>Impact Fees</a> website.</td></tr></table>"
			
	
	//go through the results array and look for the SFRA that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkRedevelopmentAreas'></a>"
			if (isLayerVisible("Zoning - SF Redevelopment Areas")) {
				theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>REDEVELOPMENT AREAS: </SPAN><input class='NoPrint' onclick='showHideMap( " + '"Zoning - SF Redevelopment Areas - 2012"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - SF Redevelopment Areas - 2012' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>REDEVELOPMENT AREAS: </SPAN><input class='NoPrint' onclick='showHideMap( " + '"Zoning - SF Redevelopment Areas - 2012"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - SF Redevelopment Areas - 2012' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			theNum = 0
			
			for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (result.layerName == "Zoning - SF Redevelopment Areas - 2012") {
					var theExpiration = ""
					
					 if (result.feature.attributes["EXPIRATION"] > 0) {
						if (result.feature.attributes["EXPIRATION"] > 2012) {
							theExpiration = "Expires " + result.feature.attributes["EXPIRATION"]
						} else {
							theExpiration = "Expired " + result.feature.attributes["EXPIRATION"]
						}
					} else {
						theExpiration = ""
					}
					
					if (result.feature.attributes["PROJECT_AR"] != null) {
						theNum = theNum + 1
						theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td style='width:150px'>Redevelopment Area:</td><td><a target='_blank' href='" + result.feature.attributes["Link2"] + "'>"+ result.feature.attributes["PROJECT_AR"] + " (" + theExpiration+ ")</a></td></tr>"
						if (result.feature.attributes["JURISDICTION"]=="Oversight Board") {
							theZoningHtml += "<tr><td></td><td>Jurisdiction: </td><td><a target='_blank' href='http://www.sfgov.org/oversightboard'>"+ result.feature.attributes["JURISDICTION"]+"</a></td></tr>"
						} else {
							if (result.feature.attributes["JURISDICTION"]=="City Administrator") {
								theZoningHtml += "<tr><td></td><td>Jurisdiction: </td><td><a target='_blank' href='http://www.sfredevelopment.org'>"+ result.feature.attributes["JURISDICTION"]+"</a></td></tr>"
							} else {
								theZoningHtml += "<tr><td></td><td>Jurisdiction: </td><td>"+ result.feature.attributes["JURISDICTION"]+"</td></tr>"
							
							}
						}
							
						if (result.feature.attributes["Link"]=="" || result.feature.attributes["Link"]==null || result.feature.attributes["Link"]=="Null") {
							theZoningHtml += "<tr><td></td><td>Reason for Jurisdiction:</td><td>"+result.feature.attributes["REASON"]+"</td></tr>"
						} else {
							theZoningHtml += "<tr><td></td><td>Reason for Jurisdiction:</td><td>"+result.feature.attributes["REASON"]+": <a target='_blank' href='"+ result.feature.attributes["Link"] + "'> Ordinance Document</a></td></tr>"
						}
						theZoningHtml += "</table>"
					}
				}
			}
			if (theNum==0) {
				theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
			}
			
	//go through the results array and look for the 'Other Regulations' that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkOtherInformation'></a>"
	theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>OTHER INFORMATION: </span></td></tr></table>"
	theNum = 0
	var theLastOtherInfo=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Planning Provisions") {
			if (result.feature.attributes["PROVISION_TYPE"] != null && (result.feature.attributes["PROVISION_TYPE"] !=theLastOtherInfo)) {
				theLastOtherInfo = result.feature.attributes["PROVISION_TYPE"] 
				theNum = theNum + 1
				var currentTime = new Date()
				var expireDate = new Date(result.feature.attributes["DATE_EXPIRED"])
				var hasExpired=false;
				
				if (expireDate.getTime() < currentTime.getTime()) {  //expireDate.getTime() 
					hasExpired=true;
				}
				if (result.feature.attributes["PROVISION_TYPE"] =="Archeologically Sensitive Area") {
					if (theLoc=="City" && dept=="PLANNING") {
						 theZoningHtml += "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'><i>Control:* </i></td><td><i>" + result.feature.attributes["PROVISION_TYPE"]
							if (hasExpired) {
							theZoningHtml += " (EXPIRED)"
						}
						if ((result.feature.attributes["PROVISION_VALUE"] == null) || (result.feature.attributes["PROVISION_VALUE"] =="") || (result.feature.attributes["PROVISION_VALUE"] ==" ") | (result.feature.attributes["PROVISION_VALUE"] =="Null")){
						} else {
							theZoningHtml += "</i></td></tr><tr><td></td><td>"+ "Value:* </td><td>" + result.feature.attributes["PROVISION_VALUE"] + "</td></tr>"
						}
						theZoningHtml += "<tr><td></td><td>Description:* </td><td>" + result.feature.attributes["TYPE_DESCRIPTION"] +  "</td></tr>"
						if ((result.feature.attributes["DOCUMENT"] == "Null") ||(result.feature.attributes["DOCUMENT"] == undefined) || (result.feature.attributes["DOCUMENT"] == "") || (result.feature.attributes["DOCUMENT"]==null)  ) {
						} else { 
							if (( result.feature.attributes["DOCUMENT"].substring(0,4).toUpperCase()=="WWW.") || ( result.feature.attributes["DOCUMENT"].substring(0,4).toUpperCase()=="HTTP") ){
								theZoningHtml += "<tr><td></td><td> </td><td><a class='NoPrint' target='_blank' href='"  + result.feature.attributes["DOCUMENT"] + "'>Read more about this regulation</a></td></tr>"
							} else {
								theZoningHtml += "<tr><td></td><td> </td><td><a class='NoPrint' target='_blank' href='/docs/PlanningProvisions/"  + result.feature.attributes["DOCUMENT"] + "'>Read more about this regulation</a></td></tr>"
							}
						}
							tmpDate = result.feature.attributes["DATE_INTRODUCED"].split(" ");
							theZoningHtml +="<tr><td></td><td>Added:*</td><td>"+ tmpDate[0] + "</td></tr>"
							tmpDate = result.feature.attributes["DATE_EXPIRED"].split(" ");
							if (tmpDate!="Null") {
								theZoningHtml +="<tr><td></td><td>Expires:*</td><td>"+ tmpDate[0] + "</td></tr>"
							}
						if (theLoc=="City" && dept=="PLANNING") {
							theZoningHtml +="<tr><td></td><td>Planner:*</td><td>"+ result.feature.attributes["STAFF_CONTACT"]; + "</td></tr>"
						}
						theZoningHtml = theZoningHtml + "</table><br>"	
					}	
				} else {
					theZoningHtml += "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'><i>Control: </i></td><td><i>" + result.feature.attributes["PROVISION_TYPE"] + "&nbsp;&nbsp;<input class='NoPrint' onclick='showHideMap( " + '"Planning Provisions"' + ',"' + result.feature.attributes["PROVISION_TYPE"]  +'"' + ");' name='Planning Provisions' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='" +result.feature.attributes["PROVISION_TYPE"] +"' type='image' src = 'images/map-icon-off.png' />"
					if (hasExpired) {
						theZoningHtml += " (EXPIRED)"
					}
					if ((result.feature.attributes["PROVISION_VALUE"] == null) || (result.feature.attributes["PROVISION_VALUE"] =="") || (result.feature.attributes["PROVISION_VALUE"] ==" ") | (result.feature.attributes["PROVISION_VALUE"] =="Null")){
					} else {
						theZoningHtml += "</i></td></tr><tr><td></td><td>"+ "Value: </td><td>" + result.feature.attributes["PROVISION_VALUE"] + "</td></tr>"
					}
					theZoningHtml += "<tr><td></td><td>Description: </td><td>" + result.feature.attributes["TYPE_DESCRIPTION"] +  "</td></tr>"
					
					
					if ((result.feature.attributes["DOCUMENT"] == "Null") ||(result.feature.attributes["DOCUMENT"] == undefined) || (result.feature.attributes["DOCUMENT"] == "") || (result.feature.attributes["DOCUMENT"]==null)  ) {
					} else { 
						if (( result.feature.attributes["DOCUMENT"].substring(0,4).toUpperCase()=="WWW.") || ( result.feature.attributes["DOCUMENT"].substring(0,4).toUpperCase()=="HTTP") ){
							theZoningHtml += "<tr><td></td><td> </td><td><a class='NoPrint' target='_blank' href='"  + result.feature.attributes["DOCUMENT"] + "'>Read more about this regulation</a></td></tr>"
						} else {
							theZoningHtml += "<tr><td></td><td> </td><td><a class='NoPrint' target='_blank' href='/docs/PlanningProvisions/"  + result.feature.attributes["DOCUMENT"] + "'>Read more about this regulation</a></td></tr>"
						}
					}
					//if (theLoc=="City" && dept=="PLANNING") {
						tmpDate = result.feature.attributes["DATE_INTRODUCED"].split(" ");
						theZoningHtml +="<tr><td></td><td>Added:</td><td>"+ tmpDate[0] + "</td></tr>"
						tmpDate = result.feature.attributes["DATE_EXPIRED"].split(" ");
						if (tmpDate!="Null") {
							theZoningHtml +="<tr><td></td><td>Expires:</td><td>"+ tmpDate[0] + "</td></tr>"
						}
					if (theLoc=="City" && dept=="PLANNING") {
						theZoningHtml +="<tr><td></td><td>Planner:*</td><td>"+ result.feature.attributes["STAFF_CONTACT"]; + "</td></tr>"
					}
					theZoningHtml = theZoningHtml + "</table><br class='NoPrint'>"
				}
			}
		}
	}
		theControltmp=""
		theDescriptiontmp=""
		theStafftmp=""
		theLetterFiletmp=""
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Lot Events") {
					theNum = theNum + 1
					theControl=result.feature.attributes["EVENT_TYPE"] 
					theDescription=result.feature.attributes["DESCRIPTION"] 
					theStaff=result.feature.attributes["STAFF"]
					theLetterFile=result.feature.attributes["LETTER_FILE"] 
					if (theControltmp==theControl && theDescriptiontmp==theDescription && theStafftmp==theStaff  && theLetterFiletmp==theLetterFile) {
					
					} else {
						if (theLoc=="City" && dept=="PLANNING" && result.feature.attributes["EVENT_TYPE"]!="Tree") {
							theZoningHtml += "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'><i>Control:* </i></td><td><i>" + result.feature.attributes["EVENT_TYPE"] + "</i></td></tr>"
							theZoningHtml += "<tr><td></td><td>Description:* </td><td>" + result.feature.attributes["DESCRIPTION"] + "</td></tr>"
							var tmpDate = ""
							tmpDate = result.feature.attributes["EVENT_DATE"].split(" ");
							theZoningHtml += "<tr><td></td><td>Added:* </td><td>" + tmpDate[0] + "</td></tr>"
							theZoningHtml += "<tr><td></td><td> </td>"
							if ((result.feature.attributes["LETTER_FILE"] == "Null") ||(result.feature.attributes["LETTER_FILE"] == undefined) || (result.feature.attributes["LETTER_FILE"] == "") || (result.feature.attributes["LETTER_FILE"]==null)  ) {
							} else { 
								theLink= result.feature.attributes["LETTER_FILE"]
								theLink= theLink.replace('I:\\DECISION DOCUMENTS\\Variance Decision Letters','http:\\\\' + theServerName + "\\docs\\Decision_Documents\\Variance_Decision_Letters")
								theLink= theLink.replace('I:\\DECISION DOCUMENTS\\Zoning Verification Letters','http:\\\\' + theServerName + "\\docs\\Zoning Verification Letters")
								theLink= theLink.replace('I:\\DECISION DOCUMENTS\\Letters of Determination','http:\\\\' + theServerName + "\\docs\\Letters_of_Determination")
								theLink = theLink.replace("I:/","http://cityplan-arc10/InfoVol/")
								theLink = theLink.replace("i:/","http://cityplan-arc10/InfoVol/")
								theLink = theLink.replace("I:\\","http://cityplan-arc10/InfoVol/")
								theLink = theLink.replace("i:\\","http://cityplan-arc10/InfoVol/")
								if (( theLink.substring(0,4).toUpperCase()=="WWW.") || ( theLink.substring(0,4).toUpperCase()=="HTTP") ){
									theZoningHtml = theZoningHtml + '<td><a class="NoPrint" target="_blank" href="'  + theLink + '">Read more about this ' + result.feature.attributes["EVENT_TYPE"] + '</a></td>'
								} else {
									theZoningHtml = theZoningHtml + '<td><a class="NoPrint" target="_blank" href="'  + theLink + '">Read more about this ' + result.feature.attributes["EVENT_TYPE"] +'</a></td>'
								}
							}
							theZoningHtml += "</tr>"
							if ((result.feature.attributes["EXPIRATION"]==null) || (result.feature.attributes["EXPIRATION"]=="Null") || (result.feature.attributes["EXPIRATION"]==" ") || (result.feature.attributes["EXPIRATION"]=="") ) {
							
							} else {
								theZoningHtml += "<tr><td></td><td>Expires:* </td><td>" + result.feature.attributes["EXPIRATION"] + "</td></tr>"
							}
							theEventContact  = result.feature.attributes["CONTACT_FIRST"] + " " + result.feature.attributes["CONTACT_LAST"]
							if (result.feature.attributes["CONTACT_FIRM"]=="" || result.feature.attributes["CONTACT_FIRM"]=="Null" || result.feature.attributes["CONTACT_FIRM"]=="null" || result.feature.attributes["CONTACT_FIRM"] ==null) {
							} else {
								theEventContact+=", " + result.feature.attributes["CONTACT_FIRM"]
							} 
							
							if (result.feature.attributes["CONTACT_PHONE"]=="" || result.feature.attributes["CONTACT_PHONE"]=="Null" || result.feature.attributes["CONTACT_PHONE"]=="null" || result.feature.attributes["CONTACT_PHONE"] ==null) {
							} else {
								theEventContact+=", tel: " + result.feature.attributes["CONTACT_PHONE"]
							} 
							
							theZoningHtml += "<tr><td></td><td>Planner:* </td><td>" + result.feature.attributes["STAFF"] + "</td></tr>"
							theZoningHtml += "<tr><td></td><td>Applicant/Requestor:* </td><td>" + theEventContact + "</td></tr>"
							theZoningHtml +="</table><br>"
						} 
						if (result.feature.attributes["EVENT_TYPE"]=="Tree") {
							
							theZoningHtml += "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'><i>Control: </i></td><td><i><a target='_blank' href='http://sfdpw.org/index.aspx?page=663'>Landmark Tree</a></i></td></tr>"
							theZoningHtml += "<tr><td></td><td>Description: </td><td>" + result.feature.attributes["DESCRIPTION"] + "</td></tr>"
							var tmpDate = ""
							tmpDate = result.feature.attributes["EVENT_DATE"].split(" ");
							theZoningHtml += "<tr><td></td><td>Added: </td><td>" + tmpDate[0] + "</td></tr>"
							theZoningHtml += "<tr><td></td><td> </td>"
							if (theLoc=="City" && dept=="PLANNING") {
								if ((result.feature.attributes["LETTER_FILE"] == "Null") ||(result.feature.attributes["LETTER_FILE"] == undefined) || (result.feature.attributes["LETTER_FILE"] == "") || (result.feature.attributes["LETTER_FILE"]==null)  ) {
								} else { 
									theLink= result.feature.attributes["LETTER_FILE"]
									theLink= theLink.replace('I:\\DECISION DOCUMENTS\\Variance Decision Letters','http:\\\\' + theServerName + "\\docs\\Decision_Documents\\Variance_Decision_Letters")
									theLink= theLink.replace('I:\\DECISION DOCUMENTS\\Zoning Verification Letters','http:\\\\' + theServerName + "\\docs\\Zoning Verification Letters")
									theLink= theLink.replace('I:\\DECISION DOCUMENTS\\Letters of Determination','http:\\\\' + theServerName + "\\docs\\Letters_of_Determination")
									theLink = theLink.replace("I:/","http://cityplan-arc10/InfoVol/")
									theLink = theLink.replace("i:/","http://cityplan-arc10/InfoVol/")
									theLink = theLink.replace("I:\\","http://cityplan-arc10/InfoVol/")
									theLink = theLink.replace("i:\\","http://cityplan-arc10/InfoVol/")
									if (( theLink.substring(0,4).toUpperCase()=="WWW.") || ( theLink.substring(0,4).toUpperCase()=="HTTP") ){
										theZoningHtml = theZoningHtml + "<td><a class='NoPrint' target='_blank' href='"  + theLink + "'>Read more about this " + result.feature.attributes["EVENT_TYPE"] + "</a>*</td>"
									} else {
										theZoningHtml = theZoningHtml + "<td><a class='NoPrint' target='_blank' href='"  + theLink + "'>Read more about this " + result.feature.attributes["EVENT_TYPE"] +"</a>*</td>"
									}
								}
								theZoningHtml += "</tr>"
							}
							if ((result.feature.attributes["EXPIRATION"]==null) || (result.feature.attributes["EXPIRATION"]=="Null") || (result.feature.attributes["EXPIRATION"]==" ") || (result.feature.attributes["EXPIRATION"]=="") ) {
							
							} else {
								theZoningHtml += "<tr><td></td><td>Expires: </td><td>" + result.feature.attributes["EXPIRATION"] + "</td></tr>"
							}
							theZoningHtml += "<tr><td></td><td>Planner: </td><td>" + result.feature.attributes["STAFF"] + "</td></tr>"
							theZoningHtml +="</table><br>" 
							 
						 }
						
					}
					theControltmp=theControl
					theDescriptiontmp=theDescription
					theStafftmp=theStaff
					theLetterFiletmp=theLetterFile
					
			}
		}

	if (theNum==0) {
		theZoningHtml +="<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	
			
			
	//go through the results array and look for the Planning Areas that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkPlanningAreas'></a>"
	if (isLayerVisible("Planning Areas")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PLANNING AREAS: </span><input class='NoPrint' onclick='showHideMap( " + '"Planning Areas"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Planning Areas' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PLANNING AREAS: </span><input class='NoPrint' onclick='showHideMap( " + '"Planning Areas"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Planning Areas' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	theLinktmp=""
	theDescriptmp=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Planning Areas") {
			theNum = theNum+1
			var theLink = result.feature.attributes["URL"]
			
			if ((theLink== "Null") || (theLink == undefined) || (theLink == "") || (theLink==null)  ) {
				theLink = '<a target="_blank" href="' + result.feature.attributes["URL"] + '">'+  result.feature.attributes["PLANAREA"] + '</a>'
			} else {
				theLink = result.feature.attributes["PLANAREA"] 
			}
			var theLink = '<a target="_blank" href="' + result.feature.attributes["URL"] + '">'+  result.feature.attributes["PLANAREA"] + '</a>'
			theZoningHtml+="<table class='reportData' style='width:100%; border-bottom: solid; border-width: 0px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'>Planning Area:</td><td>" +theLink + "</td></tr></table>"
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	
	
	
	
	

	//go through the results array and look for the IIN Districts that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkMayorsInvestinNeighborhoodsInitiativeArea'></a>"
	if (isLayerVisible("Invest In Neighborhoods")) {
		theZoningHtml +="<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>MAYOR'S INVEST IN NEIGHBORHOODS INITIATIVE AREA: <input class='NoPrint' onclick='showHideMap( " + '"Invest In Neighborhoods"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Invest In Neighborhoods' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml +="<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>MAYOR'S INVEST IN NEIGHBORHOODS INITIATIVE AREA: <input class='NoPrint' onclick='showHideMap( " + '"Invest In Neighborhoods"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Invest In Neighborhoods' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Invest In Neighborhoods") {
			theNum = theNum + 1
			theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>Within a Mayor's <a target='_blank' href='http://investsf.org/'> Invest in Neighborhoods Initiative</a> Area</td></tr></table>"
		}
	}
		
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	
	
	//go through the results array and look for the Community Benefit Districts that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkCommunityBenefitDistrict'></a>"
	if (isLayerVisible("Invest In Neighborhoods")) {
		theZoningHtml +="<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>COMMUNITY BENEFIT DISTRICT: <input class='NoPrint' onclick='showHideMap( " + '"Community Benefit Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Community Benefit Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml +="<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>COMMUNITY BENEFIT DISTRICT: <input class='NoPrint' onclick='showHideMap( " + '"Community Benefit Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Community Benefit Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Community Benefit Districts") {
			theNum = theNum + 1
			theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>Within a Community Benefit District: <a target='_blank' href='" +result.feature.attributes["Link"]  + "'>"+ result.feature.attributes["CBD"] +"</a> </td></tr></table>"
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	
	
	//go through the results array and look for the Schools buffer that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkSchools'></a>"
	if (isLayerVisible("Schools 1000ft Buffer")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SCHOOLS: </span><input class='NoPrint' onclick='showHideMap( " + '"Schools 1000ft Buffer"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Schools 1000ft Buffer' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SCHOOLS: </span><input class='NoPrint' onclick='showHideMap( " + '"Schools 1000ft Buffer"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Schools 1000ft Buffer' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	theLinktmp=""
	theDescriptmp=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Schools 1000ft Buffer") {
			theNum = theNum+1
			theZoningHtml+="<table class='reportData' style='width:100%; border-bottom: solid; border-width: 0px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'>Within 1,000ft of:</td><td>" + result.feature.attributes["School"] + "</td></tr></table>"
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None within 1,000ft </td></tr></table>"
	}
	
	
	//go through the results array and look for the NSRs that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkNoticeOfSpecialRestrictions'></a>"
	if (isLayerVisible("NSR")) {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NOTICE OF SPECIAL RESTRICTIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"NSR"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='NSR' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml = theZoningHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NOTICE OF SPECIAL RESTRICTIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"NSR"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='NSR' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	theLinktmp=""
	theDescriptmp=""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "NSR") {
			if (result.feature.attributes["RESTRICTION"] != null ) {
				if (theLinktmp == result.feature.attributes["DOC"] && theDescriptmp == result.feature.attributes["RESTRICTION"] ) {
				} else {
					theNum = theNum + 1
					theZoningHtml = theZoningHtml + "<table class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'>NSR No.:</td><td>" + result.feature.attributes["NSR_NO"] + "</td></tr><tr><td style='width:15px'></td><td>Restriction:</td><td>" + result.feature.attributes["RESTRICTION"] + "</td></tr><tr><td style='width:15px'></td><td>Permit No:</td><td>" + result.feature.attributes["BPAPPLNO"] + "</td></tr><tr><td style='width:15px'></td><td>NSR Date:</td><td>" + result.feature.attributes["NSR_DATE"] + "</td></tr>"//"<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>" + result.feature.attributes["RESTRICTION"] + " </td></tr></table>"
					if ((result.feature.attributes["DOC"].indexOf("----------") >-1) ||(result.feature.attributes["DOC"] == "-") || (result.feature.attributes["DOC"] == "Null") || (result.feature.attributes["DOC"] == undefined) || (result.feature.attributes["DOC"] == "") || (result.feature.attributes["DOC"]==null)  ) {
					} else {
						theLink=result.feature.attributes["DOC"]
						theLink= theLink.replace("I:\\DECISION DOCUMENTS","http://" + theServerName + "/docs")
						theLink= theLink.replace("//Citypln-infovol/InfoDrive/DECISION DOCUMENTS/","http://" + theServerName + "/docs/decision_documents/")
						theZoningHtml = theZoningHtml + "<tr><td style='width:15px'></td><td  style='width:150px'></td><td><a target='_blank' href='"+theLink+"'> View Notice of Special Restrictions</a></td></tr>"
					}
					theZoningHtml = theZoningHtml + "</table><br class='NoPrint'>"
				}
			}
			theLinktmp=result.feature.attributes["DOC"]
			theDescriptmp = result.feature.attributes["RESTRICTION"] 
		}
	}
	if (theNum==0) {
		theZoningHtml = theZoningHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table><br class='NoPrint'>"
	}
	
	//go through the results array and look for the Letters of Determination that were found at the location.  Add these to the zoning report HTML.  
	theZoningHtml +="<a name='BookmarkZoningLettersOfDetermination'></a>"
	if (isLayerVisible("Zoning Letters")) {
		theZoningHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZONING LETTERS OF DETERMINATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning Letters"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning Letters' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theZoningHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZONING LETTERS OF DETERMINATION: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning Letters"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning Letters' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theZoningHtml +="<div id='ZoningLetters'></div>"
	
		
	//alert("2")
	//go through the results array and add links to the official Zoning Map
	theZoningHtml +="<a name='BookmarkOfficialZoningMaps'></a>"
	theZoningHtml += "<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>OFFICIAL ZONING MAPS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	theNum = 0
	SSDURL1 = "http://www.amlegal.com/nxt/gateway.dll/California/zoningmaps/dat/0-0-0-764.pdf"
	SSDURL2 = "http://www.amlegal.com/nxt/gateway.dll/California/zoningmaps/dat/0-0-0-537.pdf"
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "ZoningPages") {
			theNum=theNum+1
			theZoningHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["ZoningMapURL"]  + "'>View Zoning District Map - ZN" + result.feature.attributes["SECTION_"] +"</a></td></tr></table>"
			theZoningHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["HeightMapURL"]  + "'>View Height District Map - HT" + result.feature.attributes["SECTION_"] +"</a></td></tr></table>"
			theZoningHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["SUDMapURL"]  + "'>View Special Use District Map - SU" + result.feature.attributes["SECTION_"] +"</a></td></tr></table>"
			if (result.feature.attributes["PreservationMapURL"]  != "Null" ) {
				theZoningHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["PreservationMapURL"]  + "'>View Preservation District Map - PD" + result.feature.attributes["SECTION_"] +"</a></td></tr></table>"
			}
			if (result.feature.attributes["CoastalMapURL"]  != "Null" ) {
				theZoningHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + result.feature.attributes["CoastalMapURL"]  + "'>View Coastal Zone Map - CZ" + result.feature.attributes["SECTION_"] +"</a></td></tr></table>"
			}
			theZoningHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + SSDURL1 + "'>View Special Sign District Map - Citywide - SS01</a></td></tr></table>"
			theZoningHtml +="<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='" + SSDURL2 + "'>View Special Sign District Map - Detailed - SS02</a></td></tr></table>"
		}
	}
	if (theNum==0) {
		theZoningHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	theZoningHtml += "</div>"
	
	if (theLoc=="City") {
		theZoningHtml += "<br><table class='reportData' ><tr><td style='width:15px'></td><td>* Fields marked with an asterisk are only visible to City staff. </td></tr></table>"
	}
	//clean out 'null's and 'undefined's
	theZoningHtml = theZoningHtml.replace(/Null/gi,"&nbsp");
	theZoningHtml = theZoningHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theZoningHtml += "<p class='NoPrint'><br></p>"
	theZoningHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkZoningTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	theZoningHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	
	//publish the HTML to the page
	document.getElementById('ZoningReport').innerHTML = theZoningHtml	
	
	theZoneNum = 0
	theLinktmp=""
	theDatetmp2=""
	var theFieldList = ' "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."APN" '
	theFieldList +=', "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE OPENED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."ADDRESS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE CATEGORY" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS DATE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."JOB VALUE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE CLOSED" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE COMPLETED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE TYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DESCRIPTION" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE SUBTYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."TEMPLATE ID" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER EMAIL" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER PHONE" '
	//alert("1")
	//alert(theParcelList)
	
	
	//prompt("", theParcelListForAccela)
	if (!theParcelListForAccela) {
		theParcelListForAccela="'9'"
	} else {
		//check to see if the first character is a comma and remove it if that is the case
		if (theParcelListForAccela.substring(0,1)==',') {
			theParcelListForAccela = theParcelListForAccela.substring(1,theParcelListForAccela.length)
		}
		
	}
	//prompt("", theParcelListForAccela)
	var queryString = 'SELECT ' + theFieldList + ' from  "32fee353-3469-4307-bdcd-54ddbe9b5fae" LEFT JOIN "3b63c2ea-1ea7-4232-be53-24751ff15dde" ON "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" = "3b63c2ea-1ea7-4232-be53-24751ff15dde"."record_id" where ("parcel_nbr" in(' + theParcelListForAccela +  ') ) and "RECORD TYPE" like ' + "'Zoning Administrator%'" + ' order by "record_id" desc'
	//alert("2")
	//prompt("zoning",queryString)
	var theHtmlZoningLetter='';
	//var data = {
	//	sql: queryString
	//};
	var data = JSON.stringify({"sql" : queryString});
	$.ajax({
		url: "http://www.civicdata.com/api/action/datastore_search_sql", 
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function(data) {
			recordTotal=data.result.records.length
			var tmpRecordID = ""
			//var tmpRecordTypeDetailed = ""
			var tmpOpened = ""
			//alert("Total Planning Zoning records returned from Accela: " + recordTotal)
			if (data.result.records.length==0) {
				//theHtml = "No records found"
				//theCaseTrackingHtml+=theHtml
				theZoneNum=0
			} else {
				tmpPRJ=""
				var tempDate = new Date() 
				for (i=0; i<data.result.records.length;i++) {
					theZoneNum= i+1
					var obj = data.result.records[i]
					if (tmpRecordID!=obj['RECORD ID'] || tmpOpened != obj['DATE OPENED']) {
						//alert(i)
						tmpRecordID = obj['RECORD ID']
						//tmpRecordTypeDetailed = obj['RECORD TYPE']
						tmpOpened = obj['DATE OPENED']
						//display those records with no associated Project record.
						tmpCase=obj['RECORD ID'].substring(0,obj['RECORD ID'].length-3)
						tmpCasePRJ=tmpCase+"PRJ"
						PRJExists=false;
						for (k=0; k<data.result.records.length;k++) {
							var obj3 = data.result.records[k]
							if (tmpCasePRJ==obj3['RECORD ID']) {
								PRJExists=true;
							}
						}
							
						theHtmlZoningLetter +="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'><b>Record ID: </b> </td><td><b>" + obj['RECORD ID']+ "</b></td></tr>"
						var plannerName=obj['PLANNER NAME']
						var plannerEmail=obj['PLANNER EMAIL']
						var plannerPhone=obj['PLANNER PHONE']
						if (plannerName.length<2) {
							plannerName="Planning Information Center"
						} 
						if (plannerEmail.indexOf("@")<1) {
							plannerEmail="pic@sfgov.org"
						} 
						if (plannerPhone.length<7) {
							plannerPhone="415-558-6377"
						} 
						if ((theLoc=="City") && (dept=="PLANNING")) {
							
						} else {
							var baseYear = new Date (1960, 10, 1)
							var decisDate = new Date(obj["DATE CLOSED"])
							if (decisDate > baseYear) {
								var today = new Date()
								var yearAgo = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 365))
								if (decisDate < yearAgo) {
									plannerName = "Planning Information Center";
									plannerPhone = "415-558-6377";
									plannerEmail = "pic@sfgov.org";
								}
							}
						}
						
						var plannerEmailLink = "<a href='mailto:"+plannerEmail+"'>"+plannerName+"</a> Tel: "+plannerPhone
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'><b>Planner: </b> </td><td><b>" + plannerEmailLink+ "</b></td></tr>"
						var theRecType = obj['RECORD TYPE']
						//theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + obj['RECORD TYPE TYPE'] + " / " + obj['RECORD TYPE SUBTYPE'] +  "</td></tr>"
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType +  "</td></tr>"
						//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Template ID:  </td><td>" + obj['TEMPLATE ID'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE OPENED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
								
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + obj['RECORD NAME'] + "</td></tr>"
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + obj['DESCRIPTION'] + "</td></tr>"
								
						//theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + obj['APN'] + "</td></tr>"
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + obj['ADDRESS'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['RECORD STATUS DATE'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						var theStatus = obj['RECORD STATUS']
						if (!theStatus) {
							theStatus=''
						}
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus  + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE CLOSED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Closed:  </td><td>" + dateString + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE COMPLETED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						//theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(obj['JOB VALUE']) + "</td></tr>"
						var ACALinkData = obj['TEMPLATE ID'].split("/");
						var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
						var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
									
						//theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						//if ((theLoc=="City") && (dept=="PLANNING")) {
						//	theHtmlZoningLetter += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						//}
						
						if ((theLoc=="City") && (dept=="PLANNING")) {
							theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						} else {
							theHtmlZoningLetter += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						}
						
						
						
						
						
						
						theHtmlZoningLetter += "</td></tr>"
						theHtmlZoningLetter += "</table><br>" 
								
						
					}
				}
			} 
			//alert (theZoneNum)
			if (theZoneNum==0){
				theHtmlZoningLetter += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
				
			}
			//alert(theHtmlZoningLetter)
			document.getElementById('ZoningLetters').innerHTML = theHtmlZoningLetter
			//alert("here:")
			//setTimeout("updatePreservationHtml();",1000)
		},
		error: function(xhr, status, error) {
            theError="<table  class='reportData' style='width:100%; border-bottom: none;'><tr><td style='width:15px'><td>Error connecting to Accela permitting database.  <br><br>This can happen if your browser has cached an expired connection parameter, if you are using a Windows machine try clicking control-F5, this will clear your browser's cache for this website.  Alternatively, clear your cache entirely then try again. <br>"
			theHtmlZoningLetter= theError + "<br><br>If this problem persists please email <a href='mike.wynne@sfgov.org'>Mike Wynne</a> and provide details of the property that you searched for, the browser you used and the operating system of your machine.</td></tr></table>"
			//theZoningHtml +="<table  class='reportData' style='width:100%; border-bottom: solid;'><tr><td style='width:15px'><td> Error connecting to Accela Permitting data!  If this problem persists please contact the system administrator.</td></tr></table>"
			document.getElementById('ZoningLetters').innerHTML = theHtmlZoningLetter
			//updatePreservationHtml();
			
		}
	});	
	
	
	
	
	switch(theBM) {
		case "ZONINGDISTRICTS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkZoningDistricts')
			break;
		case "HEIGHTANDBULKDISTRICTS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkHeightAndBulkDistricts')
			break;
		case "SPECIALUSEDISTRICTS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkSpecialUseDistricts')
			break;
		case "PROXIMITYTONCD":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkProximityToNCD')
			break;
		case "SPECIALSIGNDISTRICTS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkSpecialSignDistricts')
			break;
		case "LEGISLATIVESETBACKS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkLegislativeSetbacks')
			break;
		case "COASTALZONE":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkCoastalZone')
			break;
		case "PORT":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkPort')
			break;
		case "LIMITEDANDNONCONFORMINGUSES":
			jumpToBookmark('#BookmarkLimitedAndNonconformingUses')
			showTab('dhtmlgoodies_tabView1',"1");
			break;
		case "REDEVELOPMENTAREAS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkRedevelopmentAreas')
			break;
		case "OTHERINFORMATION":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkOtherInformation')
			break;
		case "MAYORSINVESTINNEIGHBORHOODSINITIATIVEAREA":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkMayorsInvestinNeighborhoodsInitiativeArea')
			break;
		case "SCHOOLS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkSchools')
			break;
		case "NOTICEOFSPECIALRESTRICTIONS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkNoticeOfSpecialRestrictions')
			break;
		case "ZONINGLETTERSOFDETERMINATION":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkZoningLettersOfDetermination')
			break;
		case "OFFICIALZONINGMAPS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkOfficialZoningMaps')
			break;
		case "HRER":
			showTab('dhtmlgoodies_tabView1',"2");
			jumpToBookmark('#BookmarkHRER')
			break;
		default:
			break;
	}
	//theBM=""
}
function updateProjectsHtml() {
	//alert("here")
	var theFieldList = ' \"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"RECORD ID\"'
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."APN" '
	theFieldList +=',\"3b63c2ea-1ea7-4232-be53-24751ff15dde\".\"parcel_nbr\"'
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"DATE OPENED\"'
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"ADDRESS\"'
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE CATEGORY" '
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"RECORD STATUS DATE\"'
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"RECORD STATUS\"'
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."JOB VALUE" '
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"DATE CLOSED\"'
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE COMPLETED" '
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"RECORD NAME\"'
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"RECORD TYPE\"'
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE TYPE" '
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"DESCRIPTION\"'
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE SUBTYPE" '
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"TEMPLATE ID\"'
	theFieldList +=',\"c10252c9-bcc3-4ec4-b8ae-f863452bd27f\".\"PARENT_ID\"'
	theFieldList +=',\"c10252c9-bcc3-4ec4-b8ae-f863452bd27f\".\"CHILD_ID\"'
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"PLANNER NAME\"'
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"PLANNER EMAIL\"'
	theFieldList +=',\"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"PLANNER PHONE\"'
	
	//theParcelListForAccela=theParcelListForAccelaPart2
	//Build second half of parcel list into a second Ajax call then comnbine the results.
	
	if (!theParcelListForAccela) {
		theParcelListForAccela="'9'"
	}
	
	var queryStringProj = 'Select ' + theFieldList + ' from  \"32fee353-3469-4307-bdcd-54ddbe9b5fae\" '
	queryStringProj += 'LEFT JOIN \"3b63c2ea-1ea7-4232-be53-24751ff15dde\" ON \"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"RECORD ID\"=\"3b63c2ea-1ea7-4232-be53-24751ff15dde\".\"record_id\" '
	queryStringProj += 'LEFT JOIN \"c10252c9-bcc3-4ec4-b8ae-f863452bd27f\" ON \"32fee353-3469-4307-bdcd-54ddbe9b5fae\".\"RECORD ID\"=\"c10252c9-bcc3-4ec4-b8ae-f863452bd27f\".\"PARENT_ID\" '
	//queryString += 'where ("parcel_nbr" in(' + theParcelList +  ') OR "APN"  in(' + theParcelList + ' ) ) and "RECORD TYPE" <> ' + "'Misc. Permits-REF (MIS)'" + ' order by "record_id" desc, "CHILD_ID" asc'
	queryStringProj += 'where (\"parcel_nbr\" in(' + theParcelListForAccela +  ')) '
	queryStringProj +=  'and \"RECORD TYPE\" <> ' + "'Misc. Permits-REF (MIS)'" +  ' and \"RECORD TYPE\" <> ' + "'Short Term Rentals (STR)'" +  ' and \"RECORD TYPE\" <> ' + "'Enforcement (ENF)'" +  ' and \"RECORD TYPE\" not like ' + "'Zoning Adminis%'" + ' order by \"DATE OPENED\" desc,  \"RECORD ID\" desc, \"PARENT_ID\" desc, \"CHILD_ID\" asc '
	
	
	//prompt("Projects",queryStringProj)
	var theHtml='';
	var theCaseActive=0
	theCaseTrackingHtml = theCaseTrackingHtml + "<table class='NoPrint'><tr><td style='padding-left:15px'><a target='_blank' href='MapHelp.html#ProjectsGlossary'>Glossary </a></td></tr></table><br>"
	theCaseTrackingHtml +="<br><table class='reportData' width=100%><tr><td style='width:10px'></td><td>Permits are required in San Francisco to operate a businesses or to perform construction activity. The Planning Department reviews most applications for these permits in order to ensure that the projects comply with the <a alt='PlanningCode' href='http://planningcode.sfplanning.org' target='_blank'>Planning Code</a>. </td></tr></table>"
	theCaseTrackingHtml +="<br><br><div class='NoPrint'><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theCaseTrackingHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkProjects'>Planning Applications</a></td></tr></table>"
	theCaseTrackingHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkShortTermRentals'>Short Term Rentals</a></td></tr></table>"
	theCaseTrackingHtml +="<br></div>"
	theCaseTrackingHtml +="<a name='BookmarkProjects'/>"
	//theCaseTrackingHtml +="<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PLANNING APPLICATIONS: </SPAN></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	if (isLayerVisible("Planning Applications")) {
		theCaseTrackingHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PLANNING APPLICATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Planning Applications"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Planning Applications' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theCaseTrackingHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PLANNING APPLICATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Planning Applications"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Planning Applications' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theCaseNum = 0
	var data = JSON.stringify({"sql" : queryStringProj});
	$.ajax({
		url: "http://www.civicdata.com/api/action/datastore_search_sql", 
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function(data) {
			//var myData = data
			//var myRecs=myData.result.records
			//myRecs.sort(idresultsort3)
			recordTotal=data.result.records.length
			//alert(recordTotal)
			var tmpRecordID = ""
			var tmpOpened = ""
			var tmpParent = ""
			var tmpChild = ""
			//alert("Total Planning records returned from Accela: " + recordTotal)
			if (data.result.records.length==0) {
				//theHtml = "No records found"
				//theCaseTrackingHtml+=theHtml
			} else {
				var tempDate = new Date() 
				var addedCases = new Array("999999")
				var lastParent=""
				theRecNum=0
				
				for (i=0; i<data.result.records.length;i++) {
					theNum= i+1
					var obj = data.result.records[i]
					if (theSearchString==obj['RECORD ID'] ) {
						theSearchTypeDetailed="PLANNING APPLICATION"
					}
					
					//alert("new record")
					if (tmpRecordID!=obj['RECORD ID'] || tmpOpened != obj['DATE OPENED'] || tmpParent!= obj['PARENT_ID']  || tmpChild!=obj['CHILD_ID']) {
						//alert("record is  different")
						tmpRecordID = obj['RECORD ID']
						tmpOpened = obj['DATE OPENED']
						tmpParent = obj['PARENT_ID']
						tmpChild = obj['CHILD_ID']
						var isParent=false;
						var isChild=false;
						var alreadyAddedThisOne=false
						//alert('check if parent')

						for (x=0; x<addedCases.length;x++) {
							if ((tmpRecordID + tmpOpened.toString())==addedCases[x]) {
								alreadyAddedThisOne=true
								//alert("already added " + tmpRecordID +"\n\n" + addedCases)
							}
						}
						if (obj['CHILD_ID'] != null) {
							isParent=true;
							lastParent=tmpRecordID
							addedCases[addedCases.length] = tmpRecordID + obj['DATE OPENED'].toString()
							var recTypeType = obj['RECORD TYPE TYPE']
							var recTypeSubType = obj['RECORD TYPE SUBTYPE']
							var theRecType = obj['RECORD TYPE']
							var tempOpenDate = new Date() 
							tempOpenDate=dateConvert(obj['DATE OPENED'])
							var  recName = obj['RECORD NAME']
							var recDesc = obj['DESCRIPTION'] 
							var recAPN = obj['APN'] 
							var recAddress = obj['ADDRESS'] 
							var tempStatusDate = new Date() 
							tempStatusDate=dateConvert(obj['RECORD STATUS DATE'])
							var tempCloseDate = new Date() 
							tempCloseDate=dateConvert(obj['DATE CLOSED'])
							//var tempCompletedDate = new Date() 
							//tempCompletedDate=dateConvert(obj['DATE CCOMPLETED'])
							//var jobValue = obj['JOB VALUE'];
							var templateID = obj['TEMPLATE ID']
							var theStatus = obj['RECORD STATUS']
						}
						
						//alert("isParent: "+ isParent)

						if (isParent) {
							if (alreadyAddedThisOne==false) {
								theRecNum=theRecNum+1
								if (theRecNum==1) {
									theHtml +="<table  class='reportData' style='width:100%;'>"
								}else {
									theHtml +="<table  class='reportData' style='width:100%; border-top: solid; border-width: 1px; border-color: #C8C8C8'>"
								}
								theHtml += "<tr><td style='width:15px'><a id='PLANNINGAPPLICATION"+obj['RECORD ID']+"' name='PLANNINGAPPLICATION"+obj['RECORD ID']+"'></a></td><td style='width:150px'><b>Planning App. No.: </b> </td><td><b>" + tmpRecordID+ "</b></td></tr>"
								var plannerName=obj['PLANNER NAME']
								var plannerEmail=obj['PLANNER EMAIL']
								var plannerPhone=obj['PLANNER PHONE']
								if (plannerName.length<2) {
									plannerName="Planning Information Center"
								} 
								if (plannerEmail.indexOf("@")<1) {
									plannerEmail="pic@sfgov.org"
								} 
								if (plannerPhone.length<7) {
									plannerPhone="415-558-6377"
								} 
								if ((theLoc=="City") && (dept=="PLANNING")) {
									
								} else {
									var baseYear = new Date (1960, 10, 1)
									var decisDate = new Date(obj["DATE CLOSED"])
									if (decisDate > baseYear) {
										var today = new Date()
										var yearAgo = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 365))
										if (decisDate < yearAgo) {
											plannerName = "Planning Information Center";
											plannerPhone = "415-558-6377";
											plannerEmail = "pic@sfgov.org";
										}
									}
								}
								
								var plannerEmailLink = "<a href='mailto:"+plannerEmail+"'>"+plannerName+"</a> Tel: "+plannerPhone
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'><b>Planner: </b> </td><td><b>" + plannerEmailLink+ "</b></td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + recTypeType + " / " + recTypeSubType+  "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType +  "</td></tr>"
								
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								
								if (tempOpenDate) {
									curr_date = tempOpenDate.getDate();   
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempOpenDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()
									curr_month = tempOpenDate.getMonth() + 1; //months are zero based
									curr_year = tempOpenDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
										
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + recName + "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + recDesc + "</td></tr>"
										
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + recAPN + "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + recAddress+ "</td></tr>"
								
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								if (tempStatusDate) {
									curr_date = tempStatusDate.getDate();   
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempStatusDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()
									curr_month = tempStatusDate.getMonth() + 1; //months are zero based
									curr_year = tempStatusDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								
								if (!theStatus) {
									theStatus=''
								}
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus  + "</td></tr>"
								
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								if (tempCloseDate) {
									curr_date = tempCloseDate.getDate();   
									
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempCloseDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()
									curr_month = tempCloseDate.getMonth() + 1; //months are zero based
									curr_year = tempCloseDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Closed:  </td><td>" + dateString + "</td></tr>"
								
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								//if (tempCompletedDate) {
								//	curr_date = tempCompletedDate.getDate();   
								//	curr_month = tempCompletedDate.getMonth() + 1; //months are zero based
								//	curr_year = tempCompletedDate.getFullYear(); 
								//	dateString = curr_month+ "/" + curr_date + "/" + curr_year
								//}
								
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(jobValue) + "</td></tr>"
								var ACALinkData = templateID.split("/");
								var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
								var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
											
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
								//if ((theLoc=="City") && (dept=="PLANNING")) {
								//	theHtml += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
								//}
								
								if ((theLoc=="City") && (dept=="PLANNING")) {
									theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
								} else {
									theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
								}
								
								
								theHtml += "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Related Records:  </td><td></td></tr>"
								theHtml += "</table>"
								 
										
								if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed"&&theStatus!= "Expired"&&theStatus!= "Issued"&&theStatus!= "Revoked"&&theStatus!= "Void"&&theStatus!= "Withdrawn"&&theStatus!= "Cancelled"&&theStatus!= "Case Closed") {
									theCaseActive=theCaseActive +1
								}
								
							}
							
							theNumRelated=0
							for (a=0; a<data.result.records.length;a++) {
								//Add related records
								
								var obj2 = data.result.records[a]
								//var obj2 = myData.result.records[a]
								if (obj2['RECORD ID']==obj['CHILD_ID']) {
									alreadyAddedThisOne=false
									for (x=0; x<addedCases.length;x++) {
										if ((obj2['RECORD ID'] + obj2['DATE OPENED'].toString()) ==addedCases[x]) {
										//if (obj2['RECORD ID']  ==addedCases[x]) {
											alreadyAddedThisOne=true
										}
									}
									if (alreadyAddedThisOne==false) {
										theNumRelated=theNumRelated+1
										//alert(obj2['RECORD ID'] + "   " + obj2['DATE OPENED'].toString())
										addedCases[addedCases.length] = obj2['RECORD ID'] + obj2['DATE OPENED'].toString()
										theStatus = obj2['RECORD STATUS']
										//if (obj2['STATUS'] != "Approved"&&obj2['STATUS'] != "Denied"&&obj2['STATUS'] != "Closed") {
										if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed"&&theStatus!= "Expired"&&theStatus!= "Issued"&&theStatus!= "Revoked"&&theStatus!= "Void"&&theStatus!= "Withdrawn"&&theStatus!= "Cancelled"&&theStatus!= "Case Closed") {
											theCaseActive=theCaseActive +1
										}
										var tempOpenDateRR = new Date() 
										tempOpenDateRR=dateConvert(obj2['DATE OPENED'])
										var curr_date=""
										var curr_month=""
										var curr_year=""
										var dateString=""
										if (tempOpenDateRR) {
											curr_date = tempOpenDateRR.getDate();   
											   
											//Switch to Pacific Time from UTC
											var curr_date2 = new Date(tempOpenDateRR.getTime() + (8*1000*60*60));
											curr_date = curr_date2.getDate()
											if (parseInt(curr_date)<10) curr_date='0'+curr_date;
											curr_month = tempOpenDateRR.getMonth() + 1; //months are zero based
											if (parseInt(curr_month)<10) curr_month='0'+curr_month;
											curr_year = tempOpenDateRR.getFullYear(); 
											dateString = curr_month+ "/" + curr_date + "/" + curr_year
										}
										var templateIDRR = obj2['TEMPLATE ID']
										var ACALinkDataRR = templateIDRR.split("/");
										var ACALinkRR = "<a title='View further information in Accela Citizen Access' target='_blank' href='https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkDataRR[0]  + "&capID2="+ACALinkDataRR[1] + "&capID3=" + ACALinkDataRR[2] + "&agencyCode=CCSF'>"
										if ((theLoc=="City") && (dept=="PLANNING")) {
											ACALinkRR+="ACA</a>"
										} else {
											ACALinkRR+="View</a>"
										}
										
										var AALinkRR = "<a title='View further information in Accela Automation (you must be logged into Accela Automation and using IE)' target='_blank' href='https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkDataRR[0] + "&ID2="+ACALinkDataRR[1] + "&ID3=" + ACALinkDataRR[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N'>AA*</a>"
											
										//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td>View <a target='_blank' href='" + ACALink +"'>Accela Citizen Access</a><br>"
										//if ((theLoc=="City") && (dept=="PLANNING")) {
										//	theHtml += "Jump to <a target='_blank' href='" + AALink +"'>Accela Automation</a>"
										//}
										//if (theNumRelated==1) {
										//	theHtml+= "<table class='reportData'><tr><td style='width:50px'></td><td>App No.</td><td>Type</td><td>Opened</td><td>Status</td></tr>"
										//}
										var plannerName=obj2['PLANNER NAME']
										var plannerEmail=obj2['PLANNER EMAIL']
										var plannerPhone=obj2['PLANNER PHONE']
										if (plannerName.length<2) {
											plannerName="Planning Info Center"
										} 
										if (plannerEmail.indexOf("@")<1) {
											plannerEmail="pic@sfgov.org"
										} 
										if (plannerPhone.length<7) {
											plannerPhone="415-558-6377"
										} 
										if ((theLoc=="City") && (dept=="PLANNING")) {
											
										} else {
											var baseYear = new Date (1960, 10, 1)
											var decisDate = new Date(obj2["DATE CLOSED"])
											if (decisDate > baseYear) {
												var today = new Date()
												var yearAgo = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 365))
												if (decisDate < yearAgo) {
													plannerName = "Planning Info Center";
													plannerPhone = "415-558-6377";
													plannerEmail = "pic@sfgov.org";
												}
											}
										}
								
										//var plannerEmailLink = "<a href='mailto:"+plannerEmail+"'>"+plannerName+"</a> Tel: "+plannerPhone
										var plannerEmailLink = "<a title='Email: " + plannerEmail + ", Tel: " + plannerPhone + "' href='mailto:"+plannerEmail+"'>"+plannerName+"</a>"
										theHtml+= "<table style='margin-left:30px' border=0 class='reportData'><tr><td title ='Planning Application No.' style='width:120px'><a id='PLANNINGAPPLICATION"+obj['CHILD_ID']+"' name='PLANNINGAPPLICATION"+obj['CHILD_ID']+"'></a>" +obj['CHILD_ID'] + "</td><td title='Record Type' style='width:250px'>" + obj2['RECORD TYPE'] + "</td><td title='Date Opened' style='width:80px; text-align:left'>" + dateString+"</td><td title='Status' style='width:70px'>" +obj2['RECORD STATUS'] + "<td  style='width:140px'>"+plannerEmailLink +"</td></td><td style='width:40px'>"+ACALinkRR+"</td>"
										if ((theLoc=="City") && (dept=="PLANNING")) {
											theHtml += "<td style='width:40px;'>"+AALinkRR+"</td>"
										}
										
										theHtml+="</tr></table>"
										//theHtml+="<table style='margin-left:30px' border=0 class='reportData'><tr><td style='width:15px'></td><td  style='width:150px'>Planner:</td><td>"+plannerEmailLink+"</td></tr></table>"
										
										
										
									}
									
								}
							}
							
							//if (theNumRelated>0) {
							//	theHtml+= "<tr><td style='width:50px'>"+ theNumRelated+"</td><td></td><td></td><td></td><td></td></tr></table>"
							//}
							
						//}
						} else {
							//its not a parent with a child - orphaned record
							var isAlone=true
							for (j=0; j<data.result.records.length;j++) {
								var obj3 = data.result.records[j]
								if (tmpRecordID==obj3['CHILD_ID']) {
									//it's going to be added later
									isAlone = false
									break;
								}
							}
							if (isAlone==true) {
								addedCases[addedCases.length] = tmpRecordID + obj['DATE OPENED'].toString();
								//var recTypeType = obj['RECORD TYPE TYPE']
								//var recTypeSubType = obj['RECORD TYPE SUBTYPE']
								var theRecType = obj['RECORD TYPE']
								var tempOpenDate = new Date() 
								tempOpenDate=dateConvert(obj['DATE OPENED'])
								var  recName = obj['RECORD NAME']
								var recDesc = obj['DESCRIPTION'] 
								//var recAPN = obj['APN'] 
								var recAddress = obj['ADDRESS'] 
								var tempStatusDate = new Date() 
								tempStatusDate=dateConvert(obj['RECORD STATUS DATE'])
								var tempCloseDate = new Date() 
								tempCloseDate=dateConvert(obj['DATE CLOSED'])
								//var tempCompletedDate = new Date() 
								//tempCompletedDate=dateConvert(obj['DATE CCOMPLETED'])
								//var jobValue = obj['JOB VALUE'];
								var templateID = obj['TEMPLATE ID']
								var theStatus = obj['RECORD STATUS']
								theRecNum=theRecNum+1
								if (theRecNum==1) {
									theHtml +="<table  class='reportData' style='width:100%;'>"
								}else {
									theHtml +="<table  class='reportData' style='width:100%; border-top: solid; border-width: 1px; border-color: #C8C8C8'>"
								}
								theHtml += "<tr><td style='width:15px'><a id='PLANNINGAPPLICATION"+obj['RECORD ID']+"' name='PLANNINGAPPLICATION"+obj['RECORD ID']+"'></a></td><td style='width:150px'><b>Planning App. No.: </b> </td><td><b>" + tmpRecordID+ "</b></td></tr>"
								var plannerName=obj['PLANNER NAME']
								var plannerEmail=obj['PLANNER EMAIL']
								var plannerPhone=obj['PLANNER PHONE']
								if (plannerName.length<2) {
									plannerName="Planning Information Center"
								} 
								if (plannerEmail.indexOf("@")<1) {
									plannerEmail="pic@sfgov.org"
								} 
								if (plannerPhone.length<7) {
									plannerPhone="415-558-6377"
								} 
								if ((theLoc=="City") && (dept=="PLANNING")) {
									
								} else {
									var baseYear = new Date (1960, 10, 1)
									var decisDate = new Date(obj["DATE CLOSED"])
									if (decisDate > baseYear) {
										var today = new Date()
										var yearAgo = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 365))
										if (decisDate < yearAgo) {
											plannerName = "Planning Information Center";
											plannerPhone = "415-558-6377";
											plannerEmail = "pic@sfgov.org";
										}
									}
								}
								
								var plannerEmailLink = "<a href='mailto:"+plannerEmail+"'>"+plannerName+"</a> Tel: "+plannerPhone
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'><b>Planner: </b> </td><td><b>" + plannerEmailLink+ "</b></td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + recTypeType + " / " + recTypeSubType+  "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType +  "</td></tr>"
								
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								
								if (tempOpenDate) {
									curr_date = tempOpenDate.getDate();   
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempOpenDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()
									curr_month = tempOpenDate.getMonth() + 1; //months are zero based
									curr_year = tempOpenDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
										
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + recName + "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + recDesc + "</td></tr>"
										
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + recAPN + "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + recAddress+ "</td></tr>"
								
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								if (tempStatusDate) {
									curr_date = tempStatusDate.getDate();   
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempStatusDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()
									curr_month = tempStatusDate.getMonth() + 1; //months are zero based
									curr_year = tempStatusDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								
								if (!theStatus) {
									theStatus=''
								}
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus  + "</td></tr>"
								
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								if (tempCloseDate) {
									curr_date = tempCloseDate.getDate();   
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempCloseDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()
									curr_month = tempCloseDate.getMonth() + 1; //months are zero based
									curr_year = tempCloseDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Closed:  </td><td>" + dateString + "</td></tr>"
								
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								//if (tempCompletedDate) {
								//	curr_date = tempCompletedDate.getDate();   
								//	curr_month = tempCompletedDate.getMonth() + 1; //months are zero based
								//	curr_year = tempCompletedDate.getFullYear(); 
								//	dateString = curr_month+ "/" + curr_date + "/" + curr_year
								//}
								
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(jobValue) + "</td></tr>"
								var ACALinkData = templateID.split("/");
								var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
								var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
											
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
								//if ((theLoc=="City") && (dept=="PLANNING")) {
								//	theHtml += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
								//}
								
								if ((theLoc=="City") && (dept=="PLANNING")) {
									theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
								} else {
									theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
								}
								
								
								
								theHtml += "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Related Records:  </td><td></td></tr>"
								theHtml += "</table>"
								 
										
								//if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed") {
								if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed"&&theStatus!= "Expired"&&theStatus!= "Issued"&&theStatus!= "Revoked"&&theStatus!= "Void"&&theStatus!= "Withdrawn"&&theStatus!= "Cancelled"&&theStatus!= "Case Closed") {
									theCaseActive=theCaseActive +1
								}
								
							}
							
						}
					}
				}
			} 
			//alert(addedCases)
			theCaseTrackingHtml +=theHtml
			if (theNum==0) {
				theCaseTrackingHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
			}
			if (theCaseActive==0) {
				document.getElementById('tabTitle'+'3').style.color= ""//"#828282"
				document.getElementById('tabTitle'+'3').style.fontWeight=""//"normal"
				document.getElementById('tabTitle'+'3').style.fontSize=""//"11px" 
			} else {
				document.getElementById('tabTitle'+'3').style.color="black" 
				document.getElementById('tabTitle'+'3').style.fontWeight="bold" 
				document.getElementById('tabTitle'+'3').style.fontSize="15px" 
			}
			
			theCaseTrackingHtml +="<a name='BookmarkShortTermRentals'/><br>"
			//theCaseTrackingHtml +="<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PLANNING APPLICATIONS: </SPAN></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			if (isLayerVisible("Short Term Rentals")) {
				theCaseTrackingHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>SHORT TERM RENTALS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} else {
				theCaseTrackingHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>SHORT TERM RENTALS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
			
			theNum = 0
			
			for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (result.layerName == "Short Term Rentals") {
					//alert("found one")
					//if (result.feature.attributes["record_status"] == 'Approved' ) {
						
					theNum = theNum + 1
					
					
					if  ( result.feature.attributes["date_mailed"] !="Null" && result.feature.attributes["date_mailed"] !="" && result.feature.attributes["date_mailed"] !="Nothing")  {
						var d = new Date(result.feature.attributes["date_mailed"] );
						
						if (d instanceof Date) {
							var curr_date = d.getDate();
							var curr_month = d.getMonth() +1;
							var curr_year = d.getFullYear();
							var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
							theValidStart = curr_month + "/" + curr_date + "/" + curr_year;
							theValidEnd = curr_month + "/" + curr_date + "/" + (curr_year+2);
							theMonthName = monthNames[curr_month-1]
							theValidStart = theMonthName + " " + curr_year
							theValidEnd = theMonthName + " " + (curr_year+2)
							theCaseTrackingHtml += "<table class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'>Record ID:</td><td>" + result.feature.attributes["record_id"] + "</td></tr><tr><td style='width:15px'></td><td>Record Name:</td><td>" + result.feature.attributes["record_name"] + "</td></tr><tr><td style='width:15px'></td><td>Parcel:</td><td>" + result.feature.attributes["blklot"] + "</td></tr><tr><td style='width:15px'></td><td>Status:</td><td>" + result.feature.attributes["record_status"] + "</td></tr><tr><td style='width:15px'></td><td>Permitted:</td><td>" + theValidStart +" - " + theValidEnd+ "</td></tr></table><br class='NoPrint'>"
						}
					}
					
				}
			}
			if (theNum==0) {
				theCaseTrackingHtml = theCaseTrackingHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table><br class='NoPrint'>"
			}
			
			//clean out 'null's and 'undefined's
			theCaseTrackingHtml = theCaseTrackingHtml.replace(/Null/gi,"&nbsp");
			theCaseTrackingHtml = theCaseTrackingHtml.replace(/undefined/gi,"&nbsp");
			if (theLoc=="City") {
				theCaseTrackingHtml += "<br><br><table class='reportData' ><tr><td style='width:15px'></td><td>* Only visible to City staff. You need to log in to Accela Automation.</td></tr></table>"
			}
			//add some room to the bottom of the report
			theCaseTrackingHtml += "<p class='NoPrint'><br></p>"
			theCaseTrackingHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkProjectsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
			theCaseTrackingHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
			//alert(theMiscPermitsHtml)
			document.getElementById('CaseTrackingReport').innerHTML = theCaseTrackingHtml
			//alert("-"+theBM+"-" + "\n"+theSearchType + "\n"+theSearchString)

			if (theBM=="" && theSearchType=="Case" && theSearchTypeDetailed=="PLANNING APPLICATION") {
				theBM="PLANNINGAPPLICATION"+theSearchString
				//alert(theBM)
			}
			if (theBM.indexOf("PLANNINGAPPLICATION")>-1) {
				//alert("here")
				showTab('dhtmlgoodies_tabView1',"3");
				thebookmark='#'+theBM
				jumpToBookmark(thebookmark)
				theBM=''
			}

			//updateOtherPermitsHtml();	
		},
		error: function(jqXHR, exception) {
			//alert("There's an Error")
			//alert(jqXHR.status)
			var theError="Error"
			if (jqXHR.status === 0) {
				theError = "Cannot connect to Accela database.  This is usually caused by the Accela CivicData servers being very busy. Other potential causes: network error; Accela services down; request too long (can happen with large condos). Try waiting a few seconds and running the search again.  Clearing your browser's cache (or clicking control-F5 on a Windows machine) may also correct this."
			} else if (jqXHR.status == 404) {
				theError = 'Requested page not found or no response from permitting server. [404]  This may be caused by an unusaully complex request (e.g. many permits being attached to hundreds of parcels).'				
			} else if (jqXHR.status == 414) {
				theError = 'Request Too Large. [414]'
			}else if (jqXHR.status == 500) {
				theError='Internal Server Error [500].'
			} else if (exception === 'parsererror') {
				theError='Requested JSON parse failed.'
			} else if (exception === 'timeout') {
				theError='Time out error.'
				
			} else if (exception === 'abort') {
				theError='Ajax request aborted.'
				
			} else {
				theError='Uncaught Error.n' + jqXHR.responseText
                theError="Error connecting to Accela permitting database.  <br><br>This can happen if your browser has cached an expired connection parameter, if you are using a Windows machine try clicking control-F5, this will clear your browser's cache for this website.  Alternatively, clear your cache entirely then try again. <br>"
				
			}
			console.log(theError)
			//theCaseTrackingHtml +="<br><br>" + theError + "<br><br>"
			theCaseTrackingHtml +="<table  class='reportData' style='width:100%; border-bottom: none;'><tr><td style='width:15px'><td>" + theError + "<br><br>If this problem persists please email <a href='mike.wynne@sfgov.org'>Mike Wynne</a> and provide details of the property that you searched for, the browser you used and the operating system of your machine.</td></tr></table>"
			document.getElementById('CaseTrackingReport').innerHTML = theCaseTrackingHtml
			//updateOtherPermitsHtml();	
		}
	})
	.fail(function(xhr, status, error) {
		console.log("Error1");
		console.log("Status1: " + status)
		console.log("Error1: " + error)
	})
	.always(function(jqXHR, exception) {
		console.log("complete");
		if (jqXHR.status === 0) {
			console.log("Cannot connect to Accela database.  This is usually caused by the Accela CivicData servers being very busy. Other potential causes: network error; Accela services down; request too long (can happen with large condos). Try waiting a few seconds and running the search again.  Clearing your browser's cache (or clicking control-F5 on a Windows machine) may also correct this.");
		} else if (jqXHR.status == 404) {
			console.log('Requested page not found. [404]');
		} else if (jqXHR.status == 500) {
			console.log('Internal Server Error [500].');
		} else if (exception === 'parsererror') {
			console.log('Requested JSON parse failed.');
		} else if (exception === 'timeout') {
			console.log('Time out error.');
		} else if (exception === 'abort') {
			console.log('Ajax request aborted.');
		} 
	});	
		
}

function idresultsort3(a, b) {
	//var FiledA = new Date(a["DATE OPENED"]);
	//var FiledB = new Date(b["DATE OPENED"]);
	var FiledA = a["RECORD ID"]
	var FiledB = b["RECORD ID"]
	if (FiledA > FiledB)
	return -1
	if (FiledA < FiledB)
	return 1
	return 0
	
}

function updateProjectsHtmlBAK() {
	//var queryString = 'SELECT * from "32fee353-3469-4307-bdcd-54ddbe9b5fae" WHERE "APN"=\'' +themapblklot + '\' order by "RECORD ID" desc'
	//var queryString = 'SELECT * from "32fee353-3469-4307-bdcd-54ddbe9b5fae" WHERE "APN" in (' +theParcelList + ') order by "RECORD ID" desc'
	//alert("here")
	var theFieldList = ' "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."APN" '
	theFieldList +=', "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE OPENED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."ADDRESS" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE CATEGORY" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS DATE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."STATUS" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."JOB VALUE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE CLOSED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE COMPLETED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE TYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DESCRIPTION" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE SUBTYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."TEMPLATE ID" '
	theFieldList +=', "c10252c9-bcc3-4ec4-b8ae-f863452bd27f"."PARENT_ID" '
	theFieldList +=', "c10252c9-bcc3-4ec4-b8ae-f863452bd27f"."CHILD_ID" '
	
	if (!theParcelListForAccela) {
		theParcelListForAccela="'9'"
	}
	var queryString = 'SELECT ' + theFieldList + ' from  "32fee353-3469-4307-bdcd-54ddbe9b5fae" '
	queryString += 'LEFT JOIN "3b63c2ea-1ea7-4232-be53-24751ff15dde" ON "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" = "3b63c2ea-1ea7-4232-be53-24751ff15dde"."record_id" '
	queryString += 'LEFT JOIN "c10252c9-bcc3-4ec4-b8ae-f863452bd27f" ON "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" = "c10252c9-bcc3-4ec4-b8ae-f863452bd27f"."PARENT_ID" '
	queryString += 'where ("parcel_nbr" in(' + theParcelListForAccela +  ') OR "APN"  in(' + theParcelListForAccela + ' ) ) and "RECORD TYPE" <> ' + "'Misc. Permits-REF (MIS)'" + ' order by "record_id" desc'
	
	
	//prompt("",queryString)
	var theHtml='';
	var theCaseActive=0
	theCaseTrackingHtml = theCaseTrackingHtml + "<table class='NoPrint'><tr><td style='padding-left:15px'><a target='_blank' href='MapHelp.html#ProjectsGlossary'>Glossary </a></td></tr></table><br>"
	theCaseTrackingHtml +="<br><table class='reportData' width=100%><tr><td style='width:10px'></td><td>Permits are required in San Francisco to operate a businesses or to perform construction activity. The Planning Department reviews most applications for these permits in order to ensure that the projects comply with the <a alt='PlanningCode' href='http://planningcode.sfplanning.org' target='_blank'>Planning Code</a>. The 'Project' is the activity being proposed.</td></tr></table>"
	theCaseTrackingHtml +="<br><br><div class='NoPrint'><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theCaseTrackingHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkProjects'>Projects</a></td></tr></table>"
	theCaseTrackingHtml +="<br></div>"
	theCaseTrackingHtml +="<a name='BookmarkProjects'/>"
	theCaseTrackingHtml +="<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PROJECTS: </SPAN></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	theCaseNum = 0
	//var data = {
	//	sql: queryString
	//};
	var data = JSON.stringify({"sql" : queryString});
	$.ajax({
		url: "http://www.civicdata.com/api/action/datastore_search_sql", 
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function(data) {
			recordTotal=data.result.records.length
			var tmpRecordID = ""
			var tmpRecordTypeDetailed = ""
			var tmpOpened = ""
			//alert("Total Planning records returned from Accela: " + recordTotal)
			if (data.result.records.length==0) {
				//theHtml = "No records found"
				//theCaseTrackingHtml+=theHtml
			} else {
				tmpPRJ=""
				var tempDate = new Date() 
				for (i=0; i<data.result.records.length;i++) {
					theCaseNum= i+1
					var obj = data.result.records[i]
					//alert(i)
					if (obj['RECORD TYPE TYPE'] =="Project") {
						if (tmpRecordID!=obj['RECORD ID'] && tmpRecordTypeDetailed != obj['RECORD TYPE'] && tmpOpened != obj['DATE OPENED']) {
							tmpRecordID = obj['RECORD ID']
							tmpRecordTypeDetailed = obj['RECORD TYPE']
							tmpOpened = obj['DATE OPENED']
							//if there is a Project record display this first
							tmpPRJ=obj['RECORD ID'].substring(0,obj['RECORD ID'].length-3)
							theHtml +="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
							theHtml += "<tr><td style='width:15px'><a id='PLANNINGAPPLICATION"+obj['RECORD ID']+"' name='PLANNINGAPPLICATION"+obj['RECORD ID']+"'></a></td><td style='width:150px'><b>Record ID: </b> </td><td><b>" + obj['RECORD ID']+ "</b></td></tr>"
							
							var theRecType = obj['RECORD TYPE']
							if (!theRecType) { 
								theRecType = obj['RECORD TYPE TYPE'] 
							}
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + obj['RECORD TYPE TYPE']  + "</td></tr>"
							theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Template ID:  </td><td>" + obj['TEMPLATE ID'] + "</td></tr>"
							var tempDate = new Date() 
							tempDate=dateConvert(obj['DATE OPENED'])
							var curr_date=""
							var curr_month=""
							var curr_year=""
							var dateString=""
							if (tempDate) {
								curr_date = tempDate.getDate();   
								//Switch to Pacific Time from UTC
								var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
								curr_date = curr_date2.getDate()
								curr_month = tempDate.getMonth() + 1; //months are zero based
								curr_year = tempDate.getFullYear(); 
								dateString = curr_month+ "/" + curr_date + "/" + curr_year
							}
							theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" +dateString+ "</td></tr>"
							theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + obj['RECORD NAME'] + "</td></tr>"
							theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + obj['DESCRIPTION'] + "</td></tr>"
							
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Project Subtype:  </td><td>" + obj['RECORD TYPE SUBTYPE'] + "</td></tr>"
							theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + obj['APN'] + "</td></tr>"
							theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + obj['ADDRESS'] + "</td></tr>"
							
							var tempDate = new Date() 
							tempDate=dateConvert(obj['RECORD STATUS DATE'])
							var curr_date=""
							var curr_month=""
							var curr_year=""
							var dateString=""
							if (tempDate) {
								curr_date = tempDate.getDate();   
								//Switch to Pacific Time from UTC
								var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
								curr_date = curr_date2.getDate()
								curr_month = tempDate.getMonth() + 1; //months are zero based
								curr_year = tempDate.getFullYear(); 
								dateString = curr_month+ "/" + curr_date + "/" + curr_year
							}
							var theStatus = obj['STATUS']
							if (!theStatus) {
								theStatus=''
							}
							theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Status Date:  </td><td>" + obj['RECORD STATUS DATE'] + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Date Assigned:  </td><td>" + obj['DATE ASSIGNED'] + "</td></tr>"
							var tempDate = new Date() 
							tempDate=dateConvert(obj['DATE CLOSED'])
							var curr_date=""
							var curr_month=""
							var curr_year=""
							var dateString=""
							if (tempDate) {
								curr_date = tempDate.getDate(); 
								//Switch to Pacific Time from UTC
								var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
								curr_date = curr_date2.getDate()								
								curr_month = tempDate.getMonth() + 1; //months are zero based
								curr_year = tempDate.getFullYear(); 
								dateString = curr_month+ "/" + curr_date + "/" + curr_year
							}
							
							theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Date Closed:  </td><td>" + obj['DATE CLOSED'] + "</td></tr>"
							var tempDate = new Date() 
							tempDate=dateConvert(obj['DATE COMPLETED'])
							var curr_date=""
							var curr_month=""
							var curr_year=""
							var dateString=""
							if (tempDate) {
								curr_date = tempDate.getDate();   
								//Switch to Pacific Time from UTC
								var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
								curr_date = curr_date2.getDate()
								curr_month = tempDate.getMonth() + 1; //months are zero based
								curr_year = tempDate.getFullYear(); 
								dateString = curr_month+ "/" + curr_date + "/" + curr_year
							}
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Date Completed:  </td><td>" + dateString + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Module:  </td><td>" + obj['RECORD MODULE'] + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Balance Due:  </td><td>" + obj['BALANCE DUE'] + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(obj['JOB VALUE']) + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type Category: </b> </td><td>" + obj['RECORD TYPE CATEGORY'] + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + obj['STATUS'] + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>License Num: </td><td>" + obj['LICENSE NBR'] + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Business Name:  </td><td>" + obj['BUSINESS NAME'] + "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Full Text:  </td><td>" + obj['_full_text']+ "</td></tr>"
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>ID:</td><td>" + obj['_id'] + "<br><br></td></tr>"
							var ACALinkData = obj['TEMPLATE ID'].split("/");
							var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
							var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
							
							//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
							//if ((theLoc=="City") && (dept=="PLANNING")) {
							//	theHtml += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
							//}
							
							if ((theLoc=="City") && (dept=="PLANNING")) {
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
							} else {
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
							}
							
							
							
							theHtml += "</td></tr>"
							theHtml +="<tr><td style='width:15px'></td><td style='width:150px'>Associated Cases:</td><td>" //</td></tr>"
							//theHtml += "</table><br>" 
							tmpCase=""
							theCaseNum=0
							for (j=0; j<data.result.records.length;j++) {
								//search for cases related to the project record
								var obj2 = data.result.records[j]
								tmpCase = obj2['RECORD ID'].substring(0,obj2['RECORD ID'].length-3)
								if ((tmpPRJ==tmpCase) && (obj2['RECORD TYPE TYPE']!="Project") ) {
									if (tmpRecordID!=obj2['RECORD ID'] && tmpRecordTypeDetailed != obj2['RECORD TYPE'] && tmpOpened != obj2['DATE OPENED']) {
										tmpRecordID = obj['RECORD ID']
										tmpRecordTypeDetailed = obj['RECORD TYPE']
										tmpOpened = obj['DATE OPENED']
										theCaseNum=theCaseNum+1
										theHtml +="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
										theHtml += "<tr><td style='width:150px'><a id='PLANNINGAPPLICATION"+obj['RECORD ID']+"' name='PLANNINGAPPLICATION"+obj['RECORD ID']+"'></a><b>Record ID: </b> </td><td><b>" + obj2['RECORD ID']+ "</b></td></tr>"
										var theRecType = obj['RECORD TYPE']
										//if (!theRecType) { 
										//	theRecType = obj['RECORD TYPE TYPE'] 
										//}
										theHtml += "<tr><td style='width:150px'>Type:  </td><td>" + obj2['RECORD TYPE TYPE'] +" / " + obj2['RECORD TYPE SUBTYPE']+ "</td></tr>"
										theHtml += "<tr><td style='width:150px'>Type Detailed:  </td><td>" + obj2['RECORD TYPE']+ "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Template ID:  </td><td>" + obj2['TEMPLATE ID'] + "</td></tr>"
										var tempDate = new Date() 
										tempDate=dateConvert(obj['DATE OPENED'])
										var curr_date=""
										var curr_month=""
										var curr_year=""
										var dateString=""
										if (tempDate) {
											curr_date = tempDate.getDate();   
											//Switch to Pacific Time from UTC
											var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
											curr_date = curr_date2.getDate()
											curr_month = tempDate.getMonth() + 1; //months are zero based
											curr_year = tempDate.getFullYear(); 
											dateString = curr_month+ "/" + curr_date + "/" + curr_year
										}
										theHtml += "<tr><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
										//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Project Name:  </td><td>" + obj2['RECORD NAME'] + "</td></tr>"
										//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Project Description:  </td><td>" + obj2['DESCRIPTION'] + "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Subtype:  </td><td>" + obj2['RECORD TYPE SUBTYPE'] + "</td></tr>"
										var tempDate = new Date() 
										tempDate=dateConvert(obj['RECORD STATUS DATE'])
										var curr_date=""
										var curr_month=""
										var curr_year=""
										var dateString=""
										if (tempDate) {
											curr_date = tempDate.getDate();   
											//Switch to Pacific Time from UTC
											var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
											curr_date = curr_date2.getDate()
											curr_month = tempDate.getMonth() + 1; //months are zero based
											curr_year = tempDate.getFullYear(); 
											dateString = curr_month+ "/" + curr_date + "/" + curr_year
										}
										var theStatus = obj['STATUS']
										if (!theStatus) {
											theStatus=''
										}
										theHtml += "<tr><td style='width:150px'>Status:  </td><td>" + theStatus +"</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Status Date:  </td><td>" + obj2['RECORD STATUS DATE'] + "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Date Assigned:  </td><td>" + obj2['DATE ASSIGNED'] + "</td></tr>"
										var tempDate = new Date() 
										tempDate=dateConvert(obj['DATE CLOSED'])
										var curr_date=""
										var curr_month=""
										var curr_year=""
										var dateString=""
										if (tempDate) {
											curr_date = tempDate.getDate();   
											//Switch to Pacific Time from UTC
											var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
											curr_date = curr_date2.getDate()
											curr_month = tempDate.getMonth() + 1; //months are zero based
											curr_year = tempDate.getFullYear(); 
											dateString = curr_month+ "/" + curr_date + "/" + curr_year
										}
										theHtml += "<tr><td style='width:150px'>Date Closed:  </td><td>" + dateString + "</td></tr>"
										var tempDate = new Date() 
										tempDate=dateConvert(obj['DATE COMPLETED'])
										var curr_date=""
										var curr_month=""
										var curr_year=""
										var dateString=""
										if (tempDate) {
											curr_date = tempDate.getDate(); 
											//Switch to Pacific Time from UTC
											var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
											curr_date = curr_date2.getDate()											
											curr_month = tempDate.getMonth() + 1; //months are zero based
											curr_year = tempDate.getFullYear(); 
											dateString = curr_month+ "/" + curr_date + "/" + curr_year
										}
										//theHtml += "<tr><td style='width:150px'>Date Completed:  </td><td>" + dateString+ "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Balance Due:  </td><td>" + obj2['BALANCE DUE'] + "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(obj2['JOB VALUE']) + "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Record Type Category: </b> </td><td>" + obj2['RECORD TYPE CATEGORY'] + "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Status:  </td><td>" + obj2['STATUS'] + "</td></tr>"
										//theHtml += "<tr><<td style='width:150px'>License Num: </td><td>" + obj2['LICENSE NBR'] + "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Business Name:  </td><td>" + obj2['BUSINESS NAME'] + "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>Full Text:  </td><td>" + obj2['_full_text']+ "</td></tr>"
										//theHtml += "<tr><td style='width:150px'>ID:</td><td>" + obj['_id'] + "<br><br></td></tr>"
										var ACALinkData = obj2['TEMPLATE ID'].split("/");
										var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
										var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
										
										//theHtml += "<tr></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
										//if ((theLoc=="City") && (dept=="PLANNING")) {
										//	theHtml += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
										//}
										
										if ((theLoc=="City") && (dept=="PLANNING")) {
											theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
										} else {
											theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
										}
										
										
										theHtml += "</td></tr>"
										theHtml += "</table><br>" 
									}
								}
							}
						
							if (theCaseNum==0) {
								theHtml +="None."
							} 
							theHtml +="</td></tr></table><br>"
						}
					} else {
						//display those records with no associated Project record.
						tmpCase=obj['RECORD ID'].substring(0,obj['RECORD ID'].length-3)
						tmpCasePRJ=tmpCase+"PRJ"
						PRJExists=false;
						for (k=0; k<data.result.records.length;k++) {
							var obj3 = data.result.records[k]
							if (tmpCasePRJ==obj3['RECORD ID']) {
								PRJExists=true;
							}
						}
						if (!PRJExists) {
							if (tmpRecordID!=obj['RECORD ID'] && tmpRecordTypeDetailed != obj['RECORD TYPE'] && tmpOpened != obj['DATE OPENED']) {
								//alert(i)
								tmpRecordID = obj['RECORD ID']
								tmpRecordTypeDetailed = obj['RECORD TYPE']
								tmpOpened = obj['DATE OPENED']
								theHtml +="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
								theHtml += "<tr><td style='width:15px'><a id='PLANNINGAPPLICATION"+obj['RECORD ID']+"' name='PLANNINGAPPLICATION"+obj['RECORD ID']+"'></a></td><td style='width:150px'><b>Record ID: </b> </td><td><b>" + obj['RECORD ID']+ "</b></td></tr>"
								var theRecType = obj['RECORD TYPE']
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + obj['RECORD TYPE TYPE'] + " / " + obj['RECORD TYPE SUBTYPE'] +  "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType +  "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Template ID:  </td><td>" + obj['TEMPLATE ID'] + "</td></tr>"
								var tempDate = new Date() 
								tempDate=dateConvert(obj['DATE OPENED'])
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								if (tempDate) {
									curr_date = tempDate.getDate();  
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()
									curr_month = tempDate.getMonth() + 1; //months are zero based
									curr_year = tempDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
								
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + obj['RECORD NAME'] + "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + obj['DESCRIPTION'] + "</td></tr>"
								
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Subtype:  </td><td>" + obj['RECORD TYPE SUBTYPE'] + "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + obj['APN'] + "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + obj['ADDRESS'] + "</td></tr>"
								var tempDate = new Date() 
								tempDate=dateConvert(obj['RECORD STATUS DATE'])
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								if (tempDate) {
									curr_date = tempDate.getDate(); 
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()									
									curr_month = tempDate.getMonth() + 1; //months are zero based
									curr_year = tempDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								var theStatus = obj['STATUS']
								if (!theStatus) {
									theStatus=''
								}
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus  + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Status Date:  </td><td>" + obj['RECORD STATUS DATE'] + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Assigned:  </td><td>" + obj['DATE ASSIGNED'] + "</td></tr>"
								var tempDate = new Date() 
									tempDate=dateConvert(obj['DATE CLOSED'])
									var curr_date=""
									var curr_month=""
									var curr_year=""
									var dateString=""
									if (tempDate) {
										curr_date = tempDate.getDate();   
										//Switch to Pacific Time from UTC
										var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
										curr_date = curr_date2.getDate()
										curr_month = tempDate.getMonth() + 1; //months are zero based
										curr_year = tempDate.getFullYear(); 
										dateString = curr_month+ "/" + curr_date + "/" + curr_year
									}
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Closed:  </td><td>" + dateString + "</td></tr>"
								var tempDate = new Date() 
								tempDate=dateConvert(obj['DATE COMPLETED'])
								var curr_date=""
								var curr_month=""
								var curr_year=""
								var dateString=""
								if (tempDate) {
									curr_date = tempDate.getDate();   
									//Switch to Pacific Time from UTC
									var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
									curr_date = curr_date2.getDate()
									curr_month = tempDate.getMonth() + 1; //months are zero based
									curr_year = tempDate.getFullYear(); 
									dateString = curr_month+ "/" + curr_date + "/" + curr_year
								}
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Completed:  </td><td>" + dateString + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Module:  </td><td>" + obj['RECORD MODULE'] + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Balance Due:  </td><td>" + obj['BALANCE DUE'] + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(obj['JOB VALUE']) + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type Category: </b> </td><td>" + obj['RECORD TYPE CATEGORY'] + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + obj['STATUS'] + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>License Num: </td><td>" + obj['LICENSE NBR'] + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Business Name:  </td><td>" + obj['BUSINESS NAME'] + "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Full Text:  </td><td>" + obj['_full_text']+ "</td></tr>"
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>ID:</td><td>" + obj['_id'] + "<br><br></td></tr>"
								var ACALinkData = obj['TEMPLATE ID'].split("/");
								var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
								var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
									
								//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp;"
								//if ((theLoc=="City") && (dept=="PLANNING")) {
								//	theHtml += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
								//}
								
								
								if ((theLoc=="City") && (dept=="PLANNING")) {
									theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
								} else {
									theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
								}
								
								theHtml += "</td></tr>"
								theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Related Records:</td><td>None.</td>" //</td></tr>"
								theHtml += "</table><br>" 
							}
						}
							
						
					}
				}
			} 
			//alert(theHtml)
			theCaseTrackingHtml +=theHtml
			if (theCaseNum==0) {
				theCaseTrackingHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
			}
			if (theCaseActive==0) {
				document.getElementById('tabTitle'+'3').style.color= ""//"#828282"
				document.getElementById('tabTitle'+'3').style.fontWeight=""//"normal"
				document.getElementById('tabTitle'+'3').style.fontSize=""//"11px" 
			} else {
				document.getElementById('tabTitle'+'3').style.color="black" 
				document.getElementById('tabTitle'+'3').style.fontWeight="bold" 
				document.getElementById('tabTitle'+'3').style.fontSize="15px" 
			}
			
			//clean out 'null's and 'undefined's
			theCaseTrackingHtml = theCaseTrackingHtml.replace(/Null/gi,"&nbsp");
			theCaseTrackingHtml = theCaseTrackingHtml.replace(/undefined/gi,"&nbsp");
			if (theLoc=="City") {
				theCaseTrackingHtml += "<br><table class='reportData' ><tr><td style='width:15px'></td><td>* Fields marked with an asterisk are only visible to City staff. </td></tr></table>"
			}
			//add some room to the bottom of the report
			
			

			
			
			theCaseTrackingHtml += "<p class='NoPrint'><br></p>"
			theCaseTrackingHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkProjectsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
			theCaseTrackingHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
			document.getElementById('CaseTrackingReport').innerHTML = theCaseTrackingHtml	
		},
		error: function(xhr, status, error) {
			theHtml=status + "<br><br>" + error + "<br><br>" + xhr.error
			theCaseTrackingHtml +="<table  class='reportData' style='width:100%; border-bottom: solid;'><tr><td style='width:15px'><td> Error connecting to Accela Permitting data!  If this problem persists please contact the system administrator.</td></tr></table>"
			document.getElementById('CaseTrackingReport').innerHTML = theCaseTrackingHtml	
		}
	});	
}

function dateConvert(s) {
    var day, tz,
    rx=/^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
    p= rx.exec(s) || [];
    if(p[1]){
        day= p[1].split(/\D/);
        for(var i= 0, L= day.length;i<L;i++){
            day[i]= parseInt(day[i], 10) || 0;
        };
        day[1]-= 1;
        day= new Date(Date.UTC.apply(Date, day));
        if(!day.getDate()) return NaN;
            //adjust for time zone offset:
        if(p[5]){
            tz= (parseInt(p[5], 10)*60);
            if(p[6]) tz+= parseInt(p[6], 10);
            if(p[4]== '+') tz*= -1;
            if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
        }
        return day;
    }
    return NaN;
}

function updateBuildingPermitsHtml() {
	//go through the results array and look for the DBI Building Permits records that were found at the location.  Add these to the Permits report HTML.  

	thePermitsHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Applications for Building Permits submitted to the Department of Building Inspection.<br></td></tr></table>"
	thePermitsHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	thePermitsHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBuildingPermits'>Building Permits</a></td></tr></table>"
	thePermitsHtml +="<br></div>"
	//alert("1")
	var theDBIActive=0;
	thePermitsHtml +="<a name='BookmarkBuildingPermits'></a>"
	if (isLayerVisible("DBI - Building Permits")) {
		thePermitsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BUILDING PERMITS: </span><input class='NoPrint' onclick='showHideMap( " + '"DBI - Building Permits"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='DBI - Building Permits' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		thePermitsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BUILDING PERMITS: </span><input class='NoPrint' onclick='showHideMap( " + '"DBI - Building Permits"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='DBI - Building Permits' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
			
		if (result.layerName == "DBI - Building Permits") {
			theNum = theNum + 1
			var theYear = null
			theYear = parseInt(result.feature.attributes["app_no"].substring(0,4))
			theCatEx = result.feature.attributes["catex"]
			//alert(theYear)
			if ((theYear > 1999) && (theYear <2020))  {
				thePermitsHtml = thePermitsHtml + "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'><b>Permit:</b> </td><td><b><a href='http://dbiweb.sfgov.org/dbipts/default.aspx?page=Permit&PermitNumber="+ result.feature.attributes["app_no"]+"&Stepin=1' target='_blank'>" + result.feature.attributes["app_no"] + "</b></a> </td></tr><tr><td></td><td>Form: </td><td>" + result.feature.attributes["form_no"] + " - "  + result.feature.attributes["Form_Type"] + " </td></tr><tr><td></td><td>Filed: </td><td>" + result.feature.attributes["file_date"] + "</td></tr><tr><td></td><td>Address: </td><td>" + result.feature.attributes["address"] +  "</td></tr><tr><td></td><td>Parcel: </td><td>" + result.feature.attributes["block"] +"/" + result.feature.attributes["lot"] + "</td></tr><tr><td></td><td>Existing: </td><td>" + result.feature.attributes["existinguse"] +"</td></tr><tr><td></td><td>Proposed: </td><td>" + result.feature.attributes["proposeduse"] + "</td></tr><tr><td></td><td>Existing Units: </td><td>" + result.feature.attributes["existingunits"] +  "</td></tr><tr><td></td><td>Proposed Units: </td><td>" + result.feature.attributes["proposedunits"] +  "</td></tr><tr><td></td><td>Status: </td><td>" + result.feature.attributes["laststatus"] + "</td></tr><tr><td></td><td>Status Date: </td><td>" + result.feature.attributes["laststatusdate"] + "</td></tr><tr><td></td><td>Description: </td><td>" + result.feature.attributes["description"] + "</td></tr><tr>" 
				if (theCatEx.substring(0,1)!="-" && theCatEx.substring(0,1)!="Null" && theCatEx.substring(0,1)!="" && theCatEx.length>10) {
					theCatEx = theCatEx.replace("//Citypln-infovol/InfoDrive/DECISION DOCUMENTS/","http://" + theServerName + "/docs/Decision_Documents/")
					thePermitsHtml = thePermitsHtml + "<tr><td></td><td>CEQA CatEx:</td><td><a target='_blank' href='" + theCatEx + "'>View Categorical Exemption Evaluation</a></td></tr>"
				}
			} else {
				
				thePermitsHtml = thePermitsHtml + "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:150px'><b>Permit:</b> </td><td><b><a href='http://dbiweb.sfgov.org/dbipts/default.aspx?page=Permit&PermitNumber="+ result.feature.attributes["app_no"]+"&Stepin=1' target='_blank'>" + result.feature.attributes["app_no"] + "</b></a> </td></tr><tr><td></td><td>Form: </td><td>" + result.feature.attributes["form_no"] + " - "  + result.feature.attributes["Form_Type"] + " </td></tr><tr><td></td><td>Filed: </td><td>" + result.feature.attributes["file_date"] + "</td></tr><tr><td></td><td>Address: </td><td>" + result.feature.attributes["address"] + "</td></tr><tr><td></td><td>Existing: </td><td>" + result.feature.attributes["existinguse"] +"</td></tr><tr><td></td><td>Proposed: </td><td>" + result.feature.attributes["proposeduse"] + "</td></tr><tr><td></td><td>Existing Units: </td><td>" + result.feature.attributes["existingunits"] +  "</td></tr><tr><td></td><td>Proposed Units: </td><td>" + result.feature.attributes["proposedunits"] +  "</td></tr><tr><td></td><td>Status: </td><td>" + result.feature.attributes["laststatus"] + "</td></tr><tr><td></td><td>Status Date: </td><td>" + result.feature.attributes["laststatusdate"] + "</td></tr><tr><td></td><td>Description: </td><td>" + result.feature.attributes["description"] + "</td></tr><tr>"
				if (theCatEx.substring(0,1)!="-" && theCatEx.substring(0,1)!="Null" && theCatEx.substring(0,1)!="" && theCatEx.length>10) {
					theCatEx = theCatEx.replace("//Citypln-infovol/InfoDrive/DECISION DOCUMENTS/","http://" + theServerName + "/docs/Decision_Documents/")
					thePermitsHtml = thePermitsHtml + "<tr><td></td><td>CEQA CatEx:</td><td><a target='_blank' href='" + theCatEx + "'>View Categorical Exemption Evaluation</a></td></tr>"
				}	
			}
			if (theLoc=="City" && result.feature.attributes["staff"] !="Null" && result.feature.attributes["staff"] !="" && result.feature.attributes["staff"] !="Nothing") {
				thePermitsHtml = thePermitsHtml+ "<tr><td></td><td>Planner Reviewed: </td><td>" + result.feature.attributes["staff"] +  "</td></tr>"
			}
			thePermitsHtml = thePermitsHtml + "<tr><td></td><td>Cost: </td><td>" + formatCurrency(result.feature.attributes["cost"]) +  "</td></tr></table><br class='NoPrint'>"
			
			var theStat=result.feature.attributes["laststatus"];
			if (theStat=='ABONDONED' || theStat=='CANCELLATION' || theStat=='DISAPPROVED' || theStat=='EXPIRE' || theStat=='REVOKE PERMIT' || theStat=="ISSUED" || theStat=="APPROVED" || theStat=="EXPIRED" || theStat=="COMPLETE" || theStat=="CANCELLED") {
			} else {
				theDBIActive=theDBIActive+1;
			}
		}
	}
	if (theNum==0) {
		thePermitsHtml = thePermitsHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	if (theDBIActive==0) {
		document.getElementById('tabTitle'+'4').style.color=""//"#828282"
		document.getElementById('tabTitle'+'4').style.fontWeight=""//"normal" 
		document.getElementById('tabTitle'+'4').style.fontSize=""//"11px" 
	} else {
		document.getElementById('tabTitle'+'4').style.color="black" 
		document.getElementById('tabTitle'+'4').style.fontWeight="bold" 
		document.getElementById('tabTitle'+'4').style.fontSize="15px" 
	}
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Parcel Labels") {
			theBlock = result.feature.attributes["block_num"] 
			theLot = result.feature.attributes["lotmin"] 
		}
	}
	thePermitsHtml += "<br><br><table class='reportData'><tr><td><a class='NoPrint' target='_blank' href='http://dbiweb.sfgov.org/dbipts/default.aspx?page=address&block=" + theBlock + "&lot=" + theLot + "&stepin=1'>Search for other permits (eletrical, plumbing, etc) lodged with the Department of Building Inspections</a></td></tr></table>" 
	
	//clean out 'null's and 'undefined's
	thePermitsHtml = thePermitsHtml.replace(/Null/gi,"&nbsp");
	thePermitsHtml = thePermitsHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	thePermitsHtml += "<p class='NoPrint'><br></p>"
	thePermitsHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkPermitsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	thePermitsHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	
			
	//publish the HTML to the page
	document.getElementById('PermitsReport').innerHTML = thePermitsHtml	
}

function updateOtherPermitsHtml() {
	//var queryString = 'SELECT * from "32fee353-3469-4307-bdcd-54ddbe9b5fae" WHERE "APN"=\'' +themapblklot + '\' order by "RECORD ID" desc'
	//var queryString = 'SELECT * from "32fee353-3469-4307-bdcd-54ddbe9b5fae" WHERE "APN" in (' +theParcelList + ') order by "RECORD ID" desc'
	//alert("here")
	var theFieldList = ' "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."APN" '
	theFieldList +=', "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE OPENED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."ADDRESS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE CATEGORY" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS DATE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."JOB VALUE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE CLOSED" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE COMPLETED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE TYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DESCRIPTION" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE SUBTYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."TEMPLATE ID" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER EMAIL" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER PHONE" '
	//alert("1")
	if (!theParcelListForAccela) {
		theParcelListForAccela="'9'"
	}
	//alert("1")
	if (retiredParcels!="") {
		//alert("in retired parcels")
		theParcelListForAccela += ", " + retiredParcels	
	}
	//alert("2")
	var queryString = 'SELECT ' + theFieldList + ' from  "32fee353-3469-4307-bdcd-54ddbe9b5fae" LEFT JOIN "3b63c2ea-1ea7-4232-be53-24751ff15dde" ON "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" = "3b63c2ea-1ea7-4232-be53-24751ff15dde"."record_id" where ("parcel_nbr" in(' + theParcelListForAccela +  ')  ) and "RECORD TYPE" = ' + "'Misc. Permits-REF (MIS)'" + ' order by "record_id" desc'
	retiredParcels=""
	
	
	//prompt("",queryString)
	//console.log("here:\n" + queryString)
	var theHtmlMisc='';
	theHtmlMisc +="<br><table class='reportData' width=100%><tr><td style='width:10px'></td><td>Depending on the activity being proposed a permit may need to be obtained from the Fire Department, Health Department, Police Department, Alcoholic Beverage Commission or other organization.  The Planning Department reviews most applications for these permits in order to ensure compliance with the <a alt='Planning Code' href='http://planningcode.sfplanning.org'>Planning Code</a>. </td></tr></table>"
	theHtmlMisc +="<br><br><div class='NoPrint'><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theHtmlMisc +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkMiscPermits'>Miscellaneous Permits Reviewed By The Planning Department</a></td></tr></table>"
	theHtmlMisc +="<br></div>"
	theHtmlMisc +="<a name='BookmarkMiscPermits'/>"
	//theHtmlMisc +="<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>MISCELLANEOUS PERMITS REVIEWED BY THE PLANNING DEPT: </SPAN></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	if (isLayerVisible("Miscellaneous Permits")) {
		theHtmlMisc += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>MISCELLANEOUS PERMITS REVIEWED BY THE PLANNING DEPT: </span><input class='NoPrint' onclick='showHideMap( " + '"Miscellaneous Permits"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Miscellaneous Permits' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theHtmlMisc += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>MISCELLANEOUS PERMITS REVIEWED BY THE PLANNING DEPT: </span><input class='NoPrint' onclick='showHideMap( " + '"Miscellaneous Permits"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Miscellaneous Permits' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theMiscNum = 0
	var theMPActive=0
	//alert(theHtmlMisc)
	//alert("3")
	//var data = {
	//	sql: queryString
	//};
	var data = JSON.stringify({"sql" : queryString});
	$.ajax({
		url: "http://www.civicdata.com/api/action/datastore_search_sql", 
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function(data) {
			//alert("5")
			recordTotal=data.result.records.length
			//alert("Total Planning records returned from Accela: " + recordTotal)
			var tmpRecordID = ""
			//var tmpRecordTypeDetailed = ""
			var tmpOpened = ""
			if (data.result.records.length==0) {
				//theHtml = "No records found"
				//theCaseTrackingHtml+=theHtml
			} else {
				tmpPRJ=""
				var tempDate = new Date() 
				for (i=0; i<data.result.records.length;i++) {
					var obj = data.result.records[i]
					if (tmpRecordID!=obj['RECORD ID'] || tmpOpened != obj['DATE OPENED']) {
						//alert(i)
						tmpRecordID = obj['RECORD ID']
						//tmpRecordTypeDetailed = obj['RECORD TYPE']
						tmpOpened = obj['DATE OPENED']
						theMiscNum= i+1
						
						//alert(i)
						if (theSearchString==obj['RECORD ID']) {
							theSearchTypeDetailed="MISCELLANEOUS PERMIT"
							
						}
						//display those records with no associated Project record.
						tmpCase=obj['RECORD ID'].substring(0,obj['RECORD ID'].length-3)
						tmpCasePRJ=tmpCase+"PRJ"
						PRJExists=false;
						for (k=0; k<data.result.records.length;k++) {
							var obj3 = data.result.records[k]
							if (tmpCasePRJ==obj3['RECORD ID']) {
								PRJExists=true;
							}
						}
							
						theHtmlMisc +="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
						theHtmlMisc += "<tr><td style='width:15px'><a name='MISCELLANEOUSPERMIT"+ obj['RECORD ID']+ "' id='MISCELLANEOUSPERMIT"+obj['RECORD ID']  +"'></a></td><td style='width:150px'><b>Record ID: </b> </td><td><b>" + obj['RECORD ID']+ "</b></td></tr>"
						var plannerName=obj['PLANNER NAME']
						var plannerEmail=obj['PLANNER EMAIL']
						var plannerPhone=obj['PLANNER PHONE']
						//alert(plannerPhone + "  " +plannerPhone.length)
						if (plannerName.length<2) {
							plannerName="Planning Information Center"
						} 
						if (plannerEmail.indexOf("@")<1) {
							plannerEmail="pic@sfgov.org"
						} 
						if (plannerPhone.length<7) {
							plannerPhone="415-558-6377"
						} 
						if ((theLoc=="City") && (dept=="PLANNING")) {
							
						} else {
							var baseYear = new Date (1960, 10, 1)
							var decisDate = new Date(obj["DATE CLOSED"])
							if (decisDate > baseYear) {
								var today = new Date()
								var yearAgo = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 365))
								if (decisDate < yearAgo) {
									plannerName = "Planning Information Center";
									plannerPhone = "415-558-6377";
									plannerEmail = "pic@sfgov.org";
								}
							}
						}
						
						var plannerEmailLink = "<a href='mailto:"+plannerEmail+"'>"+plannerName+"</a> Tel: "+plannerPhone
						theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'><b>Planner: </b> </td><td><b>" + plannerEmailLink+ "</b></td></tr>"
						var theRecType = obj['RECORD TYPE']
						//theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + obj['RECORD TYPE TYPE'] + " / " + obj['RECORD TYPE SUBTYPE'] +  "</td></tr>"
						theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType +  "</td></tr>"
						//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Template ID:  </td><td>" + obj['TEMPLATE ID'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE OPENED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
								
						theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + obj['RECORD NAME'] + "</td></tr>"
						theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + obj['DESCRIPTION'] + "</td></tr>"
								
						//theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + obj['APN'] + "</td></tr>"
						theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + obj['ADDRESS'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['RECORD STATUS DATE'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						var theStatus = obj['RECORD STATUS']
						if (!theStatus) {
							theStatus=''
						}
						theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus  + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE CLOSED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Closed:  </td><td>" + dateString + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE COMPLETED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						//theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(obj['JOB VALUE']) + "</td></tr>"
						var ACALinkData = obj['TEMPLATE ID'].split("/");
						var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
						var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
									
						//theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						//if ((theLoc=="City") && (dept=="PLANNING")) {
						//	theHtmlMisc += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						//}
						
						if ((theLoc=="City") && (dept=="PLANNING")) {
							theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						} else {
							theHtmlMisc += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						}
						
						
						
						
						theHtmlMisc += "</td></tr>"
						theHtmlMisc += "</table><br>" 
								
						//if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed") {
						if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed"&&theStatus!= "Expired"&&theStatus!= "Issued"&&theStatus!= "Revoked"&&theStatus!= "Void"&&theStatus!= "Withdrawn"&&theStatus!= "Cancelled"&&theStatus!= "Case Closed") {
							
							theMPActive=theMPActive +1
						}
					}
				}
			} 
			theMiscPermitsHtml +=theHtmlMisc
			if (theMiscNum==0) {
				theMiscPermitsHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
			}
			if (theMPActive==0) {
				document.getElementById('tabTitle'+'5').style.color= ""//"#828282"
				document.getElementById('tabTitle'+'5').style.fontWeight=""//"normal"
				document.getElementById('tabTitle'+'5').style.fontSize=""//"11px" 
			} else {
				document.getElementById('tabTitle'+'5').style.color="black" 
				document.getElementById('tabTitle'+'5').style.fontWeight="bold" 
				document.getElementById('tabTitle'+'5').style.fontSize="15px" 
			}
			
			//clean out 'null's and 'undefined's
			theMiscPermitsHtml = theMiscPermitsHtml.replace(/Null/gi,"&nbsp");
			theMiscPermitsHtml = theMiscPermitsHtml.replace(/undefined/gi,"&nbsp");
			if (theLoc=="City") {
				theMiscPermitsHtml += "<br><br><table class='reportData' ><tr><td style='width:15px'></td><td>* Only visible to City staff. You need to log in to Accela Automation. </td></tr></table>"
			}
			//add some room to the bottom of the report
			theMiscPermitsHtml += "<p class='NoPrint'><br></p>"
			theMiscPermitsHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkProjectsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
			theMiscPermitsHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
			//alert(theMiscPermitsHtml)
			document.getElementById('MiscPermitsReport').innerHTML = theMiscPermitsHtml	
			
			//alert(theSearchType)
			//alert(theSearchTypeDetailed)
			if (theBM=="" && theSearchType=="Case" && theSearchTypeDetailed=="MISCELLANEOUS PERMIT") {
				theBM="MISCELLANEOUSPERMIT"+theSearchString
				//alert(theBM)
			}
			if (theBM.indexOf("MISCELLANEOUSPERMIT")>-1) {
				//alert("here")
				showTab('dhtmlgoodies_tabView1',"5");
				thebookmark='#'+theBM
				jumpToBookmark(thebookmark)
				theBM=''
			}
			
			//updateComplaintsHtml();	
		},
		error: function(jqXHR, exception) {
			//alert("There's an Error")
			//alert(jqXHR.status)
			var theError="Error"
			if (jqXHR.status === 0) {
				theError = "Cannot connect to Accela database. This is usually caused by the Accela CivicData servers being very busy. Other potential causes: network error; Accela services down; request too long (can happen with large condos). Try waiting a few seconds and running the search again.  Clearing your browser's cache (or clicking control-F5 on a Windows machine) may also correct this."
				
			} else if (jqXHR.status == 404) {
				theError = 'Requested page not found or no response from permitting server. [404]  This may be caused by an unusaully complex request (e.g. many permits being attached to hundreds of parcels).'
				
			} else if (jqXHR.status == 414) {
				theError = 'Request Too Large. [414]'
				
			}else if (jqXHR.status == 500) {
				theError='Internal Server Error [500].'
				
			} else if (exception === 'parsererror') {
				theError='Requested JSON parse failed.'
				
			} else if (exception === 'timeout') {
				theError='Time out error.'
				
			} else if (exception === 'abort') {
				theError='Ajax request aborted.'
				
			} else {
				theError='Uncaught Error.n' + jqXHR.responseText
                theError="Error connecting to Accela permitting database.  <br><br>This can happen if your browser has cached an expired connection parameter, if you are using a Windows machine try clicking control-F5, this will clear your browser's cache for this website.  Alternatively, clear your cache entirely then try again. <br>"
				
			}
			console.log(theError)
			
			theMiscPermitsHtml +=theHtmlMisc + "<table  class='reportData' style='width:100%; border-bottom: none;'><tr><td style='width:15px'><td>" + theError + "<br><br>If this problem persists please email <a href='mike.wynne@sfgov.org'>Mike Wynne</a> and provide details of the property that you searched for, the browser you used and the operating system of your machine.</td></tr></table>"
			document.getElementById('MiscPermitsReport').innerHTML = theMiscPermitsHtml
			//updateOtherPermitsHtml();	
		}
	})
	.fail(function(xhr, status, error) {
		console.log("Error1");
		console.log("Status1: " + status)
		console.log("Error1: " + error)
	})
	.always(function(jqXHR, exception) {
		console.log("complete");
		if (jqXHR.status === 0) {
			console.log("Cannot connect to Accela database.  This is usually caused by the Accela CivicData servers being very busy. Other potential causes: network error; Accela services down; request too long (can happen with large condos). Try waiting a few seconds and running the search again.  Clearing your browser's cache (or clicking control-F5 on a Windows machine) may also correct this.");
		} else if (jqXHR.status == 404) {
			console.log('Requested page not found. [404]');
		} else if (jqXHR.status == 500) {
			console.log('Internal Server Error [500].');
		} else if (exception === 'parsererror') {
			console.log('Requested JSON parse failed.');
		} else if (exception === 'timeout') {
			console.log('Time out error.');
		} else if (exception === 'abort') {
			console.log('Ajax request aborted.');
		} 
	});	
		
}

function updateComplaintsHtml() {
	var theFieldList = ' "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."APN" '
	theFieldList +=', "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE OPENED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."ADDRESS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE CATEGORY" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS DATE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."JOB VALUE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE CLOSED" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE COMPLETED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE TYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DESCRIPTION" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE SUBTYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."TEMPLATE ID" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER EMAIL" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."PLANNER PHONE" '

	if (!theParcelListForAccela) {
		theParcelListForAccela="'9'"
	}
	var queryString = 'SELECT ' + theFieldList + ' from  "32fee353-3469-4307-bdcd-54ddbe9b5fae" LEFT JOIN "3b63c2ea-1ea7-4232-be53-24751ff15dde" ON "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" = "3b63c2ea-1ea7-4232-be53-24751ff15dde"."record_id" where ("parcel_nbr" in(' + theParcelListForAccela +  ')  ) and "RECORD TYPE" = ' + "'Enforcement (ENF)'" + ' order by "record_id" desc'
	//prompt("",queryString)
	theEnforcementHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>The Planning Department and the Department of Building Inspection operate programs that ensure compliance with the San Francisco <a alt='Planning Code' target='_blank' href='http://planningcode.sfplanning.org'>Planning Code</a> and <a alt='Building Code' target='_blank' href='http://www.amlegal.com/nxt/gateway.dll/California/sfbuilding/cityandcountyofsanfranciscobuildingindus?f=templates$fn=default.htm$3.0$vid=amlegal:sanfrancisco_ca'>Building Inspection Commission Codes</a> respectively. Additionally, they respond to customer complaints of potential code violations and initiate fair and unbiased enforcement action to correct those violations and educate property owners to maintain code compliance.</td></tr></table>"
	theEnforcementHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theEnforcementHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkComplaintsPlanning'>Complaints - Planning Dept</a></td></tr></table>"
	theEnforcementHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkComplaintsDBI'>Complaints - Dept of Building Inspections</a></td></tr></table>"
	theEnforcementHtml +="<br></div>"
	
	//go through the results array and look for the Enforcement Complaints records that were found at the location.  Add these to the Complaints report HTML.  
	theEnforcementHtml +="<a name='BookmarkComplaintsPlanning'></a>"
	if (isLayerVisible("Enforcement")) {
		theEnforcementHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>COMPLAINTS - PLANNING DEPT: </span><input class='NoPrint' onclick='showHideMap( " + '"Enforcement"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Enforcement' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theEnforcementHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>COMPLAINTS - PLANNING DEPT: </span><input class='NoPrint' onclick='showHideMap( " + '"Enforcement"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Enforcement' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	var theHtmlEnf=''
	theCompNum = 0
	theCompActive = 0
	//var data = {
	//	sql: queryString
	//};
	var data = JSON.stringify({"sql" : queryString});
	$.ajax({
		url: "http://www.civicdata.com/api/action/datastore_search_sql", 
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function(data) {
			recordTotal=data.result.records.length
			var tmpRecordID = ""
			//var tmpRecordTypeDetailed = ""
			var tmpOpened = ""
			//alert("Total Planning records returned from Accela: " + recordTotal)
			if (data.result.records.length==0) {
				//theHtml = "No records found"
				//theCaseTrackingHtml+=theHtml
			} else {
				tmpPRJ=""
				var tempDate = new Date() 
				for (i=0; i<data.result.records.length;i++) {
					theCompNum= i+1
					var obj = data.result.records[i]
					//alert(obj['RECORD ID'])
					if (tmpRecordID!=obj['RECORD ID'] || tmpOpened != obj['DATE OPENED']) {
						tmpRecordID = obj['RECORD ID']
						//tmpRecordTypeDetailed = obj['RECORD TYPE']
						tmpOpened = obj['DATE OPENED']
						
						
						theHtmlEnf +="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
						theHtmlEnf += "<tr><td style='width:15px'><a id='COMPLAINT"+obj['RECORD ID'] + "' name='COMPLAINT"+ obj['RECORD ID']+ "'></a></td><td style='width:150px'><b>Record ID: </b> </td><td><b>" + obj['RECORD ID']+ "</b></td></tr>"
						var plannerName=obj['PLANNER NAME']
						var plannerEmail=obj['PLANNER EMAIL']
						var plannerPhone=obj['PLANNER PHONE']
						if (plannerName.length<2) {
							plannerName="Planning Information Center"
						} 
						if (plannerEmail.indexOf("@")<1) {
							plannerEmail="pic@sfgov.org"
						} 
						if (plannerPhone.length<7) {
							plannerPhone="415-558-6377"
						} 
						if ((theLoc=="City") && (dept=="PLANNING")) {
							
						} else {
							var baseYear = new Date (1960, 10, 1)
							var decisDate = new Date(obj["DATE CLOSED"])
							if (decisDate > baseYear) {
								var today = new Date()
								var yearAgo = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 365))
								if (decisDate < yearAgo) {
									plannerName = "Planning Information Center";
									plannerPhone = "415-558-6377";
									plannerEmail = "pic@sfgov.org";
								}
							}
						}
						
						var plannerEmailLink = "<a href='mailto:"+plannerEmail+"'>"+plannerName+"</a> Tel: "+plannerPhone
						theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'><b>Planner: </b> </td><td><b>" + plannerEmailLink+ "</b></td></tr>"
						var theRecType = obj['RECORD TYPE']
						//theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + obj['RECORD TYPE TYPE'] + " / " + obj['RECORD TYPE SUBTYPE'] +  "</td></tr>"
						theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType +  "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE OPENED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
								
						theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + obj['RECORD NAME'] + "</td></tr>"
						theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + obj['DESCRIPTION'] + "</td></tr>"
								
						//theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + obj['APN'] + "</td></tr>"
						theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + obj['ADDRESS'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['RECORD STATUS DATE'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();  
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()							
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						var theStatus = obj['RECORD STATUS']
						if (!theStatus) {
							theStatus=''
						}
						theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus  + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE CLOSED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();  
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()							
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Closed:  </td><td>" + dateString + "</td></tr>"
						//var tempDate = new Date() 
						//tempDate=dateConvert(obj['DATE COMPLETED'])
						//var curr_date=""
						///var curr_month=""
						//var curr_year=""
						//var dateString=""
						//if (tempDate) {
						//	curr_date = tempDate.getDate();   
						//	curr_month = tempDate.getMonth() + 1; //months are zero based
						//	curr_year = tempDate.getFullYear(); 
						//	dateString = curr_month+ "/" + curr_date + "/" + curr_year
						//}
						//theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(obj['JOB VALUE']) + "</td></tr>"
						var ACALinkData = obj['TEMPLATE ID'].split("/");
						var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
						var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
									
						//theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						//if ((theLoc=="City") && (dept=="PLANNING")) {
						//	theHtmlEnf += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						//}
						
						if ((theLoc=="City") && (dept=="PLANNING")) {
							theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						} else {
							theHtmlEnf += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						}
						
						
						
						
						theHtmlEnf += "</td></tr>"
						theHtmlEnf += "</table><br>" 
								
						//if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed") {
						if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed"&&theStatus!= "Expired"&&theStatus!= "Issued"&&theStatus!= "Revoked"&&theStatus!= "Void"&&theStatus!= "Withdrawn"&&theStatus!= "Cancelled"&&theStatus!= "Case Closed") {
							theCompActive=theCompActive +1
						}
					}
				}
			} 
			//alert(theHtmlEnf)
			theEnforcementHtml +=theHtmlEnf
			//alert(theCompNum)
			if (theCompNum==0) {
				theEnforcementHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
			}
			if (theCompActive==0) {
				document.getElementById('tabTitle'+'6').style.color= ""//"#828282"
				document.getElementById('tabTitle'+'6').style.fontWeight=""//"normal"
				document.getElementById('tabTitle'+'6').style.fontSize=""//"11px" 
			} else {
				document.getElementById('tabTitle'+'6').style.color="black" 
				document.getElementById('tabTitle'+'6').style.fontWeight="bold" 
				document.getElementById('tabTitle'+'6').style.fontSize="15px" 
			}
			for (var i = 0; i < idResults.length; i++) {
				var result = idResults[i];
				if (result.layerName == "Parcel Labels") {
					theBlock = result.feature.attributes["block_num"] 
					theLot = result.feature.attributes["lotmin"] 
				}
			}
			
			theEnforcementHtml +="<a name='BookmarkComplaintsDBI'/>"
			theEnforcementHtml = theEnforcementHtml + "<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>COMPLAINTS - DEPARTMENT OF BUILDING INSPECTIONS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			theEnforcementHtml += "<table class='reportData'><tr><td style='width:15px'></td><td><a target='_blank' href='http://dbiweb.sfgov.org/dbipts/default.aspx?page=address&block=" + theBlock + "&lot=" + theLot + "&stepin=1'>Go to DBI Complaint Tracking</a></td</tr></table></div>" 
	
			
			//clean out 'null's and 'undefined's
			theEnforcementHtml = theEnforcementHtml.replace(/Null/gi,"&nbsp");
			theEnforcementHtml = theEnforcementHtml.replace(/undefined/gi,"&nbsp");
			if (theLoc=="City") {
				theEnforcementHtml += "<br><br><table class='reportData' ><tr><td style='width:15px'></td><td>* Only visible to City staff. You need to log in to Accela Automation.  </td></tr></table>"
			}
			//add some room to the bottom of the report
			theEnforcementHtml += "<p class='NoPrint'><br></p>"
			theEnforcementHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkProjectsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
			theEnforcementHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
			//alert(theMiscPermitsHtml)
			document.getElementById('EnforcementReport').innerHTML = theEnforcementHtml
			if (theBM.indexOf("COMPLAINT")>-1) {
				//alert("here")
				showTab('dhtmlgoodies_tabView1',"6");
				thebookmark='#'+theBM
				jumpToBookmark(thebookmark)
				theBM=''
			}			
		},
	error: function(jqXHR, exception) {
			//alert("There's an Error")
			//alert(jqXHR.status)
			var theError="Error"
			if (jqXHR.status === 0) {
				theError = "Cannot connect to Accela database.  This is usually caused by the Accela CivicData servers being very busy. Other potential causes: network error; Accela services down; request too long (can happen with large condos). Try waiting a few seconds and running the search again.  Clearing your browser's cache (or clicking control-F5 on a Windows machine) may also correct this."
				
			} else if (jqXHR.status == 404) {
				theError = 'Requested page not found or no response from permitting server. [404]  This may be caused by an unusaully complex request (e.g. many permits being attached to hundreds of parcels).'
				
			} else if (jqXHR.status == 414) {
				theError = 'Request Too Large. [414]'
				
			}else if (jqXHR.status == 500) {
				theError='Internal Server Error [500].'
				
			} else if (exception === 'parsererror') {
				theError='Requested JSON parse failed.'
				
			} else if (exception === 'timeout') {
				theError='Time out error.'
				
			} else if (exception === 'abort') {
				theError='Ajax request aborted.'
				
			} else {
				theError='Uncaught Error.n' + jqXHR.responseText
                theError="Error connecting to Accela permitting database.  <br><br>This can happen if your browser has cached an expired connection parameter, if you are using a Windows machine try clicking control-F5, this will clear your browser's cache for this website.  Alternatively, clear your cache entirely then try again. <br>"
				
			}
			console.log(theError)
			//theCaseTrackingHtml +="<br><br>" + theError + "<br><br>"
			//theMiscPermitsHtml =theHtmlMisc + "<table  class='reportData' style='width:100%; border-bottom: none;'><tr><td style='width:15px'><td>" + theError + "<br><br>Error connecting to Accela Permitting data!  If this problem persists please contact the system administrator by clicking on the 'Your Feedback' link at the top of this page.</td></tr></table>"
			document.getElementById('EnforcementReport').innerHTML  = theEnforcementHtml +  "<table  class='reportData' style='width:100%; border-bottom: none;'><tr><td style='width:15px'><td>" + theError + "<br><br>If this problem persists please email <a href='mike.wynne@sfgov.org'>Mike Wynne</a> and provide details of the property that you searched for, the browser you used and the operating system of your machine.</td></tr></table>"
			//updateOtherPermitsHtml();	
		}
	})
	.fail(function(xhr, status, error) {
		console.log("Error1");
		console.log("Status1: " + status)
		console.log("Error1: " + error)
	})
	.always(function(jqXHR, exception) {
		console.log("complete");
		if (jqXHR.status === 0) {
			console.log("Cannot connect to Accela database.  This is usually caused by the Accela CivicData servers being very busy. Other potential causes: network error; Accela services down; request too long (can happen with large condos). Try waiting a few seconds and running the search again.  Clearing your browser's cache (or clicking control-F5 on a Windows machine) may also correct this.");
		} else if (jqXHR.status == 404) {
			console.log('Requested page not found. [404]');
		} else if (jqXHR.status == 500) {
			console.log('Internal Server Error [500].');
		} else if (exception === 'parsererror') {
			console.log('Requested JSON parse failed.');
		} else if (exception === 'timeout') {
			console.log('Time out error.');
		} else if (exception === 'abort') {
			console.log('Ajax request aborted.');
		} 
	});	
	
	
	
		
}


function updateAppealsHtml() {
//go through the results array and look for the Appeals records that were found at the location.  Add these to the Appeals report HTML.  
	theAppealsHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Planning Projects, Building Permits and Zoning Determinations appealed to the San Francisco <a target='_blank' alt='Board of Appeals' href='http://www.sfgov3.org/index.aspx?page=763'>Board of Appeals</a>.</td></tr></table>"
	theAppealsHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theAppealsHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBoardOfAppeals'>Appeals</a></td></tr></table>"
	theAppealsHtml +="<br></div>"
	var theAppealActive=0;
	theAppealsHtml +="<a name='BookmarkBoardOfAppeals'></a>"
	if (isLayerVisible("Appeals")) {
		theAppealsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>APPEALS: </span><input class='NoPrint' onclick='showHideMap( " + '"Appeals"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Appeals' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theAppealsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>APPEALS: </span><input class='NoPrint' onclick='showHideMap( " + '"Appeals"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Appeals' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Appeals") {
			theNum = theNum + 1
			if (result.feature.attributes["HISTNO"] =="" || result.feature.attributes["HISTNO"] =="Null"|| result.feature.attributes["HISTNO"]==" ") {
				theAppealAddress= result.feature.attributes["LOSTNO"]  + result.feature.attributes["LOSTSFX"] + " " + result.feature.attributes["STREETNAME"]  + " "+ result.feature.attributes["STTYPE"] 
			} else {
				theAppealAddress= result.feature.attributes["LOSTNO"] + result.feature.attributes["LOSTSFX"] + "-" + result.feature.attributes["HISTNO"] + result.feature.attributes["HISTSFX"] +" " + result.feature.attributes["STREETNAME"]  + " " + result.feature.attributes["STTYPE"] 
			}
			theAppealsHtml = theAppealsHtml + "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:200px'><b>Appeal No.: </b></td><td ><b>" + result.feature.attributes["APPEAL_NO"] + "</b> </td></tr><tr><td></td><td>Address: </td><td>" + theAppealAddress  + " </td></tr><tr><td></td><td>Nature of Appeal: </td><td>" + result.feature.attributes["NATURE_APPEAL"] + "</td></tr>"
			
			if (result.feature.attributes["APPL_NO"] !="" && result.feature.attributes["APPL_NO"]!="Null" && result.feature.attributes["APPL_NO"]!=" ") {
				theAppealsHtml= theAppealsHtml+"<tr><td></td><td>Permit Appealed:</td><td>" + result.feature.attributes["APPL_NO"]+"</td></tr>"
			}
			if (result.feature.attributes["CASENO"] !="" && result.feature.attributes["CASENO"]!="Null" && result.feature.attributes["CASENO"]!=" ") {
				theAppealsHtml= theAppealsHtml+"<tr><td></td><td>Case Appealed:</td><td>" + result.feature.attributes["CASENO"]+"</td></tr>"
			}
			theAppealsHtml= theAppealsHtml+"<tr><td></td><td>Hearing Result:</td><td>" + result.feature.attributes["HEARING_RESULTS"]+"</td></tr>"+ "<tr><td></td><td>Filed:</td><td>" + result.feature.attributes["FILEDATE"]+"</td></tr>" + "<tr><td></td><td>Referred to Planner:</td><td>" + result.feature.attributes["REFERRED_PLANNER"] + "<tr><td></td><td>Response Due:</td><td>" + result.feature.attributes["RESPONSE_DUE"] +"</td></tr>" + "<tr><td></td><td>Hearing Date:</td><td>" + result.feature.attributes["HEARING_DATE"] + "</td></tr>" 
			theAppealsHtml= theAppealsHtml +"</td></tr>" + "<tr><td></td><td>Findings Received Due:</td><td>" + result.feature.attributes["DECISION_RECEIVED"]+"</td></tr>" + "<tr><td></td><td>Rehearing Request:</td><td>" + result.feature.attributes["REHEARING_REQUEST"]+"</td></tr>" + "<tr><td></td><td>Planner:</td><td>" + result.feature.attributes["PLANNER"]+"</td></tr>" 
			theAppealsHtml= theAppealsHtml + "<tr><td></td><td>Closed:</td><td>" + result.feature.attributes["CLOSE_DATE"]+"</td></tr>"
			theAppealDoc = result.feature.attributes["DOC"]
			if (theAppealDoc!="" && theAppealDoc!="Null" && theAppealDoc!=" " && theAppealDoc.charAt(0)!="-") {
				theAppealDoc = theAppealDoc.replace("//Citypln-infovol/InfoDrive/DECISION DOCUMENTS/Board of Appeals Decisions","http://" + theServerName + "/Docs/Decision_Documents/Board_of_Appeals")
				theAppealsHtml= theAppealsHtml+"<tr><td></td><td>Decision Document:</td><td><a href='" + theAppealDoc + "' target='_blank'>View Appeal Decision Document</a></td></tr>"
			}
			theAppealsHtml= theAppealsHtml+"</table><br class='NoPrint'>"
			if (result.feature.attributes["CLOSE_DATE"] ==null || result.feature.attributes["CLOSE_DATE"] =="" || result.feature.attributes["CLOSE_DATE"] =="Null" || result.feature.attributes["CLOSE_DATE"]==" ") {
				theAppealActive= theAppealActive+1
			}
		}
	}
	if (theNum==0) {
		theAppealsHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
	}
	if (theAppealActive==0) {
		document.getElementById('tabTitle'+'7').style.color=""//"#828282"
		document.getElementById('tabTitle'+'7').style.fontWeight=""//"normal" 
		document.getElementById('tabTitle'+'7').style.fontSize=""//"11px" 
		document.getElementById('tabTitle'+'7').style.backgroundColor=""//""
		
	} else {
		document.getElementById('tabTitle'+'7').style.color="black" 
		document.getElementById('tabTitle'+'7').style.fontWeight="bold" 

		document.getElementById('tabTitle'+'7').style.fontSize="15px" 

	}

	
	//clean out 'null's and 'undefined's
	theAppealsHtml = theAppealsHtml.replace(/Null/gi,"&nbsp");
	theAppealsHtml = theAppealsHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theAppealsHtml += "<p class='NoPrint'><br></p>"
	theAppealsHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkAppealsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	theAppealsHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
			
	//publish the HTML to the page
	document.getElementById('AppealsReport').innerHTML = theAppealsHtml	
}

function updateAppealsHtmlACCELA() {
	//NOT USED, DELAYED IMPLEMENTATION DUE TO DBI GO-LIVE DELAY
//go through the results array and look for the Appeals records that were found at the location.  Add these to the Appeals report HTML.  
	var theFieldList = ' "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."APN" '
	//theFieldList +=', "3b63c2ea-1ea7-4232-be53-24751ff15dde"."parcel_nbr" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE OPENED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."ADDRESS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE CATEGORY" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD STATUS DATE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."STATUS" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."JOB VALUE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE CLOSED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DATE COMPLETED" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD NAME" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE" '
	//theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE TYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."DESCRIPTION" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD TYPE SUBTYPE" '
	theFieldList +=', "32fee353-3469-4307-bdcd-54ddbe9b5fae"."TEMPLATE ID" '
	//alert("1")
	if (!theParcelListForAccela) {
		theParcelListForAccela="'9'"
	}
	var queryString = 'SELECT   ' + theFieldList + ' from  "32fee353-3469-4307-bdcd-54ddbe9b5fae" LEFT JOIN "3b63c2ea-1ea7-4232-be53-24751ff15dde" ON "32fee353-3469-4307-bdcd-54ddbe9b5fae"."RECORD ID" = "3b63c2ea-1ea7-4232-be53-24751ff15dde"."record_id" where ("parcel_nbr" in(' + theParcelListForAccela +  ') / ) and "RECORD TYPE" = ' + "'Appeals (APL)'" + ' order by "record_id" desc'
	//prompt("",queryString)
	theAppealsHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Planning Projects, Building Permits and Zoning Determinations appealed to the San Francisco <a target='_blank' alt='Board of Appeals' href='http://www.sfgov3.org/index.aspx?page=763'>Board of Appeals</a>.</td></tr></table>"
	theAppealsHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theAppealsHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBoardOfAppeals'>Appeals</a></td></tr></table>"
	theAppealsHtml +="<br></div>"
	var theAppealActive=0;
	theAppealsHtml +="<a name='BookmarkBoardOfAppeals'></a>"
	//if (isLayerVisible("Appeals")) {
	//	theAppealsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>APPEALS: </span><input class='NoPrint' onclick='showHideMap( " + '"Appeals"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Appeals' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	//} else {
	theAppealsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>APPEALS: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	//}
	theAppNum = 0
	theAppActive=0
	var theHtmlAppeal='';
	//var data = {
	//	sql: queryString
	//};
	var data = JSON.stringify({"sql" : queryString});
	$.ajax({
		url: "http://www.civicdata.com/api/action/datastore_search_sql", 
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function(data) {
			recordTotal=data.result.records.length
			//alert("Total Planning records returned from Accela: " + recordTotal)
			var tmpRecordID = ""
			//var tmpRecordTypeDetailed = ""
			var tmpOpened = ""
			//var tmpName = ""
			//var tmpDescription = ""
			//var tmpAddress = ""
			//var tmpStatus = ""
			//var tmpClosed = ""
			//var tmpValue = ""
			
			if (data.result.records.length==0) {
				//theHtml = "No records found"
				//theCaseTrackingHtml+=theHtml
			} else {
				tmpPRJ=""
				var tempDate = new Date() 
				for (i=0; i<data.result.records.length;i++) {
					var obj = data.result.records[i]
					if (tmpRecordID!=obj['RECORD ID'] ||  tmpOpened != obj['DATE OPENED']) {
						tmpRecordID = obj['RECORD ID']
						//tmpRecordTypeDetailed = obj['RECORD TYPE']
						tmpOpened = obj['DATE OPENED']
						//tmpName = obj['RECORD NAME']
						//tmpDescription = obj['DESCRIPTION']
						//tmpAddress = obj['ADDRESS'] 
						//tmpStatus = obj['STATUS']
						//tmpClosed = obj['DATE CLOSED']
						//tmpValue = obj['JOB VALUE']
						theAppNum= i+1
						
						//alert(i)
						
						
						
						theHtmlAppeal +="<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'>"
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'><b>Record ID: </b> </td><td><b>" + obj['RECORD ID']+ "</b></td></tr>"
						var theRecType = obj['RECORD TYPE']
						//theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + obj['RECORD TYPE TYPE'] + " / " + obj['RECORD TYPE SUBTYPE'] +  "</td></tr>"
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Record Type:  </td><td>" + theRecType +  "</td></tr>"
						//theHtml += "<tr><td style='width:15px'></td><td style='width:150px'>Template ID:  </td><td>" + obj['TEMPLATE ID'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE OPENED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate(); 
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()							
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Opened:  </td><td>" + dateString+ "</td></tr>"
								
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Name:  </td><td>" + obj['RECORD NAME'] + "</td></tr>"
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Description:  </td><td>" + obj['DESCRIPTION'] + "</td></tr>"
								
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Primary Parcel:  </td><td>" + obj['APN'] + "</td></tr>"
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Address:  </td><td>" + obj['ADDRESS'] + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['RECORD STATUS DATE'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						var theStatus = obj['STATUS']
						if (!theStatus) {
							theStatus=''
						}
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Status:  </td><td>" + theStatus  + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE CLOSED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Closed:  </td><td>" + dateString + "</td></tr>"
						var tempDate = new Date() 
						tempDate=dateConvert(obj['DATE COMPLETED'])
						var curr_date=""
						var curr_month=""
						var curr_year=""
						var dateString=""
						if (tempDate) {
							curr_date = tempDate.getDate();   
							//Switch to Pacific Time from UTC
							var curr_date2 = new Date(tempDate.getTime() + (8*1000*60*60));
							curr_date = curr_date2.getDate()
							curr_month = tempDate.getMonth() + 1; //months are zero based
							curr_year = tempDate.getFullYear(); 
							dateString = curr_month+ "/" + curr_date + "/" + curr_year
						}
						//theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Job Value:  </td><td>" + formatCurrency(obj['JOB VALUE']) + "</td></tr>"
						var ACALinkData = obj['TEMPLATE ID'].split("/");
						var ACALink = "https://aca.accela.com/ccsf/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=" + ACALinkData[0]  + "&capID2="+ACALinkData[1] + "&capID3=" + ACALinkData[2] + "&agencyCode=CCSF"
						var AALink = "https://av.accela.com/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary&serviceProviderCode=CCSF&ID1="+ ACALinkData[0] + "&ID2="+ACALinkData[1] + "&ID3=" + ACALinkData[2] + "&requireNotice=YES&clearForm=clearForm&module=Planning&isGeneralCAP=N"
									
						//theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						//if ((theLoc=="City") && (dept=="PLANNING")) {
						//	theHtmlAppeal += "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						//}
						
						if ((theLoc=="City") && (dept=="PLANNING")) {
							theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View in ACA</a> &nbsp; " + "<a target='_blank' href='" + AALink +"'>View in AA*</a>"
						} else {
							theHtmlAppeal += "<tr><td style='width:15px'></td><td style='width:150px'>Further Information:</td><td><a target='_blank' href='" + ACALink +"'>View</a> &nbsp; "
						}
						
						
						
						theHtmlAppeal += "</td></tr>"
						theHtmlAppeal += "</table><br>" 
								
						//if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed") {
						if (theStatus!= "Approved"&&theStatus!= "Denied"&&theStatus!= "Closed"&&theStatus!= "Expired"&&theStatus!= "Issued"&&theStatus!= "Revoked"&&theStatus!= "Void"&&theStatus!= "Withdrawn"&&theStatus!= "Cancelled"&&theStatus!= "Case Closed") {
							theAppActive=theAppActive +1
						}
					}
				}
			} 
			//alert(theHtmlAppeal)
			theAppealsHtml +=theHtmlAppeal
			if (theAppNum==0) {
				theAppealsHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
			}
			if (theAppActive==0) {
				document.getElementById('tabTitle'+'7').style.color= ""//"#828282"
				document.getElementById('tabTitle'+'7').style.fontWeight=""//"normal"
				document.getElementById('tabTitle'+'7').style.fontSize=""//"11px" 
			} else {
				document.getElementById('tabTitle'+'7').style.color="black" 
				document.getElementById('tabTitle'+'7').style.fontWeight="bold" 
				document.getElementById('tabTitle'+'7').style.fontSize="15px" 
			}
			
			//clean out 'null's and 'undefined's
			theAppealsHtml = theAppealsHtml.replace(/Null/gi,"&nbsp");
			theAppealsHtml = theAppealsHtml.replace(/undefined/gi,"&nbsp");
			//if (theLoc=="City") {
			//	theMiscPermitsHtml += "<br><table class='reportData' ><tr><td style='width:15px'></td><td>* Fields marked with an asterisk are only visible to City staff. </td></tr></table>"
			//}
			//add some room to the bottom of the report
			theAppealsHtml += "<p class='NoPrint'><br></p>"
			theAppealsHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkProjectsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
			theAppealsHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
			//alert(theMiscPermitsHtml)
			document.getElementById('AppealsReport').innerHTML = theAppealsHtml	
		},
		error: function(xhr, status, error) {
			theHtmlAppeal=status + "<br><br>" + error + "<br><br>" + xhr.error
			theAppealsHtml +="<table  class='reportData' style='width:100%; border-bottom: solid;'><tr><td style='width:15px'><td> Error connecting to Accela Permitting data!  If this problem persists please contact the system administrator.</td></tr></table>"
			document.getElementById('AppealsReport').innerHTML = theAppealsHtml	
		}
	});	
}

function updateBBNsHtml() {
	theBBNsHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>A Block Book Notification (BBN) is a request made by a member of the public to be notified of permits on any property that is subject to the San Francisco Planning Code.</td></tr></table>"
	theBBNsHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theBBNsHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBBN'>Block Book Notifications</a></td></tr></table>"
	theBBNsHtml +="<br></div>"
	
	//go through the results array and look for the Appeals records that were found at the location.  Add these to the Appeals report HTML.  
	theBBNsHtml +="<a alt='Block Book Notifications' name='BookmarkBBN'></a>"
	if (isLayerVisible("Block Book Notifications")) {
		theBBNsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BLOCK BOOK NOTIFICATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Block Book Notifications"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Block Book Notifications' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theBBNsHtml += "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BLOCK BOOK NOTIFICATIONS: <span><input class='NoPrint' onclick='showHideMap( " + '"Block Book Notifications"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Block Book Notifications' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	theNum = 0
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Block Book Notifications") {
			theNum = theNum + 1
			if ((theLoc=="City")) {
				//theNum = theNum + 1
				var expirDate = new Date(result.feature.attributes["EXPIRATIONDATE"] )
				var todayDate = new Date()
				var BBNAddress=""
				if (result.feature.attributes["ADDRESS"] !="Null") {
					BBNAddress = result.feature.attributes["ADDRESS"]
				}
				if (result.feature.attributes["CITY"] !="Null" ) {
					if (result.feature.attributes["ADDRESS"] !="Null" !="") {
						BBNAddress +=  ", " 
					}
					BBNAddress	+= result.feature.attributes["CITY"]
				}
				if (result.feature.attributes["STATE"] !="Null") {
					if (result.feature.attributes["CITY"] !="Null" !="") {
						BBNAddress +=  ", " 
					}
					BBNAddress +=  result.feature.attributes["STATE"]
				}
				if (result.feature.attributes["ZIPCODE"] !="Null") {
					if (result.feature.attributes["STATE"] !="Null" !="") {
						BBNAddress +=  ", " 
					}
					BBNAddress +=  result.feature.attributes["ZIPCODE"]
				}
				var BBNEmail = result.feature.attributes["EMAIL"] 
				
				if (BBNEmail.indexOf('@')>0) {
					BBNEmail = "<a href='mailto:" + BBNEmail + "?subject=Planning Department Block Book Notification'>" + BBNEmail + "</a>"
				}
				theBBNsHtml += "<table  class='reportData' style='width:100%; border-bottom: solid; border-width: 1px; border-color: #C8C8C8'><tr><td style='width:15px'></td><td style='width:200px'><b>BBN No.:* </b></td><td ><b>" + result.feature.attributes["BBNNO"] + "</b> </td></tr><tr><td></td><td>Name:* </td><td>" + result.feature.attributes["FIRSTNAME"]  + " " + result.feature.attributes["LASTNAME"]+ " </td></tr><tr><td></td><td>Title:* </td><td>" + result.feature.attributes["TITLE"] + " </td></tr><tr><td></td><td>Organization:* </td><td>" + result.feature.attributes["ORGANIZATION"] + " </td></tr><tr><td></td><td>Address:* </td><td>" + BBNAddress + " </td></tr><tr><td></td><td>Phone 1:* </td><td>" + result.feature.attributes["PHONE1"]  + " </td></tr><tr><td></td><td>Phone 2:* </td><td>" + result.feature.attributes["PHONE2"] + " </td></tr><tr><td></td><td>Email:* </td><td>" + BBNEmail+ " </td></tr><tr><td></td><td>Site:* </td><td>" + result.feature.attributes["SITEADDRESS"] + " </td></tr><tr><td></td><td>Blocks:* </td><td>" + result.feature.attributes["TOTALBLOCKS"] + " </td></tr><tr><td></td><td>Notify of:* </td><td>" + result.feature.attributes["NOTIFYOF"] + " </td></tr><tr><td></td><td>Notes:* </td><td>" + result.feature.attributes["COMMENTS"] + " </td></tr><tr><td></td><td>Request Date:* </td><td>" + result.feature.attributes["REQUESTDATE"] + " </td></tr><tr><td></td><td>Pay Date:* </td><td>" + result.feature.attributes["DATEPAID"] + " </td></tr><tr><td></td><td>Fee:* </td><td>" + formatCurrency(result.feature.attributes["BBNFEEAMOUNT"]) +" </td></tr><tr><td></td><td>Amount Paid:* </td><td>" + formatCurrency(result.feature.attributes["AMOUNTPAID"])+ " </td></tr><tr><td></td><td>Entered:* </td><td>" + result.feature.attributes["DATEENTERED"] + " </td></tr><tr><td></td><td>Expires:* </td><td>" + result.feature.attributes["EXPIRATIONDATE"] + "</td></tr>"
				theBBNsHtml += "</table><br class='NoPrint'>"
			}
		}
	}
	//alert(theNum)
	if (theLoc!="City" && theNum==1) {
		theBBNsHtml+="<table  class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>There is an active Block Book Notification on this property.  For legal reasons we cannot display this information but you may contact the San Francisco Planning Department for more details: tel: 415-558-6377, email: <a href='mailto:pic@sfgov.org'>pic@sfgov.org</a></td</tr></table><br>"
	}
	if (theLoc!="City" && theNum>1) {
		theBBNsHtml+="<table  class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>There are " + theNum + " active Block Book Notifications on this property.  For legal reasons we cannot display this information but you may contact the San Francisco Planning Department for more details: tel: 415-558-6377, email: <a href='mailto:pic@sfgov.org'>pic@sfgov.org</a></td</tr></table><br>"
	}
	
	if (theNum==0) {
		theBBNsHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
		document.getElementById('tabTitle'+'8').style.color=""//"#828282"
		document.getElementById('tabTitle'+'8').style.fontWeight=""//"normal" 
		document.getElementById('tabTitle'+'8').style.fontSize=""//"11px" 
		document.getElementById('tabTitle'+'8').style.padding=""//"0px"
		
	} else {
		//if (theLoc=="City") {
			document.getElementById('tabTitle'+'8').style.color="black" 
			document.getElementById('tabTitle'+'8').style.fontWeight="bold" 
			document.getElementById('tabTitle'+'8').style.padding="0px"
			document.getElementById('tabTitle'+'8').style.fontSize="15px" 
		//}
	}
	
	
	if (theLoc=="City") {
		theBBNsHtml += "<div class='NoPrint'><br><table class='reportData' ><tr><td style='width:15px'></td><td>* Fields marked with an asterisk are only visible to City staff. </td></tr></table></div>"
	}
	//clean out 'null's and 'undefined's
	theBBNsHtml = theBBNsHtml.replace(/Null/gi,"&nbsp");
	theBBNsHtml = theBBNsHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theBBNsHtml += "<p class='NoPrint'><br></p>"
	theBBNsHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkBBNsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	theBBNsHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	
	//publish the HTML to the page
	document.getElementById('BBNsReport').innerHTML = theBBNsHtml		
}

function expand(id,id2,pixHeight) {
	document.getElementById(id2).innerHTML = "<table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='contract(\"" + id + "\",\"" +id2+"\",\"" + pixHeight +"\");'>less...</a></td></tr></table>"
	document.getElementById(id).style.height=""
}
function contract(id,id2,pixHeight) {
	document.getElementById(id2).innerHTML = "<table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"" + id + "\",\"" + id2+"\",\"" + pixHeight+"\");'>more...</a></td></tr></table>"
	document.getElementById(id).style.height=pixHeight
}

function jumpToBookmark(bookMark) {
	window.location.hash=bookMark
}
function runningUpdates() {
	//alert('return sent'); 
	$.ajax({ 
		type: "POST", 
		url: "../AGS_Status/AGS_DataUpdateStatus.php", 
		success: function(response){ 
			//alert(response);
			if (response=="True") {
				instructions = "<div border=0 style=' margin-left:" + (tabwidth/4) + "px; margin-top:" + (myheight/4) + "px'><table border=0><tr><td class='introTextWarning' ><b>This site is currently being updated.  Daily updates of the reports run from 5:00am to 5:15am. During this time searches are unlikely to succeed.</b></td></tr></table></div>"
				document.getElementById('AssessorReport').innerHTML = instructions
			}
		}
	}); 
} 
	
		var panorama;
		var addLatLng;
		var showPanoData;
		var panorama;
		var theLat1
		var theLong1

		function load_map_and_street_view_from_address(theLat,theLong) {	

//alert(theLat + " " + theLong)			
		   // Check if GPS has been locally cached.		   		   
		//	var geocoder = new google.maps.Geocoder();
		//	console.log("new geocoder");
		//	geocoder.geocode( { 'address': address}, function(results, status) {
		//	    if (status == google.maps.GeocoderStatus.OK) {
		//			var gps = results[0].geometry.location;	
					 //theLat=gup('lat');
					 //theLong=gup('long');
			//alert(theLat + " " + theLong)	
			theLat1=theLat
			theLong1=theLong

			create_map_and_streetview(theLat, theLong, 'map_canvas', 'pano');
		//	    }
		//	});
		}
		
		function  create_map_and_streetview(lat, lng, map_id, street_view_id) {

			panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"));
			addLatLng = new google.maps.LatLng(lat,lng);
			var service = new google.maps.StreetViewService();
			
			service.getPanoramaByLocation(addLatLng, 50, showPanoData);
			

  		}

  	function showPanoData(panoData, status) {

		//alert("In showPanoData")
	      if (status != google.maps.StreetViewStatus.OK) {
			//$('#pano').html('No StreetView Picture Available').attr('style', 'text-align:center;font-weight:bold').show();
		      //alert("No StreetView picture available for this location")
		      document.getElementById('streetview').href='javascript:alert("No StreetView picture available for this location")'
		      
	        return;
	      }
	      
	      var angle = computeAngle(addLatLng, panoData.location.latLng);
	      
	      
		//alert(theurl)
		
	    theurl="http://maps.google.com?layer=c&cbll="+theLat1+","+theLong1+"&cbp=12,"+angle+",10,0,0"
	    
	     
	    document.getElementById('streetview').href=theurl
	    //window.open(theurl);
	   
	      var panoOptions = {
		    position: addLatLng,
		    addressControl: true,
		    linksControl: true,
		    panControl: true,
		    zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL
		    },
		    pov: {
			heading: angle,
			pitch: 10,
			zoom: 1
		    },
		   
		    enableCloseButton: false,
		    visible:true
		};

		panorama.setOptions(panoOptions);
	}

function computeAngle(endLatLng, startLatLng) {

	      var DEGREE_PER_RADIAN = 57.2957795;
	      var RADIAN_PER_DEGREE = 0.017453;

	      var dlat = endLatLng.lat() - startLatLng.lat();
	      var dlng = endLatLng.lng() - startLatLng.lng();
	      // We multiply dlng with cos(endLat), since the two points are very closeby,
	      // so we assume their cos values are approximately equal.
	      var yaw = Math.atan2(dlng * Math.cos(endLatLng.lat() * RADIAN_PER_DEGREE), dlat)
		     * DEGREE_PER_RADIAN;
	      return wrapAngle(yaw);
   }

   function wrapAngle(angle) {
		if (angle >= 360) {
		    angle -= 360;
		} else if (angle < 0) {
		    angle += 360;
		}
		return angle;
    }
	
	
