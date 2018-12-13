var express = require('express');
var authAPI = require('../auth.js').authAPI;
var router = express.Router();

router.use(function(req,res,next){
  if (req.session){
    console.log('HERRRRE', req.session);
    next();
  }
  else {
    return res.status(403).send('Nope');
  }
  // authAPI(req,res,next); //Need to have a valid token for all routes
});

router.get('/testing',function(req,res){
  req.session.user = 'Testing sessions out!'
  req.session.save(function(err) {
    console.log('SESSSION SAVED', req.session, req.sessionID);
  })
  res.status(200).send('Dude....this is totally awesome');
});


module.exports = router;
