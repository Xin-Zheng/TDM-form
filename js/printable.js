var findTask = null;
var params = null;
var buffParams=null;
var theRes=null;
var theBuffGeoms = new Array;
var gsvc=null;
var graphic;

var printTask 
var printURL 
var printparams

var ptemplate


function checkPrintReport(theOption) {

	if (document.getElementById(theOption).style.display=='none') {
		document.getElementById(theOption).style.display='inline';  
		//alert(theOption + " display")
	} else {
		document.getElementById(theOption).style.display='none';  
		//alert(theOption + " hide")
	}
}
function displayPrintReport() {
	document.getElementById('mapPrintOptions').style.display='none'; 
}



