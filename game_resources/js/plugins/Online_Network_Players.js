var Imported = Imported || {};
Imported.Online_Network_Players = true;

(function () {
var Nasty = Nasty || {};
//=============================================================================
// Online Network Players
// Version: 1.0.4
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc Network Players for Neldersons Online Core
 *<Online_Network_Players>
 * @author Nelderson and Galv
 *
 * @param Net Player Map ID
 * @desc Map ID for Net Player Spawn Event
 * @default 1
 *
 * @param Net Player Event ID
 * @desc Event ID for Net Player Spawn Event
 * @default 1
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 * This plugin allows you to see other players on the map
 *
 *  There are two plugin parameters:
 *
 *  1.  Net Player Map ID
 *      -The Map ID the Netplayer Spawn event is located
 *
 *  2.  Net Player Event ID
 *      -The Event ID the Netplayer Spawn event is located
 *
 *
 */
 //=============================================================================

 Nasty.Parameters = $plugins.filter(function(p)
	 { return p.description.contains('<Online_Network_Players>');})[0].parameters;

var NetPlayerMap = Nasty.Parameters['Net Player Map ID'];
var NetPlayerEventID = Nasty.Parameters['Net Player Event ID'];
var socket;
var networkPlayerid = 0;
var networkMapEvents = {};
var NetworkFlag = false;

var OnlineMV_NetPlayer_SocketConn_Alias = Game_Network.prototype.connectSocketsAfterLogin;
Game_Network.prototype.connectSocketsAfterLogin = function(){
	OnlineMV_NetPlayer_SocketConn_Alias.call(this);

	$gameNetwork.connectSocket('netplayers','/netplayers',false);
	socket = $gameNetwork._socket.netplayers;

	socket.on('MyID',function(data){
		networkPlayerid = data.id; //Set Network ID
		currentRoom = data.room;
		NetworkFlag = true;
	});

	socket.on('NetworkPlayersXY', function(data){
		var player = data.playerid;
		var cx = data.x;
		var cy = data.y;
		var moveSpeed = data.moveSpeed;
		var moveFrequenzy = data.moveFrequenzy;
		var characterName = data.characterName;
		var characterIndex = data.characterIndex;

		//Just in case users joined at the same time, make an event for them
		if (networkMapEvents[player]===undefined){
			var NetEvent = $gameMap.addNetworkPlayer(1, 1,player);
			networkMapEvents[player] = NetEvent;
		}

		// Update movement speed and frequenzy
		networkMapEvents[player].setMoveSpeed(moveSpeed);
		networkMapEvents[player].setMoveFrequency(moveFrequenzy);

		//Continue on with updating xy position
		var dir = data.direction;
		networkMapEvents[player].moveStraight(dir);
		//Sanity Check XY position
		if (networkMapEvents[player].x!==data.x || networkMapEvents[player].y!==data.y){
			networkMapEvents[player].setPosition(data.x, data.y);
		}
		//Set Player Sprite
		networkMapEvents[player]._characterName = characterName;
		networkMapEvents[player]._characterIndex = characterIndex;
	 });



	 socket.on('playersJoin',function(data){
	 var room = data.room;
	 var playerid = data.id;
	 if (room !== currentRoom) return;
	 if (playerid===networkPlayerid) return;
	 if (networkMapEvents[playerid]===undefined){
		 var NetEvent = $gameMap.addNetworkPlayer(1, 1, playerid);
		 networkMapEvents[playerid] = NetEvent;
	 }
	 });


	 socket.on('changeRoomVar', function(data){
		 currentRoom = data;
		 networkMapEvents = {}; //NEL TEST
	 });

	 socket.on('removePlayer', function(data){
		 var id = data.id;
		 //Just in case player hasn't moved and disconnects
		 if (!networkMapEvents[id]) return;
		 var player = networkMapEvents[id]._eventId;
		 var map = data.room;
		 $gameMap.clearNetworkPlayer(player);
		 delete networkMapEvents[id];
	 });
};

//================//
//Player Movement
//================//
Game_Player.prototype.moveByInput = function() {
		if (!this.isMoving() && this.canMove()) {
				var direction = this.getInputDirection();
				if (direction > 0) {
						$gameTemp.clearDestination();
				} else if ($gameTemp.isDestinationValid()){
						var x = $gameTemp.destinationX();
						var y = $gameTemp.destinationY();
						direction = this.findDirectionTo(x, y);
				}
				if (direction > 0) {
					//Send x,y info to server
						this.executeMove(direction);
						if (NetworkFlag){
						socket.emit('DestinationXY', {
							playerid: networkPlayerid,
							direction: direction,
							x: this.x,
							y: this.y,
							moveSpeed: this.realMoveSpeed(),
							moveFrequenzy: this.moveFrequency(),
							characterName: this._characterName,
							characterIndex: this._characterIndex
						});
					}
				}
		}
};
//==============================//
//Room Change When Changing Maps
//==============================//
var NetPlayer_SceneMap_Start_Alias = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	NetPlayer_SceneMap_Start_Alias.call(this);
	var mapId = $gameMap.mapId();
	if (NetworkFlag){
		if (currentRoom !== mapId.toString()){ //In case of menu or battle scene
			socket.emit('changeRoom', mapId.toString());
		}
		socket.emit('CheckPlayers',mapId.toString());
	}
};

//==========================================//
//Cloudsave Fix for null sprites being saved
//==========================================//
var Online_NetPlayers_Map_CallMenu_Alias = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
  $gameMap.clearAllNetworkPlayerEvents();
  networkMapEvents = {};
  Online_NetPlayers_Map_CallMenu_Alias.call(this);
};

//========================//
//Net Player Event Creator
//========================//
DataManager.loadNetworkPlayerMapData = function() {
	var mapId = NetPlayerMap;
  var filename = 'Map%1.json'.format(mapId.padZero(3));
  this.loadDataFile('$networkPlayerMap', filename);
};

DataManager.loadNetworkPlayerMapData();

Game_Map.prototype.addNetworkPlayer = function(x,y,playerid) {
    var eId = this._events.length;
    this._events[eId] = new Game_NetworkPlayer(this._mapId,eId,x,y);
	  SceneManager._scene._spriteset.createNetworkPlayer(eId);
		return this._events[eId];
};

Game_Map.prototype.clearNetworkPlayer = function(eId) {
	this._events[eId] = null;
	SceneManager._scene._spriteset.clearNetworkPlayer(eId);
};

Game_Map.prototype.clearAllNetworkPlayerEvents = function() {
  for (var i = 1; i < this._events.length; i++) {
    if (!this._events[i]) continue;
    if (this._events[i]._isNetworkPlayer){
      this._events[i] = null;
    }
    SceneManager._scene._spriteset.clearAllNetworkPlayerEvents();
  }
  this.removeNullEvents();
};

Game_Map.prototype.removeNullEvents = function() {
	for (var i = this._events.length - 1; i > 0; i--) {
		if (this._events[i] === null) {
			this._events.splice(i, 1);
		} else {
			break;
		}
	}
};

Spriteset_Map.prototype.createNetworkPlayer = function(id) {
	var event = $gameMap._events[id];
	var sId = this._characterSprites.length;
	this._characterSprites[sId] = new Sprite_Character(event);
	this._characterSprites[sId].update(); // To remove occsaional full-spriteset visible issue
	this._tilemap.addChild(this._characterSprites[sId]);
};

Spriteset_Map.prototype.clearNetworkPlayer = function(eId) {
	for (var i = 0; i < this._characterSprites.length; i++) {
		var event = this._characterSprites[i]._character;
		if (event._isNetworkPlayer && eId == event._eventId) {
			this._tilemap.removeChild(this._characterSprites[i]);
		}
	}
};

Spriteset_Map.prototype.clearAllNetworkPlayerEvents = function() {
	for (var i = 0; i < this._characterSprites.length; i++) {
		var event = this._characterSprites[i]._character;
		if (event._isNetworkPlayer) {
			this._tilemap.removeChild(this._characterSprites[i]);
		}
	}
};


function Game_NetworkPlayer() {
    this.initialize.apply(this, arguments);
}

Game_NetworkPlayer.prototype = Object.create(Game_Event.prototype);
Game_NetworkPlayer.prototype.constructor = Game_NetworkPlayer;

Game_NetworkPlayer.prototype.initialize = function(mapId,eventId,x,y) {
	Game_Event.prototype.initialize.call(this,mapId,eventId);
  this._isNetworkPlayer = true;
  this.setPosition(x,y);
};

Game_NetworkPlayer.prototype.event = function() {
    return $networkPlayerMap.events[NetPlayerEventID];
};

})();
