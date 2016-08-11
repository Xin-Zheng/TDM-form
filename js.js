var pkg1point = 0;
  var pkg4point = 0;
  var hov3point = 0;
  var pointnow=0;
  var NeighborParking = 0;
  var OccupiedArea = 0;
  var ProjectParkRate = 0;
  var CparkingSpaceInput = 0;



  //Disable button

 

  
  $('#Dact2').on('switchChange.bootstrapSwitch', function(event, state) {
      if ($('#Dact2').bootstrapSwitch("state")===false){
          $('.Dact2Opt').prop("disabled",true);
      }
      else{
          $('.Dact2Opt').prop("disabled",false);
      }
    });


    $('#Dcshare1').on('switchChange.bootstrapSwitch', function(event, state) {
      if ($('#Dcshare1').bootstrapSwitch("state")===false){
          $('.Dcshare1Opt').prop("disabled",true);
      }
      else{
          $('.Dcshare1Opt').prop("disabled",false);
      }
    });


   


    //Calculate points 
    
     //CtargetPoint
    var Cbasepoint = 13;
    var CtargetPoint = 0;
    $("#CparkingInput").on("input",function(e){
    var CparkingSpaceInput = $("#CparkingInput").val();

    
    if (CparkingSpaceInput < 0 ){
      CtargetPoint = 0;
      alert("Your input of Accessory Parking Spaces is not valid. It should be greater than or equal to 0");
      $("#pointtarget").html("not valid");
    }   


    if (CparkingSpaceInput <= 20 & CparkingSpaceInput >=0 ){
      CtargetPoint = Cbasepoint;
      $("#pointtarget").html(CtargetPoint.toString());
    }

    if (CparkingSpaceInput <=570 & CparkingSpaceInput > 20 ){
      CtargetPoint = Cbasepoint + Math.ceil(CparkingSpaceInput/10)-2;
      $("#pointtarget").html(CtargetPoint.toString());
    }


    if (CparkingSpaceInput > 570 ){
      CtargetPoint = Cbasepoint + 56;
      $("#pointtarget").html(CtargetPoint.toString());
    }

    });



    //Cpkg1
    //Change Neighborhood Parking Rate and location category based on input
    var NeighborParking = 0;
    $("#TAZinput").on("input",function(e){
    var iffind = 0;
      var tazinput = $(this).val();
      $.each(parkingrate, function(i,v) {
        if (v.TAZ == tazinput) {
          $("#Cpkg1rate").html(v.NonResParkingRate);
          
          NeighborParking = v.NonResParkingRate;
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
            pkg1point = 0;
          }
          else{
            if (NeighborParking > 0.8){
              pkg1point = 1;
            }
            if (NeighborParking > 0.6 & NeighborParking <= 0.8){
              pkg1point = 2;
            }
            if (NeighborParking > 0.4 & NeighborParking <= 0.6){
              pkg1point = 3;
            }
            if (NeighborParking > 0.2 & NeighborParking <= 0.4){
              pkg1point = 4;
            }
            if (NeighborParking >0  & NeighborParking <= 0.2){
              pkg1point = 5;
            }
          }
      }
      else{
          pkg1point = 0;
      }
      UpdateCurPoint();
    }


    //Cpkg4
    //Change Neighborhood Parking Rate, Project parking rate and location category based on input

    $("#TAZinput").on("input",function(e){
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
            break;
          case "2":
            pointnow -= Ccshare1pre;
            pointnow += 2;
            Ccshare1pre = 2;  
            break;
          case "3":
            pointnow -= Ccshare1pre;
            pointnow += 3;
            Ccshare1pre = 3;  
            break;
          case "4":
            pointnow -= Ccshare1pre;
            pointnow += 4;
            Ccshare1pre = 4;  
            break;
          case "5":
            pointnow -= Ccshare1pre;
            pointnow += 5;
            Ccshare1pre = 5;  
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