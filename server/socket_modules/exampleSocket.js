module.exports = function (sio) {
  //Set IO Roomspace
  var io = sio.of('/example');

  //Initialize socket
  io.on('connection', function(socket){
    socket.on('test',function(data){
	    console.log('test');
    });
  });
};
