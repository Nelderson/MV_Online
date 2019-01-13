var Config = module.exports = {
  //---------------------
  //Main Configurations
  //---------------------
  port: 8000,

  jwtSecret: 'aeha8j4h20adn92k10nkav0sjf90sleicazvyi54j39jfqasfjk9',

  loggingConfig: {
    format : [
              "{{timestamp}} <{{title}}> {{message}}", //default format
              {
                error : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}" // error format
              }
    ],
    dateformat : "HH:MM:ss.L",
    preprocess :  function(data){
      data.title = data.title.toUpperCase();
    },
    level: 'debug'
  },

  //---------------------
  //Login Configurations
  //---------------------

  //Needs to be the same as Client firstHash
  firstHash: 'd28cb767c4272d8ab91000283c67747cb2ef7cd1',

  //Mail to send activation codes from
  mailFrom: process.env.MV_MAILFROM || 'smtps://username@gmail.com:password@smtp.gmail.com',

  //Activation API Location
  actUrl: 'http://localhost:8000/activate/',

  //Time until token expires (in minutes)
  tokenExpiresIn: 60 * 24 * 14,

  //Allows only one logged in user at a time.
  enforceOneUser: false,

  //Temporary Password Complexity for lost Passwords
  lostPasswordComplexity: 2,

  //Temporary Password Expiration in Milliseconds
  tempPasswordExpires: 3600000, //1 hour

  //------------------------
  //Database Configurations
  //------------------------

  mongoDBconnect: process.env.MV_MONGO || 'mongodb://username:password@linktomongodb.com:39504/collection'
};
