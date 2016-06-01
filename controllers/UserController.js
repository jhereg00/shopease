const User = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utilities/logger');
var router = express.Router();

class UserController {
  UserController () {

  }

  static create (values, callback) {
    return User.create(values, callback);
  }
  static sendUser (req, res, user) {
    var token = user.getToken();
    res.cookie('token', token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
    res.json({ success: true, token: token });
  }
  static verifyToken (req, res, next) {
    var token = req.body.token || req.cookies['token'];
    if (token) {
      var user = User.getFromToken(token);
      if (user) {
        req.user = user;
      }
    }

    next();
  }
}

router.post('/create', function (req, res) {
  var u = new User(req.body);
  u.save(function (err, user) {
    if (err)
      res.json({ success: false, error: err });
    else {
      UserController.sendUser(req, res, u);
    }
  });
});

router.post('/login', function (req, res) {
  var u = User.getOne({ email: req.body.email }, function (err, user) {
    if (err || !user) {
      res.statusCode = 404;
      res.json({ success: false, error: err || 'user not found' });
    }
    else {
      // check password
      if (bcrypt.compareSync(req.body.pwd, user.pwd)) {
        UserController.sendUser(req, res, user);
      }
      else {
        // bad password
        res.statusCode = 401;
        res.json({ success: false, error: 'invalid password'});
      }
    }
  });
});

router.post('/update', function (req, res, next) {
  if (!req.user) {
    res.statusCode = 401;
    res.json({ success: false, error: 'could not verify user' });
  }
  // we have a valid user, let's go!
  for (let prop in req.body) {
    if (req.body[prop] && (req.user.hasOwnProperty(prop) || req.user.hasOwnProperty('_' + prop))) {
      req.user[prop] = req.body[prop];
    }
  }
  req.user.save(function (err, data) {
    if (err) {
      res.statusCode = 500;
      res.json({ success: false, error: err });
    }
    else {
      UserController.sendUser(req, res, req.user);
    }
  });
});

module.exports = UserController;
module.exports.router = router;
