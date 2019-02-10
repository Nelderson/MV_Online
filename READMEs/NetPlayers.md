MV Net Players Documentation
==========================

Introduction
-------------

The Online Net Players Socket Module allows you to see other players on the same map

Installation
-------------

Make sure you have the `netplayer.js` file in your `socket_modules` folder.

Add this line to the `ADD SOCKET IO MODULES HERE` section in the `server.js` file:

`var netplayers = require('./socket_modules/netplayer');`

Add this line to the `BIND SOCKET IO MODULES HERE` section in the `server.js` file:

`netplayers(io);`
