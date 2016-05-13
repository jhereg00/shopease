process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const babel = require('babel-register');
const bcrypt = require('bcrypt');

// get app modules
var db = require('../utilities/db');
var User = require('../models/User');

var userVals = {
  name: "John Test",
  email: "fake@email.test",
  pwd: "somePass"
}

describe('Users', function (done) {

  before(function (done) {
    db.collection('users').remove({},done);
  });

  it("should add a new user to the database if it doesn't exist", function (done) {
    var u = new User(userVals);
    u.save(function (err, data) {
      if (err)
        throw err;

      var check = User.getOne({ email: "fake@email.test" }, function (err, user) {
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
    User.getOne({ email: userVals.email }, function (err, user) {
      user.pwd.should.not.equal(userVals.pwd);
      bcrypt.compareSync(userVals.pwd, user.pwd).should.equal(true);
      bcrypt.compareSync('foo', user.pwd).should.equal(false);
      done();
    })
  });
  it("should get a User object or array of User objects", function (done) {
    User.getOne({ email: userVals.email }, function (err, user) {
      user.should.be.an.instanceof(User);
      User.get({ email: userVals.email }, function (err, users) {
        users.should.be.an('array');
        users[0].should.be.an.instanceof(User);
        done();
      })
    })
  })
  it("should update the values of an existing user", function (done) {
    User.getOne({ email: userVals.email }, function (err, user) {
      user.name = 'Jane Test';
      user.save(function (err, response) {
        if (err)
          throw err;

        User.getOne({ name: 'Jane Test' }, function (err, user) {
          user.should.exist;
          user.name.should.equal('Jane Test');
          user.email.should.equal(userVals.email);
          done();
        })
      })
    })
  })
  it("should delete a user", function (done) {
    User.getOne({ email: userVals.email }, function (err, user) {
      user.delete(function (err, data) {
        User.getOne({ email: userVals.email }, function (err, user) {
          (user === undefined).should.be.true;
          done();
        });
      })
    })
  })
});
