
import { tool-options_transparent_opaque_modificationFunc_8 } from ".\\tool-options.js";
import { transparent_opaque } from ".\\tool-options.js";
import { saveAs } from "..\\lib\\FileSaver.js";
import { $G } from ".\\helpers.js";
import { $colorbox } from ".\\app.js";
import { $toolbox } from ".\\app.js";
import { $status_area } from ".\\app.js";
import { redos } from ".\\app.js";
import { undos } from ".\\app.js";
import { selection } from ".\\app.js";
import { app_palette_modificationFunc_20 } from ".\\app.js";
import { app_palette_modificationFunc_19 } from ".\\app.js";
import { app_palette_modificationFunc_18 } from ".\\app.js";
import { app_palette_modificationFunc_17 } from ".\\app.js";
import { app_palette_modificationFunc_16 } from ".\\app.js";
import { app_palette_modificationFunc_15 } from ".\\app.js";
import { app_palette_modificationFunc_14 } from ".\\app.js";
import { app_palette_modificationFunc_13 } from ".\\app.js";
import { app_palette_modificationFunc_12 } from ".\\app.js";
import { app_palette_modificationFunc_11 } from ".\\app.js";
import { app_palette_modificationFunc_10 } from ".\\app.js";
import { app_palette_modificationFunc_0 } from ".\\app.js";
import { palette } from ".\\app.js";
import { magnification } from ".\\app.js";
import { manage_storage } from ".\\manage-storage.js";
import { save_selection_to_file } from ".\\functions.js";
import { set_as_wallpaper_centered } from ".\\functions.js";
import { set_as_wallpaper_tiled } from ".\\functions.js";
import { image_stretch_and_skew } from ".\\functions.js";
import { image_flip_and_rotate } from ".\\functions.js";
import { image_attributes } from ".\\functions.js";
import { view_bitmap } from ".\\functions.js";
import { clear } from ".\\functions.js";
import { image_invert } from ".\\functions.js";
import { select_all } from ".\\functions.js";
import { delete_selection } from ".\\functions.js";
import { redo } from ".\\functions.js";
import { undo } from ".\\functions.js";
import { paste_from } from ".\\functions.js";
import { file_save_as } from ".\\functions.js";
import { file_save } from ".\\functions.js";
import { file_open } from ".\\functions.js";
import { file_new } from ".\\functions.js";
import { get_FileList } from ".\\functions.js";
import { set_magnification } from ".\\functions.js";
import { $Window } from ".\\$Window.js";
import { show_help } from ".\\help.js";
export var ____________________________ = "A HORIZONTAL RULE / DIVIDER";

export var menus = {
	"&File": [
		{
			item: "&New",
			shortcut: "Ctrl+N",
			action: file_new,
			description: "Creates a new document.",
		},
		{
			item: "&Open",
			shortcut: "Ctrl+O",
			action: file_open,
			description: "Opens an existing document.",
		},
		{
			item: "&Save",
			shortcut: "Ctrl+S",
			action: file_save,
			description: "Saves the active document.",
		},
		{
			item: "Save &As",
			shortcut: "Ctrl+Shift+S",
			//shortcut: "",
			action: file_save_as,
			description: "Saves the active document with a new name.",
		},
		____________________________,
		{
			item: "Print Pre&view",
			action: function(){
				print();
			},
			description: "Prints the active document and sets printing options.",
			//description: "Displays full pages.",
		},
		{
			item: "Page Se&tup",
			action: function(){
				print();
			},
			description: "Prints the active document and sets printing options.",
			//description: "Changes the page layout.",
		},
		{
			item: "&Print",
			shortcut: "Ctrl+P",
			action: function(){
				print();
			},
			description: "Prints the active document and sets printing options.",
		},
		____________________________,
		{
			item: "Set As &Wallpaper (Tiled)",
			action: set_as_wallpaper_tiled,
			description: "Tiles this bitmap as the desktop background.",
		},
		{
			item: "Set As Wa&llpaper (Centered)",
			action: set_as_wallpaper_centered,
			description: "Centers this bitmap as the desktop background.",
		},
		____________________________,
		{
			item: "Manage Storage",
			action: manage_storage,
			description: "Manages storage of previously created or opened pictures.",
		},
		____________________________,
		{
			item: "Recent File",
			enabled: false, // @TODO for chrome app
			description: "",
		},
		____________________________,
		{
			item: "E&xit",
			shortcut: "Alt+F4",
			action: function(){
				close();
			},
			description: "Quits Paint.",
		}
	],
	"&Edit": [
		{
			item: "&Undo",
			shortcut: "Ctrl+Z",
			enabled: function(){
				return undos.length >= 1;
			},
			action: undo,
			description: "Undoes the last action.",
		},
		{
			item: "&Repeat",
			shortcut: "F4",
			enabled: function(){
				return redos.length >= 1;
			},
			action: redo,
			description: "Redoes the previously undone action.",
		},
		____________________________,
		{
			item: "Cu&t",
			shortcut: "Ctrl+X",
			enabled: function(){
				// @TODO disable if no selection (image or text)
				return (typeof chrome !== "undefined") && chrome.permissions;
			},
			action: function(){
				document.execCommand("cut");
			},
			description: "Cuts the selection and puts it on the Clipboard.",
		},
		{
			item: "&Copy",
			shortcut: "Ctrl+C",
			enabled: function(){
				// @TODO disable if no selection (image or text)
				return (typeof chrome !== "undefined") && chrome.permissions;
			},
			action: function(){
				document.execCommand("copy");
			},
			description: "Copies the selection and puts it on the Clipboard.",
		},
		{
			item: "&Paste",
			shortcut: "Ctrl+V",
			enabled: function(){
				return (typeof chrome !== "undefined") && chrome.permissions;
			},
			action: function(){
				document.execCommand("paste");
			},
			description: "Inserts the contents of the Clipboard.",
		},
		{
			item: "C&lear Selection",
			shortcut: "Del",
			enabled: function(){ return !!selection; },
			action: delete_selection,
			description: "Deletes the selection.",
		},
		{
			item: "Select &All",
			shortcut: "Ctrl+A",
			action: select_all,
			description: "Selects everything.",
		},
		____________________________,
		{
			item: "C&opy To...",
			enabled: function(){ return !!selection; },
			action: save_selection_to_file,
			description: "Copies the selection to a file.",
		},
		{
			item: "Paste &From...",
			action: paste_from,
			description: "Pastes a file into the selection.",
		}
	],
	"&View": [
		{
			item: "&Tool Box",
			shortcut: "Ctrl+T",
			checkbox: {
				toggle: function(){
					$toolbox.toggle();
				},
				check: function(){
					return $toolbox.is(":visible");
				},
			},
			description: "Shows or hides the tool box.",
		},
		{
			item: "&Color Box",
			shortcut: "Ctrl+L",
			checkbox: {
				toggle: function(){
					$colorbox.toggle();
				},
				check: function(){
					return $colorbox.is(":visible");
				},
			},
			description: "Shows or hides the color box.",
		},
		{
			item: "&Status Bar",
			checkbox: {
				toggle: function(){
					$status_area.toggle();
				},
				check: function(){
					return $status_area.is(":visible");
				},
			},
			description: "Shows or hides the status bar.",
		},
		{
			item: "T&ext Toolbar",
			enabled: false, // @TODO
			checkbox: {},
			description: "Shows or hides the text toolbar.",
		},
		____________________________,
		{
			item: "&Zoom",
			submenu: [
				{
					item: "&Normal Size",
					shorcut: "Ctrl+PgUp",
					description: "Zooms the picture to 100%.",
					enabled: function(){
						return magnification !== 1;
					},
					action: function(){
						set_magnification(1);
					},
				},
				{
					item: "&Large Size",
					shorcut: "Ctrl+PgDn",
					description: "Zooms the picture to 400%.",
					enabled: function(){
						return magnification !== 4;
					},
					action: function(){
						set_magnification(4);
					},
				},
				{
					item: "C&ustom...",
					enabled: false, // @TODO
					description: "Zooms the picture.",
				},
				____________________________,
				{
					item: "Show &Grid",
					shorcut: "Ctrl+G",
					enabled: false, // @TODO
					checkbox: {},
					description: "Shows or hides the grid.",
				},
				{
					item: "Show T&humbnail",
					enabled: false, // @TODO
					checkbox: {},
					description: "Shows or hides the thumbnail view of the picture.",
				}
			]
		},
		{
			item: "&View Bitmap",
			shortcut: "Ctrl+F",
			action: view_bitmap,
			description: "Displays the entire picture.",
		}
	],
	"&Image": [
		{
			item: "&Flip/Rotate",
			shortcut: "Ctrl+R",
			action: image_flip_and_rotate,
			description: "Flips or rotates the picture or a selection.",
		},
		{
			item: "&Stretch/Skew",
			shortcut: "Ctrl+W",
			action: image_stretch_and_skew,
			description: "Stretches or skews the picture or a selection.",
		},
		{
			item: "&Invert Colors",
			shortcut: "Ctrl+I",
			action: image_invert,
			description: "Inverts the colors of the picture or a selection.",
		},
		{
			item: "&Attributes...",
			shortcut: "Ctrl+E",
			action: image_attributes,
			description: "Changes the attributes of the picture.",
		},
		{
			item: "&Clear Image",
			shortcut: "Ctrl+Shift+N",
			//shortcut: "Ctrl+Shft+N", [sic]
			action: clear,
			description: "Clears the picture or selection.",
		},
		{
			item: "&Draw Opaque",
			checkbox: {
				toggle: function(){
					tool-options_transparent_opaque_modificationFunc_8();
					
					$G.trigger("option-changed");
				},
				check: function(){
					return transparent_opaque === "opaque";
				},
			},
			description: "Makes the current selection either opaque or transparent.",
		}
	],
	"&Colors": [
		{
			item: "&Edit Colors...",
			action: function(){
				$colorbox.edit_last_color();
			},
			description: "Creates a new color.",
		},
		{
			item: "&Get Colors",
			action: function(){
				get_FileList(function(files){
					var file = files[0];
					Palette.load(file, function(err, new_palette){
						if(err){
							alert("This file is not in a format the paint recognizes, or no colors were found.");
						}else{
							app_palette_modificationFunc_0();
							$colorbox.rebuild_palette();
						}
					});
				});
			},
			description: "Uses a previously saved palette of colors.",
		},
		{
			item: "&Save Colors",
			action: function(){
				var blob = new Blob([JSON.stringify(palette)], {type: "application/json"});
				saveAs(blob, "colors.json");
			},
			description: "Saves the current palette of colors to a file.",
		}
	],
	"&Help": [
		{
			item: "&Help Topics",
			action: show_help,
			description: "Displays Help for the current task or command.",
		},
		____________________________,
		{
			item: "&About Paint",
			action: function(){
				var $msgbox = new $Window();
				$msgbox.title("About Paint");
				$msgbox.$content.html(
					"<h1><img src='images/icons/32.png'/> JS Paint<hr/></h1>" +
					"<p>JS Paint is a web-based remake of MS Paint by <a href='http://1j01.github.io/'>Isaiah Odhner</a>.</p>" +
					"<p>You can check out the project <a href='https://github.com/1j01/jspaint'>on github</a>.</p>"
				).css({padding: "15px"});
				$msgbox.center();
			},
			description: "Displays information about this application.",
			//description: "Displays program information, version number, and copyright.",
		}
	],
	// "E&xtras": [
	// 	{
	// 		item: "&Render History as GIF",
	// 		action: render_history_as_gif,
	// 		description: "Create an animation from the document history.",
	// 	},
	// 	{
	// 		item: "&Additional Tools",
	// 		action: function(){
	// 			// ;)
	// 		},
	// 		description: "Enable extra editing tools.",
	// 	},
	// 	{
	// 		item: "&Preferences",
	// 		action: function(){
	// 			// :)
	// 		},
	// 		description: "Configure JS Paint.",
	// 	}
	// ],
};
