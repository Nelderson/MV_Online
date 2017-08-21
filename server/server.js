//=============================================================================
// Nelderson's Online Core Server
// Version: 0.2.1 - August 3rd, 2017
//=============================================================================
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./configurations/config');
var bodyParser = require('body-parser');
var logger = require('morgan'); //For development
var socketioJwt = require('socketio-jwt');
var log = require('tracer').colorConsole(config.loggingConfig);

app.use(logger('dev'));//For development
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

server.listen(config.port);
log.info('Server is on bruh and running on port: '+ config.port);

//----------------------------------
// Cors Domain
//----------------------------------
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
    if (req.method === "OPTIONS") 
        res.send(200);
    else 
        next();
}

//----------------------------------
// SET ROUTES FOR EXPRESS API HERE:
//----------------------------------

//Allow Cors

app.use(allowCrossDomain);

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
  io.clients(function(error, clients){
    if (error) throw error;
    log.info("There are " + clients.length + " players connected");
  });
});

//----------------------------------
// BIND SOCKET IO MODULES HERE:
//----------------------------------
exampleSocket(io);
