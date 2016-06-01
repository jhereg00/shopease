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
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const UserController = require('./controllers/UserController');
var db = require('./utilities/db');

///////////////////
// settings
///////////////////
const config = require('./utilities/config');

///////////////////
// middleware and routes
///////////////////
// logging
if (config.env !== 'test')
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined',{ "stream": logger.stream }));
// parse POST data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// cookies!
app.use(cookieParser());
// user token verification
app.use(UserController.verifyToken)
// temp
app.get('/', function (req, res) {
  console.log(req.user);
  res.send('Hello World');
});
app.use('/api/users/', UserController.router);

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
