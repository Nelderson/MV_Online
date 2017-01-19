var Global = module.exports = {
    globalPlayers: [],
    playersInRoom: {},
    addUser: function(id){
        Global.globalPlayers.push(id);
        console.log('There are '+Global.globalPlayers.length+' players connected');
    },
    removeUser: function(id) {
        Global.removeUserFromArray(id);
    },
    removeUserFromArray: function(id){
      for(var i = Global.globalPlayers.length - 1; i >= 0; i--) {
          if(Global.globalPlayers[i] === id) {
             Global.globalPlayers.splice(i, 1);
          }
      }
    }
};
