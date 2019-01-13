//Version: 0.1.2 - Added MyID call to pass client username
//Version: 0.1.1 - Cleanup of profanity filter.

var chatConfig = require('./../configurations/chat');
var config = require('./../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);
var swearjar = require('swearjar');
var auth = require('../auth.js');

module.exports = function (sio) {
	var io = sio.of('/chat');
	io.use(auth.authSocket)

	io.on('connection', function(socket) {
		//Decoded Token
		var token = socket.user;
		var username = token.name;

		socket.emit('MyID', {name: username});

		socket.on('clientMessage',function(data) {
			if (chatConfig.profanityFilter){
				data.message = swearjar.censor(data.message);
			}

			io.emit('messageServer',data);

			if (chatConfig.enableLogging){
				log.info(username + ': ' + data.message);
			 }
		});
	});
};
