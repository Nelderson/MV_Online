MV Online Core Documentation
==========================

Requirements
-------------
Node.js and RPGMaker MV

Installation
-------------

Deploy to Heroku here:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?template=https://github.com/Nelderson/MV_Online/tree/master)

Use `git clone` or download and unzip to the directory of your choice.

Run `npm install` to download all dependencies for the server. Use `npm install -d` for windows users

After configuring the server run `npm start` to start the server


Server Configuration
-------------

Inside the  `server/configurations/config.js` file, there are several things to configure:

`port` defines which port the server will run on (Default `8000`)

`jwtSecret` defines the secret the JWT is signed.  Please change this for security reasons in a production environment

`firstHash` is the initial hashing secret for login system.  This is the same as the client plugin first hash.  Recommended that this be changed before putting in a production environment


`mailFrom` when a user registers they recieve an email from this address.
`smtps://username@gmail.com:password@smtp.gmail.com`  (Additional steps are required if you want to use gmail.)

`mongoDBconnect` Link and credentials to MongoDB Database. `mongodb://username:password@linktomongodb.com:39504/collection`


Client Configuration (RPGMaker MV)
-------------

Add the `css` folder to the root of your project directory

Add the files in `game_resources/js/plugns` that you want for your plugins to your own `js/plugins` folder of your game. (`Online_Main_Core.js` is manditory for all other plugins)

Add the files from the `game_resources/js/libs` folder to your own `js/libs` folder

Modify your `index.html` file in your game to add this in the header:

```html
<!-- Nel Add -->
<link rel="stylesheet" type="text/css" href="./css/bootstrap3.3.5.min.css" >
<link rel="stylesheet" type="text/css" href="./css/fontawesome4.4.0.min.css" >
<link rel="stylesheet" type="text/css" href="./css/MMO.css">
<!-- Nel Add -->
```

And this in the body, dont forget the change localhost for your IP or Domain :

```html
<!-- Nel Add -->
<script type="text/javascript" src="./js/libs/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="./js/libs/jquerymobile1.4.5.min.js"></script>
<link rel="stylesheet" type="text/css" href="./css/jquerymobile1.4.5.min.css">
<script type="text/javascript" src="./js/libs/crypto.sha1.js"></script>
<script type="text/javascript" src="./js/libs/socket.io-2.2.0.js"></script>
<!-- Nel Add -->
```
