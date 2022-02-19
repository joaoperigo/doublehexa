/* Joao Perigo -> Design and Program */

/**********************/
/******** VARS ********/
/**********************/
var square = $(".square-template").html(); //store the square template
var i=0, j=0;

//ROUND - which elements to disable after finish turn
var attackHero = ''; //id of current heros
var attackPower = 0;
var defenseHero = ''; //id of current heros
var defensePower = 0;

//RELATIVE 
var currentPowerTable = '.power-table-1';
var currentHeroTable = '.hero-table-1';
var nextPowerTable = '.power-table-2';
var nextHeroTable = '.hero-table-2';
var currentPlayer = '.player-1';
var nextPlayer = '.player-2';


var endTurn = false;

/**********************/
/****** TRIGGERS ******/
/**********************/


createPower(); //create power cards
$(".power").addClass('ofuscate'); //ofuscate at pegining

//BEGIN settings
$( "#settingP1 :input, #settingP2 :input" ).change(function() {
  changedSettings (this);
});

//START GAME
$( ".begin-game" ).click(function() {
  beginGame (); 
});

//HERO CLICK 
$( ".hero-wrapper" ).click(function() {
  heroClicked (this);
});

// POWER CLICK
$( ".power" ).click(function() {
  powerClicked(this);
});

//END TURN
$( ".attack" ).click(function() {
  endTurn = true;
  attack();
});

//END TURN
$( ".end-turn" ).click(function() {
  endTurnButton();
});




/**********************/
/****** FUNCTIONS *****/
/**********************/

//CREATE POWER
function createPower() {
  var powerTable = ''; 
  for (i=1; i<=8; i++) {
    powerTable += '<div class="power">';
    for (j=0; j<i; j++) {
      powerTable += square;
    }
    powerTable += '</div>';
  }
  $(".power-table").html(powerTable);
}

//INSERT HEROS DATA
function changedSettings (thisObject) {
  if ($(thisObject).find('option:selected')) {
    //Use $option (with the "$") to see that the variable is a jQuery object
    var $option = $(thisObject).find('option:selected');
    //Added with the EDIT
    var value = $option.val();//to get content of "value" attrib
    var text = $option.text();//to get <option>Text</option> content
    var selectId = $(thisObject).attr('id');
    selectId = "#" + selectId + "Card";//Get the id name of the object
    createHero(value, selectId);
    //P1
    if ($("#seuNomeP1").val() === "") {
      $(".p1-name").html("Player X");
    }
    else {
      $(".p1-name").html($("#seuNomeP1").val());//the input text
    }
    //P2
    if ($("#seuNomeP2").val() === "") {
      $(".p2-name").html("Player Z");
    } 
    else {
      $(".p2-name").html($("#seuNomeP2").val());//the input text
    }
  }
  checkDistribution ();
}

//CREATE HERO
function createHero(valueH, wichHero) {
  $(wichHero).html(""); //reset hero
  for(i=0; i<valueH; i++) {
    $(wichHero).append(square);
  }
}

//TO DO -> CHECK IF PROPERLY DISTRIBUTED***/
function checkDistribution () {
  var totalP1, totalP2;
  var h1p1, h2p1, h3p1, h4p1, h1p2, h2p2, h3p2, h4p2;
  h1p1 = parseInt($("#p1H1").val());
  h2p1 = parseInt($("#p1H2").val());
  h3p1 = parseInt($("#p1H3").val());
  h4p1 = parseInt($("#p1H4").val());
  h1p2 = parseInt($("#p2H1").val());
  h2p2 = parseInt($("#p2H2").val());
  h3p2 = parseInt($("#p2H3").val());
  h4p2 = parseInt($("#p2H4").val());
  totalP1 =  h1p1 + h2p1 + h3p1 + h4p1;
  totalP2 =  h1p2 + h2p2 + h3p2 + h4p2;
  //Distribution rules test
    if (totalP2 == 16 && totalP1 == 16 && h1p1 <= 8 && h1p1 >= 1 && h2p1 <= 8 && h2p1 >= 1 && h3p1 <= 8 && h3p1 >= 1 && h4p1 <= 8 && h4p1 >= 1 && h1p2 <= 8 && h1p2 >= 1 && h2p2 <= 8 && h2p2 >= 1 && h3p2 <= 8 && h3p2 >= 1 && h4p2 <= 8 && h4p2 >= 1) {
      $( ".begin-game" ).removeClass('d-none'); //show btn
    }
    else  {
  
      $( ".begin-game" ).addClass('d-none'); //show btn
    }
  //$( ".begin-game" ).removeClass('d-none'); //remove whe ready
}

//BEGIN
function beginGame () {
  $( "#settingP1, #settingP2" ).addClass('ofuscate pointer-events-none'); //hide settings
  $( ".begin-game" ).addClass('d-none'); //hide btn
  $( ".hero-table-2" ).addClass('ofuscate'); //hide waiting player
  $(".player-1 .hero-wrapper").addClass("pointer-events-auto"); //shine player in action
}


//HERO CLICKED
function heroClicked(thisObject) {
  focusHero (thisObject);

  //powers usable by the hero clicked
  $(currentPowerTable).find(".power").addClass('ofuscate').removeClass('shine');//reset power
  for(i=0; i<heroPower; i++) {
    $(currentPowerTable).find(".power").eq(i).addClass('shine pointer-events-auto');
  }
}

//POWER CLICKED
function powerClicked (thisObject) {
  focusPower(thisObject);
}

//FOCUS HERO
function focusHero (thisObject) {
  $( currentHeroTable + " .hero-wrapper" ).removeClass('focused'); //reset focused
  //shine clicked element
  $(thisObject).addClass('focused').removeClass('ofuscate');
  //hero id
  heroId = $(thisObject).find('.hero').attr('id');
  //save id for end turn
  if (endTurn == false) {
    attackHero = heroId;
  }
  else {
    defenseHero = heroId;
  }
  //hero power
  heroPower = $('#' + heroId).find(".square").length;
  $(currentPowerTable).find(".power").removeClass('focused');//ofuscate all powers
}

//FOCUS POWER
function focusPower (thisObject) {

  if (endTurn == false) {
    attackPower = $(thisObject).find(".square").length;//get the power value
    attackPower = attackPower - 1; //eq() use 0 instead 1 for first 
    $(currentPowerTable).find(".power").removeClass('focused');//ofuscate all powers
    $(currentPowerTable).find(".power").eq(attackPower).addClass('focused');//shine clicked one
    $( ".attack" ).removeClass('d-none');//show attack btn
  }

  else {
    defensePower = $(thisObject).find(".square").length;//get the power value
    defensePower = defensePower - 1; //eq() use 0 instead 1 for first 
    $(currentPowerTable).find(".power").removeClass('focused');//ofuscate all powers
    $(currentPowerTable).find(".power").eq(defensePower).addClass('focused');//shine clicked one
    $( ".end-turn" ).removeClass('d-none');//show attack btn
  }
}

//ATTACK
function attack() {  
  //lock old player and unlock new
  $( currentPlayer + " .power, " + currentPlayer + " .hero-wrapper" ).removeClass('pointer-events-auto'); //lock inactive player objc
  $( nextPlayer + " .hero-wrapper").addClass("pointer-events-auto shine"); //shine player in action

  //Defense hero shine
  $( nextHeroTable ).addClass('shine'); //shine active heroes of player
  $( nextPlayer + " .hero-wrapper").addClass("pointer-events-auto shine"); //shine player in action

  //swap to active player
  var aux = currentPowerTable
  currentPowerTable = nextPowerTable;
  nextPowerTable = aux;
  aux = currentHeroTable;
  currentHeroTable = nextHeroTable;
  nextHeroTable = aux;

  $(".attack").addClass("d-none");

}

//END TURN 
function endTurnButton() {

  //results
  var totalDamage = defensePower - attackPower;

  //disable used cards
  $(nextPowerTable).find(".power").eq(attackPower).addClass('used pointer-events-none-forever');
  $(currentPowerTable).find(".power").eq(defensePower).addClass('used pointer-events-none-forever');
  $("*").removeClass("focused pointer-events-auto"); //clean class focused
  
  //ELABORAR
  if (totalDamage < 0) { //attack is bigger
    heroPower = $('#' + defenseHero).find(".square").length; //get hero power
    if (heroPower + totalDamage <= 0) { //hero get a hit
      $('#' + defenseHero).closest('.hero-wrapper').addClass("used pointer-events-none-forever");
      $("#" + defenseHero + ", #" + defenseHero + " .square").addClass("used pointer-events-none-forever"); //apply to all bg filled elements 
    }
    else {
      createHero(heroPower + totalDamage, "#" + defenseHero); // change value
    }
  }
  
  else if(totalDamage > 0) { //defense is bigger
    heroPower = $('#' + attackHero).find(".square").length; //get hero power
    
    //inserir tester para ver se vida do heroi passa de 8????
    
    if (heroPower - totalDamage <= 0) { //hero get a hit
      $('#' + attackHero).closest('.hero-wrapper').addClass("used pointer-events-none-forever");
      $("#" + attackHero + ", #" + attackHero + " .square").addClass("used pointer-events-none-forever"); //apply to all bg filled elements 
    }
    else {
      createHero(heroPower - totalDamage, "#" + attackHero); // change value
    }
  }
  
  $(".end-turn").addClass("d-none"); //hide button
  
  //ELABORAR TURNO PLAYER 2
  //begin new turn
  
  //change attacker and defensor
  var aux = nextPlayer;
  nextPlayer = currentPlayer;
  currentPlayer = aux;
  
  $("" + nextHeroTable + " .hero-wrapper").addClass('ofuscate').removeClass("shine"); //hide waiting player
  $("" + currentPlayer + " .hero-wrapper").addClass("pointer-events-auto"); //shine player in action
  $(nextPowerTable).find(".power").addClass('ofuscate').removeClass('shine');//reset power
  
  
  //reset checker
  endTurn = false;
}
