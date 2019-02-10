//----------------------------------
// Require file & Router :
//----------------------------------
var config = require('./../configurations/cors');
var server = require('../server');
var express = require('express');
var router = express.Router();

//----------------------------------
// Var Config :
//----------------------------------
var MyCorsHost = 'OriginDomain'
var MyMethods = 'MethodsCors'
var MyHeader = 'HeaderCors'
var AllowCrossDomain = 'CrossDomain'

//----------------------------------
// Allow Cors Domain:
//----------------------------------



var CrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'OriginDomain');
    res.header('Access-Control-Allow-Methods', 'MethodsCors');
    res.header('Access-Control-Allow-Headers', 'HeaderCors');
    if (req.method === "OPTIONS") 
        res.send(200);
    else 
        next();
}


module.exports = router;
