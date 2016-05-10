///////////////////
// modules
///////////////////
const babel = require('babel-register');
const express = require('express');
const app = express();
const logger = require('./utilities/logger');
const morgan = require('morgan');

///////////////////
// settings
///////////////////
var ENV = process.env.NODE_ENV || 'production';
// listens to port 8080 unless in development mode, when it's port 3001
var PORT = process.env.PORT || (ENV === 'development' ? 3001 : 8080);

///////////////////
// middleware and routes
///////////////////
// logging
app.use(morgan(ENV === 'development' ? 'dev' : 'combined',{ "stream": logger.stream }));
// temp
app.get('/', function (req, res) {
  res.send('Hello World');
});

///////////////////
// start app
///////////////////
try {
  var server = app.listen(PORT, function () {
    logger.info('Travelocity Brand Guide listening on port ' + PORT);
  });
} catch (err) {
  logger.error(err);
}
