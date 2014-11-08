// game.js for Perlenspiel 3.1

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

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!

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

	PS.gridSize(32, 32);

	// Add any other initialization code you need here

	//PS.bgColor( PS.ALL , PS.ALL , PS.COLOR_BLUE );

	PS.gridColor(PS.COLOR_BLACK); // sets color of space outside grid

	PS.border(PS.ALL, PS.ALL, 0); // hides grid lines

	PS.statusColor(PS.COLOR_WHITE);
	PS.statusText("Chromaworks");

	// Dark night sky
	PS.gridPlane(0); // bottommost plane
	PS.color(PS.ALL, PS.ALL, 0, 6, 12); // sets every bead to dark night sky color at start

	//Background plane colors

	// Red Sky
	PS.gridPlane(1);
	PS.color(PS.ALL, PS.ALL, 21, 0, 4);

	// Blue Sky
	PS.gridPlane(2);
	PS.color(PS.ALL, PS.ALL, 0, 10, 21);

	// Green Sky
	PS.gridPlane(3);
	PS.color(PS.ALL, PS.ALL, 1, 21, 0);

	// Yellow Sky
	PS.gridPlane(4);
	PS.color(PS.ALL, PS.ALL, 21, 11, 0);

	// Purple Sky
	PS.gridPlane(5);
	PS.color(PS.ALL, PS.ALL, 21, 0, 13);

	// Orange Sky
	PS.gridPlane(6);
	PS.color(PS.ALL, PS.ALL, 21, 16, 0);

	// White Sky
	PS.gridPlane(7);
	PS.color(PS.ALL, PS.ALL, 26, 26, 26);

	// Silver Sky
	PS.gridPlane(8);
	PS.color(PS.ALL, PS.ALL, 21, 21, 21);


	// Cannon Colors
	/*
	Red = 237, 27 ,36
	Blue = 41, 170, 227
	Green = 58, 181, 75
	Yellow = 255, 221, 25
	Purple = 101, 45, 144
	Orange = 24, 146, 30
	White = 224, 242, 254
	Silver = 210, 211, 213

	Highlight = 198, 161, 161
	*/

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


	PS.audioLoad( "fx_blip", { lock: true } );
	PS.audioLoad( "fx_bloop", { lock: true } );
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

