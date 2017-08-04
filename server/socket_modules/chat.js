var config = require('./../configurations/chat');
var swearjar = require('swearjar');

module.exports = function (sio) {
	var io = sio.of('/chat');

	io.on('connection', function(socket) {
		//Decoded Token
		var token = socket.client.request.decoded_token;
		var username = token.name;

		socket.on('clientMessage',function(data) {
			data.id = username;
			if (data.profanity){
				data.message = swearjar.censor(data.message);
			}

			io.emit('messageServer',data);

			if (config.enableLogging){
				console.log(username + ': ' + data.message);
			}			
		});
	});
};
