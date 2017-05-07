/*------------------------------------------------------------------------------

			DATA STRUCTURES

------------------------------------------------------------------------------*/
const PATH_INGREDIENTS = 'img/menus/customizeMenu/pizzaIngredients/'; // Don't forget to consider our <base> rule.
const LIST_INGREDIENTS = {
	'Cheese'	 : [ 'Mozzarella', 'Parmesan', 'Elemental Cheese', 'French Cheese', 'Goat Cheese', 'Parmesan', 'SourCream' ],
	'Meat'		 : [ 'Ham', 'Pepperoni', 'Bacon', 'Prosciutto', 'Chicken', 'Beef', 'Sausage' ],
	'Fish'       : [ 'Tuna', 'Sardin'],
	'Vegetables' : [ 'Mushroom', 'Jalapeños', 'Tomato', 'Peppers', 'Arugula', 'Basil', 'Garlic', 'Green Olive', 'Olives', 'Onion', 'Pineapple', 'Spinach', 'Sweet Corn' ],
};


/*------------------------------------------------------------------------------

			CODE EXECUTION

------------------------------------------------------------------------------*/
$('#menubar').menubar(); // Adding menu bar
$('#navbar').navbar({selected: 'Pizza'}); // Adding top navigation bar
var pizzaMaker = {'name' : '', 'pizzaSize' : '', 'Dough' : '', 'ingredients' : [] };
populateIngredientsLists(); //Generates the ingredients lists.


$('#sizeButtons').append(createSizeButtons());


/*------------------------------------------------------------------------------

			AUXILIAR FUNCTIONS

------------------------------------------------------------------------------*/
//Generates the ingredients lists.
function populateIngredientsLists() {
	for (var ingredientType in LIST_INGREDIENTS) {
		var typeLabel = $('<label>', { // Creates the ingredient type label.
			html: ingredientType,
			'class': 'pizzaIngredientTypeLabel'
		});
		var typeDiv = $('<div>', { 'class': 'pizzaIngredientType' }); // Creates the div that contains the all the type's ingredients and their images.
		typeDiv.attr('id', ingredientType.toLowerCase()); // Gives each of the created division an attribute id.
		for (i in LIST_INGREDIENTS[ingredientType]) {
			var ingredientName = LIST_INGREDIENTS[ingredientType][i];
			var ingredientDiv = $('<div>', { // Creates a div for each ingredient.
				'class': 'pizzaIngredient',
				'id': ingredientName
			});
			var ingredientLabel = $('<label>', { // Creates the ingredient's label.
				html: ingredientName,
				'class': 'pizzaIngredientName'
			});

			ingredientName = ingredientName.toLowerCase().replace(/\s/g,'')
			ingredientDiv.append($('<div>', { // Attaches the ingredient's image div and label to the ingredient's div.
				'css': {'background-image' : 'url("' + PATH_INGREDIENTS + ingredientName + '.png")'},
				'class': 'pizzaIngredientImg'
			})).append(ingredientLabel);
			typeDiv.append(ingredientDiv); // Appends the individual ingredients div to the types's div.
		}
		$('#pizzaIngredients').append([typeLabel, typeDiv]); // Appends the type's div to the main page.
	}
}
//Creates the pizza size buttons.
function createSizeButtons() {
	var d = $('<div>', { 'class': 'buttonContainer' });
	['Small', 'Medium', 'Large'].forEach(function(size) {
		var d2 = $('<div>', { 'class': 'pizzaCustomizationItem col-md-4' });
		d.append(d2);
		d2.append($('<button>', {
			html: size[0], //Gets the first character from size.
			'class': 'mPIISizeButton buttonWhite',
			'id': size,
			'click': function() {
				$('.mPIISizeButton').addClass('buttonWhite').removeClass('buttonReward');
				$(this).removeClass('buttonWhite').addClass('buttonReward');
				pizzaSetSize($(this).attr('id'));
			},
			'id': size
		}));
	});
	return d;
}

//Sets the key's value to the given value in the customized pizza's structure.
function pizzaCustomizeField(field, value) {
	pizzaMaker[field] = value; //Sets the value;
	pizzaUpdateLabel(); //Updates the visual information for the client.
}

//Updates the label that shows the client the current customization.
function pizzaUpdateLabel() {
	var size = pizzaMaker['size'] != undefined ? ' <b>' + pizzaMaker['size'] + '</b>' : ''; //Updates the size.
	var dough = pizzaMaker['dough'] != undefined ? ' <i>' + pizzaMaker['dough'] + '</i>' : ''; //Updates the dough.
	var str = 'Your' + size + dough + ' pizza contains:'
	$('label#customPizza').html(str);
}

//Sets the customized pizza's size.
function pizzaSetSize(size) { pizzaCustomizeField('size', size); }
//Sets the customized pizza's dough.
function pizzaSetDough(dough) { pizzaCustomizeField('dough', dough); }
//Checks if the ingredient is selected.
function pizzaIsIngredientSelected(ing) { return pizzaMaker['ingredients'].find(function(val) { return val == ing; }) != undefined; }
//Adds the ingredient to the customized pizza's structure.
function pizzaAddIngredient(ing) {
	pizzaMaker['ingredients'].push(ing); //Adds it to the structure.
	$('#ingredientsPicked').append($('<li>', { html: ing })); //Adds it to the HTML.
}
//Removes the ingredient from the customized pizza's structure.
function pizzaRemoveIngredient(ing) {
	var index = pizzaMaker['ingredients'].indexOf(ing);
	pizzaMaker['ingredients'].splice(index, 1); //Removes it from the structure.
	$('#ingredientsPicked').children(':contains(' + ing + ')').remove(); //Removes it from the HTML.
}

function setGlobalPizza() {
	var index = sessionStorage.orderNumber; //Gets the order number (in case the user is editing an order).
	pizzaCustomizeField('name', 'Custom #' + index); //Sets the name of the custom pizza.
	pizzaCustomizeField('nutritions', {'Calories':'556kcal', 'Protein':'23g', 'Carbohydrates':'44g', 'Fat':'99g'}); //Sets the caloric of the custom pizza.
	pizzaCustomizeField('rating', '88%'); //Sets the rating of the custom pizza.
	pizzaCustomizeField('image', 'img/menus/pizzaMenu/menuPizza5.png'); //Sets the image of the custom pizza.
	if (sessionStorage.editing == 'true') { //If the client is editing a previous order.
		sessionStorage.editing = false; //Sets the editing flag to false.
		managerEditCustomizedPizza(pizzaMaker); //Adds the pizza to the system.
		window.location.href = 'html/table.html';
		//TODO - @FranciscoKloganB - Show the confirmation popup.
	}
	else { //If the client is NOT editing a previous order.
		managerAddNewCustomizedPizza(pizzaMaker); //Adds the pizza to the system.
		window.location.href = 'html/menus/menuDrinks.html'; //Continues with the order.
	}
}


/*------------------------------------------------------------------------------

				MENU FLOW

------------------------------------------------------------------------------*/
//The click event of .pizzaIngredient is defined in the spawning.
//The click event for the pizza dough buttons sets the pizza's dough.
$('.mPIIDoughButton').click(function() {
	$('.mPIIDoughButton').addClass('buttonWhite').removeClass('buttonReward');
	$(this).removeClass('buttonWhite').addClass('buttonReward');
	pizzaSetDough($(this).attr('id')); //Sets the pizza's dough.
});
//The click event for the ingredient buttons adds/removes it from the ingredients list.
$('.pizzaIngredient').click(function() {
	$(this).children('.pizzaIngredientImg').toggleClass('active'); //Show the ingredient is selected.
	$(this).children('.pizzaIngredientName').toggleClass('active'); //Show the ingredient is selected.
	var ing = $(this).attr('id'); //Gets the ingredients name.
	if (pizzaIsIngredientSelected(ing)) { //If the ingredient is in the list.
		pizzaRemoveIngredient(ing); //Removes the ingredient from the list.
	}
	else { //If the ingredient is NOT in the list.
		pizzaAddIngredient(ing); //Adds the ingredient to the list.
	}
});
//The click event for the confirm button confirms the customized pizza.
$('#confirm').click(function() { setGlobalPizza(); });
