var mongoose = require("mongoose");
var express = require('express');
var authAPI = require('../auth.js').authAPI;
var router = express.Router();
var config = require('../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);

var SaveData = new mongoose.Schema({
  savefileId: {type: Number, required: true},
  savedata: {type: String, required: true}
},{ _id: false });

var Save = new mongoose.Schema({
    username: {type: String, required: true, index: { unique: true}},
    email: {type: String, required: true, index: { unique: true}},
    savedata: [SaveData],
    globaldata: {type: String, required: false}
});

var Saves = mongoose.model('Saves', Save);

//Need to have a valid token for all routes
router.use(authAPI);

router.get('/loadfromcloud', function(req, res){
  var name = req.decoded.name;
  Saves.findOne({username: name}, function(err,account){
    if (err) log.error(err);
    if (account){
      return res.status(200).send(account.savedata);
    }else{
      return res.status(400).send("No account");
    }
  });
});


router.post('/savetocloud', function(req, res){
  //Save to the database....
  var name = req.decoded.name;
  var email = req.decoded.email;
  var savedata = req.body.savedata;
  var savefileId = req.body.savefileId;

  Saves.findOne({username: name}, function(err,account){
    if (err) {
      log.error(err);
      return res.status(400).send('Account not found'); 
    }
    if (account){
      //Update save data to database
      account.savedata.push({ savefileId, savedata });

      account.save(function(err){
        if (err){
          log.error(err);
          return res.status(400).send('Error Saving files')
        }
        return res.status(200).send();
      })
    }
    else{
      //Make New Account with save data
      var newUser = new Saves({
        username: name,
        email: email,
        savedata: { savefileId, savedata },
      });
      newUser.save(function(err, data){
        if (err) log.error(err);
        return res.status(200).send();
      });
    }
  });
});

module.exports = router;
