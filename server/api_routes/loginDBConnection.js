module.exports = function(){
  var config = require('../configurations/config');
  var mongoose = require('mongoose');
  //Mongo DB Database Connection
  mongoose.connect(config.mongoDBconnect, function(err) {
      if (err) {
        console.log(err);
      }
    });
};
