MV Online Chat Documentation
==========================

Introduction
-------------

The Online Chat Socket Module allows you to communicate with other players in your game using an in game chat window.

Installation
-------------

Make sure you have the `chat.js` file in your `socket_modules` folder.

Add this line to the `ADD SOCKET IO MODULES HERE` section in the `server.js` file:

`var chat = require('./socket_modules/chat');`

Add this line to the `BIND SOCKET IO MODULES HERE` section in the `server.js` file:

`chat(io);`
