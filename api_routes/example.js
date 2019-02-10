var express = require('express');
var authAPI = require('../auth.js').authAPI;
var router = express.Router();


//Need to have a valid token for all routes
router.use(authAPI);

router.get('/testing',function(req,res){
  res.status(200).send('Dude....this is totally awesome');
});


module.exports = router;
