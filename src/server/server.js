var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var logger = require('morgan'); //For development
var socketioJwt = require('socketio-jwt');

var config = require('./configurations/mainConfig');
var log = require('tracer').colorConsole(config.loggingConfig);

app.use(logger('dev'));//For development
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

server.listen(config.port);
log.info('Server is on bruh and running on port: ' + config.port);

//----------------------------------
// SET ROUTES FOR EXPRESS API HERE:
//----------------------------------

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// No Authentication required:
app.use('/', require('./api_routes/login_routes'));

// Authentication required:
app.use('/example', require('./api_routes/example.js'));

//Static Server - Used to serve static files (HTNL,PNG,etc.)
app.use('/static', express.static('public'));

//Pre Socket Processes Here (Mostly for Database connections)
var loginDBConnection = require('./api_routes/loginDBConnection')();

//Authorize socket connection with token from login
io.set('authorization', socketioJwt.authorize({
  secret: config.jwtSecret,
  handshake: true
}));

//When first connected to Socket.io
io.on('connection', function (socket) {
  io.clients(function (error, clients) {
    if (error) throw error;
    log.info("There are " + clients.length + " players connected");
  });
});

var modules = require('require-all')({
  dirname: __dirname + '/socket_modules',
  resolve: function (SocketModules) {
    return new SocketModules(io);
  }
});