// Version: 0.1.0 - Cleanup of initial Version
var auth = require('../auth.js');

module.exports = function (sio) {

  var io = sio.of('/netplayers');

  io.use(auth.authSocket)


  io.on('connection', function(socket){
    var token = socket.user
    var username = token.name;
    var id = socket.id;
    var currentRoom = '0'; //Room names are based off Map ID

    socket.emit('MyID', {id: id, room: currentRoom, name: username});

    //Gather XY Position and broadcast to all other players
    socket.on('DestinationXY', function(data){
      socket.broadcast.to(currentRoom).emit('NetworkPlayersXY', data);
    });

    socket.on('changeRoom', function(data){
      socket.broadcast.to(currentRoom).emit('removePlayer',{id: id, room: currentRoom});
      socket.leave(currentRoom);
      currentRoom = data;
      socket.join(data);
      socket.emit('changeRoomVar', data);
    });

    socket.on('disconnect', function(socket){
      io.in(currentRoom).emit('removePlayer',{id: id, room: currentRoom});
    });
  });
};
