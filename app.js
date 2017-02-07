var express = require('express');
var config = require('./config/config');
var glob = require('glob');
var app = express();

require('./config/db')(app, config);
require('./config/routes')(app, config);
require('./config/express')(app, config);

module.exports = app;
