require('dotenv').config()

var express = require('express');
var glob = require('glob');
var app = express();

require('./config/db')(app);
require('./config/routes')(app);
require('./config/express')(app);
require('./config/cron')(app);

module.exports = app;
