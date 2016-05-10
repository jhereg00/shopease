/**
 *  Controls logging using Winston (https://github.com/winstonjs/winston)
 *
 *  To use, take the exported object and call .{logLevel}('message')
 *  Example: logger.info('a thing happened')
 *
 *  Available levels are (from max importance to min):
 *    error
 *    warn
 *    info
 *    verbose
 *    debug
 *    silly
 *
 *  Error goes into its own log file
 *  Info and higher goes into the all-logs files
 *  Debug and higher prints to the console when in devMode, but not on production
 */

// require modules
const winston = require('winston'),
    fs = require('fs')
    ;

// make sure logs directory exists
try {
  fs.mkdirSync('./logs')
} catch (err) {
  if (err.code != 'EEXIST') throw err;
}

// define winston transports
var transports = [
  new winston.transports.File({
    name: 'info',
    level: 'info',
    filename: './logs/info-logs.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false
  }),
  new winston.transports.File({
    name: 'error',
    level: 'error',
    filename: './logs/error-logs.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false
  }),
  new winston.transports.File({
    name: 'debug',
    level: 'debug',
    filename: './logs/debug-logs.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false
  }),
  new winston.transports.Console({
    name: 'console',
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    handleExceptions: true,
    json: false,
    colorize: true
  })
]

// create the logger
var logger = new winston.Logger({
    transports: transports,
    exitOnError: false
});

module.exports = logger;
// just in case we ever need the actual stream...
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
