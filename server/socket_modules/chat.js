var chatConfig = require('./../configurations/chat');
var config = require('./../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);

module.exports = function (sio) {
	var io = sio.of('/chat');

	io.on('connection', function(socket) {
		//Decoded Token
		var token = socket.client.request.decoded_token;
		var username = token.name;

		socket.on('clientMessage',function(data) {
			data.id = username;
			io.emit('messageServer',data);

			if (chatConfig.enableLogging)
				log.info(username + ': ' + data.message);
		});
	});
};
