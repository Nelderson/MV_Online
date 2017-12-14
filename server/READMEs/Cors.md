MV_Online Cors Documentation
==========================

Introduction
-------------

`api_routes/Cors.js` allows you to your server cors cross domain
`configurations/Cors.js` Configuration your cors domain

Configuration in servers.js
-------------

Add this line to the `API SECTION` section in the `server.js` file:

`app.use('AllowCrossDomain',require('./api_routes/cors'));`

Configuration in server/configurations/cors.js
-------------

MyCorsHost = '*' for allowed all url to connect to your servers,
for juste only your url on your server juste got your domain.

Exemple : MyCorsHost: 'mydomain.com',

MyMethods: 'GET,PUT,POST', allowed method get put post for server,
dont give acces to DEL can open to delete files on servers.

Exemple : MyMethods: 'GET,PUT,POST,DEL', = VERY NOT RECOMMANDED !!!

MyHeader: its header controles by servers for browsers
exemple on this project use X-Acces-Token
if you have new header on project you can add here

Exemple : MyHeader: 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content->Range,Range, X-Acces-Token, Accept-Type, MyNewHeaderHere'

Config Default
-------------
```
*  MyCorsHost: '*',
*  MyMethods: 'GET,PUT,POST',
*  MyHeader: 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range, X-Acces-Token, Accept-Type'
```
