var fixture = require('./fixture');
var request = require('request');
var io = require('socket.io-client');

describe('authorizer without querystring', function () {

  //start and stop the server
  before(function (done) {
    fixture.start({
      handshake: false
    } , done);
  });

  after(fixture.stop);

  describe('when the user is not logged in', function () {

    it('should close the connection after a timeout if no auth message is received', function (done){
      var socket = io.connect('http://localhost:9000', {
        forceNew: true
      });
      socket.once('disconnect', function () {
        done();
      });
    });

    it('should not respond echo', function (done){
      var socket = io.connect('http://localhost:9000', {
        'forceNew':true,
      });

      socket.on('echo-response', function () {
        done(new Error('this should not happen'));
      }).emit('echo', { hi: 123 });

      setTimeout(done, 1200);
    });

  });

  describe('when the user is logged in', function() {

    beforeEach(function (done) {
      request.post({
        url: 'http://localhost:9000/login',
        form: { username: 'jose', password: 'Pa123' },
        json: true
      }, function (err, resp, body) {
        this.token = body.token;
        done();
      }.bind(this));
    });

    it('should do the handshake and connect', function (done){
      var socket = io.connect('http://localhost:9000', {
        'forceNew':true,
      });
      var token = this.token;
      socket.on('connect', function(){
        socket.on('echo-response', function () {
          socket.close();
          done();
        }).on('authenticated', function () {
          socket.emit('echo');
        }).emit('authenticate', { token: token });
      });
    });
  });

});