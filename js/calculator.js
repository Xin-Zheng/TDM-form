/**
 * Created by Xin Zheng on 8/16/16.
 */





// Detect whether is a mobile phone


var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};


// Define measure point var

// total point
var Atotalpoint = 0;
var Btotalpoint = 0;
var Ctotalpoint = 0;
var Dtotalpoint = 0;

//target point
var Atargetpoint = 0;
var Btargetpoint = 0;
var Ctargetpoint = 0;
var Dtargetpoint = 0;


//Category A measures
var Apkg1point = 0;
var Apkg2point = 0;
var Apkg3point = 0;
var Apkg4point = 0;
var Aact1point = 0;
var Aact2point = 0;
var Aact3point = 0;
var Aact4point = 0;
var Aact5apoint = 0;
var Aact5bpoint = 0;
var Aact6point = 0;
var Aact7point = 0;
var Acshare1point = 0;
var Adeli1point = 0;
var Adeli2point = 0;
var Afam2point = 0;
var Ahov1point = 0;
var Ahov2point = 0;
var Ahov3point = 0;
var Ainfo1point = 0;
var Ainfo2point = 0;
var Ainfo3point = 0;
var Alu1point = 0;

//Category B measures
var Bpkg1point = 0;
var Bpkg2point = 0;
var Bpkg3point = 0;
var Bpkg4point = 0;
var Bact1point = 0;
var Bact2point = 0;
var Bact3point = 0;
var Bact4point = 0;
var Bact5apoint = 0;
var Bact5bpoint = 0;
var Bact6point = 0;
var Bcshare1point = 0;
var Bdeli1point = 0;
var Bfam2point = 0;
var Bhov1point = 0;
var Bhov2point = 0;
var Bhov3point = 0;
var Binfo1point = 0;
var Binfo2point = 0;
var Binfo3point = 0;


//Category C measures
var Cpkg1point = 0;
var Cpkg4point = 0;
var Cact1point = 0;
var Cact2point = 0;
var Cact4point = 0;
var Cact5apoint = 0;
var Cact5bpoint = 0;
var Cact6point = 0;
var Ccshare1point = 0;
var Cdeli1point = 0;
var Cfam1point = 0;
var Cfam2point = 0;
var Cfam3point = 0;
var Chov1point = 0;
var Chov2point = 0;
var Cinfo1point = 0
var Cinfo2point = 0;
var Cinfo3point = 0;
var Clu2point = 0;

//Category D measures
var Dpkg4point = 0;
var Dact2point = 0;
var Dact3point = 0;
var Dcshare1point = 0;
var Dinfo1point = 0
var Dinfo2point = 0;


// var pkg4point = 0;
// var hov3point = 0;
// var pointnow=0;


var NeighborParking = 0;

var PersentageTwoBed = 0;
var PersentageAffordHouse = 0;

var AparkingSpaceInput = 0;
var BparkingSpaceInput = 0;
var CparkingSpaceInput = 0;
var DparkingSpaceInput = 0;


//clear all
function clearallitem() {
  Cfam1point = 0;
  Cfam3point = 0;
  Ccshare1point = 0;
  $(".allpkg4").bootstrapSwitch('disabled', false);
  $(".allpkg4").bootstrapSwitch('state', false);
  $(".allpkg4").bootstrapSwitch('disabled', true);
  $(":checkbox:not(.CategoryRadio)").bootstrapSwitch('state', false);
  $("#pointtarget").html("0");
  $("#pointnow").html("0");
  $(".ProjectCharactInput").val('');
}

//parking rate json file
var parkingrate = [
  {
    "TAZ": 1,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 2,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 3,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 4,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.49,
    "": ""
  },
  {
    "TAZ": 5,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.91,
    "": ""
  },
  {
    "TAZ": 6,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.79,
    "": ""
  },
  {
    "TAZ": 7,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 4.26,
    "": ""
  },
  {
    "TAZ": 8,
    "ResParkingRateLow": 0.95,
    "NonResParkingRate": 3.24,
    "": ""
  },
  {
    "TAZ": 9,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 10,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 11,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 0.84,
    "": ""
  },
  {
    "TAZ": 12,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 4.26,
    "": ""
  },
  {
    "TAZ": 13,
    "ResParkingRateLow": 0.92,
    "NonResParkingRate": 0.97,
    "": ""
  },
  {
    "TAZ": 14,
    "ResParkingRateLow": 0.87,
    "NonResParkingRate": 1.89,
    "": ""
  },
  {
    "TAZ": 15,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.81,
    "": ""
  },
  {
    "TAZ": 16,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 2.49,
    "": ""
  },
  {
    "TAZ": 17,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.25,
    "": ""
  },
  {
    "TAZ": 18,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.75,
    "": ""
  },
  {
    "TAZ": 19,
    "ResParkingRateLow": 0.8,
    "NonResParkingRate": 0.79,
    "": ""
  },
  {
    "TAZ": 20,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 21,
    "ResParkingRateLow": 0.79,
    "NonResParkingRate": 0.97,
    "": ""
  },
  {
    "TAZ": 22,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 23,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.47,
    "": ""
  },
  {
    "TAZ": 24,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 3.92,
    "": ""
  },
  {
    "TAZ": 25,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.94,
    "": ""
  },
  {
    "TAZ": 26,
    "ResParkingRateLow": 0.93,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 27,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 2.04,
    "": ""
  },
  {
    "TAZ": 28,
    "ResParkingRateLow": 0.92,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 29,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 30,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0.88,
    "": ""
  },
  {
    "TAZ": 31,
    "ResParkingRateLow": 0.75,
    "NonResParkingRate": 2.39,
    "": ""
  },
  {
    "TAZ": 32,
    "ResParkingRateLow": 0.82,
    "NonResParkingRate": 0.58,
    "": ""
  },
  {
    "TAZ": 33,
    "ResParkingRateLow": 0.86,
    "NonResParkingRate": 0.98,
    "": ""
  },
  {
    "TAZ": 34,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 2.66,
    "": ""
  },
  {
    "TAZ": 35,
    "ResParkingRateLow": 0.94,
    "NonResParkingRate": 1.47,
    "": ""
  },
  {
    "TAZ": 36,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0.84,
    "": ""
  },
  {
    "TAZ": 37,
    "ResParkingRateLow": 0.84,
    "NonResParkingRate": 0.44,
    "": ""
  },
  {
    "TAZ": 38,
    "ResParkingRateLow": 0.82,
    "NonResParkingRate": 0.26,
    "": ""
  },
  {
    "TAZ": 39,
    "ResParkingRateLow": 0.77,
    "NonResParkingRate": 0.28,
    "": ""
  },
  {
    "TAZ": 40,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 2.13,
    "": ""
  },
  {
    "TAZ": 41,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 1.62,
    "": ""
  },
  {
    "TAZ": 42,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 6.3,
    "": ""
  },
  {
    "TAZ": 43,
    "ResParkingRateLow": 0.87,
    "NonResParkingRate": 0.64,
    "": ""
  },
  {
    "TAZ": 44,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 1.05,
    "": ""
  },
  {
    "TAZ": 45,
    "ResParkingRateLow": 0.92,
    "NonResParkingRate": 1.77,
    "": ""
  },
  {
    "TAZ": 46,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 1.07,
    "": ""
  },
  {
    "TAZ": 47,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 1.12,
    "": ""
  },
  {
    "TAZ": 48,
    "ResParkingRateLow": 0.78,
    "NonResParkingRate": 1.02,
    "": ""
  },
  {
    "TAZ": 49,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 2.21,
    "": ""
  },
  {
    "TAZ": 50,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 51,
    "ResParkingRateLow": 0.93,
    "NonResParkingRate": 1.52,
    "": ""
  },
  {
    "TAZ": 52,
    "ResParkingRateLow": 0.75,
    "NonResParkingRate": 2.39,
    "": ""
  },
  {
    "TAZ": 53,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 2.58,
    "": ""
  },
  {
    "TAZ": 54,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 3.39,
    "": ""
  },
  {
    "TAZ": 55,
    "ResParkingRateLow": 0.75,
    "NonResParkingRate": 1.36,
    "": ""
  },
  {
    "TAZ": 56,
    "ResParkingRateLow": 0.8,
    "NonResParkingRate": 1.3,
    "": ""
  },
  {
    "TAZ": 57,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 1.37,
    "": ""
  },
  {
    "TAZ": 58,
    "ResParkingRateLow": 0.82,
    "NonResParkingRate": 0.87,
    "": ""
  },
  {
    "TAZ": 59,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 4.41,
    "": ""
  },
  {
    "TAZ": 60,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 2.08,
    "": ""
  },
  {
    "TAZ": 61,
    "ResParkingRateLow": 0.93,
    "NonResParkingRate": 0.72,
    "": ""
  },
  {
    "TAZ": 62,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 63,
    "ResParkingRateLow": 0.89,
    "NonResParkingRate": 1.45,
    "": ""
  },
  {
    "TAZ": 64,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 3.27,
    "": ""
  },
  {
    "TAZ": 65,
    "ResParkingRateLow": 0.93,
    "NonResParkingRate": 4.2,
    "": ""
  },
  {
    "TAZ": 66,
    "ResParkingRateLow": 0.82,
    "NonResParkingRate": 1.37,
    "": ""
  },
  {
    "TAZ": 67,
    "ResParkingRateLow": 0.89,
    "NonResParkingRate": 1.38,
    "": ""
  },
  {
    "TAZ": 68,
    "ResParkingRateLow": 0.8,
    "NonResParkingRate": 1.34,
    "": ""
  },
  {
    "TAZ": 69,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 70,
    "ResParkingRateLow": 0.89,
    "NonResParkingRate": 1.51,
    "": ""
  },
  {
    "TAZ": 71,
    "ResParkingRateLow": 0.9,
    "NonResParkingRate": 2.25,
    "": ""
  },
  {
    "TAZ": 72,
    "ResParkingRateLow": 0.89,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 73,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 5.29,
    "": ""
  },
  {
    "TAZ": 74,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 1,
    "": ""
  },
  {
    "TAZ": 75,
    "ResParkingRateLow": 0.88,
    "NonResParkingRate": 2.53,
    "": ""
  },
  {
    "TAZ": 76,
    "ResParkingRateLow": 0.76,
    "NonResParkingRate": 0.73,
    "": ""
  },
  {
    "TAZ": 77,
    "ResParkingRateLow": 0.82,
    "NonResParkingRate": 1.23,
    "": ""
  },
  {
    "TAZ": 78,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 1.76,
    "": ""
  },
  {
    "TAZ": 79,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0.94,
    "": ""
  },
  {
    "TAZ": 80,
    "ResParkingRateLow": 0.8,
    "NonResParkingRate": 1.28,
    "": ""
  },
  {
    "TAZ": 81,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 82,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 2.15,
    "": ""
  },
  {
    "TAZ": 83,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 84,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 85,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 86,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 0.72,
    "": ""
  },
  {
    "TAZ": 87,
    "ResParkingRateLow": 0.76,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 88,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 89,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.27,
    "": ""
  },
  {
    "TAZ": 90,
    "ResParkingRateLow": 0.72,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 91,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 1.41,
    "": ""
  },
  {
    "TAZ": 92,
    "ResParkingRateLow": 0.76,
    "NonResParkingRate": 0.55,
    "": ""
  },
  {
    "TAZ": 93,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 94,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 95,
    "ResParkingRateLow": 0.95,
    "NonResParkingRate": 2.21,
    "": ""
  },
  {
    "TAZ": 96,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 97,
    "ResParkingRateLow": 0.86,
    "NonResParkingRate": 1,
    "": ""
  },
  {
    "TAZ": 98,
    "ResParkingRateLow": 0.72,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 99,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 100,
    "ResParkingRateLow": 0.76,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 101,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 102,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 103,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.43,
    "": ""
  },
  {
    "TAZ": 104,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 105,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 106,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 107,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 108,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 109,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 110,
    "ResParkingRateLow": 0.92,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 111,
    "ResParkingRateLow": 0.94,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 112,
    "ResParkingRateLow": 0.94,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 113,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 114,
    "ResParkingRateLow": 0.71,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 115,
    "ResParkingRateLow": 0.93,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 116,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 117,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 118,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 119,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 120,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 121,
    "ResParkingRateLow": 0.9,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 122,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 123,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 124,
    "ResParkingRateLow": 0.56,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 125,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 126,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 127,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 128,
    "ResParkingRateLow": 0.53,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 129,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 130,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 131,
    "ResParkingRateLow": 0.84,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 132,
    "ResParkingRateLow": 0.88,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 133,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 134,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 135,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 136,
    "ResParkingRateLow": 0.84,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 137,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 138,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 139,
    "ResParkingRateLow": 0.56,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 140,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 141,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 142,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 143,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 144,
    "ResParkingRateLow": 0.46,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 145,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0.25,
    "": ""
  },
  {
    "TAZ": 146,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 147,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 148,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 149,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 150,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 151,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 152,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 153,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 154,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 155,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 156,
    "ResParkingRateLow": 0.45,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 157,
    "ResParkingRateLow": 0.45,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 158,
    "ResParkingRateLow": 0.45,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 159,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 160,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 161,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 162,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 163,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 164,
    "ResParkingRateLow": 0.49,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 165,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 166,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 167,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 168,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 0.24,
    "": ""
  },
  {
    "TAZ": 169,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 170,
    "ResParkingRateLow": 0.44,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 171,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 172,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 173,
    "ResParkingRateLow": 0.49,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 174,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 175,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 176,
    "ResParkingRateLow": 0.39,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 177,
    "ResParkingRateLow": 0.7,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 178,
    "ResParkingRateLow": 0.7,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 179,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 180,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 181,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 182,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 183,
    "ResParkingRateLow": 0.39,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 184,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 185,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 186,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 187,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 188,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 189,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 190,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 191,
    "ResParkingRateLow": 0.33,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 192,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 1.07,
    "": ""
  },
  {
    "TAZ": 193,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 194,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 195,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 196,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 197,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 198,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 199,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 200,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 201,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 202,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 203,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 0.89,
    "": ""
  },
  {
    "TAZ": 204,
    "ResParkingRateLow": 0.34,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 205,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 206,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 1.13,
    "": ""
  },
  {
    "TAZ": 207,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 208,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.18,
    "": ""
  },
  {
    "TAZ": 209,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 210,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.41,
    "": ""
  },
  {
    "TAZ": 211,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.15,
    "": ""
  },
  {
    "TAZ": 212,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 213,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.73,
    "": ""
  },
  {
    "TAZ": 214,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.26,
    "": ""
  },
  {
    "TAZ": 215,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 1.13,
    "": ""
  },
  {
    "TAZ": 216,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 1.43,
    "": ""
  },
  {
    "TAZ": 217,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 218,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 219,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 220,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 221,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 222,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.88,
    "": ""
  },
  {
    "TAZ": 223,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 224,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.74,
    "": ""
  },
  {
    "TAZ": 225,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.99,
    "": ""
  },
  {
    "TAZ": 226,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.99,
    "": ""
  },
  {
    "TAZ": 227,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.51,
    "": ""
  },
  {
    "TAZ": 228,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 229,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 230,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 231,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 232,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 233,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.77,
    "": ""
  },
  {
    "TAZ": 234,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 235,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 0.52,
    "": ""
  },
  {
    "TAZ": 236,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 237,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 238,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 239,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 240,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.81,
    "": ""
  },
  {
    "TAZ": 241,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.49,
    "": ""
  },
  {
    "TAZ": 242,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 243,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 244,
    "ResParkingRateLow": 0.43,
    "NonResParkingRate": 0.27,
    "": ""
  },
  {
    "TAZ": 245,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.28,
    "": ""
  },
  {
    "TAZ": 246,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 247,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 248,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 249,
    "ResParkingRateLow": 0.34,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 250,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.49,
    "": ""
  },
  {
    "TAZ": 251,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.44,
    "": ""
  },
  {
    "TAZ": 252,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.57,
    "": ""
  },
  {
    "TAZ": 253,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.33,
    "": ""
  },
  {
    "TAZ": 254,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 255,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 256,
    "ResParkingRateLow": 0.44,
    "NonResParkingRate": 0.38,
    "": ""
  },
  {
    "TAZ": 257,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 258,
    "ResParkingRateLow": 0.43,
    "NonResParkingRate": 0.31,
    "": ""
  },
  {
    "TAZ": 259,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 260,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.5,
    "": ""
  },
  {
    "TAZ": 261,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.41,
    "": ""
  },
  {
    "TAZ": 262,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 263,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.58,
    "": ""
  },
  {
    "TAZ": 264,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.18,
    "": ""
  },
  {
    "TAZ": 265,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 266,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.4,
    "": ""
  },
  {
    "TAZ": 267,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 268,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 269,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 1.94,
    "": ""
  },
  {
    "TAZ": 270,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.4,
    "": ""
  },
  {
    "TAZ": 271,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.36,
    "": ""
  },
  {
    "TAZ": 272,
    "ResParkingRateLow": 0.49,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 273,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.7,
    "": ""
  },
  {
    "TAZ": 274,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 275,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 0.29,
    "": ""
  },
  {
    "TAZ": 276,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 277,
    "ResParkingRateLow": 0.46,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 278,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 279,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.72,
    "": ""
  },
  {
    "TAZ": 280,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 281,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 0.15,
    "": ""
  },
  {
    "TAZ": 282,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.48,
    "": ""
  },
  {
    "TAZ": 283,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 284,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 285,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.31,
    "": ""
  },
  {
    "TAZ": 286,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.17,
    "": ""
  },
  {
    "TAZ": 287,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.28,
    "": ""
  },
  {
    "TAZ": 288,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.24,
    "": ""
  },
  {
    "TAZ": 289,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.3,
    "": ""
  },
  {
    "TAZ": 290,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 291,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 292,
    "ResParkingRateLow": 0.39,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 293,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.59,
    "": ""
  },
  {
    "TAZ": 294,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 295,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.86,
    "": ""
  },
  {
    "TAZ": 296,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.33,
    "": ""
  },
  {
    "TAZ": 297,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.57,
    "": ""
  },
  {
    "TAZ": 298,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 299,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 300,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 301,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 302,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.28,
    "": ""
  },
  {
    "TAZ": 303,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 304,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 306,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.7,
    "": ""
  },
  {
    "TAZ": 307,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 308,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.28,
    "": ""
  },
  {
    "TAZ": 309,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.34,
    "": ""
  },
  {
    "TAZ": 310,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.36,
    "": ""
  },
  {
    "TAZ": 311,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 312,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.5,
    "": ""
  },
  {
    "TAZ": 314,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 1.06,
    "": ""
  },
  {
    "TAZ": 315,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 1.07,
    "": ""
  },
  {
    "TAZ": 316,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.69,
    "": ""
  },
  {
    "TAZ": 317,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 318,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.14,
    "": ""
  },
  {
    "TAZ": 319,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 320,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 0.29,
    "": ""
  },
  {
    "TAZ": 321,
    "ResParkingRateLow": 0.56,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 322,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 323,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.59,
    "": ""
  },
  {
    "TAZ": 324,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.52,
    "": ""
  },
  {
    "TAZ": 325,
    "ResParkingRateLow": 0.47,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 326,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.14,
    "": ""
  },
  {
    "TAZ": 327,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 328,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 329,
    "ResParkingRateLow": 0.53,
    "NonResParkingRate": 0.33,
    "": ""
  },
  {
    "TAZ": 330,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.17,
    "": ""
  },
  {
    "TAZ": 331,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 332,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 333,
    "ResParkingRateLow": 0.18,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 334,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.23,
    "": ""
  },
  {
    "TAZ": 335,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.38,
    "": ""
  },
  {
    "TAZ": 336,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 0.18,
    "": ""
  },
  {
    "TAZ": 337,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 1.52,
    "": ""
  },
  {
    "TAZ": 338,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 0.28,
    "": ""
  },
  {
    "TAZ": 339,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 340,
    "ResParkingRateLow": 0.45,
    "NonResParkingRate": 0.23,
    "": ""
  },
  {
    "TAZ": 341,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.33,
    "": ""
  },
  {
    "TAZ": 342,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.14,
    "": ""
  },
  {
    "TAZ": 343,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.26,
    "": ""
  },
  {
    "TAZ": 344,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 345,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.34,
    "": ""
  },
  {
    "TAZ": 346,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.51,
    "": ""
  },
  {
    "TAZ": 347,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.24,
    "": ""
  },
  {
    "TAZ": 348,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.34,
    "": ""
  },
  {
    "TAZ": 349,
    "ResParkingRateLow": 0.47,
    "NonResParkingRate": 0.34,
    "": ""
  },
  {
    "TAZ": 350,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.17,
    "": ""
  },
  {
    "TAZ": 351,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 352,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 353,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 354,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 355,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 356,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 2,
    "": ""
  },
  {
    "TAZ": 357,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 358,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 359,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 360,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.34,
    "": ""
  },
  {
    "TAZ": 361,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.45,
    "": ""
  },
  {
    "TAZ": 362,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 363,
    "ResParkingRateLow": 0.33,
    "NonResParkingRate": 0.4,
    "": ""
  },
  {
    "TAZ": 364,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.5,
    "": ""
  },
  {
    "TAZ": 365,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 2.33,
    "": ""
  },
  {
    "TAZ": 366,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 367,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 368,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.4,
    "": ""
  },
  {
    "TAZ": 369,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 2.48,
    "": ""
  },
  {
    "TAZ": 370,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 371,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.59,
    "": ""
  },
  {
    "TAZ": 372,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 373,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.55,
    "": ""
  },
  {
    "TAZ": 374,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 375,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 376,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 377,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 2.8,
    "": ""
  },
  {
    "TAZ": 378,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.67,
    "": ""
  },
  {
    "TAZ": 379,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 2.44,
    "": ""
  },
  {
    "TAZ": 380,
    "ResParkingRateLow": 0.4,
    "NonResParkingRate": 0.73,
    "": ""
  },
  {
    "TAZ": 381,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.69,
    "": ""
  },
  {
    "TAZ": 382,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.58,
    "": ""
  },
  {
    "TAZ": 383,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.85,
    "": ""
  },
  {
    "TAZ": 386,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 387,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 388,
    "ResParkingRateLow": 0.86,
    "NonResParkingRate": 1.63,
    "": ""
  },
  {
    "TAZ": 389,
    "ResParkingRateLow": 0.78,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 390,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 2.88,
    "": ""
  },
  {
    "TAZ": 391,
    "ResParkingRateLow": 0.95,
    "NonResParkingRate": 2.91,
    "": ""
  },
  {
    "TAZ": 392,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 2.07,
    "": ""
  },
  {
    "TAZ": 393,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 2.26,
    "": ""
  },
  {
    "TAZ": 394,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 1,
    "": ""
  },
  {
    "TAZ": 395,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 1.63,
    "": ""
  },
  {
    "TAZ": 396,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 1.05,
    "": ""
  },
  {
    "TAZ": 397,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 1.17,
    "": ""
  },
  {
    "TAZ": 398,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 0.45,
    "": ""
  },
  {
    "TAZ": 399,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 0.63,
    "": ""
  },
  {
    "TAZ": 400,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 401,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 402,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 3.11,
    "": ""
  },
  {
    "TAZ": 403,
    "ResParkingRateLow": 0.72,
    "NonResParkingRate": 0.72,
    "": ""
  },
  {
    "TAZ": 404,
    "ResParkingRateLow": 0.81,
    "NonResParkingRate": 0.79,
    "": ""
  },
  {
    "TAZ": 405,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.44,
    "": ""
  },
  {
    "TAZ": 406,
    "ResParkingRateLow": 0.75,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 407,
    "ResParkingRateLow": 0.77,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 408,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 409,
    "ResParkingRateLow": 0.76,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 410,
    "ResParkingRateLow": 0.86,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 411,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 0.67,
    "": ""
  },
  {
    "TAZ": 412,
    "ResParkingRateLow": 0.86,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 413,
    "ResParkingRateLow": 0.81,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 414,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 415,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 416,
    "ResParkingRateLow": 0.9,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 417,
    "ResParkingRateLow": 0.93,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 418,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 419,
    "ResParkingRateLow": 0.88,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 420,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 421,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.29,
    "": ""
  },
  {
    "TAZ": 422,
    "ResParkingRateLow": 0.95,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 423,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 424,
    "ResParkingRateLow": 0.93,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 425,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 426,
    "ResParkingRateLow": 0.89,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 427,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 428,
    "ResParkingRateLow": 0.8,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 429,
    "ResParkingRateLow": 0.79,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 430,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 431,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 432,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 433,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 434,
    "ResParkingRateLow": 0.94,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 435,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 436,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 437,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 438,
    "ResParkingRateLow": 0.88,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 439,
    "ResParkingRateLow": 0.9,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 440,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 441,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 442,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 443,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 1.15,
    "": ""
  },
  {
    "TAZ": 444,
    "ResParkingRateLow": 0.82,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 445,
    "ResParkingRateLow": 0.87,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 446,
    "ResParkingRateLow": 0.93,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 447,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 448,
    "ResParkingRateLow": 0.71,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 449,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 450,
    "ResParkingRateLow": 0.9,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 451,
    "ResParkingRateLow": 0.88,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 452,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 453,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 454,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 455,
    "ResParkingRateLow": 0.82,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 456,
    "ResParkingRateLow": 0.78,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 457,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0,
    "": ""
  },
  {
    "TAZ": 458,
    "ResParkingRateLow": 0.86,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 459,
    "ResParkingRateLow": 0.87,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 460,
    "ResParkingRateLow": 0.71,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 461,
    "ResParkingRateLow": 0.72,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 462,
    "ResParkingRateLow": 0.77,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 463,
    "ResParkingRateLow": 0.84,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 464,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 465,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 466,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 467,
    "ResParkingRateLow": 0.81,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 468,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 469,
    "ResParkingRateLow": 0.8,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 470,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 471,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 472,
    "ResParkingRateLow": 0.8,
    "NonResParkingRate": 0.18,
    "": ""
  },
  {
    "TAZ": 473,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 474,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 475,
    "ResParkingRateLow": 0.77,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 476,
    "ResParkingRateLow": 0.77,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 477,
    "ResParkingRateLow": 0.78,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 478,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 479,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 480,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 481,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 482,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.17,
    "": ""
  },
  {
    "TAZ": 483,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 484,
    "ResParkingRateLow": 0.77,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 485,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 486,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 487,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 488,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.01,
    "": ""
  },
  {
    "TAZ": 489,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 490,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 491,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 492,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 493,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 494,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 495,
    "ResParkingRateLow": 0.79,
    "NonResParkingRate": 0.02,
    "": ""
  },
  {
    "TAZ": 496,
    "ResParkingRateLow": 0.72,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 497,
    "ResParkingRateLow": 0.88,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 498,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 499,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 500,
    "ResParkingRateLow": 0.86,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 501,
    "ResParkingRateLow": 0.79,
    "NonResParkingRate": 0.15,
    "": ""
  },
  {
    "TAZ": 502,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 503,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 504,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 0.15,
    "": ""
  },
  {
    "TAZ": 505,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 506,
    "ResParkingRateLow": 0.73,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 507,
    "ResParkingRateLow": 0.75,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 508,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 509,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 510,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.23,
    "": ""
  },
  {
    "TAZ": 511,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 512,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 513,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0.15,
    "": ""
  },
  {
    "TAZ": 514,
    "ResParkingRateLow": 0.78,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 515,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 516,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 517,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 518,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 519,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 520,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 521,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 522,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 523,
    "ResParkingRateLow": 0.72,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 524,
    "ResParkingRateLow": 0.81,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 525,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 526,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 527,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 528,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 529,
    "ResParkingRateLow": 0.72,
    "NonResParkingRate": 0.91,
    "": ""
  },
  {
    "TAZ": 530,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 531,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 532,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.17,
    "": ""
  },
  {
    "TAZ": 533,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 534,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 535,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 536,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.27,
    "": ""
  },
  {
    "TAZ": 537,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 538,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 539,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 540,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 541,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 542,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.44,
    "": ""
  },
  {
    "TAZ": 543,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 544,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 545,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 546,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.44,
    "": ""
  },
  {
    "TAZ": 547,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.74,
    "": ""
  },
  {
    "TAZ": 548,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 1.26,
    "": ""
  },
  {
    "TAZ": 549,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 0.17,
    "": ""
  },
  {
    "TAZ": 550,
    "ResParkingRateLow": 0.74,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 551,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 552,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 553,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.43,
    "": ""
  },
  {
    "TAZ": 554,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 555,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 556,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.55,
    "": ""
  },
  {
    "TAZ": 557,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 558,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.27,
    "": ""
  },
  {
    "TAZ": 559,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 560,
    "ResParkingRateLow": 0.44,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 561,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.05,
    "": ""
  },
  {
    "TAZ": 562,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 563,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 564,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 565,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 566,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 567,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 568,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 569,
    "ResParkingRateLow": 0.4,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 570,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 571,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.24,
    "": ""
  },
  {
    "TAZ": 572,
    "ResParkingRateLow": 0.71,
    "NonResParkingRate": 0.33,
    "": ""
  },
  {
    "TAZ": 573,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.26,
    "": ""
  },
  {
    "TAZ": 574,
    "ResParkingRateLow": 0.43,
    "NonResParkingRate": 0.34,
    "": ""
  },
  {
    "TAZ": 575,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.26,
    "": ""
  },
  {
    "TAZ": 576,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 1.35,
    "": ""
  },
  {
    "TAZ": 577,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.34,
    "": ""
  },
  {
    "TAZ": 578,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 579,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 580,
    "ResParkingRateLow": 0.7,
    "NonResParkingRate": 2.57,
    "": ""
  },
  {
    "TAZ": 581,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.44,
    "": ""
  },
  {
    "TAZ": 582,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.31,
    "": ""
  },
  {
    "TAZ": 583,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 1.31,
    "": ""
  },
  {
    "TAZ": 584,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.8,
    "": ""
  },
  {
    "TAZ": 585,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 586,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 1.23,
    "": ""
  },
  {
    "TAZ": 587,
    "ResParkingRateLow": 0.33,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 588,
    "ResParkingRateLow": 0.33,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 589,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 590,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 591,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 592,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.04,
    "": ""
  },
  {
    "TAZ": 593,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 594,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.28,
    "": ""
  },
  {
    "TAZ": 595,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 596,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 597,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 598,
    "ResParkingRateLow": 0.33,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 599,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 600,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 601,
    "ResParkingRateLow": 0.44,
    "NonResParkingRate": 0.28,
    "": ""
  },
  {
    "TAZ": 602,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.25,
    "": ""
  },
  {
    "TAZ": 603,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.17,
    "": ""
  },
  {
    "TAZ": 604,
    "ResParkingRateLow": 0.34,
    "NonResParkingRate": 0.18,
    "": ""
  },
  {
    "TAZ": 605,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 0.25,
    "": ""
  },
  {
    "TAZ": 606,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.07,
    "": ""
  },
  {
    "TAZ": 607,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.06,
    "": ""
  },
  {
    "TAZ": 608,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 609,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 610,
    "ResParkingRateLow": 0.44,
    "NonResParkingRate": 0.14,
    "": ""
  },
  {
    "TAZ": 611,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 612,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.32,
    "": ""
  },
  {
    "TAZ": 613,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.24,
    "": ""
  },
  {
    "TAZ": 614,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 0.43,
    "": ""
  },
  {
    "TAZ": 615,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 616,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.36,
    "": ""
  },
  {
    "TAZ": 617,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.29,
    "": ""
  },
  {
    "TAZ": 618,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 619,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.09,
    "": ""
  },
  {
    "TAZ": 620,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.14,
    "": ""
  },
  {
    "TAZ": 621,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 622,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.11,
    "": ""
  },
  {
    "TAZ": 623,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 624,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.63,
    "": ""
  },
  {
    "TAZ": 625,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 626,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 627,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.16,
    "": ""
  },
  {
    "TAZ": 628,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.29,
    "": ""
  },
  {
    "TAZ": 629,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 630,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 631,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 632,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 0.63,
    "": ""
  },
  {
    "TAZ": 633,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 1.42,
    "": ""
  },
  {
    "TAZ": 634,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 635,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 636,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 637,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 638,
    "ResParkingRateLow": 0.34,
    "NonResParkingRate": 0.23,
    "": ""
  },
  {
    "TAZ": 639,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.32,
    "": ""
  },
  {
    "TAZ": 640,
    "ResParkingRateLow": 0.43,
    "NonResParkingRate": 0.81,
    "": ""
  },
  {
    "TAZ": 641,
    "ResParkingRateLow": 0.46,
    "NonResParkingRate": 0.82,
    "": ""
  },
  {
    "TAZ": 642,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 0.48,
    "": ""
  },
  {
    "TAZ": 643,
    "ResParkingRateLow": 0.44,
    "NonResParkingRate": 0.37,
    "": ""
  },
  {
    "TAZ": 644,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 0.5,
    "": ""
  },
  {
    "TAZ": 645,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.25,
    "": ""
  },
  {
    "TAZ": 646,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 647,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.1,
    "": ""
  },
  {
    "TAZ": 648,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 649,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 1.43,
    "": ""
  },
  {
    "TAZ": 650,
    "ResParkingRateLow": 0.78,
    "NonResParkingRate": 0.82,
    "": ""
  },
  {
    "TAZ": 651,
    "ResParkingRateLow": 0.73,
    "NonResParkingRate": 0.5,
    "": ""
  },
  {
    "TAZ": 652,
    "ResParkingRateLow": 0.77,
    "NonResParkingRate": 1.13,
    "": ""
  },
  {
    "TAZ": 653,
    "ResParkingRateLow": 0.81,
    "NonResParkingRate": 1.38,
    "": ""
  },
  {
    "TAZ": 654,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 1.08,
    "": ""
  },
  {
    "TAZ": 655,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.98,
    "": ""
  },
  {
    "TAZ": 656,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 657,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 658,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.33,
    "": ""
  },
  {
    "TAZ": 659,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.34,
    "": ""
  },
  {
    "TAZ": 660,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.77,
    "": ""
  },
  {
    "TAZ": 661,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.69,
    "": ""
  },
  {
    "TAZ": 662,
    "ResParkingRateLow": 0.53,
    "NonResParkingRate": 0.24,
    "": ""
  },
  {
    "TAZ": 663,
    "ResParkingRateLow": 0.56,
    "NonResParkingRate": 0.36,
    "": ""
  },
  {
    "TAZ": 664,
    "ResParkingRateLow": 0.33,
    "NonResParkingRate": 0.37,
    "": ""
  },
  {
    "TAZ": 665,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 666,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.3,
    "": ""
  },
  {
    "TAZ": 667,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 668,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.31,
    "": ""
  },
  {
    "TAZ": 669,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 670,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 671,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.21,
    "": ""
  },
  {
    "TAZ": 672,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 673,
    "ResParkingRateLow": 0.34,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 674,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 0.9,
    "": ""
  },
  {
    "TAZ": 675,
    "ResParkingRateLow": 0.67,
    "NonResParkingRate": 1.01,
    "": ""
  },
  {
    "TAZ": 676,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.77,
    "": ""
  },
  {
    "TAZ": 677,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 678,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.38,
    "": ""
  },
  {
    "TAZ": 679,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 680,
    "ResParkingRateLow": 0.47,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 681,
    "ResParkingRateLow": 0.39,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 682,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.15,
    "": ""
  },
  {
    "TAZ": 683,
    "ResParkingRateLow": 0.34,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 684,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 685,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 686,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 687,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 688,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 0.59,
    "": ""
  },
  {
    "TAZ": 689,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 2.06,
    "": ""
  },
  {
    "TAZ": 690,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 691,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 692,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.75,
    "": ""
  },
  {
    "TAZ": 693,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.76,
    "": ""
  },
  {
    "TAZ": 694,
    "ResParkingRateLow": 0.47,
    "NonResParkingRate": 1.2,
    "": ""
  },
  {
    "TAZ": 695,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.19,
    "": ""
  },
  {
    "TAZ": 696,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.13,
    "": ""
  },
  {
    "TAZ": 697,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.59,
    "": ""
  },
  {
    "TAZ": 698,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 0.37,
    "": ""
  },
  {
    "TAZ": 699,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.2,
    "": ""
  },
  {
    "TAZ": 700,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.22,
    "": ""
  },
  {
    "TAZ": 701,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.24,
    "": ""
  },
  {
    "TAZ": 702,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.4,
    "": ""
  },
  {
    "TAZ": 703,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.4,
    "": ""
  },
  {
    "TAZ": 704,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.41,
    "": ""
  },
  {
    "TAZ": 705,
    "ResParkingRateLow": 0.47,
    "NonResParkingRate": 0.15,
    "": ""
  },
  {
    "TAZ": 706,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.15,
    "": ""
  },
  {
    "TAZ": 707,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.32,
    "": ""
  },
  {
    "TAZ": 708,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.29,
    "": ""
  },
  {
    "TAZ": 709,
    "ResParkingRateLow": 0.57,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 710,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 711,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 712,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.39,
    "": ""
  },
  {
    "TAZ": 713,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.41,
    "": ""
  },
  {
    "TAZ": 714,
    "ResParkingRateLow": 0.53,
    "NonResParkingRate": 0.3,
    "": ""
  },
  {
    "TAZ": 715,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 0.3,
    "": ""
  },
  {
    "TAZ": 716,
    "ResParkingRateLow": 0.65,
    "NonResParkingRate": 1.45,
    "": ""
  },
  {
    "TAZ": 717,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 0.72,
    "": ""
  },
  {
    "TAZ": 718,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 719,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 1.87,
    "": ""
  },
  {
    "TAZ": 720,
    "ResParkingRateLow": 0.68,
    "NonResParkingRate": 1.65,
    "": ""
  },
  {
    "TAZ": 721,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 722,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.51,
    "": ""
  },
  {
    "TAZ": 723,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 1.17,
    "": ""
  },
  {
    "TAZ": 724,
    "ResParkingRateLow": 0.39,
    "NonResParkingRate": 0.7,
    "": ""
  },
  {
    "TAZ": 725,
    "ResParkingRateLow": 0.39,
    "NonResParkingRate": 1.14,
    "": ""
  },
  {
    "TAZ": 726,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.77,
    "": ""
  },
  {
    "TAZ": 727,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 1.04,
    "": ""
  },
  {
    "TAZ": 728,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.64,
    "": ""
  },
  {
    "TAZ": 729,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 0.27,
    "": ""
  },
  {
    "TAZ": 730,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.63,
    "": ""
  },
  {
    "TAZ": 731,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 732,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 733,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.4,
    "": ""
  },
  {
    "TAZ": 734,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.4,
    "": ""
  },
  {
    "TAZ": 735,
    "ResParkingRateLow": 0.18,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 736,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.41,
    "": ""
  },
  {
    "TAZ": 737,
    "ResParkingRateLow": 0.72,
    "NonResParkingRate": 2.56,
    "": ""
  },
  {
    "TAZ": 738,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 0.8,
    "": ""
  },
  {
    "TAZ": 739,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 1.19,
    "": ""
  },
  {
    "TAZ": 740,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 741,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 742,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 743,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.57,
    "": ""
  },
  {
    "TAZ": 744,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 745,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.44,
    "": ""
  },
  {
    "TAZ": 746,
    "ResParkingRateLow": 0.18,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 747,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 748,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 749,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 750,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.43,
    "": ""
  },
  {
    "TAZ": 751,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.42,
    "": ""
  },
  {
    "TAZ": 752,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.48,
    "": ""
  },
  {
    "TAZ": 753,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 754,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 755,
    "ResParkingRateLow": 0.61,
    "NonResParkingRate": 1.46,
    "": ""
  },
  {
    "TAZ": 756,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.79,
    "": ""
  },
  {
    "TAZ": 757,
    "ResParkingRateLow": 0.6,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 758,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 1.87,
    "": ""
  },
  {
    "TAZ": 759,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 1.23,
    "": ""
  },
  {
    "TAZ": 760,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.37,
    "": ""
  },
  {
    "TAZ": 761,
    "ResParkingRateLow": 0.18,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 762,
    "ResParkingRateLow": 0.44,
    "NonResParkingRate": 0.73,
    "": ""
  },
  {
    "TAZ": 763,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.72,
    "": ""
  },
  {
    "TAZ": 764,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 765,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 766,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 767,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 768,
    "ResParkingRateLow": 0.4,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 769,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.08,
    "": ""
  },
  {
    "TAZ": 770,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.14,
    "": ""
  },
  {
    "TAZ": 771,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.35,
    "": ""
  },
  {
    "TAZ": 772,
    "ResParkingRateLow": 0.18,
    "NonResParkingRate": 0.52,
    "": ""
  },
  {
    "TAZ": 773,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 774,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.64,
    "": ""
  },
  {
    "TAZ": 775,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 776,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 777,
    "ResParkingRateLow": 0.37,
    "NonResParkingRate": 0.68,
    "": ""
  },
  {
    "TAZ": 778,
    "ResParkingRateLow": 0.45,
    "NonResParkingRate": 0.68,
    "": ""
  },
  {
    "TAZ": 779,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 780,
    "ResParkingRateLow": 0.41,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 781,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 782,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.51,
    "": ""
  },
  {
    "TAZ": 783,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.5,
    "": ""
  },
  {
    "TAZ": 784,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 785,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.49,
    "": ""
  },
  {
    "TAZ": 786,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.48,
    "": ""
  },
  {
    "TAZ": 787,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.51,
    "": ""
  },
  {
    "TAZ": 788,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.5,
    "": ""
  },
  {
    "TAZ": 789,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.49,
    "": ""
  },
  {
    "TAZ": 790,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.52,
    "": ""
  },
  {
    "TAZ": 791,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 792,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.58,
    "": ""
  },
  {
    "TAZ": 793,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.55,
    "": ""
  },
  {
    "TAZ": 794,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 0.31,
    "": ""
  },
  {
    "TAZ": 795,
    "ResParkingRateLow": 0.47,
    "NonResParkingRate": 0.52,
    "": ""
  },
  {
    "TAZ": 796,
    "ResParkingRateLow": 0.49,
    "NonResParkingRate": 1.09,
    "": ""
  },
  {
    "TAZ": 797,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 798,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.55,
    "": ""
  },
  {
    "TAZ": 799,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.56,
    "": ""
  },
  {
    "TAZ": 800,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.53,
    "": ""
  },
  {
    "TAZ": 801,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.52,
    "": ""
  },
  {
    "TAZ": 802,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 803,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.53,
    "": ""
  },
  {
    "TAZ": 804,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.53,
    "": ""
  },
  {
    "TAZ": 805,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 806,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 807,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 808,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.53,
    "": ""
  },
  {
    "TAZ": 809,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.55,
    "": ""
  },
  {
    "TAZ": 810,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 811,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 812,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 813,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.55,
    "": ""
  },
  {
    "TAZ": 814,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.53,
    "": ""
  },
  {
    "TAZ": 815,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 1.08,
    "": ""
  },
  {
    "TAZ": 816,
    "ResParkingRateLow": 0.44,
    "NonResParkingRate": 0.43,
    "": ""
  },
  {
    "TAZ": 817,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 818,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.55,
    "": ""
  },
  {
    "TAZ": 819,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.68,
    "": ""
  },
  {
    "TAZ": 820,
    "ResParkingRateLow": 0.4,
    "NonResParkingRate": 0.51,
    "": ""
  },
  {
    "TAZ": 821,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.48,
    "": ""
  },
  {
    "TAZ": 822,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.57,
    "": ""
  },
  {
    "TAZ": 823,
    "ResParkingRateLow": 0.36,
    "NonResParkingRate": 0.84,
    "": ""
  },
  {
    "TAZ": 824,
    "ResParkingRateLow": 0.49,
    "NonResParkingRate": 1.95,
    "": ""
  },
  {
    "TAZ": 825,
    "ResParkingRateLow": 0.45,
    "NonResParkingRate": 0.89,
    "": ""
  },
  {
    "TAZ": 826,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.54,
    "": ""
  },
  {
    "TAZ": 827,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 828,
    "ResParkingRateLow": 0.38,
    "NonResParkingRate": 0.81,
    "": ""
  },
  {
    "TAZ": 829,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 0.92,
    "": ""
  },
  {
    "TAZ": 830,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.57,
    "": ""
  },
  {
    "TAZ": 831,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.66,
    "": ""
  },
  {
    "TAZ": 832,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.84,
    "": ""
  },
  {
    "TAZ": 833,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.82,
    "": ""
  },
  {
    "TAZ": 834,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.78,
    "": ""
  },
  {
    "TAZ": 835,
    "ResParkingRateLow": 0.4,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 836,
    "ResParkingRateLow": 0.34,
    "NonResParkingRate": 0.94,
    "": ""
  },
  {
    "TAZ": 837,
    "ResParkingRateLow": 0.33,
    "NonResParkingRate": 0.77,
    "": ""
  },
  {
    "TAZ": 838,
    "ResParkingRateLow": 0.5,
    "NonResParkingRate": 1.09,
    "": ""
  },
  {
    "TAZ": 839,
    "ResParkingRateLow": 0.43,
    "NonResParkingRate": 1.15,
    "": ""
  },
  {
    "TAZ": 840,
    "ResParkingRateLow": 0.56,
    "NonResParkingRate": 2.35,
    "": ""
  },
  {
    "TAZ": 841,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 3.32,
    "": ""
  },
  {
    "TAZ": 842,
    "ResParkingRateLow": 0.56,
    "NonResParkingRate": 2.19,
    "": ""
  },
  {
    "TAZ": 843,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.58,
    "": ""
  },
  {
    "TAZ": 844,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.98,
    "": ""
  },
  {
    "TAZ": 845,
    "ResParkingRateLow": 0.43,
    "NonResParkingRate": 0.8,
    "": ""
  },
  {
    "TAZ": 846,
    "ResParkingRateLow": 0.42,
    "NonResParkingRate": 1.14,
    "": ""
  },
  {
    "TAZ": 847,
    "ResParkingRateLow": 0.4,
    "NonResParkingRate": 1.16,
    "": ""
  },
  {
    "TAZ": 848,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.79,
    "": ""
  },
  {
    "TAZ": 849,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 850,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 1.04,
    "": ""
  },
  {
    "TAZ": 851,
    "ResParkingRateLow": 0.43,
    "NonResParkingRate": 1.06,
    "": ""
  },
  {
    "TAZ": 852,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.93,
    "": ""
  },
  {
    "TAZ": 853,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.94,
    "": ""
  },
  {
    "TAZ": 854,
    "ResParkingRateLow": 0.47,
    "NonResParkingRate": 0.77,
    "": ""
  },
  {
    "TAZ": 855,
    "ResParkingRateLow": 0.48,
    "NonResParkingRate": 1.06,
    "": ""
  },
  {
    "TAZ": 856,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 35.28,
    "": ""
  },
  {
    "TAZ": 857,
    "ResParkingRateLow": 0.66,
    "NonResParkingRate": 4.47,
    "": ""
  },
  {
    "TAZ": 858,
    "ResParkingRateLow": 0.62,
    "NonResParkingRate": 1.62,
    "": ""
  },
  {
    "TAZ": 859,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 49.08,
    "": ""
  },
  {
    "TAZ": 860,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 861,
    "ResParkingRateLow": 0.59,
    "NonResParkingRate": 13.03,
    "": ""
  },
  {
    "TAZ": 862,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 8.73,
    "": ""
  },
  {
    "TAZ": 863,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 864,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 865,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.03,
    "": ""
  },
  {
    "TAZ": 866,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 0.12,
    "": ""
  },
  {
    "TAZ": 867,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 868,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 869,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 870,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 871,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 872,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 873,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 1.05,
    "": ""
  },
  {
    "TAZ": 874,
    "ResParkingRateLow": 0.92,
    "NonResParkingRate": 1.5,
    "": ""
  },
  {
    "TAZ": 875,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.89,
    "": ""
  },
  {
    "TAZ": 876,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.43,
    "": ""
  },
  {
    "TAZ": 877,
    "ResParkingRateLow": 0.92,
    "NonResParkingRate": 5.33,
    "": ""
  },
  {
    "TAZ": 878,
    "ResParkingRateLow": 0.9,
    "NonResParkingRate": 1.54,
    "": ""
  },
  {
    "TAZ": 879,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 4.74,
    "": ""
  },
  {
    "TAZ": 880,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 2.02,
    "": ""
  },
  {
    "TAZ": 881,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 6.11,
    "": ""
  },
  {
    "TAZ": 882,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 5.86,
    "": ""
  },
  {
    "TAZ": 883,
    "ResParkingRateLow": 0.84,
    "NonResParkingRate": 2.28,
    "": ""
  },
  {
    "TAZ": 884,
    "ResParkingRateLow": 0.75,
    "NonResParkingRate": 2.39,
    "": ""
  },
  {
    "TAZ": 885,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 5.53,
    "": ""
  },
  {
    "TAZ": 886,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 6.32,
    "": ""
  },
  {
    "TAZ": 887,
    "ResParkingRateLow": 0.79,
    "NonResParkingRate": 4.2,
    "": ""
  },
  {
    "TAZ": 888,
    "ResParkingRateLow": 0.8,
    "NonResParkingRate": 3.91,
    "": ""
  },
  {
    "TAZ": 889,
    "ResParkingRateLow": 0.94,
    "NonResParkingRate": 1.9,
    "": ""
  },
  {
    "TAZ": 890,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 2.43,
    "": ""
  },
  {
    "TAZ": 891,
    "ResParkingRateLow": 0.97,
    "NonResParkingRate": 2.5,
    "": ""
  },
  {
    "TAZ": 892,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 2.5,
    "": ""
  },
  {
    "TAZ": 893,
    "ResParkingRateLow": 0.46,
    "NonResParkingRate": 10.15,
    "": ""
  },
  {
    "TAZ": 894,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 9.63,
    "": ""
  },
  {
    "TAZ": 895,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 4.16,
    "": ""
  },
  {
    "TAZ": 896,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 2.07,
    "": ""
  },
  {
    "TAZ": 897,
    "ResParkingRateLow": 0.91,
    "NonResParkingRate": 1.78,
    "": ""
  },
  {
    "TAZ": 898,
    "ResParkingRateLow": 0.94,
    "NonResParkingRate": 2.97,
    "": ""
  },
  {
    "TAZ": 899,
    "ResParkingRateLow": 0.84,
    "NonResParkingRate": 3.37,
    "": ""
  },
  {
    "TAZ": 900,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 4.01,
    "": ""
  },
  {
    "TAZ": 901,
    "ResParkingRateLow": 0.89,
    "NonResParkingRate": 2.12,
    "": ""
  },
  {
    "TAZ": 902,
    "ResParkingRateLow": 1,
    "NonResParkingRate": 1.44,
    "": ""
  },
  {
    "TAZ": 903,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 1.6,
    "": ""
  },
  {
    "TAZ": 904,
    "ResParkingRateLow": 0.94,
    "NonResParkingRate": 1.76,
    "": ""
  },
  {
    "TAZ": 905,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 2.03,
    "": ""
  },
  {
    "TAZ": 906,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 1.38,
    "": ""
  },
  {
    "TAZ": 907,
    "ResParkingRateLow": 0.76,
    "NonResParkingRate": 1.02,
    "": ""
  },
  {
    "TAZ": 908,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 2.41,
    "": ""
  },
  {
    "TAZ": 909,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 1.98,
    "": ""
  },
  {
    "TAZ": 910,
    "ResParkingRateLow": 0.83,
    "NonResParkingRate": 1.23,
    "": ""
  },
  {
    "TAZ": 911,
    "ResParkingRateLow": 0.84,
    "NonResParkingRate": 1.18,
    "": ""
  },
  {
    "TAZ": 912,
    "ResParkingRateLow": 0.85,
    "NonResParkingRate": 1.81,
    "": ""
  },
  {
    "TAZ": 913,
    "ResParkingRateLow": 0.98,
    "NonResParkingRate": 1.72,
    "": ""
  },
  {
    "TAZ": 914,
    "ResParkingRateLow": 0.95,
    "NonResParkingRate": 2.74,
    "": ""
  },
  {
    "TAZ": 915,
    "ResParkingRateLow": 0.94,
    "NonResParkingRate": 2.31,
    "": ""
  },
  {
    "TAZ": 916,
    "ResParkingRateLow": 0.99,
    "NonResParkingRate": 2.43,
    "": ""
  },
  {
    "TAZ": 917,
    "ResParkingRateLow": 0.7,
    "NonResParkingRate": 2.89,
    "": ""
  },
  {
    "TAZ": 918,
    "ResParkingRateLow": 0.96,
    "NonResParkingRate": 2.12,
    "": ""
  },
  {
    "TAZ": 919,
    "ResParkingRateLow": 0.63,
    "NonResParkingRate": 1.08,
    "": ""
  },
  {
    "TAZ": 920,
    "ResParkingRateLow": 0.64,
    "NonResParkingRate": 0.93,
    "": ""
  },
  {
    "TAZ": 921,
    "ResParkingRateLow": 0.47,
    "NonResParkingRate": 0.3,
    "": ""
  },
  {
    "TAZ": 922,
    "ResParkingRateLow": 0.73,
    "NonResParkingRate": 2.08,
    "": ""
  },
  {
    "TAZ": 923,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.69,
    "": ""
  },
  {
    "TAZ": 924,
    "ResParkingRateLow": 0.49,
    "NonResParkingRate": 0.67,
    "": ""
  },
  {
    "TAZ": 925,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 0.41,
    "": ""
  },
  {
    "TAZ": 926,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 0.67,
    "": ""
  },
  {
    "TAZ": 927,
    "ResParkingRateLow": 0.73,
    "NonResParkingRate": 0.95,
    "": ""
  },
  {
    "TAZ": 928,
    "ResParkingRateLow": 0.69,
    "NonResParkingRate": 0.67,
    "": ""
  },
  {
    "TAZ": 929,
    "ResParkingRateLow": 0.84,
    "NonResParkingRate": 0.85,
    "": ""
  },
  {
    "TAZ": 930,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 931,
    "ResParkingRateLow": 0.2,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 932,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 933,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 934,
    "ResParkingRateLow": 0.19,
    "NonResParkingRate": 0.46,
    "": ""
  },
  {
    "TAZ": 935,
    "ResParkingRateLow": 0.18,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 936,
    "ResParkingRateLow": 0.23,
    "NonResParkingRate": 0.49,
    "": ""
  },
  {
    "TAZ": 937,
    "ResParkingRateLow": 0.22,
    "NonResParkingRate": 0.49,
    "": ""
  },
  {
    "TAZ": 938,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.47,
    "": ""
  },
  {
    "TAZ": 939,
    "ResParkingRateLow": 0.21,
    "NonResParkingRate": 0.5,
    "": ""
  },
  {
    "TAZ": 940,
    "ResParkingRateLow": 0.24,
    "NonResParkingRate": 0.6,
    "": ""
  },
  {
    "TAZ": 941,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 942,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 943,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.64,
    "": ""
  },
  {
    "TAZ": 944,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 945,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.64,
    "": ""
  },
  {
    "TAZ": 946,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.63,
    "": ""
  },
  {
    "TAZ": 947,
    "ResParkingRateLow": 0.27,
    "NonResParkingRate": 0.61,
    "": ""
  },
  {
    "TAZ": 948,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 949,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 950,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.62,
    "": ""
  },
  {
    "TAZ": 951,
    "ResParkingRateLow": 0.3,
    "NonResParkingRate": 0.64,
    "": ""
  },
  {
    "TAZ": 952,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 953,
    "ResParkingRateLow": 0.28,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 954,
    "ResParkingRateLow": 0.32,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 955,
    "ResParkingRateLow": 0.31,
    "NonResParkingRate": 0.65,
    "": ""
  },
  {
    "TAZ": 956,
    "ResParkingRateLow": 0.25,
    "NonResParkingRate": 0.53,
    "": ""
  },
  {
    "TAZ": 957,
    "ResParkingRateLow": 0.26,
    "NonResParkingRate": 0.52,
    "": ""
  },
  {
    "TAZ": 958,
    "ResParkingRateLow": 0.29,
    "NonResParkingRate": 0.53,
    "": ""
  },
  {
    "TAZ": 959,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 960,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 961,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 962,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 963,
    "ResParkingRateLow": 0.18,
    "NonResParkingRate": 20.17,
    "": ""
  },
  {
    "TAZ": 964,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 10.69,
    "": ""
  },
  {
    "TAZ": 965,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 10.06,
    "": ""
  },
  {
    "TAZ": 966,
    "ResParkingRateLow": 0.54,
    "NonResParkingRate": 5.57,
    "": ""
  },
  {
    "TAZ": 967,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 11.82,
    "": ""
  },
  {
    "TAZ": 968,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 969,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 970,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 971,
    "ResParkingRateLow": 0.51,
    "NonResParkingRate": 17.76,
    "": ""
  },
  {
    "TAZ": 972,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 973,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 8.8,
    "": ""
  },
  {
    "TAZ": 974,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 975,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 976,
    "ResParkingRateLow": 0.55,
    "NonResParkingRate": 6.13,
    "": ""
  },
  {
    "TAZ": 977,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 978,
    "ResParkingRateLow": 0.52,
    "NonResParkingRate": 850.26,
    "": ""
  },
  {
    "TAZ": 979,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 980,
    "ResParkingRateLow": 0.58,
    "NonResParkingRate": 1.7,
    "": ""
  },
  {
    "TAZ": 981,
    "ResParkingRateLow": 0.35,
    "NonResParkingRate": 0.63,
    "": ""
  }
]


//point panel scroll function
if(!isMobile.any()) {
  $("#scrolldiv").affix({
    offset: {
      top: function () {
        return ($("#measurediv").offset().top);
      }
    }
  });
}



//open or hide the category choice
$(".form-type1").hide();
$("#Atype").show();
$(".AllMeasure").hide();
$("#AtypeMeasure").show();
$(".allpointdiv").hide();
$("#Apointdiv").show();

$("#radios-0").change(function () {

  if ($(this).is(":checked")) {
    $("#AtypeMeasure").show(500);
    $("#Atype").show(500);
    $("#Apointdiv").show(500);
    $("#Aprojecttype").prop("checked", true);
  }
  else {
    $("#AtypeMeasure").hide(500);
    $("#Atype").hide(500);
    $("#Apointdiv").hide(500);
    $("#Aprojecttype").prop("checked", false);
  }
  if(!isMobile.any()) {
    $("#scrolldiv").affix({
      offset: {
        top: function () {
          return ($("#measurediv").offset().top);
        }
      }
    });
  }

});


$("#radios-1").change(function () {
  if ($(this).is(":checked")) {
    $("#BtypeMeasure").show(500);
    $("#Btype").show(500);
    $("#Bpointdiv").show(500);
    $("#Bprojecttype").prop("checked", true);
  }
  else {
    $("#BtypeMeasure").hide(500);
    $("#Btype").hide(500);
    $("#Bpointdiv").hide(500);
    $("#Bprojecttype").prop("checked", false);
  }
  if(!isMobile.any()) {
    $("#scrolldiv").affix({
      offset: {
        top: function () {
          return ($("#measurediv").offset().top);
        }
      }
    });
  }

});


$("#radios-2").change(function () {
  if ($(this).is(":checked")) {
    $("#CtypeMeasure").show(500);
    $("#Ctype").show(500);
    $("#Cpointdiv").show(500);
    $("#Cprojecttype").prop("checked", true);
  }
  else {
    $("#CtypeMeasure").hide(500);
    $("#Ctype").hide(500);
    $("#Cpointdiv").hide(500);
    $("#Cprojecttype").prop("checked", false);
  }
  if(!isMobile.any()) {
    $("#scrolldiv").affix({
      offset: {
        top: function () {
          return ($("#measurediv").offset().top);
        }
      }
    });
  }

});


$("#radios-3").change(function () {
  if ($(this).is(":checked")) {
    $("#DtypeMeasure").show(500);
    $("#Dtype").show(500);
    $("#Dpointdiv").show(500);
    $("#Dprojecttype").prop("checked", true);
  }
  else {
    $("#DtypeMeasure").hide(500);
    $("#Dtype").hide(500);
    $("#Dpointdiv").hide(500);
    $("#Dprojecttype").prop("checked", false);
  }
  if(!isMobile.any()) {
    $("#scrolldiv").affix({
      offset: {
        top: function () {
          return ($("#measurediv").offset().top);
        }
      }
    });
  }

});


//start bootstrapSwitch to change checkbox to button style
$(":checkbox:not(.CategoryRadio,.Cfam1Opt)").bootstrapSwitch();


//Disable button

//A measure group
$('#Apkg4').bootstrapSwitch('disabled', true);

$('.OptButtion').prop("disabled", true);

$('#Ainfo3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ainfo3').bootstrapSwitch("state") === false) {
    $('.Ainfo3Opt').prop("disabled", true);
  }
  else {
    $('.Ainfo3Opt').prop("disabled", false);
  }
});


$('#Aact1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact1').bootstrapSwitch("state") === false) {
    $('.Aact1Opt').prop("disabled", true);
  }
  else {
    $('.Aact1Opt').prop("disabled", false);
  }
});

$('#Aact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact2').bootstrapSwitch("state") === false) {
    $('.Aact2Opt').prop("disabled", true);
  }
  else {
    $('.Aact2Opt').prop("disabled", false);
  }
});

$('#Aact4').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact4').bootstrapSwitch("state") === false) {
    $('.Aact4Opt').prop("disabled", true);
  }
  else {
    $('.Aact4Opt').prop("disabled", false);
  }
});

$('#Acshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Acshare1').bootstrapSwitch("state") === false) {
    $('.Acshare1Opt').prop("disabled", true);
  }
  else {
    $('.Acshare1Opt').prop("disabled", false);
  }
});

$('#Ahov1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ahov1').bootstrapSwitch("state") === false) {
    $('.Ahov1Opt').prop("disabled", true);
  }
  else {
    $('.Ahov1Opt').prop("disabled", false);
  }
});

$('#Ahov2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ahov2').bootstrapSwitch("state") === false) {
    $('.Ahov2Opt').prop("disabled", true);
  }
  else {
    $('.Ahov2Opt').prop("disabled", false);
  }
});


//B measure group

$('#Binfo3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Binfo3').bootstrapSwitch("state") === false) {
    $('.Binfo3Opt').prop("disabled", true);
  }
  else {
    $('.Binfo3Opt').prop("disabled", false);
  }
});


$('#Bact1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact1').bootstrapSwitch("state") === false) {
    $('.Bact1Opt').prop("disabled", true);
  }
  else {
    $('.Bact1Opt').prop("disabled", false);
  }
});

$('#Bact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact2').bootstrapSwitch("state") === false) {
    $('.Bact2Opt').prop("disabled", true);
  }
  else {
    $('.Bact2Opt').prop("disabled", false);
  }
});

$('#Bact4').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact4').bootstrapSwitch("state") === false) {
    $('.Bact4Opt').prop("disabled", true);
  }
  else {
    $('.Bact4Opt').prop("disabled", false);
  }
});

$('#Bcshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bcshare1').bootstrapSwitch("state") === false) {
    $('.Bcshare1Opt').prop("disabled", true);
  }
  else {
    $('.Bcshare1Opt').prop("disabled", false);
  }
});

$('#Bhov1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bhov1').bootstrapSwitch("state") === false) {
    $('.Bhov1Opt').prop("disabled", true);
  }
  else {
    $('.Bhov1Opt').prop("disabled", false);
  }
});

$('#Bhov2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bhov2').bootstrapSwitch("state") === false) {
    $('.Bhov2Opt').prop("disabled", true);
  }
  else {
    $('.Bhov2Opt').prop("disabled", false);
  }
});


//C measure group

$('#Cfam1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cfam1').bootstrapSwitch("state") === false) {
    $('.Cfam1Opt').prop("disabled", true);
  }
  else {
    $('.Cfam1Opt').prop("disabled", false);
  }
});

$('#Cinfo3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cinfo3').bootstrapSwitch("state") === false) {
    $('.Cinfo3Opt').prop("disabled", true);
  }
  else {
    $('.Cinfo3Opt').prop("disabled", false);
  }
});


$('#Cact1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact1').bootstrapSwitch("state") === false) {
    $('.Cact1Opt').prop("disabled", true);
  }
  else {
    $('.Cact1Opt').prop("disabled", false);
  }
});

$('#Cact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact2').bootstrapSwitch("state") === false) {
    $('.Cact2Opt').prop("disabled", true);
  }
  else {
    $('.Cact2Opt').prop("disabled", false);
  }
});

$('#Cact4').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact4').bootstrapSwitch("state") === false) {
    $('.Cact4Opt').prop("disabled", true);
  }
  else {
    $('.Cact4Opt').prop("disabled", false);
  }
});

$('#Ccshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ccshare1').bootstrapSwitch("state") === false) {
    $('.Ccshare1Opt').prop("disabled", true);
  }
  else {
    $('.Ccshare1Opt').prop("disabled", false);
  }
});

$('#Chov1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Chov1').bootstrapSwitch("state") === false) {
    $('.Chov1Opt').prop("disabled", true);
  }
  else {
    $('.Chov1Opt').prop("disabled", false);
  }
});

$('#Chov2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Chov2').bootstrapSwitch("state") === false) {
    $('.Chov2Opt').prop("disabled", true);
  }
  else {
    $('.Chov2Opt').prop("disabled", false);
  }
});

$('#Clu2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Clu2').bootstrapSwitch("state") === false) {
    $('.Clu2Opt').prop("disabled", true);
  }
  else {
    $('.Clu2Opt').prop("disabled", false);
  }
});


//D measure group
$('#Dact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Dact2').bootstrapSwitch("state") === false) {
    $('.Dact2Opt').prop("disabled", true);
  }
  else {
    $('.Dact2Opt').prop("disabled", false);
  }
});


$('#Dcshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Dcshare1').bootstrapSwitch("state") === false) {
    $('.Dcshare1Opt').prop("disabled", true);
  }
  else {
    $('.Dcshare1Opt').prop("disabled", false);
  }
});


//Calculate A targetPoint
var Abasepoint = 13;
$("#AparkingInput").on("input", function (e) {
  AparkingSpaceInput = $("#AparkingInput").val();
  if (AparkingSpaceInput < 0) {
    Atargetpoint = 0;
    alert("Your input of Accessory Parking Spaces is not valid. It should be greater than or equal to 0");
    $("#Atargetpoint").html("not valid");
  }


  if (AparkingSpaceInput <= 4 & AparkingSpaceInput >= 0) {
    Atargetpoint = Abasepoint;
    $("#Atargetpoint").html(Atargetpoint.toString());
  }

  if (AparkingSpaceInput <= 116 & AparkingSpaceInput > 4) {
    Atargetpoint = Abasepoint + Math.ceil(AparkingSpaceInput / 2) - 2;
    $("#Atargetpoint").html(Atargetpoint.toString());
  }

  if (AparkingSpaceInput > 116) {
    Atargetpoint = Abasepoint + 57;
    $("#Atargetpoint").html(Atargetpoint.toString());
  }
  $("#AtargetPointTodatabase").val(Atargetpoint.toString());
});


//BtargetPoint
var Bbasepoint = 13;
$("#BparkingInput").on("input", function (e) {
  var BparkingSpaceInput = $("#BparkingInput").val();


  if (BparkingSpaceInput < 0) {
    Btargetpoint = 0;
    alert("Your input of Accessory Parking Spaces is not valid. It should be greater than or equal to 0");
    $("#Btargetpoint").html("not valid");
  }


  if (BparkingSpaceInput <= 20 & BparkingSpaceInput >= 0) {
    Btargetpoint = Bbasepoint;
    $("#Btargetpoint").html(Btargetpoint.toString());
  }

  if (BparkingSpaceInput <= 540 & BparkingSpaceInput > 20) {
    Btargetpoint = Bbasepoint + Math.ceil(BparkingSpaceInput / 10) - 2;
    $("#Btargetpoint").html(Btargetpoint.toString());
  }


  if (BparkingSpaceInput > 540) {
    Btargetpoint = Bbasepoint + 53;
    $("#Btargetpoint").html(Btargetpoint.toString());
  }

});


//CtargetPoint
var Cbasepoint = 13;
$("#CparkingInput").on("input", function (e) {
  var CparkingSpaceInput = $("#CparkingInput").val();


  if (CparkingSpaceInput < 0) {
    Ctargetpoint = 0;
    alert("Your input of Accessory Parking Spaces is not valid. It should be greater than or equal to 0");
    $("#Ctargetpoint").html("not valid");
  }


  if (CparkingSpaceInput <= 20 & CparkingSpaceInput >= 0) {
    Ctargetpoint = Cbasepoint;
    $("#Ctargetpoint").html(Ctargetpoint.toString());
  }

  if (CparkingSpaceInput <= 570 & CparkingSpaceInput > 20) {
    Ctargetpoint = Cbasepoint + Math.ceil(CparkingSpaceInput / 10) - 2;
    $("#Ctargetpoint").html(Ctargetpoint.toString());
  }


  if (CparkingSpaceInput > 570) {
    Ctargetpoint = Cbasepoint + 56;
    $("#Ctargetpoint").html(Ctargetpoint.toString());
  }

});


//DtargetPoint
Dtargetpoint = 3;
$("#Dtargetpoint").html(Dtargetpoint.toString());


//Calculate current point
//Apkg1

$("#TAZinput").change(function () {
  var iffind = 0;
  var tazinput = $(this).text();
  $.each(parkingrate, function (i, v) {
    if (v.TAZ == tazinput) {
      $("#Apkg1rate").html(v.NonResParkingRate);
      NeighborParking = v.NonResParkingRate;
      if (NeighborParking > 1.4) {
        $("#Apkg1loc").html("A");
      }
      if (NeighborParking <= 1.4 & NeighborParking > 1) {
        $("#Apkg1loc").html("B");
      }
      if (NeighborParking > 0.6 & NeighborParking <= 1) {
        $("#Apkg1loc").html("C");
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.6) {
        $("#Apkg1loc").html("D");
      }
      if (NeighborParking <= 0.2) {
        $("#Apkg1loc").html("E");
      }

      iffind = 1;
      return;
    }

    if (iffind === 0) {
      $("#Apkg1rate").html("TAZ error");
    }
  })
  updateApkg1();
});

$('#Apkg1').on('switchChange.bootstrapSwitch', function (event, state) {
  updateApkg1();
});

function updateApkg1() {
  if ($('#Apkg1').bootstrapSwitch("state") === true) {
    if ($('#AparkingInput').val() <= 0 | $('#AparkingInput').val() === "") {
      Apkg1point = 0;
    }
    else {
      if (NeighborParking > 1.4) {
        Apkg1point = 1;
      }
      if (NeighborParking > 1 & NeighborParking <= 1.4) {
        Apkg1point = 2;
      }
      if (NeighborParking > 0.6 & NeighborParking <= 1) {
        Apkg1point = 3;
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.6) {
        Apkg1point = 4;
      }
      if (NeighborParking > 0 & NeighborParking <= 0.2) {
        Apkg1point = 5;
      }
    }
    $('#Apkg1pointdiv').html('+' + Apkg1point);
  }
  else {
    Apkg1point = 0;
    $('#Apkg1pointdiv').html('');
  }
  UpdateCurPoint();
}


//Apkg2
$('#Apkg2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Apkg2').bootstrapSwitch("state") === true) {
    Apkg2point = 2;
    $('#Apkg2pointdiv').html('+' + Apkg2point);

  }
  else {
    Apkg2point = 0;
    $('#Apkg2pointdiv').html('');

  }
  UpdateCurPoint();

});


//Apkg3
$('#Apkg3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Apkg3').bootstrapSwitch("state") === true) {
    Apkg3point = 2;
    $('#Apkg3pointdiv').html('+' + Apkg3point);
  }
  else {
    Apkg3point = 0;
    $('#Apkg3pointdiv').html('');
  }

});

//Apkg4
//Change Neighborhood Parking Rate, Project parking rate and location category based on input
var AOccupiedArea = 0;
var AProjectParkRate = 0;

$("#TAZinput").change("input", function (e) {
  $("#Apkg4rate").html(NeighborParking.toString());
  AupdateProjectParking();
  updateApkg4();
})

$("#AoccupyareaInput").on("input", function (e) {
  AOccupiedArea = $("#AoccupyareaInput").val();
  AupdateProjectParking();
  updateApkg4();
})

$("#AparkingInput").on("input", function (e) {
  AparkingSpaceInput = $("#AparkingInput").val();
  AupdateProjectParking();
  updateApkg4();
})

function AupdateProjectParking() {
  AProjectParkRate = AparkingSpaceInput / (AOccupiedArea / 1000);
  $("#Apkg4projectrate").html(AProjectParkRate.toFixed(2).toString());
}


function updateApkg4() {
  if (AProjectParkRate > NeighborParking) {
    Apkg4point = 0;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', false);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Parked > neighborhood rate");

  }
  if (AProjectParkRate === 0) {
    Apkg4point = 11;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option K");
  }
  if ((AProjectParkRate <= NeighborParking * 0.1) && (AProjectParkRate > 0)) {
    Apkg4point = 10;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option J");
  }
  if (AProjectParkRate <= NeighborParking * 0.2 && AProjectParkRate > NeighborParking * 0.1) {
    Apkg4point = 9;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option I");
  }
  if (AProjectParkRate <= (NeighborParking * 0.3) && AProjectParkRate > (NeighborParking * 0.2)) {
    Apkg4point = 8;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option H");
  }
  if (AProjectParkRate <= (NeighborParking * 0.4) && AProjectParkRate > (NeighborParking * 0.3)) {
    Apkg4point = 7;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option G");
  }
  if (AProjectParkRate <= (NeighborParking * 0.5) && AProjectParkRate > (NeighborParking * 0.4)) {
    Apkg4point = 6;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option F");
  }
  if (AProjectParkRate <= (NeighborParking * 0.6) && AProjectParkRate > (NeighborParking * 0.5)) {
    Apkg4point = 5;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option E");
  }
  if (AProjectParkRate <= (NeighborParking * 0.7) && AProjectParkRate > (NeighborParking * 0.6)) {
    Apkg4point = 4;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option D");
  }
  if (AProjectParkRate <= (NeighborParking * 0.8) && AProjectParkRate > (NeighborParking * 0.7)) {
    Apkg4point = 3;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option C");

  }
  if (AProjectParkRate <= (NeighborParking * 0.9) && AProjectParkRate > (NeighborParking * 0.8)) {
    Apkg4point = 2;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option B");

  }
  if (AProjectParkRate <= (NeighborParking * 1) && AProjectParkRate > (NeighborParking * 0.9)) {
    Apkg4point = 1;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option A");

  }
  UpdateCurPoint();
}


//Aact1
$('#Aact1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact1').bootstrapSwitch("state") === false) {
    $('.Aact1Opt').prop('checked', false);
    Aact1point = 0;
    $('#Aact1pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Aact1Opt').change(function () {
  switch ($("input[class = Aact1Opt]:checked").val()) {
    case "1":
      Aact1point = 1;
      $('#Aact1pointdiv').html('+' + Aact1point);
      UpdateCurPoint();
      break;
    case "2":
      Aact1point = 1;
      $('#Aact1pointdiv').html('+' + Aact1point);
      UpdateCurPoint();
      break;
  }
  ;
});


//Aact2
$('#Aact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact2').bootstrapSwitch("state") === false) {
    $('.Aact2Opt').prop('checked', false);
    Aact2point = 0;
    $('#Aact2pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Aact2Opt').change(function () {
  switch ($("input[class = Aact2Opt]:checked").val()) {
    case "1":
      Aact2point = 1;
      $('#Aact2pointdiv').html('+' + Aact2point);
      UpdateCurPoint();
      break;
    case "2":
      Aact2point = 2;
      $('#Aact2pointdiv').html('+' + Aact2point);
      UpdateCurPoint();
      break;
    case "3":
      Aact2point = 3;
      $('#Aact2pointdiv').html('+' + Aact2point);
      UpdateCurPoint();
      break;
    case "4":
      Aact2point = 4;
      $('#Aact2pointdiv').html('+' + Aact2point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});

//Aact3
$('#Aact3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact3').bootstrapSwitch("state") === true) {
    Aact3point = 1;
    $('#Aact3pointdiv').html('+' + Aact3point);
    UpdateCurPoint();
  }
  else {
    Aact3point = 0;
    $('#Aact3pointdiv').html('');
    UpdateCurPoint();
  }

});

//Aact4
$('#Aact4').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact4').bootstrapSwitch("state") === false) {
    $('.Aact4Opt').prop('checked', false);
    Aact4point = 0;
    $('#Aact4pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Aact4Opt').change(function () {
  switch ($("input[class = Aact4Opt]:checked").val()) {
    case "1":
      Aact4point = 1;
      $('#Aact4pointdiv').html('+' + Aact4point);
      UpdateCurPoint();
      break;
    case "2":
      Aact4point = 2;
      $('#Aact4pointdiv').html('+' + Aact4point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});

//Aact5a
$('#Aact5a').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact5a').bootstrapSwitch("state") === true) {
    Aact5apoint = 1;
    $('#Aact5apointdiv').html('+' + Aact5apoint);
    UpdateCurPoint();
  }
  else {
    Aact5apoint = 0;
    $('#Aact5apointdiv').html('');
    UpdateCurPoint();
  }

});

//Aact5b
$('#Aact5b').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact5b').bootstrapSwitch("state") === true) {
    Aact5bpoint = 1;
    $('#Aact5bpointdiv').html('+' + Aact5bpoint);
    UpdateCurPoint();
  }
  else {
    Aact5bpoint = 0;
    $('#Aact5bpointdiv').html('');
    UpdateCurPoint();
  }

});

//Aact6
$('#Aact6').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact6').bootstrapSwitch("state") === true) {
    Aact6point = 1;
    $('#Aact6pointdiv').html('+' + Aact6point);
    UpdateCurPoint();
  }
  else {
    Aact6point = 0;
    $('#Aact6pointdiv').html('');
    UpdateCurPoint();
  }

});

//Aact7
$('#Aact7').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact7').bootstrapSwitch("state") === true) {
    Aact7point = 1;
    $('#Aact7pointdiv').html('+' + Aact7point);
    UpdateCurPoint();
  }
  else {
    Aact7point = 0;
    $('#Aact7pointdiv').html('');
    UpdateCurPoint();
  }

});


//Acshare1
$('#Acshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Acshare1').bootstrapSwitch("state") === false) {
    $('.Acshare1Opt').prop('checked', false);
    Acshare1point = 0;
    $('#Acshare1pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Acshare1Opt').change(function () {
  switch ($("input[class = Acshare1Opt]:checked").val()) {
    case "1":
      Acshare1point = 1;
      $('#Acshare1pointdiv').html('+' + Acshare1point);
      UpdateCurPoint();
      break;
    case "2":
      Acshare1point = 2;
      $('#Acshare1pointdiv').html('+' + Acshare1point);
      UpdateCurPoint();
      break;
    case "3":
      Acshare1point = 3;
      $('#Acshare1pointdiv').html('+' + Acshare1point);
      UpdateCurPoint();
      break;
    case "4":
      Acshare1point = 4;
      $('#Acshare1pointdiv').html('+' + Acshare1point);
      UpdateCurPoint();
      break;
    case "5":
      Acshare1point = 5;
      $('#Acshare1pointdiv').html('+' + Acshare1point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});


//Adeli1
$('#Adeli1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Adeli1').bootstrapSwitch("state") === true) {
    Adeli1point = 1;
    $('#Adeli1pointdiv').html('+' + Adeli1point);
    UpdateCurPoint();
  }
  else {
    Adeli1point = 0;
    $('#Adeli1pointdiv').html('');
    UpdateCurPoint();
  }

});


//Adeli2
$('#Adeli2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Adeli2').bootstrapSwitch("state") === true) {
    Adeli2point = 1;
    $('#Adeli2pointdiv').html('+' + Adeli2point);
    UpdateCurPoint();
  }
  else {
    Adeli2point = 0;
    $('#Adeli2pointdiv').html('');
    UpdateCurPoint();
  }

});

//Afam2
$('#Afam2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Afam2').bootstrapSwitch("state") === true) {
    Afam2point = 2;
    $('#Afam2pointdiv').html('+' + Afam2point);
    UpdateCurPoint();
  }
  else {
    Afam2point = 0;
    $('#Afam2pointdiv').html('');
    UpdateCurPoint();
  }

});


//Ahov1
$('#Ahov1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ahov1').bootstrapSwitch("state") === false) {
    $('.Ahov1Opt').prop('checked', false);
    Ahov1point = 0;
    $('#Ahov1pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Ahov1Opt').change(function () {
  switch ($("input[class = Ahov1Opt]:checked").val()) {
    case "1":
      Ahov1point = 2;
      $('#Ahov1pointdiv').html('+' + Ahov1point);
      UpdateCurPoint();
      break;
    case "2":
      Ahov1point = 4;
      $('#Ahov1pointdiv').html('+' + Ahov1point);
      UpdateCurPoint();
      break;
    case "3":
      Ahov1point = 6;
      $('#Ahov1pointdiv').html('+' + Ahov1point);
      UpdateCurPoint();
      break;
    case "4":
      Ahov1point = 8;
      $('#Ahov1pointdiv').html('+' + Ahov1point);
      UpdateCurPoint();
      break;
    default:

  }
  ;

});


//Ahov2
$('#Ahov2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ahov2').bootstrapSwitch("state") === false) {
    $('.Ahov2Opt').prop('checked', false);
    Ahov2point = 0;
    $('#Ahov2pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Ahov2Opt').change(function () {
  switch ($("input[class = Ahov2Opt]:checked").val()) {
    case "1":
      Ahov2point = 7;
      $('#Ahov2pointdiv').html('+' + Ahov2point);
      UpdateCurPoint();
      break;
    case "2":
      Ahov2point = 14;
      $('#Ahov2pointdiv').html('+' + Ahov2point);
      UpdateCurPoint();
      break;
    default:
      alert("no value")
  }
  ;

});


//Ahov3
$("#AgrossareaInput").on("input", function (e) {
  updateAhov3();
});


$('#Ahov3').on('switchChange.bootstrapSwitch', function (event, state) {
  updateAhov3();
});

function updateAhov3() {
  var AgrossareaInput = $("#AgrossareaInput").val();
  console.log(AgrossareaInput);
  if ($('#Ahov3').bootstrapSwitch("state") === true) {
    if (AgrossareaInput < 100000) {
      $('#Ahov3Opt').html("Option A");
      Ahov3point = 1;
      $('#Ahov3pointdiv').html('+' + Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 100000 & AgrossareaInput < 200000) {
      $('#Ahov3Opt').html("Option B");
      Ahov3point = 2;
      $('#Ahov3pointdiv').html('+' + Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 200000 & AgrossareaInput < 300000) {
      $('#Ahov3Opt').html("Option C");
      Ahov3point = 3;
      $('#Ahov3pointdiv').html('+' + Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 300000 & AgrossareaInput < 400000) {
      $('#Ahov3Opt').html("Option D");
      Ahov3point = 4;
      $('#Ahov3pointdiv').html('+' + Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 400000 & AgrossareaInput < 500000) {
      $('#Ahov3Opt').html("Option E");
      Ahov3point = 5;
      $('#Ahov3pointdiv').html('+' + Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 500000 & AgrossareaInput < 600000) {
      $('#Ahov3Opt').html("Option F");
      Ahov3point = 6;
      $('#Ahov3pointdiv').html('+' + Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 600000) {
      $('#Ahov3Opt').html("Option G");
      Ahov3point = 7;
      $('#Ahov3pointdiv').html('+' + Ahov3point);
      UpdateCurPoint();
    }


  }
  else {
    Ahov3point = 0;
    $('#Ahov3Opt').html("")
    UpdateCurPoint();
  }


}

//Ainfo1
$('#Ainfo1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ainfo1').bootstrapSwitch("state") === true) {
    Ainfo1point = 1;
    $('#Ainfo1pointdiv').html('+' + Ainfo1point);
    UpdateCurPoint();
  }
  else {
    Ainfo1point = 0;
    $('#Ainfo1pointdiv').html('');
    UpdateCurPoint();
  }

});

//Ainfo2
$('#Ainfo2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ainfo2').bootstrapSwitch("state") === true) {
    Ainfo2point = 1;
    $('#Ainfo2pointdiv').html('+' + Ainfo2point);
    UpdateCurPoint();
  }
  else {
    Ainfo2point = 0;
    $('#Ainfo2pointdiv').html('');
    UpdateCurPoint();
  }

});


//Ainfo3
$('#Ainfo3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ainfo3').bootstrapSwitch("state") === false) {
    $('.Ainfo3Opt').prop('checked', false);
    Ainfo3point = 0;
    $('#Ainfo3pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Ainfo3Opt').change(function () {
  switch ($("input[class = Ainfo3Opt]:checked").val()) {
    case "1":
      Ainfo3point = 1;
      $('#Ainfo3pointdiv').html('+' + Ainfo3point);
      UpdateCurPoint();
      break;
    case "2":
      Ainfo3point = 2;
      $('#Ainfo3pointdiv').html('+' + Ainfo3point);
      UpdateCurPoint();
      break;
    case "3":
      Ainfo3point = 3;
      $('#Ainfo3pointdiv').html('+' + Ainfo3point);
      UpdateCurPoint();
      break;
    case "4":
      Ainfo3point = 4;
      $('#Ainfo3pointdiv').html('+' + Ainfo3point);
      UpdateCurPoint();
      break;
    default:

  }
  ;

});


//Alu1
$('#Alu1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Alu1').bootstrapSwitch("state") === true) {
    Alu1point = 1;
    $('#Alu1pointdiv').html('+' + Alu1point);
    UpdateCurPoint();
  }
  else {
    Alu1point = 0;
    $('#Alu1pointdiv').html('');
    UpdateCurPoint();
  }

});


//Bpkg1
//Change Neighborhood Parking Rate and location category based on input
$("#TAZinput").change("input", function (e) {
  var iffind = 0;
  var tazinput = $(this).text();
  $.each(parkingrate, function (i, v) {
    if (v.TAZ == tazinput) {
      $("#Bpkg1rate").html(v.NonResParkingRate);

      NeighborParking = v.NonResParkingRate;
      if (NeighborParking > 1.4) {
        $("#Bpkg1loc").html("A");
      }
      if (NeighborParking <= 1.4 & NeighborParking > 1) {
        $("#Bpkg1loc").html("B");
      }
      if (NeighborParking > 0.6 & NeighborParking <= 1) {
        $("#Bpkg1loc").html("C");
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.6) {
        $("#Bpkg1loc").html("D");
      }
      if (NeighborParking <= 0.2) {
        $("#Bpkg1loc").html("E");
      }

      iffind = 1;
      return;
    }

    if (iffind === 0) {
      $("#Bpkg1rate").html("TAZ error");
    }
  })
  updateBpkg1();
});


$('#Bpkg1').on('switchChange.bootstrapSwitch', function (event, state) {
  updateBpkg1();
});

function updateBpkg1() {
  if ($('#Bpkg1').bootstrapSwitch("state") === true) {
    if ($('#BparkingInput') <= 0 | $('#BparkingInput') === "") {
      Bpkg1point = 0;
    }
    else {
      if (NeighborParking > 1.4) {
        Bpkg1point = 1;
      }
      if (NeighborParking > 1 & NeighborParking <= 1.4) {
        Bpkg1point = 2;
      }
      if (NeighborParking > 0.6 & NeighborParking <= 1) {
        Bpkg1point = 3;
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.6) {
        Bpkg1point = 4;
      }
      if (NeighborParking > 0 & NeighborParking <= 0.2) {
        Bpkg1point = 5;
      }
      $('#Bpkg1pointdiv').html('+' + Bpkg1point);

    }
  }
  else {
    Bpkg1point = 0;
    $('#Bpkg1pointdiv').html('');

  }

  UpdateCurPoint();
}


//Bpkg2
$('#Bpkg2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bpkg2').bootstrapSwitch("state") === true) {
    Bpkg2point = 2;
    $('#Bpkg2pointdiv').html('+' + Bpkg2point);
  }
  else {
    Bpkg2point = 0;
    $('#Bpkg2pointdiv').html('');
  }

});


//Bpkg3
$('#Bpkg3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bpkg3').bootstrapSwitch("state") === true) {
    Bpkg3point = 2;
    $('#Bpkg3pointdiv').html('+' + Bpkg3point);
  }
  else {
    Bpkg3point = 0;
    $('#Bpkg3pointdiv').html('');
  }

});

//Bpkg4
//ChBnge Neighborhood Parking Rate, Project parking rate and location category based on input
var BOccupiedArea = 0;
var BProjectParkRate = 0;

$("#TAZinput").change("input", function (e) {
  $("#Bpkg4rate").html(NeighborParking.toString());
  BupdateProjectParking();
  updateBpkg4();
})

$("#BoccupyareaInput").on("input", function (e) {
  OccupiedArea = $("#BoccupyareaInput").val();
  BupdateProjectParking();
  updateBpkg4();
})

$("#BparkingInput").on("input", function (e) {
  BparkingSpaceInput = $("#BparkingInput").val();
  BupdateProjectParking();
  updateBpkg4();
})

function BupdateProjectParking() {
  BProjectParkRate = BparkingSpaceInput / (BOccupiedArea / 1000);
  $("#Bpkg4projectrate").html(BProjectParkRate.toFixed(2).toString());
}


function updateBpkg4() {
  if (BProjectParkRate > NeighborParking) {
    Bpkg4point = 0;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', false);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Parked > neighborhood rate");

  }
  if (BProjectParkRate === 0) {
    Bpkg4point = 11;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option K");
  }
  if ((BProjectParkRate <= NeighborParking * 0.1) && (BProjectParkRate > 0)) {
    Bpkg4point = 10;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option J");
  }
  if (BProjectParkRate <= NeighborParking * 0.2 && BProjectParkRate > NeighborParking * 0.1) {
    Bpkg4point = 9;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option I");
  }
  if (BProjectParkRate <= (NeighborParking * 0.3) && BProjectParkRate > (NeighborParking * 0.2)) {
    Bpkg4point = 8;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option H");
  }
  if (BProjectParkRate <= (NeighborParking * 0.4) && BProjectParkRate > (NeighborParking * 0.3)) {
    Bpkg4point = 7;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option G");
  }
  if (BProjectParkRate <= (NeighborParking * 0.5) && BProjectParkRate > (NeighborParking * 0.4)) {
    Bpkg4point = 6;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option F");
  }
  if (BProjectParkRate <= (NeighborParking * 0.6) && BProjectParkRate > (NeighborParking * 0.5)) {
    Bpkg4point = 5;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option E");
  }
  if (BProjectParkRate <= (NeighborParking * 0.7) && BProjectParkRate > (NeighborParking * 0.6)) {
    Bpkg4point = 4;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option D");
  }
  if (BProjectParkRate <= (NeighborParking * 0.8) && BProjectParkRate > (NeighborParking * 0.7)) {
    Bpkg4point = 3;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option C");

  }
  if (BProjectParkRate <= (NeighborParking * 0.9) && BProjectParkRate > (NeighborParking * 0.8)) {
    Bpkg4point = 2;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option B");

  }
  if (BProjectParkRate <= (NeighborParking * 1) && BProjectParkRate > (NeighborParking * 0.9)) {
    Bpkg4point = 1;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option A");

  }
  UpdateCurPoint();
}


//Bact1
$('#Bact1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact1').bootstrapSwitch("state") === false) {
    $('.Bact1Opt').prop('checked', false);
    Bact1point = 0;
    $('#Bact1pointdiv').html('');
    UpdateCurPoint();

  }
});

var Bact1pre = 0;
$('.Bact1Opt').change(function () {
  switch ($("input[class = Bact1Opt]:checked").val()) {
    case "1":
      Bact1point = 1;
      $('#Bact1pointdiv').html('+' + Bact1point);
      UpdateCurPoint();
      break;
    case "2":
      Bact1point = 1;
      $('#Bact1pointdiv').html('+' + Bact1point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});


//Bact2
$('#Bact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact2').bootstrapSwitch("state") === false) {
    $('.Bact2Opt').prop('checked', false);
    Bact2point = 0;
    $('#Bact2pointdiv').html('');
    UpdateCurPoint();

  }
});

var Bact2pre = 0;
$('.Bact2Opt').change(function () {
  switch ($("input[class = Bact2Opt]:checked").val()) {
    case "1":
      Bact2point = 1;
      $('#Bact2pointdiv').html('+' + Bact2point);
      UpdateCurPoint();
      break;
    case "2":
      Bact2point = 2;
      $('#Bact2pointdiv').html('+' + Bact2point);
      UpdateCurPoint();
      break;
    case "3":
      Bact2point = 3;
      $('#Bact2pointdiv').html('+' + Bact2point);
      UpdateCurPoint();
      break;
    case "4":
      Bact2point = 4;
      $('#Bact2pointdiv').html('+' + Bact2point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});

//Bact3
$('#Bact3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact3').bootstrapSwitch("state") === true) {
    Bact3point = 1;
    $('#Bact3pointdiv').html('+' + Bact3point);
    UpdateCurPoint();
  }
  else {
    Bact3point = 0;
    $('#Bact3pointdiv').html('');
    UpdateCurPoint();
  }

});

//Bact4
$('#Bact4').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact4').bootstrapSwitch("state") === false) {
    $('.Bact4Opt').prop('checked', false);
    Bact4point = 0;
    $('#Bact4pointdiv').html('');
    UpdateCurPoint();
  }
});

var Bact4pre = 0;
$('.Bact4Opt').change(function () {
  switch ($("input[class = Bact4Opt]:checked").val()) {
    case "1":
      Bact4point = 1;
      $('#Bact4pointdiv').html('+' + Bact4point);
      UpdateCurPoint();
      break;
    case "2":
      Bact4point = 2;
      $('#Bact4pointdiv').html('+' + Bact4point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});

//Bact5a
$('#Bact5a').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact5a').bootstrapSwitch("state") === true) {
    Bact5apoint = 1;
    $('#Bact5apointdiv').html('+' + Bact5apoint);
    UpdateCurPoint();
  }
  else {
    Bact5apoint = 0;
    $('#Bact5apointdiv').html('');
    UpdateCurPoint();
  }

});

//Bact5b
$('#Bact5b').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact5b').bootstrapSwitch("state") === true) {
    Bact5bpoint = 1;
    $('#Bact5bpointdiv').html('+' + Bact5bpoint);
    UpdateCurPoint();
  }
  else {
    Bact5bpoint = 0;
    $('#Bact5bpointdiv').html('');
    UpdateCurPoint();
  }

});

//Bact6
$('#Bact6').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bact6').bootstrapSwitch("state") === true) {
    Bact6point = 1;
    $('#Bact6pointdiv').html('+' + Bact6point);
    UpdateCurPoint();
  }
  else {
    Bact6point = 0;
    $('#Bact6pointdiv').html('');
    UpdateCurPoint();
  }

});


//Bcshare1
$('#Bcshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bcshare1').bootstrapSwitch("state") === false) {
    $('.Bcshare1Opt').prop('checked', false);
    Bcshare1point = 0;
    $('#Bcshare1pointdiv').html('');
    UpdateCurPoint();

  }
});

var Bcshare1pre = 0;
$('.Bcshare1Opt').change(function () {
  switch ($("input[class = Bcshare1Opt]:checked").val()) {
    case "1":
      Bcshare1point = 1;
      $('#Bcshare1pointdiv').html('+' + Bcshare1point);
      UpdateCurPoint();
      break;
    case "2":
      Bcshare1point = 2;
      $('#Bcshare1pointdiv').html('+' + Bcshare1point);
      UpdateCurPoint();
      break;
    case "3":
      Bcshare1point = 3;
      $('#Bcshare1pointdiv').html('+' + Bcshare1point);
      UpdateCurPoint();
      break;
    case "4":
      Bcshare1point = 4;
      $('#Bcshare1pointdiv').html('+' + Bcshare1point);
      UpdateCurPoint();
      break;
    case "5":
      Bcshare1point = 5;
      $('#Bcshare1pointdiv').html('+' + Bcshare1point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});


//Bdeli1
$('#Bdeli1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bdeli1').bootstrapSwitch("state") === true) {
    Bdeli1point = 1;
    $('#Bdeli1pointdiv').html('+' + Bdeli1point);
    UpdateCurPoint();
  }
  else {
    Bdeli1point = 0;
    $('#Bdeli1pointdiv').html('');
    UpdateCurPoint();
  }

});


//Bfam2
$('#Bfam2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bfam2').bootstrapSwitch("state") === true) {
    Bfam2point = 2;
    $('#Bfam2pointdiv').html('+' + Bfam2point);
    UpdateCurPoint();
  }
  else {
    Bfam2point = 0;
    $('#Bfam2pointdiv').html('');
    UpdateCurPoint();
  }


});


//Bhov1
$('#Bhov1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bhov1').bootstrapSwitch("state") === false) {
    $('.Bhov1Opt').prop('checked', false);
    Bhov1point = 0;
    $('#Bhov1pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Bhov1Opt').change(function () {
  switch ($("input[class = Bhov1Opt]:checked").val()) {
    case "1":
      Bhov1point = 2;
      $('#Bhov1pointdiv').html('+' + Bhov1point);
      UpdateCurPoint();
      break;
    case "2":
      Bhov1point = 4;
      $('#Bhov1pointdiv').html('+' + Bhov1point);
      UpdateCurPoint();
      break;
    case "3":
      Bhov1point = 6;
      $('#Bhov1pointdiv').html('+' + Bhov1point);
      UpdateCurPoint();
      break;
    case "4":
      Bhov1point = 8;
      $('#Bhov1pointdiv').html('+' + Bhov1point);
      UpdateCurPoint();
      break;
    default:

  }
  ;

});


//Bhov2
$('#Bhov2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Bhov2').bootstrapSwitch("state") === false) {
    $('.Bhov2Opt').prop('checked', false);
    Bhov2point = 0;
    $('#Bhov2pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Bhov2Opt').change(function () {
  switch ($("input[class = Bhov2Opt]:checked").val()) {
    case "1":
      Bhov2point = 7;
      $('#Bhov2pointdiv').html('+' + Bhov2point);
      UpdateCurPoint();
      break;
    case "2":
      Bhov2point = 14;
      $('#Bhov2pointdiv').html('+' + Bhov2point);
      UpdateCurPoint();
      break;
    default:
      alert("no value")
  }
  ;

});


//Bhov3
$("#BgrossareaInput").on("input", function (e) {
  updateBhov3();
});


$('#Bhov3').on('switchChange.bootstrapSwitch', function (event, state) {
  updateBhov3();
});

function updateBhov3() {
  var BgrossareaInput = $("#BgrossareaInput").val();
  if ($('#Bhov3').bootstrapSwitch("state") === true) {
    if (BgrossareaInput < 100000) {
      $('#Bhov3Opt').html("Option A");
      Bhov3point = 1;
      $('#Bhov3pointdiv').html('+' + Bhov3point);
      UpdateCurPoint();
    }
    if (BgrossareaInput >= 100000 & BgrossareaInput < 200000) {
      $('#Bhov3Opt').html("Option B");
      Bhov3point = 2;
      $('#Bhov3pointdiv').html('+' + Bhov3point);
      UpdateCurPoint();
    }
    if (BgrossareaInput >= 200000 & BgrossareaInput < 300000) {
      $('#Bhov3Opt').html("Option C");
      Bhov3point = 3;
      $('#Bhov3pointdiv').html('+' + Bhov3point);
      UpdateCurPoint();
    }
    if (BgrossareaInput >= 300000 & BgrossareaInput < 400000) {
      $('#Bhov3Opt').html("Option D");
      Bhov3point = 4;
      $('#Bhov3pointdiv').html('+' + Bhov3point);
      UpdateCurPoint();
    }
    if (BgrossareaInput >= 400000 & BgrossareaInput < 500000) {
      $('#Bhov3Opt').html("Option E");
      Bhov3point = 5;
      $('#Bhov3pointdiv').html('+' + Bhov3point);
      UpdateCurPoint();
    }
    if (BgrossareaInput >= 500000 & BgrossareaInput < 600000) {
      $('#Bhov3Opt').html("Option F");
      Bhov3point = 6;
      $('#Bhov3pointdiv').html('+' + Bhov3point);
      UpdateCurPoint();
    }
    if (BgrossareaInput >= 600000) {
      $('#Bhov3Opt').html("Option G");
      Bhov3point = 7;
      $('#Bhov3pointdiv').html('+' + Bhov3point);
      UpdateCurPoint();
    }


  }
  else {
    Bhov3point = 0;
    $('#Bhov3Opt').html("")
    UpdateCurPoint();
  }


}

//Binfo1
$('#Binfo1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Binfo1').bootstrapSwitch("state") === true) {
    Binfo1point = 1;
    $('#Binfo1pointdiv').html('+' + Binfo1point);
    UpdateCurPoint();
  }
  else {
    Binfo1point = 0;
    $('#Binfo1pointdiv').html('');
    UpdateCurPoint();
  }

});

//Binfo2
$('#Binfo2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Binfo2').bootstrapSwitch("state") === true) {
    Binfo2point = 1;
    $('#Binfo2pointdiv').html('+' + Binfo2point);
    UpdateCurPoint();
  }
  else {
    Binfo2point = 0;
    $('#Binfo2pointdiv').html('');
    UpdateCurPoint();
  }

});


//Binfo3
$('#Binfo3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Binfo3').bootstrapSwitch("state") === false) {
    $('.Binfo3Opt').prop('checked', false);
    Binfo3point = 0;
    $('#Binfo3pointdiv').html('');
    UpdateCurPoint();

  }
});

var Binfo3pre = 0;
$('.Binfo3Opt').change(function () {
  switch ($("input[class = Binfo3Opt]:checked").val()) {
    case "1":
      Binfo3point = 1;
      $('#Binfo3pointdiv').html('+' + Binfo3point);
      UpdateCurPoint();
      break;
    case "2":
      Binfo3point = 2;
      $('#Binfo3pointdiv').html('+' + Binfo3point);
      UpdateCurPoint();
      break;
    case "3":
      Binfo3point = 3;
      $('#Binfo3pointdiv').html('+' + Binfo3point);
      UpdateCurPoint();
      break;
    case "4":
      Binfo3point = 4;
      $('#Binfo3pointdiv').html('+' + Binfo3point);
      UpdateCurPoint();
      break;
    default:

  }
  ;

});


//C current point

//Cpkg1
//Change Neighborhood Parking Rate and location category based on input
var ResNeighborParking = 0;
$("#TAZinput").change("input", function (e) {
  var iffind = 0;
  var tazinput = $(this).text();
  $.each(parkingrate, function (i, v) {
    if (v.TAZ == tazinput) {
      $("#Cpkg1rate").html(v.ResParkingRateLow);

      ResNeighborParking = v.ResParkingRateLow;
      if (ResNeighborParking > 0.8) {
        $("#Cpkg1loc").html("A");
      }
      if (ResNeighborParking <= 0.8 & ResNeighborParking > 0.6) {
        $("#Cpkg1loc").html("B");
      }
      if (ResNeighborParking > 0.4 & ResNeighborParking <= 0.6) {
        $("#Cpkg1loc").html("C");
      }
      if (ResNeighborParking > 0.2 & ResNeighborParking <= 0.4) {
        $("#Cpkg1loc").html("D");
      }
      if (ResNeighborParking <= 0.2) {
        $("#Cpkg1loc").html("E");
      }

      iffind = 1;
      return;
    }

    if (iffind === 0) {
      $("#Cpkg1rate").html("TAZ error");
    }
  })
  updateCpkg1();
});


$('#Cpkg1').on('switchChange.bootstrapSwitch', function (event, state) {
  updateCpkg1();
});

function updateCpkg1() {
  if ($('#Cpkg1').bootstrapSwitch("state") === true) {
    if ($('#CparkingInput') <= 0 | $('#CparkingInput') === "") {
      Cpkg1point = 0;
    }
    else {
      if (ResNeighborParking > 0.8) {
        Cpkg1point = 1;
      }
      if (ResNeighborParking > 0.6 & ResNeighborParking <= 0.8) {
        Cpkg1point = 2;
      }
      if (ResNeighborParking > 0.4 & ResNeighborParking <= 0.6) {
        Cpkg1point = 3;
      }
      if (ResNeighborParking > 0.2 & ResNeighborParking <= 0.4) {
        Cpkg1point = 4;
      }
      if (ResNeighborParking > 0 & ResNeighborParking <= 0.2) {
        Cpkg1point = 5;
      }
    }
    $('#Cpkg1pointdiv').html('+' + Cpkg1point);

  }
  else {
    Cpkg1point = 0;
    $('#Cpkg1pointdiv').html('');

  }
  UpdateCurPoint();
}


//Cpkg4
var Cunitbed = 0;
var CProjectParkRate = 0;
$("#TAZinput").change("input", function (e) {
  $("#Cpkg4rate").html(ResNeighborParking.toString());
  CupdateProjectParking();
  updateCpkg4();
})

$("#Cunitbed").on("input", function (e) {
  Cunitbed = $("#Cunitbed").val();
  CupdateProjectParking();
  updateCpkg4();
})

$("#CparkingInput").on("input", function (e) {
  CparkingSpaceInput = $("#CparkingInput").val();
  CupdateProjectParking();
  updateCpkg4();
})

function CupdateProjectParking() {
  CProjectParkRate = CparkingSpaceInput / Cunitbed;
  $("#Cpkg4projectrate").html(CProjectParkRate.toFixed(2).toString());
}


function updateCpkg4() {
  if (CProjectParkRate > ResNeighborParking) {
    Cpkg4point = 0;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', false);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Parked > neighborhood rate");

  }
  if (CProjectParkRate === 0) {
    Cpkg4point = 11;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option K");
  }
  if ((CProjectParkRate <= ResNeighborParking * 0.1) && (CProjectParkRate > 0)) {
    Cpkg4point = 10;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option J");
  }
  if (CProjectParkRate <= ResNeighborParking * 0.2 && CProjectParkRate > ResNeighborParking * 0.1) {
    Cpkg4point = 9;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option I");
  }
  if (CProjectParkRate <= (ResNeighborParking * 0.3) && CProjectParkRate > (ResNeighborParking * 0.2)) {
    Cpkg4point = 8;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option H");
  }
  if (CProjectParkRate <= (ResNeighborParking * 0.4) && CProjectParkRate > (ResNeighborParking * 0.3)) {
    Cpkg4point = 7;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option G");
  }
  if (CProjectParkRate <= (ResNeighborParking * 0.5) && CProjectParkRate > (ResNeighborParking * 0.4)) {
    Cpkg4point = 6;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option F");
  }
  if (CProjectParkRate <= (ResNeighborParking * 0.6) && CProjectParkRate > (ResNeighborParking * 0.5)) {
    Cpkg4point = 5;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option E");
  }
  if (CProjectParkRate <= (ResNeighborParking * 0.7) && CProjectParkRate > (ResNeighborParking * 0.6)) {
    Cpkg4point = 4;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option D");
  }
  if (CProjectParkRate <= (ResNeighborParking * 0.8) && CProjectParkRate > (ResNeighborParking * 0.7)) {
    Cpkg4point = 3;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option C");

  }
  if (CProjectParkRate <= (ResNeighborParking * 0.9) && CProjectParkRate > (ResNeighborParking * 0.8)) {
    Cpkg4point = 2;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option B");

  }
  if (CProjectParkRate <= (ResNeighborParking * 1) && CProjectParkRate > (ResNeighborParking * 0.9)) {
    Cpkg4point = 1;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option A");

  }
  UpdateCurPoint();
}


//Cact1
$('#Cact1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact1').bootstrapSwitch("state") === false) {
    $('.Cact1Opt').prop('checked', false);
    Cact1point = 0;
    $('#Cact1pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Cact1Opt').change(function () {
  switch ($("input[class = Cact1Opt]:checked").val()) {
    case "1":
      Cact1point = 1;
      $('#Cact1pointdiv').html('+' + Cact1point);
      UpdateCurPoint();
      break;
    case "2":
      Cact1point = 1;
      $('#Cact1pointdiv').html('+' + Cact1point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});


//Cact2
$('#Cact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact2').bootstrapSwitch("state") === false) {
    $('.Cact2Opt').prop('checked', false);
    Cact2point = 0;
    $('#Cact2pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Cact2Opt').change(function () {
  switch ($("input[class = Cact2Opt]:checked").val()) {
    case "1":
      Cact2point = 1;
      $('#Cact2pointdiv').html('+' + Cact2point);
      UpdateCurPoint();
      break;
    case "2":
      Cact2point = 2;
      $('#Cact2pointdiv').html('+' + Cact2point);
      UpdateCurPoint();
      break;
    case "3":
      Cact2point = 3;
      $('#Cact2pointdiv').html('+' + Cact2point);
      UpdateCurPoint();
      break;
    case "4":
      Cact2point = 4;
      $('#Cact2pointdiv').html('+' + Cact2point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});


//Cact4
$('#Cact4').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact4').bootstrapSwitch("state") === false) {
    $('.Cact4Opt').prop('checked', false);
    Cact4point = 0;
    $('#Cact4pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Cact4Opt').change(function () {
  switch ($("input[class = Cact4Opt]:checked").val()) {
    case "1":
      Cact4point = 1;
      $('#Cact4pointdiv').html('+' + Cact4point);
      UpdateCurPoint();
      break;
    case "2":
      Cact4point = 2;
      $('#Cact4pointdiv').html('+' + Cact4point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});

//Cact5a
$('#Cact5a').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact5a').bootstrapSwitch("state") === true) {
    Cact5apoint = 1;
    $('#Cact5apointdiv').html('+' + Cact5apoint);
    UpdateCurPoint();
  }
  else {
    Cact5apoint = 0;
    $('#Cact5apointdiv').html('');
    UpdateCurPoint();
  }

});

//Cact5b
$('#Cact5b').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact5b').bootstrapSwitch("state") === true) {
    Cact5bpoint = 1;
    $('#Cact5bpointdiv').html('+' + Cact5bpoint);
    UpdateCurPoint();
  }
  else {
    Cact5bpoint = 0;
    $('#Cact5bpointdiv').html('');
    UpdateCurPoint();
  }

});

//Cact6
$('#Cact6').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cact6').bootstrapSwitch("state") === true) {
    Cact6point = 1;
    $('#Cact6pointdiv').html('+' + Cact6point);
    UpdateCurPoint();
  }
  else {
    Cact6point = 0;
    $('#Cact6pointdiv').html('');
    UpdateCurPoint();
  }

});


//Ccshare1

$('#Ccshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ccshare1').bootstrapSwitch("state") === false) {
    $('.Ccshare1Opt').prop('checked', false);
    Ccshare1point = 0;
    $('#Ccshare1pointdiv').html('');
    UpdateCurPoint();

  }
});

var Ccshare1pre = 0;
$('.Ccshare1Opt').change(function () {
  switch ($("input[class = Ccshare1Opt]:checked").val()) {
    case "1":
      Ccshare1point = 1;
      $('#Ccshare1pointdiv').html('+' + Ccshare1point);
      UpdateCurPoint();
      break;
    case "2":
      Ccshare1point = 2;
      $('#Ccshare1pointdiv').html('+' + Ccshare1point);
      UpdateCurPoint();
      break;
    case "3":
      Ccshare1point = 3;
      $('#Ccshare1pointdiv').html('+' + Ccshare1point);
      UpdateCurPoint();
      break;
    case "4":
      Ccshare1point = 4;
      $('#Ccshare1pointdiv').html('+' + Ccshare1point);
      UpdateCurPoint();
      break;
    case "5":
      Ccshare1point = 5;
      $('#Ccshare1pointdiv').html('+' + Ccshare1point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});


//Cdeli1
$('#Cdeli1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cdeli1').bootstrapSwitch("state") === true) {
    Cdeli1point = 1;
    $('#Cdeli1pointdiv').html('+' + Cdeli1point);
    UpdateCurPoint();
  }
  else {
    Cdeli1point = 0;
    $('#Cdeli1pointdiv').html('');
    UpdateCurPoint();
  }

});

//Cfam1


$('#Cfam1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cfam1').bootstrapSwitch("state") === false) {
    $('.Cfam1Opt').prop('checked', false);
    Cfam1point = 0;
    UpdateCurPoint();
    $('#Cfam1pointdiv').html('');

  }
});

$('.Cfam1Opt').change(function () {
  if ($('#Cfam1OptA').prop("checked") || $('#Cfam1OptB').prop("checked")) {
    Cfam1point = 1;
    UpdateCurPoint();
    $('#Cfam1pointdiv').html('+' + Cfam1point);


  }
  if ($('#Cfam1OptA').prop("checked") && $('#Cfam1OptB').prop("checked")) {
    Cfam1point = 2;
    UpdateCurPoint();
    $('#Cfam1pointdiv').html('+' + Cfam1point);


  }
  if (!($('#Cfam1OptA').prop("checked")) && !($('#Cfam1OptB').prop("checked"))) {
    Cfam1point = 0;
    UpdateCurPoint();
    $('#Cfam1pointdiv').html('+' + Cfam1point);
  }
});


//Cfam2
$('#Cfam2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cfam2').bootstrapSwitch("state") === true) {
    Cfam2point = 2;
    $('#Cfam2pointdiv').html('+' + Cfam2point);
    UpdateCurPoint();
  }
  else {
    Cfam2point = 0;
    $('#Cfam2pointdiv').html('');
    UpdateCurPoint();
  }

});

//Cfam3
$("#CtwobedroomInput").on("input", function (e) {
  PersentageTwoBed = $("#CtwobedroomInput").val();
  updateCfam3();
})
$('#Cfam1').on('switchChange.bootstrapSwitch', function (event, state) {
  updateCfam3();
})
$('.Cfam1Opt').change(function () {
  updateCfam3();
})
$('.Ccshare1').change(function () {
  updateCfam3();
})
$('.Ccshare1Opt').change(function () {
  updateCfam3();
})

function updateCfam3() {
  if (PersentageTwoBed >= 40) {
    if ((Ccshare1point === 4) && (Cfam1point === 2)) {
      Cfam3point = 2;
      $('#Cfam3pointdiv').html('+' + Cfam3point);
      $('#Cfam3').bootstrapSwitch('disabled', false);
      $('#Cfam3').bootstrapSwitch('state', true);
      $('#Cfam3').bootstrapSwitch('disabled', true);

    }
    if ((Ccshare1point === 5) && (Cfam1point === 2)) {
      Cfam3point = 2;
      $('#Cfam3pointdiv').html('+' + Cfam3point);
      $('#Cfam3').bootstrapSwitch('disabled', false);
      $('#Cfam3').bootstrapSwitch('state', true);
      $('#Cfam3').bootstrapSwitch('disabled', true);
    }
    if ((Ccshare1point === 6) && (Cfam1point === 2)) {
      Cfam3point = 2;
      $('#Cfam3pointdiv').html('+' + Cfam3point);
      $('#Cfam3').bootstrapSwitch('disabled', false);
      $('#Cfam3').bootstrapSwitch('state', true);
      $('#Cfam3').bootstrapSwitch('disabled', true);
    }
  }

  if ((Ccshare1point < 4 ) || (Cfam1point < 2) || (PersentageTwoBed < 40)) {
    Cfam3point = 0;
    $('#Cfam3pointdiv').html('');
    $('#Cfam3').bootstrapSwitch('disabled', false);
    $('#Cfam3').bootstrapSwitch('state', false);
    $('#Cfam3').bootstrapSwitch('disabled', true);
  }

  UpdateCurPoint();
}


//Chov1
$('#Chov1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Chov1').bootstrapSwitch("state") === false) {
    $('.Chov1Opt').prop('checked', false);
    Chov1point = 0;
    $('#Chov1pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Chov1Opt').change(function () {
  switch ($("input[class = Chov1Opt]:checked").val()) {
    case "1":
      Chov1point = 2;
      $('#Chov1pointdiv').html('+' + Chov1point);
      UpdateCurPoint();
      break;
    case "2":
      Chov1point = 4;
      $('#Chov1pointdiv').html('+' + Chov1point);
      UpdateCurPoint();
      break;
    case "3":
      Chov1point = 6;
      $('#Chov1pointdiv').html('+' + Chov1point);
      UpdateCurPoint();
      break;
    case "4":
      Chov1point = 8;
      $('#Chov1pointdiv').html('+' + Chov1point);
      UpdateCurPoint();
      break;
    default:

  }
  ;

});


//Chov2
$('#Chov2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Chov2').bootstrapSwitch("state") === false) {
    $('.Chov2Opt').prop('checked', false);
    Chov2point = 0;
    $('#Chov2pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Chov2Opt').change(function () {
  switch ($("input[class = Chov2Opt]:checked").val()) {
    case "1":
      Chov2point = 7;
      $('#Chov2pointdiv').html('+' + Chov2point);
      UpdateCurPoint();
      break;
    case "2":
      Chov2point = 14;
      $('#Chov2pointdiv').html('+' + Chov2point);
      UpdateCurPoint();
      break;
    default:
      alert("no value")
  }
  ;

});


//Cinfo1
$('#Cinfo1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cinfo1').bootstrapSwitch("state") === true) {
    Cinfo1point = 1;
    $('#Cinfo1pointdiv').html('+' + Cinfo1point);
    UpdateCurPoint();
  }
  else {
    Cinfo1point = 0;
    $('#Cinfo1pointdiv').html('');
    UpdateCurPoint();
  }

});

//Cinfo2
$('#Cinfo2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cinfo2').bootstrapSwitch("state") === true) {
    Cinfo2point = 1;
    $('#Cinfo2pointdiv').html('+' + Cinfo2point);
    UpdateCurPoint();
  }
  else {
    Cinfo2point = 0;
    $('#Cinfo2pointdiv').html('');
    UpdateCurPoint();
  }

});


//Cinfo3
$('#Cinfo3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Cinfo3').bootstrapSwitch("state") === false) {
    $('.Cinfo3Opt').prop('checked', false);
    Cinfo3point = 0;
    $('#Cinfo3pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Cinfo3Opt').change(function () {
  switch ($("input[class = Cinfo3Opt]:checked").val()) {
    case "1":
      Cinfo3point = 1;
      $('#Cinfo3pointdiv').html('+' + Cinfo3point);
      UpdateCurPoint();
      break;
    case "2":
      Cinfo3point = 2;
      $('#Cinfo3pointdiv').html('+' + Cinfo3point);
      UpdateCurPoint();
      break;
    case "3":
      Cinfo3point = 3;
      $('#Cinfo3pointdiv').html('+' + Cinfo3point);
      UpdateCurPoint();
      break;
    case "4":
      Cinfo3point = 4;
      $('#Cinfo3pointdiv').html('+' + Cinfo3point);
      UpdateCurPoint();
      break;
    default:

  }
  ;

});


//Clu2 PersentageAffordHouse Clu2optiondiv

$("#CaffordHouseInput").change("input", function (e) {
  PersentageAffordHouse = $("#CaffordHouseInput").val();
  updateClu2();
})

function updateClu2() {
  if (PersentageAffordHouse >= 12) {
    $('#Clu2').bootstrapSwitch('disabled', false);
    $('#Clu2').bootstrapSwitch('state', true);
    $('#Clu2').bootstrapSwitch('disabled', true);

    if (PersentageAffordHouse <= 25){
      Clu2point = 1;
      $("#Clu2optiondiv").html("Option A");
      $("#Clu2pointdiv").html('+' + Clu2point);
    }
    if ((PersentageAffordHouse > 25) && (PersentageAffordHouse <= 50)){
      Clu2point = 2;
      $("#Clu2optiondiv").html("Option B");
      $("#Clu2pointdiv").html('+' + Clu2point);
    }

    if ((PersentageAffordHouse > 50) && (PersentageAffordHouse <= 75)){
      Clu2point = 3;
      $("#Clu2optiondiv").html("Option C");
      $("#Clu2pointdiv").html('+' + Clu2point);
    }

    if ((PersentageAffordHouse > 75) ){
      Clu2point = 4;
      $("#Clu2optiondiv").html("Option D");
      $("#Clu2pointdiv").html('+' + Clu2point);
    }

  }
  else {
    Clu2point = 0;
    $('#Clu2').bootstrapSwitch('disabled', false);
    $('#Clu2').bootstrapSwitch('state', false);
    $('#Clu2').bootstrapSwitch('disabled', true);
    $("#Clu2optiondiv").html('');
    $("#Clu2pointdiv").html('');

  }

  UpdateCurPoint();
}


//Dpkg4
//Change Neighborhood Parking Rate, Project parking rate and location category based on input
var DOccupiedArea = 0;
var DProjectParkRate = 0;

$("#TAZinput").change("input", function (e) {
  $("#Dpkg4rate").html(NeighborParking.toString());
  DupdateProjectParking();
  updateDpkg4();
})

$("#DoccupyareaInput").on("input", function (e) {
  DOccupiedArea = $("#DoccupyareaInput").val();
  DupdateProjectParking();
  updateDpkg4();
})

$("#DparkingInput").on("input", function (e) {
  DparkingSpaceInput = $("#DparkingInput").val();
  DupdateProjectParking();
  updateDpkg4();
})

function DupdateProjectParking() {
  DProjectParkRate = DparkingSpaceInput / (DOccupiedArea / 1000);
  $("#Dpkg4projectrate").html(DProjectParkRate.toFixed(2).toString());
}


function updateDpkg4() {
  if (DProjectParkRate > NeighborParking) {
    Dpkg4point = 0;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', false);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Parked > neighborhood rate");

  }
  if (DProjectParkRate === 0) {
    Dpkg4point = 11;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option K");
  }
  if ((DProjectParkRate <= NeighborParking * 0.1) && (DProjectParkRate > 0)) {
    Dpkg4point = 10;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option J");
  }
  if (DProjectParkRate <= NeighborParking * 0.2 && DProjectParkRate > NeighborParking * 0.1) {
    Dpkg4point = 9;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option I");
  }
  if (DProjectParkRate <= (NeighborParking * 0.3) && DProjectParkRate > (NeighborParking * 0.2)) {
    Dpkg4point = 8;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option H");
  }
  if (DProjectParkRate <= (NeighborParking * 0.4) && DProjectParkRate > (NeighborParking * 0.3)) {
    Dpkg4point = 7;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option G");
  }
  if (DProjectParkRate <= (NeighborParking * 0.5) && DProjectParkRate > (NeighborParking * 0.4)) {
    Dpkg4point = 6;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option F");
  }
  if (DProjectParkRate <= (NeighborParking * 0.6) && DProjectParkRate > (NeighborParking * 0.5)) {
    Dpkg4point = 5;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option E");
  }
  if (DProjectParkRate <= (NeighborParking * 0.7) && DProjectParkRate > (NeighborParking * 0.6)) {
    Dpkg4point = 4;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option D");
  }
  if (DProjectParkRate <= (NeighborParking * 0.8) && DProjectParkRate > (NeighborParking * 0.7)) {
    Dpkg4point = 3;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option C");

  }
  if (DProjectParkRate <= (NeighborParking * 0.9) && DProjectParkRate > (NeighborParking * 0.8)) {
    Dpkg4point = 2;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option B");

  }
  if (DProjectParkRate <= (NeighborParking * 1) && DProjectParkRate > (NeighborParking * 0.9)) {
    Dpkg4point = 1;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option A");

  }
  console.log(Dpkg4point);
  UpdateCurPoint();
}


//Dact2
$('#Dact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Dact2').bootstrapSwitch("state") === false) {
    $('.Dact2Opt').prop('checked', false);
    Dact2point = 0;
    $('#Dact2pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Dact2Opt').change(function () {
  switch ($("input[class = Dact2Opt]:checked").val()) {
    case "1":
      Dact2point = 1;
      $('#Dact2pointdiv').html('+' + Dact2point);
      UpdateCurPoint();
      break;
    case "2":
      Dact2point = 2;
      $('#Dact2pointdiv').html('+' + Dact2point);
      UpdateCurPoint();
      break;
    case "3":
      Dact2point = 3;
      $('#Dact2pointdiv').html('+' + Dact2point);
      UpdateCurPoint();
      break;
    case "4":
      Dact2point = 4;
      $('#Dact2pointdiv').html('+' + Dact2point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});

//Dact3
$('#Dact3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Dact3').bootstrapSwitch("state") === true) {
    Dact3point = 1;
    $('#Dact3pointdiv').html('+' + Dact3point);
    UpdateCurPoint();
  }
  else {
    Dact3point = 0;
    $('#Dact3pointdiv').html('');
    UpdateCurPoint();
  }

});


//Dcshare1
$('#Dcshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Dcshare1').bootstrapSwitch("state") === false) {
    $('.Dcshare1Opt').prop('checked', false);
    Dcshare1point = 0;
    $('#Dcshare1pointdiv').html('');
    UpdateCurPoint();

  }
});

var Dcshare1pre = 0;
$('.Dcshare1Opt').change(function () {
  switch ($("input[class = Dcshare1Opt]:checked").val()) {
    case "1":
      Dcshare1point = 1;
      $('#Dcshare1pointdiv').html('+' + Dcshare1point);
      UpdateCurPoint();
      break;
    case "2":
      Dcshare1point = 2;
      $('#Dcshare1pointdiv').html('+' + Dcshare1point);
      UpdateCurPoint();
      break;
    case "3":
      Dcshare1point = 3;
      $('#Dcshare1pointdiv').html('+' + Dcshare1point);
      UpdateCurPoint();
      break;
    case "4":
      Dcshare1point = 4;
      $('#Dcshare1pointdiv').html('+' + Dcshare1point);
      UpdateCurPoint();
      break;
    case "5":
      Dcshare1point = 5;
      $('#Dcshare1pointdiv').html('+' + Dcshare1point);
      UpdateCurPoint();
      break;
    default:
      alert("no value");

  }
  ;

});


//Dinfo1
$('#Dinfo1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Dinfo1').bootstrapSwitch("state") === true) {
    Dinfo1point = 1;
    $('#Dinfo1pointdiv').html('+' + Dinfo1point);
    UpdateCurPoint();
  }
  else {
    Dinfo1point = 0;
    $('#Dinfo1pointdiv').html('');
    UpdateCurPoint();
  }

});

//Dinfo2
$('#Dinfo2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Dinfo2').bootstrapSwitch("state") === true) {
    Dinfo2point = 1;
    $('#Dinfo2pointdiv').html('+' + Dinfo2point);
    UpdateCurPoint();
  }
  else {
    Dinfo2point = 0;
    $('#Dinfo2pointdiv').html('');
    UpdateCurPoint();
  }

});


$(":checkbox:not(.CategoryRadio)").on('switchChange.bootstrapSwitch', function (event, state) {
  UpdateCurPoint();
});

$(".OptButtion").change(function (event, state) {
  UpdateCurPoint();

});

$(["<input>"]).change(function (event, state) {
  UpdateCurPoint();
});


function UpdateCurPoint() {
  Atotalpoint = Apkg1point + Apkg2point + Apkg3point + Apkg4point + Aact1point + Aact2point + Aact3point + Aact4point + Aact5apoint + Aact5bpoint + Aact6point + Aact7point + Acshare1point + Adeli1point + Adeli2point + Afam2point + Ahov1point + Math.min(14, Ahov2point + Ahov3point) + Ainfo1point + Ainfo2point + Ainfo3point + Alu1point;

  Btotalpoint = Bpkg1point + Bpkg2point + Bpkg3point + Bpkg4point + Bact1point + Bact2point + Bact3point + Bact4point + Bact5apoint + Bact5bpoint + Bact6point + Bcshare1point + Bdeli1point + Bfam2point + Bhov1point + Math.min(14, Bhov2point + Bhov3point) + Binfo1point + Binfo2point + Binfo3point;

  Ctotalpoint = Cpkg1point + Cpkg4point + Cact1point + Cact2point + Cact4point + Cact5apoint + Cact5bpoint + Cact6point + Ccshare1point + Cdeli1point + Cfam1point + Cfam2point + Cfam3point + Chov1point + Chov2point + Cinfo1point + Cinfo2point + Cinfo3point + Clu2point;

  Dtotalpoint = Dpkg4point + Dact2point + Dact3point + Dcshare1point + Dinfo1point + Dinfo2point;

  $('#Atotalpoint').html(Atotalpoint.toString());
  $('#Btotalpoint').html(Btotalpoint.toString());
  $('#Ctotalpoint').html(Ctotalpoint.toString());
  $('#Dtotalpoint').html(Dtotalpoint.toString());


}


//   function unGraySearchStart() {
//   if   (theNumOfSearches==0 || checkMob(navigator.userAgent)){
//     //remove the search text if they either a) click before running a search (to clear the default), or b) they are using a mobile device (to clear their last search
//     document.getElementById('addressInput').value=""
//   }
//   theNumOfSearches=theNumOfSearches+1
// }


dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("esri.map");
dojo.require("esri.tasks.find");
dojo.require("esri.tasks.identify");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.geometry");
dojo.require("esri.graphic");
dojo.require("dijit.form.Button");
dojo.require("dijit.Menu");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("esri.dijit.Geocoder");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.dijit.Popup");
dojo.require("esri.tasks.PrintTask");
dojo.require("esri.tasks.PrintParameters");


var map, locator;

function init() {
  var popup = new esri.dijit.Popup({fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]))}, dojo.create("div"));
  map = new esri.Map("map_canvas",
    {
      basemap: "topo",
      center: [-122.4425, 37.754],
      zoom: 12,
      showAttribution: false,
      maxZoom: 19,
      infoWindow: popup
    }
  );
  //add class for popup
  dojo.addClass(map.infoWindow.domNode, "myTheme");
  initialize();
}

dojo.ready(init);
theNumOfSearches = 0

//resize map when the window size change
resizeDiv();
window.onresize = function (event) {
  resizeDiv();
}

function resizeDiv() {
  vpw = $(window).width() * 0.95;
  vph = $(window).height() * 0.5;
  $('#map_canvas').css({'width': vpw + 'px'});
  $('#map_canvas').css({'height': vph + 'px'});
}

//tooltip
//project characteristic


$('#TAZinput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "On the 'Property & Planning' tab in Transportation Information Map, look for 'Traffic Analysis Zone' (aka Transportation Analysis Zone).TAZ 579 is default location for1650 Mission Street."
});

$('#AoccupyareaInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Default is Gross Floor Area, change to appropriate square footage if known."
});


$('#BoccupyareaInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Default is Gross Floor Area, change to appropriate square footage if known."
});

$('#DoccupyareaInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Default is Gross Floor Area, change to appropriate square footage if known."
});


$('#AparkingInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Update this row after completing Category A (Retail Type) tab, if necessary."
});

$('#BparkingInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Update this row after completing Category B (Retail Type) tab, if necessary."
});

$('#DparkingInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Update this row after completing Category C (Retail Type) tab, if necessary."
});


$('#CtwobedroomInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Update this row after completing Category C (Retail Type) tab, if necessary."
});

$('#CaffordHouseInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Update this row after completing Category C (Retail Type) tab, if necessary."
});

$('#CparkingInput').tooltip({
  'trigger': 'focus',
  'placement': 'top',
  'title': "Update this row after completing Category C (Retail Type) tab, if necessary."
});

//MEASURE A
$('.parkingtitle').tooltip({
  'trigger': 'hover',
  'placement': 'right',
  'title': "TDM measures which reduce vehicle miles traveled by appropriately pricing and managing parking."
});

$('.parkratetitle').tooltip({
  'trigger': 'hover',
  'placement': 'top',
  'title': "On Project Characteristics tab, you must fill out Transportation Analysis Zone to obtain Neighborhood Parking Rate."
});


//add comma in number input  (e.g.  1000 -> 1,000)

$(".auto").change(function (event, state) {
  if (event.which >= 37 && event.which <= 40) {
    event.preventDefault();
  }
  var $this = $(this);
  var num = $this.val().replace(/,/g, '');
  $this.val(num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
});


//bootstrap tour
// Instance the tour
var tour = new Tour({
  storage: false,
  steps: [

    {
      element: "#step1div",
      title: "Step 1",
      content: "Search your address or Click on the Map",
      backdrop: true
    },
    {
      element: "#step2div",
      title: "Step 2a",
      content: "Input project category",
      backdrop: true,
      placement: "top"
    },
    {
      element: "#BasicProjectCharacter",
      title: "Step 2b",
      content: "Input basic project characteristics",
      backdrop: true,
      placement: "top"
    },
    {
      element: "#detaileddiv",
      title: "Step 2c",
      content: "Input detailed project category",
      backdrop: true,
      placement: "top"
    },
    {
      element: "#measurediv",
      title: "Step 3",
      content: "choose your TDM measures and meet the target",
      backdrop: true,
      placement: "top"
    },
    {
      element: "#scrolldiv",
      title: "Point",
      content: "Current point means the points your got based on your TDM choice. Target point is the required points",
      placement: "top"
    },
    {
      element: "#buttondiv",
      title: "Submit",
      content: "After review the whole document,please press Submit button. If you need clear all things, press Clear button",

      placement: "top"
    }
  ]
});


// Start the tour
$("#tourbutton").click(function (event, state) {
  tour.init();
  tour.restart();
  tour.start(true);
});



//Meausres PDF link
$(".measurename").click(function (event, state) {
  var measurenamecut = $(this).attr("for").substring(1);
  window.open(window.location.href+"pdf?name=" + measurenamecut, '_blank')
});

//Landuse PDF link
$("#landusequestion").click(function (event, state) {
  window.open(window.location.href+"landuse", '_blank')
});

$('form').on('submit', function(e){
    e.preventDefault();
});






//Submit
$("#summit").click(function(event, state){
  //Merge data from form
  var measurearray = [];
  $(".measureinput:checked").each(function(){
    measrearray.push(this.name);
  });
  var submitdata = {measures:measurearray};

  console.log(submitdata);

  if (Atotalpoint >= Atargetpoint && Btotalpoint >= Btargetpoint && Ctotalpoint >= Ctargetpoint  ){
    swal("Good job!", "You meet the requirement!", "success");
    $.post("/submitmeasure",
    submitdata,
      function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
      });
  }
  else{
    swal({   title: "Are you sure?",   text: "You didn't meet the requirement!",   type: "warning",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Back to check!",   closeOnConfirm: false });

  }

});




//change address div when input address in the map
$("#addressInput").on("input", function (e) {
  $("#addressdiv").html($("#addressInput").val())  ;
});


//landuse hover image
$('[data-toggle="popover"]').popover({ trigger: "hover" });


var tableContent = '';

$.getJSON( '/application', function( data ) {

  // For each item in our JSON, add a table row and cells to the content string
  $.each(data, function(){
    tableContent += '<tr>';
    tableContent += '<td>' + this._id + '</td>';
    tableContent += '</tr>';
  });

  // Inject the whole content string into our existing HTML table
  $('#application').html(tableContent);
});
