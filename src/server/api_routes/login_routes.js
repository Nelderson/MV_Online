var crypto = require('crypto');
var express = require('express');
var config = require('../configurations/mainConfig');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(config.mailFrom);
var Account = require('./LoginSchema/Account');
var jwt = require('jsonwebtoken');
var router = express.Router();


router.get('/', function (req, res) {
  res.status(203).json({});
});

router.get('/register', function(req, res) {
    res.status(403).json({});
});

router.post('/register', function(req, res) {
    //Check if email not already used
    Account.findByEmail(req.body.email, function(err, account){
        if (err) {
            return res.status(203).json({
                pageData: {
                    err : err.message
                }
            });
        }
        if (account)
            return res.status(203).json({
                pageData: {
                    err : "Email '"+account.email+"' already registered"
                }
            });

        //Create hash for activation code
        var shasum = crypto.createHash('sha1');
        shasum.update(req.body.username+req.body.email);
        actCode = shasum.digest('hex');

        //Hash the password a first time in sha1
        var shapwd = crypto.createHash('sha1').update(req.body.password + config.firstHash).digest('hex');

        Account.register(new Account({
            username : req.body.username,
            email : req.body.email,
            activated : false,
            actCode: actCode,
            socketId: null,
            rank: 0
        }), shapwd, function(err, account) {
            if (err) {
                return res.status(203).json({
                    pageData: {
                        err : err.message
                    }
                });
            }

            actUrl = config.actUrl+actCode;

            transporter.sendMail({
                from: 'Team <no-reply@myserver.com>',
                to: req.body.email,
                subject: "RPGMaker MV MMO",
                text: "Hello "+req.body.username+' and welcome to RPGMaker MV MMO!\nYour account has been registrated, but you need to activate it by following this link :\n'+actUrl+'\n\nEnjoy!\n\t-- Nelderson',
                html: "Hello "+req.body.username+' and welcome to RPGMaker MV MMO!<br>Your account has been registrated, but you need to activate it by clicking on the following link : <br><a href="'+actUrl+'">'+actUrl+'</a><br>Enjoy!<br>-- Nelderson'
            });

            return res.status(200).json({
                pageData: {
                    msg : 'An activation link has been send to your email address.'
                }
            });
        });
    });
});

router.get('/login', function(req, res) {
    res.status(203).json({});
});

router.post('/login', function(req, res){
  Account.findByName(req.body.username, function(err, account){
    if (err) {
      return res.status(203).json({
        err: err.msg
      });
    }
    if (!account) {
      return res.status(203).json({
        err: "Invalid username"
      });
    }

    var profile = {
      name: account.username,
      email: account.email,
      id: account._id,
      rank: account.rank
    };

    crypto.pbkdf2(req.body.password, account.salt, 25000, 512, 'sha256', function(err, hashRaw){
      var hpass = new Buffer(hashRaw, 'binary').toString('hex');
      if (account.hash == hpass) {
        if (!account.activated){
          return res.status(203).json({
          err: "Account Not Activated"
          });
        }
          var token = jwt.sign(profile, config.jwtSecret, { expiresIn: 60*5 });
          return res.status(200).json({token: token});
      }
      return res.status(203).json({
        err: "Invalid password"
      });
    });
  });
});


router.get('/activate/:actCode', function(req, res) {
    var actCode = req.params.actCode;

    Account.activate(actCode, function(err, account){
        if (err) {
            return res.status(203).json('activation', {
                pageData: {
                    err: err.message
                }
            });
        }
        if (!account) {
            return res.status(203).json('activation', {
                pageData: {
                    err: "Can't activate account : Unknown token '<b>"+actCode+"</b>'."
                }
            });
        }
        return res.status(200).json('activation');
    });
});

module.exports = router;
