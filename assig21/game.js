// game.js for Perlenspiel 3.2
//released to the public domain

//	Flicker
//
//	See what's in font of you
//
//	By Team Zalen
//	Sean Halloran
//	Stone Cleven

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

var myMath;
( function () {
	"use strict";
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
			return (num1 * weight1 + num2 * weight2) / (weight1 + weight2);
		},

		/**
		 * Maps a value from one range to between another range
		 * @param x
		 * @param in_min
		 * @param in_max
		 * @param out_min
		 * @param out_max
		 * @returns {number}
		 */
		map : function long(x, in_min, in_max, out_min, out_max)
		{
			return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		}
	};
}());

var Util;
( function () {
	"use strict";
	Util = {
		makeMusicOptions : function(isMusic) {
			var path = document.location.pathname;
			var dir = "audio/";
			var volume = (isMusic) ? 0.5 : 0.25;
			var musicOptions = {
				volume: volume,
				loop: isMusic,
				lock: true,
				path: dir,
				fileTypes: ["mp3", "wav"]
			};
			return musicOptions;
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
	G = {
		width : 16,
		height : 16,

		PLANE :
		{
			FLOOR: 5,
			PITS : 6,
			WALLS : 7,
			GOAL : 10,
			PLAYER : 11
		},

		GRAY : PS.COLOR_GRAY,

		lightsOn : false,

		playerSpr : null,
		wallSprites : [],
		pitSprites : [],

		currentLevel : {},
		currentLevelNum : 0,

		levels :
		[
			// LEVEL 0
			{
				xStart : 2, yStart : 8,
				xGoal : 13, yGoal : 8,

				walls :
				[

				],

				pits :
				[

				]
			},
			// LEVEL 1
			{
				xStart : 2, yStart : 8,
				xGoal : 13, yGoal : 8,

				walls :
				[

				],

				pits :
				[

				]
			}
		],

		makeAllLevels : function()
		{
			G.makeLevel0(G.levels[0]);
			G.makeLevel1(G.levels[1]);
		},

		makeLevel0 : function(level)
		{
			//horizontal walls
			for(var q = 0; q < G.width; q++)
			{
				level.walls.push({x : q, y : 5});
				level.walls.push({x : q, y : 11});
			}
			//vertical walls
			for(var w = 5; w < 11; w++)
			{
				level.walls.push({x : 0, y : w});
				level.walls.push({x : G.width - 1, y : w});
			}
		},

		makeLevel1 : function(level)
		{
			G.makeLevel0(level);
			level.pits.push({x : 2, y : 7});
			level.pits.push({x : 2, y : 9});
			level.pits.push({x : 13, y : 7});
			level.pits.push({x : 13, y : 9});
			for(var q = 3; q < 13; q++)
			{
				for(var w = 7; w < 10; w++)
				{
					level.pits.push({x : q, y : w});
				}
			}
		},

		loadLevel : function(levelNum)
		{
			G.currentLevel = G.levels[levelNum];
			var level = G.currentLevel;
			//load the wall sprites
			level.walls.forEach(function(wall)
			{
				var wallSprite = PS.spriteSolid(1, 1);
				PS.spriteSolidColor(wallSprite, PS.COLOR_WHITE);
				PS.spriteSolidAlpha(wallSprite, PS.ALPHA_OPAQUE);
				PS.spritePlane(wallSprite, G.PLANE.WALLS);
				PS.spriteMove(wallSprite, wall.x, wall.y);
				G.wallSprites.push(wallSprite);
			});
			//load the pit sprites
			level.pits.forEach(function(pit)
			{
				var pitSprite = PS.spriteSolid(1, 1);
				PS.spriteSolidColor(pitSprite, PS.COLOR_BLACK);
				PS.spriteSolidAlpha(pitSprite, PS.ALPHA_OPAQUE);
				PS.spritePlane(pitSprite, G.PLANE.PITS);
				PS.spriteMove(pitSprite, pit.x, pit.y);
				PS.spriteCollide(pitSprite, G.collideWithPit);
				G.pitSprites.push(pitSprite);
			});
			//move the player
			PS.spriteMove(G.playerSpr, level.xStart, level.yStart);
			//draw the goal
			PS.gridPlane(G.PLANE.GOAL);
			PS.border(level.xGoal, level.yGoal, 4);
			PS.borderColor(level.xGoal, level.xGoal, G.GRAY);
		},

		cleanupLevel : function(){
			G.wallSprites.forEach(function(wallSprite){
				PS.spriteDelete(wallSprite);
			});
			G.wallSprites = [];
			G.pitSprites.forEach(function(pitSprite){
				PS.spriteDelete(pitSprite);
			});
			G.pitSprites = [];
			PS.border(PS.ALL, PS.ALL, 0);
		},

		loadNextLevel : function(){
			G.cleanupLevel();
			G.currentLevelNum++;
			G.loadLevel(G.currentLevelNum);
			G.turnLightsOff();
		},

		movePlayer : function(direction){
			var pos = PS.spriteMove(G.playerSpr);
			var x = pos.x;
			var y = pos.y;
			if (direction == "right"){
				x++;
			} else if (direction == "up"){
				y--;
			} else if (direction == "left"){
				x--;
			} else if (direction == "down"){
				y++;
			}
			if(!G.isWallAt(x, y)) {
				PS.spriteMove(G.playerSpr, x, y);
			}
		},

		isWallAt : function(x, y){
			var pos;
			var xWall;
			var yWall;
			for(var i = 0; i < G.wallSprites.length; i++){
				pos = PS.spriteMove(G.wallSprites[i]);
				xWall = pos.x;
				yWall = pos.y;
				if((x == xWall) &&(y == yWall)){
					return  true;
				}
			}
			return false;
		},

		isLevelComplete : function(){
			var pos = PS.spriteMove(G.playerSpr);
			return (pos.x == G.currentLevel.xGoal) && (pos.y == G.currentLevel.yGoal);
		},

		resetLevel : function(){
			PS.spriteMove(G.playerSpr, G.currentLevel.xStart, G.currentLevel.yStart);
			PS.spriteShow(G.playerSpr, true);
		},

		switchLights : function(){
			G.lightsOn = !G.lightsOn;
			if(G.lightsOn){
				G.turnLightsOn();
			} else {
				G.turnLightsOff();
			}
		},

		turnLightsOn : function(){
			PS.gridPlane(G.PLANE.FLOOR);
			G.lightsOn = true;
			PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);
			G.timeLightsLastTurnedOn = PS.elapsed();
		},

		turnLightsOff : function(){
			PS.gridPlane(G.PLANE.FLOOR);
			G.lightsOn = false;
			PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
		},

		turnLightsOffIn : function(delay){
			G.timeToTurnLightsOff = PS.elapsed() + delay;
			G.waitToTurnLightsOff = true;
		},

		collideWithPit : function(s1, p1, s2, p2, type){
			if(type == PS.SPRITE_OVERLAP) {
				G.fallIntoPit = true;
				G.turnLightsOn();
				G.turnLightsOffIn(G.pitBorderMax * G.pitFallPeriod);
				//PS.debug("Fell into pit!\n");
			}
		},

		update : function(){
			G.updateLightSwitch();
			G.updateFallIntoPit();

		},

		timeLightsLastTurnedOn : 0,
		timeToTurnLightsOff : 0,
		waitToTurnLightsOff : false,

		updateLightSwitch : function(){
			//turn lights off after delay
			if(G.waitToTurnLightsOff && (PS.elapsed() >= G.timeToTurnLightsOff)){
				G.turnLightsOff();
				G.waitToTurnLightsOff = false;
			}
		},

		fallIntoPit : false,
		pitBorder : 0,
		pitBorderMax : 12,
		pitFallPeriod : 100,
		lastPitFall : 0,

		updateFallIntoPit : function(){
			//fall into a pit
			if(G.fallIntoPit && (PS.elapsed() - G.lastPitFall > G.pitFallPeriod)){
				var pos = PS.spriteMove(G.playerSpr);
				PS.border(pos.x, pos.y, ++G.pitBorder);
				PS.borderColor(pos.x, pos.y, PS.COLOR_BLACK);
				G.lastPitFall = PS.elapsed();
				if(G.pitBorder >= G.pitBorderMax){
					G.fallIntoPit = false;
					G.pitBorder = 0;
					//PS.debug("finished falling into pit\n")
					G.resetLevel();
					PS.border(pos.x, pos.y, 0);
				}
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

PS.init = function( system, options ) {
	"use strict";

	PS.gridSize(G.width, G.height);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.gridPlane(G.PLANE.FLOOR);
	PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
	//PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
	PS.gridColor(PS.COLOR_BLACK);

	G.makeAllLevels();

	G.playerSpr = PS.spriteSolid(1, 1);
	PS.spritePlane(G.playerSpr, G.PLANE.PLAYER);
	PS.spriteSolidColor(G.playerSpr, G.GRAY);

	//G.loadLevel(G.currentLevelNum);
	G.loadLevel(0);

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
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead
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

	//PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	if(key == 32){
		G.switchLights();
	}

	var down = (key == 1008) || (key == 115);
	var right = (key == 1007) || (key == 100);
	var up = (key == 1006) || (key == 119);
	var left = (key == 1005) || (key == 97);
	var direction = "";
	//if(down)
	//	PS.debug("down\n");
	//if(right)
	//	PS.debug("right\n");
	//if(up)
	//	PS.debug("up\n");
	//if(left)
	//	PS.debug("left\n");
	if(down){
		direction = "down";
	} else if (right){
		direction = "right";
	} else if (left){
		direction = "left";
	} else if (up){
		direction = "up";
	}
	G.movePlayer(direction);
	if(G.isLevelComplete()){
		G.loadNextLevel();
	}

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

