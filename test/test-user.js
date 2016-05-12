process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const babel = require('babel-register');

// get app modules
var db = require('../utilities/db');
var UserController = require('../controllers/UserController');
var User = require('../models/User');

var userVals = {
  name: "John Test",
  email: "fake@email.test",
  pwd: "somePass"
}

describe('Users', function (done) {

  after(function () {
    db.collection('users').drop();
  });

  it("should add a new user to the database if it doesn't exist", function (done) {
    var u = new User(userVals);
    u.save(function (err, data) {
      if (err)
        throw err;

      var check = User.getOne({ email: "fake@email.test" }, function (err, user) {
        console.log(user);
        if (err)
          throw err;

        user.should.be.a('object');
        user.name.should.equal(userVals.name);
        user.email.should.equal(userVals.email);
        user.should.have.property('pwd');
        user.should.have.property('_id');
        done();
      });
    });
  });
  it("should NOT add a new user if it does exist", function (done) {
    var u = new User(userVals);
    u.save(function (err, data) {
      err.should.exist;
      err.message.indexOf('E11000').should.not.equal(-1);
      done();
    });
  })
  it("should encrypt the password", function (done) {
    User.getOne({ email: "fake@email.test" }, function (err, user) {
      user.pwd.should.not.equal(userVals.pwd);
      done();
    })
  });
  it("should return the sign up form if the user doesn't exist");


});
