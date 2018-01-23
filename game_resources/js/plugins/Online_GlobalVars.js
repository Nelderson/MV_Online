//=============================================================================
// Online Global Variables
//
// Version: 0.1 - Send switch and variable data to all clients connected
//=============================================================================

(function () {
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
      console.log(data.variable, data.value);
      $gameVariables.setNetworkValue(data.variable, data.value);
    });

  };

  var Online_GlobalSwitch_setVal = Game_Switches.prototype.setValue;
  Game_Switches.prototype.setValue = function(switchId, value) {
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
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
    if (variableId > 0 && variableId < $dataSystem.variables.length) {
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
