var jwt = require('jsonwebtoken');
var config = require('./configurations/config');

 var authAPI = function(req, res, next){

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.jwtSecret, function(err, decoded) {
			if (err) {
				return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'Not Authenticated'
		});

	}
};

 var authSocket = function(socket, next){
	var { token } = socket.handshake.query;

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.jwtSecret, function(err, decoded) {
			if (err) {
				return next(err);
			} else {
				// set user to decoded token 
				// for use throughout app
				socket.user = decoded;
				next(null);
			}
		});

	} else {
		// if there is no token
		// return an error
		return next('Not Authenticated')
	}
};


module.exports.authAPI = authAPI;
module.exports.authSocket = authSocket;
