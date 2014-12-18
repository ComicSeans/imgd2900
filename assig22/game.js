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
		shockLightsOn : false,

		playerSpr : null,
		wallSprites : [],
		pitSprites : [],

		currentLevel : {},
		currentLevelNum : 0,

		lastMoveDir : "",

		//each level has a map of the grid in a 16x16 array,
		//0 is floor
		//1 is wall
		//2 is a pit
		levels :
		[
			// LEVEL 1
			{
				xStart : 2, yStart : 8,
				xGoal : 13, yGoal : 8,

				map : [
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				],

				walls : [],

				pits : []
			},
			// LEVEL 2
			{
				xStart : 2, yStart : 8,
				xGoal : 13, yGoal : 8,

				map : [
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 1,
					1, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 1,
					1, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				],

				walls : [],

				pits : []
			},

			// LEVEL 3
			{
				xStart : 2, yStart : 8,
				xGoal : 13, yGoal : 8,

				map : [
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 0, 1,
					1, 0, 1, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 1,
					1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1,
					1, 2, 0, 1, 1, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 1,
					1, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 1, 0, 1,
					1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1,
					1, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				],

				walls :
					[	],

				pits :
					[ 	]
			},

			// LEVEL 4
			{
				xStart : 7, yStart : 2,
				xGoal : 10, yGoal : 12,

				map : [
					0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 2, 0, 2, 0, 0, 2, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 1, 2, 1, 0, 0, 1, 0, 0, 0, 0,
					0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0,
					0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
					0, 0, 1, 0, 2, 2, 1, 1, 0, 1, 1, 0, 2, 1, 0, 0,
					0, 0, 1, 0, 1, 2, 2, 1, 0, 2, 0, 0, 1, 1, 0, 0,
					0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 2, 0, 1, 0, 0,
					0, 0, 1, 1, 1, 0, 1, 2, 0, 0, 0, 1, 1, 1, 0, 0,
					0, 0, 0, 0, 1, 0, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0
				],

				walls :
					[	],

				pits :
					[ 	]
			},

			// LEVEL 5
			{
				xStart : 6, yStart : 7,
				xGoal : 8, yGoal : 8,

				map : [
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
					0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0,
					0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1, 0, 0,
					0, 0, 1, 1, 1, 2, 0, 2, 1, 1, 2, 1, 2, 1, 0, 0,
					0, 0, 1, 0, 2, 2, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0,
					0, 0, 1, 1, 2, 0, 0, 1, 2, 0, 2, 0, 2, 1, 0, 0,
					0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0,
					0, 0, 1, 0, 1, 2, 1, 1, 2, 2, 0, 0, 2, 1, 0, 0,
					0, 0, 1, 0, 2, 2, 1, 2, 0, 0, 0, 2, 1, 1, 0, 0,
					0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 1, 0, 0, 1, 0, 0,
					0, 0, 1, 0, 0, 0, 2, 2, 2, 1, 1, 0, 1, 1, 0, 0,
					0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				],

				walls :
					[	],

				pits :
					[ 	]
			},

			// LEVEL 6
			{
				xStart : 2, yStart : 8,
				xGoal : 13, yGoal : 8,

				map : [
					0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 1, 1, 0, 0, 2, 1, 2, 0, 1, 1, 0, 0, 0,
					0, 0, 1, 1, 2, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0,
					0, 1, 1, 2, 2, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0,
					1, 1, 0, 0, 0, 0, 2, 0, 1, 0, 0, 1, 0, 0, 1, 1,
					1, 2, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1,
					1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 1, 0, 2, 2, 0, 1,
					1, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 2, 0, 0, 1,
					1, 1, 2, 0, 1, 2, 1, 0, 0, 2, 1, 1, 0, 2, 1, 1,
					0, 1, 1, 0, 0, 2, 1, 2, 0, 0, 0, 0, 2, 1, 1, 0,
					0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 2, 0, 1, 1, 0, 0,
					0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0
				],

				walls :
					[	],

				pits :
					[ 	]
			},

			// LEVEL 7
			{
				xStart : 2, yStart : 3,
				xGoal : 1, yGoal : 12,

				map : [
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 2, 1, 1,
					1, 0, 0, 0, 2, 0, 1, 2, 0, 1, 1, 0, 1, 0, 2, 1,
					1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1,
					1, 1, 0, 1, 1, 0, 0, 1, 0, 2, 1, 0, 1, 1, 0, 1,
					1, 1, 0, 2, 1, 1, 0, 2, 0, 0, 0, 0, 1, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 2, 1, 0, 2, 1,
					1, 2, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 2, 1,
					1, 1, 0, 0, 1, 0, 2, 0, 0, 2, 0, 1, 1, 0, 1, 1,
					1, 1, 1, 2, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0, 1, 1,
					1, 0, 0, 0, 1, 1, 2, 0, 0, 1, 0, 0, 0, 0, 2, 1,
					1, 0, 2, 0, 0, 0, 0, 2, 1, 1, 0, 1, 2, 0, 1, 1,
					1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 0, 2, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				],

				walls :
					[	],

				pits :
					[ 	]
			},

			// LEVEL 8
			{
				xStart : 8, yStart : 1,
				xGoal : 6, yGoal : 15,

				map : [
					0, 1, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1,
					0, 2, 1, 0, 0, 2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 2,
					1, 0, 0, 2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
					1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 0, 1,
					1, 2, 0, 0, 1, 0, 0, 0, 1, 0, 2, 0, 1, 0, 0, 2,
					0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 0, 0, 1, 0,
					0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
					2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,
					1, 0, 0, 0, 1, 0, 0, 2, 1, 0, 0, 2, 1, 0, 0, 2,
					1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
					1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 1, 0, 0, 2,
					0, 2, 1, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 1, 0,
					0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
					2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,
					1, 0, 0, 0, 1, 0, 0, 2, 1, 0, 0, 0, 1, 0, 2, 0,
					1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1
				],

				walls :
					[	],

				pits :
					[ 	]
			},

			// LEVEL 9
			{
				xStart : 3, yStart : 3,
				xGoal : 12, yGoal : 12,

				map : [
					1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1,
					1, 2, 2, 2, 2, 2, 0, 0, 2, 0, 2, 0, 0, 2, 2, 1,
					2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2,
					2, 2, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 0, 0, 2,
					2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 2,
					2, 2, 2, 0, 0, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 2,
					2, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2,
					2, 0, 0, 2, 2, 2, 0, 2, 2, 0, 2, 0, 2, 2, 2, 2,
					2, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2,
					2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2,
					2, 0, 2, 2, 0, 0, 2, 0, 0, 2, 0, 2, 2, 0, 0, 2,
					2, 0, 2, 0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 2, 0, 2,
					2, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2,
					2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 0, 2, 2, 2,
					1, 2, 2, 2, 0, 2, 0, 2, 2, 0, 0, 0, 2, 2, 2, 1,
					1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1
				],

				walls :
					[	],

				pits :
					[ 	]
			},


			// LEVEL 10
			{
				xStart : 2, yStart : 2,
				xGoal : 14, yGoal : 14,

				map : [
					1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1,
					2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2,
					2, 0, 0, 0, 2, 0, 1, 2, 1, 0, 0, 0, 2, 1, 0, 2,
					2, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 0, 1,
					2, 1, 1, 1, 1, 0, 0, 0, 2, 2, 1, 0, 2, 0, 0, 1,
					2, 0, 0, 0, 2, 1, 2, 0, 1, 2, 0, 0, 0, 0, 0, 1,
					1, 0, 2, 0, 0, 1, 1, 2, 1, 0, 0, 2, 1, 1, 2, 1,
					1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1,
					1, 0, 2, 2, 0, 1, 2, 0, 1, 2, 0, 0, 0, 2, 0, 1,
					2, 0, 1, 1, 0, 2, 0, 0, 1, 0, 0, 2, 1, 0, 0, 2,
					2, 0, 2, 1, 2, 2, 1, 0, 2, 0, 1, 1, 2, 0, 0, 2,
					2, 0, 0, 0, 0, 1, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2,
					1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2,
					2, 0, 0, 1, 0, 1, 1, 0, 2, 1, 2, 1, 1, 1, 0, 1,
					2, 1, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 1,
					2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1
				],

				walls :
					[	],

				pits :
					[ 	]
			},

			// LEVEL X
			{
				xStart : 1, yStart : 1,
				xGoal : 14, yGoal : 14,

				map : [
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				],

				walls :
					[	],

				pits :
					[ 	]
			}

		],

		loadLevel : function(levelNum)
		{
			//PS.debug("Starting to load new level\n");
			G.fallingImmune = true;
			G.currentLevel = G.levels[levelNum];
			var level = G.currentLevel;
			//load the wall sprites
			var ptr = 0;
			for ( var y = 0; y < G.height; y += 1 ) {
				for ( var x = 0; x < G.width; x += 1 ) {
					var val = level.map[ ptr ];
					if(val == 1){
						level.walls.push({x : x, y : y});
					} else if (val == 2){
						level.pits.push({x : x, y : y});
					}
					ptr += 1;
				}
			}
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
			//PS.debug("moving player sprite to new start\n");
			PS.spriteMove(G.playerSpr, level.xStart, level.yStart);
			//draw the goal
			PS.gridPlane(G.PLANE.GOAL);
			PS.border(level.xGoal, level.yGoal, 4);
			PS.borderColor(level.xGoal, level.xGoal, G.GRAY);
			G.fallingImmune = false;
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

		runningPeriodToCheck : 400,
		runningMovesThreshold : 2,

		isPlayerRunning : function(){
			var numMoves = 0;
			G.recentPlayerMoves.forEach(function(move){
				if(move.tick + G.runningPeriodToCheck >= PS.elapsed()) {
					numMoves++;
				}
			});
			return numMoves >= G.runningMovesThreshold;
		},

		isWallAt : function(x, y){
			return G.currentLevel.map[y * G.width + x] == 1;
			//
			//var pos;
			//var xWall;
			//var yWall;
			//for(var i = 0; i < G.wallSprites.length; i++){
			//	pos = PS.spriteMove(G.wallSprites[i]);
			//	xWall = pos.x;
			//	yWall = pos.y;
			//	if((x == xWall) && (y == yWall)){
			//		return  true;
			//	}
			//}
			//return false;
		},

		getTileAt : function(x , y){
			return G.currentLevel.map[y * G.width + x];
		},

		isPitAt : function(x, y){
			return G.currentLevel.map[y * G.width + x] == 2;

			//var pos;
			//var xPit;
			//var yPit;
			//for(var i = 0; i < G.pitSprites.length; i++){
			//	pos = PS.spriteMove(G.pitSprites[i]);
			//	xPit = pos.x;
			//	yPit = pos.y;
			//	if((x == xPit) && (y == yPit)){
			//		return  true;
			//	}
			//}
			//return false;
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
			//PS.debug("Turned lights on : "+PS.elapsed()+"\n");
		},

		turnLightsOnIn : function(delay){
			G.timeToTurnLightsOn = PS.elapsed() + delay;
			G.waitToTurnLightsOn = true;
		},

		turnLightsOff : function(){
			PS.gridPlane(G.PLANE.FLOOR);
			G.lightsOn = false;
			G.shockLightsOn = false;
			PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
			PS.gridColor(PS.COLOR_BLACK);
			G.timeNextTimeLightsMightTurnOn = PS.elapsed() + G.lightsMightTurnOnPeriod;
			//PS.debug("Turned lights off: "+PS.elapsed()+"\n");
		},

		turnLightsOffIn : function(delay){
			G.timeToTurnLightsOff = PS.elapsed() + delay;
			G.waitToTurnLightsOff = true;
		},

		flickerLightsOnFlag : false,
		flickerLightsOnEndTime : 0,
		flickerLightsOnTotalTime : 1500,
		flickerLightsOnTotalTimeDefault : 750,
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
			G.turnLightsOn();
			G.playFlickerOnSound();
			G.turnLightsOffIn(G.flickerLightsOnFlickerPeriodOn);
		},

		flickerLightsOffFlag : false,
		flickerLightsOffEndTime : 0,
		flickerLightsOffTotalTime : 1500,
		flickerLightsOffTotalTimeDefault : 750,
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
			G.playFlickerOffSound();
			G.turnLightsOnIn(G.flickerLightsOffFlickerPeriodOff);
		},

		collideWithPit : function(s1, p1, s2, p2, type){
			if(!G.fallingImmune && type == PS.SPRITE_OVERLAP) {
				G.fallIntoPit = true;
				G.playFellIntoAPitSound();
				G.flickerLightsOffFlag = false;
				G.flickerLightsOnFlag = false;
				G.turnLightsOn();
				//PS.debug("Fell into pit!\n");
			}
		},

		recentPlayerMoves : [],
		//look at the players movement for the past X ms
		periodToObserveMovementOver : 5000,

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
			return 23.091*Math.log(0.75*activity+1);
		},

		update : function(){
			G.updateLightSwitch();
			G.updateFallIntoPit();
			//if(PS.elapsed() % 4 == 0){
			//	PS.debug("Tick: "+PS.elapsed()+" Activity: "+G.getPlayerActivityLevel().toFixed(2)+"\n");
			//	//PS.debug("Tick: "+PS.elapsed()+" Running: "+G.isPlayerRunning()+"\n");
			//}
		},

		timeToTurnLightsOff : 0,
		waitToTurnLightsOff : false,

		timeToTurnLightsOn : 0,
		waitToTurnLightsOn : false,

		//ms between rolling for the lights to turn on
		lightsMightTurnOnPeriod : 2000,
		//chance between 1 - 100
		percentChanceLightsMayTurnOnRandomly : 55,
		timeNextTimeLightsMightTurnOn : 0,

		updateLightSwitch : function(){
			//update starting to flicker lights off
			if(G.flickerLightsOffDelayFlag && (PS.elapsed() >= G.flickerLightsOffTimeToStartFlickering)){
				G.flickerLightsOff();
				G.flickerLightsOffDelayFlag = false;
			}
			//turn lights on after delay
			if(G.waitToTurnLightsOn && (PS.elapsed() >= G.timeToTurnLightsOn)){
				//turn lights on while flicking them off
				if(G.flickerLightsOffFlag){
					G.turnLightsOn();
					G.playFlickerOnSound();
					G.waitToTurnLightsOn = false;
					G.turnLightsOffIn(G.flickerLightsOffFlickerPeriodOn);
				} else if (G.flickerLightsOnFlag) { //turn lights on while flickering them on
					//end of the flicking on
					if(PS.elapsed() >= G.flickerLightsOnEndTime){
						G.turnLightsOn();
						G.playFlickerOnSound();
						G.waitToTurnLightsOn = false;
						G.flickerLightsOnFlag = false;
					} else { //continue the flickering
						G.turnLightsOn();
						G.playFlickerOnSound();
						G.waitToTurnLightsOn = false;
						G.turnLightsOffIn(G.flickerLightsOnFlickerPeriodOn);
					}
				} else { //turn lights on normally
					G.turnLightsOn();
					G.waitToTurnLightsOn = false;
				}
			}
			//turn lights off after delay
			if(G.waitToTurnLightsOff && (PS.elapsed() >= G.timeToTurnLightsOff)){
				//turn lights off for while flickering them off
				if(G.flickerLightsOffFlag){
					//end of the flickering off
					if(PS.elapsed() >= G.flickerLightsOffEndTime){
						G.turnLightsOff();
						G.playFlickerOffSound();
						G.waitToTurnLightsOff = false;
						G.flickerLightsOffFlag = false;
					} else { //continue the flickering
						G.turnLightsOff();
						G.playFlickerOffSound();
						G.waitToTurnLightsOff = false;
						G.turnLightsOnIn(G.flickerLightsOffFlickerPeriodOff);
					}
				} else if (G.flickerLightsOnFlag){ //flicker lights off while flickering them on
					G.turnLightsOff();
					G.playFlickerOffSound();
					G.waitToTurnLightsOff = false;
					G.turnLightsOnIn(G.flickerLightsOnFlickerPeriodOff);
				} else { //turn lights off normally
					G.turnLightsOff();
					G.waitToTurnLightsOff = false;
				}
			}
			//update chance lights will turn on randomly
			G.percentChanceLightsMayTurnOnRandomly = G.getPlayerActivityLevel();
			//turn lights on randomly
			if(PS.elapsed() >= G.timeNextTimeLightsMightTurnOn){
				G.timeNextTimeLightsMightTurnOn = PS.elapsed() + G.lightsMightTurnOnPeriod;
				if(!G.lightsOn && !G.flickerLightsOffFlag && !G.flickerLightsOnFlag && PS.random(100) <= G.percentChanceLightsMayTurnOnRandomly){
					//PS.debug("Randomly turning on lights\n");
					//G.turnLightsOn();
					G.flickerLightsOn();
					//G.turnLightsOffIn(2000 + PS.random(2000));
					G.flickerLightsoffIn(3000 + PS.random(3000));
				}
			}
		},

		fallIntoPit : false,
		fallingImmune : false,
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
		},

		//sounds
		soundShock : "perc_cymbal_crash1",
		soundFellIntoAPit : "perc_cymbal_crash4",
		soundFlickerOn : "perc_drum_tom1",
		soundFlickerOff : "perc_drum_tom2",
		soundLevelComplete : "perc_triangle",

		playShockSound : function(){
			PS.audioPlay(G.soundShock);
		},

		playFlickerOnSound : function(){
			PS.audioPlay(G.soundFlickerOn);
		},

		playFlickerOffSound : function(){
			PS.audioPlay(G.soundFlickerOff);
		},

		playFellIntoAPitSound : function(){
			PS.audioPlay(G.soundFellIntoAPit);
		},

		playLevelCompleteSound : function(){
			PS.audioPlay(G.soundLevelComplete);
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

	G.playerSpr = PS.spriteSolid(1, 1);
	PS.spritePlane(G.playerSpr, G.PLANE.PLAYER);
	PS.spriteSolidColor(G.playerSpr, G.GRAY);

	G.currentLevelNum = 0;
	G.loadLevel(G.currentLevelNum);
	//G.loadLevel(0);

	G.timeNextTimeLightsMightTurnOn = G.lightsMightTurnOnPeriod;

	PS.audioLoad(G.soundShock);
	PS.audioLoad(G.soundFlickerOn);
	PS.audioLoad(G.soundFlickerOff);
	PS.audioLoad(G.soundFellIntoAPit);
	PS.audioLoad(G.soundLevelComplete);

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
	//1 key
	if(key == 49){
		G.flickerLightsOff();
		//PS.debug("Flickering lights off "+PS.elapsed()+"\n");
	}
	//2 key
	if(key == 50){
		G.flickerLightsOn();
		//PS.debug("Flickering lights on "+PS.elapsed()+"\n");
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
	G.lastMoveDir = direction;

	G.movePlayer(direction);
	if(G.isLevelComplete()){
		if(G.currentLevelNum == G.levels.length - 1) {
			G.cleanupLevel();
			PS.statusText("END");
			PS.statusColor(PS.COLOR_RED);
			G.gameComplete = true;
			G.waitToTurnLightsOff = false;
			G.waitToTurnLightsOn = false;
			G.flickerLightsOffFlag = false;
			G.flickerLightsOnFlag = false;
			G.flickerLightsOffDelayFlag = false;
			G.flickerLightsOnDelayFlag = false;
			G.turnLightsOff();
			G.playLevelCompleteSound();
		}else{
			G.waitToTurnLightsOff = false;
			G.waitToTurnLightsOn = false;
			G.flickerLightsOffFlag = false;
			G.flickerLightsOnFlag = false;
			G.flickerLightsOffDelayFlag = false;
			G.flickerLightsOnDelayFlag = false;
			G.turnLightsOff();
			G.loadNextLevel();
			G.playLevelCompleteSound();
		}
	}

	////////////////////////////////

	var x1, y1, x2, y2;

	var playerPos = PS.spriteMove(G.playerSpr);
	var x = playerPos.x;
	var y = playerPos.y;
	var projectedX = x, projectedY = y;
	if(up){
		projectedY = y - 1;
	} else if(down){
		projectedY = y + 1;
	} else if(left){
		projectedX = x - 1;
	} else if(right){
		projectedX = x + 1;
	}
	if(!G.lightsOn && !G.shockLightsOn && !G.flickerLightsOffFlag && !G.flickerLightsOnFlag && G.isPlayerRunning()) {
		//if they are running into a pit in front of them
		//PS.debug("Player moved "+direction+" at "+x+","+y+" projected to go to "+projectedX+","+projectedY+"\n");
		if (G.isPitAt(projectedX, projectedY)) {
			G.flickerLightsOffFlag = false;
			G.flickerLightsOnFlag = false;
			G.shockLightsOn = true;
			G.turnLightsOn();
			G.turnLightsOffIn(1500);
			G.playShockSound();
		}
		//if they are going into a wall, look to their left and right
		if (G.isWallAt(projectedX, projectedY)) {
			if (up || down) {
				x1 = x + 1;
				x2 = x - 1;
				y1 = y;
				y2 = y;
			} else if (left || right) {
				x1 = x;
				x2 = x;
				y1 = y - 1;
				y2 = y + 1;
			}
			//there is a pit to their side!
			if (G.isPitAt(x1, y1) || G.isPitAt(x2, y2)) {
				G.flickerLightsOffFlag = false;
				G.flickerLightsOnFlag = false;
				G.shockLightsOn = true;
				G.turnLightsOn();
				G.turnLightsOffIn(1500);
				G.playShockSound();
			}
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

	var x1, y1, x2, y2;

	var down = (key == 1008) || (key == 115);
	var right = (key == 1007) || (key == 100);
	var up = (key == 1006) || (key == 119);
	var left = (key == 1005) || (key == 97);

	//stop if not using the arrows
	if(!(down || right || up || left)){
		return;
	}

	G.keyDown = false;

	//var playerPos = PS.spriteMove(G.playerSpr);
	//var x = playerPos.x;
	//var y = playerPos.y;
	//var projectedX = 0, projectedY = 0;
	//if(up){
	//	projectedY = y - 1;
	//} else if(down){
	//	projectedY = y + 1;
	//} else if(left){
	//	projectedX = x - 1;
	//} else if(right){
	//	projectedX = x + 1;
	//}
	//if(!G.lightsOn && !G.shockLightsOn && !G.flickerLightsOffFlag && !G.flickerLightsOnFlag && G.isPlayerRunning()){
	//	//if they are running into a pit in front of them
	//	if(G.isPitAt(projectedX, projectedY)){
	//		G.flickerLightsOffFlag = false;
	//		G.flickerLightsOnFlag = false;
	//		G.shockLightsOn = true;
	//		G.turnLightsOn();
	//		G.turnLightsOffIn(1500);
	//		G.playShockSound();
	//	}
	//	//if they are going into a wall, look to their left and right
	//	if(G.isWallAt(projectedX, projectedY)){
	//		if(up || down){
	//			x1 = x + 1;
	//			x2 = x - 1;
	//			y1 = y;
	//			y2 = y;
	//		} else if(left || right){
	//			x1 = x;
	//			x2 = x;
	//			y1 = y - 1;
	//			y2 = y + 1;
	//		}
	//		//there is a pit to their side!
	//		if(G.isPitAt(x1, y1) || G.isPitAt(x2, y2)){
	//			G.flickerLightsOffFlag = false;
	//			G.flickerLightsOnFlag = false;
	//			G.shockLightsOn = true;
	//			G.turnLightsOn();
	//			G.turnLightsOffIn(1500);
	//			G.playShockSound();
	//		}
	//	}
    //
	//}

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

