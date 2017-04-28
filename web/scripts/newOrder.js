/*------------------------------------------------------------------------------

			CODE EXECUTION

------------------------------------------------------------------------------*/
$('#menubar').menubar(); //Adds the menu bar..
//Shows the orders.
for (var i = 0; i < sessionStorage.orders; i++) {
	var values = managerGetMetaValues(i.toString()); //Gets the ordered pizza and drink.
	if (values != null && values[0] != null && values[1] != null && (values[0] != '' || values[1] != '')) { //If the order wasn't deleted.
		createOrderItem(i); //Creates the HTML structure for the order.
		createOrderElements(values[0], values[1], i); //Fills the order item with the chosen pizza and drink.
	}
}

/*
$('#timer').countdown360({
	radius: 65,                        // radius of arc
	strokeStyle: '#ecf0f1',            // the color of the stroke
	strokeWidth: 5,					   // border radius
	fillStyle: '#bdc3a7',              // the fill color
	fontColor: '#ecf0f1',              // the font color
	fontWeight: 700,                   // the font weight
	autostart: true,                   // start the countdown automatically
	seconds: 480,                      // the number of seconds to count down
	label: ['second', 'minute'],       // the label to use or false if none
	smooth: true,                      // should the timer be smooth or stepping
	onComplete: function () {}
}); //Adds the timer.
*/


/*------------------------------------------------------------------------------

			AUXILIAR FUNCTIONS

------------------------------------------------------------------------------*/
//Creates the HTML structure for the order.
function createOrderItem(index) {
	var ind = index.toString();
	var str = 'order' + index.toString();
	var div = $('<div></div>').addClass('orderStatusContainer').attr('id', str); //Creates the div for the order.
	var a = $('<div></div>').addClass('col').attr('id', 'pizza' + ind); //Creates the div for the ordered pizza.
	var b = $('<div></div>').addClass('col').attr('id', 'drink' + ind); //Creates the div for the ordered drink.
	//Creates the buttons.
	var c = $('<div></div>').addClass('col buttons')
			.append($('<button>', { html: 'Edit' }).addClass('buttonEdit buttonNeutral').attr('id', 'edit' + ind))
			.append($('<button>', { html: 'Pizza' }).addClass('buttonEditPizza buttonNeutral').attr('id', 'editPizza' + ind))
			.append($('<button>', { html: 'Drink' }).addClass('buttonEditDrink buttonNeutral').attr('id', 'editDrink' + ind))
			.append($('<button>', { html: 'Cancel' }).addClass('buttonCancel buttonDanger').attr('id', 'cancel' + ind));
	div.append(a, b, c);
	$('#orders').append(div);
}
//Fills the order item with the chosen pizza and drink.
function createOrderElements(pizza, drink, index) {
	var pizzaNumber = Number(pizza['pizzaNumber']);
	var drinkNumber = Number(drink['drinkNumber']);
	var incButtons = createIncrementButtons(pizzaNumber, drinkNumber);
	setTimeout(function() {
		if (pizza != '') { $('#pizza' + index.toString()).append(createPizzaItemWithSize(pizza), incButtons[0]); }//Shows the ordered pizza.
		if (drink != '') { $('#drink' + index.toString()).append(createDrinkItem(drink), incButtons[1]); }//Shows the ordered drink.
	}, 100);
}

//When the client clicks the edit button.
function orderEdit(index) {
	$('#editPizza' + index.toString()).toggle(); //Shows/hides the edit pizza button.
	$('#editDrink' + index.toString()).toggle(); //Shows/hides the edit drink button.
}
//When the client clicks the edit pizza button.
function orderEditPizza(index) {
	sessionStorage.setItem('orderNumber', index.toString()); //Sets the number of the current order.
	sessionStorage.setItem('editing', 'true'); //Sets the editing flag to false.
	window.location.href = 'html/menus/menuPizzaList.html';
}
//When the client clicks the edit drink button.
function orderEditDrink(index) {
	sessionStorage.setItem('orderNumber', index.toString()); //Sets the number of the current order.
	sessionStorage.setItem('editing', 'true'); //Sets the editing flag to false.
	window.location.href = 'html/menus/menuDrinks.html';
}

//When the client clicks the increment or decrement pizza buttons.
function orderIncrementPizza(incValue, button) {
	var number = Number($('.elNumberPizza').text()) + incValue; //Gets the number of current pizzas in the order.
	var id = button.parent().parent().attr('id');
	var orderNumber = id[5];
	if (number > 0) { //If the number of pizzas would still be more than 0.
		$('.elNumberPizza').text(number); //Increment or decrements the number of pizzas in the display.
		managerIncrementPizza(orderNumber, number); //Changes the number in the system.
	}
	//If the number of pizzas would be 0.
	else if (number == 0) { confirmationDeleteElement('Do you really wish to delete this element?', deletePizza, orderNumber); }
	//The number won't reach negative values because when it reaches 0, the order is canceled (with the client's permission).
	else if (number < 0) { /*Security redundancy.*/ }
}
//When the client clicks the increment or decrement drink buttons.
function orderIncrementDrink(incValue, button){
	var number = Number($('.elNumberDrink').text()) + incValue; //Gets the number of current drinks in the order.
	var id = button.parent().parent().attr('id');
	var orderNumber = id[5];
	if (number > 0) { //If the number of pizzas would still be more than 0.
		$('.elNumberDrink').text(number); //Increment or decrements the number of drinks in the display.
		managerIncrementDrink(orderNumber, number); //Changes the number in the system.
	}
	//If the number of pizzas would be 0.
	else if (number == 0) { confirmationDeleteElement('Do you really wish to delete this element?', deleteDrink, orderNumber); }
	//The number won't reach negative values because when it reaches 0, the order is canceled (with the client's permission).
	else if (number < 0) { /*Security redundancy.*/ }
}

function refreshOrder(orderNumber) {
	$('#order').empty();
	var pizza = '#pizza' + orderNumber.toString();
	$(pizza).parent('.orderStatusContainer').remove();
	var values = managerGetMetaValues(Number(orderNumber));
	if (values[0] == '' && values[1] == '') { confirmationOrderCancel(); }
	createOrderItem(orderNumber); //Creates the HTML structure for the order.
	createOrderElements(values[0], values[1], orderNumber); //Fills the order item with the chosen pizza and drink.
}

	function confirmationDeleteElement(confirmationQuestion, func, arg) { confirmationOverlayShow(confirmationQuestion, func, arg); }
function deletePizza(arg) {
	managerDeletePizza(arg);
	refreshOrder(arg);
}
function deleteDrink(arg) {
	managerDeleteDrink(arg);
	refreshOrder(arg);
}

//When the client clicks the cancel button.
function orderCancel(index) { confirmationOverlayShow(confirmCancel, [index]); }
//When the client clicks the 'Yes' button in the confirmation overlay (callback from confirmationOverlayShow).
function confirmCancel(args) {
	var index = args[0];
	$('#order' + index.toString()).remove();
	managerDeleteOrder(index);
}
//When the client clicks the cancel all button.
function orderAllCancel() { confirmationOverlayShow('Do you really wish to cancell all your orders?',confirmCancelAll, []); }
//When the client clicks the 'Yes' button in the confirmation overlay (callback from confirmationOverlayShow).
function confirmCancelAll() {
	$('#orders').empty();
	manageDeleteAllOrders();
}


/*------------------------------------------------------------------------------

			MENU FLOW

------------------------------------------------------------------------------*/
//The click event for the edit button shows the two buttons so the user chooses to edit the pizza or drink.
$('.buttonEdit').click(function() {	orderEdit(parseInt(($(this).attr('id'))[4])); });
//The click event for the edit pizza button edits the pizza.
$('.buttonEditPizza').click(function() { orderEditPizza(parseInt(($(this).attr('id'))[9])); });
//The click event for the edit drink button edits the drink.
$('.buttonEditDrink').click(function() { orderEditDrink(parseInt(($(this).attr('id'))[9])); });
//The click event for the cancel button cancels the order.
$('.buttonCancel').click(function() { orderCancel(parseInt(($(this).attr('id'))[6])); }); //Cancells the selected order.
//The click event for the cancel all button cancels the order.
$('#buttonCancelAll').click(function() { orderAllCancel(); }); //Cancells the selected order.
//The click event for the new order buttons enables the client to order again.
$('#buttonNewOrder').click(function() {
	sessionStorage.setItem('orderNumber', sessionStorage.orders); //Sets the number of the current order.
	window.location.href = 'html/menus/menuPizzaList.html'; //Continues with the ordering process.
});
