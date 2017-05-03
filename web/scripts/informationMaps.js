/*------------------------------------------------------------------------------

			CODE EXECUTION

------------------------------------------------------------------------------*/
$('#menubar').menubar(); //Adds the menu bar..
$('#shareButtonContainer').hide();
$('#interestsButtonContainer').hide();
$('#directionsButtonContainer').hide();
$('#mapsDestinationInput').hide();
$('#go').hide();
$('#mic').hide();


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
	let modes = {
		'default' : 'Go',
		'transit' : 'Order',
	}

	$('.directionsButton').removeClass('active');
	button.addClass('active');
	$('#mapsDestinationInput').show();
	$('#go').show();
	$('#mic').show();
	//micEffect();
	googleMapsMode = (button.attr("id")).toLowerCase();

	if (googleMapsMode in modes && button.text() != 'Public Transport') {
		$('#go').text(modes[googleMapsMode]);
	} else {
		$('#go').text(modes['default']);
	}
}

//function micEffect() { for (var i = 0; i < 15; i++) { $('#mic').fadeOut(400).fadeIn(400); } }

function mapGetDirections(destination, travelMode) {
	if (travelMode == '') { travelMode = 'driving'; }
	var url = "https://www.google.com/maps/embed/v1/directions"+googleMapsKey+googleMapsOrigin+"&destination="+destination+"&mode="+travelMode;
	$("#iframeMap").attr("src", url);
}
function go() {
	var input = $('#mapsDestinationInput');
	var destination = input.val();

	if (destination.empty()) {
		input.effect('shake', {times:2}, 300)
			.css({'background-color':'rgb(200, 0, 0)'})
			.animate({'background-color':'rgb(255, 255, 255)'}, 500);
	} else {
		mapGetDirections(destination, googleMapsMode);
	}
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
	if (e.which == 115) { mapSharedWithMe(); }
});
