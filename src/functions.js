
import "..\\lib\\jquery.min.js";
import { saveAs } from "..\\lib\\FileSaver.js";
import { $w } from ".\\sessions.js";
import { $G } from ".\\helpers.js";
import { TAU } from ".\\helpers.js";
import { tools } from ".\\tools.js";
import { $toolbox } from ".\\app.js";
import { $canvas } from ".\\app.js";
import { ctx } from ".\\app.js";
import { canvas } from ".\\app.js";
import { $canvas_area } from ".\\app.js";
import { $app } from ".\\app.js";
import { app_saved_modificationFunc_55 } from ".\\app.js";
import { app_saved_modificationFunc_54 } from ".\\app.js";
import { app_saved_modificationFunc_53 } from ".\\app.js";
import { app_saved_modificationFunc_52 } from ".\\app.js";
import { app_saved_modificationFunc_51 } from ".\\app.js";
import { saved } from ".\\app.js";
import { app_file_name_modificationFunc_50 } from ".\\app.js";
import { app_file_name_modificationFunc_49 } from ".\\app.js";
import { app_file_name_modificationFunc_48 } from ".\\app.js";
import { app_file_name_modificationFunc_47 } from ".\\app.js";
import { file_name } from ".\\app.js";
import { app_redos_modificationFunc_46 } from ".\\app.js";
import { app_redos_modificationFunc_45 } from ".\\app.js";
import { app_redos_modificationFunc_44 } from ".\\app.js";
import { redos } from ".\\app.js";
import { app_undos_modificationFunc_43 } from ".\\app.js";
import { undos } from ".\\app.js";
import { app_textbox_modificationFunc_42 } from ".\\app.js";
import { textbox } from ".\\app.js";
import { app_selection_modificationFunc_41 } from ".\\app.js";
import { app_selection_modificationFunc_40 } from ".\\app.js";
import { app_selection_modificationFunc_39 } from ".\\app.js";
import { app_selection_modificationFunc_38 } from ".\\app.js";
import { selection } from ".\\app.js";
import { app_colors_modificationFunc_37 } from ".\\app.js";
import { colors } from ".\\app.js";
import { app_previous_tool_modificationFunc_36 } from ".\\app.js";
import { previous_tool } from ".\\app.js";
import { app_selected_tool_modificationFunc_35 } from ".\\app.js";
import { selected_tool } from ".\\app.js";
import { my_canvas_height } from ".\\app.js";
import { my_canvas_width } from ".\\app.js";
import { default_canvas_height } from ".\\app.js";
import { default_canvas_width } from ".\\app.js";
import { app_magnification_modificationFunc_34 } from ".\\app.js";
import { magnification } from ".\\app.js";
import { app_transparency_modificationFunc_33 } from ".\\app.js";
import { app_transparency_modificationFunc_32 } from ".\\app.js";
import { app_transparency_modificationFunc_31 } from ".\\app.js";
import { transparency } from ".\\app.js";
import { fs } from "..\\test.js";
import { stretch_and_skew } from ".\\image-manipulation.js";
import { rotate } from ".\\image-manipulation.js";
import { flip_vertical } from ".\\image-manipulation.js";
import { flip_horizontal } from ".\\image-manipulation.js";
import { apply_image_transformation } from ".\\image-manipulation.js";
import { e } from "..\\lib\\font-detective.js";
import { Selection } from ".\\Selection.js";
import { Canvas } from ".\\helpers.js";
import { E } from ".\\helpers.js";
import { $FormWindow } from ".\\$Window.js";
import { end } from ".\\tools.js";
import { passive } from ".\\tools.js";
import { action } from ".\\menus.js";
export var file_entry;

export function update_magnified_canvas_size() {
	$canvas.css("width", canvas.width * magnification);
	$canvas.css("height", canvas.height * magnification);
}

export function set_magnification(scale) {
	app_magnification_modificationFunc_34();
	update_magnified_canvas_size();
	$G.triggerHandler("resize");
}

export function reset_magnification() {
	set_magnification(1);
}

export function reset_colors() {
	app_colors_modificationFunc_37();
	$G.trigger("option-changed");
}

export function reset_file() {
	file_entry = null;
	app_file_name_modificationFunc_47();
	update_title();
	app_saved_modificationFunc_51();
}

export function reset_canvas() {
	app_undos_modificationFunc_43();
	app_redos_modificationFunc_44();
	
	canvas.width = my_canvas_width;
	canvas.height = my_canvas_height;
	
	ctx.fillStyle = colors.background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	$canvas_area.trigger("resize");
}

export function update_title() {
	document.title = file_name + " - Paint";
}

export function create_and_trigger_input(attrs, callback) {
	var $input = $(E("input")).attr(attrs)
		.on("change", function(){
			callback(this);
			$input.remove();
		})
		.appendTo($app)
		.hide()
		.click();
	return $input;
}

export function get_FileList(callback) {
	create_and_trigger_input({type: "file"}, function(input){
		callback(input.files);
	});
}

function open_from_Image(img, callback){
	are_you_sure(function(){
		this_ones_a_frame_changer();
		
		reset_file();
		reset_colors();
		reset_canvas(); // (with newly reset colors)
		reset_magnification();
		
		ctx.copy(img);
		detect_transparency();
		$canvas_area.trigger("resize");
		
		callback && callback();
	});
}

export function open_from_URI(uri, callback) {
	var img = new Image();
	img.onload = function(){
		open_from_Image(img, callback);
	};
	img.src = uri;
}

function open_from_File(file, callback){
	// @TODO: use URL.createObjectURL(file) when available
	// use URL.revokeObjectURL() too
	var reader = new FileReader();
	reader.onload = function(e){
		open_from_URI(e.target.result, function(){
			app_file_name_modificationFunc_48();
			update_title();
			app_saved_modificationFunc_52();
			callback && callback();
		});
	};
	reader.readAsDataURL(file);
}

export function open_from_FileList(files, callback) {
	$.each(files, function(i, file){
		if(file.type.match(/image/)){
			open_from_File(file, callback);
			return false;
		}
	});
}

export function open_from_FileEntry(entry, callback) {
	entry.file(function(file){
		open_from_File(file, function(){
			file_entry = entry;
			callback && callback();
		});
	});
}

function save_to_FileEntry(entry, callback){
	entry.createWriter(function(file_writer){
		file_writer.onwriteend = function(e){
			if(this.error){
				console.error(this.error + '\n\n\n@ ' + e);
			}else{
				callback && callback();
				console.log("File written!");
			}
		};
		canvas.toBlob(function(blob){
			file_writer.write(blob);
		});
	});
}

export function file_new() {
	are_you_sure(function(){
		this_ones_a_frame_changer();
		
		reset_file();
		reset_colors();
		reset_canvas(); // (with newly reset colors)
		reset_magnification();
	});
}

export function file_open() {
	if(window.chrome && chrome.fileSystem && chrome.fileSystem.chooseEntry){
		chrome.fileSystem.chooseEntry({
			type: "openFile",
			accepts: [{mimeTypes: ["image/*"]}]
		}, function(entry){
			file_entry = entry;
			if(chrome.runtime.lastError){
				return console.error(chrome.runtime.lastError.message);
			}
			open_from_FileEntry(entry);
		});
	}else{
		get_FileList(open_from_FileList);
	}
}

export function file_save() {
	if(file_name.match(/\.svg$/)){
		app_file_name_modificationFunc_49();
		//update_title()?
		return file_save_as();
	}
	if(window.chrome && chrome.fileSystem && chrome.fileSystem.chooseEntry && window.file_entry){
		save_to_FileEntry(file_entry);
	}else{
		file_save_as();
	}
}

export function file_save_as() {
	if(window.chrome && chrome.fileSystem && chrome.fileSystem.chooseEntry){
		chrome.fileSystem.chooseEntry({
			type: 'saveFile',
			suggestedName: file_name,
			accepts: [{mimeTypes: ["image/*"]}]
		}, function(entry){
			if(chrome.runtime.lastError){
				return console.error(chrome.runtime.lastError.message);
			}
			file_entry = entry;
			app_file_name_modificationFunc_50();
			update_title();
			save_to_FileEntry(file_entry);
		});
	}else{
		canvas.toBlob(function(blob){
			var file_saver = saveAs(blob, file_name);
			file_saver.onwriteend = function(){
				// this won't fire in chrome
				app_saved_modificationFunc_53();
			};
		});
	}
}


function are_you_sure(action){
	if(saved){
		action();
	}else{
		var $w = new $FormWindow().addClass("jspaint-dialogue-window");
		$w.title("Paint");
		$w.$main.text("Save changes to "+file_name+"?");
		$w.$Button("Save", function(){
			$w.close();
			file_save();
			action();
		}).focus();
		$w.$Button("Discard", function(){
			$w.close();
			action();
		});
		$w.$Button("Cancel", function(){
			$w.close();
		});
		$w.center();
	}
}

export function paste_file(blob) {
	var reader = new FileReader();
	reader.onload = function(e){
		var img = new Image();
		img.onload = function(){
			paste(img);
		};
		img.src = e.target.result;
	};
	reader.readAsDataURL(blob);
}

export function paste_from() {
	get_FileList(function(files){
		$.each(files, function(i, file){
			if(file.type.match(/image/)){
				paste_file(file);
				return false;
			}
		});
	});
}

export function paste(img) {
	
	if(img.width > canvas.width || img.height > canvas.height){
		var $w = new $FormWindow().addClass("jspaint-dialogue-window");
		$w.title("Paint");
		$w.$main.html(
			"The image is bigger than the canvas.<br>" +
			"Would you like the canvas to be enlarged?<br>"
		);
		$w.$Button("Enlarge", function(){
			$w.close();
			// Additional undoable
			undoable(function(){
				var original = undos[undos.length-1];
				canvas.width = Math.max(original.width, img.width);
				canvas.height = Math.max(original.height, img.height);
				if(!transparency){
					ctx.fillStyle = colors.background;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}
				ctx.drawImage(original, 0, 0);
				paste_img();
				$canvas_area.trigger("resize");
			});
		}).focus();
		$w.$Button("Crop", function(){
			$w.close();
			paste_img();
		});
		$w.$Button("Cancel", function(){
			$w.close();
		});
		$w.center();
	}else{
		paste_img();
	}
	
	function paste_img(){
		// Note: selecting a tool calls deselect();
		select_tool("Select");
		
		app_selection_modificationFunc_38();
		selection.instantiate(img);
	}
}

export function render_history_as_gif() {
	var $win = $FormWindow();
	$win.title("Rendering GIF");
	$win.center();
	var $output = $win.$main;
	var $progress = $(E("progress")).appendTo($output);
	var $progress_percent = $(E("span")).appendTo($output).css({
		width: "2.3em",
		display: "inline-block",
		textAlign: "center",
	});
	$win.$main.css({padding: 5});
	
	var $cancel = $win.$Button('Cancel', function(){
		$win.close();
	});
	
	$win.on('close', function(){
		gif.abort();
	});
	
	try{
		var width = canvas.width;
		var height = canvas.height;
		var gif = new GIF({
			//workers: Math.min(5, Math.floor(undos.length/50)+1),
			workerScript: "lib/gif.js/gif.worker.js",
			width: width,
			height: height,
		});
		
		gif.on("progress", function(p){
			$progress.val(p);
			$progress_percent.text(~~(p*100)+"%");
		});
		
		gif.on("finished", function(blob){
			$win.title("Rendered GIF");
			var url = URL.createObjectURL(blob);
			$output.empty().append(
				$(E("img")).attr({
					src: url,
					width: width,
					height: height,
				})
			);
			$win.$Button("Save", function(){
				$win.close();
				saveAs(blob, file_name + " history.gif");
			});
			$cancel.appendTo($win.$buttons);
			$win.center();
		});
		
		for(var i=0; i<undos.length; i++){
			gif.addFrame(undos[i], {delay: 200});
		}
		gif.addFrame(canvas, {
			delay: 200,
			copy: true,
		});
		gif.render();
		
	}catch(e){
		$output.empty().append(
			$(E("p")).text("Failed to render GIF:\n").append(
				$(E("pre")).text(e.stack).css({
					background: "#A00",
					color: "white",
					fontFamily: "monospace",
					width: "500px",
					overflow: "auto",
				})
			)
		);
		$win.title("Error Rendering GIF");
		$win.center();
		console.error("Failed to render GIF:\n", e);
	}
}

export function undoable(callback, action) {
	app_saved_modificationFunc_54();
	if(redos.length > 5){
		var $w = new $FormWindow().addClass("jspaint-dialogue-window");
		$w.title("Paint");
		$w.$main.html("Discard "+redos.length+" possible redo-able actions?<br>(Ctrl+Y or Ctrl+Shift+Z to redo)<br>");
		$w.$Button(action ? "Discard and Apply" : "Discard", function(){
			$w.close();
			app_redos_modificationFunc_45();
			action && action();
		}).focus();
		$w.$Button("Keep", function(){
			$w.close();
		});
		$w.center();
		return false;
	}else{
		app_redos_modificationFunc_46();
	}
	
	undos.push(new Canvas(canvas));
	
	action && action();
	callback && callback();
	return true;
}

export function undo() {
	if(undos.length<1){ return false; }
	this_ones_a_frame_changer();
	
	redos.push(new Canvas(canvas));
	
	ctx.copy(undos.pop());
	
	$canvas_area.trigger("resize");
	
	return true;
}

export function redo() {
	if(redos.length<1){ return false; }
	this_ones_a_frame_changer();
	
	undos.push(new Canvas(canvas));
	
	ctx.copy(redos.pop());
	
	$canvas_area.trigger("resize");
	
	return true;
}

function cancel(){
	if(!selected_tool.passive){ undo(); }
	$G.triggerHandler("pointerup", "cancel");
}

export function this_ones_a_frame_changer() {
	deselect();
	app_saved_modificationFunc_55();
	$G.triggerHandler("pointerup", "cancel");
	$G.triggerHandler("session-update");
}

export function deselect() {
	if(selection){
		selection.draw();
		selection.destroy();
		app_selection_modificationFunc_39();
	}
	if(textbox){
		textbox.draw();
		textbox.destroy();
		app_textbox_modificationFunc_42();
	}
	if(selected_tool.end){
		selected_tool.end();
	}
}

export function delete_selection() {
	if(selection){
		selection.destroy();
		app_selection_modificationFunc_40();
	}
}

export function select_all() {
	// Note: selecting a tool calls deselect();
	select_tool("Select");
	
	app_selection_modificationFunc_41();
	selection.instantiate();
}

export function image_invert() {
	apply_image_transformation(function(original_canvas, original_ctx, new_canvas, new_ctx){
		var id = original_ctx.getImageData(0, 0, original_canvas.width, original_canvas.height);
		for(var i=0; i<id.data.length; i+=4){
			id.data[i+0] = 255 - id.data[i+0];
			id.data[i+1] = 255 - id.data[i+1];
			id.data[i+2] = 255 - id.data[i+2];
		}
		new_ctx.putImageData(id, 0, 0);
	});
}

export function clear() {
	undoable(0, function(){
		this_ones_a_frame_changer();
		
		if(transparency){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}else{
			ctx.fillStyle = colors.background;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	});
}

export function view_bitmap() {
	if(canvas.requestFullscreen){ canvas.requestFullscreen(); }
	if(canvas.webkitRequestFullscreen){ canvas.webkitRequestFullscreen(); }
}

function select_tool(name){
	app_previous_tool_modificationFunc_36();
	for(var i=0; i<tools.length; i++){
		if(tools[i].name == name){
			app_selected_tool_modificationFunc_35();
		}
	}
	if($toolbox){
		$toolbox.update_selected_tool();
	}
}

function detect_transparency(){
	app_transparency_modificationFunc_31();
	
	// @TODO Optimization: Assume JPEGs and some other file types are opaque.
	// Raster file formats that SUPPORT transparency include GIF, PNG, BMP and TIFF
	// (Yes, even BMPs support transparency!)
	
	var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for(var i=0, l=id.data.length; i<l; i+=4){
		if(id.data[i+3] < 255){
			app_transparency_modificationFunc_32();
		}
	}
}

export function image_attributes() {
	if(image_attributes.$window){
		image_attributes.$window.close();
	}
	var $w = image_attributes.$window = new $FormWindow("Attributes");
	
	var $main = $w.$main;
	var $buttons = $w.$buttons;
	
	// Information
	
	var table = {
		"File last saved": "Not available", // @TODO
		"Size on disk": "Not available", // @TODO
		"Resolution": "72 x 72 dots per inch",
	};
	var $table = $(E("table")).appendTo($main);
	for(var k in table){
		var $tr = $(E("tr")).appendTo($table);
		var $key = $(E("td")).appendTo($tr).text(k + ":");
		var $value = $(E("td")).appendTo($tr).text(table[k]);
	}
	
	// Dimensions
	
	var unit_sizes_in_px = {px: 1, in: 72, cm: 28.3465};
	var current_unit = image_attributes.unit = image_attributes.unit || "px";
	var width_in_px = canvas.width;
	var height_in_px = canvas.height;
	
	var $width_label = $(E("label")).appendTo($main).text("Width:");
	var $height_label = $(E("label")).appendTo($main).text("Height:");
	var $width = $(E("input")).appendTo($width_label);
	var $height = $(E("input")).appendTo($height_label);
	
	$main.find("input")
		.css({width: "40px"})
		.on("change keyup keydown keypress pointerdown pointermove paste drop", function(){
			if($(this).is($width)){
				width_in_px = $width.val() * unit_sizes_in_px[current_unit];
			}
			if($(this).is($height)){
				height_in_px = $height.val() * unit_sizes_in_px[current_unit];
			}
		});
	
	// Fieldsets
	
	var $units = $(E("fieldset")).appendTo($main).append('<legend>Transparency</legend>');
	$units.append('<label><input type="radio" name="units" value="in">Inches</label>');
	$units.append('<label><input type="radio" name="units" value="cm">Cm</label>');
	$units.append('<label><input type="radio" name="units" value="px">Pixels</label>');
	$units.find("[value=" + current_unit + "]").attr({checked: true});
	$units.on("change", function(){
		var new_unit = $units.find(":checked").val();
		$width.val(width_in_px / unit_sizes_in_px[new_unit]);
		$height.val(height_in_px / unit_sizes_in_px[new_unit]);
		current_unit = new_unit;
	}).triggerHandler("change");
	
	var $transparency = $(E("fieldset")).appendTo($main).append('<legend>Transparency</legend>');
	$transparency.append('<label><input type="radio" name="transparency" value="transparent">Transparent</label>');
	$transparency.append('<label><input type="radio" name="transparency" value="opaque">Opaque</label>');
	$transparency.find("[value=" + (transparency ? "transparent" : "opaque") + "]").attr({checked: true});
	
	// Buttons on the right
	
	$w.$Button("Okay", function(){
		var to = $transparency.find(":checked").val();
		var unit = $units.find(":checked").val();
		
		image_attributes.unit = unit;
		app_transparency_modificationFunc_33());
		
		var unit_to_px = unit_sizes_in_px[unit];
		var width = $width.val() * unit_to_px;
		var height = $height.val() * unit_to_px;
		$canvas.trigger("user-resized", [0, 0, ~~width, ~~height]);
		
		image_attributes.$window.close();
	}).focus();
	
	$w.$Button("Cancel", function(){
		image_attributes.$window.close();
	});
	
	$w.$Button("Default", function(){
		width_in_px = default_canvas_width;
		height_in_px = default_canvas_height;
		$width.val(width_in_px / unit_sizes_in_px[current_unit]);
		$height.val(height_in_px / unit_sizes_in_px[current_unit]);
	});
	
	// Reposition the window
	
	image_attributes.$window.center();
}

export function image_flip_and_rotate() {
	var $w = new $FormWindow("Flip and Rotate");
	
	var $fieldset = $(E("fieldset")).appendTo($w.$main);
	$fieldset.append("<legend>Flip or rotate</legend>");
	$fieldset.append("<label><input type='radio' name='flip-or-rotate' value='flip-horizontal' checked/>Flip horizontal</label>");
	$fieldset.append("<label><input type='radio' name='flip-or-rotate' value='flip-vertical'/>Flip vertical</label>");
	$fieldset.append("<label><input type='radio' name='flip-or-rotate' value='rotate-by-angle'/>Rotate by angle<div></div></label>");
	
	var $rotate_by_angle = $fieldset.find("div")
	$rotate_by_angle.css({paddingLeft: "30px"});
	$rotate_by_angle.append("<label><input type='radio' name='rotate-by-angle' value='90' checked/>90°</label>");
	$rotate_by_angle.append("<label><input type='radio' name='rotate-by-angle' value='180'/>180°</label>");
	$rotate_by_angle.append("<label><input type='radio' name='rotate-by-angle' value='270'/>270°</label>");
	$rotate_by_angle.append("<label><input type='radio' name='rotate-by-angle' value='arbitrary'/><input type='number' min='-360' max='360' name='rotate-by-arbitrary-angle' value=''/> Degrees</label>");
	$rotate_by_angle.find("input").attr({disabled: true});
	
	$fieldset.find("input").on("change", function(){
		var action = $fieldset.find("input[name='flip-or-rotate']:checked").val();
		$rotate_by_angle.find("input").attr({
			disabled: action !== "rotate-by-angle"
		});
	});
	$rotate_by_angle.find("label, input").on("click", function(e){
		// Select "Rotate by angle" and enable subfields
		$fieldset.find("input[value='rotate-by-angle']").prop("checked", true);
		$fieldset.find("input").triggerHandler("change");
		
		var $label = $(this).closest("label");
		// Focus the numerical input if this field has one
		$label.find("input[type='number']").focus();
		// Select the radio for this field
		$label.find("input[type='radio']").prop("checked", true);
	});
	// @TODO: enable all controls that are accessable to the pointer
	
	$fieldset.find("label").css({display: "block"});
	
	$w.$Button("Okay", function(){
		var action = $fieldset.find("input[name='flip-or-rotate']:checked").val();
		var angle_val = $fieldset.find("input[name='rotate-by-angle']:checked").val();
		if(angle_val === "arbitrary"){
			angle_val = $fieldset.find("input[name='rotate-by-arbitrary-angle']").val();
		}
		var angle_deg = parseFloat(angle_val);
		var angle = angle_deg / 360 * TAU;
		
		if(isNaN(angle)){
			var $msgw = new $FormWindow("Invalid Value").addClass("jspaint-dialogue-window");
			$msgw.$main.text("The value specified for Degrees was invalid.");
			$msgw.$Button("Okay", function(){
				$msgw.close();
			});
			return;
		}
		
		switch(action){
			case "flip-horizontal":
				flip_horizontal();
				break;
			case "flip-vertical":
				flip_vertical();
				break;
			case "rotate-by-angle":
				rotate(angle);
				break;
		}
		
		$w.close();
	}).focus();
	$w.$Button("Cancel", function(){
		$w.close();
	});
	
	$w.center();
}

export function image_stretch_and_skew() {
	var $w = new $FormWindow("Stretch and Skew");
	
	var $fieldset_stretch = $(E("fieldset")).appendTo($w.$main);
	$fieldset_stretch.append("<legend>Stretch</legend><table></table>");
	var $fieldset_skew = $(E("fieldset")).appendTo($w.$main);
	$fieldset_skew.append("<legend>Skew</legend><table></table>");
	
	var $RowInput = function($table, img_src, label_text, default_value, label_unit){
		var $tr = $(E("tr")).appendTo($table);
		var $img = $(E("img")).attr({
			src: "images/transforms/" + img_src + ".png"
		}).css({
			marginRight: "20px"
		});
		var $input = $(E("input")).attr({
			value: default_value
		}).css({
			width: "40px"
		});
		$(E("td")).appendTo($tr).append($img);
		$(E("td")).appendTo($tr).text(label_text);
		$(E("td")).appendTo($tr).append($input);
		$(E("td")).appendTo($tr).text(label_unit);
		
		return $input;
	};
	
	var stretch_x = $RowInput($fieldset_stretch.find("table"), "stretch-x", "Horizontal:", 100, "%");
	var stretch_y = $RowInput($fieldset_stretch.find("table"), "stretch-y", "Vertical:", 100, "%");
	var skew_x = $RowInput($fieldset_skew.find("table"), "skew-x", "Horizontal:", 0, "Degrees");
	var skew_y = $RowInput($fieldset_skew.find("table"), "skew-y", "Vertical:", 0, "Degrees");
	
	$w.$Button("Okay", function(){
		var xscale = parseFloat(stretch_x.val())/100;
		var yscale = parseFloat(stretch_y.val())/100;
		var hskew = parseFloat(skew_x.val())/360*TAU;
		var vskew = parseFloat(skew_y.val())/360*TAU;
		stretch_and_skew(xscale, yscale, hskew, vskew);
		$w.close();
	}).focus();
	
	$w.$Button("Cancel", function(){
		$w.close();
	});
	
	$w.center();
}

export function set_as_wallpaper_tiled(c) {
	c = c || canvas;
	
	var wp = new Canvas(screen.width, screen.height);
	for(var x=0; x<wp.width; x+=c.width){
		for(var y=0; y<wp.height; y+=c.height){
			wp.ctx.drawImage(c, x, y);
		}
	}
	
	set_as_wallpaper_centered(wp);
}

export function set_as_wallpaper_centered(c) {
	c = c || canvas;
	
	if(window.chrome && chrome.wallpaper){
		chrome.wallpaper.setWallpaper({
			url: c.toDataURL(),
			layout: 'CENTER_CROPPED',
			name: file_name,
		}, function(){});
	}else if(window.require){
		var gui = require("nw.gui");
		var fs = require("fs");
		var wallpaper = require("wallpaper");
		
		var base64 = c.toDataURL().replace(/^data:image\/png;base64,/, "");
		var imgPath = require("path").join(gui.App.dataPath, "bg.png");
		
		fs.writeFile(imgPath, base64, "base64", function(err){
			if(err){
				alert("Failed to set as desktop background:\nCouldn't write temporary image file");
			}else{
				wallpaper.set(imgPath, function(err){
					if(err){
						alert("Failed to set as desktop background!\n" + err);
					}
				});
			}
		});
	}else{
		c.toBlob(function(blob){
			saveAs(blob, file_name.replace(/\.(bmp|png|gif|jpe?g|tiff|webp)/, "") + " wallpaper.png");
		});
	}
}

export function save_selection_to_file() {
	if(selection && selection.canvas){
		if(window.chrome && chrome.fileSystem && chrome.fileSystem.chooseEntry){
			chrome.fileSystem.chooseEntry({
				type: 'saveFile',
				suggestedName: 'Selection',
				accepts: [{mimeTypes: ["image/*"]}]
			}, function(entry){
				if(chrome.runtime.lastError){
					return console.error(chrome.runtime.lastError.message);
				}
				entry.createWriter(function(file_writer){
					file_writer.onwriteend = function(e){
						if(this.error){
							console.error(this.error + '\n\n\n@ ' + e);
						}else{
							console.log("Wrote selection to file!");
						}
					};
					selection.canvas.toBlob(function(blob){
						file_writer.write(blob);
					});
				});
			});
		}else{
			selection.canvas.toBlob(function(blob){
				saveAs(blob, "selection.png");
			});
		}
	}
}
