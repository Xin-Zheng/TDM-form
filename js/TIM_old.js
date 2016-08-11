
/************************************************************************************************************

Title:		San Francisco Transportation Information Map
Author: 	Paul Sohn (paul.sohn@sfgov.org) using PIM platform built by Mike Wynne (mike.wynne@sfgov.org)
			City & County of San Francisco Planning Department
Created:	June 2015
Description:	(TO UPDATE) Searches for an address, parcel, block, place name, Planning Dept project or Dept of Building Inspections 
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

var beta_disclaimer = 	"<table class='NoPrint' width='100%'><br><tr><td style='width:10px'></td><td><i>" +
						"NOTE: TIM is currently in development." +
						" Certain functionalities may not work properly, and data may be out of date or incorrect." +
						" New functionalities, data, and metadata are being added." +
						" Contact Manoj Madhavan (manoj.madhavan@sfgov.org) if you have ideas for information to add to TIM, spot an error, or have suggestions." + 
						"</i></td></table>"

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
	var theSafetyHtml = "";
	var theAssessorHtml = "";
	var theStreetSegmentHtml = "";
	var theProjectsHtml = "";
	var theTransitHtml = "";
	var theMetaHtml = "";
	var thePedBikeHtml = "";
	var theParkingHtml = "";
	var theVehicleHtml = "";
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
	var theArcGISServerName = "http://"+theServerName+"/arcgis/rest/services/TIM_LIVE/MapServer";
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
	
	var theSSnum = 0;
	var theSSGeoms = new Array;
	var theSSresult = new Array;
	var buffered;

    function initialize() {
	//Runs when page initially loads (from the html <body> onLoad event)
	//Also creates the find, query and identify tasks within ArcGIS Server.
	    
	
	//set up UI
	document.getElementById('searchExamples').innerHTML ='<table style="padding: 3px;" class="searchExamples" border=0><tr><td><span><i>Search Examples: </i>&nbsp &nbsp<span></td><td> <span>400 Van Ness Ave</span></td><td><span> 0787/001</span></td></tr><tr><td></td><td> <span>Mission and Van Ness &nbsp; &nbsp;</span></td><td><span>2011.0218</span></td></tr><tr><td></td><td><span >Ferry Building</span></td><td></td></tr></table>'
	document.getElementById('step2a').innerHTML='Review Transportation Information'
	document.getElementById('mapTag').innerHTML='Beta Version'
	document.getElementById('searchPaneText').innerHTML=''
		
		    
	//set up the window to work best with the browser shape and size
	window_resize();
	init=false;
	
	//create the HTML that will be used to populate the reports inside the tabs.  Initially just display a message saying this is where the reports will appear.
	instructions = "<div border=0 style=' margin-left:" + (tabwidth/4) + "px; margin-top:" + (myheight/4) + "px'><table border=0><tr><td class='introText' >This area will remain empty until you search or click on the map.</td></tr></table></div>"
	document.getElementById('tab1').innerHTML = instructions
	document.getElementById('tab2').innerHTML = instructions
	document.getElementById('tab3').innerHTML = instructions
	document.getElementById('tab4').innerHTML = instructions
	document.getElementById('tab5').innerHTML = instructions
	document.getElementById('tab6').innerHTML = instructions
	document.getElementById('tab7').innerHTML = instructions 
	// document.getElementById('tab8').innerHTML = instructions 
	// document.getElementById('tab9').innerHTML = instructions 
	
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
	if (gup("search") != "")  {
		theSearchString = gup("search")
		document.getElementById("addressInput").value = theSearchString
		whenMapReadyRunSearch(theSearchString);
	}
	setTimeout(areTabsReady,50);
	setTimeout(googleStreetView,1200)
	
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
			mapHeight = myheight -98 
			tabHeight = myheight - 10
			
			//alert("large IE")
			
		} else {
			theoff = 185
			myheight = (viewportheight - 227)
			tabHeight=myheight
			//alert("non IE large")
			document.getElementById("map_canvas").style.height = myheight -97  + "px"
			mapHeight = myheight -97
		}
		tabwidth=viewportwidth - 494;
		if (viewportwidth < 1100 ) {
			//alert("small")
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
			startScale=11;
			tabwidth=viewportwidth - 430;
	
			if (navigator.userAgent.indexOf('MSIE')>0) { 
				document.getElementById("map_canvas").style.height = myheight -88  + "px"
				tabHeight = myheight - 16
			} else {
				theoff = 145
				document.getElementById("map_canvas").style.height = myheight - 78  + "px"
				mapHeight = myheight -78
			}
		} else {
			if (viewportwidth <1155) {
				//alert("medium")
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
			} else {
				document.getElementById("map_canvas").style.width= "496px"
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
	//deal with iphone, ipod and ipad
	if ( isMob) { 
		myheight = (viewportheight - 205)
		document.getElementById("addressInput").style.width="200px";
		
		document.getElementById("addressInput").style.height="24px"
		document.getElementById("addressInput").style.fontSize="17px";
			
		document.getElementById("map_canvas").style.width="387px"
		document.getElementById("mapTitle").style.fontSize="25px";
			
		document.getElementById("map_canvas").style.height = (viewportheight - 360) + "px"
		mapHeight = (viewportheight - 360)
		tabHeight= (viewportheight - 270) 
		
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
		
		tabNo=6
		/* initTabs('dhtmlgoodies_tabView1',Array('Property & Planning','Safety','Transit','Ped & Bike','Vehicles & Parking','Street Segments','Projects'),0,'100%',tabHeight,Array(false,true,true,true)); */
        initTabs('dhtmlgoodies_tabView1',Array('Property & Planning','Safety','Transit','Ped & Bike','Vehicles & Parking','Street Segments'),0,'100%',tabHeight,Array(false,true,true,true));
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
	theSafetyHtml = theSafetyHtml.replace(/class='noprint'/gi,"style='display:none'");
	theSafetyHtml = "<html>\n" + "  <head>\n" +  "    <link href='Print.css' type='text/css' rel='stylesheet' media='all' />" + "\n  </head>\n" + "<body>\n" + theSafetyHtml + "\n  </body\n</html>"
	OpenWindow=window.open("", "tab2", "height=600, width=800, toolbar=yes, scrollbars=yes, menubar=yes, resizable=yes , status=yes");
	OpenWindow.document.write(theSafetyHtml)
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
		var IDsymbol = new esri.symbol.PictureMarkerSymbol('http://' + theServerName + '/TIM/images/blue.png', 32, 32).setOffset(0,16);
		var graphic = new esri.Graphic(theGeom, IDsymbol);
		theSearchGraphic = graphic
		map.graphics.add(graphic);
		document.getElementById('ImBusy').style.visibility = 'hidden'; 
		document.getElementById('tab2').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('tab1').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('tab3').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('tab4').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('tab5').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('tab6').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('tab7').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
		document.getElementById('tab5').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big></td> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></tr></table>"
		// document.getElementById('tab8').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
		// document.getElementById('tab9').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	}
	
	// for street segment loop in identify function
	buffered = 0
	
	
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
			document.getElementById('tab2').innerHTML =  instructions 
			document.getElementById('tab1').innerHTML = instructions 
			document.getElementById('tab3').innerHTML = instructions 
			document.getElementById('tab4').innerHTML = instructions 
			document.getElementById('tab5').innerHTML = instructions 
			document.getElementById('tab6').innerHTML = instructions 
			document.getElementById('tab7').innerHTML = instructions 
			document.getElementById('tab5').innerHTML = instructions 
			// document.getElementById('tab8').innerHTML = instructions 
			// document.getElementById('tab9').innerHTML = instructions 
			
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

	
	// We now have the geography of the search result (lat/long or boundary of property, project, etc). We will now 
	// prepare to send this to the identify task.
	
	//Clear the variables that will hold the HTML used to populate each of the report tabs
	theSafetyHtml = null;
	theAssessorHtml = null;
	theStreetSegmentHtml = null;
	theProjectsHtml = null;
	theTransitHtml = null;
	theMetaHtml = null;
	thePedBikeHtml = null;
	theTransitHtml = null;

	identifyParameters.geometry = latLng //esri.geometry.webMercatorToGeographic(latLng);
	identifyParameters.returnGeometry = true;
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

	//set up the function which will run when the Identify Task returns its results, this function will process the results (this is key to filling the report tabs)

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
			
			
			// Before sending to tabs, send to bufferCurrentOverlays() if selected location is street segment and has not been buffered (i.e. came through click)
			//alert(lastSearchClick + "\n" + buffered)
			if (lastSearchClick && buffered == 0) {
				
				theSSGeoms= []
				theSSresult = [] 
				//var numROW=0
				for (var i = 0; i < idResults.length; i++) {
					var result = idResults[i];
					//console.log(result.layerName )
					
					if (result.layerName == "ROWPolygons") { 
						theSSresult = result
						theSSGeoms.push(idResults[i])		
						//numROW= numROW+1
						//console.log("Found it")
						break; 
					}
				}
				
				//buffered += 1
				if (theSSGeoms.length>0) {
					findCompleteCallbackSS(theSSGeoms)
					return;
				}
					
			}
 
			
			//start to populate the variables with the HTML that will later be used to populate the report tabs
			//the iPadText is instructions for iPhone, iPod and iPad users to help them scroll through the reports.   Other users will not see this text.
				
			theAssessorHtml = printLink + "<a name='BookmarkPropertyTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Property & Planning Report:  </span><span style='color: #000000;'>" + theSearchString + "</span></div><br>"
			theSafetyHtml = printLink + "<a name='BookmarkSafetyTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Safety Report:  </span><span style='color: #000000;'>" +  theSearchString + "</span></div>"
			// theMetaHtml = printLink + "<a name='BookmarkMetaTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Metainfo Report: </span><span style='color: #000000;'>"  +  theSearchString + "</span></div><br>"
			theProjectsHtml = printLink + "<a name='BookmarkProjectsTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Projects Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div>"
			thePedBikeHtml = printLink + "<a name='BookmarkPedBikeTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Pedestrian and Bicycle Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
			theTransitHtml = printLink + "<a name='BookmarkTransitTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Transit Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
			// theParkingHtml = printLink + "<a name='BookmarkParkingTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Parking and Loading Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
			theVehicleHtml = printLink + "<a name='BookmarkVehicleTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Vehicles and Parking Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
			theStreetSegmentHtml = printLink + "<a name='BookmarkStreetSegmentTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Street Segment Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
			theProjectsHtml = printLink + "<a name='BookmarkProjectsTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Projects Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
			// theMetaHtml = printLink + "<a name='BookmarkMetaTop'></a><div class='searchPaneSectionHeader'> " + iPadText +"</div><div class='reportHeader'><span style='color: #0099ff;'>Metainfo Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div><br>"
					
				
			//
			//This is key to populating the report tabs.
			//Run a function for each of the tabs.  Each function fills a variable with the HTML that will later be applied to it's tab.
			//
			
			updatePropertyHtml();
			updateSafetyHtml();
			updateTransitHtml();
			//updateMetaHtml();
			updatePedBikeHtml();
			//updateParkingHtml();
			updateVehicleHtml();
			updateStreetSegmentHtml();
			updateProjectsHtml();
	
		//},taskError);
		});
	
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
		if (document.getElementById('tab1').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab1').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('tab2').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab2').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('tab3').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab3').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('tab4').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab4').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('tab5').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab5').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('tab6').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab6').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		if (document.getElementById('tab7').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab7').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		}
		// if (document.getElementById('tab8').innerHTML.indexOf("Please wait, generating report")>=0) {
			// document.getElementById('tab8').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		// }
		// if (document.getElementById('tab9').innerHTML.indexOf("Please wait, generating report")>=0) {
			// document.getElementById('tab9').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'><big><big><br><br>Either the server is slow or this is an unusually complex report, please wait a little longer.</big></big></td></tr></table>"
		// }
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
		
	if ((findResults.length==0) || (theRes == 'undefined') || (theRes == null)) {
	
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
					document.getElementById('tab2').innerHTML =  instructions 
					document.getElementById('tab1').innerHTML = instructions 
					document.getElementById('tab3').innerHTML = instructions 
					document.getElementById('tab4').innerHTML = instructions 
					document.getElementById('tab5').innerHTML = instructions 
					document.getElementById('tab6').innerHTML = instructions 
					document.getElementById('tab7').innerHTML = instructions 
					document.getElementById('tab5').innerHTML = instructions 
					// document.getElementById('tab8').innerHTML = instructions 
					// document.getElementById('tab9').innerHTML = instructions 
					
					
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
		
		/*
 		if (buffered==1) {
			imbuffering=false; 
			map.graphics.clear();
			var graphic =theRes.feature
			graphic.setSymbol(polygonSymbol);
			theSearchGraphic = graphic
			var infoTemplate = new esri.InfoTemplate();	
			infoTemplate.setTitle("${CNN}"); 
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
			map.infoWindow.resize(235,230)
		}; */
		
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
		
		

	imidentifying = true;
	
	//Buffer the find result by 0.95ft.  Without doing this the Identify Task will return results for any neighboring feature that shares a boundary with the result 
	//  (e.g. if searched for a parcel will return info for all neighboring parcels).
	//Theoretically could have buffered by a smaller amount but 0.95ft also deals with most digitizing errors (where boundaries should have been snapped together but were not. Anything
	//  larger than 0.95ft risks elimiating the smaller legislative setbacks
	
	bufferCurrentOverlays(theBuffGeoms,-0.95);
	
	

	document.getElementById('ImBusy').style.visibility = 'hidden'; 

	}

	// googleStreetView();
    }
	
	
    function findCompleteCallbackSS(findResults) {
	
	buffered += 1
	
	//Function is run when the server returns results from the Find Task.  This should have returned the geography of whatever the user searched for (parcel, case, block, address, etc) 
	//Clear the map and reports, zooms the map to the Find Result then buffer by -0.95 ft.  The buffer task will then kick off the identify task
	thefindResults = findResults
	
	
	//alert(theBuffGeoms.length)
	theRes = findResults[0]
	theBuffGeoms= [] //null; //new Array();
	for (i=0; i< findResults.length; i++) {
		theBuffGeoms.push(findResults [i])
	}
		
		//Get the bounds of the geometry of the find result.  We will then zoom the map to those bounds.  Get the first geometry object then loop through others if its a multipart polygon.
		theGeometries=theRes.feature.geometry
		theGeometry = theRes.feature.geometry; 
		var polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]), 2), new dojo.Color([100,100,255,0.5]));        

		//Set up a very basic info window that will open if they click on the result on the map
				
 		if (buffered==1) {
			imbuffering=false; 
			map.graphics.clear();
			var graphic =theRes.feature
			graphic.setSymbol(polygonSymbol);
			theSearchGraphic = graphic
			var infoTemplate = new esri.InfoTemplate();	
			infoTemplate.setTitle("${CNN}"); 
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
			map.infoWindow.resize(235,230)
		};

	imidentifying = true;
	
	//Buffer the find result by 0.95ft.  Without doing this the Identify Task will return results for any neighboring feature that shares a boundary with the result 
	//  (e.g. if searched for a parcel will return info for all neighboring parcels).
	//Theoretically could have buffered by a smaller amount but 0.95ft also deals with most digitizing errors (where boundaries should have been snapped together but were not. Anything
	//  larger than 0.95ft risks elimiating the smaller legislative setbacks
	
	bufferCurrentOverlays(theBuffGeoms,-0.95);

	document.getElementById('ImBusy').style.visibility = 'hidden'; 

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

	//alert(LayerVis)
	    
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
   	document.getElementById('tab2').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('tab1').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('tab3').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('tab4').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('tab5').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('tab6').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('tab7').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	document.getElementById('tab5').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	// document.getElementById('tab8').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	// document.getElementById('tab9').innerHTML = "<table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table>"
	
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
				//theProjectsHtml+=theHtml
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
			//theMetaHtml=status + "<br><br>" + error + "<br><br>" + xhr.error
			//theMetaHtml +="<table  class='reportData' style='width:100%; border-bottom: solid;'><tr><td style='width:15px'><td> Error connecting to Accela Permitting data!  If this problem persists please contact the system administrator.</td></tr></table>"
			//document.getElementById('tab6').innerHTML = theMetaHtml	
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
				
	//theMetaHtml = printLink + "<div class='searchPaneSectionHeader'> </div><div class='reportHeader'><span style='color: #0099ff;'>Miscellaneous Permits Report: </span><span style='color: #000000;'>"  +  theSearchString + "</span></div><br>"
	theProjectsHtml = printLink + "<div class='searchPaneSectionHeader'> </div><div class='reportHeader'><span style='color: #0099ff;'>Planning Records Report: </span><span style='color: #000000;'>"  + theSearchString + "</span></div>"
				
	var theHtmlCase='';
	var theHtmlCase1='';
	
	//theProjectsHtml +="<br><table class='reportData' width=100%><tr><td style='width:10px'></td><td>Permits are required in San Francisco to operate a businesses or to perform construction activity. The Planning Department reviews most applications for these permits in order to ensure that the projects comply with the <a alt='PlanningCode' href='http://planningcode.sfplanning.org' target='_blank'>Planning Code</a>. The 'Project' is the activity being proposed.</td></tr></table>"
	
	theProjectsHtml += "<table class='NoPrint'><tr><td style='padding-left:15px'><a target='_blank' href='MapHelp.html#ProjectsGlossary'>Glossary </a></td></tr></table><br>"
	theProjectsHtml +="<br><br><div class='NoPrint'><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theProjectsHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkProjects'>Planning Records</a></td></tr></table>"
	theProjectsHtml +="<br></div>"
	theProjectsHtml +="<a name='BookmarkProjects'/>"
	theProjectsHtml +="<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PLANNING RECORD: </SPAN></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	
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
					document.getElementById('tab1').innerHTML = instructions
					document.getElementById('tab2').innerHTML = instructions
					document.getElementById('tab3').innerHTML = instructions
					document.getElementById('tab4').innerHTML = instructions
					document.getElementById('tab5').innerHTML = instructions
					document.getElementById('tab6').innerHTML = instructions
					document.getElementById('tab7').innerHTML = instructions 
					// document.getElementById('tab8').innerHTML = instructions 
					// document.getElementById('tab9').innerHTML = instructions 	
				}});
				//theHtml = "No records found"
				//theProjectsHtml+=theHtml
			} else {
				theProjectsHtml+="<p><table width='100%'><tr><td style='padding-left: 10px;font-family:Verdana, Arial, Helvetica, sans-serif;font-weight: bold;font-size: 13px;' >Planning Record " +theSearchString + " is not associated with any valid parcels so cannot be mapped or linked to other parcel or property information.  All other sections (Property, Preservation, Zoning, etc. will remain empty).</td><td align='right'>&nbsp &nbsp</td></tr></table><br>"
				if (dept=="PLANNING" && theLoc=="City") {
					theProjectsHtml+="<table width='100%' class='NoPrint'><tr><td style='padding-left: 10px;font-family:Verdana, Arial, Helvetica, sans-serif;font-weight: bold;font-size: 13px;' >Planning Records can be associated with parcels through Accela Automation.  If you need help with this please contact OASIS.</td><td align='right'>&nbsp &nbsp</td></tr></table><br><br>"
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
			theProjectsHtml +=theHtmlCase
			if (theCaseNum==0) {
				theProjectsHtml += "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
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
			theProjectsHtml = theProjectsHtml.replace(/Null/gi,"&nbsp");
			theProjectsHtml = theProjectsHtml.replace(/undefined/gi,"&nbsp");
			
			//add some room to the bottom of the report
			theProjectsHtml += "<p class='NoPrint'><br></p>"
			theProjectsHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkProjectsTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
			theProjectsHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
			//alert(theMetaHtml)
			document.getElementById('tab4').innerHTML = theProjectsHtml
			document.getElementById('tab1').innerHTML = instructions
			document.getElementById('tab2').innerHTML = instructions
			document.getElementById('tab3').innerHTML = instructions
			//document.getElementById('tab4').innerHTML = instructions
			document.getElementById('tab5').innerHTML = instructions
			document.getElementById('tab6').innerHTML = instructions
			document.getElementById('tab7').innerHTML = instructions 
			// document.getElementById('tab8').innerHTML = instructions 
			// document.getElementById('tab9').innerHTML = instructions 
			showTab('dhtmlgoodies_tabView1',3);
			document.getElementById('ImBusy').style.visibility = 'hidden'; 
			
			
			//var theTitle="Found Orphaned Record(s)"
			//new Messi(theHtmlCase, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}]});
			
			
		},
		error: function(xhr, status, error) {
			theMetaHtml=status + "<br><br>" + error + "<br><br>" + xhr.error
			theProjectsHtml +="<table  class='reportData' style='width:100%; border-bottom: solid;'><tr><td style='width:15px'><td> Error connecting to Accela Permitting data!  If this problem persists please contact the system administrator.</td></tr></table>"
			document.getElementById('tab4').innerHTML = theProjectsHtml	
			document.getElementById('tab4').innerHTML = theProjectsHtml
			document.getElementById('tab1').innerHTML = instructions
			document.getElementById('tab2').innerHTML = instructions
			document.getElementById('tab3').innerHTML = instructions
			//document.getElementById('tab4').innerHTML = instructions
			document.getElementById('tab5').innerHTML = instructions
			document.getElementById('tab6').innerHTML = instructions
			document.getElementById('tab7').innerHTML = instructions 
			// document.getElementById('tab8').innerHTML = instructions 
			// document.getElementById('tab9').innerHTML = instructions 
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
			document.getElementById('tab1').innerHTML = instructions
			document.getElementById('tab2').innerHTML = instructions
			document.getElementById('tab3').innerHTML = instructions
			document.getElementById('tab4').innerHTML = instructions
			document.getElementById('tab5').innerHTML = instructions
			document.getElementById('tab6').innerHTML = instructions
			document.getElementById('tab7').innerHTML = instructions 
			// document.getElementById('tab8').innerHTML = instructions 
			// document.getElementById('tab9').innerHTML = instructions 	
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
			document.getElementById('tab1').innerHTML = instructions
			document.getElementById('tab2').innerHTML = instructions
			document.getElementById('tab3').innerHTML = instructions
			document.getElementById('tab4').innerHTML = instructions
			document.getElementById('tab5').innerHTML = instructions
			document.getElementById('tab6').innerHTML = instructions
			document.getElementById('tab7').innerHTML = instructions 
			// document.getElementById('tab8').innerHTML = instructions 
			// document.getElementById('tab9').innerHTML = instructions 	
		}});
		
	} else {
		var theTitle="Select a Parcel"
		var theMessage = "<div style='text-align:left;'>This does not appear to be a valid parcel number, please select from this list of similar sounding parcels:</div>" + theParcelList
		new Messi(theMessage, {title: theTitle, modal: true, titleClass: 'info', buttons: [{id: 0, label: 'Cancel'}], callback: function(){
			document.getElementById('tab1').innerHTML = instructions
			document.getElementById('tab2').innerHTML = instructions
			document.getElementById('tab3').innerHTML = instructions
			document.getElementById('tab4').innerHTML = instructions
			document.getElementById('tab5').innerHTML = instructions
			document.getElementById('tab6').innerHTML = instructions
			document.getElementById('tab7').innerHTML = instructions 
			// document.getElementById('tab8').innerHTML = instructions 
			// document.getElementById('tab9').innerHTML = instructions 	
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
			document.getElementById('tab1').innerHTML = instructions
			document.getElementById('tab2').innerHTML = instructions
			document.getElementById('tab3').innerHTML = instructions
			document.getElementById('tab4').innerHTML = instructions
			document.getElementById('tab5').innerHTML = instructions
			document.getElementById('tab6').innerHTML = instructions
			document.getElementById('tab7').innerHTML = instructions 
			// document.getElementById('tab8').innerHTML = instructions 
			// document.getElementById('tab9').innerHTML = instructions 	
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
	document.getElementById('tab1').innerHTML = instructions
	document.getElementById('tab2').innerHTML = instructions
	document.getElementById('tab3').innerHTML = instructions
	document.getElementById('tab4').innerHTML = instructions
	document.getElementById('tab5').innerHTML = instructions
	document.getElementById('tab6').innerHTML = instructions
	document.getElementById('tab7').innerHTML = instructions 
	// document.getElementById('tab8').innerHTML = instructions 
	// document.getElementById('tab9').innerHTML = instructions 
	
}
function showGeocodeResults(candidates) {   
	//alert("Candidates: " + candidates.length)
	var candidate;
	var bestCandidate;
	var reserveCandidate;
	map.graphics.clear();
	var IDsymbol = new esri.symbol.PictureMarkerSymbol('http://' + theServerName + '/TIM/images/blue.png', 32, 32).setOffset(0,16);
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
		document.getElementById('tab1').innerHTML = instructions
		document.getElementById('tab2').innerHTML = instructions
		document.getElementById('tab3').innerHTML = instructions
		document.getElementById('tab4').innerHTML = instructions
		document.getElementById('tab5').innerHTML = instructions
		document.getElementById('tab6').innerHTML = instructions
		document.getElementById('tab7').innerHTML = instructions 
		// document.getElementById('tab8').innerHTML = instructions 
		// document.getElementById('tab9').innerHTML = instructions 
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
	
	var pRepHTML= "<!DOCTYPE html>"
	pRepHTML +="\n<html lang='en-US'>"
	pRepHTML +="\n<head>"
	pRepHTML +="\n<meta charset='UTF-8' />"
	pRepHTML +='<meta content="IE=edge" http-equiv="X-UA-Compatible">'
	pRepHTML +="\n<LINK REL='SHORTCUT ICON' HREF='http://" + theServerName + "/TIM/images/bannericonTransSmall.ico'>"
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
	
	
	pRepHTML +="\n<div style='display:inline-block; vertical-align:top;'>"
	pRepHTML += "<table class='reportData' ><tr><td class='cellHead'>Year Built: </td><td>" + theYearBuilt+"</td></tr></table>"
	pRepHTML +="\n</div>"
	
	
	var theA10Dist=""
	pRepHTML +="\n<br><br><div class='reportTitle3' style='text-align:center'>TENTATIVE CEQA CATEGORY: <span id='deptstat'>" + document.getElementById('histreslink').innerHTML +  "</span></div><br>"
	
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
	pRepHTML +="\n<LINK REL='SHORTCUT ICON' HREF='http://" + theServerName + "/TIM/images/bannericonTransSmall.ico'>"
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
			theWaitHTML = "<html><body><table  border=0 align=middle width='100%'><tr><td align=middle width='100%'><big><big><br><br><b>Please wait, generating printable report </b></big></big> <img src='http://" + theServerName + "/TIM/images/loader_Dots.gif'></td></tr></table></body></html>"
			OpenWindow.document.write(theWaitHTML)	
			OpenWindow.document.close()
		}
	}
	var thehtmltemp = printTask.execute(printparams,printResultCallback,printResultError);
	//alert(thehtmltemp)

}

function printResultCallback(result) {
	theMapPNG = result.url
	//window.open(result.url);
	var printHTML = "<!DOCTYPE html>"
	printHTML +="\n<html lang='en-US'>"
	printHTML +="\n<head>"
	printHTML +="\n<meta charset='UTF-8' />"
	printHTML +='<meta http-equiv="X-UA-Compatible" content="IE=7">'
	printHTML +="\n<LINK REL='SHORTCUT ICON' HREF='http://" + theServerName + "/TIM/images/bannericonTransSmall.ico'>"
	printHTML +="\n<title>San Francisco Transportation Information Map - Print Version</title>"
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
	printHTML +="\n<tr><td>Property & Planning Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'property' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	printHTML +="\n<tr><td>Safety Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'safety' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	printHTML +="\n<tr><td>Transit Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'transit' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	printHTML +="\n<tr><td>Pedestrian & Bicycle Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'pedbike' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	// printHTML +="\n<tr><td>Parking & Loading Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'parking' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	printHTML +="\n<tr><td>Vehicles and Parking Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'vehicle' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	printHTML +="\n<tr><td>Street Segment Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'streetsegment' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	printHTML +="\n<tr><td>Projects Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'projects' + '"' + ")' type='checkbox' checked=true/></td></tr>"
	// printHTML +="\n<tr><td>Metadata Report</td><td> <input onclick='javascript:checkPrintReport(" + '"' +'meta' + '"' + ")' type='checkbox' checked=true/></td></tr>"	
	printHTML +="\n</table></span>"
	printHTML +="\n<button class='NoPrint' onclick='javascript:displayPrintReport()' type='button'>Create Printable Report</button><br><br><br></td></tr>"
	printHTML +="\n"
	printHTML +="\n<tr><td colspan=2 ><span class='NoPrint'><table border=0><tr><td align='middle'> ------------------------ Preview Is Shown Below ------------------------ </td></tr></table><br><br><br><br></span></td></tr></table>"
	//printHTML +="\n<div class='NoPrint' id='printButton' style='display:none'> <form> <input type='button' value='Print Report' onClick='window.print()'/></form></div>"
	
	
	printHTML +="\n<img src='/TIM/images/LetterHead.png'>"
	

	
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
	
		var theAssessorHtmltoPrint = theAssessorHtml.replace(/class='noprint'/gi,"style='display:none'");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		//remove the height limitations for the more.../less... divs
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:110px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:1365px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:660px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:240px/gi,"height:''");
		theAssessorHtmltoPrint = theAssessorHtmltoPrint.replace(/height:275px/gi,"height:''");
		
		var theSafetyHtmltoPrint = theSafetyHtml.replace(/class='noprint'/gi,"style='display:none'");
		theSafetyHtmltoPrint = theSafetyHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theTransitHtmltoPrint = theTransitHtml.replace(/class='noprint'/gi,"style='display:none'");
		theTransitHtmltoPrint = theTransitHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var thePedBikeHtmltoPrint = thePedBikeHtml.replace(/class='noprint'/gi,"style='display:none'");
		thePedBikeHtmltoPrint = thePedBikeHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");

		// var theParkingHtmltoPrint = theParkingHtml.replace(/class='noprint'/gi,"style='display:none'");
		// theParkingHtmltoPrint = theParkingHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theVehicleHtmltoPrint = theVehicleHtml.replace(/class='noprint'/gi,"style='display:none'");
		theVehicleHtmltoPrint = theVehicleHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theStreetSegmentHtmltoPrint = theStreetSegmentHtml.replace(/class='noprint'/gi,"style='display:none'");
		theStreetSegmentHtmltoPrint = theStreetSegmentHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		var theProjectsHtmltoPrint = theProjectsHtml.replace(/class='noprint'/gi,"style='display:none'");
		theProjectsHtmltoPrint = theProjectsHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		// var theMetaHtmltoPrint = theMetaHtml.replace(/class='noprint'/gi,"style='display:none'");
		// theMetaHtmltoPrint = theMetaHtmltoPrint.replace(/Step 2. Click the tabs above to view the reports./gi,"");
		
		
		//ALL
		printHTML += "<div id='property'><P>" + theAssessorHtmltoPrint 
				+ "</p></div><div id='safety'><P>" + theSafetyHtmltoPrint 
				+ "</p></div><div id='transit'><P>" + theTransitHtmltoPrint
				+ "</p></div><div id='pedbike'><P>" + thePedBikeHtmltoPrint 
				// + "</p></div><div id='parking'><P>" + theParkingHtmltoPrint
				+ "</p></div><div id='vehicle'>" + theVehicleHtmltoPrint	
				+ "</p></div><div id='streetsegment'><P>" + theStreetSegmentHtmltoPrint 				
				+ "</p></div><div id='projects'><P>"+ theProjectsHtmltoPrint 
				// + "</p></div><div id='meta'><P>"+ theMetaHtmltoPrint
				+ "</p></div>";
		
		
	printHTML = printHTML.replace(/\*/g, ''); 
	printHTML = printHTML.replace(/Fields marked with an asterisk are only visible to City staff./g,''); 
	printHTML = printHTML.replace(/<br><br>/gi, '<br>'); 
	printHTML = printHTML.replace(/<br><br>/gi, '<br>'); 
	printHTML = printHTML.replace(/<br><br>/gi, '<br>'); 
	
	//if (theLoc=="City") {
	//	printHTML += "<div id='bbn'>" +theVehicleHtmltoPrint + "</div>"
	//}
	
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth() + 1; //Months are zero based
	var curr_year = d.getFullYear();
	

	printHTML +="<br><div style='font-size:9px;'><i>The Disclaimer: The City and County of San Francisco (CCSF) does not guarantee the accuracy, adequacy, completeness or usefulness of any information. CCSF provides this information on an 'as is' basis without warranty of any kind, including but not limited to warranties of merchantability or fitness for a particular purpose, and assumes no responsibility for anyone's use of the information. </i></div><br>"
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

function Link() {
	//alert(theLinkAddress)
	var sPath = window.location.pathname;
	var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
	var thedeptparam=""
	var thenameparam=""
	var theLink=""
	
	
	
	theLink = "http://54.83.57.240/TIM" + "?&search="+theLinkAddress
	
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
		
		//alert("reached buffer with buffered: " +  buffered)
		
		var bufferPolys = [];
		theBufferDist= theDist
		buffParams.distances = [1, theBufferDist];
		for (i=0; i < theRestmp.length; i++) {
			var graphic=theRestmp[i].feature
		
		//alert("graphic: " + graphic)
		
			//this next line isn't working for SS
			bufferPolys.push(graphic.geometry)
		}
		//alert("bufferpolys: "+bufferPolys)
		buffParams.geometries = bufferPolys
		buffParams.unionsResults = true;
		gsvc.buffer(buffParams,buffCallback, taskError);
		
		//for street segment loop in identify function
		//buffered += 1
		
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
		//alert("finished bufferCallback")
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
		 
		if (document.getElementById('tab1').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab1').innerHTML = instructions
		}
		if (document.getElementById('tab2').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab2').innerHTML = instructions
		}
		if (document.getElementById('tab3').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab3').innerHTML = instructions
		}
		if (document.getElementById('tab4').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab4').innerHTML = instructions
		}
		if (document.getElementById('tab5').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab5').innerHTML = instructions
		}
		if (document.getElementById('tab6').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab6').innerHTML = instructions
		}
		if (document.getElementById('tab7').innerHTML.indexOf("Please wait, generating report")>=0) {
			document.getElementById('tab7').innerHTML = instructions
		}
		// if (document.getElementById('tab8').innerHTML.indexOf("Please wait, generating report")>=0) {
			// document.getElementById('tab8').innerHTML = instructions
		// }
		// if (document.getElementById('tab9').innerHTML.indexOf("Please wait, generating report")>=0) {
			// document.getElementById('tab9').innerHTML = instructions
		// }
	}
	
	
	function clearBuffer() {
		map.graphics.clear()
		bufferonmap=false;
		map.graphics.add(theSearchGraphic)
	}
	theLastMapLayer=""
	function showHideMap(theID, theDef) {
		theLastMapLayer=theID
		//alert(theID)
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

	

function idresultsort2(a, b) {
	//alert("here")
	//sorts the idResults so that they appear in the tabs in the correct order
	//alert(a.layerName+ "\n"+b.layerName)

	//if (a.layerName == "MAD_Parcel" && b.layerName == "MAD_Parcel") {
		//alert("here")
		var unitNoA = ""
		unitNoA = a.attributes["unit_address"];
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
		zoomInDiv.innerHTML = "<img src='http://" + theServerName + "/TIM/images/UpArrow.png' title='Enlarge the Map' alt='Enlarge the Map'>";
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
		zoomInDiv.innerHTML = "<img src='http://" + theServerName + "/TIM/images/DownArrow.png' title='Shrink the Map' alt='Shrink the Map'>";
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





function in_array(needle, haystack){     
	var found = 0;     
	for (var i=0, len=haystack.length;i<len;i++) {         
		if (haystack[i] == needle) return true;             
			found++;     
	}     
	return false; 
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
	
		var panorama;
		var addLatLng;
		var showPanoData;
		var panorama;
		var theLat1
		var theLong1

		function load_map_and_street_view_from_address(theLat,theLong) {	
	
			theLat1=theLat
			theLong1=theLong

			create_map_and_streetview(theLat, theLong, 'map_canvas', 'pano');
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

	
	
function updatePropertyHtml() {
	//alert("updateProperty, No of results: "+ idResults.length + "\ntheSearchType: "+ theSearchType)
	//go through the results array and look for the Assessors records that were found at the location.  Add these to the property report HTML.  
	theNum = 0
		
		// Copied from previous zoning tab
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
		
		theAssessorHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Information from the Planning Department, and general information related to properties at this location.</td></tr></table>"
		
		//TIM in progress disclaimer
		theAssessorHtml +=beta_disclaimer
		
		theAssessorHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
		if ((idResults.length> 0) && (theSearchType=="Block")) {
			
			theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBlocks'>Blocks</a></td></tr></table>"
		}
		if ((idResults.length> 0) && (theSearchType=="mapClick" || theSearchType=="Parcel" || theSearchType=="Address" || theSearchType=="Case" || theSearchType=="Geocode" || theSearchType=="Block")) {
			theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkParcels'>Parcels</a></td></tr></table>"
		}
		
		// LINKS
		
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkAddresses'>Addresses</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBSPsidewalks'>Better Streets Plan</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkGreenConnections'>Green Connections</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkNeighborhood'>Neighborhood</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkZoningDistricts'>Zoning Districts</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkTAZ'>Traffic Analysis Zone</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkTransitPriority'>Transit Priority Area</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkCensusTracts'>Census Tract</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkSuperdistricts'>Superdistrict</a></td></tr></table>"
		theAssessorHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkAreaPlans'>Area Plans</a></td></tr></table>"
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
		 theNum=0
		 theAPN=""
		 theParcels=0
		var theTotalParcels=0
		 var theTotalParcelstmp=0
		 theParcelListForAccela=""
		 theParcelListForAccelaPart2=""
		 
		 
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
			if (result.layerName == "Parcels" ) {
				if (theParcelListForAccela=="") {
					theParcelListForAccela = "'"+result.feature.attributes["blklot"] +"'"
					theTotalParcelstmp=theTotalParcelstmp+1
				} else {
					if (theParcelListForAccela.indexOf(result.feature.attributes["blklot"])<0) {
						theParcelListForAccela += "," + "'"+result.feature.attributes["blklot"] +"'"
						theTotalParcelstmp=theTotalParcelstmp+1
						
					}	
				}
			}
			
			
			if (result.layerName == "Retired Parcels") {
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
			//alert("result.layerId: " + result.layerId + "\nName: " + result.layerName)
			
			if ((result.layerName == "Parcel Labels") && (theSearchType=="mapClick" || theSearchType=="Parcel" || theSearchType=="Address" || theSearchType=="Case" || theSearchType=="Geocode" || theSearchType=="Block")) {
				theNum = theNum + 1;
				theParcels = theParcels + 1;
				//alert("here")
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
						//alert("here")
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
		//alert(tempAssessorHtml)
		//alert("Debugging: finished Parcel Labels")
		
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
		
		/*
		if ((theSearchType=="mapClick") && (theParcels==0) ) {
			theAssessorHtml = theAssessorHtml + "<table class='reportData'><tr><td style='width:15px'></td><td><b>You did not click inside a property boundary.  Most of the information in this website is only available for properties.  To correct this, click on the map inside a property boundary.</b></td></tr></table>"
			//setTimeout("new Messi('You did not click inside a property boundary.  Most of the information in this website is only available for properties.  To correct this, click on the map inside a property boundary.', {title: 'No Properties Foundaaa', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});",750)
			showTab('dhtmlgoodies_tabView1',"7");
		}
		*/

		/* 
		if ((theOrigType=="Address") && (theParcels==0) && (theSearchType=="Geocode")) {
			theAssessorHtml += "<table class='reportData'><tr><td style='width:15px'></td><td ><b>The exact location of this address cannot be found as the address you typed does not appear to be an official address. An approximate location is being used.<br><br> <span class='NoPrint'>Most of the information in this web site is only available for properties. If the blue marker on the map is not inside a property boundary the web site will only show limited information.  <br><br>You can correct this by either typing an official address into the search box or by clicking inside the property boundary on the map.</span></b></td></tr></table>"
			theMessage = '<div style="text-align:left;">The exact location of this address cannot be found as the address you typed does not appear to be an official address. An approximate location is being used. <br><br>If you think the location shown on the map is incorrect try clicking on the map at the correct location or search for an official address.</div>'
			setTimeout("new Messi('"+ theMessage+"', {title: 'No Properties Found', modal: true, titleClass: 'info', buttons: [{id: 0, label: 'OK'}]});",750)
		} 
		*/
		
		// DELETE PARCEL HISTORY SECTION
		/*
		theNum=0
		theAssessorHtml +="<a name='BookmarkParcelHistory'></a>"
		if (isLayerVisible("Retired Parcels")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARCEL HISTORY: </span><input class='NoPrint' onclick='showHideMap( " + '"Retired Parcels"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Retired Parcels' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARCEL HISTORY: </span><input class='NoPrint' onclick='showHideMap( " + '"Retired Parcels"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Retired Parcels' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
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
		*/
			
		//	if (theNum>5) {
		//		theAssessorHtml+="<div id='limitRetiredHTML' style='height:110px;overflow:hidden'>" + tempAssessorHtml + "</div>"
		//		theAssessorHtml+="<div id='limitRetiredMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitRetiredHTML\",\"limitRetiredMore\",\"110px\");'>more...</a></td></tr></table></div>"
		//	} else {
		//		theAssessorHtml += tempAssessorHtml
		//	}
		//	if (theNum==0) {
		//		theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		//	}
		
		//
		//NOW LOAD THE RESULTS FROM THE OTHER LAYERS
		//	
		

			
		//ADDRESSES
			
		//go through the results array and look for the Addresses that were found at the location.  Add these to the property report HTML.  
		theNum=0
		theAssessorHtml +="<a name='BookmarkAddresses'></a>"
		theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ADDRESSES: </span></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		tempAssessorHtml=""
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
		
	
		// BETTER STREETS PLAN
		theNum=0
		theAssessorHtml +="<a name='BookmarkBSPsidewalks'></a>"
		
		if (isLayerVisible("Streets_bsp_dissolve")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BETTER STREETS PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"Streets_bsp_dissolve"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Streets_bsp_dissolve' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BETTER STREETS PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"Streets_bsp_dissolve"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Streets_bsp_dissolve' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		
		theAssessorHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>All streets within 250 feet of the selected location, along with information from the SF Better Streets Plan. Major new development or redevelopment areas that create new streets must meet or exceed recommended sidewalk widths per <a href='http://www.amlegal.com/nxt/gateway.dll/California/planning/article12dimensionsareasandopenspaces?f=templates$fn=default.htm$3.0$vid=amlegal:sanfrancisco_ca$anc=JD_138.1' target='_blank'>Planning Code Section 138.1</a>. Please see the <a href='http://www.sfbetterstreets.org/design-guidelines/sidewalk-width/' target='_blank'>Better Streets website</a> for more information.</i></td></tr></table>"
				
		// Data lookup
		
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "betterstreetsbuffer") {
				
				if (result.feature.attributes["BSP_CLASS"] != null  && result.feature.attributes["BSP_CLASS"] != 'Does Not Exist' && result.feature.attributes["BSP_CLASS"] != 'HWY' && result.feature.attributes["BSP_CLASS"] != 'HWY Ramp') {
					theNum = theNum + 1 
					if (theNum == 1) {
						theAssessorHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:150px;'><b>Street</b></td><td><b>BSP Street Type</b></td><td><b>Minimum <br>Sidewalk Width</b></td><td><b>Recommended<br>Sidewalk Width</b></td></tr>"
					}
					theAssessorHtml += "<tr><td style='width:150px;'>" + result.feature.attributes["STREETNAME"] + "</td><td>" + result.feature.attributes["finaltype"] + "</td><td>" +result.feature.attributes["side_min"] + "</td><td>" + result.feature.attributes["side_rec"] + "</td></tr>"
				}
			}
		}
		if (theNum>0) {
				theAssessorHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}	
		
		
		// GREEN CONNECTIONS
		theNum=0
		theAssessorHtml +="<a name='BookmarkGreenConnections'></a>"
		
		if (isLayerVisible("GreenConnectionsTIM_dissolve")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>GREEN CONNECTIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"GreenConnectionsTIM_dissolve"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='GreenConnectionsTIM_dissolve' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>GREEN CONNECTIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"GreenConnectionsTIM_dissolve"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='GreenConnectionsTIM_dissolve' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		
		theAssessorHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Green Connection routes within 250 feet of the selected location. Green Connections aims to increase access to parks, open spaces, and the waterfront by envisioning a network of ‘green connectors.’ For more information, see the <a href='http://www.sf-planning.org/index.aspx?page=3002' target='_blank'>Green Connections website</a>.</i></td></tr></table>"
		
		// Data lookup
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "greenconnectionsbuffer") {
				if (result.feature.attributes["STREETNAME"] != null) {
					theNum = theNum + 1 
					if (theNum == 1) {
						theAssessorHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:150px;'><b>Street</b></td><td><b>Route Name</b></td><td><b>Route Number</b></td></tr>"
					}
					theAssessorHtml += "<tr><td style='width:150px;'>" + result.feature.attributes["STREETNAME"] + "</td><td>" + result.feature.attributes["GC_RT_NME5"] + "</td><td>" +result.feature.attributes["GC_RT_NUM5"] + "</td></tr>"
				}
			}
		}
		if (theNum>0) {
				theAssessorHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}

		// ZONING
		theNum=0
		theAssessorHtml +="<a name='BookmarkZoningDistricts'></a>"
		if (isLayerVisible("Zoning - Zoning Districts")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZONING DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Zoning Districts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zoning - Zoning Districts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZONING DISTRICTS: </span><input class='NoPrint' onclick='showHideMap( " + '"Zoning - Zoning Districts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zoning - Zoning Districts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];		
			if (result.layerName == "Zoning - Zoning Districts") {
				if (result.feature.attributes["ZONING_SIM"] != null) {
					theNum = theNum + 1
					theAssessorHtml = theAssessorHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>" + result.feature.attributes["ZONING_SIM"] + " - <a target='_blank' href = '" + result.feature.attributes["URL"] +"'>" + result.feature.attributes["DISTRICTNAME"] + "</a></td></tr></table>"
					if (result.feature.attributes["ZONING_SIM"] =="NC-1") {
						showProx=true;
					}
				}
			}
		}
		if (theNum==0) {
			theAssessorHtml = theAssessorHtml + "<table class='reportData'><tr><td style='width:15px'></td><td>None</td></tr></table>"
		}

	
		// NEIGHBORHOODS
		
		theNum=0
		theAssessorHtml +="<a name='BookmarkNeighborhood'></a>"
		if (isLayerVisible("Neighborhoods")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOOD: </span><input class='NoPrint' onclick='showHideMap( " + '"Neighborhoods"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Neighborhoods' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>NEIGHBORHOOD: </span><input class='NoPrint' onclick='showHideMap( " + '"Neighborhoods"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Neighborhoods' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "Neighborhoods") {
				if (result.feature.attributes["NEIGHBORHOOD"] != null) {
					theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>"+ result.feature.attributes["NEIGHBORHOOD"] + "</td><td class='NoPrint'> </td><td class='NoPrint'> &nbsp; </tr></table>"
					theNum=theNum+1
				}
			}
		}
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
		// TRAFFIC ANALYSIS ZONES
		
		theNum=0
		theAssessorHtml +="<a name='BookmarkTAZ'></a>"
		if (isLayerVisible("TAZ")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC ANALYSIS ZONE: </span><input class='NoPrint' onclick='showHideMap( " + '"TAZ"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TAZ' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC ANALYSIS ZONE: </span><input class='NoPrint' onclick='showHideMap( " + '"TAZ"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TAZ' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "TAZ") {
				if (result.feature.attributes["TAZ"] != null) {
					theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>"+ result.feature.attributes["TAZ"] + "</td><td class='NoPrint'> </td><td class='NoPrint'> &nbsp; </tr></table>"
					theNum=theNum+1
				}
			}
		}
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		// TRANSIT PRIORITY AREA
		
		theNum=0
		theAssessorHtml +="<a name='BookmarkTransitPriority'></a>"
		if (isLayerVisible("transitpriorityarea")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRANSIT PRIORITY AREA: </span><input class='NoPrint' onclick='showHideMap( " + '"transitpriorityarea"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='transitpriorityarea' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRANSIT PRIORITY AREA: </span><input class='NoPrint' onclick='showHideMap( " + '"transitpriorityarea"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='transitpriorityarea' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "transitpriorityarea") {
				if (result.feature.attributes["Shape"] != null) {
					theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>This location is in a transit priority area.</td></tr></table>"
					theNum=theNum+1
					}
			}
		}
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>This location is not in a transit priority area.</td><td></td></tr></table>"
		}
		
 		// CENSUS TRACTS
  		
		theNum=0
		theAssessorHtml +="<a name='BookmarkCensusTracts'></a>"
		if (isLayerVisible("CensusTracts")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CENSUS TRACT: </span><input class='NoPrint' onclick='showHideMap( " + '"CensusTracts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='CensusTracts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CENSUS TRACT: </span><input class='NoPrint' onclick='showHideMap( " + '"CensusTracts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='CensusTracts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "CensusTracts") {
				if (result.feature.attributes["namelsad10"] != null) {
					theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>" + result.feature.attributes["namelsad10"] + "</td></tr></table>"
					theNum=theNum+1
					}
			}
		}
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>No census tract.</td><td></td></tr></table>"
		}   
		
		// SUPERDISTRICTS
  		
		theNum=0
		theAssessorHtml +="<a name='BookmarkSuperdistricts'></a>"
		if (isLayerVisible("superdistricts")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SUPERDISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"superdistricts"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='superdistricts' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SUPERDISTRICT: </span><input class='NoPrint' onclick='showHideMap( " + '"superdistricts"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='superdistricts' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "superdistricts") {
				if (result.feature.attributes["SUPERD"] != null) {
					theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td>Superdistrict " + result.feature.attributes["SUPERD"] + "</td></tr></table>"
					theNum=theNum+1
					}
			}
		}
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>No superdistrict.</td><td></td></tr></table>"
		}   
		
		// AREA PLANS
  		
		theNum=0
		theAssessorHtml +="<a name='BookmarkAreaPlans'></a>"
		if (isLayerVisible("areaplan_projected")) {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>AREA PLANS: </span><input class='NoPrint' onclick='showHideMap( " + '"areaplan_projected"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='areaplan_projected' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} else {
			theAssessorHtml = theAssessorHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>AREA PLANS: </span><input class='NoPrint' onclick='showHideMap( " + '"areaplan_projected"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='areaplan_projected' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "areaplan_projected") {
				if (result.feature.attributes["PLANAREA"] != null) {
					theAssessorHtml += "<table class='reportData' ><tr><td style='width:15px'></td><td><a href=" + result.feature.attributes["URL"]+ " target='_blank'>" + result.feature.attributes["PLANAREA"] + "</a></td></tr></table>"
					theNum=theNum+1
					}
			}
		}
		if (theNum==0) {
			theAssessorHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>No superdistrict.</td><td></td></tr></table>"
		}   
		
		// CURRENT PLANNING TEAM 
		/*
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
		*/
		

		
		
		//
		// TO ADD NEW SECTIONS ADD TO THE ARCMAP PROJECT, REPUBLISH THE SERVICE AND THEN COPY THE NEIGHBORHOODS SECTION, PASTE IT BELOW 
		// THEN EDIT IT TO REFLECT THE NEW LAYER'S NAME AND FIELDS.
		//

	//Clean up the html by removing any references to 'Null' or 'undefined' data
	theAssessorHtml = theAssessorHtml.replace(/Null/gi,"&nbsp");
	theAssessorHtml = theAssessorHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theAssessorHtml += "<p class='NoPrint'><br></p>"
	theAssessorHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkPropertyTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	theAssessorHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	
	//publish the HTML to the page
	document.getElementById('tab1').innerHTML = theAssessorHtml
	
	//Set up bookmarks for easch of the sections
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
		default:
			break;
	}
	
}

function updateSafetyHtml() {
// Information that pertains to street safety  

	// Header with printing
	
	
	theSafetyHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Information about street safety pertaining to San Francisco's <a href='http://visionzerosf.org/' target='_blank'>Vision Zero policy</a>.</td></tr></table>"
	//TIM in progress disclaimer
	theSafetyHtml +=beta_disclaimer
	
	//LINKS
	theSafetyHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkVZHIN'>Vision Zero Overall High Injury Network</a></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkVZCapitalProjects'>Vision Zero Capital Projects</a></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkPedHighInjury'>Pedestrian High Injury Network</a></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkPedInjuries'>Pedestrian Injuries (SWITRS 2005-2012)</a></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkPedFatalities'>Pedestrian Fatalities (SWITRS 2005-2012)</a></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBikeHighInjury'>Bicycle High Injury Network</a></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBikeInjuries'>Bicycle Injuries (SWITRS 2005-2012)</a></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBikeFatalities'>Bicycle Fatalities (SWITRS 2005-2012)</a></td></tr></table>"
	theSafetyHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkVehHighInjury'>Vehicle High Injury Network</a></td></tr></table>"
	theSafetyHtml +="<br></div>"
	
	//OVERALL HIGH INJURY NETWORK
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkVZHIN'></a>"
	
	if (isLayerVisible("TB_overall_hgh_injry_network")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>VISION ZERO HIGH INJURY NETWORK: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_overall_hgh_injry_network"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TB_overall_hgh_injry_network' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>VISION ZERO HIGH INJURY NETWORK: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_overall_hgh_injry_network"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TB_overall_hgh_injry_network' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "TB_overall_hgh_injry_network_buffer") {
			if (result.feature.attributes["street_nam"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table><tr><td>This location is on the following high injury corridor(s):</td></tr>"
					theSafetyHtml +="<tr><td><b>Street Name</b></td><td><b>Type of High Injury Corridor</b></td></tr>"
				}
				theSafetyHtml += "<tr><td>" + result.feature.attributes["street_nam"] + " " + result.feature.attributes["street_typ"] + "</td><td> " + result.feature.attributes["overlap"] +"</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>This location is not on the Vision Zero high injury network.</td><td></td></tr></table>"
		}

	// VISION ZERO CAPITAL PROJECTS
	
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkVZCapitalProjects'></a>"
	
	if (isLayerVisible("TB_VZ_capitalimprovements_20150615")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>SFMTA VISION ZERO CAPITAL PROJECTS: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_VZ_capitalimprovements_20150615"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TB_VZ_capitalimprovements_20150615' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>SFMTA VISION ZERO CAPITAL PROJECTS: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_VZ_capitalimprovements_20150615"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TB_VZ_capitalimprovements_20150615' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	theSafetyHtml +="<table><tr><td style='width:10px'></td><td>This location is within 500 feet of the following SFMTA Vision Zero capital projects: </td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "TB_VZ_capitalimprovements_buffer") {
			if (result.feature.attributes["location"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:150px;'><b>Location</b></td><td><b>Project Name</b></td><td><b>Description</b></td><td><b>Est. Completion</b></td></tr>"
				}
				theSafetyHtml += "<tr><td style='width:150px;'>" + result.feature.attributes["location"] + "</td><td>" + result.feature.attributes["project_na"] + "</td><td>" +result.feature.attributes["short_desc"] + "</td><td>" + result.feature.attributes["completion"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
	// PED HIGH INJURY NETWORK
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkPedHighInjury'></a>"
	
	if (isLayerVisible("TB_ped_hgh_injry_crrdr")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PEDESTRIAN HIGH INJURY NETWORK: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_ped_hgh_injry_crrdr"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TB_ped_hgh_injry_crrdr' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PEDESTRIAN HIGH INJURY NETWORK: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_ped_hgh_injry_crrdr"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TB_ped_hgh_injry_crrdr' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "TB_ped_hgh_injry_crrdr_buffer") {
			if (result.feature.attributes["street_nam"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table><tr><td>This location is on the following pedestrian high injury corridor(s):</td></tr>"
				}
				theSafetyHtml += "<tr><td>" + result.feature.attributes["street_nam"] + " " + result.feature.attributes["street_typ"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>This location is not on the pedestrian high injury network.</td><td></td></tr></table>"
		}
	
	// PEDESTRIAN INJURIES
	
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkPedInjuries'></a>"
	
	if (isLayerVisible("TB_pedcollisions_int")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PEDESTRIAN INJURIES (SWITRS 2005-2012): </span><input class='NoPrint' onclick='showHideMap( " + '"TB_pedcollisions_int"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TB_pedcollisions_int' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PEDESTRIAN INJURIES (SWITRS 2005-2012): </span><input class='NoPrint' onclick='showHideMap( " + '"TB_pedcollisions_int"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TB_pedcollisions_int' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	theSafetyHtml +="<table><tr><td style='width:10px'></td><td>SWITRS has pedestrian collision data from 2005-2012 at the following intersections within 500 ft of this location: </td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "TB_pedcollisions_int_buffer") {
			if (result.feature.attributes["cnn_intrsc"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Street</b></td><td><b>Cross Street</b></td><td><b>Number of Pedestrian<br>Injuries (2005-2012)</b></td><td><b>Number of Pedestrian<br>Fatalities (2005-2012)</b></td></tr>"
				}
				theSafetyHtml += "<tr><td>" + result.feature.attributes["FIRST_prim"] + "</td><td>" + result.feature.attributes["FIRST_seco"] + "</td><td>" +result.feature.attributes["SUM_pedinj"] + "</td><td>" + result.feature.attributes["SUM_pedfat"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
	// PEDESTRIAN FATALITIES
	
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkPedFatalities'></a>"
	
	if (isLayerVisible("pedcollisions_party_ped_fatal")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PEDESTRIAN FATALITIES (SWITRS 2005-2012): </span><input class='NoPrint' onclick='showHideMap( " + '"pedcollisions_party_ped_fatal"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='pedcollisions_party_ped_fatal' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PEDESTRIAN FATALITIES (SWITRS 2005-2012): </span><input class='NoPrint' onclick='showHideMap( " + '"pedcollisions_party_ped_fatal"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='pedcollisions_party_ped_fatal' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	theSafetyHtml +="<table><tr><td style='width:10px'></td><td>The following pedestrian fatalities occurred at or near intersections within 500 ft of this location: </td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "pedcollisions_party_ped_fatal_buffer") {
			if (result.feature.attributes["cnn_intrsc"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Street</b></td><td><b>Cross Street</b></td><td><b>Year</b></td><td><b>At intersection?</b></td></tr>"
				}
				theSafetyHtml += "<tr><td>" + result.feature.attributes["primary_rd"] + "</td><td>" + result.feature.attributes["secondary_"] + "</td><td>" +result.feature.attributes["accident_y"] + "</td><td>" + result.feature.attributes["intersecti"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
	
	// BIKE HIGH INJURY NETWORK
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkBikeHighInjury'></a>"
	
	if (isLayerVisible("TB_cyc_hgh_injry_crrdr")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BICYCLE HIGH INJURY NETWORK: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_cyc_hgh_injry_crrdr"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TB_cyc_hgh_injry_crrdr' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BICYCLE HIGH INJURY NETWORK: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_cyc_hgh_injry_crrdr"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TB_cyc_hgh_injry_crrdr' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "TB_cyc_hgh_injry_crrdr_buffer") {
			if (result.feature.attributes["street_nam"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td>This location is on the following bicycle high injury corridor(s):</td></tr>"
				}
				theSafetyHtml += "<tr><td>" + result.feature.attributes["street_nam"] + " " + result.feature.attributes["street_typ"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>This location is not on the bicycle high injury network.</td><td></td></tr></table>"
		}
	
	// BICYCLE INJURIES
	
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkBikeInjuries'></a>"
	
	if (isLayerVisible("TB_bikecollisions_int")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BICYCLE INJURIES (SWITRS 2005-2012): </span><input class='NoPrint' onclick='showHideMap( " + '"TB_bikecollisions_int"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TB_bikecollisions_int' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BICYCLE INJURIES (SWITRS 2005-2012): </span><input class='NoPrint' onclick='showHideMap( " + '"TB_bikecollisions_int"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TB_bikecollisions_int' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	theSafetyHtml +="<table><tr><td style='width:10px'></td><td>SWITRS has bicycle collision data from 2005-2012 at the following intersections within 500 ft of this location: </td></tr></table>"
		
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "TB_bikecollisions_int_buffer") {
			if (result.feature.attributes["cnn_intrsc"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Street</b></td><td><b>Cross Street</b></td><td><b>Number of Bicycle<br>Injuries (2005-2012)</b></td><td><b>Number of Bicycle<br>Fatalities (2005-2012)</b></td></tr>"
				}
				theSafetyHtml += "<tr><td>" + result.feature.attributes["FIRST_prim"] + "</td><td>" + result.feature.attributes["FIRST_seco"] + "</td><td>" +result.feature.attributes["SUM_bikein"] + "</td><td>" + result.feature.attributes["SUM_bikefa"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
	// BICYCLE FATALITIES
	
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkBikeFatalities'></a>"
	
	if (isLayerVisible("bikecollisions_party_bike_fatal")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BICYCLE FATALITIES (SWITRS 2005-2012): </span><input class='NoPrint' onclick='showHideMap( " + '"bikecollisions_party_bike_fatal"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='bikecollisions_party_bike_fatal' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BICYCLE FATALITIES (SWITRS 2005-2012): </span><input class='NoPrint' onclick='showHideMap( " + '"bikecollisions_party_bike_fatal"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='bikecollisions_party_bike_fatal' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	theSafetyHtml +="<table><tr><td style='width:10px'></td><td>The following cyclist fatalities occurred at or near intersections within 500 ft of this location: </td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "bikecollisions_party_bike_fatal_buffer") {
			if (result.feature.attributes["cnn_intrsc"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Street</b></td><td><b>Cross Street</b></td><td><b>Year</b></td><td><b>At intersection?</b></td></tr>"
				}
				theSafetyHtml += "<tr><td>" + result.feature.attributes["primary_rd"] + "</td><td>" + result.feature.attributes["secondary_"] + "</td><td>" +result.feature.attributes["accident_y"] + "</td><td>" + result.feature.attributes["intersecti"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
		
		
	// VEHICLE HIGH INJURY NETWORK
	theNum=0
	theSafetyHtml +="<br><br><a name='BookmarkVehHighInjury'></a>"
	
	if (isLayerVisible("TB_veh_hgh_injry_crrdr")) {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>VEHICLE HIGH INJURY NETWORK: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_veh_hgh_injry_crrdr"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TB_veh_hgh_injry_crrdr' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theSafetyHtml = theSafetyHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>VEHICLE HIGH INJURY NETWORK: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_veh_hgh_injry_crrdr"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TB_veh_hgh_injry_crrdr' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "TB_veh_hgh_injry_crrdr_buffer") {
			if (result.feature.attributes["street_nam"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theSafetyHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td>This location is on the following vehicle high injury corridor(s):</td></tr>"
				}
				theSafetyHtml += "<tr><td style='width:150px;'>" + result.feature.attributes["street_nam"] + " " + result.feature.attributes["street_typ"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theSafetyHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theSafetyHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>This location is not on the vehicle high injury network.</td><td></td></tr></table>"
		}
	
	//clean out 'null's and 'undefined's
	theSafetyHtml = theSafetyHtml.replace(/Null/gi,"&nbsp");
	theSafetyHtml = theSafetyHtml.replace(/undefined/gi,"&nbsp");
	//add some room to the bottom of the report
	theSafetyHtml += "<p class='NoPrint'><br></p>"
	theSafetyHtml += "<div class='NoPrint'><table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'><a href='javascript:void(0);' onclick='javascript:window.location=\"#BookmarkSafetyTop\"; window.location.hash=\"\";'>back to top </a></td><td></td></tr></table></div>"
	theSafetyHtml += "<div class='Noprint'><table style='height: 700px;'><tr><td></td></tr></table></div>"
	
	//publish the HTML to the page
	document.getElementById('tab2').innerHTML = theSafetyHtml	
	
	// Add bookmarks
	switch(theBM) {
		case "ZONINGDISTRICTS":
			showTab('dhtmlgoodies_tabView1',"1");
			jumpToBookmark('#BookmarkZoningDistricts')
			break;
		default:
			break;
	}
	//theBM=""
}

function updateTransitHtml() {
	//theTransitHtml +="<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Information about transit<br></td></tr></table>"	
	
	//TIM in progress disclaimer
	theTransitHtml +=beta_disclaimer
	
	theTransitHtml +="<div class='NoPrint'><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theTransitHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkTransitPref'>General Plan: Transit Preferential Streets</a></td></tr></table>"
	theTransitHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkMuniLines'>MUNI Lines</a></td></tr></table>"
	theTransitHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkMuniStops'>MUNI Stops</a></td></tr></table>"
	theTransitHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkTransitOnlyLanes'>Transit Only Lanes</a></td></tr></table>"
	theTransitHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBARTStations'>BART Stations</a></td></tr></table>"
	theTransitHtml +="<br></div>"

	// GENERAL PLAN: TRANSIT PREFERENTIAL STREETS
	theNum=0
	theTransitHtml +="<a name='BookmarkTransitPref'></a>"
	if (isLayerVisible("gp_transitpref")) {			
			theTransitHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRANSIT PREFERENTIAL STREETS FROM GENERAL PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"gp_transitpref"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='gp_transitpref' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
			theTransitHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRANSIT PREFERENTIAL STREETS FROM GENERAL PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"gp_transitpref"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='gp_transitpref' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	
	theTransitHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Transit Preferential streets according to the General Plan within 250 feet of the selected location. For a description of each classification, see the <a href='http://www.sf-planning.org/ftp/general_plan/I4_Transportation.htm#TRA_MTR' target='_blank'>Transportation Element of the San Francisco General Plan</a>.</i></td></tr></table>"

	for (var i = 0; i < idResults.length; i++) {					
		var result = idResults[i];
		if (result.layerName == "gp_transitpref_buffer") {
			
			if (result.feature.attributes["STREET"] != null) {
				theNum = theNum + 1  									
				if (theNum==1) {
					theTransitHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:175px;'><b>Street</b></td><td><b>Classification</b></td></tr>"
				}
				theTransitHtml += "<tr><td style='width:175px;'>" + result.feature.attributes["STREET"] + " "+  result.feature.attributes["ST_TYPE"] + "</td><td>" +result.feature.attributes["TRANSPREF"] + "</td></tr>"
			}
		}
	}
	
	if (theNum>0) {
			theTransitHtml += "</table></td></tr></table>"
	}
	if (theNum==0) {							
			theTransitHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
	}
	
	// MUNI LINES
	theNum=0
	theTransitHtml +="<br><a name='BookmarkMuniLines'></a>"
	temptheTransitHtml=""
	
	if (isLayerVisible("sfmtaPublicLinesSpringSignUp2015")) {
		theTransitHtml = theTransitHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>MUNI LINES: </span><input class='NoPrint' onclick='showHideMap( " + '"sfmtaPublicLinesSpringSignUp2015"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='sfmtaPublicLinesSpringSignUp2015' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theTransitHtml = theTransitHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>MUNI LINES: </span><input class='NoPrint' onclick='showHideMap( " + '"sfmtaPublicLinesSpringSignUp2015"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='sfmtaPublicLinesSpringSignUp2015' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

		
	temptheTransitHtml += "<table class='reportData' width=100%><tr><td style='width:10px'></td><td>This location is within 1/4 mile of the following MUNI lines:</td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "sfmtaPublicLinesSpringSignUp2015_buffer") {
			if (result.feature.attributes["PUBLICLINE"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					temptheTransitHtml += "<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Line Number</b></td><td><b>Part of Rapid Network?</b></td></tr>"
				}
				temptheTransitHtml += "<tr><td>" + result.feature.attributes["PUBLICLINE"] + "</td><td>" + result.feature.attributes["RAPID"] + "</td></tr>"
			}
		}
	}
	
	// if (theNum>0) {
		temptheTransitHtml += "</table></td></tr></table>"
	// }  
		
	if (theNum>7) {

		theTransitHtml += "<div id='limitMUNILinesHTML' style='height:200px;overflow:hidden'>" + temptheTransitHtml + "</div>"
		theTransitHtml += "<div id='limitMUNILinesMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitMUNILinesHTML\",\"limitMUNILinesMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		theTransitHtml += temptheTransitHtml
	}
	
	if (theNum==0) {
			theTransitHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}
	
	
	
	// MUNI STOPS
	temptheTransitHtml=""
	theNum=0
	theTransitHtml +="<br><br><a name='BookmarkMuniStops'></a>"
	
	if (isLayerVisible("sfmtaStopsSpringSignUp2015")) {
		theTransitHtml = theTransitHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>MUNI STOPS: </span><input class='NoPrint' onclick='showHideMap( " + '"sfmtaStopsSpringSignUp2015"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='sfmtaStopsSpringSignUp2015' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theTransitHtml = theTransitHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>MUNI STOPS: </span><input class='NoPrint' onclick='showHideMap( " + '"sfmtaStopsSpringSignUp2015"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='sfmtaStopsSpringSignUp2015' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	temptheTransitHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td>This location is within 1/4 mile of the following MUNI stops:</td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "sfmtaStopsSpringSignUp2015_buffer") {
			if (result.feature.attributes["ONSTREET"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					temptheTransitHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px>"
				}
				temptheTransitHtml += "<tr><td>" + result.feature.attributes["STOPNAME"] + "</td></tr>"
			}
		}
	}

	temptheTransitHtml += "</table></td></tr></table>"

	if (theNum>7) {

		theTransitHtml += "<div id='limitMUNIStopsHTML' style='height:200px;overflow:hidden'>" + temptheTransitHtml + "</div>"
		theTransitHtml += "<div id='limitMUNIStopsMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitMUNIStopsHTML\",\"limitMUNIStopsMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		theTransitHtml += temptheTransitHtml
	}
	
	if (theNum==0) {
			theTransitHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}
	
	
	// TRANSIT ONLY LANES
	theNum=0
	theTransitHtml +="<br><br><a name='BookmarkTransitOnlyLanes'></a>"
	
	if (isLayerVisible("transitonlylanes_active")) {
		theTransitHtml = theTransitHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRANSIT ONLY LANES: </span><input class='NoPrint' onclick='showHideMap( " + '"transitonlylanes_active"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='transitonlylanes_active' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theTransitHtml = theTransitHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRANSIT ONLY LANES: </span><input class='NoPrint' onclick='showHideMap( " + '"transitonlylanes_active"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='transitonlylanes_active' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	theTransitHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td>This location is within 250 feet of the following transit-only lanes:</td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "transitonlylanes_buffer") {
			if (result.feature.attributes["ST_NAME"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theTransitHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Street Name</b></td><td><b>Operating Parameters</b></td></tr>"
				}
				theTransitHtml += "<tr><td>" + result.feature.attributes["ST_NAME"] + "</td><td>" + result.feature.attributes["SPAN_OPS"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theTransitHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theTransitHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}	
	
			
	// BART STATIONS
	theNum=0
	theTransitHtml +="<br><br><a name='BookmarkBARTStations'></a>"
	
	if (isLayerVisible("bartstations")) {
		theTransitHtml = theTransitHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BART STATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"bartstations"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='bartstations' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theTransitHtml = theTransitHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BART STATIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"bartstations"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='bartstations' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	theTransitHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td>This location is within 1/4 mile of the following BART stations:</td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "bartstationsbuffer") {
			if (result.feature.attributes["NAME_ABV_A"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theTransitHtml +="<table>"
				}
				theTransitHtml += "<tr><td style='width:10px'></td><td>" + result.feature.attributes["NAME_ABV_A"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theTransitHtml += "</table>"
		}
			
		if (theNum==0) {
				theTransitHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}	
	

			
	//publish the HTML to the page
	document.getElementById('tab3').innerHTML = theTransitHtml	
}

function updatePedBikeHtml() {

	// Paragraph at the top of the page
	thePedBikeHtml += "<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>Information about pedestrian and bicycle data and infrastructure.</td></tr></table>"
	
	//TIM in progress disclaimer
	thePedBikeHtml +=beta_disclaimer
	
	// Shortcuts
	thePedBikeHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	thePedBikeHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkPedNetwork'>Citywide Pedestrian Network from General Plan</a></td></tr></table>"
	// thePedBikeHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkPedVolumes'>Pedestrian Volumes</a></td></tr></table>"
	thePedBikeHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkTrafficCalming'>Traffic Calming Features</a></td></tr></table>"
	thePedBikeHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkCurbRamps'>Missing Curb Ramps</a></td></tr></table>"
	thePedBikeHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkParklets'>Nearby Parklets</a></td></tr></table>"
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkBikeRoutes'>Bikeways</a></td></tr></table>"
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkBikeShare'>Bay Area Bike Share</a></td></tr></table>"
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkBikeParking'>Public Bike Parking</a></td></tr></table>"
	thePedBikeHtml +="<br></div>"
	
	// GENERAL PLAN: CITYWIDE PEDESTRIAN NETWORK
	theNum=0
	thePedBikeHtml +="<a name='BookmarkPedNetwork'></a>"
	if (isLayerVisible("gp_pedestrian")) {			
			thePedBikeHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CITYWIDE PEDESTRIAN NETWORK FROM GENERAL PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"gp_pedestrian"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='gp_pedestrian' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
			thePedBikeHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>CITYWIDE PEDESTRIAN NETWORK FROM GENERAL PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"gp_pedestrian"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='gp_pedestrian' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Street type according to the Citywide Pedestrian Network from the SF General Plan for streets within 250 feet of the selected location. For a description of each classification, see the <a href='http://www.sf-planning.org/ftp/general_plan/I4_Transportation.htm#TRA_PED_25' target='_blank'>Transportation Element of the San Francisco General Plan</a>. Note: Streets labeled 'City Street' have no special classification under the Pedestrian Network.</td></tr></table>"
	
	for (var i = 0; i < idResults.length; i++) {					
		var result = idResults[i];
		if (result.layerName == "gp_pedestrian_buffer") {
			
			if (result.feature.attributes["STREET"] != null) {
				theNum = theNum + 1  									
				if (theNum==1) {
					thePedBikeHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:175px;'><b>Street</b></td><td><b>Classification</b></td></tr>"
				}
				thePedBikeHtml += "<tr><td style='width:175px;'>" + result.feature.attributes["STREET"] + " "+  result.feature.attributes["ST_TYPE"] + "</td><td>" +result.feature.attributes["PEDESTRIAN"] + "</td></tr>"
			}
		}
	}
	
	if (theNum>0) {
			thePedBikeHtml += "</table></td></tr></table>"
	}
	if (theNum==0) {							
			thePedBikeHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
	}
	/* 
	// PEDESTRIAN VOLUMES
	theNum=0
	var pedcount = 0
	var pedave = 0
	thePedBikeHtml +="<br><br><a name='BookmarkPedVolumes'></a>"
	
	if (isLayerVisible("TB_intersection_transpo")) {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PEDESTRIAN VOLUME ESTIMATE: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_intersection_transpo"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='TB_intersection_transpo' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PEDESTRIAN VOLUME ESTIMATE: </span><input class='NoPrint' onclick='showHideMap( " + '"TB_intersection_transpo"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='TB_intersection_transpo' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Pedestrian volume estimates from SFMTA's 2010 pedestrian model. Average volume figure below is per intersection, for intersections within 1/4 mile of the selected location.</i></td></tr></table>"
	
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "tb_int_transpo_buffer_quartermile") {
			if (result.feature.attributes["ped_vol_24"] != null) {
				theNum+= 1 
				pedcount += Number(result.feature.attributes["ped_vol_24"])
			}
		}
	}
	
	pedave =  Math.round(pedcount/theNum)
	
		if (theNum>0) {
			
			
			thePedBikeHtml +="<table><tr><td style='width:10px;'></td><td style='width:150px;'><b>Average Daily Pedestrian Volume at Nearby Intersections</b></td><td style='width:150px;'><b>Number of Intersections Included</b></td></tr>"
			thePedBikeHtml +=	   "<tr><td style='width:10px;'></td><td>" + pedave + "</td><td>" + theNum + "</td></tr></table>"
						
		}
			
		if (theNum==0) {
			thePedBikeHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>No pedestrian volume estimates available.</td><td></td></tr></table>"
			}
	 */


	
	
	// TRAFFIC CALMING SECTION
	theNum=0
	thePedBikeHtml +="<br><br><a name='BookmarkTrafficCalming'></a>"
	
	if (isLayerVisible("Traffic_Calming_Point_Features_092014")) {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC CALMING FEATURES: </span><input class='NoPrint' onclick='showHideMap( " + '"Traffic_Calming_Point_Features_092014"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Traffic_Calming_Point_Features_092014' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC CALMING FEATURES: </span><input class='NoPrint' onclick='showHideMap( " + '"Traffic_Calming_Point_Features_092014"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Traffic_Calming_Point_Features_092014' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Traffic calming features within 250 feet of the selected location. Data is from SFMTA and is updated from the <a href='https://data.sfgov.org/Transportation/Traffic-Calming-Point-Features/ddye-rism' target='_blank'>Traffic Calming Features dataset on DataSF</a>.</i></td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "trafficcalmingbuffer") {
			if (result.feature.attributes["DESCRIPT"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					thePedBikeHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:150px;'><b>Street</b></td><td><b>From (If Applicable)</b></td><td><b>To (If Applicable)</b></td><td><b>Type of Features</b></td></tr>"
				}
				thePedBikeHtml += "<tr><td style='width:150px;'>" + result.feature.attributes["STREETNAME"] + "</td><td>" + result.feature.attributes["FROM_STREE"] + "</td><td>" +result.feature.attributes["TO_STREET"] + "</td><td>" + result.feature.attributes["DESCRIPT"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				thePedBikeHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				thePedBikeHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}

	//  CURB RAMPS SECTION
	theNum=0
	thePedBikeHtml +="<br><br><a name='BookmarkCurbRamps'></a>"
	
	if (isLayerVisible("missingcurbramps")) {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>MISSING CURB RAMPS: </span><input class='NoPrint' onclick='showHideMap( " + '"missingcurbramps"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='missingcurbramps' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>MISSING CURB RAMPS: </span><input class='NoPrint' onclick='showHideMap( " + '"missingcurbramps"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='missingcurbramps' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Missing curb ramps within 250 feet of the selected location. Data is from SF Public Works and is updated from the <a href='https://data.sfgov.org/City-Infrastructure/Curb-Ramps/ch9w-7kih' target='_blank'>curb ramps dataset on DataSF</a>.</i></td></tr></table>"
		
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "MissingCurbRamps_buffer") {
			if (result.feature.attributes["LocationDe"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					thePedBikeHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px>"
					thePedBikeHtml +="<tr><td><b>Intersection or Street</b></td><td><b>Corner</b></td><td><b>Position on Corner</tr>"
				}
				
				thePedBikeHtml += "<tr><td style='width:250px;'>" + result.feature.attributes["LocationDe"] + "</td><td>" + result.feature.attributes["curbReturn"] + "</td><td>" + result.feature.attributes["positionOn"] + "</tr>"
			}
		}
	}
		if (theNum>0) {
				thePedBikeHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				thePedBikeHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}
	 
	
// PARKLETS SECTION
	theNum=0
	thePedBikeHtml +="<br><br><a name='BookmarkParklets'></a>"
	
	if (isLayerVisible("Parklets")) {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARKLETS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"Parklets"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Parklets' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>PARKLETS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"Parklets"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Parklets' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
		
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>For more information on parklets in SF, see the <a href='http://pavementtoparks.sfplanning.org/index.html' target='_blank'>Pavement to Parks website</a>.</i></td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Parklets_buffer") {
			if (result.feature.attributes["Address"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					thePedBikeHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:150px;'><b>Address</b></td><td><b>Sponsoring Business</b></td><td><b>Permitting Stage</b></td></tr>"
				}
				thePedBikeHtml += "<tr><td style='width:150px;'>" + result.feature.attributes["Address"] + "</td><td>" + result.feature.attributes["Sponsoring"] + "</td><td>" +result.feature.attributes["Stage"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				thePedBikeHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				thePedBikeHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
		}	
	
// BIKE ROUTES SECTION
	var tempthePedBikeHtml = ""
	theNum=0
	thePedBikeHtml +="<br><br><a name='BookmarkBikeRoutes'></a>"
	
	// Section header and map display
	if (isLayerVisible("SFMTA Bike Network April 2015")) {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BIKEWAYS: </span><input class='NoPrint' onclick='showHideMap( " + '"SFMTA Bike Network April 2015"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='SFMTA Bike Network April 2015' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>BIKEWAYS: </span><input class='NoPrint' onclick='showHideMap( " + '"SFMTA Bike Network April 2015"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='SFMTA Bike Network April 2015' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Routes on the San Francisco Bikeway Network within 250 feet of the selected location.</i></td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "bikeroutebuffer") {
			if (result.feature.attributes["NUMBER_"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					tempthePedBikeHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Street</b></td><td><b>Facility Type</b></td><td><b>Bike Route Number</b></td></tr>"
				}
				tempthePedBikeHtml += "<tr><td style='width:250px;'>" + result.feature.attributes["STREETNAME"] + " " + result.feature.attributes["TYPE"] + "</td><td>" +result.feature.attributes["FACILITY_T"] + "</td><td>" + result.feature.attributes["NUMBER_"] + "</td></tr>"
			}
		}
	}
	

	tempthePedBikeHtml += "</table></td></tr></table>"

	if (theNum>7) {

		thePedBikeHtml += "<div id='limitBikeRouteHTML' style='height:200px;overflow:hidden'>" + tempthePedBikeHtml + "</div>"
		thePedBikeHtml += "<div id='limitBikeRouteMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitBikeRouteHTML\",\"limitBikeRouteMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		thePedBikeHtml += tempthePedBikeHtml
	}
	
	if (theNum==0) {
			thePedBikeHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}
	
	
	// BIKESHARE SECTION
		
	theNum=0
	thePedBikeHtml +="<a name='BookmarkBikeShare'></a>"
	if (isLayerVisible("BikeShareStations")) {			
			thePedBikeHtml = thePedBikeHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BAY AREA BIKE SHARE: </span><input class='NoPrint' onclick='showHideMap( " + '"BikeShareStations"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='BikeShareStations' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
			thePedBikeHtml = thePedBikeHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BAY AREA BIKE SHARE: </span><input class='NoPrint' onclick='showHideMap( " + '"BikeShareStations"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='BikeShareStations' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	thePedBikeHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Bay Area Bike Share stations within 1000 feet of the selected location. Data is downloaded from the <a href='http://www.bayareabikeshare.com/datachallenge' target='_blank'>Bay Area Bike Share live JSON feed</a>.</i></td></tr></table>"
	
	for (var i = 0; i < idResults.length; i++) {					
		var result = idResults[i];
		if (result.layerName == "BikeShareStations_buffer") {
			if (result.feature.attributes["stAddress1"] != null) {
				theNum = theNum + 1  									
				if (theNum==1) {
					thePedBikeHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Station Location</b></td><td><b>Number of Docks</b></td><td><b>Last Updated</b></td></tr>"
				}
				thePedBikeHtml += "<tr><td style='width:250px;'>" + result.feature.attributes["stAddress1"] + "</td><td>" +result.feature.attributes["totalDocks"] + "</td><td>" + result.feature.attributes["timestamp"] + "</td></tr>"
			}
		}
	}

	if (theNum>0) {
			thePedBikeHtml += "</table></td></tr></table>"
	}
	
	if (theNum==0) {							
			thePedBikeHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
	}
		

	// BIKE PARKING
	
	theNum=0
	thePedBikeHtml +="<br><br><a name='BookmarkBikeParking'></a>"
	
	// Section header and map display
	if (isLayerVisible("BikeParking")) {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON-STREET BIKE PARKING: </span><input class='NoPrint' onclick='showHideMap( " + '"BikeParking"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='BikeParking' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		thePedBikeHtml = thePedBikeHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON-STREET BIKE PARKING: </span><input class='NoPrint' onclick='showHideMap( " + '"BikeParking"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='BikeParking' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}

	thePedBikeHtml +="<table><tr><td style='width:10px;'></td><td>There is on-street bicycle parking associated with the following addresses within 250 feet:</td></tr></table>"
		
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "BikeParkingBuffer250ft") {
			if (result.feature.attributes["ADDRESS"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					thePedBikeHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Address</b></td><td><b>Location</b></td><td><b>Number of Racks</b></td><td><b>Number of Spaces</b></td></tr>"
				}
				thePedBikeHtml += "<tr><td style='width:250px;'>" + result.feature.attributes["ADDRESS"] + "</td><td>" + result.feature.attributes["LOCATION_N"] + "</td><td>" +result.feature.attributes["RACKS"] + "</td><td>" + result.feature.attributes["SPACES"] + "</td></tr>"
			}
		}
	}
	
	if (theNum>0) {
			thePedBikeHtml += "</table></td></tr></table>"
	}
		
	if (theNum==0) {
			thePedBikeHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
	}
	
	//publish the HTML to the page
	document.getElementById('tab4').innerHTML  = thePedBikeHtml 	
}

/* function updateParkingHtml() {
	
	// Paragraph at the top of the page
	//theParkingHtml +="<br><table class='reportData' width=100%><tr><td style='width:10px'></td><td>information about traffic and parking</td></tr></table>"
	
	//TIM in progress disclaimer
	theParkingHtml +=beta_disclaimer
	
	// Shortcuts
	theParkingHtml +="<br><br><div class='NoPrint'><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	
	
	theParkingHtml +="</div>"


	
	
	
	
	//publish the HTML to the page
	document.getElementById('tab5').innerHTML = theParkingHtml	
} */

function updateVehicleHtml() {
		
	//TIM in progress disclaimer
	theVehicleHtml +=beta_disclaimer
	
	theVehicleHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkGP_Vehicle'>Street Types from General Plan</a></td></tr></table>"
	theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkTruckRoutes'>Truck Routes</a></td></tr></table>"
	theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkOffStreetParking'>Off-Street Parking</a></td></tr></table>"
	// theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkParkingCensus'>SFPark Parking Census 2008-2014</a></td></tr></table>"
	// theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkZipcar'>Carsharing - Zipcar</a></td></tr></table>"
	// theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkCityCarShare'>Carsharing - City CarShare</a></td></tr></table>"
	// theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkGetaround'>Carsharing - Getaround</a></td></tr></table>"
	// theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkExistingLOS'>Traffic Studies: Existing Conditions</a></td></tr></table>"
	// theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:20px'></td><td><a href='#BookmarkCumulativeLOS'>Traffic Studies: Cumulative Analysis</a></td></tr></table>"
	theVehicleHtml +="<br></div>"
	

	// GENERAL PLAN: VEHICULAR STREET TYPE
	theNum=0
	theVehicleHtml +="<a name='BookmarkGP_Vehicle'></a>"
	if (isLayerVisible("gp_vehicle")) {			
			theVehicleHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STREET TYPES FROM GENERAL PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"gp_vehicle"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='gp_vehicle' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
			theVehicleHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>STREET TYPES FROM GENERAL PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"gp_vehicle"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='gp_vehicle' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	
	theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Street type according to the Vehicular Street Map of the General Plan for streets within 250 feet of the selected location. For a description of each classification, see the <a href='http://www.sf-planning.org/ftp/general_plan/I4_Transportation.htm#TRA_VC' target='_blank'>Transportation Element of the San Francisco General Plan</a>. Note: Streets labeled 'City Street' have no special classification under the vehicular street type map.</td></tr></table>"

	for (var i = 0; i < idResults.length; i++) {					
		var result = idResults[i];
		if (result.layerName == "gp_vehicle_buffer") {
			
			if (result.feature.attributes["STREET"] != null) {
				theNum = theNum + 1  									
				if (theNum==1) {
					theVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:175px;'><b>Street</b></td><td><b>Classification</b></td></tr>"
				}
				theVehicleHtml += "<tr><td style='width:175px;'>" + result.feature.attributes["STREET"] + " "+  result.feature.attributes["ST_TYPE"] + "</td><td>" +result.feature.attributes["VEHICULAR"] + "</td></tr>"
			}
		}
	}
	
	if (theNum>0) {
			theVehicleHtml += "</table></td></tr></table>"
	}
	if (theNum==0) {							
			theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
	}
	
	// TRUCK ROUTES
	theNum=0
	theVehicleHtml +="<a name='BookmarkTruckRoutes'></a>"
	if (isLayerVisible("SanFranciscoTruckRoutes")) {			
			theVehicleHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRUCK ROUTES: </span><input class='NoPrint' onclick='showHideMap( " + '"SanFranciscoTruckRoutes"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='SanFranciscoTruckRoutes' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
			theVehicleHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRUCK ROUTES: </span><input class='NoPrint' onclick='showHideMap( " + '"SanFranciscoTruckRoutes"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='SanFranciscoTruckRoutes' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	
	theVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Truck routes within 250 feet of the selected location. For more information, see the <a href='https://data.sfgov.org/Transportation/Truck-Routes-San-Francisco-CA/ce5f-8b7c' target='_blank'>DataSF page for this data</a>.</i></td></tr></table>"
	
	for (var i = 0; i < idResults.length; i++) {					
		var result = idResults[i];
		if (result.layerName == "truckroutesbuffer") {
			if (result.feature.attributes["STREETNAME"] != null) {
				theNum = theNum + 1  									
				if (theNum==1) {
					theVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Street</b></td><td><b>Type of Route</b></td></tr>"
				}
				theVehicleHtml += "<tr><td style='width:250px;'>" + result.feature.attributes["STREETNAME"] + "</td><td>" +result.feature.attributes["RouteType"] + "</td></tr>"
			}
		}
	}
	
	if (theNum>0) {
			theVehicleHtml += "</table></td></tr></table>"
	}
	if (theNum==0) {							
			theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
	}
	
	// OFF STREET PARKING
	
	var parking_dict = {PPA:"Paid publicly available", CPO:"Customer parking only", PHO:"Permit holders only",CGO:"Commercial/government only",FPA:"Free parking available"};
	var garage_dict = {G:"Garage",L:"Lot",GL:"Garage and Lot"};
	
	var temptheVehicleHtml = ""
	theNum=0
	theVehicleHtml +="<a name='BookmarkOffStreetParking'></a>"
	if (isLayerVisible("OffStreetParking2011")) {			
			theVehicleHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>OFF-STREET PARKING LOCATIONS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"OffStreetParking2011"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='OffStreetParking2011' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
			theVehicleHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>OFF-STREET PARKING LOCATIONS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"OffStreetParking2011"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='OffStreetParking2011' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}

	temptheVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Off-street parking locations within 1/4 mile, as of September 2011. For more information, see the <a href='https://data.sfgov.org/Transportation/Off-Street-parking-lots-and-parking-garages/uupn-yfaw' target='_blank'>DataSF page for this data</a>.</i></td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {					
		var result = idResults[i];
		if (result.layerName == "OffStreetParking_Buffer") {
			if (result.feature.attributes["Address"] != null) {
				theNum = theNum + 1  									
				if (theNum==1) {
					temptheVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Address</b></td><td><b>Primary Parking Type</b></td><td><b>Garage or Lot</b></td><td><b>Number of Spaces</b></td></tr>"
				}
				
				var parkingtype = parking_dict[result.feature.attributes["PrimeType"]]
				var garagetype = garage_dict[result.feature.attributes["GarOrLot"]]
				
				temptheVehicleHtml += "<tr><td style='width:250px;'>" + result.feature.attributes["Address"] + "</td><td>" + parkingtype + "</td><td>" + garagetype + "</td><td>" + result.feature.attributes["RegCap"] + "</td></tr>"
			}
		}
	}
	
	// if (theNum>0) {
		temptheVehicleHtml += "</table></td></tr></table>"
	// }  
		
	if (theNum>7) {

		theVehicleHtml += "<div id='limitOffStreetParkingHTML' style='height:200px;overflow:hidden'>" + temptheVehicleHtml + "</div>"
		theVehicleHtml += "<div id='limitOffStreetParkingMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitOffStreetParkingHTML\",\"limitOffStreetParkingMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		theVehicleHtml += temptheVehicleHtml
	}
	
	if (theNum==0) {
			theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}
	
	/* 
	//  PARKING SURVEY
	temptheVehicleHtml =""
	theNum=0
	theVehicleHtml +="<a name='BookmarkParkingCensus'></a>"
	if (isLayerVisible("Sfpark_OnStreetParkingCensus_201404")) {			
			theVehicleHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SFPARK PARKING CENSUS: </span><input class='NoPrint' onclick='showHideMap( " + '"Sfpark_OnStreetParkingCensus_201404"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Sfpark_OnStreetParkingCensus_201404' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
			theVehicleHtml += "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>SFPARK PARKING CENSUS: </span><input class='NoPrint' onclick='showHideMap( " + '"Sfpark_OnStreetParkingCensus_201404"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Sfpark_OnStreetParkingCensus_201404' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}

	temptheVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Estimates for the number of on-street parking spaces on each street segment within 250 feet of the selected location. Data is from SFPark's April 2014 on-street parking census. For more information, see the <a href='http://sfpark.org/resources/parking-census-data-context-and-map-april-2014/' target='_blank'>SFPark website</a>.</i></td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {					
		var result = idResults[i];
		if (result.layerName == "parkingcensusbuffer") {
			if (result.feature.attributes["CNN"] != null & result.feature.attributes["PRKNG_SPLY"] != 5555) {
				theNum = theNum + 1  									
				if (theNum==1) {
					temptheVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:250px;'><b>Street</b></td><td><b>Number of Spaces</b></td><td><b>Year</b></td></tr>"
				}
				temptheVehicleHtml += "<tr><td style='width:250px;'>" + result.feature.attributes["ST_NAME"] + " " + result.feature.attributes["ST_TYPE"] + "</td><td>" + result.feature.attributes["PRKNG_SPLY"] + "</td><td>" + result.feature.attributes["YEAR"] + "</td></tr>"
			}
		}
	}
	
	temptheVehicleHtml += "</table></td></tr></table>"
		
	if (theNum>7) {

		theVehicleHtml += "<div id='limitSFParkCensusHTML' style='height:200px;overflow:hidden'>" + temptheVehicleHtml + "</div>"
		theVehicleHtml += "<div id='limitSFParkCensusMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitSFParkCensusHTML\",\"limitSFParkCensusMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		theVehicleHtml += temptheVehicleHtml
	}
	
	if (theNum==0) {
			theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}
	 

	// ZIPCAR
	temptheVehicleHtml =""
	theNum=0
	theVehicleHtml +="<br><br><a name='BookmarkZipcar'></a>"
	
	if (isLayerVisible("Zipcar location baseline Feature Class")) {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZIPCAR LOCATIONS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"Zipcar location baseline Feature Class"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Zipcar location baseline Feature Class' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>ZIPCAR LOCATIONS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"Zipcar location baseline Feature Class"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Zipcar location baseline Feature Class' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	temptheVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Data is for off-street carshare pods from December 2014.</i></td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Zipcarbuffer") {
			if (result.feature.attributes["location"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					temptheVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Location</b></td><td><b>Number of Spaces</b></td><td><b>Address</b></td></tr>"
				}
				temptheVehicleHtml += "<tr><td>" + result.feature.attributes["location"] + "</td><td>" + result.feature.attributes["spaces"] + "</td><td>" + result.feature.attributes["address"] + "</td></tr>"
			}
		}
	}
	
	temptheVehicleHtml += "</table></td></tr></table>"
		
	if (theNum>7) {

		theVehicleHtml += "<div id='limitZipcarHTML' style='height:200px;overflow:hidden'>" + temptheVehicleHtml + "</div>"
		theVehicleHtml += "<div id='limitZipcarMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitZipcarHTML\",\"limitZipcarMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		theVehicleHtml += temptheVehicleHtml
	}
	
	if (theNum==0) {
			theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}

	// CITY CARSHARE
	temptheVehicleHtml =""
	theNum=0
	theVehicleHtml +="<br><br><a name='BookmarkCityCarShare'></a>"
	
	if (isLayerVisible("CCS_Pods Dec 2014 Feature Class")) {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>CITY CARSHARE LOCATIONS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"CCS_Pods Dec 2014 Feature Class"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='CCS_Pods Dec 2014 Feature Class' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>CITY CARSHARE LOCATIONS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"CCS_Pods Dec 2014 Feature Class"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='CCS_Pods Dec 2014 Feature Class' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	temptheVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Data is for off-street carshare pods from December 2014.</i></td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "CCSbuffer") {
			if (result.feature.attributes["Name"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					temptheVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Location</b></td><td><b>Number of Spaces</b></td><td><b>Address</b></td></tr>"
				}
				temptheVehicleHtml += "<tr><td>" + result.feature.attributes["Name"] + "</td><td>" + result.feature.attributes["Count"] + "</td><td>" + result.feature.attributes["Address"] + "</td></tr>"
			}
		}
	}

	temptheVehicleHtml += "</table></td></tr></table>"
		
	if (theNum>7) {

		theVehicleHtml += "<div id='limitCCSHTML' style='height:200px;overflow:hidden'>" + temptheVehicleHtml + "</div>"
		theVehicleHtml += "<div id='limitCCSMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitCCSHTML\",\"limitCCSMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		theVehicleHtml += temptheVehicleHtml
	}
	
	if (theNum==0) {
			theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}

	// GETAROUND
	temptheVehicleHtml =""
	theNum=0
	theVehicleHtml +="<br><br><a name='BookmarkGetaround'></a>"
	
	if (isLayerVisible("Getaround 20140917 Feature Class")) {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>GETAROUND LOCATIONS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"Getaround 20140917 Feature Class"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Getaround 20140917 Feature Class' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>GETAROUND LOCATIONS WITHIN 1/4 MILE: </span><input class='NoPrint' onclick='showHideMap( " + '"Getaround 20140917 Feature Class"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Getaround 20140917 Feature Class' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	temptheVehicleHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td><i>Data is for off-street carshare pods from December 2014.</i></td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Getaroundbuffer") {
			if (result.feature.attributes["CAR_Parkin"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					temptheVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Address</b></td><td><b>Number of Spaces</b></td></tr>"
				}
				temptheVehicleHtml += "<tr><td>" + result.feature.attributes["CAR_Parkin"] + "</td><td>" + result.feature.attributes["Count"] + "</td></tr>"
			}
		}
	}
	
	temptheVehicleHtml += "</table></td></tr></table>"
		
	if (theNum>7) {

		theVehicleHtml += "<div id='limitGetaroundHTML' style='height:200px;overflow:hidden'>" + temptheVehicleHtml + "</div>"
		theVehicleHtml += "<div id='limitGetaroundMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitGetaroundHTML\",\"limitGetaroundMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		theVehicleHtml += temptheVehicleHtml
	}
	
	if (theNum==0) {
			theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}
    
    */
	
/* 	// TRAFFIC STUDIES - EXISTING
	theNum=0
	theVehicleHtml +="<br><br><a name='BookmarkExistingLOS'></a>"
	temptheVehicleHtml = ""
	
	if (isLayerVisible("Existing Intersection LOS")) {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC STUDIES - EXISTING CONDITIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Existing Intersection LOS"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Existing Intersection LOS' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC STUDIES - EXISTING CONDITIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Existing Intersection LOS"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Existing Intersection LOS' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "ExistingLOSbuffer") {
			if (result.feature.attributes["Intersecti"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					temptheVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Intersection</b></td><td><b>Peak Period</b></td><td><b>Year</b></td><td><b>LOS</b></td><td><b>Project</b></td><td><b>Delay</b></td></tr>"
				}
				temptheVehicleHtml += "<tr><td>" + result.feature.attributes["Intersecti"] + "</td><td>" + result.feature.attributes["AM_PM"] + "</td><td>" + result.feature.attributes["Year"] + "</td><td>" + result.feature.attributes["LOS"] + "</td><td>" + result.feature.attributes["EIR_Projec"] + "</td><td>" + result.feature.attributes["Delay_sec_"] + "</td></tr>"
			}
		}
	}
	
	temptheVehicleHtml += "</table></td></tr></table>"
	
	if (theNum>7) {

		theVehicleHtml += "<div id='limitExistingLOSHTML' style='height:200px;overflow:hidden'>" + temptheVehicleHtml + "</div>"
		theVehicleHtml += "<div id='limitExistingLOSMore'><table class='NoPrint'><tr><td style='width:15px'></td><td><a href='javascript:void(0);' onclick='expand(\"limitExistingLOSHTML\",\"limitExistingLOSMore\",\"200px\");'>more...</a></td></tr></table></div>"
		
	} else {
		theVehicleHtml += temptheVehicleHtml
	}
			
	if (theNum==0) {
			theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
	}

	// TRAFFIC STUDIES - CUMULATIVE
	theNum=0
	theVehicleHtml +="<br><br><a name='BookmarkCumulativeLOS'></a>"
	
	if (isLayerVisible("Cumulative Intersection LOS")) {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC STUDIES - CUMULATIVE CONDITIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Cumulative Intersection LOS"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Cumulative Intersection LOS' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theVehicleHtml = theVehicleHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC STUDIES - CUMULATIVE CONDITIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Cumulative Intersection LOS"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Cumulative Intersection LOS' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "CumulativeLOSbuffer") {
			if (result.feature.attributes["Intersecti"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theVehicleHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Intersection</b></td><td><b>Peak Period</b></td><td><b>Cumulative Year</b></td><td><b>LOS</b></td><td><b>Project</b></td><td><b>Delay</b></td></tr>"
				}
				theVehicleHtml += "<tr><td>" + result.feature.attributes["Intersecti"] + "</td><td>" + result.feature.attributes["AM_PM"] + "</td><td>" + result.feature.attributes["Year"] + "</td><td>" + result.feature.attributes["LOS"] + "</td><td>" + result.feature.attributes["EIR_Projec"] + "</td><td>" + result.feature.attributes["Delay_sec_"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theVehicleHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theVehicleHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
		} */
	
	
	//publish the HTML to the page
	document.getElementById('tab5').innerHTML = theVehicleHtml		
}

function updateStreetSegmentHtml() {
	
	//TIM in progress disclaimer
	theStreetSegmentHtml += beta_disclaimer
	
	// Identify if street segment
	var theSegmentNum = 0
	var theStreetName = ""
	var theCNN = ""
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "ROWPolygons") {
			theSegmentNum += 1
			
			// Also capture street name and CNN
			if (result.feature.attributes["STREET"] != "") {
				theStreetName = result.feature.attributes["STREET"] + " " + result.feature.attributes["ST_TYPE"] + " BETWEEN " + result.feature.attributes["FROM_ST"] + " AND " + result.feature.attributes["TO_ST"]
			} else {
				theStreetName = "BLANK"
			}
			theCNN = result.feature.attributes["CNNTEXT"]
		}
	}
	
	if (theSegmentNum == 0) {
	
	//Display note if not a street segment
	theStreetSegmentHtml +=		"<br><table class='reportData' width='100%'><tr><td style='width:10px'></td><td>"+
								"You have not clicked a street segment. This tab will only population with information "+
								"if a street segment is clicked in the map."+
								"</td></tr></table>"
	document.getElementById('tabTitle'+'6').style.color="" 
	document.getElementById('tabTitle'+'6').style.fontWeight="" 
	document.getElementById('tabTitle'+'6').style.fontSize="" 
	
	
	} else {
	//Make tab bold if street segment
		// document.getElementById('tabTitle'+'6').style.color="black" 
		// document.getElementById('tabTitle'+'6').style.fontWeight="bold" 
		// document.getElementById('tabTitle'+'6').style.fontSize="15px" 
		
	//Return basic street information
		theStreetSegmentHtml +="<br><table class='reportData' width='100%'>"
		theStreetSegmentHtml +="<tr><td style='width:10px'></td><td>You have clicked on a street segment. The following information is for:</td></tr>"
		if (theStreetName != "BLANK") {
			theStreetSegmentHtml +="<tr><td style='width:10px'></td><td><b>" + theStreetName + "</b></td></tr>"
			} 
		theStreetSegmentHtml +="<tr><td style='width:10px'></td><td><b>CNN: " + theCNN + "</b></td></tr>"
		theStreetSegmentHtml +="</table>"
	}
	
	// If statement: only display contents if a street segment
	
	if (theSegmentNum != 0) {
	
	//Table of Contents
	theStreetSegmentHtml +="<div class='NoPrint'><br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	theStreetSegmentHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkMuniInfoSS'>MUNI Information</a></td></tr></table>"
	//theStreetSegmentHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkExistingLOS_SS'>Traffic Studies - Existing Conditions</a></td></tr></table>"
	//theStreetSegmentHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkCumulativeLOS_SS'>Traffic Studies - Cumulative Conditions</a></td></tr></table>"
	//theStreetSegmentHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkBSPSS'>Better Streets Plan</a></td></tr></table>"
	theStreetSegmentHtml +="<table class='reportData' width='100%'><tr><td style='width:20px'></td><td><a href='#BookmarkGreenConnectionsSS'>Green Connections</a></td></tr></table>"
	theStreetSegmentHtml +="<br></div>"


	//
	// TRANSIT INFORMATION
	
	theStreetSegmentHtml +="<br><a name='BookmarkMuniInfoSS'></a>"
	theStreetSegmentHtml += "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRANSIT INFORMATION:</span></td></tr></table>"
	
	// Start master table
	
	theStreetSegmentHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td>The following MUNI lines, stops, and lanes are on or cross this street segment:</td></tr></table>"
	theStreetSegmentHtml +="<table><tr>"
	
	// Add indentation
	
	theStreetSegmentHtml +="<td style='width:15px'></td>"
	
	//First column: MUNI Lines
		
		theNum=0
		theStreetSegmentHtml +="<td style='width:200px'>"
		theStreetSegmentHtml +="<table>"
		
		//Header with map button
		theStreetSegmentHtml +="<tr><td><b>"
		if (isLayerVisible("sfmtaPublicLinesSpringSignUp2015")) {
			theStreetSegmentHtml += "<table width='100%'><tr><td align='left'><b>MUNI LINES </b><input class='NoPrint' onclick='showHideMap( " + '"sfmtaPublicLinesSpringSignUp2015"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='sfmtaPublicLinesSpringSignUp2015' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} 
			else {
			theStreetSegmentHtml += "<table width='100%'><tr><td align='left'><b>MUNI LINES </b><input class='NoPrint' onclick='showHideMap( " + '"sfmtaPublicLinesSpringSignUp2015"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='sfmtaPublicLinesSpringSignUp2015' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
		theStreetSegmentHtml +="</b></td></tr>"
		
		// Data lookup
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "sfmtaPublicLinesSpringSignUp2015") {
				if (result.feature.attributes["PUBLICLINE"] != null) {
					theNum = theNum + 1 
					theStreetSegmentHtml += "<tr><td>" + result.feature.attributes["PUBLICLINE"] + " " + result.feature.attributes["DIRECTIONN"] + "</td></tr>"
				}
			}
		}
		if (theNum>0) {
				theStreetSegmentHtml += "</table>"
		}
			
		if (theNum==0) {
				theStreetSegmentHtml += "<tr><td style='width:15px'>None</td></tr></table>"
		}
		
		theStreetSegmentHtml +="</td>"
	
	//Second column: MUNI Stops
		
		theNum=0
		theStreetSegmentHtml +="<td style='width:200px'>"
		theStreetSegmentHtml +="<table>"
		
		//Header with map button
		theStreetSegmentHtml +="<tr><td><b>"
		if (isLayerVisible("sfmtaStopsSpringSignUp2015")) {
			theStreetSegmentHtml += "<table width='100%'><tr><td align='left'><b>MUNI STOPS </b><input class='NoPrint' onclick='showHideMap( " + '"sfmtaStopsSpringSignUp2015"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='sfmtaStopsSpringSignUp2015' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} 
			else {
			theStreetSegmentHtml += "<table width='100%'><tr><td align='left'><b>MUNI STOPS </b><input class='NoPrint' onclick='showHideMap( " + '"sfmtaStopsSpringSignUp2015"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='sfmtaStopsSpringSignUp2015' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
		theStreetSegmentHtml +="</b></td></tr>"
		
		// Data lookup
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "sfmtaStopsSpringSignUp2015") {
				if (result.feature.attributes["STOPNAME"] != null) {
					theNum = theNum + 1 
					theStreetSegmentHtml += "<tr><td>" + result.feature.attributes["STOPNAME"] + "</td></tr>"
				}
			}
		}
		if (theNum>0) {
				theStreetSegmentHtml += "</table>"
		}
			
		if (theNum==0) {
				theStreetSegmentHtml += "<tr><td style='width:15px'>None</td></tr></table>"
		}
		
		theStreetSegmentHtml +="</td>"
		
	//Third column: Transit Only Lanes
		
		theNum=0
		theStreetSegmentHtml +="<td style='width:200px'>"
		theStreetSegmentHtml +="<table>"
		
		//Header with map button
		theStreetSegmentHtml +="<tr><td><b>"
		if (isLayerVisible("transitonlylanes_active")) {
			theStreetSegmentHtml += "<table width='100%'><tr><td align='left'><b>TRANSIT ONLY LANES </b><input class='NoPrint' onclick='showHideMap( " + '"transitonlylanes_active"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='transitonlylanes_active' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			} 
			else {
			theStreetSegmentHtml += "<table width='100%'><tr><td align='left'><b>TRANSIT ONLY LANES </b><input class='NoPrint' onclick='showHideMap( " + '"transitonlylanes_active"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='transitonlylanes_active' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
			}
		theStreetSegmentHtml +="</b></td></tr>"
		
		// Data lookup
		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];
			if (result.layerName == "transitonlylanes_active") {
				if (result.feature.attributes["ST_NAME"] != null) {
					theNum = theNum + 1 
					theStreetSegmentHtml += "<tr><td>" + result.feature.attributes["ST_NAME"] + " - " + result.feature.attributes["SPAN_OPS"] + "</td></tr>"
				}
			}
		}
		if (theNum>0) {
				theStreetSegmentHtml += "</table>"
		}
			
		if (theNum==0) {
				theStreetSegmentHtml += "<tr><td style='width:15px'>None</td></tr></table>"
		}
		
		theStreetSegmentHtml +="</td></table><br>"
	
	// End MUNI table
	
/*	// TRAFFIC STUDIES - EXISTING
	theNum=0
	theStreetSegmentHtml +="<a name='BookmarkExistingLOS_SS'></a>"
	
	if (isLayerVisible("Existing Intersection LOS")) {
		theStreetSegmentHtml = theStreetSegmentHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC STUDIES - EXISTING CONDITIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Existing Intersection LOS"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Existing Intersection LOS' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theStreetSegmentHtml = theStreetSegmentHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC STUDIES - EXISTING CONDITIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Existing Intersection LOS"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Existing Intersection LOS' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Existing Intersection LOS") {
			if (result.feature.attributes["Intersecti"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theStreetSegmentHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Intersection</b></td><td><b>Peak Period</b></td><td><b>Year</b></td><td><b>LOS</b></td><td><b>Project</b></td><td><b>Delay</b></td></tr>"
				}
				theStreetSegmentHtml += "<tr><td>" + result.feature.attributes["Intersecti"] + "</td><td>" + result.feature.attributes["AM_PM"] + "</td><td>" + result.feature.attributes["Year"] + "</td><td>" + result.feature.attributes["LOS"] + "</td><td>" + result.feature.attributes["EIR_Projec"] + "</td><td>" + result.feature.attributes["Delay_sec_"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theStreetSegmentHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theStreetSegmentHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
		}
		

	// TRAFFIC STUDIES - CUMULATIVE
	theNum=0
	theStreetSegmentHtml +="<br><br><a name='BookmarkCumulativeLOS_SS'></a>"
	
	if (isLayerVisible("Cumulative Intersection LOS")) {
		theStreetSegmentHtml = theStreetSegmentHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC STUDIES - CUMULATIVE CONDITIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Cumulative Intersection LOS"' + "));' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Cumulative Intersection LOS' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		} 
	else {
		theStreetSegmentHtml = theStreetSegmentHtml + "<table width='100%'><tr><td align='left'><span class='reportSectionHead'>TRAFFIC STUDIES - CUMULATIVE CONDITIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"Cumulative Intersection LOS"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Cumulative Intersection LOS' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
		}
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "Cumulative Intersection LOS") {
			if (result.feature.attributes["Intersecti"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theStreetSegmentHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td><b>Intersection</b></td><td><b>Peak Period</b></td><td><b>Cumulative Year</b></td><td><b>LOS</b></td><td><b>Project</b></td><td><b>Delay</b></td></tr>"
				}
				theStreetSegmentHtml += "<tr><td>" + result.feature.attributes["Intersecti"] + "</td><td>" + result.feature.attributes["AM_PM"] + "</td><td>" + result.feature.attributes["Year"] + "</td><td>" + result.feature.attributes["LOS"] + "</td><td>" + result.feature.attributes["EIR_Projec"] + "</td><td>" + result.feature.attributes["Delay_sec_"] + "</td></tr>"
			}
		}
	}
		if (theNum>0) {
				theStreetSegmentHtml += "</table></td></tr></table>"
		}
			
		if (theNum==0) {
				theStreetSegmentHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td>None</td><td></td></tr></table>"
		}	
	
	
 	// BETTER STREETS PLAN
	theNum=0
	theStreetSegmentHtml +="<a name='BookmarkBSPSS'></a>"
	
	if (isLayerVisible("Streets_bsp_dissolve")) {
		theStreetSegmentHtml = theStreetSegmentHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BETTER STREETS PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"Streets_bsp_dissolve"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='Streets_bsp_dissolve' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theStreetSegmentHtml = theStreetSegmentHtml + "<br><br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>BETTER STREETS PLAN: </span><input class='NoPrint' onclick='showHideMap( " + '"Streets_bsp_dissolve"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='Streets_bsp_dissolve' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	
	theStreetSegmentHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td>Major new development or redevelopment areas that create new streets must meet or exceed recommended sidewalk widths per <a href='http://www.amlegal.com/nxt/gateway.dll/California/planning/article12dimensionsareasandopenspaces?f=templates$fn=default.htm$3.0$vid=amlegal:sanfrancisco_ca$anc=JD_138.1' target='_blank'>Planning Code Section 138.1</a>. For more information on Better Streets Plan, see the <a href='http://www.sfbetterstreets.org/design-guidelines/sidewalk-width/' target='_blank'>Better Streets website</a>.</td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "betterstreetsbuffer") {
			if (result.feature.attributes["BSP_Class"] != null && result.feature.attributes["BSP_Class"] != 'Does Not Exist' && result.feature.attributes["BSP_Class"] != 'HWY' && result.feature.attributes["BSP_Class"] != 'HWY Ramp') {
				theNum = theNum + 1 
				if (theNum == 1) {
					theStreetSegmentHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:150px;'><b>Street</b></td><td><b>BSP Street Type</b></td><td><b>Minimum <br>Sidewalk Width</b></td><td><b>Recommended<br>Sidewalk Width</b></td></tr>"
				}
				theStreetSegmentHtml += "<tr><td style='width:150px;'>" + result.feature.attributes["STREETNAME"] + "</td><td>" + result.feature.attributes["finaltype"] + "</td><td>" +result.feature.attributes["side_min"] + "</td><td>" + result.feature.attributes["side_rec"] + "</td></tr>"
			}
		}
	}
	if (theNum>0) {
			theStreetSegmentHtml += "</table></td></tr></table>"
	}
		
	if (theNum==0) {
			theStreetSegmentHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
	}	
	 */
	
	// GREEN CONNECTIONS
	theNum=0
	theStreetSegmentHtml +="<a name='BookmarkGreenConnectionsSS'></a>"
	
	
	
	if (isLayerVisible("GreenConnectionsTIM-061413")) {
		theStreetSegmentHtml = theStreetSegmentHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>GREEN CONNECTIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"GreenConnectionsTIM-061413"' + ");' title = 'Remove from map' alt='Remove from map' style= 'vertical-align: middle;' id='GreenConnectionsTIM-061413' type='image' src = 'images/map-icon-on.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	} else {
		theStreetSegmentHtml = theStreetSegmentHtml + "<br><table width='100%'><tr><td align='left'><span class='reportSectionHead'>GREEN CONNECTIONS: </span><input class='NoPrint' onclick='showHideMap( " + '"GreenConnectionsTIM-061413"' + ");' title = 'Add to map' alt='Add to map' style= 'vertical-align: middle;' id='GreenConnectionsTIM-061413' type='image' src = 'images/map-icon-off.png' /></td><td align='right'>&nbsp &nbsp</td></tr></table>"
	}
	
	theStreetSegmentHtml +="<table class='reportData' width=100%><tr><td style='width:10px'></td><td>Green Connections aims to increase access to parks, open spaces, and the waterfront by envisioning a network of ‘green connectors.’ For more information, see the <a href='http://www.sf-planning.org/index.aspx?page=3002' target='_blank'>Green Connections website</a>.</td></tr></table>"
	
	// Data lookup
	for (var i = 0; i < idResults.length; i++) {
		var result = idResults[i];
		if (result.layerName == "GreenConnectionsTIM_dissolve") {
			if (result.feature.attributes["STREETNAME"] != null) {
				theNum = theNum + 1 
				if (theNum == 1) {
					theStreetSegmentHtml +="<table><tr><td style='width:10px;'></td><td><table border=0 cellpadding=5px><tr><td style='width:150px;'><b>Street</b></td><td><b>Route Name</b></td><td><b>Route Number</b></td></tr>"
				}
				theStreetSegmentHtml += "<tr><td style='width:150px;'>" + result.feature.attributes["STREETNAME"] + "</td><td>" + result.feature.attributes["GC_RT_NME5"] + "</td><td>" +result.feature.attributes["GC_RT_NUM5"] + "</td></tr>"
			}
		}
	}
	if (theNum>0) {
			theStreetSegmentHtml += "</table></td></tr></table>"
	}
		
	if (theNum==0) {
			theStreetSegmentHtml += "<table class='reportData' style='width:100%;'><tr><td style='width:15px'></td><td style='width:150px'>None </td><td></td></tr></table>"
	}
	
	
	
	theStreetSegmentHtml +="</tr></table>"
	

	//End if-street-segment statement
	}
	
	//publish the HTML to the page
	document.getElementById('tab6').innerHTML = theStreetSegmentHtml

}



function updateProjectsHtml() {
	
	theProjectsHtml +="<br><table class='reportData' width=100%><tr><td style='width:10px'></td><td>This page will list information about capital projects and other transportation initiatives related to this location.</td></tr></table>"
	//theProjectsHtml +="<br><br><div class='NoPrint'><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	
	theProjectsHtml +="<br></div>"
	
	
	
	document.getElementById('tab7').innerHTML = theProjectsHtml
}

	
/* function updateMetaHtml() {
	
	// empty the page html
	var theMetaHtml='';
	
	// Paragraph at the top of the page
	theMetaHtml +="<br><table class='reportData' width=100%><tr><td style='width:10px'></td><td>This page lists information about data and methodology for this website.</td></tr></table>"
	
	//TIM in progress disclaimer
	theMetaHtml +=beta_disclaimer
	
	// Shortcuts
	//theMetaHtml +="<br><br><div class='NoPrint'><table width='100%'><tr><td align='left'><span class='reportSectionHead'>ON THIS PAGE: </span></td></tr></table>"
	
	theMetaHtml +="</div>"
				

	document.getElementById('tab9').innerHTML = theMetaHtml	
}
 */