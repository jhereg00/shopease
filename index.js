/**
 *  NOTE: despite using babel, still using Node standard module import/export
 *
 *  requires mongoDB to be running. Can configure the url/db, or make it
 *  localhost:27017/shopease
 *  -u shopease
 *  -p #s3cuR!tY
 */

///////////////////
// modules
///////////////////
const babel = require('babel-register');
const express = require('express');
const app = express();
const logger = require('./utilities/logger');
const morgan = require('morgan');
var db = require('./utilities/db');

///////////////////
// settings
///////////////////
const config = require('./utilities/config');

///////////////////
// middleware and routes
///////////////////
// logging
app.use(morgan(config.env === 'development' ? 'dev' : 'combined',{ "stream": logger.stream }));
// temp
app.get('/', function (req, res) {
  res.send('Hello World');
});

///////////////////
// start app
///////////////////
try {
  var server;
  //db.onReady(function () {
    server = app.listen(config.port, function () {
      logger.info('Travelocity Brand Guide listening on port ' + config.port);
    });
  //});
  // listen for shutdown
  process.on('SIGINT', function () {
    server.close();
    if (db.db) {
      db.db.close();
      logger.debug('closing mongo connection');
    }
  });

  module.exports = app;
} catch (err) {
  logger.error(err);
}
