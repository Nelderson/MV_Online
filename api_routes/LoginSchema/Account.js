//Version 0.1.0 - Added fields for password reset logic

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var allFields = 'id salt hash username email activated actCode rank socketId lostPasswordFlag lostPasswordTemp lostPasswordExpires';

var Account = new Schema({
    username: {type: String, required: true, index: { unique: true}},
    email: {type: String, required: true, index: { unique: true}},
    activated: Boolean,
    actCode: String,
    socketId: String, //Current assigned socket
    lostPasswordFlag: Boolean,
    lostPasswordTemp: String,
    lostPasswordExpires: Date,
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
