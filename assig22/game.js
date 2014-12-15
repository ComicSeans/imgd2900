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

		distance : function(x1, y1, x2, y2){
			return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
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
		map : function long(x, in_min, in_max, out_min, out_max) {
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
			return {
				volume: volume,
				loop: isMusic,
				lock: true,
				path: dir,
				fileTypes: ["mp3", "wav"]
			};
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

		gameComplete : false,

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
			},
			// LEVEL X
			{
				xStart : 2, yStart : 2,
				xGoal : 14, yGoal : 14,

				walls :
					[
						{x : 0, y : 0},
						{x : 1, y : 0},
						{x : 2, y : 0},
						{x : 3, y : 0},
						{x : 6, y : 0},
						{x : 7, y : 0},
						{x : 8, y : 0},
						{x : 9, y : 0},
						{x : 10, y : 0},
						{x : 11, y : 0},
						{x : 14, y : 0},
						{x : 15, y : 0},

						{x : 6, y : 2},
						{x : 8, y : 2},
						{x : 13, y : 2},

						{x : 6, y : 3},
						{x : 8, y : 3},
						{x : 10, y : 3},
						{x : 11, y : 3},
						{x : 12, y : 3},
						{x : 13, y : 3},
						{x : 15, y : 3},

						{x : 1, y : 4},
						{x : 2, y : 4},
						{x : 3, y : 4},
						{x : 4, y : 4},
						{x : 10, y : 4},
						{x : 15, y : 4},

						{x : 5, y : 5},
						{x : 8, y : 5},
						{x : 15, y : 5},

						{x : 0, y : 6},
						{x : 5, y : 6},
						{x : 6, y : 6},
						{x : 8, y : 6},
						{x : 12, y : 6},
						{x : 13, y : 6},
						{x : 15, y : 6},

						{x : 0, y : 7},
						{x : 2, y : 7},
						{x : 3, y : 7},
						{x : 10, y : 7},
						{x : 15, y : 7},

						{x : 0, y : 8},
						{x : 5, y : 8},
						{x : 8, y : 8},
						{x : 15, y : 8},

						{x : 2, y : 9},
						{x : 3, y : 9},
						{x : 8, y : 9},
						{x : 12, y : 9},

						{x : 3, y : 10},
						{x : 6, y : 10},
						{x : 10, y : 10},
						{x : 11, y : 10},

						{x : 5, y : 11},
						{x : 6, y : 11},
						{x : 8, y : 11},
						{x : 10, y : 11},
						{x : 12, y : 11},
						{x : 14, y : 11},

						{x : 0, y : 12},
						{x : 2, y : 12},
						{x : 3, y : 12},

						{x : 3, y : 13},
						{x : 5, y : 13},
						{x : 6, y : 13},
						{x : 9, y : 13},
						{x : 11, y : 13},
						{x : 12, y : 13},
						{x : 13, y : 13},
						{x : 15, y : 13},

						{x : 1, y : 14},
						{x : 3, y : 14},
						{x : 15, y : 14},

						{x : 5, y : 15},
						{x : 6, y : 15},
						{x : 7, y : 15},
						{x : 12, y : 15},
						{x : 13, y : 15},
						{x : 14, y : 15},
						{x : 15, y : 15}
					],

				pits :
					[
						{x : 4, y : 0},
						{x : 5, y : 0},
						{x : 12, y : 0},
						{x : 13, y : 0},

						{x : 0, y : 1},
						{x : 10, y : 1},
						{x : 15, y : 1},

						{x : 0, y : 2},
						{x : 4, y : 2},
						{x : 7, y : 2},
						{x : 12, y : 2},
						{x : 15, y : 2},

						{x : 0, y : 3},
						{x : 7, y : 3},
						{x : 9, y : 3},

						{x : 0, y : 4},
						{x : 8, y : 4},
						{x : 9, y : 4},
						{x : 12, y : 4},

						{x : 0, y : 5},
						{x : 4, y : 5},
						{x : 6, y : 5},
						{x : 9, y : 5},

						{x : 2, y : 6},
						{x : 7, y : 6},
						{x : 11, y : 6},
						{x : 14, y : 6},

						{x : 11, y : 7},

						{x : 2, y : 8},
						{x : 3, y : 8},
						{x : 6, y : 8},
						{x : 9, y : 8},
						{x : 13, y : 8},

						{x : 0, y : 9},
						{x : 5, y : 9},
						{x : 11, y : 9},
						{x : 15, y : 9},

						{x : 0, y : 10},
						{x : 2, y : 10},
						{x : 4, y : 10},
						{x : 5, y : 10},
						{x : 8, y : 10},
						{x : 12, y : 10},
						{x : 15, y : 10},

						{x : 0, y : 11},
						{x : 7, y : 11},
						{x : 11, y : 11},
						{x : 15, y : 11},

						{x : 12, y : 12},
						{x : 15, y : 12},

						{x : 0, y : 13},
						{x : 8, y : 13},
						{x : 10, y : 13},

						{x : 0, y : 14},
						{x : 6, y : 14},
						{x : 13, y : 14},

						{x : 0, y : 15},
						{x : 1, y : 15},
						{x : 2, y : 15},
						{x : 3, y : 15},
						{x : 4, y : 15},
						{x : 8, y : 15},
						{x : 9, y : 15},
						{x : 10, y : 15},
						{x : 11, y : 15}

					]
			},

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
				level.walls.push({x : q, y : 4});
				level.walls.push({x : q, y : 12});
			}
			//vertical walls
			for(var w = 4; w < 12; w++)
			{
				level.walls.push({x : 0, y : w});
				level.walls.push({x : G.width - 1, y : w});
			}
		},

		makeLevel1 : function(level)
		{
			G.makeLevel0(level);
			for(var q = 3; q < 13; q++)
			{
				for(var w = 7; w < 10; w++)
				{
					if(q % 2 == 1) {
						level.pits.push({x: q, y: w});
					}
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
			G.recentPlayerMoves = [];
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
			if        (direction == "right"){
				x++;
			} else if (direction == "up"){
				y--;
			} else if (direction == "left"){
				x--;
			} else if (direction == "down"){
				y++;
			}
			if(!G.isWallAt(x, y) && !G.fallIntoPit) {
				PS.spriteMove(G.playerSpr, x, y);
				G.recentPlayerMoves.push(
					{pos : {x : x, y : y},
						tick : PS.elapsed()});
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
			G.timeNextTimeLightsMightTurnOn = PS.elapsed() + G.lightsMightTurnOnPeriod;
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
			PS.gridColor(PS.COLOR_WHITE);
			PS.debug("Turned lights on : "+PS.elapsed()+"\n");
		},

		turnLightsOnIn : function(delay){
			G.timeToTurnLightsOn = PS.elapsed() + delay;
			G.waitToTurnLightsOn = true;
		},

		turnLightsOff : function(){
			PS.gridPlane(G.PLANE.FLOOR);
			G.lightsOn = false;
			PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
			PS.gridColor(PS.COLOR_BLACK);
			G.timeNextTimeLightsMightTurnOn = PS.elapsed() + G.lightsMightTurnOnPeriod;
			PS.debug("Turned lights off: "+PS.elapsed()+"\n");
		},

		turnLightsOffIn : function(delay){
			G.timeToTurnLightsOff = PS.elapsed() + delay;
			G.waitToTurnLightsOff = true;
		},

		flickerLightsOnFlag : false,
		flickerLightsOnEndTime : 0,
		flickerLightsOnTotalTime : 1500,
		flickerLightsOnTotalTimeDefault : 1000,
		flickerLightsOnFlickerPeriodOn  : 50,
		flickerLightsOnFlickerPeriodOff : 100,

		flickerLightsOnDelayFlag : false,
		flickerLightsOnTimeToStartFlickering : 0,

		flickerLightsOn : function(){
			G.flickerLightsOnFor(G.flickerLightsOnTotalTimeDefault);
		},

		flickerLightsOnFor : function(time){
			G.flickerLightsOnTotalTime = time;
			G.flickerLightsOnFlag = true;
			G.flickerLightsOnEndTime = PS.elapsed() + G.flickerLightsOnTotalTime;
			G.turnLightsOnIn(G.flickerLightsOnFlickerPeriodOff);
		},

		flickerLightsOffFlag : false,
		flickerLightsOffEndTime : 0,
		flickerLightsOffTotalTime : 1500,
		flickerLightsOffTotalTimeDefault : 1000,
		flickerLightsOffFlickerPeriodOn  : 50,
		flickerLightsOffFlickerPeriodOff : 100,

		flickerLightsOffDelayFlag : false,
		flickerLightsOffTimeToStartFlickering : 0,

		flickerLightsoffIn : function(delay){
			G.flickerLightsOffDelayFlag = true;
			G.flickerLightsOffTimeToStartFlickering = PS.elapsed() + delay;
		},

		flickerLightsOff : function(){
			G.flickerLightsOffFor(G.flickerLightsOffTotalTimeDefault);
		},

		flickerLightsOffFor : function(time){
			G.flickerLightsOffTotalTime = time;
			G.flickerLightsOffFlag = true;
			G.flickerLightsOffEndTime = PS.elapsed() + G.flickerLightsOffTotalTime;
			G.turnLightsOff();
			G.turnLightsOnIn(G.flickerLightsOffFlickerPeriodOff);
		},

		collideWithPit : function(s1, p1, s2, p2, type){
			if(type == PS.SPRITE_OVERLAP) {
				G.fallIntoPit = true;
				G.turnLightsOn();
				//PS.debug("Fell into pit!\n");
			}
		},

		recentPlayerMoves : [],
		//look at the players movement for the past X ms
		periodToObserveMovementOver : 2500,

		/**
		 * returns number between 0 and 100 forhow active the player is
		 * @returns {number}
		 */
		getPlayerActivityLevel : function(){
			if(G.recentPlayerMoves.length == 0){
				return 0;
			}
			var maxX = 0;
			var maxY = 0;
			var minX = G.width - 1;
			var minY = G.height - 1;
			//shift the old moves out of the array
			while((G.recentPlayerMoves.length != 0) && ((G.recentPlayerMoves[0].tick + G.periodToObserveMovementOver) < PS.elapsed())){
				G.recentPlayerMoves.shift();
				//PS.debug("shifting item out of the array\n");
			}
			G.recentPlayerMoves.forEach(function(move){
				if(move.pos.x < minX){
					minX = move.pos.x;
				}
				if(move.pos.x > maxX){
					maxX = move.pos.x;
				}
				if(move.pos.y < minY){
					minY = move.pos.y;
				}
				if(move.pos.y > maxY){
					maxY = move.pos.y;
				}
			});
			var distanceTraveled = myMath.distance(minX, minY, maxX, maxY);
			var activity = myMath.map(distanceTraveled, 0, Math.sqrt(G.width * G.width + G.height * G.height), 0, 100);
			return 46.728*Math.log(0.075*activity+1);
		},

		update : function(){
			G.updateLightSwitch();
			G.updateFallIntoPit();
			//if(PS.elapsed() % 3 == 0){
			//	PS.debug("Tick: "+PS.elapsed()+" Activity: "+G.getPlayerActivityLevel().toFixed(2)+"\n");
			//}
		},

		timeToTurnLightsOff : 0,
		waitToTurnLightsOff : false,

		timeToTurnLightsOn : 0,
		waitToTurnLightsOn : false,

		//ms between rolling for the lights to turn on
		lightsMightTurnOnPeriod : 5000,
		//chance between 1 - 100
		percentChanceLightsMayTurnOnRandomly : 50,
		timeNextTimeLightsMightTurnOn : 0,

		updateLightSwitch : function(){
			//update starting to flicker lights off
			if(G.flickerLightsOffDelayFlag && (PS.elapsed() >= G.flickerLightsOffTimeToStartFlickering)){
				G.flickerLightsOff();
				G.flickerLightsOffDelayFlag = false;
			}
			//turn lights on after delay
			if(G.waitToTurnLightsOn && (PS.elapsed() >= G.timeToTurnLightsOn)){
				if(G.flickerLightsOffFlag){
					G.turnLightsOn();
					G.waitToTurnLightsOn = false;
					G.turnLightsOffIn(G.flickerLightsOffFlickerPeriodOn);
				} else {
					G.turnLightsOn();
					G.waitToTurnLightsOn = false;
				}
			}
			//turn lights off after delay
			if(G.waitToTurnLightsOff && (PS.elapsed() >= G.timeToTurnLightsOff)){
				if(G.flickerLightsOffFlag){
					if(PS.elapsed() >= G.flickerLightsOffEndTime){
						G.turnLightsOff();
						G.waitToTurnLightsOff = false;
						G.flickerLightsOffFlag = false;
					} else {
						G.turnLightsOff();
						G.waitToTurnLightsOff = false;
						G.turnLightsOnIn(G.flickerLightsOffFlickerPeriodOff);
					}
				} else {
					G.turnLightsOff();
					G.waitToTurnLightsOff = false;
				}
			}
			//update chance lights will turn on randomly
			G.percentChanceLightsMayTurnOnRandomly = G.getPlayerActivityLevel();
			//turn lights on randomly
			if(PS.elapsed() >= G.timeNextTimeLightsMightTurnOn){
				G.timeNextTimeLightsMightTurnOn = PS.elapsed() + G.lightsMightTurnOnPeriod;
				if(PS.random(100) <= G.percentChanceLightsMayTurnOnRandomly){
					PS.debug("Randomly turning on lights\n");
					G.turnLightsOn();
					//G.turnLightsOffIn(2000 + PS.random(2000));
					G.flickerLightsoffIn(2000 + PS.random(2000));
				}
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
					G.turnLightsOff();
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

	PS.statusText("");

	PS.border(PS.ALL, PS.ALL, 0);
	PS.gridPlane(G.PLANE.FLOOR);
	PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	//PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
	PS.gridColor(PS.COLOR_BLACK);

	G.makeAllLevels();

	G.playerSpr = PS.spriteSolid(1, 1);
	PS.spritePlane(G.playerSpr, G.PLANE.PLAYER);
	PS.spriteSolidColor(G.playerSpr, G.GRAY);

	//G.loadLevel(G.currentLevelNum);
	G.loadLevel(0);

	G.timeNextTimeLightsMightTurnOn = G.lightsMightTurnOnPeriod;

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

	if(G.gameComplete){
		return;
	}

	//toggle lights with tilda
	if(key == 96 || key == 126){
		G.switchLights();
	}
	if(key == 49){
		G.flickerLightsOff();
		PS.debug("Flickering lights off "+PS.elapsed()+"\n");
	}
	if(key == 50){
		G.turnLightsOnIn(G.flickerLightsOffFlickerPeriodOff);
		PS.debug("Waiting to turn lights on..."+PS.elapsed()+"\n");
	}

	var down = (key == 1008) || (key == 115);
	var right = (key == 1007) || (key == 100);
	var up = (key == 1006) || (key == 119);
	var left = (key == 1005) || (key == 97);

	//stop if not using the arrows
	if(!(down || right || up || left)){
		return;
	}

	var direction = "";
	if(down){
		direction = "down";
	} else if (right){
		direction = "right";
	} else if (left){
		direction = "left";
	} else if (up){
		direction = "up";
	}

	//PS.debug(direction+"\n");

	G.keyDown = true;

	G.movePlayer(direction);
	if(G.isLevelComplete()){
		if(G.currentLevelNum == G.levels.length - 1) {
			G.cleanupLevel();
			PS.statusText("END");
			PS.statusColor(PS.COLOR_RED);
			G.gameComplete = true;
		}else{
			G.loadNextLevel();
		}
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

	var down = (key == 1008) || (key == 115);
	var right = (key == 1007) || (key == 100);
	var up = (key == 1006) || (key == 119);
	var left = (key == 1005) || (key == 97);

	//stop if not using the arrows
	if(!(down || right || up || left)){
		return;
	}

	G.keyDown = false;

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

