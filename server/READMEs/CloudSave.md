MV Cloud Save Documentation
==========================

Introduction
-------------

`Cloud Save` allows you to store game data that you can use to project and show trends within your game

Configuration
-------------

Add this line to the `Authentication required` section in the `server.js` file:

`app.use('/cloudsave',require('./api_routes/cloudsave.js'));`
