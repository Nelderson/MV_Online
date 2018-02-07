var Imported = Imported || {};
Imported.Online_Network_Players = true;

(function () {
var Nasty = Nasty || {};
//=============================================================================
// Online Network Players
// Version: 1.0.10 - Fixed bug when in battle sprites clearing on map.
// Version: 1.0.9 - Added check to stop Game_Player refresh when null
// Version: 1.0.8 - Fixed bug for remove player when not on map
// Version: 1.0.7 - Fixed bug with NastyTextPop not being there
// Version: 1.0.6 - Added names above characters with Nasty_Text_Pop_Events.js
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
 * @param Show Username or Character Name
 * @desc 0=Username, 1=Character Name
 * @default 0
 *
 * @param Show Name Above Players Head
 * @type boolean
 * @on Yes
 * @off No
 * @desc Shows Username/Character name over Players Head
 * @default true
 *
 * @param Player Text Options
 * @desc This refers to the number in Nasty_Text_Pop_Events for text options
 * @default 1
 *
 * @param Net Player Text Options
 * @desc This refers to the number in Nasty_Text_Pop_Events for text options
 * @default 1
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 * This plugin allows you to see other players on the map.
 * Add Nasty_Text_Pop_Events.js to see players names above their character
 *
 *  Plugin Parameters:
 *
 *  1.  Net Player Map ID
 *      -The Map ID the Netplayer Spawn event is located
 *
 *  2.  Net Player Event ID
 *      -The Event ID the Netplayer Spawn event is located
 */
 //=============================================================================

 Nasty.Parameters = $plugins.filter(function(p)
	 { return p.description.contains('<Online_Network_Players>');})[0].parameters;

var NetPlayerMap = Nasty.Parameters['Net Player Map ID'];
var NetPlayerEventID = Nasty.Parameters['Net Player Event ID'];
var NetPlayerNameType = Number(Nasty.Parameters['Show Username or Character Name']);
var showPlayersName = String(Nasty.Parameters['Show Name Above Players Head']);
var playerTextOptions = (Number(Nasty.Parameters['Player Text Options'])-1);
var netplayerTextOptions = (Number(Nasty.Parameters['Net Player Text Options'])-1);

var networkName = '';
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
    if (NetPlayerNameType===0){
      networkName = data.name;
    }
	});

	socket.on('NetworkPlayersXY', function(data){
    if(!SceneManager._scene._spriteset || SceneManager._scene instanceof Scene_Battle) return;
		var player = data.playerid;
    var name = data.name;
		var cx = data.x;
		var cy = data.y;
		var moveSpeed = data.moveSpeed;
		var moveFrequenzy = data.moveFrequenzy;
		var characterName = data.characterName;
		var characterIndex = data.characterIndex;

		//Make an event if net player isn't already there
		if (networkMapEvents[player]===undefined){
			var NetEvent = $gameMap.addNetworkPlayer(1, 1,name);
			networkMapEvents[player] = NetEvent;
		}
    networkMapEvents[player].namepop = name;
    networkMapEvents[player].textpop_flag = true;

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

	 socket.on('changeRoomVar', function(data){
		 currentRoom = data;
		 networkMapEvents = {};
	 });

	 socket.on('removePlayer', function(data){
     if(!SceneManager._scene._spriteset || SceneManager._scene instanceof Scene_Battle) return;
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
          if (NetPlayerNameType===1) networkName=$gameParty.leader()._name;
					//Send x,y info to server
						this.executeMove(direction);
						if (NetworkFlag){
						socket.emit('DestinationXY', {
							playerid: networkPlayerid,
							direction: direction,
              name: networkName,
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

//=================================//
//Player Refresh for Text Over Self
//=================================//
var NetPlayer_GmePlayer_refresh_alias = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function() {
  NetPlayer_GmePlayer_refresh_alias.call(this);
  if(this.namepop===undefined) return;
  if (showPlayersName==='false') return;
    if (NetPlayerNameType===1) {
      this.namepop = $gameParty.leader()._name;
    }else{
      this.namepop = networkName;
    }
    this.setTextOptions(playerTextOptions);
};

var NetPlayer_SceneBase_popScene = Scene_Base.prototype.popScene;
Scene_Base.prototype.popScene = function() {
    NetPlayer_SceneBase_popScene.call(this);
    if ($gamePlayer) $gamePlayer.refresh();
};

var NetPlayer_SceneBase_stop = Scene_Base.prototype.stop;
Scene_Base.prototype.stop = function() {
    NetPlayer_SceneBase_stop.call(this);
    if ($gamePlayer) $gamePlayer.refresh();
};

//==============================//
//Room Change When Changing Maps
//==============================//
var NetPlayer_SceneMap_Start_Alias = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	NetPlayer_SceneMap_Start_Alias.call(this);
	var mapId = $gameMap.mapId();
	if (NetworkFlag){
    //In case of menu or battle scene
		if (currentRoom !== mapId.toString()){
			socket.emit('changeRoom', mapId.toString());
		}
	}
};

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
    this._events[eId] = new Game_NetworkPlayer(this._mapId,eId,x,y, playerid);
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

Game_NetworkPlayer.prototype.initialize = function(mapId,eventId,x,y, name) {
	Game_Event.prototype.initialize.call(this,mapId,eventId);
  this._isNetworkPlayer = true;
  this.setPosition(x,y);
  if (this.namepop===undefined){
    console.log("You need Nasty_Text_Pop_Events for names to show!");
  }else{
    this.namepop = name;
    this.setTextOptions(netplayerTextOptions);
  }
};

Game_NetworkPlayer.prototype.event = function() {
    return $networkPlayerMap.events[NetPlayerEventID];
};

})();
