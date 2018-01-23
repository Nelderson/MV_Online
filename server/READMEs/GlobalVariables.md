MV Online Global Variables Documentation
==========================

Introduction
-------------

The Online Global Variables Socket Module allows you to send Variable and Switch data to other players connected.

Installation
-------------

Make sure you have the `globalvar.js` file in your `socket_modules` folder.

Add this line to the `ADD SOCKET IO MODULES HERE` section in the `server.js` file:

`var globalvar = require('./socket_modules/globalvar');`

Add this line to the `BIND SOCKET IO MODULES HERE` section in the `server.js` file:

`globalvar(io);`
