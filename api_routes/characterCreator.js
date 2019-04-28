const mongoose = require("mongoose");
const express = require('express');
const authAPI = require('../auth.js').authAPI;
const router = express.Router();
const config = require('../configurations/config');
const log = require('tracer').colorConsole(config.loggingConfig);

const Character = new mongoose.Schema({
    username: {type: String, required: true, index: { unique: true}},
    email: {type: String, required: true, index: { unique: true}},
    characters: [{type: String}]
});

const Characters = mongoose.model('Characters', Character);

//Need to have a valid token for all routes
router.use(authAPI);

router.get('/load', function(req, res){
  const { index } = req.query;
  const { name } = req.decoded;

  Characters.findOne({username: name}, function(err, charactersData){
    if (err) {
      log.error(err);
      return res.status(400).send('Error getting character data');
    }
    if (charactersData){
      return res.status(200).send({data: charactersData.characters[index]});
    }
    else {
      return res.status(400).send('Error getting character data');
    }
  });

});

router.post('/save', function(req, res){
  const {index, characterData} = req.body;
  const { id, name, email } = req.decoded;

  Characters.findOne({username: name}, function(err, charactersData){
    if (err) {
      log.error(err);
      return res.status(400).send('Error saving character data');
    }
    if (charactersData){
      charactersData.characters[index] = characterData

      charactersData.save()
      .then((err, data) => {
        if (err){
          return res.status(400).send('Error saving character data');
        }
        return res.status(200).send('This totally worked!');
      })

    }
    else {
      const data = [];
      data[index] = [characterData]

      const newCharacter = new Characters({
        username: name,
        email: email,
        characters: data
      });

      newCharacter.save()
      .then((err, data) => {
        if (err){
          return res.status(400).send('Error saving character data');
        }
        return res.status(200).send('This totally worked!');
      })
    }
  });
});


module.exports = router;