var express = require('express');
var config = require('./config/config');
var glob = require('glob');
var mongoose = require('mongoose');

mongoose.connect(config.db, {
  promiseLibrary: require('bluebird')
});
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});
var app = express();

require('./config/routes')(app, config);
require('./config/express')(app, config);

module.exports = app;
