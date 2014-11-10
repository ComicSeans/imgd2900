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

var G; // best to keep it very short

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

		SKY_COLOR_RED     : { r : 21, g : 0,  b : 4  },
		SKY_COLOR_BLUE    : { r : 0,  g : 10, b : 21 },
		SKY_COLOR_GREEN   : { r : 1,  g : 21, b : 0  },
		SKY_COLOR_YELLOW  : { r : 21, g : 11, b : 0  },
		SKY_COLOR_PURPLE  : { r : 21, g : 0,  b : 13 },
		SKY_COLOR_ORANGE  : { r : 21, g : 16, b : 0  },
		SKY_COLOR_WHITE   : { r : 26, g : 26, b : 26 },
		SKY_COLOR_SILVER  : { r : 21, g : 21, b : 21 },
		SKY_COLOR_DEFAULT : { r : 0,  g : 6,  b : 12 },

		SKY_PLANE_RED     : 1,
		SKY_PLANE_BLUE    : 2,
		SKY_PLANE_GREEN   : 3,
		SKY_PLANE_YELLOW  : 4,
		SKY_PLANE_PURPLE  : 5,
		SKY_PLANE_ORANGE  : 6,
		SKY_PLANE_WHITE   : 7,
		SKY_PLANE_SILVER  : 8,
		SKY_PLANE_DEFAULT : 9,

		CANNON_COLOR_RED     : { r : 237, g : 27,  b : 36  },
		CANNON_COLOR_BLUE    : { r : 41,  g : 170, b : 227 },
		CANNON_COLOR_GREEN   : { r : 58,  g : 181, b : 75  },
		CANNON_COLOR_YELLOW  : { r : 255, g : 221, b : 25  },
		CANNON_COLOR_PURPLE  : { r : 101, g : 45,  b : 144 },
		CANNON_COLOR_ORANGE  : { r : 24,  g : 146, b : 30  },
		CANNON_COLOR_WHITE   : { r : 224, g : 242, b : 254 },
		CANNON_COLOR_SILVER  : { r : 210, g : 211, b : 213 },

		CANNON_COLOR_HIGHLIGHT : { r : 198, g : 161, b : 161 },

		setSky : function ( ex_color ) {
			PS.color(PS.ALL, PS.ALL, ex_color);
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
	PS.gridColor(PS.COLOR_BLACK);

	// hides grid lines
	PS.border(PS.ALL, PS.ALL, 0);

	//Set title
	PS.statusColor(PS.COLOR_WHITE);
	PS.statusText("Chromaworks");

	// Dark night sky
	PS.gridPlane(0); // bottommost plane
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_DEFAULT); // sets every bead to dark night sky color at start

	//Background plane colors

	// Red Sky
	PS.gridPlane(G.SKY_PLANE_RED);
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_RED);

	// Blue Sky
	PS.gridPlane(G.SKY_PLANE_BLUE);
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_BLUE);

	// Green Sky
	PS.gridPlane(G.SKY_PLANE_GREEN);
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_GREEN);

	// Yellow Sky
	PS.gridPlane(G.SKY_PLANE_YELLOW);
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_YELLOW);

	// Purple Sky
	PS.gridPlane(G.SKY_PLANE_PURPLE);
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_PURPLE);

	// Orange Sky
	PS.gridPlane(G.SKY_PLANE_ORANGE);
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_ORANGE);

	// White Sky
	PS.gridPlane(G.SKY_PLANE_WHITE);
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_WHITE);

	// Silver Sky
	PS.gridPlane(G.SKY_PLANE_SILVER);
	PS.color(PS.ALL, PS.ALL, G.SKY_COLOR_SILVER);

	PS.gridPlane( 10 ) ;
	//I tried the method with the array in the tutorials, but it always broke on tests
	//Here is just the green cannon

	PS.alpha( 2, 31, PS.ALPHA_OPAQUE );
	PS.alpha( 2, 30, PS.ALPHA_OPAQUE );
	PS.alpha( 2, 29, PS.ALPHA_OPAQUE );
	PS.alpha( 3, 31, PS.ALPHA_OPAQUE );
	PS.alpha( 3, 30, PS.ALPHA_OPAQUE );
	PS.alpha( 3, 29, PS.ALPHA_OPAQUE );

	PS.color( 2, 31, 58, 181, 75 ) ;
	PS.color( 2, 30, 58, 181, 75 ) ;
	PS.color( 2, 29, 58, 181, 75 ) ;
	PS.color( 3, 31, 58, 181, 75 ) ;
	PS.color( 3, 30, 58, 181, 75 ) ;
	PS.color( 3, 29, 58, 181, 75 ) ;

	//Pre-load Audio
	PS.audioLoad( "fx_blip",   { lock: true } );
	PS.audioLoad( "fx_bloop",  { lock: true } );
	PS.audioLoad( "fx_blast1", { lock: true } );
	PS.audioLoad( "fx_blast2", { lock: true } );
	PS.audioLoad( "fx_blast3", { lock: true } );
	PS.audioLoad( "fx_blast4", { lock: true } );

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
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead


	// All firework explosions should lie be on Plane( 9 )
	// to be above the background color changes
	// but below the cannon colors on Plane 10

	// PS.gridPlane( 9 );


	// Firework color code
/*
	// Red Explosions
	r = PS.random(134) + 121; // random red 122-255
	g = PS.random(9) + 17; // random green 18-26
	b = PS.random(33) +41; // random blue 42-74

	// Blue Explosions
	r = PS.random(88) + 54; // random red 55-142
	g = PS.random(152) + 103; // random green 104-255
	b = PS.random(78) + 177; // random blue 178-255

	// Green Explosions
	r = PS.random(129) - 1; // random red 0-128
	g = PS.random(111) + 144; // random green 145-255
	b = PS.random(51) + 81; // random blue 82-132

	// Yellow Explosions
	r = PS.random(24) + 231; // random red 232-255
	g = PS.random(48) + 207; // random green 208-255
	b = PS.random(102) - 1; // random blue 0-101

	// Purple Explosions
	r = PS.random(79) + 85; // random red 86-164
	g = PS.random(93) - 1; // random green 0-94
	b = PS.random(101) + 91; // random blue 92-192

	// Orange Explosions
	r = PS.random(26) + 229; // random red 230-255
	g = PS.random(62) + 113; // random green 114-175
	b = PS.random(91) - 1; // random blue 0-90

	// White Explosions
	r = PS.random(41) + 214; // random red 215-255
	g = PS.random(25) + 230; // random green 231-255
	b = PS.random(41) + 214; // random blue 215-255

	// Silver Explosions
	r = PS.random(36) + 189; // random red 190-225
	g = PS.random(32) + 195; // random green 196-227
	b = PS.random(83) + 172; // random blue 173-255








	//Audio

	PS.AudioPlay( "fx_blip" ); // hovering between cannon colors
	PS.AudioPlay( "fx_bloop" ); // selecting cannon color

	PS.AudioPlay( "fx_blast1" ); //explosion variation 1
	PS.AudioPlay( "fx_blast2" ); //explosion variation 2
	PS.AudioPlay( "fx_blast3" ); //explosion variation 3
	PS.AudioPlay( "fx_blast4" ); //explosion variation 4



*/





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

