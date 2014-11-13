// game.js for Perlenspiel 3.1
// This game is released to the public domain

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-14 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// This variable creates a global namespace
// for game-specific code and variables

//Global namespace
var G;

// This self-invoking function initializes
// the public namespace variable G,
// and also encapsulates private variables
// and functions

( function () {
	"use strict";

	// This is where G is declared as an object,
	// and its properties initialized

	G = {
		width : 32, // width of grid
		height : 32, // height of grid

		//Color the sky is lit up to
		SKY_COLOR_RED     : { r : 21, g : 0,  b : 4  },
		SKY_COLOR_BLUE    : { r : 0,  g : 10, b : 21 },
		SKY_COLOR_GREEN   : { r : 1,  g : 21, b : 0  },
		SKY_COLOR_YELLOW  : { r : 21, g : 11, b : 0  },
		SKY_COLOR_PURPLE  : { r : 21, g : 0,  b : 13 },
		SKY_COLOR_ORANGE  : { r : 21, g : 16, b : 0  },
		SKY_COLOR_WHITE   : { r : 26, g : 26, b : 26 },
		SKY_COLOR_SILVER  : { r : 21, g : 21, b : 21 },
		//SKY_COLOR_DEFAULT : { r : 0,  g : 6,  b : 12 },	
		SKY_COLOR_DEFAULT : { r : 0, g : 0, b : 0 },

		//Planes
		SKY_PLANE_BG      : 8,
		SKY_PLANE_GLOW    : 9,
		FIREWORKS_PLANE   : 11,
		CANNON_PLANE      : 12,
		SELECTION_PLANE   : 13,
		SKY_PLANE_FLASH   : 14,
		PLANE_TOP         : 15,

		//Cannon colors
		CANNON_COLOR_RED     : { r : 237, g : 27,  b : 36  },
		CANNON_COLOR_BLUE    : { r : 41,  g : 170, b : 227 },
		CANNON_COLOR_GREEN   : { r : 58,  g : 181, b : 75  },
		CANNON_COLOR_YELLOW  : { r : 255, g : 221, b : 25  },
		CANNON_COLOR_PURPLE  : { r : 101, g : 45,  b : 144 },
		CANNON_COLOR_ORANGE  : { r : 247, g : 146, b : 30  },
		CANNON_COLOR_WHITE   : { r : 224, g : 242, b : 254 },
		CANNON_COLOR_SILVER  : { r : 210, g : 211, b : 213 },

		CANNON_COLOR_HIGHLIGHT : { r : 198, g : 161, b : 161 },

		FIREWORKS : [],

		FIREWORKS_DELAY : 20,

		initSky : function () {
			//Make the sky black
			PS.gridPlane(G.SKY_PLANE_BG);
			PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_DEFAULT);
			PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);

			//Make a plane for the sky to glow on
			PS.gridPlane(G.SKY_PLANE_GLOW); // bottommost plane
			PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_DEFAULT); // sets every bead to dark night sky color at start
			PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);

		},

		initSprites : function () {
			G.CANNON_SPR_RED    = PS.spriteSolid(2, 3);
			G.CANNON_SPR_BLUE   = PS.spriteSolid(2, 3);
			G.CANNON_SPR_GREEN  = PS.spriteSolid(2, 3);
			G.CANNON_SPR_YELLOW = PS.spriteSolid(2, 3);
			G.CANNON_SPR_PURPLE = PS.spriteSolid(2, 3);
			G.CANNON_SPR_ORANGE = PS.spriteSolid(2, 3);
			G.CANNON_SPR_WHITE  = PS.spriteSolid(2, 3);
			G.CANNON_SPR_SILVER = PS.spriteSolid(2, 3);
			G.SELECTION_MARKER_SPR = PS.spriteSolid(2, 1);

			PS.spriteSolidColor(G.CANNON_SPR_RED,    G.CANNON_COLOR_RED);
			PS.spriteSolidColor(G.CANNON_SPR_BLUE,   G.CANNON_COLOR_BLUE);
			PS.spriteSolidColor(G.CANNON_SPR_GREEN,  G.CANNON_COLOR_GREEN);
			PS.spriteSolidColor(G.CANNON_SPR_YELLOW, G.CANNON_COLOR_YELLOW);
			PS.spriteSolidColor(G.CANNON_SPR_PURPLE, G.CANNON_COLOR_PURPLE);
			PS.spriteSolidColor(G.CANNON_SPR_ORANGE, G.CANNON_COLOR_ORANGE);
			PS.spriteSolidColor(G.CANNON_SPR_WHITE,  G.CANNON_COLOR_WHITE);
			PS.spriteSolidColor(G.CANNON_SPR_SILVER, G.CANNON_COLOR_SILVER);
			PS.spriteSolidColor(G.SELECTION_MARKER_SPR, G.CANNON_COLOR_HIGHLIGHT);

			PS.spritePlane(G.CANNON_SPR_RED,    G.CANNON_PLANE);
			PS.spritePlane(G.CANNON_SPR_BLUE,   G.CANNON_PLANE);
			PS.spritePlane(G.CANNON_SPR_GREEN,  G.CANNON_PLANE);
			PS.spritePlane(G.CANNON_SPR_YELLOW, G.CANNON_PLANE);
			PS.spritePlane(G.CANNON_SPR_PURPLE, G.CANNON_PLANE);
			PS.spritePlane(G.CANNON_SPR_ORANGE, G.CANNON_PLANE);
			PS.spritePlane(G.CANNON_SPR_WHITE,  G.CANNON_PLANE);
			PS.spritePlane(G.CANNON_SPR_SILVER, G.CANNON_PLANE);
			PS.spritePlane(G.SELECTION_MARKER_SPR, G.SELECTION_PLANE);

			PS.spriteMove(G.CANNON_SPR_RED,    1, 29);
			PS.spriteMove(G.CANNON_SPR_BLUE,   5, 29);
			PS.spriteMove(G.CANNON_SPR_GREEN,  9, 29);
			PS.spriteMove(G.CANNON_SPR_YELLOW, 13, 29);
			PS.spriteMove(G.CANNON_SPR_PURPLE, 17, 29);
			PS.spriteMove(G.CANNON_SPR_ORANGE, 21, 29);
			PS.spriteMove(G.CANNON_SPR_WHITE,  25, 29);
			PS.spriteMove(G.CANNON_SPR_SILVER, 29, 29);

			PS.spriteMove(G.SELECTION_MARKER_SPR, 1, 31);
		},

		initCannonExecFuncs : function () {
			//for every cannon
			for(var c = 0; c < 8; c++){
				//top corner of the cannon
				var c_x = 1 + 4 * c;
				var c_y = 29;
				//for every cell in the cannon
				for(var x = c_x; x < c_x + 2; x++){
					for(var y = c_y; y < c_y + 3; y++){
						//set the exec function of the board
						PS.exec(x, y, function(x, y, data){
							if(x % 2 == 0){
								x--;
							}
							PS.spriteMove(G.SELECTION_MARKER_SPR, x, 31);
							PS.audioPlay("fx_blip");
						});
					}
				}
			}
		},

		UPDATE_FLAGS : {
			FADE_SKY_GLOW : false,
			FADE_SKY_FLASH : false
		},

		gridShadowColor : { r : 0, g : 0, b : 0 },

		/**
		 * Set the grid shadow and save it to a var in the game namespace.
		 * @param newColor
		 * 		Color to set the grid shadow, must be in { r : number, g : number, b : number } format
		 */
		setGridShadowColor : function(newColor){
			G.gridShadowColor = newColor;
			PS.gridShadow(true, G.gridShadowColor);
		},

		/**
		 * Update function called every tick
		 */
		update : function () {
			//Update the glow of the sky
			if(G.UPDATE_FLAGS.FADE_SKY_GLOW){
				PS.gridPlane(G.SKY_PLANE_GLOW);
				var currentSkyAlpha = PS.alpha(1, 1);
				if(currentSkyAlpha > 0) {
					//PS.debug("Sky color set to color " + PS.color(1, 1) + " alpha to " + (currentSkyAlpha - 1) + "\n");
					PS.alpha(PS.ALL, PS.ALL, currentSkyAlpha - 1);
				}
				else{
					G.UPDATE_FLAGS.FADE_SKY_GLOW = false;
					//PS.debug("Finished fading sky\n");
				}
			}
			//Update the flash of the fireworks
			if(G.UPDATE_FLAGS.FADE_SKY_FLASH)
			{
				PS.gridPlane(G.SKY_PLANE_FLASH);
				var currentFlashAlpha = PS.alpha(1, 1);
				if(currentFlashAlpha > 0) {
					//set the alpha of the flash grid layer
					//PS.debug("Sky color set to color " + PS.color(1, 1) + " alpha to " + (currentFlashAlpha - 30) + "\n");
					PS.alpha(PS.ALL, PS.ALL, currentFlashAlpha - 30);
					//set the color of the grid shadow between white and black
					G.setGridShadowColor({ r : G.gridShadowColor.r - 30,
										   g : G.gridShadowColor.g - 30,
										   b : G.gridShadowColor.b - 30});
					//PS.debug("grid shadow color is "+ G.gridShadowColor.r + " " + G.gridShadowColor.g + " " + G.gridShadowColor.b + "\n");
				}
				else{
					PS.gridShadow(true, PS.COLOR_BLACK);
					G.UPDATE_FLAGS.FADE_SKY_FLASH = false;
					//PS.debug("Finished flashing the sky\n");
				}
			}
			////////////////updateFireworks///////////////
			//clear old fireworks
			PS.gridPlane(G.FIREWORKS_PLANE);
			PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_TRANSPARENT);

			//PS.debug("num fireworks " + G.FIREWORKS.length);
			//if(G.FIREWORKS.length == 1){
			//	PS.debug(" w/ delay: " + G.FIREWORKS.delay + "\n");
			//}
			//work on every firework
			G.FIREWORKS.forEach(function(entry){
				//draw frame one
				//PS.debug("FW = "+entry.x+", "+entry.y+" delay of "+entry.delay+" frame : "+entry.frameNum+"\n");
				if(entry.frameNum == 0){
					PS.color(entry.x, entry.y, entry.color);
					PS.alpha(entry.x, entry.y, PS.ALPHA_OPAQUE);
				}
				else if(entry.frameNum == 1){
					var d = 2;
					for(var i = 0; i < 2; i++){
						PS.color(entry.x + d, entry.y + d, entry.color);
						PS.color(entry.x + d, entry.y - d, entry.color);
						PS.color(entry.x - d, entry.y + d, entry.color);
						PS.color(entry.x - d, entry.y - d, entry.color);
						PS.alpha(entry.x + d, entry.y + d, PS.ALPHA_OPAQUE);
						PS.alpha(entry.x + d, entry.y - d, PS.ALPHA_OPAQUE);
						PS.alpha(entry.x - d, entry.y + d, PS.ALPHA_OPAQUE);
						PS.alpha(entry.x - d, entry.y - d, PS.ALPHA_OPAQUE);
						d--;
					}
					PS.color(entry.x, entry.y, entry.color);
					PS.alpha(entry.x, entry.y, PS.ALPHA_OPAQUE);
				}
				entry.delay--;
				if(entry.frameNum < 2) {
					PS.debug("frame : " + entry.frameNum + ", delay : " + entry.delay + "\n");
				}
				if(entry.delay < 1){
					entry.frameNum += 1;
					entry.delay = G.FIREWORKS_DELAY;
				}
			});
		},

		constructFirework : function (newX, newY, newColor) {
			return {x : newX, y : newY, color : newColor, frameNum : 0, delay : G.FIREWORKS_DELAY};
		},

		fadeSky : function () {
			G.UPDATE_FLAGS.FADE_SKY_GLOW = true;
		},

		flashSky : function () {
			PS.gridPlane(G.SKY_PLANE_FLASH);
			PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);
			PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
			G.setGridShadowColor({r : 255, g : 255, b : 255});
			G.UPDATE_FLAGS.FADE_SKY_FLASH = true;
		},

		/**
		 * Sets the color of the sky according to the color of the firework going off.
		 *
		 * @param sky
		 * 		"red", "blue", any sky color
		 */
		setSky : function ( sky ) {
			//recall the current grid plane to reset it later
			var oldGridPlane = PS.gridPlane();

			//set the sky to the color of the given explosion
			PS.gridPlane(G.SKY_PLANE_GLOW);
			if(sky == "red"){
				PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_RED);
			} else if(sky == "blue"){
				PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_BLUE);
			} else if(sky == "green"){
				PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_GREEN);
			} else if(sky == "yellow"){
				PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_YELLOW);
			} else if(sky == "purple"){
				PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_PURPLE);
			} else if(sky == "orange"){
				PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_ORANGE);
			} else if(sky == "white"){
				PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_WHITE);
			} else if(sky == "silver"){
				PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_SILVER);
			}
			PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);

			//reset the grid plane to what it was before this funciton call
			PS.gridPlane(oldGridPlane);
		},

		/**
		 * Returns a lowercase string of the cannon color selected.
		 *
		 * @returns {string}
		 */
		getSelectedColor : function (){
			var color = "";
			var sel_x = PS.spriteMove(G.SELECTION_MARKER_SPR).x;
			if(sel_x >= PS.spriteMove(G.CANNON_SPR_SILVER).x){
				color = "silver";
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_WHITE).x){
				color = "white";
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_ORANGE).x){
				color = "orange";
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_PURPLE).x){
				color = "purple";
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_YELLOW).x){
				color = "yellow";
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_GREEN).x){
				color = "green";
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_BLUE).x){
				color = "blue";
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_RED).x){
				color = "red";
			}
			return color;
		},

		/**
		 * Generates and returns a color in the range of the color
		 * of the selected cannon.
		 *
		 * @returns {{r: number, g: number, b: number}}
		 */
		getFireworksColor : function () {
			var color = {r : 0, g : 0, b : 0};
			var sel_x = PS.spriteMove(G.SELECTION_MARKER_SPR).x;
			//PS.debug("sel_x : "+ sel_x + "\n");
			if(sel_x >= PS.spriteMove(G.CANNON_SPR_SILVER).x){
				//PS.debug("SILVER");
				// Silver Explosions
				color.r = PS.random(36) + 189; // random red 190-225
				color.g = PS.random(32) + 195; // random green 196-227
				color.b = PS.random(83) + 172; // random blue 173-255
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_WHITE).x){
				//PS.debug("WHITE");
				// White Explosions
				color.r = PS.random(41) + 214; // random red 215-255
				color.g = PS.random(25) + 230; // random green 231-255
				color.b = PS.random(41) + 214; // random blue 215-255
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_ORANGE).x){
				//PS.debug("ORANGE");
				// Orange Explosions
				color.r = PS.random(26) + 229; // random red 230-255
				color.g = PS.random(62) + 113; // random green 114-175
				color.b = PS.random(91) - 1; // random blue 0-90
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_PURPLE).x){
				//PS.debug("PURPLE");
				// Purple Explosions
				color.r = PS.random(79) + 85; // random red 86-164
				color.g = PS.random(93) - 1; // random green 0-94
				color.b = PS.random(101) + 91; // random blue 92-192
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_YELLOW).x){
				//PS.debug("YELLOW");
				// Yellow Explosions
				color.r = PS.random(24) + 231; // random red 232-255
				color.g = PS.random(48) + 207; // random green 208-255
				color.b = PS.random(102) - 1; // random blue 0-101
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_GREEN).x){
				//PS.debug("GREEN");
				// Green Explosions
				color.r = PS.random(129) - 1; // random red 0-128
				color.g = PS.random(111) + 144; // random green 145-255
				color.b = PS.random(51) + 81; // random blue 82-132
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_BLUE).x){
				//PS.debug("BLUE");
				// Blue Explosions
				color.r = PS.random(88) + 54; // random red 55-142
				color.g = PS.random(152) + 103; // random green 104-255
				color.b = PS.random(78) + 177; // random blue 178-255
			}else if(sel_x >= PS.spriteMove(G.CANNON_SPR_RED).x){
				//PS.debug("RED");
				// Red Explosions
				color.r = PS.random(134) + 121; // random red 122-255
				color.g = PS.random(9) + 17; // random green 18-26
				color.b = PS.random(33) +41; // random blue 42-74
			}
			//PS.debug("\n");
			return color;
		}

	};
}() );

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.init = function( system, options ) {
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	//Set grid size
	PS.gridSize(G.width, G.height);

	// sets color of space outside grid
	PS.gridColor(G.SKY_COLOR_DEFAULT);

	// hides grid lines
	PS.border(PS.ALL, PS.ALL, 0);

	//Set title
	PS.statusColor(PS.COLOR_WHITE);
	PS.statusText("Chromaworks");

	G.initSky();

	PS.gridPlane(G.FIREWORKS_PLANE);

	G.initSprites();

	G.initCannonExecFuncs();

	//Pre-load Audio
	PS.audioLoad( "fx_blip",   { lock: true } );
	PS.audioLoad( "fx_bloop",  { lock: true } );

	PS.audioLoad( "fx_blast2", { lock: true } );
	PS.audioLoad( "fx_blast3", { lock: true } );



	PS.timerStart(1, G.update);
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	//if clicking on the sky
	if(y < 29) {
		//draw firework
		var color = G.getFireworksColor();
		G.FIREWORKS[0] = G.constructFirework(x, y, color);
		//var testFW = G.constructFirework(x, y, color);
		//PS.debug("FW = "+G.FIREWORKS[0].x+", "+G.FIREWORKS[0].y+" delay of "+G.FIREWORKS[0].delay+"\n");
		//PS.gridPlane(G.FIREWORKS_PLANE);
		//PS.alpha(x, y, PS.ALPHA_OPAQUE);
		//PS.color(x, y, color);

		//set the glow of the sky, and flash the sky
		G.setSky(G.getSelectedColor());
		G.flashSky();
		G.fadeSky();

		PS.audioPlay( "fx_blast2" , { volume: 0.10 } ); //explosion variation 2

	}

	//Audio

	//PS.audioPlay( "fx_blip" ); // hovering between cannon colors
	//PS.audioPlay( "fx_bloop" ); // selecting cannon color


	//PS.audioPlay( "fx_blast2" , { volume: 0.10 } ); //explosion variation 2
	//PS.audioPlay( "fx_blast3" , { volume: 0.10 } ); //explosion variation 3


	//PS.audioPlay( "FW1", { path : "" , fileTypes : [ "mp3", "wav" ] } ) ; //explosion variation 1
	//PS.audioPlay( "FW2" ); //explosion variation 2
	//PS.audioPlay( "FW3" ); //explosion variation 3
	//PS.audioPlay( "FW4" ); //explosion variation 4



};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};

