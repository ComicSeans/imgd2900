// game.js for Perlenspiel 3.1
//released to the public domain

/**
 *
 *
 *		Bright
 *
 * 		Move towards the light
 *
 *
 * 		By Team Zalen
 * 		Sean Halloran
 * 		Stone Cleven
 *
 *
 **/

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

//Global namespace
var myMath;

// This self-invoking function initializes
// the public namespace variable G,
// and also encapsulates private variables
// and functions
( function () {
	"use strict";

	// This is where G is declared as an object,
	// and its properties initialized

	myMath = {

		/**
		 * Clamps a num between a min and max
		 *
		 * @param num
		 * 	num to clamp
		 * @param min
		 * 	min, inclusive, the num can be
		 * @param max
		 * 	max, inclusive, the num can be
		 * @returns {number}
		 * 	the clamped num
		 */
		clamp : function(num, min, max) {
			return (num < min) ? min : (num > max ? max : num);
		},

		/**
		 * Clamps a number between 0 and 255 inclusive
		 *
		 * @param num
		 * 		number to clamp
		 * @returns {number}
		 */
		clamp255 : function(num){
			return myMath.clamp(num, 0, 255);
		},

		weightedAverage : function(num1, num2, weight1, weight2){
			var val = (num1 * weight1 + num2 * weight2) / (weight1 + weight2);
			return val;
		}

	};
}());

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

		width : 8,
		height : 8,

		/**
		 * calculates tbe number of beads on the grid
		 *
		 * @returns {number}
		 * 		number of beads on the grid
		 */
		numBeads : function(){
			return G.width * G.height;
		},

		//color of solved tile
		COLOR_GOOD : {r : 255, g : 255, b : 255},	//white
		//color of unsolved tile
		COLOR_BAD :  {r : 0,   g : 0,   b : 0},		//black

		//COLOR_GOOD : {r : 255, g : 0, b : 0},
		//COLOR_BAD :  {r : 0,   g : 0,   b : 255},

		currentDifficulty : 1,
		clicksRemaining : 1,

		/**
		 * Store the clicks to create the current puzzle
		 */
		currentPuzzle : [],

		//the last piano note played
		lastNote : "piano_c6",

		soundFxPlaying : false,

		/**
		 * Counts the number of solved beads
		 *
		 * @returns {number}
		 * 		the number of white beads
		 */
		numSolved : function(){
			var solved = 0;
			for(var i = 0; i < G.width; i++)
			{
				for(var j = 0; j < G.height; j++)
				{
					if (G.beadSolved(i, j))
					{
						solved++;
					}
				}
			}
			return solved;
		},

		/**
		 * A percentage of beads solved
		 *
		 * @returns {number}
		 * 		percentage 0.00 - 1.00
		 */
		percentSolved : function(){
			return G.numSolved() / G.numBeads();
		},

		/**
		 * A percentage of beads unsolved
		 *
		 * @returns {number}
		 * 		percentage 0.00 - 1.00
		 */
		percentUnsolved : function(){
			return 1 - G.percentSolved();
		},

		/**
		 * Check if a bead at (x,y) is solved
		 *
		 * @param x
		 * 		x coordinate of bead
		 * @param y
		 * 		y coodinate of bead
		 * @returns {boolean}
		 * 		if bead is solved color
		 */
		beadSolved : function(x, y){
			return PS.data(x, y).solved;
		},

		/**
		 * Toggle a bead between solved and unsolved
		 *
		 * @param x
		 * 		x coordinate of bead to toggle
		 * @param y
		 * 		y coordinate of bead to toggle
		 */
		toggleBead : function(x, y){
			if(G.beadSolved(x, y)){
				PS.data(x, y, {solved : false, sound : true});
				PS.color(x, y, G.COLOR_BAD);
			}
			else{
				PS.data(x, y, {solved : true, sound: true});
				PS.color(x, y, G.COLOR_GOOD);
			}
		},

		/**
		 * Are all the beads solved?
		 *
		 * @returns {boolean}
		 * 		if all the beads are solved
		 */
		allSolved : function(){
			return G.numSolved() == G.numBeads();
		},

		/**
		 * Update the background color
		 */
		updateBackgroundColor : function(){
			//var colorVal = G.numSolved() * 255.0 / G.numBeads();
			var percentSolved = G.percentSolved();
			var percentUnsolved = G.percentUnsolved();
			var newColor = {r : myMath.clamp255(myMath.weightedAverage(G.COLOR_GOOD.r, G.COLOR_BAD.r, percentSolved, percentUnsolved)),
							g : myMath.clamp255(myMath.weightedAverage(G.COLOR_GOOD.g, G.COLOR_BAD.g, percentSolved, percentUnsolved)),
							b : myMath.clamp255(myMath.weightedAverage(G.COLOR_GOOD.b, G.COLOR_BAD.b, percentSolved, percentUnsolved))};
			PS.gridColor(newColor);
			var shadowColor = {r : myMath.clamp255(newColor.r + 50),
							   g : myMath.clamp255(newColor.g + 50),
							   b : myMath.clamp255(newColor.b + 50)};
			PS.gridShadow(true, shadowColor);
		},

		/**
		 * Play the next alternating sound for touching tiles
		 */
		playToggleSound : function (){
			// Play alternating click sounds
			if(G.lastNote == "piano_c6")
			{
				PS.audioPlay( "piano_c5" );
				G.lastNote = "piano_c5";
			}
			else
			{
				PS.audioPlay( "piano_c6" );
				G.lastNote = "piano_c6";
			}
		},

		/**
		 * Sets all the tiles to solved and puts board in default layout
		 */
		clearBoard : function(){
			//PS.gridSize(G.width, G.height);
			PS.gridColor(G.COLOR_GOOD);
			PS.color(PS.ALL, PS.ALL, G.COLOR_GOOD);
			PS.applyRect(0, 0, G.width, G.height, PS.data, {solved : true, sound : true});
		},

		/**
		 * Generates a puzzle to solve in a number of clicks, and returns the
		 * clicks used to generate that puzzle.
		 *
		 * @param numClicks
		 * 		number of clicks to solve the puzzle
		 * @returns {Array}
		 * 		return an array of touches which are {lx : number, ly : number}
		 */
		generatePuzzle : function (numClicks){
			//PS.debug("===NEW PUZZLES FROM "+numClicks+" NUMBER CLICKS===\n");

			G.clearBoard();

			G.updateStatusBar();

			var touches = [];
			var x = PS.random(3) + (G.width  / 2) - 2;
			var y = PS.random(3) + (G.height / 2) - 2;
			touches.push({lx : x, ly : y});
			PS.touch(x, y, {sound : false});
			var dX, dY;
			for(var i = 1; i < numClicks; i++){
				dX = PS.random(2) * ((PS.random(2) == 1) ? 1 : -1);
				dY = PS.random(2) * ((PS.random(2) == 1) ? 1 : -1);
				//PS.debug("dx : "+dX+" dy: "+dY+"\n");
				x = myMath.clamp(x + dX, 1, G.width - 2);
				y = myMath.clamp(y + dY, 1, G.height - 2);
				if(!G.touchMade(touches, {lx : x, ly : y})){
					touches.push({lx : x, ly : y});
					PS.touch(x, y, {sound : false});
					//PS.debug("Touches so far! "+touches+"\n");
				}
				else{
					i--;
					//PS.debug("Found same touch!\n");
				}
			}
			//PS.debug("Made board with touches :\n");
			//touches.forEach(function(entry){
			//	PS.debug(entry.lx + "," + entry.ly +"\n");
			//});
			return touches;
		},

		/**
		 * Clear's the board and creates a puzzle from a set of cliks
		 * @param clicks
		 * 		array of touches which are {lx : number, ly : number}
		 */
		generatePuzzleFromClicks : function(clicks){
			//PS.debug("===RESETING PUZZLE FROM "+clicks.length+" CLICKS===\n");

			G.clearBoard();

			G.updateStatusBar();

			clicks.forEach(function(entry){
				PS.touch(entry.lx, entry.ly, {sound : false});
			});

		},

		/**
		 * Checks if a touch has been made at a location in a list of touches
		 *
		 * @param touches
		 * 		array of {lx : number, ly : number}
		 * @param touch
		 * 		{lx : number, ly : number} to check for
		 * @returns {boolean}
		 * 		if touch was found in touches
		 */
		touchMade : function (touches, touch){
			var found = false;
			touches.forEach(function(entry){
				//PS.debug("comparing entry " + entry.lx + "," + entry.ly + " to touch "+touch.lx+","+touch.ly+"\n" );
				if((entry.lx == touch.lx) && (entry.ly == touch.ly)){
					found = true;
				}
			});
			return found;
		},

		/**
		 * Called when board is solved
		 */
		onSolved : function(){
			//PS.debug("SOLVED\n");
			G.currentDifficulty+= 1;
			G.clicksRemaining = G.currentDifficulty;
			G.soundFxPlaying = true;
			PS.audioPlay("fx_tada",
				//play when 'tada' finishes playing
				{onEnd : function(){
					G.soundFxPlaying = false;
					G.currentPuzzle = G.generatePuzzle(G.currentDifficulty);
			}});
		},

		/**
		 * Called when player fails to solve in number of clicks
		 */
		onFailed : function(sound){
			//PS.debug("FAILED\n");
			G.clicksRemaining = G.currentDifficulty;
			if(sound) {
				G.soundFxPlaying = true;
				PS.audioPlay("fx_wilhelm",
					//play when 'wilhelm' finishes playing
					{
						onEnd: function () {
							G.soundFxPlaying = false;
							G.generatePuzzleFromClicks(G.currentPuzzle);
						}
					});
			}
			else
			{
				G.generatePuzzleFromClicks(G.currentPuzzle);
			}
		},

		/**
		 * Make the status bar read the remaining clicks
		 */
		updateStatusBar : function(){
			PS.statusColor( PS.COLOR_RED );
			if(G.clicksRemaining > 1) {
				PS.statusText("Reveal the light in " + G.clicksRemaining + " clicks. Press r to reset.");
			}
			else if(G.clicksRemaining > 0){
				PS.statusText("Reveal the light in " + G.clicksRemaining + " click. Press r to reset.");
			}
			else{
				PS.statusText("");
			}
		}

	};
}());

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details
// This variable creates a global namespace
// for game-specific code and variables

PS.init = function( system, options ) {
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	PS.gridSize(G.width, G.height);
	PS.border(PS.ALL, PS.ALL, 0);

	PS.audioLoad( "piano_c6", { lock: true } ); // load & lock click sound
	PS.audioLoad( "piano_c5", { lock: true } ); // load & lock click sound

	G.currentPuzzle = G.generatePuzzle(G.currentDifficulty);

	// Add any other initialization code you need here
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

	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	if(G.soundFxPlaying)
	{
		return;
	}

	//toggle the clicked and adjacent beads
	for(var i = myMath.clamp(x - 1, 0, G.width); i < myMath.clamp(x + 2, 0, G.width); i++)
	{
		for(var j = myMath.clamp(y - 1, 0, G.height); j < myMath.clamp(y + 2, 0, G.height); j++)
		{
			G.toggleBead(i, j);
		}
	}

	//Adjust the background color of the screen for how lit up the grid is
	G.updateBackgroundColor();

	if(data.sound) {
		G.clicksRemaining--;

		G.updateStatusBar();

		//play ta-da if the whole screen is lit up
		if (G.allSolved()) {
			G.onSolved();
		}
		else if (G.clicksRemaining <= 0) {
			G.onFailed(true);
		}
		else{
			G.playToggleSound();
		}
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

	PS.alpha(x, y, PS.ALPHA_OPAQUE - 140);

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
	PS.alpha(x, y, PS.ALPHA_OPAQUE);
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

	if(key == 114) //if key == 'r'
	{
		G.onFailed(false);
	}

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



