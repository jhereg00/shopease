/**
 *  Creates mongo connection
 */

const mongo = require('mongoskin');
const config = require('./config');
const logger = require('./logger');
const mongoUrl = config.env !== 'test' ? config.mongo : config.mongoTest;
var db,
    ready,
    readyFns = [];

// create the connection
db = mongo.db('mongodb://' + mongoUrl);

module.exports = db;
