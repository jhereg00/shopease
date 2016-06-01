process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
const babel = require('babel-register');
const jwt = require('jsonwebtoken');
const config = require('../utilities/config');
const bcrypt = require('bcrypt');

chai.use(chaiHttp);

// get app modules
var db = require('../utilities/db');
var app = require('../index.js');
const User = require('../models/User');

var token;
var userVals = {
  name: "Joey Test",
  email: "fake@email.test",
  pwd: "somePass"
}

describe('UserController', function () {

  before(function (done) {
    db.collection('users').remove({},done);
  });

  it("creates a user and returns a token", function (done) {
    chai.request(app)
      .post('/api/users/create')
      .send(userVals)
      .end(function (err, res) {
        (err === null).should.be.true;
        res.should.have.status(200);
        var data = JSON.parse(res.text);
        data.success.should.be.true;
        data.token.should.exist;

        User.getOne({ email: userVals.email }, function (err, user) {
          user.should.exist;
          user.should.be.instanceof(User);
          done();
        });
      });
  });
  it("alerts on a failure to create", function (done) {
    chai.request(app)
      .post('/api/users/create')
      .send(userVals)
      .end(function (err, res) {
        (err === null).should.be.true;
        res.should.have.status(200);
        var data = JSON.parse(res.text);
        data.success.should.be.false;
        data.error.should.exist;
        done();
      });
  });
  it("signs in an existing user and returns a token", function (done) {
    chai.request(app)
      .post('/api/users/login')
      .send(userVals)
      .end(function (err, res) {
        (err === null).should.be.true;
        res.should.have.status(200);
        var data = JSON.parse(res.text);
        data.success.should.be.true;
        data.token.should.exist;
        done();
      });
  });
  it("alerts on a failure to log in", function (done) {
    chai.request(app)
      .post('/api/users/login')
      .send({
        email: userVals.email,
        pwd: 'badPass'
      })
      .end(function (err, res) {
        (err === null).should.be.false;
        res.should.have.status(401);
        var data = JSON.parse(res.text);
        data.success.should.be.false;
        expect(data.token).to.not.exist;
        data.error.should.equal('invalid password');
        done();
      })
  });
  it("creates a token that doesn't include the password", function (done) {
    chai.request(app)
      .post('/api/users/login')
      .send({
        email: userVals.email,
        pwd: userVals.pwd
      })
      .end(function (err, res) {
        //expect(res).to.have.cookie('token');
        var data = JSON.parse(res.text);
        token = data.token;
        // verify the token
        jwt.verify(token, config.tokenSecret, function (err, decoded) {
          expect(decoded.name).to.equal(userVals.name);
          expect(decoded.email).to.equal(userVals.email);
          expect(decoded.pwd).to.not.exist;
          expect(decoded._id).to.exist;
          done();
        });
      });
  });
  it("updates a user", function (done) {
    chai.request(app)
      .post('/api/users/update')
      .send({
        token: token,
        name: 'Tina Fake',
        pwd: 'newPass'
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        res.should.have.status(200);
        var data = JSON.parse(res.text);
        data.success.should.be.true;
        data.token.should.exist;

        User.getOne({ email: userVals.email }, function (err, user) {
          user.should.exist;
          expect(user.name).to.equal('Tina Fake');
          //expect(user.pwd).to.not.be.null;
          bcrypt.compareSync('newPass', user.pwd).should.equal(true);
          done();
        });
      });
  });

})
