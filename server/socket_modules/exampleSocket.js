module.exports = function (socket, io) {

    socket.emit('testToClient', {test: 'This is awesome!!!!'});

    socket.on('testFromClient', function(data){
      console.log(data);
    });
};
