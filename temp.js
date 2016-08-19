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
    $('#Apkg1pointdiv').html('+'+Apkg1point);
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
    Apkg2point = 2  ;
    $('#Apkg2pointdiv').html('+'+Apkg2point);

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
    Apkg3point = 2  ;
    $('#Apkg3pointdiv').html('+'+Apkg3point);
  }
  else {
    Apkg3point = 0  ;
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
    Aact1point = 0  ;
    $('#Aact1pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Aact1Opt').change(function () {
  switch ($("input[name = Aact1Opt]:checked").val()) {
    case "1":
      Aact1point = 1  ;
      $('#Aact1pointdiv').html('+'+ Aact1point);
      UpdateCurPoint();
      break;
    case "2":
      Aact1point = 1  ;
      $('#Aact1pointdiv').html('+'+ Aact1point);
      UpdateCurPoint();
      break;
  };
});


//Aact2
$('#Aact2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact2').bootstrapSwitch("state") === false) {
    $('.Aact2Opt').prop('checked', false);
    Aact2point = 0  ;
    $('#Aact2pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Aact2Opt').change(function () {
  switch ($("input[name = Aact2Opt]:checked").val()) {
    case "1":
      Aact2point = 1  ;
      $('#Aact2pointdiv').html('+'+ Aact2point);
      UpdateCurPoint();
      break;
    case "2":
      Aact2point = 2  ;
      $('#Aact2pointdiv').html('+'+ Aact2point);
      UpdateCurPoint();
      break;
    case "3":
      Aact2point = 3  ;
      $('#Aact2pointdiv').html('+'+ Aact2point);
      UpdateCurPoint();
      break;
    case "4":
      Aact2point = 4  ;
      $('#Aact2pointdiv').html('+'+ Aact2point);
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
    Aact3point = 1  ;
    $('#Aact3pointdiv').html('+'+ Aact3point);
    UpdateCurPoint();
  }
  else {
    Aact3point = 0  ;
    $('#Aact3pointdiv').html('');
    UpdateCurPoint();
  }

});

//Aact4
$('#Aact4').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact4').bootstrapSwitch("state") === false) {
    $('.Aact4Opt').prop('checked', false);
    Aact4point = 0  ;
    $('#Aact4pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Aact4Opt').change(function () {
  switch ($("input[name = Aact4Opt]:checked").val()) {
    case "1":
      Aact4point = 1  ;
      $('#Aact4pointdiv').html('+'+ Aact4point);
      UpdateCurPoint();
      break;
    case "2":
      Aact4point = 2  ;
      $('#Aact4pointdiv').html('+'+ Aact4point);
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
    Aact5apoint = 1  ;
    $('#Aact5apointdiv').html('+'+ Aact5apoint);
    UpdateCurPoint();
  }
  else {
    Aact5apoint = 0  ;
    $('#Aact5apointdiv').html('');
    UpdateCurPoint();
  }

});

//Aact5b
$('#Aact5b').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact5b').bootstrapSwitch("state") === true) {
    Aact5bpoint = 1  ;
    $('#Aact5bpointdiv').html('+'+ Aact5bpoint);
    UpdateCurPoint();
  }
  else {
    Aact5bpoint = 0  ;
    $('#Aact5bpointdiv').html('');
    UpdateCurPoint();
  }

});

//Aact6
$('#Aact6').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact6').bootstrapSwitch("state") === true) {
    Aact6point = 1  ;
    $('#Aact6pointdiv').html('+'+ Aact6point);
    UpdateCurPoint();
  }
  else {
    Aact6point = 0  ;
    $('#Aact6pointdiv').html('');
    UpdateCurPoint();
  }

});

//Aact7
$('#Aact7').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Aact7').bootstrapSwitch("state") === true) {
    Aact7point = 1  ;
    $('#Aact7pointdiv').html('+'+ Aact7point);
    UpdateCurPoint();
  }
  else {
    Aact7point = 0  ;
    $('#Aact7pointdiv').html('');
    UpdateCurPoint();   }

});


//Acshare1
$('#Acshare1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Acshare1').bootstrapSwitch("state") === false) {
    $('.Acshare1Opt').prop('checked', false);
    Acshare1point = 0  ;
    $('#Acshare1pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Acshare1Opt').change(function () {
  switch ($("input[name = Acshare1Opt]:checked").val()) {
    case "1":
      Acshare1point = 1  ;
      $('#Acshare1pointdiv').html('+'+ Acshare1point);
      UpdateCurPoint();
      break;
    case "2":
      Acshare1point = 2  ;
      $('#Acshare1pointdiv').html('+'+ Acshare1point);
      UpdateCurPoint();
      break;
    case "3":
      Acshare1point = 3  ;
      $('#Acshare1pointdiv').html('+'+ Acshare1point);
      UpdateCurPoint();
      break;
    case "4":
      Acshare1point = 4  ;
      $('#Acshare1pointdiv').html('+'+ Acshare1point);
      UpdateCurPoint();
      break;
    case "5":
      Acshare1point = 5  ;
      $('#Acshare1pointdiv').html('+'+ Acshare1point);
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
    Adeli1point = 1  ;
    $('#Adeli1pointdiv').html('+'+ Adeli1point);
    UpdateCurPoint();
  }
  else {
    Adeli1point = 0  ;
    $('#Adeli1pointdiv').html('');
    UpdateCurPoint();
  }

});


//Adeli2
$('#Adeli2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Adeli2').bootstrapSwitch("state") === true) {
    Adeli2point = 1  ;
    $('#Adeli2pointdiv').html('+'+ Adeli2point);
    UpdateCurPoint();
  }
  else {
    Adeli2point = 0  ;
    $('#Adeli2pointdiv').html('');
    UpdateCurPoint();   }

});

//Afam2
$('#Afam2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Afam2').bootstrapSwitch("state") === true) {
    Afam2point = 2  ;
    $('#Afam2pointdiv').html('+'+ Afam2point);
    UpdateCurPoint();
  }
  else {
    Afam2point = 0  ;
    $('#Afam2pointdiv').html('');
    UpdateCurPoint();  }

});


//Ahov1
$('#Ahov1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ahov1').bootstrapSwitch("state") === false) {
    $('.Ahov1Opt').prop('checked', false);
    Ahov1point = 0  ;
    $('#Ahov1pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Ahov1Opt').change(function () {
  switch ($("input[name = Ahov1Opt]:checked").val()) {
    case "1":
      Ahov1point = 2  ;
      $('#Ahov1pointdiv').html('+'+ Ahov1point);
      UpdateCurPoint();
      break;
    case "2":
      Ahov1point = 4  ;
      $('#Ahov1pointdiv').html('+'+ Ahov1point);
      UpdateCurPoint();
      break;
    case "3":
      Ahov1point = 6  ;
      $('#Ahov1pointdiv').html('+'+ Ahov1point);
      UpdateCurPoint();
      break;
    case "4":
      Ahov1point = 8  ;
      $('#Ahov1pointdiv').html('+'+ Ahov1point);
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
    Ahov2point = 0  ;
    $('#Ahov2pointdiv').html('');
    UpdateCurPoint();
  }
});

$('.Ahov2Opt').change(function () {
  switch ($("input[name = Ahov2Opt]:checked").val()) {
    case "1":
      Ahov2point = 7  ;
      $('#Ahov2pointdiv').html('+'+ Ahov2point);
      UpdateCurPoint();
      break;
    case "2":
      Ahov2point = 14  ;
      $('#Ahov2pointdiv').html('+'+ Ahov2point);
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
      Ahov3point = 1  ;
      $('#Ahov3pointdiv').html('+'+ Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 100000 & AgrossareaInput < 200000) {
      $('#Ahov3Opt').html("Option B");
      Ahov3point = 2  ;
      $('#Ahov3pointdiv').html('+'+ Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 200000 & AgrossareaInput < 300000) {
      $('#Ahov3Opt').html("Option C");
      Ahov3point = 3  ;
      $('#Ahov3pointdiv').html('+'+ Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 300000 & AgrossareaInput < 400000) {
      $('#Ahov3Opt').html("Option D");
      Ahov3point = 4  ;
      $('#Ahov3pointdiv').html('+'+ Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 400000 & AgrossareaInput < 500000) {
      $('#Ahov3Opt').html("Option E");
      Ahov3point = 5  ;
      $('#Ahov3pointdiv').html('+'+ Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 500000 & AgrossareaInput < 600000) {
      $('#Ahov3Opt').html("Option F");
      Ahov3point = 6  ;
      $('#Ahov3pointdiv').html('+'+ Ahov3point);
      UpdateCurPoint();
    }
    if (AgrossareaInput >= 600000) {
      $('#Ahov3Opt').html("Option G");
      Ahov3point = 7  ;
      $('#Ahov3pointdiv').html('+'+ Ahov3point);
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
    Ainfo1point = 1  ;
    $('#Ainfo1pointdiv').html('+'+ Ainfo1point);
    UpdateCurPoint();
  }
  else {
    Ainfo1point = 0  ;
    $('#Ainfo1pointdiv').html('');
    UpdateCurPoint();
  }

});

//Ainfo2
$('#Ainfo2').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ainfo2').bootstrapSwitch("state") === true) {
    Ainfo2point = 1  ;
    $('#Ainfo2pointdiv').html('+'+ Ainfo2point);
    UpdateCurPoint();
  }
  else {
    Ainfo2point = 0  ;
    $('#Ainfo2pointdiv').html('');
    UpdateCurPoint();
  }

});


//Ainfo3
$('#Ainfo3').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Ainfo3').bootstrapSwitch("state") === false) {
    $('.Ainfo3Opt').prop('checked', false);
    Ainfo3point = 0  ;
    $('#Ainfo3pointdiv').html('');
    UpdateCurPoint();

  }
});

$('.Ainfo3Opt').change(function () {
  switch ($("input[name = Ainfo3Opt]:checked").val()) {
    case "1":
      Ainfo3point = 1  ;
      $('#Ainfo3pointdiv').html('+'+ Ainfo3point);
      UpdateCurPoint();
      break;
    case "2":
      Ainfo3point = 2  ;
      $('#Ainfo3pointdiv').html('+'+ Ainfo3point);
      UpdateCurPoint();
      break;
    case "3":
      Ainfo3point = 3  ;
      $('#Ainfo3pointdiv').html('+'+ Ainfo3point);
      UpdateCurPoint();
      break;
    case "4":
      Ainfo3point = 4  ;
      $('#Ainfo3pointdiv').html('+'+ Ainfo3point);
      UpdateCurPoint();
      break;
    default:

  };

});


//Alu1
$('#Alu1').on('switchChange.bootstrapSwitch', function (event, state) {
  if ($('#Alu1').bootstrapSwitch("state") === true) {
    Alu1point = 1  ;
    $('#Alu1pointdiv').html('+'+ Alu1point);
    UpdateCurPoint();
  }
  else {
    Alu1point = 0  ;
    $('#Alu1pointdiv').html('');
    UpdateCurPoint();  }

});
