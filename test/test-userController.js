process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const babel = require('babel-register');

chai.use(chaiHttp);

// get app modules
var db = require('../utilities/db');
var app = require('../index.js');

var userVals = {
  name: "John Test",
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
      .field('name',userVals.name)
      .field('pwd',userVals.pwd)
      .field('email',userVals.email)
      .end(function (err, res) {
        err.should.be.null;
        res.should.have.status(200);
        var data = JSON.parse(res.body);
        data.success.should.be.true;
        data.token.should.exist;
        done();
      });
  });
  it("alerts on a failure to create");
  it("signs in an existing user and returns a token");
  it("alerts on a failure to log in");
  it("updates a user");
  it("creates a token that doesn't include the password");

})
