// game.js for Perlenspiel 3.1
//released to the public domain

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

/**
 *	A modded toy by Sean Halloran
 * 	Team Zahlen
 *
 * 	Mod 1)
 * 		When the player clicks, the toy alternates between two piano sounds instead of a click sound
 * 	Mod 2)
 * 		When the player clicks, it toggles the color of the clicked bead and all the adjacent bead
 *  Mod 3)
 *		The background lights up from black to white as the player lights up the board.
 *  Mod 4)
 *  	The edge of the grid glows more as the gird lights up black to white.
 *  Mod 5)
 *  	The toy plays 'ta-da!' if the entire grid is lit up white.
 */

//Test comment!

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

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

	PS.gridSize( 8, 8 );
	PS.gridColor( PS.COLOR_BLACK );
	PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.border(PS.ALL, PS.ALL, 0);

	PS.statusColor( PS.COLOR_RED );
	PS.statusText( "Touch the screen" );

	PS.audioLoad( "piano_c6", { lock: true } ); // load & lock click sound
	PS.audioLoad( "piano_c5", { lock: true } ); // load & lock click sound

	// Add any other initialization code you need here
};

/**
 * Counts the number of white beads
 *
 * @returns {number}
 * 	the number of white beads
 */
var numWhite = function(){
	var black = 0;
	for(var i = 0; i < 8; i++)
	{
		for(var j = 0; j < 8; j++)
		{
			if ( PS.color(i, j) === PS.COLOR_WHITE )
			{
				black++;
			}
		}
	}
	return black;
}

/**
 * Clamps a num between a min and max
 *
 * @param num
 * 	num to clamp
 * @param min
 * 	min, inclusive, the num can be
 * @param max
 * 	max, inclusive, the num can be
 * @returns {*}
 * 	the clamped num
 */
var clamp = function(num, min, max) {
	return num < min ? min : (num > max ? max : num);
};

//the last piano note played
var lastNote = "piano_c6";

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

	//toggle the clicked and adjacent beads
	for(var i = clamp(x - 1, 0, 8); i < clamp(x + 2, 0, 8); i++)
	{
		for(var j = clamp(y - 1, 0, 8); j < clamp(y + 2, 0, 8); j++)
		{
			if ( PS.color(i, j) === PS.COLOR_BLACK ) {
				PS.color(i, j, PS.COLOR_WHITE);
			} else {
				PS.color(i, j, PS.COLOR_BLACK);
			}
		}
	}

	// Play alternating click sounds
	if(lastNote == "piano_c6")
	{
		PS.audioPlay( "piano_c5" );
		lastNote = "piano_c5";
	}
	else
	{
		PS.audioPlay( "piano_c6" );
		lastNote = "piano_c6";
	}

	//Adjust the background color of the screen for how lit up the grid is
	var colorVal = numWhite() * 3.984375;
	PS.gridColor(colorVal, colorVal, colorVal);
	var shadowVal = clamp(colorVal + 50, 0, 255);
	PS.gridShadow(true, shadowVal, shadowVal, shadowVal);

	//play ta-da if the whole screen is lit up
	if(numWhite() == 8*8)
	{
		PS.audioPlay("fx_tada");
	}

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



