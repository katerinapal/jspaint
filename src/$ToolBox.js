
import "..\\lib\\jquery.min.js";
import { tools } from ".\\tools.js";
import { $status_text } from ".\\app.js";
import { $canvas } from ".\\app.js";
import { app_previous_tool_modificationFunc_36 } from ".\\app.js";
import { app_previous_tool_modificationFunc_23 } from ".\\app.js";
import { previous_tool } from ".\\app.js";
import { app_selected_tool_modificationFunc_35 } from ".\\app.js";
import { app_selected_tool_modificationFunc_22 } from ".\\app.js";
import { app_selected_tool_modificationFunc_21 } from ".\\app.js";
import { selected_tool } from ".\\app.js";
import { $Component } from ".\\$Component.js";
import { deselect } from ".\\functions.js";
import { E } from ".\\helpers.js";
import { Cursor } from ".\\helpers.js";
import { activate } from ".\\tools.js";

export function $ToolBox() {
	var $tb = $(E("div")).addClass("jspaint-tool-box");
	var $tools = $(E("div")).addClass("jspaint-tools");
	var $tool_options = $(E("div")).addClass("jspaint-tool-options");
	
	var showing_tooltips = false;
	$tools.on("pointerleave", function(){
		showing_tooltips = false;
		$status_text.default();
	});
	
	var $buttons = $($.map(tools, function(tool, i){
		var $b = $(E("button")).addClass("jspaint-tool");
		$b.appendTo($tools);
		tool.$button = $b;
		
		$b.attr("title", tool.name);
		
		var $icon = $(E("span"));
		$icon.appendTo($b);
		var bx = (i%2)*24;
		var by = (~~(i/2))*25;
		$icon.css({
			display: "block",
			position: "absolute",
			left: 0,
			top: 0,
			width: 24,
			height: 24,
			backgroundImage: "url(images/toolbar-icons.png)",
			backgroundPosition: bx + "px " + -by + "px",
		});
		
		$b.on("click", function(){
			if(selected_tool === tool && tool.deselect){
				app_selected_tool_modificationFunc_21();
			}else{
				if(!tool.deselect){
					app_previous_tool_modificationFunc_23();
				}
				app_selected_tool_modificationFunc_22();
			}
			$c.update_selected_tool();
		});
		
		$b.on("pointerenter", function(){
			var show_tooltip = function(){
				showing_tooltips = true;
				$status_text.text(tool.description);
			};
			if(showing_tooltips){
				show_tooltip();
			}else{
				var tid = setTimeout(show_tooltip, 300);
				$b.on("pointerleave", function(){
					clearTimeout(tid);
				});
			}
		});
		
		return $b[0];
	}));
	
	var $c = $Component("Tools", "tall", $tools.add($tool_options));
	$c.update_selected_tool = function(){
		$buttons.removeClass("selected");
		selected_tool.$button.addClass("selected");
		$tool_options.children().detach();
		$tool_options.append(selected_tool.$options);
		$tool_options.children().trigger("update");
		$canvas.css({
			cursor: Cursor(selected_tool.cursor),
		});
		deselect();
		if(selected_tool.activate){
			selected_tool.activate();
		}
	};
	$c.update_selected_tool();
	return $c;
}
