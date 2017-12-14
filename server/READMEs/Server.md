
MV_online Server config.js
==========================

Introduction
-------------
Who to config servers.js 

1. Variable call

its variable called on header on servers.js

2. Router

setting router for your api add line of API your desire.
you can add save system here !

exemple 
app.use('/cloudsave',require('./api_routes/cloudsave.js'));


3. Module Socket

you can add here module socket net player for online your install module socket you need install bind socket

var netplayers = require('./socket_modules/netplayer');


4. Bind socket

here install bind socket for online 

netplayers(io);








Exemple config Server.js
==========================
```
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./configurations/config');
var bodyParser = require('body-parser');
var logger = require('morgan'); //For development
var socketioJwt = require('socketio-jwt');
var log = require('tracer').colorConsole(config.loggingConfig);
var loggedInUsers = {};

app.use(logger('dev'));//For development
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

server.listen(config.port);
log.info('Server is on bruh and running on port: '+ config.port);
```

 SET ROUTES FOR EXPRESS API HERE: 
==========================
```
// No Authentication required:
app.use('/',require('./api_routes/login_routes'));

// add cloudsave here
app.use('/cloudsave',require('./api_routes/cloudsave.js'));

// Authentication required:
app.use('/example',require('./api_routes/example.js'));

//Static Server - Used to serve static files (HTNL,PNG,etc.)
app.use('/static', express.static('public'));
```
 ADD SOCKET IO MODULES HERE:
==========================
```
var exampleSocket = require('./socket_modules/exampleSocket');

//add socket online here 
var netplayers = require('./socket_modules/netplayer');

//Pre Socket Processes Here (Mostly for Database connections)
var loginDBConnection = require('./api_routes/loginDBConnection')();

//Authorize socket connection with token from login
io.set('authorization', socketioJwt.authorize({
  secret: config.jwtSecret,
  handshake: true
}));

//When first connected to Socket.io
io.on('connection', function(socket){

  if(config.enforceOneUser){
    var username = socket.client.request.decoded_token.name;
    if (loggedInUsers[username]){
      socket.to(loggedInUsers[username]).emit('firstShutDown',{});
      socket.emit('secondShutDown',{});
      io.of('/').connected[loggedInUsers[username]].disconnect(true);
      socket.disconnect(true);
    }else{
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
```
 BIND SOCKET IO MODULES HERE:
==========================
```
exampleSocket(io);

// add your socket here

netplayers(io);
```





