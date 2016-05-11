/**
 *  Creates mongo connection
 */

const mongo = require('mongodb').MongoClient;
const config = require('./config');
const logger = require('./logger');
var db,
    ready,
    readyFns = [];

// create the connection
mongo.connect('mongodb://' + config.mongo, function (err, _db) {
  if (err)
    throw err;

  db = _db;

  ready = true;
  readyFns.forEach(x => x(db));

  logger.debug("MongoDB connected: " + config.mongo);
});

function onReady (fn) {
  if (!ready) {
    readyFns.push(fn);
  }
  else {
    fn(db);
  }
}

module.exports.db = db;
module.exports.onReady = onReady;
