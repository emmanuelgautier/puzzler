//fonction d'ouverture de la popup demandant le niveau
function open_popup_level()
{
	$( "#dialog-level" ).dialog({
		height: 140
	});
	
	control_popup_level();
	$("#dialog-level button").click(function(){  $("#dialog-level").dialog("close"); });
}

//fonction permettant de mettre à jour le temps affich�
function updateDisplayTimer(time)
{
	$("#timer").html(time);
}

//fonction permettant d'afficher les scores
function display_scoring(scoring)
{
	var order = "";
	
	var i, length = scoring.length;
	for(i=0; i<length;i++)
	{
		order += "<li>"+scoring[i]+" secs</li>";
	}
	
	$("#ranking").html(order);
}

//fonction permettant de g�n�rant les tableaux o� sont contenu les parties d'images
function generate_table(table_element)
{
	var table = "";
	
	n = 3;
	var i, j;
	
	for(i=0; i<level; i++)
	{
		table += "<tr>";
		
		for(j=0; j<level; j++)
		{
			table += "<td id='"+(i*level + j)+"'>";
			
			table += "</td>";
		}
		
		table += "</tr>";
	}
	
	table_element.append(table);
}

//fonction qui ins�re les parties d'images selon l'ordre dans le tableau d'index, les dimensions, le niveau choisis
function insert_table(table_element, index)
{
	var positionX, positionY;
	var tile_dimension = dimension / level;
	
	var j = Math.pow(level, 2);
	for(var i=0; i<j; i++)
	{
		positionX = -1 * (index[i] % level) * tile_dimension;
		positionY = -1 *(index[i] - (index[i] % level)) / level * tile_dimension;
		
		$("#"+table_element+" #"+i).css({'background': "url('image/"+image[rand]+".jpg') top left no-repeat", "background-position": positionX+"px "+positionY+"px", "background-size": dimension+"px"});
	}
}

function copyImage( $item, $item_copy) {
	var css = $item.attr('style');
		
	$item.remove();
	$item_copy.attr('style', css);
	$item_copy.css({'top':'', 'left':'', 'position':''});
}

function invertImage( $item1, $item2){
	var css1 = $item1.attr('style');
	var css2 = $item2.attr('style');
	
	if(!css2) css2 = '';
	
	$item1.attr('style', css2);
	$item2.attr('style', css1);
	
	$item1.css({'top':'', 'left':''});
	$item2.css({'top':'', 'left':''});
}

function clean_table()
{
	$("#mixed").empty();
	$("#assembled").empty();
	$("#original").empty();
}