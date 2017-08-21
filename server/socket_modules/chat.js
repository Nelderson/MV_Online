var chatConfig = require('./../configurations/chat');
var config = require('./../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);
var swearjar = require('swearjar');

module.exports = function (sio) {
	var io = sio.of('/chat');

	io.on('connection', function(socket) {
		//Decoded Token
		var token = socket.client.request.decoded_token;
		var username = token.name;

		socket.on('clientMessage',function(data) {
			data.id = username;
			if (config.profanityFilter){
				data.message = swearjar.censor(data.message);
			}

			io.emit('messageServer',data);

			if (config.enableLogging){
				log.info(username + ': ' + data.message);
			}			
		});
	});
};
