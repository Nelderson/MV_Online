var config = require('./../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);

module.exports = function (sio) {
  //Set IO Roomspace
  var io = sio.of('/example');

  //Initialize socket
  io.on('connection', function(socket){
    socket.on('test',function(data){
	    log.info('test');
    });
  });
};
