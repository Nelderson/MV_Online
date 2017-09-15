var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var authAPI = require('../authenticateAPI.js');
var router = express.Router();
var config = require('../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);

//============Config Section=============//
//Set this the same as client anonymous flag
var anonymous = true;
//======================================//

 if (!anonymous){
  var Metric = new Schema({
      username: {type: String, required: true, index: { unique: true}},
      email: {type: String, required: true, index: { unique: true}},
      data: [{body: [], date: Date }],
  });
}else{
  var Metric = new Schema({
      data: [{body: [], date: Date }],
  });
}

var Metrics = mongoose.model('Metrics', Metric);

if (!anonymous){
  router.use(function(req,res,next){
    authAPI(req,res,next);
  });
}

router.post('/datadump', function(req, res) {
  var name, email;
  var id  = req.body.id;
  if (!anonymous){
    name = req.decoded.name;
    email = req.decoded.email;
  }
  var data = {
    body: [req.body],
    date: Date.now()
  };


if (!anonymous){
  Metrics.findOne({username: name}, 'username', function(err,account){
    if (account){
      //Metrics collection started
      Metrics.findOneAndUpdate({username: name}, {$push: {data:data}},function(err,data1){
        if (err) log.error(err);
        return res.status(200).send('Done');
      });
    }else{
      //Metrics collection NOT started
      var newUser = new Metrics({
        username: name,
        email: email,
        data: [data]
      });
      newUser.save(function(err,data){
        if (err) log.error(err);
        return res.status(200).send('Done');
      });
    }
  });
}else{
  //Anonymous Metrics
  Metrics.findOne({_id: id}, function(err,account){
    if (account){
      //Metrics collection started
      Metrics.findOneAndUpdate({_id: id}, {$push: {data:data}},function(err,data1){
        if (err) log.error(err);
        return res.status(200).send(id);
      });
    }else{
      //Metrics collection NOT started
      var newUser = new Metrics({
        username: 'null',
        email: 'null',
        data: [data]
      });
      newUser.save(function(err,data){
        var uid = newUser._id;
        if (err) log.error(err);
        return res.status(200).send(uid);
      });
    }
  });
}
});

module.exports = router;
