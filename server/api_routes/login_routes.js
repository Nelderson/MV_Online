var crypto = require('crypto');
var express = require('express');
var config = require('../configurations/config');
var log = require('tracer').colorConsole(config.loggingConfig);
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
            },function(err,info){
              if (err){
                log.error(err);
              }else{
                log.info(info);
              }
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

    //Check for lost password flag and temp password
     if (account.lostPasswordFlag===true){
      var tempPasswordHash = crypto.createHash('sha1').update(account.lostPasswordTemp + config.firstHash).digest('hex');
      if (tempPasswordHash===req.body.password){
        //Check lostPasswordExpires
        if (Date.now() > account.lostPasswordExpires){
          return res.status(203).json({
            err: "Temporary Password is Expired!"
          });
        }
        return res.status(200).json({
          temp:tempPasswordHash,
          name:account.username
         });
        }
       }

    //Check for normal password
    crypto.pbkdf2(req.body.password, account.salt, 25000, 512, 'sha256', function(err, hashRaw){
      var hpass = new Buffer(hashRaw, 'binary').toString('hex');
      if (account.hash == hpass) {
        if (!account.activated){
          return res.status(203).json({
          err: "Account Not Activated"
          });
        }
          var token = jwt.sign(profile, config.jwtSecret, { expiresIn: 60*config.tokenExpiresIn});
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

router.post('/lostpassword', function(req, res){
  var randomPass=crypto.randomBytes(config.lostPasswordComplexity).toString('hex');
  Account.findOneAndUpdate({email:req.body.email},
    {lostPasswordFlag:true,lostPasswordTemp:randomPass,lostPasswordExpires:Date.now() + config.tempPasswordExpires},
    function(err, account){
    if (!account.activated){
      return res.status(203).json({
      err: "Account Not Activated"
      });
    }
    if (err) {
      return res.status(203).json({
        err: err.msg
      });
    }
    if (!account) {
      return res.status(203).json({
        err: "Email not found"
      });
    }

    // Send Email with random temporary password
    transporter.sendMail({
        from: 'Team <no-reply@myserver.com>',
        to: account.email,
        subject: "RPGMaker MV MMO",
        text: "Hello "+account.username+' \nyour temporary account password is: '+randomPass,
        html: "Hello "+account.username+' \nyour temporary account password is: '+randomPass,
    },function(err,info){
      if (err){
        log.error(err);
      }else{
        log.info(info);
      }
    });
    return res.status(200).json({});
  });
});

router.post('/resetpassword', function(req, res){
  Account.findByName(req.body.tempName, function(err,account){
    if (err){
      return res.status(203).json({
        err: err.msg
        });
    }
    if (!account) {
      return res.status(203).json({
        err: "Error Occured (Account Not Found)"
      });
    }
    if (!account.lostPasswordFlag){
      return res.status(203).json({
        err: "Please go through the password reset process the normal way...."
      });
    }

    var tempPasswordHash = crypto.createHash('sha1').update(account.lostPasswordTemp + config.firstHash).digest('hex');
    if (req.body.tempHash!==tempPasswordHash){
      return res.status(203).json({
        err: "Please go through the password reset process the normal way...."
      });
    }

    if (Date.now() > account.lostPasswordExpires){
      return res.status(203).json({
        err: "Temporary Password is Expired!"
      });
    }

    account.setPassword(req.body.password, function(err,data){
      if (err){
        return res.status(203).json({
          err: err.message
        });
      }
      if (data){
        account.lostPasswordFlag = false;
        account.save().then(function(error,data){
          if (err) log.error(err);
          return res.status(200).json({});
        });
      }
    });
  });
});

module.exports = router;
