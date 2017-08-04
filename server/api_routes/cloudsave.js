var mongoose = require("mongoose");
var express = require('express');
var authAPI = require('../authenticateAPI.js');
var router = express.Router();
var config = require('../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);

var Save = new mongoose.Schema({
    username: {type: String, required: true, index: { unique: true}},
    email: {type: String, required: true, index: { unique: true}},
    savedata: {type: String, required: true},
    globaldata: {type: String, required: false}
});

var Saves = mongoose.model('Saves', Save);

router.use(function(req,res,next){
  authAPI(req,res,next); //Need to have a valid token for all routes
});

router.get('/loadfromcloud', function(req, res){
  var name = req.decoded.name;
  Saves.findOne({username: name}, function(err,account){
    if (err) log.error(err);
    if (account){
      return res.status(200).send(account.savedata);
    }else{
      return res.status(200).send("No account");
    }
  });
});


router.post('/savetocloud', function(req, res){
  //Save to the database....
  var name = req.decoded.name;
  var email = req.decoded.email;
  var savedata = req.body.savedata;
  Saves.findOne({username: name}, function(err,account){
    if (err) log.error(err);
    if (account){
      //Update save data to database
        Saves.findOneAndUpdate({username: name}, {$set: {savedata:savedata}},function(err,data1){
          if (err) log.error(err);
          return res.status(200).send();
        });
    }else{
      //Make New Account with save data
      var newUser = new Saves({
        username: name,
        email: email,
        savedata: savedata,
      });
      newUser.save(function(err,data){
        if (err) log.error(err);
        return res.status(200).send();
      });
    }
  });
});

module.exports = router;
