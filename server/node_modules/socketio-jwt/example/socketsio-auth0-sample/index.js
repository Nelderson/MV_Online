var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketioJwt = require('socketio-jwt');
var dotenv = require('dotenv');

dotenv.load();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
};
var port = process.env.PORT || 3001;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

io
	.on('connection', socketioJwt.authorize({
		secret: Buffer(JSON.stringify(process.env.AUTH0_CLIENT_SECRET), 'base64'),
		timeout: 15000 // 15 seconds to send the authentication message
	}))
	.on('authenticated', function(socket){
		console.log('connected & authenticated: ' + JSON.stringify(socket.decoded_token));
		socket.on('chat message', function(msg){
			debugger;
			io.emit('chat message', msg);
		});
	});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', { env: env });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

