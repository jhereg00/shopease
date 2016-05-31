const User = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

class UserController {
  UserController () {

  }

  static create (values, callback) {
    return User.create(values, callback);
  }
}

router.post('/create', function (req, res) {
  var u = new User(req.body);
  u.save(function (err, data) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, token: 'badToken' });
  });
});

router.post('/login', function (req, res) {
  var u = User.getOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.statusCode = 404;
      res.json({ success: false, error: err });
    }
    else {
      // check password
      if (bcrypt.compareSync(req.body.pwd, user.pwd)) {
        res.json({ success: true, token: 'badToken' });
      }
      else {
        // bad password
        res.statusCode = 401;
        res.json({ success: false, error: 'invalid password'});
      }
    }
  });
})

module.exports = UserController;
module.exports.router = router;
