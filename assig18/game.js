// game.js for Perlenspiel 3.1
//released to the public domain

/**
 *
 *
 *		DaggerTouch
 *
 * 		Aim and swipe!
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

		width : 24,
		height : 32,

		touchDown : false,

		lastTouchLoc : {x : 0, y : 0},
		lastExit : {x : 0, y : 0},

		lastTouchTime : 0,

		lastSwipeLength : 0,

		COLOR_GRASS : { r : 33, g : 131, b : 90 },

		dagger : {spr : null},

		updateTimer : null,

		PLANE_DAGGER : 3,
		PLANE_EFFECTS : 2,


		/**
		 * calculates tbe number of beads on the grid
		 *
		 * @returns {number}
		 * 		number of beads on the grid
		 */
		numBeads : function(){
			return G.width * G.height;
		},

		outOfBounds : function(x, y){
			if(x < 0 || y < 0) {
				return true;
			}
			if(x >= G.width || y >= G.height){
				return true;
			}
			return false;
		},

		//initSprites : function(){
		//	G.SPR_DAGGER = PS.spriteSolid(1, 1);
		//	PS.spriteSolidColor(G.SPR_DAGGER, PS.COLOR_GRAY_DARK);
		//	PS.spriteMove(G.SPR_DAGGER, G.width / 2, G.height * 0.75);
		//},

		makeDagger : function(){
			PS.debug("Making DAGGER!!!!!\n");

			G.dagger.spr = PS.spriteSolid(1, 1);
			PS.spritePlane(G.dagger.spr, G.PLANE_DAGGER);
			PS.spriteSolidColor(G.dagger.spr, PS.COLOR_GRAY_DARK);
			PS.spriteMove(G.dagger.spr, G.width / 2, G.height * 0.75);
			G.dagger.moving = false;
			G.dagger.path = [];
			G.dagger.pathStep = 0;
			G.dagger.pathDest = {x : 0, y : 0};
			G.dagger.speed = 2;

			G.dagger.getPosition = function(){
				return PS.spriteMove(G.dagger.spr);
			};

			G.dagger.move = function (x, y){
				//PS.debug("Moving dagger to " + x + ", " + y + "\n");
				if(G.outOfBounds(x, y)){
					PS.spriteDelete(G.dagger.spr);
					G.makeDagger();
				}
				else{
					PS.spriteMove(G.dagger.spr, x, y);
				}
			};

			G.dagger.pathComplete = function(){
				if(G.dagger.pathStep >= G.dagger.path.length){
					return true;
				}
				return false;
			};

			G.dagger.setPath = function (path){
				G.dagger.path = path;
				G.dagger.pathDest = path[path.length - 2];
			};

			G.dagger.stepOnPath = function(){
				G.dagger.pathStep += G.dagger.speed;
				//PS.debug("On path step " + G.dagger.pathStep + " out of "+(G.dagger.path.length - 1)+"\n");
				//G.dagger.pathStep = myMath.clamp(G.dagger.pathStep, 0, G.dagger.path.length - 1);
				//if(G.dagger.moving) {
				if(!G.dagger.pathComplete()) {
					G.dagger.move(G.dagger.path[G.dagger.pathStep][0], G.dagger.path[G.dagger.pathStep][1]);
				}
				//}
				var pos = G.dagger.getPosition();
				if(G.dagger.pathComplete()){
					//G.dagger.moving = false;
					//PS.spriteDelete(G.dagger.spr);
					//G.makeDagger();
					var newPath = G.dagger.path;
					if(newPath.length == 0)
					{
						return;
					}
					var daggerPos = G.dagger.getPosition();
					newPath = G.translatePathStartToPosition(newPath, daggerPos.x, daggerPos.y);
					G.dagger.setPath(newPath);
					G.dagger.pathStep = 0;
				}
			};
		},

		makeTargets : function(){
			var target = PS.spriteSolid(3, 3);
			PS.spritePlane(target, 5);
			PS.spriteSolidColor(target, PS.COLOR_RED);
			PS.spriteMove(target, G.width / 2, G.height * 0.25);
			PS.spriteCollide(target, function collide( s1, p1, s2, p2, type ) {
				PS.statusText("Nice hit!");
				G.makeDagger();
			});
		},

		translatePathStartToPosition : function(path, x, y){
			if(path.length == 0){
				return;
			}
			var dx = x - path[0][0];
			var dy = y - path[0][1];
			for(var i = 0; i < path.length; i++){
				path[i][0] += dx;
				path[i][1] += dy;
			}
			return path;
		},

		update : function(){
			G.updateDagger();
		},

		updateDagger : function(){
			if(G.dagger.moving) {
				G.dagger.stepOnPath();
				//noinspection JSUnresolvedFunction
				PS.gridRefresh();
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
	PS.color(PS.ALL, PS.ALL, G.COLOR_GRASS);
	PS.border(PS.ALL, PS.ALL, 1);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_WHITE);

	G.makeDagger();
	G.makeTargets();

	G.updateTimer = PS.timerStart(3, G.update);
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
	G.touchDown = true;
	G.lastTouchLoc.x = x;
	G.lastTouchLoc.y = y;

	var d = new Date();
	G.lastTouchTime = d.getTime();

	PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

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
	if(!G.touchDown){
		G.touchDown = false;
		return;
	}

	G.touchDown = false;

	if(G.lastTouchLoc.x == x && G.lastTouchLoc.y == y){
		return;
	}

	if(G.dagger.moving){
		return;
	}

	var d = new Date();
	var time = d.getTime();

	PS.debug("Swipe Time : " + (time - G.lastTouchTime) + "\n");
	PS.debug("Swipe speed : " + (time - G.lastTouchTime) / G.lastSwipeLength + "\n");

	var path = PS.line(G.lastTouchLoc.x, G.lastTouchLoc.y, x, y);
	var daggerPos = G.dagger.getPosition();
	path = G.translatePathStartToPosition(path, daggerPos.x, daggerPos.y);


	G.dagger.setPath(path);
	G.dagger.moving = true;

	PS.timerStop(G.updateTimer);
	G.updateTimer = PS.timerStart(2, G.update);

	PS.gridPlane(G.PLANE_EFFECTS);
	PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_TRANSPARENT);

	// Uncomment the following line to inspect parameters
	//PS.debug( "PS.release() @ " + x + ", " + y + "\n" );




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
	//ignore this function unless a finger is on the screen
	if(!G.touchDown)
	{
		return;
	}

	if(!G.dagger.moving) {

		PS.gridPlane(G.PLANE_EFFECTS);
		PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_TRANSPARENT);

		var effectPath = PS.line(G.lastTouchLoc.x, G.lastTouchLoc.y, x, y);

		G.lastSwipeLength = effectPath.length;

		var daggerPos = G.dagger.getPosition();
		G.translatePathStartToPosition(effectPath, daggerPos.x, daggerPos.y);

		for (var i = 0; i < effectPath.length; i++) {
			var x = effectPath[i][0];
			var y = effectPath[i][1];
			if (!G.outOfBounds(x, y)) {
				PS.color(x, y, PS.COLOR_MAGENTA);
				PS.alpha(x, y, PS.ALPHA_OPAQUE);
			}
		}
	}

	// Uncomment the following line to inspect parameters
	//PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

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

	G.lastExit.x = x;
	G.lastExit.y = y;

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	if(G.touchDown){
		PS.release(G.lastExit.x, G.lastExit.y);
	}

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



