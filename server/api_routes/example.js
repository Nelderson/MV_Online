var express = require('express');
var authAPI = require('../authenticateAPI.js');
var router = express.Router();

router.use(function(req,res,next){
  authAPI(req,res,next); //Need to have a valid token for all routes
});

router.get('/testing',function(req,res){
  res.status(200).send('Dude....this is totally awesome');
});


module.exports = router;
