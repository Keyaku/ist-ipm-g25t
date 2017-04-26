/*------------------------------------------------------------------------------

			CODE EXECUTION

------------------------------------------------------------------------------*/
$('#menubar').menubar(); //Adds the menu bar..
$('#shareButtonContainer').hide();
$('#interestsButtonContainer').hide();
$('#directionsButtonContainer').hide();
$('#mapsDestinationInput').hide();
$('#go').hide();


var transportationMode = '';
//Default map variables
var googleMapsKey = "?key=AIzaSyB1UiEgTrMu4oUPFCxorbwhTBMbX19RVGo";
var googleMapsOrigin = "&origin=taguspark";
var googleMapsMode = "driving";
var googleMapsUnits = "&units=metric";


/*------------------------------------------------------------------------------

			AUXILIAR FUNCTIONS

------------------------------------------------------------------------------*/
function shareStart(button) {
	$('#shareButtonContainer').toggle();
	$('#interestsButtonContainer').hide();
	$('#directionsButtonContainer').hide();
}
function interestsStart(button) {
	$('#shareButtonContainer').hide();
	$('#interestsButtonContainer').toggle();
	$('#directionsButtonContainer').hide();
}
function directionsStart(button) {
	$('#shareButtonContainer').hide();
	$('#interestsButtonContainer').hide();
	$('#directionsButtonContainer').toggle();
}

function share() {
	console.log("sharing");
	confirmationOverlayShow(shared, []);
}
function shared(arg) { }
function interestsAdd(button) { button.toggleClass('active'); }
function directionsChooseMode(button) {
	$('.directionsButton').removeClass('active');
	button.addClass('active');
	$('#mapsDestinationInput').show();
	$('#go').show();
	transportationMode = (button.attr("id")).toLowerCase();
}
function go() {
	var destination = $('#mapsDestinationInput').val();
	directionsMap(destination, transportationMode);
}

/*
function searchMap(keyWords) {
	var url = "https://www.google.com/maps/embed/v1/search"+googleMapsKey+"&q="+keyWords;
	$("#iframeMap").attr("src", url);
}
*/
function directionsMap(destination, travelMode) {
	if (travelMode == '') { travelMode = googleMapsMode; }
	if (destination == '') {
		var inputBar = $("#mapsDestinationInput");
		inputBar.css("background-color", "red");
		setTimeout(function() { inputBar.css("background-color", "white"); }, 1250);
		for (var i = 1; i <= 15; i++) inputBar.fadeOut(30).fadeIn(30);
		return;
	}
	var url = "https://www.google.com/maps/embed/v1/directions"+googleMapsKey+googleMapsOrigin+"&destination="+destination+"&mode="+travelMode;
	$("#iframeMap").attr("src", url);
}


/*------------------------------------------------------------------------------

			MENU FLOW

------------------------------------------------------------------------------*/
$('#mapsShare').click(function() { shareStart($(this)); });
$('#mapsInterests').click(function() { interestsStart($(this)); });
$('#mapsDirections').click(function() { directionsStart($(this)); });
$('.shareButton').click(function() { share(); });
$('.interestsButton').click(function() { interestsAdd($(this)); });
$('.directionsButton').click(function() { directionsChooseMode($(this)); });
$('#go').click(function() { go(); });
