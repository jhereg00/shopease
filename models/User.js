var db = require('../utilities/db');
const ObjectID = require('mongodb').ObjectID;
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
    this._id = values._id;
  }

  get values () {
    if (this.pwd)
      return {
        name: this.name,
        email: this.email,
        pwd: this.pwd
      }
    else
      return {
        name: this.name,
        email: this.email
      }
  }

  set pwd (val) {
    if (val && !/^\$[\d\w]{2}\$\d+\$.+/.test(val)) {
      val = bcrypt.hashSync(val, config.pwdSaltRounds);
    }
    this._pwd = val;
  }
  get pwd () {
    return this._pwd;
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
      userCollection.update({ _id: new ObjectID(this._id) }, {
        '$set' : this.values
      }, function (err, data) {
        callback(err, data);
      });
    }
  }
  delete (callback) {
    userCollection.remove({ _id: new ObjectID(this._id) }, function (err, data) {
      callback(err, data);
    });
  }
  getToken () {
    return jwt.sign({
      name: this.values.name,
      email: this.values.email,
      _id: this._id
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
  static getFromToken (token) {
    var userData = jwt.verify(token, config.tokenSecret);
    if (userData && userData._id) {
      return new User (userData);
    }
    return null;
  }
}

module.exports = User;
module.exports.collection = userCollection;
