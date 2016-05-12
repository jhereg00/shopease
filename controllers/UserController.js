const User = require('../models/User');

class UserController {
  UserController () {

  }

  static create (values, callback) {
    return User.create(values, callback);
  }
}

module.exports = UserController;
