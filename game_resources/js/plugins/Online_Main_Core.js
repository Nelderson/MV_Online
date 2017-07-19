var Imported = Imported || {};
Imported.Online_Main_Core = true;
//=============================================================================
// Online Main Core
// Version: 1.1.1
//=============================================================================

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

 var $gameNetwork = null;

 var Nel_Online_Core_dataCreateGameObj =  DataManager.createGameObjects;
 DataManager.createGameObjects = function() {
    Nel_Online_Core_dataCreateGameObj.call(this);
    //Keep gameNetwork the same for New Game to keep login info
    $gameNetwork = $gameNetwork || new Game_Network();
 };

 var Nel_MainCore_Online_PluginOpt = $plugins.filter(function(p)
    { return p.description.contains('<Online_Main_Core>');})[0].parameters;

function Game_Network() {
    this.initialize.apply(this, arguments);
}

Game_Network.prototype.initialize = function() {
    this._serverURL = String(Nel_MainCore_Online_PluginOpt['Server URL']);
    this._firstHash = String(Nel_MainCore_Online_PluginOpt['First Hash']);
    this._socket = {};
    this._token =0;
};

Game_Network.prototype.decodedJWT = function(){
  if ($gameNetwork._token===0) return false;
  var b64 =  $gameNetwork._token;
  var body = b64.match(/[.](\S+)[.]/);
  var buf = new Buffer(body[0], 'base64').toString("ascii");
  var obj = JSON.parse(buf);
  return obj;
};

Game_Network.prototype.connectSocketsAfterLogin = function(socket) {
  //This runs right after logging in.
  //Alias your own socket events
  //(Similar to how you would add plugin commands)
};


Game_Network.prototype.connectSocket = function(socket_name, namespace) {
  var url = this._serverURL;
  this._socket[socket_name] = io.connect(url+namespace, {
    query: 'token=' + $gameNetwork._token
  });
  var socket = this._socket[socket_name];
  socket.on('connect', function () {
    //Pass token on all POST/GET requests in the header
    $.ajaxSetup({
      headers: {
        'x-access-token': $gameNetwork._token
      }
    });
    console.log('Socket Authenticated');
  });
  socket.on('disconnect', function () {
    console.log('Socket Disconnected');
  });
};
