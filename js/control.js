function activate_dragdrop()
{
	$("#mixed td").draggable({revert: true, zIndex: 100, containment: ".wrapper-container", scroll: false});
	$("#assembled td").droppable({ drop: function(event, ui) { play(ui.draggable, $(this)); $(this).css('z-index', '1'); } });
}

function dragdrop($item)
{
	$item.draggable({revert: true, zIndex: 100, containment: ".wrapper-container", scroll: false});
	$item.droppable({ drop: function(event, ui) { play(ui.draggable, $item); $item.css('z-index', '1'); } });
}

function desactivate_dragdrop()
{
	$("#mixed td").draggable('destroy');
	$("#assembled td").droppable('destroy');
}

function startTimer()
{
	duration = 0;
	
	interval_id = window.setInterval(function(){
		duration++;
		updateDisplayTimer(duration);
	}, 1000);
}

function stopTimer()
{
	clearInterval(interval_id);
}

function control_popup_level()
{
	$("#level1").click(function(){change_level(3); });
	$("#level2").click(function(){change_level(4); });
	$("#level3").click(function(){change_level(5); });
}