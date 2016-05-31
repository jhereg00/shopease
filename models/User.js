var db = require('../utilities/db');
const userCollection = db.collection('users');
const config = require('../utilities/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// make sure emails are unique
userCollection.createIndex({ email: 1 }, { unique: true });

class User {
  constructor (values) {
    if (!values.email) {
      return null;
    }
    this.name = values.name;
    this.email = values.email;
    this.pwd = values.pwd;
    if (this.pwd && !/^\$[\d\w]{2}\$\d+\$.+/.test(this.pwd)) {
      this.pwd = bcrypt.hashSync(this.pwd, config.pwdSaltRounds);
    }
    this._id = values._id;
  }

  get values () {
    return {
      name: this.name,
      email: this.email,
      pwd: this.pwd,
      _id: this._id
    }
  }

  save (callback) {
    var _this = this;
    if (!this._id) { // if it has _id, it came from the DB so update instead
      if (!this.values.name || !this.values.email || !this.values.pwd) {
        return callback(new Error("invalid data"), null);
      }
      userCollection.insert(this.values, function (err, data) {
        if (data.insertedIds && data.insertedIds.length)
          _this.id = data.insertedIds[0];
        callback(err, data);
      });
    }
    else {
      userCollection.update({ _id: this._id }, this.values, function (err, data) {
        callback(err, data);
      });
    }
  }
  delete (callback) {
    userCollection.remove({ _id: this._id }, function (err, data) {
      callback(err, data);
    });
  }
  getToken () {
    return jwt.sign({
      name: this.values.name,
      email: this.values.email,
      _id: this.values._id
    }, config.tokenSecret, {
      expiresIn: "7d"
    });
  }
  static getOne (query, callback) {
    userCollection.findOne(query, function (err, data) {
      if (data)
        var user = new User(data);
      callback(err, user);
    });
  }
  static get (query, callback) {
    userCollection.find(query)
      .toArray(function (err, data) {
      var users = [];
      data.forEach(function (u) {
        users.push(new User(u));
      });
      callback(err, users);
    });
  }
}

module.exports = User;
module.exports.collection = userCollection;
