var Config = module.exports = {
  //---------------------
  //Main Configurations
  //---------------------
  port:  process.env.PORT || 8000,

  jwtSecret: process.env.MV_JWT_SECRET || 'aeha8j4h20adn92k10nkav0sjf90sleicazvyi54j39jfqasfjk9',

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
  
  // Change null to the 'url' of your redis server: ex: 'redis://localhost'
  redisConnection: process.env.MV_REDIS_HOST_URL || null,

  //---------------------
  //Login Configurations
  //---------------------

  autoActivateAccount: process.env.MV_AUTO_ACTIVATE || false,

  //Needs to be the same as Client firstHash
  firstHash: process.env.MV_FIRST_HASH ||'d28cb767c4272d8ab91000283c67747cb2ef7cd1',

  //Mail to send activation codes from
  mailFrom: process.env.MV_MAILFROM || 'smtps://username@gmail.com:password@smtp.gmail.com',

  //Time until token expires (in minutes)
  tokenExpiresIn: process.env.MV_TOKEN_EXPIRES_MIN || 60 * 24 * 14,

  //Allows only one logged in user at a time.
  enforceOneUser: process.env.MV_ENFORCE_ONE_USER || false,

  //Temporary Password Complexity for lost Passwords
  lostPasswordComplexity: process.env.MV_LOST_PASSWORD_COMPLEXITY || 2,

  //Temporary Password Expiration in Milliseconds
  tempPasswordExpires: process.env.MV_LOST_PASSWORD_EXPIRES || 3600000, //1 hour

  //------------------------
  //Database Configurations
  //------------------------

  mongoDBconnect: process.env.MV_MONGO_URI || 'mongodb://username:password@linktomongodb.com:39504/collection'
};
