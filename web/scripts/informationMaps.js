/*------------------------------------------------------------------------------

			CODE EXECUTION

------------------------------------------------------------------------------*/
$('#menubar').menubar(); //Adds the menu bar.
$('#shareButtonContainer').hide();
$('#interestsButtonContainer').hide();
$('#directionsButtonContainer').hide();
$('#directionInput').hide();
$('#taxiTime').hide();

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

function mapSharedWithMe() { mapGetDirections('alameda lisboa', 'driving'); }
function mapShare() { confirmationOverlayShow('Do you really wish to share your map?', shared, []); }
function shared(arg) { acknowledgementOverlayShow('Your map was shared.'); }

function mapGetPointsOfInterest(button) {
	$('.interestsButton').removeClass('active');
	button.addClass('active');
	var pointType = button.attr('id');
	var keyWords = '';
	switch(pointType) {
		case 'bars': keyWords = 'bars+oeiras';
			break;
		case 'landscapes': keyWords = 'parks+oeiras';
			break;
		case 'mall': keyWords = 'malls+oeiras';
			break;
		case 'monuments': keyWords = 'monuments+oeiras';
			break;
		case 'museums':	keyWords = 'museums+oeiras';
			break;
	}
	var url = "https://www.google.com/maps/embed/v1/search"+googleMapsKey+"&q="+keyWords;
	$("#iframeMap").attr("src", url);
}

function mapDirectionsChooseMode(button) {
	const MODES_GO = ['on foot', 'car', 'public transport'];
	const MODES_ORDER = ['taxi', 'uber'];
	var transport = button.text().toLowerCase();

	$('.directionsButton').removeClass('active');
	button.addClass('active');
	$('#directionInput').show();
	/* Affecting transportation modes */
	googleMapsMode = (button.attr("id")).toLowerCase();

	if (MODES_GO.includes(transport)) {
		$('#go').text('Go!');
		$('#taxiTime').hide();
		$('#mic').removeClass('taxi');
	} else if (MODES_ORDER.includes(transport)) {
		$('#go').text('Verify');
	}
}

function mapGetDirections(destination, travelMode) {
	if (travelMode == '') { travelMode = 'driving'; }
	var url = "https://www.google.com/maps/embed/v1/directions"+googleMapsKey+googleMapsOrigin+"&destination="+destination+"&mode="+travelMode;
	$("#iframeMap").attr("src", url);
}
function go() {
	var input = $('#mapsDestinationInput');
	var destination = input.val();

	if (destination.empty()) {
		input.effect('shake', {times:4}, 300)
			.css({'background-color':'rgb(0, 0, 0)'})
			.animate({'background-color':'rgb(255, 255, 255)'}, 500);
	}
	else {
		if ($('#go').text() == 'Verify') { // FIXME: Too specific and fragile
			callTaxi();
			mapGetDirections(destination, googleMapsMode);
		}
		else if ($('#go').text() == 'Order!') {
			confirmationOverlayShow('Are you sure you want to call a cab?', calledTaxi, []);
		}
		else {
			mapGetDirections(destination, googleMapsMode);
		}
	}
}

function callTaxi() {
	$('#taxiTime').show();
	$('#mic').addClass('taxi');
	$('#go').text('Order!');
}
function calledTaxi(args) {
	var details = {
		'type' : $('.directionsButton.active').text(),
		'time' : 180, // FIXME: Randomize value
	};
	sessionStorage.myTransportation = JSON.stringify(details);
	acknowledgementOverlayShow('Your taxi has been called.', null, []);
	$('#menubar').menubar(); //Adds the menu bar.
}

function cancelTaxi() {
	console.log("cancelsad")
	sessionStorage.myTransportation = '';
}


/*------------------------------------------------------------------------------

			MENU FLOW

------------------------------------------------------------------------------*/
$('#mapsShare').click(function() { shareStart($(this)); });
$('#mapsInterests').click(function() { interestsStart($(this)); });
$('#mapsDirections').click(function() { directionsStart($(this)); });
$('.shareButton').click(function() { mapShare(); });
$('.interestsButton').click(function() { mapGetPointsOfInterest($(this)); });
$('.directionsButton').click(function() { mapDirectionsChooseMode($(this)); });
$('#mic').click(function() { mapInputDirection(); });
$('#go').click(function() { go(); });
$('#mapsDestinationInput').keypress(function(e) {
	switch (e.which) {
		case 13: // Enter/Return: Runs "Go" button
			$('#go').click();
			break;
		default:
			e.stopPropagation(); //Stops the key press from propagating presses like 'S' while typing the destination.
	}

});
$(document).keypress(function(e){
	//'S' key pressed.
	if (e.which == 115) { shareSure(); }
});


function shareSure() {
	confirmationOverlayShow('Do you allow user 1 to share the map with you?', mapSharedWithMe, []);
}
