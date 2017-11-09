/*
Online Cloud Save v.0.1.1

Take data from one source and be able to load it on other devices

Sign in > Check the Database > Have data? > Load from database
                                      No > New Game

*/
(function() {

  var CloudSave_StorageManager_save_alias = StorageManager.save;
  StorageManager.save = function(savefileId, json) {
    if (savefileId>0){
      var data = LZString.compressToBase64(json);
      $.post($gameNetwork._serverURL+'/cloudsave/savetocloud', {savedata: data});
    }
  };

  //Overwrite Save Command in Menu
  Scene_Menu.prototype.commandSave = function() {
      DataManager.saveGameWithoutRescue(2);
      this._commandWindow.processCancel();
  };

  DataManager.loadGameWithoutRescue = function(savefileId) {
    if (savefileId >0){
      var globalInfo = this.loadGlobalInfo();
      var json = StorageManager.load(savefileId);
      return true;
    }
  };

  StorageManager.load = function(savefileId) {
    if (savefileId>0){
    $.get($gameNetwork._serverURL+'/cloudsave/loadfromcloud', function(data){
      if (data==="No account") return; //Loads new game if no data
       var json = LZString.decompressFromBase64(data);
       DataManager.createGameObjects();
       DataManager.extractSaveContents(JsonEx.parse(json));
    }).fail(function(){
      window.alert("Cloudsave Failed!");
    });
    }
  };

  var CloudSave_GameNetwork_ConnectafterLogin = Game_Network.prototype.connectSocketsAfterLogin;
  Game_Network.prototype.connectSocketsAfterLogin = function(socket) {
    CloudSave_GameNetwork_ConnectafterLogin.call(this,socket);
    //Set header so that token is passed correctly to the server
    $.ajaxSetup({
      headers: {
        'x-access-token': $gameNetwork._token
      }
    });
    DataManager.loadGameWithoutRescue(2);
  };
})();
