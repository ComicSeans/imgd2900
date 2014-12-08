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

		width : 28,
		height : 32,

		score : 0,

		nextID : 0,

		touchDown : false,

		lastTouchLoc : {x : 0, y : 0},
		lastExit : {x : 0, y : 0},

		lastTouchTime : 0,

		//lastSwipeLength : 0,

		COLOR_GRASS : { r : 33, g : 131, b : 90 },

		targets : [],
		targetsToDelete : [],

		daggers : [],
		daggersToDelete : [],

		lastTimeDaggerThrown : 0,

		updateTimer : null,

		PLANE_DAGGER : 3,
		PLANE_EFFECTS : 2,
		PLANE_BG : 1,
		PLANE_TARGETS : 5,

		DAGGER_MAX_SPEED : 4,
		DAGGER_MIN_SPEED : 0.25,

		targetSpeed : 0.5,

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
			return x < 0 || y < 0 ? true : !!(x >= G.width || y >= G.height);
		},

		//initSprites : function(){
		//	G.SPR_DAGGER = PS.spriteSolid(1, 1);
		//	PS.spriteSolidColor(G.SPR_DAGGER, PS.COLOR_GRAY_DARK);
		//	PS.spriteMove(G.SPR_DAGGER, G.width / 2, G.height * 0.75);
		//},

		makeDagger : function(){
			var dagger = {id : 0};
			//if(G.dagger.spr != null) {
			//	PS.spriteDelete(G.dagger.spr);
			//}
			dagger.spr = PS.spriteSolid(1, 1);
			PS.spritePlane(dagger.spr, G.PLANE_DAGGER);
			PS.spriteSolidColor(dagger.spr, PS.COLOR_GRAY_DARK);
			PS.spriteMove(dagger.spr, G.width / 2, G.height - 5);
			dagger.moving = false;
			dagger.path = [];
			dagger.pathStep = 0;
			dagger.pathDest = {x : 0, y : 0};
			dagger.speed = 2;
			dagger.ticksBetweenMove = 0;
			dagger.ticksUntilMove = 0;
			G.nextID++;
			dagger.id = G.nextID;

			dagger.setSpeed = function(speed){
				dagger.speed = speed;
				if(speed < 1){
					dagger.ticksBetweenMove = Math.round(1 / speed);
					dagger.ticksUntilMove = dagger.ticksBetweenMove;
				}
				else{
					dagger.speed = Math.floor(speed);
					var SpeedFraction = speed - Math.floor(speed);
					dagger.ticksBetweenMove = Math.round(1 / SpeedFraction);
					dagger.ticksUntilMove = dagger.ticksBetweenMove;
				}
			};

			dagger.getPosition = function(){
				return PS.spriteMove(dagger.spr);
			};

			dagger.move = function (x, y){
				//PS.debug("Moving dagger to " + x + ", " + y + "\n");
				//if(G.outOfBounds(x, y)){
				//	//G.makeDagger();
				//}
				//else{
				//	//PS.spriteMove(dagger.spr, x, y);
				//}
				if(dagger.spr != null) {
					PS.spriteMove(dagger.spr, x, y);
				}
			};

			dagger.pathComplete = function(){
				return dagger.pathStep >= dagger.path.length;

			};

			dagger.setPath = function (path){
				dagger.path = path;
				dagger.pathDest = path[path.length - 2];
			};

			dagger.stepOnPath = function(){
				//PS.debug("Step on path!");
				if(dagger.speed < 1){
					dagger.ticksUntilMove -= 1;
					if(dagger.ticksUntilMove <= 0){
						dagger.pathStep += 1;
						dagger.ticksUntilMove = dagger.ticksBetweenMove;
					}
				}
				else{
					dagger.pathStep += dagger.speed;
					dagger.ticksUntilMove -= 1;
					if(dagger.ticksUntilMove <= 0){
						dagger.pathStep += 1;
						dagger.ticksUntilMove = dagger.ticksBetweenMove;
					}
				}
				if(!dagger.pathComplete()) {
					dagger.move(dagger.path[dagger.pathStep][0], dagger.path[dagger.pathStep][1]);
				}
				var pos = dagger.getPosition();
				if(dagger.pathComplete()){
					var newPath = dagger.path;
					if(newPath.length == 0)
					{
						return;
					}
					var daggerPos = dagger.getPosition();
					newPath = G.translatePathStartToPosition(newPath, daggerPos.x, daggerPos.y);
					dagger.setPath(newPath);
					dagger.pathStep = 0;
				}
			};
			PS.spriteCollide(dagger.spr, function(s1, p1, s2, p2, type){
				//PS.debug("dagger deleting hit!"+dagger.id+"\n");
				G.daggersToDelete.push(dagger);
			});

			G.daggers.push(dagger);
		},

		makeTargets : function(speed){
			//var target = PS.spriteSolid(3, 3);
			//PS.spritePlane(target, 5);
			//PS.spriteSolidColor(target, PS.COLOR_RED);
			//PS.spriteMove(target, G.width / 2, G.height * 0.25);
			//PS.spriteCollide(target, function collide( s1, p1, s2, p2, type ) {
			//	PS.statusText("Nice hit!");
			//	G.makeDagger();
			//});

			//G.makeTarget(5, 5);
			//G.makeTarget(15, 5);
			//G.makeTarget(20, 5);
			//G.makeTarget(25, 5);

			for(var i = 1; i < 6; i++){
				G.makeTarget(G.width / 6 * i, 1 + ((i * 2) % 7), speed);
			}
		},

		makeTarget : function(x, y, speed){
			var target = {spr : null, id : 0};
			target.spr = PS.spriteSolid(3, 3);
			G.nextID++;
			target.id = G.nextID;
			PS.spriteAxis(target.spr, 1, 1);
			PS.spriteMove(target.spr, x, y);
			PS.spritePlane(target.spr, G.PLANE_TARGETS);
			PS.spriteSolidColor(target.spr, PS.COLOR_RED);

			target.speed = 1;
			target.ticksBetweenMove = 0;
			target.ticksUntilMove = 0;

			target.speed = speed;
			if(speed < 1){
				target.ticksBetweenMove = Math.round(1 / speed);
				target.ticksUntilMove = target.ticksBetweenMove;
			}
			else{
				target.speed = Math.round(speed);
			}

			PS.spriteCollide(target.spr, function collide( s1, p1, s2, p2, type ) {
				//PS.debug("HIT!!!!\n");
				G.playTargetHitSound();
				G.score += 100;
				G.setScore(G.score);
				var targetHit;
				var posHit = PS.spriteMove( s1 );
				for(var i = 0; i < G.targets.length; i++){
					var pos = PS.spriteMove( G.targets[i].spr );
					if((pos.x == posHit.x) && (pos.y == posHit.y)){
						targetHit = G.targets[i];
					}
				}
				//var daggerHit;
				//var daggerPosHit = PS.spriteMove( s2 );
				//for(var j = 0; j < G.daggers.length; j++){
				//	var dpos = PS.spriteMove( G.daggers[j].spr );
				//	if((dpos.x == daggerPosHit.x) && (dpos.y == daggerPosHit.y)){
				//		daggerHit = G.daggers[j];
				//	}
				//}
				G.targetsToDelete.push(targetHit);
				//G.daggersToDelete.push(daggerHit);
				//if(!G.isDaggerAtSpawn()) {
				//	G.makeDagger();
				//}
			});

			G.targets.push(target);
		},

		isDaggerAtSpawn : function(){
			for(var i = 0; i < G.daggers.length; i++){
				var pos = PS.spriteMove(G.daggers[i].spr);
				if((pos.x == (G.width / 2)) && (pos.y == (G.height - 5))){
					return true;
				}
			}
			return false;
		},

		getDaggerAtSpawn : function(){
			for(var i = 0; i < G.daggers.length; i++){
				var pos = PS.spriteMove(G.daggers[i].spr);
				if((pos.x == (G.width / 2)) && (pos.y == (G.height - 5))){
					return G.daggers[i];
				}
			}
			return null;
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
			G.updateDaggers();
			G.updateTargets();
		},

		updateDaggers : function(){
			for(var i = 0; i < G.daggers.length; i++){
				G.updateDagger(G.daggers[i]);
			}
			G.cleanupDaggers();
			var d = new Date();
			var t = d.getTime();
			if(!G.isDaggerAtSpawn() && t - G.lastTimeDaggerThrown > 150){
				G.makeDagger();
			}
		},

		updateDagger : function(dagger){
			if(dagger.moving) {
				//PS.debug("Updating moving dagger "+dagger.id+" \n");
				dagger.stepOnPath();
				PS.gridRefresh();
			}
		},

		cleanupDaggers : function(){
			//for(var i = 0; i < G.daggersToDelete.length; i++){
			//	PS.debug("gotta delete dagger "+G.daggersToDelete[i].id+"\n");
			//	for(var j = 0; i < G.daggers.length; j++){
			//		//var id1 = G.daggersToDelete[i].id;
			//		//var id2 = G.daggers[j].id;
			//		////var pos1 = PS.spriteMove(G.daggersToDelete[i].spr);
			//		////var pos2 = PS.spriteMove(G.daggers[j].spr);
			//		//if(id1 == id2){
			//		////if(pos1.x == pos2.x && pos1.y == pos2.y){
			//		////	PS.spriteDelete(G.daggersToDelete[i].spr);
			//		////	G.daggers.splice(j, 1);
			//		//}
			//	}
			//}
			//G.targetsToDelete = [];
		},

		updateTargets : function(){
			PS.gridPlane(G.PLANE_TARGETS + 1);
			PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_TRANSPARENT);
			for(var i = 0; i < G.targets.length; i++){
				G.updateTarget(G.targets[i]);
			}
			G.cleanupTargets();
			if(G.targets.length == 0){
				G.daggers.forEach(function(entry){
					PS.spriteDelete(entry.spr);
				});
				G.daggers = [];
				G.makeDagger();
				G.makeTargets(G.targetSpeed);
			}
		},

		updateTarget : function(target){
			var pos = PS.spriteMove(target.spr);
			var x = pos.x;
			var y = pos.y;

			if(target.speed < 1){
				target.ticksUntilMove -= 1;
				if(target.ticksUntilMove <= 0){
					x += 1;
					target.ticksUntilMove = target.ticksBetweenMove;
				}
			}
			else{
				x += target.speed;
			}

			if(!G.outOfBounds(x, y)) {
				PS.gridPlane(G.PLANE_TARGETS + 1);
				PS.alpha(x, y, PS.ALPHA_OPAQUE);
				PS.color(x, y, PS.COLOR_WHITE);
			}

			x = (x + target.speed) % G.width;
			PS.spriteMove(target.spr, x, y);

		},

		cleanupTargets : function(){
			for(var i = 0; i < G.targetsToDelete.length; i++){
				for(var j = 0; j < G.targets.length; j++){
					if(G.targets[j].id == G.targetsToDelete[i].id ){
						G.targets.splice(j, 1);
						PS.spriteDelete(G.targetsToDelete[i].spr);
					}
				}
			}
			G.targetsToDelete = [];
			PS.gridPlane(G.PLANE_BG);
			PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
			PS.color(PS.ALL, PS.ALL, G.COLOR_GRASS);
		},

		makeMusicOptions : function(isMusic) {
			var path = document.location.pathname;
			var dir = "audio/";
			var musicOptions;

			if (isMusic) {
				musicOptions = {
					volume: 0.5,
					loop: true,
					lock: true,
					path: dir,
					fileTypes: ["mp3", "wav"]
				};
			}
			else {
				musicOptions = {
					volume: 0.25,
					loop: false,
					lock: true,
					path: dir,
					fileTypes: ["mp3", "wav"]
				};
			}

			return musicOptions;
		},

		playDaggerThrowSound : function(){
			PS.audioPlay("Dagger_Throw", G.makeMusicOptions(false));
		},

		playTargetHitSound : function(){
			PS.audioPlay("Target_Destroy", G.makeMusicOptions(false));
		},

		setScore : function(score){
			var str = score.toString();
			for(var i = 0; i < str.length; i++){
				PS.glyph(i, G.height - 1, str[i]);
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

	PS.statusText("Swipe the dagger at the targets.");

	PS.gridSize(G.width, G.height);
	PS.gridPlane(G.PLANE_BG);
	PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
	PS.color(PS.ALL, PS.ALL, G.COLOR_GRASS);
	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_WHITE);
	PS.gridColor(PS.COLOR_GRAY_LIGHT);


	PS.gridShadow(true, PS.COLOR_GRAY_DARK);

	G.makeDagger();
	G.makeTargets(G.targetSpeed);

	PS.audioLoad("Target_Destroy", G.makeMusicOptions(false));
	PS.audioLoad("Dagger_Throw", G.makeMusicOptions(false));

	G.setScore(G.score);

	G.updateTimer = PS.timerStart(2, G.update);
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

	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

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

	var dagger = G.getDaggerAtSpawn();

	if(dagger == null){
		return;
	}

	if(dagger.moving){
		return;
	}

	var dx = x - G.lastTouchLoc.x;
	var dy = y - G.lastTouchLoc.y;
	var swipeLength = Math.sqrt(dx*dx + dy*dy);

	var d = new Date();
	var time = d.getTime();
	var swipeSpeed = swipeLength / (time - G.lastTouchTime);

	//PS.debug("Swipe speed : " + swipeSpeed  + "\n");

	//find path target
	var xTar = x;
	var yTar = y;
	while(!G.outOfBounds(xTar, yTar)){
		xTar += dx;
		yTar += dy;
	}

	var path = PS.line(G.lastTouchLoc.x, G.lastTouchLoc.y, xTar, yTar);
	var daggerPos = dagger.getPosition();
	path = G.translatePathStartToPosition(path, daggerPos.x, daggerPos.y);

	//PS.debug("Swipe Length: " + swipeLength + "\n");

	var minSwipeSpeed = 0.05;
	var maxSwipeSpeed = 0.2;
	if(swipeSpeed > minSwipeSpeed) {
		//PS.debug("Thowing dagger!\n");
		G.playDaggerThrowSound();
		G.lastTimeDaggerThrown = time;
		var daggerSpeed = myMath.clamp(swipeSpeed, minSwipeSpeed, maxSwipeSpeed);
		daggerSpeed = myMath.map(daggerSpeed, minSwipeSpeed, maxSwipeSpeed, G.DAGGER_MIN_SPEED, G.DAGGER_MAX_SPEED);
		//PS.debug("Dagger speed : " + daggerSpeed + "\n");
		dagger.setSpeed(daggerSpeed);

		dagger.setPath(path);
		dagger.moving = true;
	}

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
	//if(!G.touchDown)
	//{
	//	return;
	//}
    //
	//if(!G.dagger.moving) {
    //
	//	PS.gridPlane(G.PLANE_EFFECTS);
	//	PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_TRANSPARENT);
    //
	//}

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

	if(G.lastTouchLoc.x == x && G.lastTouchLoc.y == y)
	{
		var d = new Date();
		G.lastTouchTime = d.getTime();
	}

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
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";
};



