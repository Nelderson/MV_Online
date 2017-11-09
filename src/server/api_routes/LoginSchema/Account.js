/*
* @Author: Vinxce
* @Date:   2015-10-26 20:14:36
* @Last Modified by:   Vinxce
* @Last Modified time: 2015-10-28 10:16:05
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var allFields = 'id salt hash username email activated actCode rank socketId';

var Account = new Schema({
    username: {type: String, required: true, index: { unique: true}},
    email: {type: String, required: true, index: { unique: true}},
    activated: Boolean,
    actCode: String,
    socketId: String, //Current assigned socket
    rank: Number //0 - player, 1 - moderator, 2 - admin
});

Account.statics.findByName = function(name, cb) {
	return this.findOne({ username: name}, allFields, cb);
};

Account.statics.findByEmail = function(email, cb) {
	return this.findOne({ email: email}, allFields, cb);
};

Account.statics.activate = function(actCode, cb) {
	return this.findOneAndUpdate({ 'actCode': actCode }, { activated: true }, cb);
};

Account.plugin(passportLocalMongoose, {
	usernameQueryFields: ['username']
});


module.exports = mongoose.model('Account', Account);
