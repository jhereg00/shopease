const User = require('../models/User');
const express = require('express');
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

module.exports = UserController;
module.exports.router = router;
