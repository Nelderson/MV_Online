//=============================================================================
// Nelderson's Online Core Server
// Version: 0.2.2 - Added abilty to limit users to one login.
// Version: 0.2.1
//=============================================================================
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io')(server);
var sticky = require('sticky-session');
var config = require('./configurations/config');
var bodyParser = require('body-parser');
var logger = require('morgan'); //For development
var log = require('tracer').colorConsole(config.loggingConfig);
var loggedInUsers = {};

//Database Connction
require('./api_routes/loginDBConnection')();

var auth = require('./auth.js');

const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter(config.redisConnection));

app.use(logger('dev'));//For development
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});


if (!sticky.listen(server, config.port, {workers: process.env.MV_WORKER_COUNT || null})) {
  // Master code
  server.once('listening', function() {
    log.info('Master Server started on port: '+ config.port);
  });
} 
else {
  // Worker code
  

  log.info('Worker is on bruh and running on port: '+ config.port);

  //----------------------------------
  // SET ROUTES FOR EXPRESS API HERE:
  //----------------------------------

  // No Authentication required:
  app.use('/',require('./api_routes/login_routes'));
  app.use('/metrics',require('./api_routes/metrics'));

  // Authentication required:
  app.use('/cloudsave',require('./api_routes/cloudsave.js'));

  //Static Server - Used to serve static files (HTNL,PNG,etc.)
  app.use('/static', express.static('public'));
  //----------------------------------
  // ADD SOCKET IO MODULES HERE:
  //----------------------------------
  // var exampleSocket = require('./socket_modules/exampleSocket');
  var netplayers = require('./socket_modules/netplayer');
  var chat = require('./socket_modules/chat');
  var globalvar = require('./socket_modules/globalvar');

  //Authorize socket connection with token from login
  io.use(auth.authSocket)

  //When first connected to Socket.io
  io.on('connection', function(socket){

    if(config.enforceOneUser){
      var username = socket.user.name;
      if (loggedInUsers[username]){
        socket.to(loggedInUsers[username]).emit('firstShutDown',{});
        socket.emit('secondShutDown',{});
        io.of('/').connected[loggedInUsers[username]].disconnect(true);
        socket.disconnect(true);
      }
      else {
        loggedInUsers[username] = socket.id;
      }
    }

    io.clients(function(error, clients){
      if (error) throw error;
      log.info("There are " + clients.length + " players connected");
    });

    socket.on('disconnect',function(data){
      loggedInUsers[username] = null;
    });
  });

  //----------------------------------
  // BIND SOCKET IO MODULES HERE:
  //----------------------------------
  // exampleSocket(io);
  netplayers(io);
  chat(io);
  globalvar(io);

} // <---Don't delete
