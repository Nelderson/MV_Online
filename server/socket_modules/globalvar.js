var config = require('./../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);

module.exports = function (sio) {
  //Set IO Namespace
  var io = sio.of('/globalvar');

  //Initialize socket
  io.on('connection', function(socket){

    socket.on('switchDatatoServer',function(data){
      socket.broadcast.emit('receivedSwitch', data);
    });

    socket.on('variableDatatoServer',function(data){
      socket.broadcast.emit('receivedVariable', data);
    });

  });
};
