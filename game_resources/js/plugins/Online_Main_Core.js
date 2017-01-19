(function () {
//=============================================================================
// Online Main Core
// Version: 1.0.0
//=============================================================================
var Imported = Imported || {};
Imported.Online_Main_Core = true;

var Nasty = Nasty || {};
//=============================================================================
 /*:
 * @plugindesc Connect to a server with Socket.io!
 *<Online_Main_Core>
 * @author Nelderson
 *
 * @param Server URL
 * @desc API/Socket.io server location
 * @default http://localhost:8000
 *
 * @param First Hash
 * @desc Same as the server firstHash config
 * @default d28cb767c4272d8ab91000283c67747cb2ef7cd1
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 * This entire core just points and connects to your api/sockets!
 *
 */
 //=============================================================================

 var Nel_Online_Core_dataCreateGameObj =  DataManager.createGameObjects;
 DataManager.createGameObjects = function() {
    Nel_Online_Core_dataCreateGameObj.call(this);
    $gameNetwork = new Game_Network();
 };

 Nasty.Parameters = $plugins.filter(function(p)
    { return p.description.contains('<Online_Main_Core>');})[0].parameters;

function Game_Network() {
    this.initialize.apply(this, arguments);
}

Game_Network.prototype.initialize = function() {
    this._serverURL = String(Nasty.Parameters['Server URL']);
    this._firstHash = String(Nasty.Parameters['First Hash']);
    this._connectedToSocket = false;
    this._socket = {};
    this._token =0;
};

Game_Network.prototype.bindSocketEvents = function(socket) {
  //Alias your own socket events (Similar to how you would add plugin commands)
};


Game_Network.prototype.connectSocket = function() {
  this._socket = io.connect((String(Nasty.Parameters['Server URL'])), {
    query: 'token=' + $gameNetwork._token
  });
  var socket = this._socket;
  socket.on('connect', function () {
    //Pass token on all POST/GET requests in the header
    $.ajaxSetup({
      headers: {
        'x-access-token': $gameNetwork._token
      }
    });
    $gameNetwork._connectedToSocket = true;
    $gameNetwork.bindSocketEvents(socket);
    console.log('Socket Authenticated');
  });
  socket.on('disconnect', function () {
    console.log('Socket Disconnected');
  });
};

})();
