/**
 * Created by xiaogelunbu on 8/16/16.
 */

//Apkg1
//Change Neighborhood Parking Rate and location category based on input for both Apkg1

$("#TAZinput").change(function(){
  var iffind = 0;
  var tazinput = $(this).val();
  $.each(parkingrate, function(i,v) {
    if (v.TAZ == tazinput) {
      $("#Apkg1rate").html(v.NonResParkingRate);
      NeighborParking = v.NonResParkingRate;
      if (NeighborParking > 1.4){
        $("#Apkg1loc").html("A");
      }
      if (NeighborParking <= 1.4 & NeighborParking > 1){
        $("#Apkg1loc").html("B");
      }
      if (NeighborParking > 0.6 & NeighborParking <=1){
        $("#Apkg1loc").html("C");
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.6){
        $("#Apkg1loc").html("D");
      }
      if (NeighborParking <= 0.2){
        $("#Apkg1loc").html("E");
      }

      iffind = 1;
      return;
    }

    if (iffind === 0){
      $("#Apkg1rate").html("TAZ error");
    }
  })
  updateApkg1();
});



$('#Apkg1').on('switchChange.bootstrapSwitch', function(event, state) {
  updateApkg1();
});

function updateApkg1(){
  if ($('#Apkg1').bootstrapSwitch("state")===true){
    if ($('#AparkingInput') <= 0 | $('#AparkingInput') === ""){
      Apkg1point = 0;
    }
    else{
      if (NeighborParking > 1.4){
        Apkg1point = 1;
      }
      if (NeighborParking > 1 & NeighborParking <= 1.4){
        Apkg1point = 2;
      }
      if (NeighborParking > 0.6 & NeighborParking <= 1){
        Apkg1point = 3;
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.6){
        Apkg1point = 4;
      }
      if (NeighborParking >0  & NeighborParking <= 0.2){
        Apkg1point = 5;
      }
    }
    // $('#Apkg1measurepoint').html('+'+Apkg1point);
  }
  else{
    Apkg1point = 0;
    // $('#Apkg1measurepoint').html('');
  }
  UpdateCurPoint();
}



//Apkg2
$('#Apkg2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Apkg2').bootstrapSwitch("state")===true){
    pointnow += 2;
    console.log(pointnow);
  }
  else{
    pointnow -= 2;
  }

});


//Apkg3
$('#Apkg3').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Apkg3').bootstrapSwitch("state")===true){
    pointnow += 2;
  }
  else{
    pointnow -= 2;
  }

});

//Apkg4
//Change Neighborhood Parking Rate, Project parking rate and location category based on input
var OccupiedArea = 0;
var ProjectParkRate = 0;

$("#TAZinput").change("input",function(e){
  $("#Apkg4rate").html(NeighborParking.toString());
  updateProjectParking();
  updateApkg4();
})

$("#AoccupyareaInput").on("input",function(e){
  OccupiedArea = $("#AoccupyareaInput").val();
  updateProjectParking();
  updateApkg4();
})

$("#AparkingInput").on("input",function(e){
  AparkingSpaceInput = $("#AparkingInput").val();
  updateProjectParking();
  updateApkg4();
})

function updateProjectParking(){
  ProjectParkRate = AparkingSpaceInput/(OccupiedArea/1000);
  $("#Apkg4projectrate").html(ProjectParkRate.toFixed(2).toString());
}


function updateApkg4(){
  if ( ProjectParkRate > NeighborParking){
    pkg4point = 0;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', false);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Parked > neighborhood rate");

  }
  if ( ProjectParkRate ===0 ){
    pkg4point = 11;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option K");
  }
  if ((ProjectParkRate<=NeighborParking*0.1) && (ProjectParkRate>0) ){
    pkg4point = 10;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option J");
  }
  if ( ProjectParkRate<=NeighborParking*0.2 && ProjectParkRate>NeighborParking*0.1 ){
    pkg4point = 9;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option I");
  }
  if ( ProjectParkRate <= (NeighborParking*0.3) && ProjectParkRate > (NeighborParking*0.2) ){
    pkg4point = 8;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option H");
  }
  if ( ProjectParkRate <= (NeighborParking*0.4) && ProjectParkRate > (NeighborParking*0.3) ){
    pkg4point = 7;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option G");
  }
  if ( ProjectParkRate <= (NeighborParking*0.5) && ProjectParkRate > (NeighborParking*0.4) ){
    pkg4point = 6;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option F");
  }
  if ( ProjectParkRate <= (NeighborParking*0.6) && ProjectParkRate > (NeighborParking*0.5) ){
    pkg4point = 5;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option E");
  }
  if ( ProjectParkRate <= (NeighborParking*0.7) && ProjectParkRate > (NeighborParking*0.6) ){
    pkg4point = 4;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option D");
  }
  if ( ProjectParkRate <= (NeighborParking*0.8) && ProjectParkRate > (NeighborParking*0.7) ){
    pkg4point = 3;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option C");

  }
  if ( ProjectParkRate <= (NeighborParking*0.9) && ProjectParkRate > (NeighborParking*0.8) ){
    pkg4point = 2;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option B");

  }
  if ( ProjectParkRate <= (NeighborParking*1) && ProjectParkRate > (NeighborParking*0.9) ){
    pkg4point = 1;
    $('#Apkg4').bootstrapSwitch('disabled', false);
    $('#Apkg4').bootstrapSwitch('state', true);
    $('#Apkg4').bootstrapSwitch('disabled', true);
    $('#Apkg4Opt').html("Option A");

  }
  console.log(pkg4point);
  UpdateCurPoint();
}




//Aact1
$('#Aact1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Aact1').bootstrapSwitch("state")===false){
    $('.Aact1Opt').prop('checked',false);
    pointnow -= Aact1pre;

    Aact1pre = 0;

  }
});

var Aact1pre = 0;
$('.Aact1Opt').change(function() {
  switch($("input[name = Aact1Opt]:checked").val()){
    case "1":
      pointnow -= Aact1pre;
      pointnow += 1;
      Aact1pre = 1;
      break;
    case "2":
      pointnow -= Aact1pre;
      pointnow += 2;
      Aact1pre = 2;
      break;
    default:
      alert("no value");

  };

});


//Aact2
$('#Aact2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Aact2').bootstrapSwitch("state")===false){
    $('.Aact2Opt').prop('checked',false);
    pointnow -= Aact2pre;

    Aact2pre = 0;

  }
});

var Aact2pre = 0;
$('.Aact2Opt').change(function() {
  switch($("input[name = Aact2Opt]:checked").val()){
    case "1":
      pointnow -= Aact2pre;
      pointnow += 1;
      Aact2pre = 1;
      break;
    case "2":
      pointnow -= Aact2pre;
      pointnow += 2;
      Aact2pre = 2;
      break;
    case "3":
      pointnow -= Aact2pre;
      pointnow += 3;
      Aact2pre = 3;
      break;
    case "4":
      pointnow -= Aact2pre;
      pointnow += 4;
      Aact2pre = 4;
      break;
    default:
      alert("no value");

  };

});

//Aact3
$('#Aact3').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Aact3').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Aact4
$('#Aact4').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Aact4').bootstrapSwitch("state")===false){
    $('.Aact4Opt').prop('checked',false);
    pointnow -= Aact4pre;

    Aact4pre = 0;

  }
});

var Aact4pre = 0;
$('.Aact4Opt').change(function() {
  switch($("input[name = Aact4Opt]:checked").val()){
    case "1":
      pointnow -= Aact4pre;
      pointnow += 1;
      Aact4pre = 1;
      break;
    case "2":
      pointnow -= Aact4pre;
      pointnow += 2;
      Aact4pre = 2;
      break;
    default:
      alert("no value");

  };

});

//Aact5a
$('#Aact5a').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Aact5a').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Aact5b
$('#Aact5b').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Aact5b').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Aact6
$('#Aact6').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Aact6').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Aact7
$('#Aact7').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Aact7').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});



//Acshare1
$('#Acshare1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Acshare1').bootstrapSwitch("state")===false){
    $('.Acshare1Opt').prop('checked',false);
    pointnow -= Acshare1pre;

    Acshare1pre = 0;

  }
});

var Acshare1pre = 0;
$('.Acshare1Opt').change(function() {
  switch($("input[name = Acshare1Opt]:checked").val()){
    case "1":
      pointnow -= Acshare1pre;
      pointnow += 1;
      Acshare1pre = 1;
      break;
    case "2":
      pointnow -= Acshare1pre;
      pointnow += 2;
      Acshare1pre = 2;
      break;
    case "3":
      pointnow -= Acshare1pre;
      pointnow += 3;
      Acshare1pre = 3;
      break;
    case "4":
      pointnow -= Acshare1pre;
      pointnow += 4;
      Acshare1pre = 4;
      break;
    case "5":
      pointnow -= Acshare1pre;
      pointnow += 5;
      Acshare1pre = 5;
      break;
    default:
      alert("no value");

  };

});



//Adeli1
$('#Adeli1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Adeli1').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});


//Adeli2
$('#Adeli2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Adeli2').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Afam2
$('#Afam2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Afam2').bootstrapSwitch("state")===true){
    pointnow += 2;
    console.log(pointnow);
  }
  else{
    pointnow -= 2;
  }

});



//Ahov1
$('#Ahov1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Ahov1').bootstrapSwitch("state")===false){
    $('.Ahov1Opt').prop('checked',false);
    pointnow -= Ahov1pre;

    Ahov1pre = 0;

  }
});

var Ahov1pre = 0;
$('.Ahov1Opt').change(function() {
  switch($("input[name = Ahov1Opt]:checked").val()){
    case "1":
      pointnow -= Ahov1pre;
      pointnow += 2;
      Ahov1pre = 2;
      break;
    case "2":
      pointnow -= Ahov1pre;
      pointnow += 4;
      Ahov1pre = 4;
      break;
    case "3":
      pointnow -= Ahov1pre;
      pointnow += 6;
      Ahov1pre = 6;
      break;
    case "4":
      pointnow -= Ahov1pre;
      pointnow += 8;
      Ahov1pre = 8;
      break;
    default:

  };

});


//Ahov2
$('#Ahov2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Ahov2').bootstrapSwitch("state")===false){
    $('.Ahov2Opt').prop('checked',false);
    pointnow -= Ahov2pre;

    Ahov2pre = 0;

  }
});

var Ahov2pre = 0;
$('.Ahov2Opt').change(function() {
  switch($("input[name = Ahov2Opt]:checked").val()){
    case "1":
      pointnow -= Ahov2pre;
      pointnow += 7;
      Ahov2pre = 7;
      break;
    case "2":
      pointnow -= Ahov2pre;
      pointnow += 14;
      Ahov2pre = 14;
      break;
    default:
      alert("no value")
  };

});


//Ahov3
$("#AgrossareaInput").on("input",function(e){
  updateAhov3();
});


$('#Ahov3').on('switchChange.bootstrapSwitch', function(event, state) {
  updateAhov3();
});

function updateAhov3(){
  var grossareaInput = $("#AgrossareaInput").val();
  console.log(grossareaInput);
  if ($('#Ahov3').bootstrapSwitch("state")===true){
    if(grossareaInput < 100000){
      $('#hov3Opt').html("Option A");
      hov3point = 1;
      UpdateCurPoint();
    }
    if(grossareaInput >= 100000 & grossareaInput < 200000 ){
      $('#hov3Opt').html("Option B");
      hov3point = 2;
      UpdateCurPoint();
    }
    if(grossareaInput >= 200000 & grossareaInput < 300000 ){
      $('#hov3Opt').html("Option C");
      hov3point = 3;
      UpdateCurPoint();
    }
    if(grossareaInput >= 300000 & grossareaInput < 400000 ){
      $('#hov3Opt').html("Option D");
      hov3point = 4;
      UpdateCurPoint();
    }
    if(grossareaInput >= 400000 & grossareaInput < 500000 ){
      $('#hov3Opt').html("Option E");
      hov3point = 5;
      UpdateCurPoint();
    }
    if(grossareaInput >= 500000 & grossareaInput < 600000 ){
      $('#hov3Opt').html("Option F");
      hov3point = 6;
      UpdateCurPoint();
    }
    if(grossareaInput >= 600000 ){
      $('#hov3Opt').html("Option G");
      hov3point = 7;
      UpdateCurPoint();
    }



  }
  else{
    hov3point = 0;
    $('#hov3Opt').html("")
    UpdateCurPoint();
  }

  console.log(hov3point);

}

//Ainfo1
$('#Ainfo1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Ainfo1').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Ainfo2
$('#Ainfo2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Ainfo2').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});


//Ainfo3
$('#Ainfo3').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Ainfo3').bootstrapSwitch("state")===false){
    $('.Ainfo3Opt').prop('checked',false);
    pointnow -= Ainfo3pre;

    Ainfo3pre = 0;

  }
});

var Ainfo3pre = 0;
$('.Ainfo3Opt').change(function() {
  switch($("input[name = Ainfo3Opt]:checked").val()){
    case "1":
      pointnow -= Ainfo3pre;
      pointnow += 1;
      Ainfo3pre = 1;
      break;
    case "2":
      pointnow -= Ainfo3pre;
      pointnow += 2;
      Ainfo3pre = 2;
      break;
    case "3":
      pointnow -= Ainfo3pre;
      pointnow += 3;
      Ainfo3pre = 3;
      break;
    case "4":
      pointnow -= Ainfo3pre;
      pointnow += 4;
      Ainfo3pre = 4;
      break;
    default:

  };

});


//Alu1
$('#Alu1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Alu1').bootstrapSwitch("state")===true){
    pointnow += 2;
    console.log(pointnow);
  }
  else{
    pointnow -= 2;
  }

});





//Bpkg1
//Change Neighborhood Parking Rate and location category based on input
var NeighborParking = 0;
$("#TAZinput").change("input",function(e){
  var iffind = 0;
  var tazinput = $(this).val();
  $.each(parkingrate, function(i,v) {
    if (v.TAZ == tazinput) {
      $("#Bpkg1rate").html(v.NonResParkingRate);

      NeighborParking = v.NonResParkingRate;
      if (NeighborParking > 1.4){
        $("#Bpkg1loc").html("A");
      }
      if (NeighborParking <= 1.4 & NeighborParking > 1){
        $("#Bpkg1loc").html("B");
      }
      if (NeighborParking > 0.6 & NeighborParking <=1){
        $("#Bpkg1loc").html("C");
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.6){
        $("#Bpkg1loc").html("D");
      }
      if (NeighborParking <= 0.2){
        $("#Bpkg1loc").html("E");
      }

      iffind = 1;
      return;
    }

    if (iffind === 0){
      $("#Bpkg1rate").html("TAZ error");
    }
  })
  updateBpkg1();
});



$('#Bpkg1').on('switchChange.bootstrapSwitch', function(event, state) {
  updateBpkg1();
});

function updateBpkg1(){
  if ($('#Bpkg1').bootstrapSwitch("state")===true){
    if ($('#BparkingInput') <= 0 | $('#BparkingInput') === ""){
      Bpkg1point = 0;
    }
    else{
      if (NeighborParking > 1.4){
        Bpkg1point = 1;
      }
      if (NeighborParking > 1 & NeighborParking <= 1.4){
        Bpkg1point = 2;
      }
      if (NeighborParking > 0.6 & NeighborParking <= 1){
        Bpkg1point = 3;
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.6){
        Bpkg1point = 4;
      }
      if (NeighborParking >0  & NeighborParking <= 0.2){
        Bpkg1point = 5;
      }
    }
  }
  else{
    Bpkg1point = 0;
  }
  UpdateCurPoint();
}



//Bpkg2
$('#Bpkg2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bpkg2').bootstrapSwitch("state")===true){
    pointnow += 2;
  }
  else{
    pointnow -= 2;
  }

});


//Bpkg3
$('#Bpkg3').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bpkg3').bootstrapSwitch("state")===true){
    pointnow += 2;
  }
  else{
    pointnow -= 2;
  }

});

//Bpkg4
//ChBnge Neighborhood Parking Rate, Project parking rate and location category based on input

$("#TAZinput").change("input",function(e){
  $("#Bpkg4rate").html(NeighborParking.toString());
  updateBProjectParking();
  updateBpkg4();
})

$("#BoccupyareaInput").on("input",function(e){
  OccupiedArea = $("#BoccupyareaInput").val();
  updateBProjectParking();
  updateBpkg4();
})

$("#BparkingInput").on("input",function(e){
  BparkingSpaceInput = $("#BparkingInput").val();
  updateBProjectParking();
  updateBpkg4();
})

function updateBProjectParking(){
  ProjectParkRate = BparkingSpaceInput/(OccupiedArea/1000);
  $("#Bpkg4projectrate").html(ProjectParkRate.toFixed(2).toString());
}


function updateBpkg4(){
  if ( ProjectParkRate > NeighborParking){
    pkg4point = 0;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', false);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Parked > neighborhood rate");

  }
  if ( ProjectParkRate ===0 ){
    pkg4point = 11;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option K");
  }
  if ((ProjectParkRate<=NeighborParking*0.1) && (ProjectParkRate>0) ){
    pkg4point = 10;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option J");
  }
  if ( ProjectParkRate<=NeighborParking*0.2 && ProjectParkRate>NeighborParking*0.1 ){
    pkg4point = 9;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option I");
  }
  if ( ProjectParkRate <= (NeighborParking*0.3) && ProjectParkRate > (NeighborParking*0.2) ){
    pkg4point = 8;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option H");
  }
  if ( ProjectParkRate <= (NeighborParking*0.4) && ProjectParkRate > (NeighborParking*0.3) ){
    pkg4point = 7;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option G");
  }
  if ( ProjectParkRate <= (NeighborParking*0.5) && ProjectParkRate > (NeighborParking*0.4) ){
    pkg4point = 6;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option F");
  }
  if ( ProjectParkRate <= (NeighborParking*0.6) && ProjectParkRate > (NeighborParking*0.5) ){
    pkg4point = 5;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option E");
  }
  if ( ProjectParkRate <= (NeighborParking*0.7) && ProjectParkRate > (NeighborParking*0.6) ){
    pkg4point = 4;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option D");
  }
  if ( ProjectParkRate <= (NeighborParking*0.8) && ProjectParkRate > (NeighborParking*0.7) ){
    pkg4point = 3;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option C");

  }
  if ( ProjectParkRate <= (NeighborParking*0.9) && ProjectParkRate > (NeighborParking*0.8) ){
    pkg4point = 2;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option B");

  }
  if ( ProjectParkRate <= (NeighborParking*1) && ProjectParkRate > (NeighborParking*0.9) ){
    pkg4point = 1;
    $('#Bpkg4').bootstrapSwitch('disabled', false);
    $('#Bpkg4').bootstrapSwitch('state', true);
    $('#Bpkg4').bootstrapSwitch('disabled', true);
    $('#Bpkg4Opt').html("Option A");

  }
  console.log(pkg4point);
  UpdateCurPoint();
}



//Bact1
$('#Bact1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bact1').bootstrapSwitch("state")===false){
    $('.Bact1Opt').prop('checked',false);
    pointnow -= Bact1pre;

    Bact1pre = 0;

  }
});

var Bact1pre = 0;
$('.Bact1Opt').change(function() {
  switch($("input[name = Bact1Opt]:checked").val()){
    case "1":
      pointnow -= Bact1pre;
      pointnow += 1;
      Bact1pre = 1;
      break;
    case "2":
      pointnow -= Bact1pre;
      pointnow += 2;
      Bact1pre = 2;
      break;
    default:
      alert("no value");

  };

});


//Bact2
$('#Bact2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bact2').bootstrapSwitch("state")===false){
    $('.Bact2Opt').prop('checked',false);
    pointnow -= Bact2pre;

    Bact2pre = 0;

  }
});

var Bact2pre = 0;
$('.Bact2Opt').change(function() {
  switch($("input[name = Bact2Opt]:checked").val()){
    case "1":
      pointnow -= Bact2pre;
      pointnow += 1;
      Bact2pre = 1;
      break;
    case "2":
      pointnow -= Bact2pre;
      pointnow += 2;
      Bact2pre = 2;
      break;
    case "3":
      pointnow -= Bact2pre;
      pointnow += 3;
      Bact2pre = 3;
      break;
    case "4":
      pointnow -= Bact2pre;
      pointnow += 4;
      Bact2pre = 4;
      break;
    default:
      alert("no value");

  };

});

//Bact3
$('#Bact3').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bact3').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Bact4
$('#Bact4').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bact4').bootstrapSwitch("state")===false){
    $('.Bact4Opt').prop('checked',false);
    pointnow -= Bact4pre;

    Bact4pre = 0;

  }
});

var Bact4pre = 0;
$('.Bact4Opt').change(function() {
  switch($("input[name = Bact4Opt]:checked").val()){
    case "1":
      pointnow -= Bact4pre;
      pointnow += 1;
      Bact4pre = 1;
      break;
    case "2":
      pointnow -= Bact4pre;
      pointnow += 2;
      Bact4pre = 2;
      break;
    default:
      alert("no value");

  };

});

//Bact5a
$('#Bact5a').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bact5a').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Bact5b
$('#Bact5b').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bact5b').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Bact6
$('#Bact6').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bact6').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});



//Bcshare1
$('#Bcshare1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bcshare1').bootstrapSwitch("state")===false){
    $('.Bcshare1Opt').prop('checked',false);
    pointnow -= Bcshare1pre;

    Bcshare1pre = 0;

  }
});

var Bcshare1pre = 0;
$('.Bcshare1Opt').change(function() {
  switch($("input[name = Bcshare1Opt]:checked").val()){
    case "1":
      pointnow -= Bcshare1pre;
      pointnow += 1;
      Bcshare1pre = 1;
      break;
    case "2":
      pointnow -= Bcshare1pre;
      pointnow += 2;
      Bcshare1pre = 2;
      break;
    case "3":
      pointnow -= Bcshare1pre;
      pointnow += 3;
      Bcshare1pre = 3;
      break;
    case "4":
      pointnow -= Bcshare1pre;
      pointnow += 4;
      Bcshare1pre = 4;
      break;
    case "5":
      pointnow -= Bcshare1pre;
      pointnow += 5;
      Bcshare1pre = 5;
      break;
    default:
      alert("no value");

  };

});



//Bdeli1
$('#Bdeli1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bdeli1').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});



//Bfam2
$('#Bfam2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bfam2').bootstrapSwitch("state")===true){
    pointnow += 2;
    console.log(pointnow);
  }
  else{
    pointnow -= 2;
  }

});



//Bhov1
$('#Bhov1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bhov1').bootstrapSwitch("state")===false){
    $('.Bhov1Opt').prop('checked',false);
    pointnow -= Bhov1pre;

    Bhov1pre = 0;

  }
});

var Bhov1pre = 0;
$('.Bhov1Opt').change(function() {
  switch($("input[name = Bhov1Opt]:checked").val()){
    case "1":
      pointnow -= Bhov1pre;
      pointnow += 2;
      Bhov1pre = 2;
      break;
    case "2":
      pointnow -= Bhov1pre;
      pointnow += 4;
      Bhov1pre = 4;
      break;
    case "3":
      pointnow -= Bhov1pre;
      pointnow += 6;
      Bhov1pre = 6;
      break;
    case "4":
      pointnow -= Bhov1pre;
      pointnow += 8;
      Bhov1pre = 8;
      break;
    default:

  };

});


//Bhov2
$('#Bhov2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Bhov2').bootstrapSwitch("state")===false){
    $('.Bhov2Opt').prop('checked',false);
    pointnow -= Bhov2pre;

    Bhov2pre = 0;

  }
});

var Bhov2pre = 0;
$('.Bhov2Opt').change(function() {
  switch($("input[name = Bhov2Opt]:checked").val()){
    case "1":
      pointnow -= Bhov2pre;
      pointnow += 7;
      Bhov2pre = 7;
      break;
    case "2":
      pointnow -= Bhov2pre;
      pointnow += 14;
      Bhov2pre = 14;
      break;
    default:
      alert("no value")
  };

});


//Bhov3
$("#BgrossareaInput").on("input",function(e){
  updateBhov3();
});


$('#Bhov3').on('switchChange.bootstrapSwitch', function(event, state) {
  updateBhov3();
});

function updateBhov3(){
  var grossareaInput = $("#BgrossareaInput").val();
  console.log(grossareaInput);
  if ($('#Bhov3').bootstrapSwitch("state")===true){
    if(grossareaInput < 100000){
      $('#hov3Opt').html("Option A");
      hov3point = 1;
      UpdateCurPoint();
    }
    if(grossareaInput >= 100000 & grossareaInput < 200000 ){
      $('#hov3Opt').html("Option B");
      hov3point = 2;
      UpdateCurPoint();
    }
    if(grossareaInput >= 200000 & grossareaInput < 300000 ){
      $('#hov3Opt').html("Option C");
      hov3point = 3;
      UpdateCurPoint();
    }
    if(grossareaInput >= 300000 & grossareaInput < 400000 ){
      $('#hov3Opt').html("Option D");
      hov3point = 4;
      UpdateCurPoint();
    }
    if(grossareaInput >= 400000 & grossareaInput < 500000 ){
      $('#hov3Opt').html("Option E");
      hov3point = 5;
      UpdateCurPoint();
    }
    if(grossareaInput >= 500000 & grossareaInput < 600000 ){
      $('#hov3Opt').html("Option F");
      hov3point = 6;
      UpdateCurPoint();
    }
    if(grossareaInput >= 600000 ){
      $('#hov3Opt').html("Option G");
      hov3point = 7;
      UpdateCurPoint();
    }



  }
  else{
    hov3point = 0;
    $('#hov3Opt').html("")
    UpdateCurPoint();
  }

  console.log(hov3point);

}

//Binfo1
$('#Binfo1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Binfo1').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Binfo2
$('#Binfo2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Binfo2').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});


//Binfo3
$('#Binfo3').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Binfo3').bootstrapSwitch("state")===false){
    $('.Binfo3Opt').prop('checked',false);
    pointnow -= Binfo3pre;

    Binfo3pre = 0;

  }
});

var Binfo3pre = 0;
$('.Binfo3Opt').change(function() {
  switch($("input[name = Binfo3Opt]:checked").val()){
    case "1":
      pointnow -= Binfo3pre;
      pointnow += 1;
      Binfo3pre = 1;
      break;
    case "2":
      pointnow -= Binfo3pre;
      pointnow += 2;
      Binfo3pre = 2;
      break;
    case "3":
      pointnow -= Binfo3pre;
      pointnow += 3;
      Binfo3pre = 3;
      break;
    case "4":
      pointnow -= Binfo3pre;
      pointnow += 4;
      Binfo3pre = 4;
      break;
    default:

  };

});




//C current point

//Cpkg1
//Change Neighborhood Parking Rate and location category based on input
var NeighborParking = 0;
$("#TAZinput").change("input",function(e){
  var iffind = 0;
  var tazinput = $(this).val();
  $.each(parkingrate, function(i,v) {
    if (v.TAZ == tazinput) {
      $("#Cpkg1rate").html(v.ResParkingRateLow);

      NeighborParking = v.ResParkingRateLow;
      if (NeighborParking > 0.8){
        $("#Cpkg1loc").html("A");
      }
      if (NeighborParking <= 0.8 & NeighborParking > 0.6){
        $("#Cpkg1loc").html("B");
      }
      if (NeighborParking > 0.4 & NeighborParking <=0.6){
        $("#Cpkg1loc").html("C");
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.4){
        $("#Cpkg1loc").html("D");
      }
      if (NeighborParking <= 0.2){
        $("#Cpkg1loc").html("E");
      }

      iffind = 1;
      return;
    }

    if (iffind === 0){
      $("#Cpkg1rate").html("TAZ error");
    }
  })
  updateCpkg1();
});



$('#Cpkg1').on('switchChange.bootstrapSwitch', function(event, state) {
  updateCpkg1();
});

function updateCpkg1(){
  if ($('#Cpkg1').bootstrapSwitch("state")===true){
    if ($('#CparkingInput') <= 0 | $('#CparkingInput') === ""){
      Cpkg1point = 0;
    }
    else{
      if (NeighborParking > 0.8){
        Cpkg1point = 1;
      }
      if (NeighborParking > 0.6 & NeighborParking <= 0.8){
        Cpkg1point = 2;
      }
      if (NeighborParking > 0.4 & NeighborParking <= 0.6){
        Cpkg1point = 3;
      }
      if (NeighborParking > 0.2 & NeighborParking <= 0.4){
        Cpkg1point = 4;
      }
      if (NeighborParking >0  & NeighborParking <= 0.2){
        Cpkg1point = 5;
      }
    }
  }
  else{
    Cpkg1point = 0;
  }
  UpdateCurPoint();
}


//Cpkg4
//Change Neighborhood Parking Rate, Project parking rate and location category based on input

$("#TAZinput").change("input",function(e){
  $("#Cpkg4rate").html(NeighborParking.toString());
  updateCProjectParking();
  updateCpkg4();
})

$("#Cunitbed").on("input",function(e){
  PersentageTwoBed = $("#Cunitbed").val();
  updateCProjectParking();
  updateCpkg4();
})

$("#CparkingInput").on("input",function(e){
  CparkingSpaceInput = $("#CparkingInput").val();
  updateCProjectParking();
  updateCpkg4();
})

function updateCProjectParking(){
  ProjectParkRate = CparkingSpaceInput/(PersentageTwoBed);
  $("#Cpkg4projectrate").html(ProjectParkRate.toFixed(2).toString());
}


function updateCpkg4(){
  if ( ProjectParkRate > NeighborParking){
    pkg4point = 0;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', false);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Parked > neighborhood rate");

  }
  if ( ProjectParkRate ===0 ){
    pkg4point = 11;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option K");
  }
  if ((ProjectParkRate<=NeighborParking*0.1) && (ProjectParkRate>0) ){
    pkg4point = 10;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option J");
  }
  if ( ProjectParkRate<=NeighborParking*0.2 && ProjectParkRate>NeighborParking*0.1 ){
    pkg4point = 9;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option I");
  }
  if ( ProjectParkRate <= (NeighborParking*0.3) && ProjectParkRate > (NeighborParking*0.2) ){
    pkg4point = 8;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option H");
  }
  if ( ProjectParkRate <= (NeighborParking*0.4) && ProjectParkRate > (NeighborParking*0.3) ){
    pkg4point = 7;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option G");
  }
  if ( ProjectParkRate <= (NeighborParking*0.5) && ProjectParkRate > (NeighborParking*0.4) ){
    pkg4point = 6;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option F");
  }
  if ( ProjectParkRate <= (NeighborParking*0.6) && ProjectParkRate > (NeighborParking*0.5) ){
    pkg4point = 5;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option E");
  }
  if ( ProjectParkRate <= (NeighborParking*0.7) && ProjectParkRate > (NeighborParking*0.6) ){
    pkg4point = 4;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option D");
  }
  if ( ProjectParkRate <= (NeighborParking*0.8) && ProjectParkRate > (NeighborParking*0.7) ){
    pkg4point = 3;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option C");

  }
  if ( ProjectParkRate <= (NeighborParking*0.9) && ProjectParkRate > (NeighborParking*0.8) ){
    pkg4point = 2;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option B");

  }
  if ( ProjectParkRate <= (NeighborParking*1) && ProjectParkRate > (NeighborParking*0.9) ){
    pkg4point = 1;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option A");

  }
  console.log(pkg4point);
  UpdateCurPoint();
}




//Cact1
$('#Cact1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cact1').bootstrapSwitch("state")===false){
    $('.Cact1Opt').prop('checked',false);
    pointnow -= Cact1pre;

    Cact1pre = 0;

  }
});

var Cact1pre = 0;
$('.Cact1Opt').change(function() {
  switch($("input[name = Cact1Opt]:checked").val()){
    case "1":
      pointnow -= Cact1pre;
      pointnow += 1;
      Cact1pre = 1;
      break;
    case "2":
      pointnow -= Cact1pre;
      pointnow += 2;
      Cact1pre = 2;
      break;
    default:
      alert("no value");

  };

});


//Cact2
$('#Cact2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cact2').bootstrapSwitch("state")===false){
    $('.Cact2Opt').prop('checked',false);
    pointnow -= Cact2pre;

    Cact2pre = 0;

  }
});

var Cact2pre = 0;
$('.Cact2Opt').change(function() {
  switch($("input[name = Cact2Opt]:checked").val()){
    case "1":
      pointnow -= Cact2pre;
      pointnow += 1;
      Cact2pre = 1;
      break;
    case "2":
      pointnow -= Cact2pre;
      pointnow += 2;
      Cact2pre = 2;
      break;
    case "3":
      pointnow -= Cact2pre;
      pointnow += 3;
      Cact2pre = 3;
      break;
    case "4":
      pointnow -= Cact2pre;
      pointnow += 4;
      Cact2pre = 4;
      break;
    default:
      alert("no value");

  };

});


//Cact4
$('#Cact4').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cact4').bootstrapSwitch("state")===false){
    $('.Cact4Opt').prop('checked',false);
    pointnow -= Cact4pre;

    Cact4pre = 0;

  }
});

var Cact4pre = 0;
$('.Cact4Opt').change(function() {
  switch($("input[name = Cact4Opt]:checked").val()){
    case "1":
      pointnow -= Cact4pre;
      pointnow += 1;
      Cact4pre = 1;
      break;
    case "2":
      pointnow -= Cact4pre;
      pointnow += 2;
      Cact4pre = 2;
      break;
    default:
      alert("no value");

  };

});

//Cact5a
$('#Cact5a').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cact5a').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Cact5b
$('#Cact5b').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cact5b').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Cact6
$('#Cact6').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cact6').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});



//Ccshare1

$('#Ccshare1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Ccshare1').bootstrapSwitch("state")===false){
    $('.Ccshare1Opt').prop('checked',false);
    pointnow -= Ccshare1pre;
    Ccshare1point = 0;
    Ccshare1pre = 0;

  }
});

var Ccshare1pre = 0;
$('.Ccshare1Opt').change(function() {
  switch($("input[name = Ccshare1Opt]:checked").val()){
    case "1":
      pointnow -= Ccshare1pre;
      pointnow += 1;
      Ccshare1pre = 1;
      Ccshare1point = 1;
      break;
    case "2":
      pointnow -= Ccshare1pre;
      pointnow += 2;
      Ccshare1pre = 2;
      Ccshare1point = 2;
      break;
    case "3":
      pointnow -= Ccshare1pre;
      pointnow += 3;
      Ccshare1pre = 3;
      Ccshare1point = 3;
      break;
    case "4":
      pointnow -= Ccshare1pre;
      pointnow += 4;
      Ccshare1pre = 4;
      Ccshare1point = 4;
      break;
    case "5":
      pointnow -= Ccshare1pre;
      pointnow += 5;
      Ccshare1pre = 5;
      Ccshare1point = 5;
      break;
    default:
      alert("no value");

  };

});



//Cdeli1
$('#Cdeli1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cdeli1').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Cfam1


$('#Cfam1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cfam1').bootstrapSwitch("state")===false){
    $('.Cfam1Opt').prop('checked',false);
    Cfam1point = 0;
    UpdateCurPoint();
    console.log("0");
  }
});

$('.Cfam1Opt').change(function() {
  if ($('#Cfam1OptA').prop("checked") || $('#Cfam1OptB').prop("checked") ){
    Cfam1point = 1;
    UpdateCurPoint();
    console.log("1");

  }
  if ($('#Cfam1OptA').prop("checked") && $('#Cfam1OptB').prop("checked") ){
    Cfam1point = 2;
    UpdateCurPoint();
    console.log("2");

  }
  if (!($('#Cfam1OptA').prop("checked")) && !($('#Cfam1OptB').prop("checked"))){
    Cfam1point = 0;
    UpdateCurPoint();
    console.log("3");

  }
});



//Cfam2
$('#Cfam2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cfam2').bootstrapSwitch("state")===true){
    pointnow += 2;
    console.log(pointnow);
  }
  else{
    pointnow -= 2;
  }

});

//Cfam3
$("#CtwobedroomInput").on("input",function(e){
  updateCfam3();
})
$('#Cfam1').on('switchChange.bootstrapSwitch', function(event, state) {
  updateCfam3();
})
$('.Cfam1Opt').change(function() {
  updateCfam3();
}   )
$('.Ccshare1').change(function() {
  updateCfam3();
})
$('.Ccshare1Opt').change(function() {
  updateCfam3();
})

function updateCfam3(){
  if ( ProjectParkRate > NeighborParking){
    pkg4point = 0;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', false);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Parked > neighborhood rate");

  }
  if ( ProjectParkRate ===0 ){
    pkg4point = 11;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option K");
  }
  if ((ProjectParkRate<=NeighborParking*0.1) && (ProjectParkRate>0) ){
    pkg4point = 10;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option J");
  }
  if ( ProjectParkRate<=NeighborParking*0.2 && ProjectParkRate>NeighborParking*0.1 ){
    pkg4point = 9;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option I");
  }
  if ( ProjectParkRate <= (NeighborParking*0.3) && ProjectParkRate > (NeighborParking*0.2) ){
    pkg4point = 8;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option H");
  }
  if ( ProjectParkRate <= (NeighborParking*0.4) && ProjectParkRate > (NeighborParking*0.3) ){
    pkg4point = 7;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option G");
  }
  if ( ProjectParkRate <= (NeighborParking*0.5) && ProjectParkRate > (NeighborParking*0.4) ){
    pkg4point = 6;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option F");
  }
  if ( ProjectParkRate <= (NeighborParking*0.6) && ProjectParkRate > (NeighborParking*0.5) ){
    pkg4point = 5;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option E");
  }
  if ( ProjectParkRate <= (NeighborParking*0.7) && ProjectParkRate > (NeighborParking*0.6) ){
    pkg4point = 4;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option D");
  }
  if ( ProjectParkRate <= (NeighborParking*0.8) && ProjectParkRate > (NeighborParking*0.7) ){
    pkg4point = 3;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option C");

  }
  if ( ProjectParkRate <= (NeighborParking*0.9) && ProjectParkRate > (NeighborParking*0.8) ){
    pkg4point = 2;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option B");

  }
  if ( ProjectParkRate <= (NeighborParking*1) && ProjectParkRate > (NeighborParking*0.9) ){
    pkg4point = 1;
    $('#Cpkg4').bootstrapSwitch('disabled', false);
    $('#Cpkg4').bootstrapSwitch('state', true);
    $('#Cpkg4').bootstrapSwitch('disabled', true);
    $('#Cpkg4Opt').html("Option A");

  }
  UpdateCurPoint();
}



//Chov1
$('#Chov1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Chov1').bootstrapSwitch("state")===false){
    $('.Chov1Opt').prop('checked',false);
    pointnow -= Chov1pre;

    Chov1pre = 0;

  }
});

var Chov1pre = 0;
$('.Chov1Opt').change(function() {
  switch($("input[name = Chov1Opt]:checked").val()){
    case "1":
      pointnow -= Chov1pre;
      pointnow += 2;
      Chov1pre = 2;
      break;
    case "2":
      pointnow -= Chov1pre;
      pointnow += 4;
      Chov1pre = 4;
      break;
    case "3":
      pointnow -= Chov1pre;
      pointnow += 6;
      Chov1pre = 6;
      break;
    case "4":
      pointnow -= Chov1pre;
      pointnow += 8;
      Chov1pre = 8;
      break;
    default:

  };

});


//Chov2
$('#Chov2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Chov2').bootstrapSwitch("state")===false){
    $('.Chov2Opt').prop('checked',false);
    pointnow -= Chov2pre;

    Chov2pre = 0;

  }
});

var Chov2pre = 0;
$('.Chov2Opt').change(function() {
  switch($("input[name = Chov2Opt]:checked").val()){
    case "1":
      pointnow -= Chov2pre;
      pointnow += 7;
      Chov2pre = 7;
      break;
    case "2":
      pointnow -= Chov2pre;
      pointnow += 14;
      Chov2pre = 14;
      break;
    default:
      alert("no value")
  };

});


//Cinfo1
$('#Cinfo1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cinfo1').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Cinfo2
$('#Cinfo2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cinfo2').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});


//Cinfo3
$('#Cinfo3').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Cinfo3').bootstrapSwitch("state")===false){
    $('.Cinfo3Opt').prop('checked',false);
    pointnow -= Cinfo3pre;

    Cinfo3pre = 0;

  }
});

var Cinfo3pre = 0;
$('.Cinfo3Opt').change(function() {
  switch($("input[name = Cinfo3Opt]:checked").val()){
    case "1":
      pointnow -= Cinfo3pre;
      pointnow += 1;
      Cinfo3pre = 1;
      break;
    case "2":
      pointnow -= Cinfo3pre;
      pointnow += 2;
      Cinfo3pre = 2;
      break;
    case "3":
      pointnow -= Cinfo3pre;
      pointnow += 3;
      Cinfo3pre = 3;
      break;
    case "4":
      pointnow -= Cinfo3pre;
      pointnow += 4;
      Cinfo3pre = 4;
      break;
    default:

  };

});


//Clu2
$('#Clu2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Clu2').bootstrapSwitch("state")===false){
    $('.Clu2Opt').prop('checked',false);
    pointnow -= Clu2pre;

    Clu2pre = 0;

  }
});

var Clu2pre = 0;
$('.Clu2Opt').change(function() {
  switch($("input[name = Clu2Opt]:checked").val()){
    case "1":
      pointnow -= Clu2pre;
      pointnow += 1;
      Clu2pre = 1;
      break;
    case "2":
      pointnow -= Clu2pre;
      pointnow += 2;
      Clu2pre = 2;
      break;
    case "3":
      pointnow -= Clu2pre;
      pointnow += 3;
      Clu2pre = 3;
      break;
    case "4":
      pointnow -= Clu2pre;
      pointnow += 4;
      Clu2pre = 4;
      break;
    default:

  };

});



//Dpkg4
//Change Neighborhood Parking Rate, Project parking rate and location category based on input

$("#TAZinput").change("input",function(e){
  $("#Dpkg4rate").html(NeighborParking.toString());
  updateDProjectParking();
  updateDpkg4();
})

$("#DoccupyareaInput").on("input",function(e){
  OccupiedArea = $("#DoccupyareaInput").val();
  updateDProjectParking();
  updateDpkg4();
})

$("#DparkingInput").on("input",function(e){
  DparkingSpaceInput = $("#DparkingInput").val();
  updateDProjectParking();
  updateDpkg4();
})

function updateDProjectParking(){
  ProjectParkRate = DparkingSpaceInput/(OccupiedArea/1000);
  $("#Dpkg4projectrate").html(ProjectParkRate.toFixed(2).toString());
}


function updateDpkg4(){
  if ( ProjectParkRate > NeighborParking){
    pkg4point = 0;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', false);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Parked > neighborhood rate");

  }
  if ( ProjectParkRate ===0 ){
    pkg4point = 11;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option K");
  }
  if ((ProjectParkRate<=NeighborParking*0.1) && (ProjectParkRate>0) ){
    pkg4point = 10;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option J");
  }
  if ( ProjectParkRate<=NeighborParking*0.2 && ProjectParkRate>NeighborParking*0.1 ){
    pkg4point = 9;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option I");
  }
  if ( ProjectParkRate <= (NeighborParking*0.3) && ProjectParkRate > (NeighborParking*0.2) ){
    pkg4point = 8;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option H");
  }
  if ( ProjectParkRate <= (NeighborParking*0.4) && ProjectParkRate > (NeighborParking*0.3) ){
    pkg4point = 7;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option G");
  }
  if ( ProjectParkRate <= (NeighborParking*0.5) && ProjectParkRate > (NeighborParking*0.4) ){
    pkg4point = 6;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option F");
  }
  if ( ProjectParkRate <= (NeighborParking*0.6) && ProjectParkRate > (NeighborParking*0.5) ){
    pkg4point = 5;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option E");
  }
  if ( ProjectParkRate <= (NeighborParking*0.7) && ProjectParkRate > (NeighborParking*0.6) ){
    pkg4point = 4;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option D");
  }
  if ( ProjectParkRate <= (NeighborParking*0.8) && ProjectParkRate > (NeighborParking*0.7) ){
    pkg4point = 3;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option C");

  }
  if ( ProjectParkRate <= (NeighborParking*0.9) && ProjectParkRate > (NeighborParking*0.8) ){
    pkg4point = 2;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option B");

  }
  if ( ProjectParkRate <= (NeighborParking*1) && ProjectParkRate > (NeighborParking*0.9) ){
    pkg4point = 1;
    $('#Dpkg4').bootstrapSwitch('disabled', false);
    $('#Dpkg4').bootstrapSwitch('state', true);
    $('#Dpkg4').bootstrapSwitch('disabled', true);
    $('#Dpkg4Opt').html("Option A");

  }
  console.log(pkg4point);
  UpdateCurPoint();
}


//Dact2
$('#Dact2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Dact2').bootstrapSwitch("state")===false){
    $('.Dact2Opt').prop('checked',false);
    pointnow -= Dact2pre;

    Dact2pre = 0;

  }
});

var Dact2pre = 0;
$('.Dact2Opt').change(function() {
  switch($("input[name = Dact2Opt]:checked").val()){
    case "1":
      pointnow -= Dact2pre;
      pointnow += 1;
      Dact2pre = 1;
      break;
    case "2":
      pointnow -= Dact2pre;
      pointnow += 2;
      Dact2pre = 2;
      break;
    case "3":
      pointnow -= Dact2pre;
      pointnow += 3;
      Dact2pre = 3;
      break;
    case "4":
      pointnow -= Dact2pre;
      pointnow += 4;
      Dact2pre = 4;
      break;
    default:
      alert("no value");

  };

});

//Dact3
$('#Dact3').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Dact3').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});



//Dcshare1
$('#Dcshare1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Dcshare1').bootstrapSwitch("state")===false){
    $('.Dcshare1Opt').prop('checked',false);
    pointnow -= Dcshare1pre;

    Dcshare1pre = 0;

  }
});

var Dcshare1pre = 0;
$('.Dcshare1Opt').change(function() {
  switch($("input[name = Dcshare1Opt]:checked").val()){
    case "1":
      pointnow -= Dcshare1pre;
      pointnow += 1;
      Dcshare1pre = 1;
      break;
    case "2":
      pointnow -= Dcshare1pre;
      pointnow += 2;
      Dcshare1pre = 2;
      break;
    case "3":
      pointnow -= Dcshare1pre;
      pointnow += 3;
      Dcshare1pre = 3;
      break;
    case "4":
      pointnow -= Dcshare1pre;
      pointnow += 4;
      Dcshare1pre = 4;
      break;
    case "5":
      pointnow -= Dcshare1pre;
      pointnow += 5;
      Dcshare1pre = 5;
      break;
    default:
      alert("no value");

  };

});



//Dinfo1
$('#Dinfo1').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Dinfo1').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});

//Dinfo2
$('#Dinfo2').on('switchChange.bootstrapSwitch', function(event, state) {
  if ($('#Dinfo2').bootstrapSwitch("state")===true){
    pointnow += 1;
    console.log(pointnow);
  }
  else{
    pointnow -= 1;
  }

});






$("[type='checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
  UpdateCurPoint();
});

$(".OptButtion").change(function(event, state) {
  UpdateCurPoint();
});

$(["<input>"]).change(function(event, state) {
  UpdateCurPoint();
});



var CurPointSum = 0;
function UpdateCurPoint(){
  if($('#radios-0').is(':checked')){
    CurPointSum = pointnow + Apkg1point + pkg4point + hov3point + Cfam1point ;
    $('#pointnow').html(CurPointSum.toString());
  }
  if($('#radios-1').is(':checked')){
    CurPointSum = pointnow + Apkg1point + pkg4point + hov3point + Cfam1point ;
    $('#pointnow').html(CurPointSum.toString());
  }
  if($('#radios-2').is(':checked')){
    CurPointSum = pointnow + Apkg1point + pkg4point + hov3point + Cfam1point ;
    $('#pointnow').html(CurPointSum.toString());
  }
  if($('#radios-3').is(':checked')){
    CurPointSum = pointnow + Apkg1point + pkg4point + hov3point + Cfam1point ;
    $('#pointnow').html(CurPointSum.toString());
  }
  $("#AcurrentPointTodatabase").val(CurPointSum.toString());
}

