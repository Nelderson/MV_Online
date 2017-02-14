MV Online Metrics Documentation
==========================

Introduction
-------------

`Metrics` allows you to store game data that you can use to project
and show trends within your game

Configuration
-------------

Add this line to the `Authentication required` section in the `server.js` file:

`app.use('/metrics',require('./api_routes/metrics'));`

The `metrics.js ` has only one configuration in the file for an anonymous flag.
This flag determines if you want the metrics to be anonymous, or the player has
to be signed into an account.
