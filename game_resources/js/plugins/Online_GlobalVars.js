//=============================================================================
// Online Global Variables and Switches
// Version: 0.2 - Add parameters for non global switches and variables
// Version: 0.1 - Send switch and variable data to all clients connected
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc Send switch and variable data to others.
 *<Online_GlobalVars>
 * @author Nelderson
 *
 * @param Global Switch Threshold
 * @desc Any switch below this number will be global.
 * @default 100
 *
 * @param Global Variable Threshold
 * @desc Any variable below this number will be global.
 * @default 100
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 * This plugin allows you to send variable and switch data to others in
 * the same server/room.
 *
 * There are 2 basic configurations:
 *
 * Global Switch Threshold and Global Variable Threshold
 *
 * These allow you to define where global variables/switches
 * end and where normal variables/switches happen
 *
 * Ex. Global Switch Threshold of 100
 *
 * Anything below and including 100 is a global switch,
 * and anything above is a normal switch
 *
 */
 //=============================================================================

(function () {

  var GlobalVar_PParameters = $plugins.filter(function(p)
     { return p.description.contains('<Online_GlobalVars>');})[0].parameters;

  var switchThreshold = Number(GlobalVar_PParameters['Global Switch Threshold']);
  var variableThreshold = Number(GlobalVar_PParameters['Global Variable Threshold']);
  var socket=null;

  var OnlineMV_GlobalVars_SocketConn_Alias = Game_Network.prototype.connectSocketsAfterLogin;
  Game_Network.prototype.connectSocketsAfterLogin = function(){
    OnlineMV_GlobalVars_SocketConn_Alias.call(this);
    $gameNetwork.connectSocket('globalvar','/globalvar');
    //Emitters and Listeners
    //emit/broadcast and on
    socket = $gameNetwork._socket.globalvar;

    socket.on('receivedSwitch', function(data){
      //Do something with received data
      $gameSwitches.setNetworkValue(data.switch, data.value);
    });

    socket.on('receivedVariable', function(data){
      //Do something with received data
      $gameVariables.setNetworkValue(data.variable, data.value);
    });

  };

  var Online_GlobalSwitch_setVal = Game_Switches.prototype.setValue;
  Game_Switches.prototype.setValue = function(switchId, value) {
    if (switchId>0 && switchId<$dataSystem.switches.length && switchId<=switchThreshold) {
      //Send data to server!
      socket.emit('switchDatatoServer',{
        switch: switchId,
        value: value
      });
    }
    Online_GlobalSwitch_setVal.call(this,switchId, value);
  };

  Game_Switches.prototype.setNetworkValue = function(switchId, value) {
      if (switchId > 0 && switchId < $dataSystem.switches.length) {
          this._data[switchId] = value;
          this.onChange();
      }
  };

  var Online_GlobalVariable_setVal = Game_Variables.prototype.setValue;
  Game_Variables.prototype.setValue = function(variableId, value) {
    if (variableId>0 && variableId<$dataSystem.variables.length && variableId<=variableThreshold) {
      socket.emit('variableDatatoServer',{
        variable: variableId,
        value: value
      });
    }
    Online_GlobalVariable_setVal.call(this, variableId, value);
  };

  Game_Variables.prototype.setNetworkValue = function(variableId, value) {
      if (variableId > 0 && variableId < $dataSystem.variables.length) {
          if (typeof value === 'number') {
              value = Math.floor(value);
          }
          this._data[variableId] = value;
          this.onChange();
      }
  };

})();
