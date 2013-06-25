var image = new Array('html5', 'css3', 'js');
var rand = 0, random = Array(), actualPlaced = Array();
var level = 3;
var dimension = 225;

var started;
var interval_id;
var duration;
var scoring = Array();

//fonction charg� de l'initialisation du jeu
function initialize_game()
{
	//on dit que le jeu n'est pas d�marr�
	started = false;
	
	rand = Math.round(Math.random() * 10) % image.length;

	var mixed 		= $("#mixed");
	var assembled 	= $("#assembled");
	var original 	= $("#original");
	
	generate_table(assembled);
	generate_table(original);
	generate_table(mixed);
	
	dimension = $("td").width() * level;
	var i, j = Math.pow(level, 2);
	
	//on mélange les cases du tableau maintenant

	//on initialise le tableau à l'envers
	for(i=0; i<j; i++)
	{
		random[i] = j - (i+1);
	}
	
	var temp_number;
	var rand_number;
	for(i=0; i<j; i++)
	{
		rand_number = Math.round(Math.random() * 10) % (Math.pow(level, 2) - 1);
		temp_number = random[i];
		random[i] = random[rand_number];
		random[rand_number] = temp_number;
	}
	
	var original_array = Array();
	for(i=0; i<j; i++)
	{
		original_array[i] = i;
	}
	
	insert_table("original", original_array);
	insert_table("mixed", random);
	
	for(i=0; i<j; i++)
	{
		actualPlaced[i] = -1;
	}
	
	activate_dragdrop();
	updateDisplayTimer(0);
	
	getScoring();
	display_scoring(scoring);
}

//fonction appelée à chaque fois qu'une pièce est droppée
function play($draggable, $item)
{
	if(!started)
	{
		started = true;
		startTimer();
	}
	
	var draggable_id = $draggable.attr('id');
	var item_id = $item.attr('id');
	
	draggable_id = parseInt(draggable_id);
	item_id = parseInt(item_id);
	
	var item_index = actualPlaced[item_id];
	item_index = array_search(item_index, random);
	
	var placed = actualPlaced[item_id];
	
	//on met à jour le tableau contenant les valeurs d'ordre du puzzle
	updateArrayPlaced($draggable, $item);
	
	if(isMixedArray($draggable) && placed !== -1)
		$draggable.attr('id', item_index);
	
	//on commence par vérifier si l'élement est à ajouter ou alors à inverser
	if(isMixedArray($draggable) && placed === -1)
		copyImage($draggable, $item);
	else
		invertImage($draggable, $item);
	
	dragdrop($item);

	//si le tableau présente les chiffres dans l'ordre c'est qu'on a gagné
	if(is_in_order(actualPlaced)) win();
}

function win()
{
	//on stop le chronomètre
	stopTimer();
	
	//on fait une petite animation
	$(".wrapper-container").animate({"background-color": "yellow"}, 150);
	$(".wrapper-container").animate({"background-color": "white"}, 25);
	
	//on désactive la dragdrop, met à jour les scores dans le tableaux des scores et on affiche ces scores
	desactivate_dragdrop();
	updateScoring(duration);
	display_scoring(scoring);
	
	//sauvegarder les scores en local
	save_scoring();
	
	$("#result").html("You win !");
	window.setTimeout(function(){
		$("#result").html("<input type='button' id='replay' value='replay' />");
		$("#replay").click(function(){ replay(); });
	}, 1000);
}

function replay()
{
	$("#result").empty();
	clean_table();
	
	initialize_game();
}

function change_level(new_level)
{
	desactivate_dragdrop();
	level = new_level;
	clean_table();
	initialize_game();
}

//fonction permettant de mettre � jour les donn�es dans le tableau
function updateArrayPlaced($item1, $item2)
{
	var item1_id = $item1.attr('id');
	var item2_id = $item2.attr('id');

	item1_id = parseInt(item1_id);
	item2_id = parseInt(item2_id);
	
	if(isMixedArray($item1))
	{
		actualPlaced[item2_id] = random[item1_id];
	}
	else
	{		
		var index1_id = actualPlaced[item1_id];
		var index2_id = actualPlaced[item2_id];
		
		actualPlaced[item2_id] = index1_id;
		actualPlaced[item1_id] = index2_id;		
	}
}

//fonction permettant de savoir si l'élement fait partit du tableau #mixed
function isMixedArray($item)
{
	if($item.parent().parent().parent().attr('id') == "mixed")
		return true;
	else
		return false;
}

//pour regarder si les élément sont dans l'ordre dans un tableau
function is_in_order(array)
{
	var i, length = array.length;
	for(i=0; i<length; i++)
	{
		if(array[i] != i) return false;
	}
	
	return true;
}

//permet de récupérer les scores à partir des valeurs local
function getScoring()
{
	var scoring_string;
	
	if(localStorage.scoring)
		scoring_string = localStorage.scoring;
	else
		scoring_string = "";
	
	if(scoring_string != "") scoring = scoring_string.split(',');
}

//permet de stocker les score en local
function save_scoring()
{
	var scoring_string = scoring.join();
	localStorage.scoring = scoring_string;
}

//permet de mettre à jour les scores et de classer les scores en fonction de la dernière durée rajout�
function updateScoring(duration)
{
	var new_scoring = Array();
	
	var score, i, j=0, length = scoring.length;
	for(i=0; i < 3; i++)
	{
		if(i === length){
			new_scoring[i] = duration;
			break;
		} 
		
		score = parseInt(scoring[i]);
		if(duration < score && i === j)
			new_scoring[i] = duration;
		else {
			new_scoring[i] = scoring[j];
			j++;
		}
	}
	
	scoring = new_scoring;
}

//fonction de recherche d'un élément dans un tableau et retourne l'index
function array_search(value, array) {
    for (var i=0; i<array.length; i++)
    {
    	if (array[i] == value)
    		return i;
    }

    return false;
}