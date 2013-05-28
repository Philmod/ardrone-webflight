PILOT_ACCELERATION = 0.2;

(function(window, document) {
	'use strict';

	var keyboardType = 1;  // indice of the array below

	var keyboardTypes = ['azerty', 'qwerty']
		, keyCodeMap    = {"0":"96","1":"97","2":"98","3":"99","4":"100","5":"101","6":"102","7":"103","8":"104","9":"105","backspace":"8","tab":"9","return":"13","shift":"16","ctrl":"17","alt":"18","pausebreak":"19","capslock":"20","escape":"27"," ":"32","pageup":"33","pagedown":"34","end":"35","home":"36","left":"37","up":"38","right":"39","down":"40","+":"107","printscreen":"44","insert":"45","delete":"46",";":"186","=":"187","a":"65","b":"66","c":"67","d":"68","e":"69","f":"70","g":"71","h":"72","i":"73","j":"74","k":"75","l":"76","m":"77","n":"78","o":"79","p":"80","q":"81","r":"82","s":"83","t":"84","u":"85","v":"86","w":"87","x":"88","y":"89","z":"90","*":"106","-":"189",".":"190","/":"191","f1":"112","f2":"113","f3":"114","f4":"115","f5":"116","f6":"117","f7":"118","f8":"119","f9":"120","f10":"121","f11":"122","f12":"123","numlock":"144","scrolllock":"145",",":"188","`":"192","[":"219","\\":"220","]":"221","'":"222"};
	  ;

	var forward  = 'w'
		, backward = 's'
		, left		 = 'a'
		, right 	 = 'd'
		;
	if (keyboardTypes[keyboardType] === 'qwerty') { }
	else if (keyboardTypes[keyboardType] === 'azerty') {
		forward  = 'z';
		backward = 's';
		left 		 = 'q';
		right 	 = 'd';
	}

	// Static keymap used within this module
	var Keymap = {
			38 : {
				ev : 'move',
				action : 'up'
			},
			40 : {
				ev : 'move',
				action : 'down'
			},
			37 : {
				ev : 'move',
				action : 'counterClockwise'
			},
			39 : {
				ev : 'move',
				action : 'clockwise'
			},
			32 : {
				ev : 'drone',
				action : 'stop'
			},
			84 : {
				ev : 'drone',
				action : 'takeoff'
			},
			76 : {
				ev : 'drone',
				action : 'land'
			},
			69 : {
				ev : 'drone',
				action : 'disableEmergency'
			}
		};
	Keymap[keyCodeMap[forward]] = {
		ev : 'move',
		action : 'front'
	};
	Keymap[keyCodeMap[backward]] = {
		ev : 'move',
		action : 'back'
	};
	Keymap[keyCodeMap[left]] = {
		ev : 'move',
		action : 'left'
	};
	Keymap[keyCodeMap[right]] = {
		ev : 'move',
		action : 'right'
	};

	/*
	 * Constructuor
	 */
	var Pilot = function Pilot(cockpit) {
                console.log("Loading Pilot plugin.");
		this.cockpit = cockpit;
		this.speed = 0;
		this.listen();
	};

	/*
	 * Register keyboard event listener
	 */
	Pilot.prototype.listen = function listen() {
		var pilot = this;
		$(document).keydown(function(ev) {
			pilot.keyDown(ev);
		});

		$(document).keyup(function(ev) {
			pilot.keyUp(ev);
		});
	};

	Pilot.prototype.keyDown = function keyDown(ev) {
		console.log("Keydown: " + ev.keyCode);
		if (Keymap[ev.keyCode] == null) {
			return;
                }
		var evData;
		ev.preventDefault();
		this.speed = this.speed >= 1 ? 1 : this.speed + PILOT_ACCELERATION / (1 - this.speed);
		evData = Keymap[ev.keyCode];
		this.cockpit.socket.emit("/pilot/" + evData.ev, {
			action : evData.action,
			speed : this.speed
		});
	};

	Pilot.prototype.keyUp = function keyUp(ev) {
		console.log("Keyup: " + ev.keyCode);
		if (Keymap[ev.keyCode] == null) {
			return;
                }
                ev.preventDefault();
		this.speed = 0;
		this.cockpit.socket.emit("/pilot/drone", {
			action : "stop"
		});
	};

	window.Cockpit.plugins.push(Pilot);

}(window, document));
