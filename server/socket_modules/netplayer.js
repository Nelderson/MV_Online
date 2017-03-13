module.exports = function (sio) {

  var io = sio.of('/netplayers');

  io.on('connection', function(socket){
	  //Decoded Token
	  var token = socket.client.request.decoded_token;

    var globalPlayers = globalPlayers || [];
    var playersInRoom = playersInRoom || {};

    //When first connected
    var id = socket.id;
    var currentRoom = '0'; //Room names are based off Map ID
    var characterName = '';
    var characterIndex = 0;

    globalPlayers.push(id);

    socket.emit('MyID', {id: id, room: currentRoom});

    playersInRoom[currentRoom] = playersInRoom[currentRoom] || [];
    playersInRoom[currentRoom].push(id);

    //For each player add an event.
    socket.on('CheckPlayers', function(data){
      var room = data;
      for (var i=0;i<playersInRoom[room].length;i++){
        socket.broadcast.to(currentRoom).emit('playersJoin', {
          id: playersInRoom[room][i],
          room: room
          }
        );
	  }
    });

    //Gather XY Position and broadcast to all other players
    socket.on('DestinationXY', function(data){
      socket.broadcast.to(currentRoom).emit('NetworkPlayersXY', data);
    });

    socket.on('changeRoom', function(data){
      playersInRoom[currentRoom].remove(id);
      socket.broadcast.to(currentRoom).emit('removePlayer',{id: id, room: currentRoom});
      socket.leave(currentRoom);
      currentRoom = data;
      playersInRoom[data] = playersInRoom[data] || [];
      playersInRoom[data].push(id);
      socket.join(data);
      socket.emit('changeRoomVar', data);
    });

    socket.on('disconnect', function(socket){
      playersInRoom[currentRoom].remove(id);
      io.in(currentRoom).emit('removePlayer',{id: id, room: currentRoom});
      globalPlayers.remove(id);
    });

    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
        };
    });
};
