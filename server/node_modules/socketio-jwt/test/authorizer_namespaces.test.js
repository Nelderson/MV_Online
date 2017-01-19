var fixture = require('./fixture/namespace');
var request = require('request');
var io = require('socket.io-client');

describe('authorizer with namespaces', function () {

  //start and stop the server
  before(fixture.start);

  after(fixture.stop);

  describe('when the user is not logged in', function () {

    it('should be able to connect to the default namespace', function (done){
      var socket = io.connect('http://localhost:9000');
      socket.once('hi', done);
    });

    it('should not be able to connect to the admin namespace', function (done){
      var socket = io.connect('http://localhost:9000/admin');
      socket.once('disconnect', function () {
        done();
      });
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
      var socket = io.connect('http://localhost:9000/admin', {
        'forceNew': true,
      });
      var token = this.token;
      socket.on('connect', function(){
        socket.on('authenticated', function () {
          done();
        }).emit('authenticate', { token: token });
      });
    });
  });

});