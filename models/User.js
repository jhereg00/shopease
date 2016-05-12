var db = require('../utilities/db');
const userCollection = db.collection('users');

// make sure emails are unique
userCollection.createIndex({ email: 1 }, { unique: true });

class User {
  constructor (values) {
    this.name = values.name;
    this.email = values.email;
    this.pwd = values.pwd;
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
    userCollection.insert(this.values, callback);
  }
  static getOne (query, callback) {
    userCollection.findOne(query, callback);
  }
  static get (query, callback) {
    userCollection.find(query, callback);
  }
}

module.exports = User;
module.exports.collection = userCollection;
