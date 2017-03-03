//=============================================================================
// Nel's Online Core Server
// Version: 0.0.4 - March 2nd, 2017
//=============================================================================
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./configurations/config');
var bodyParser = require('body-parser');
var logger = require('morgan'); //For development
var socketioJwt = require('socketio-jwt');
var gPlayers = require('./global'); //Players array stored in memory


app.use(logger('dev'));//For development
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

server.listen(config.port);
console.log('Server is on bruh and running on port: '+config.port);

//----------------------------------
// SET ROUTES FOR EXPRESS API HERE:
//----------------------------------

// No Authentication required:
app.use('/',require('./api_routes/login_routes'));

// Authentication required:
app.use('/example',require('./api_routes/example.js'));

//Static Server - Used to serve static files (HTNL,PNG,etc.)
app.use('/static', express.static('public'));

//----------------------------------
// ADD SOCKET IO MODULES HERE:
//----------------------------------
var exampleSocket = require('./socket_modules/exampleSocket');

//Pre Socket Processes Here (Mostly for Database connections)
var loginDBConnection = require('./api_routes/loginDBConnection')();

//Authorize socket connection with token from login
io.set('authorization', socketioJwt.authorize({
  secret: config.jwtSecret,
  handshake: true
}));

//When first connected to Socket.io
io.on('connection', function(socket){
  //ID needs to be locally stored to avoid scope issues
  var socket_id = socket.id;
  //Add player to Players array
  gPlayers.addUser(socket_id);

  //----------------------------------
  // BIND SOCKET IO MODULES HERE:
  //----------------------------------
  exampleSocket(socket, io);


  socket.on('disconnect', function(socket){
    gPlayers.removeUser(socket_id);
  });
});
