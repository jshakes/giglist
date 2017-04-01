var express = require('express');
var glob = require('glob');

var logger = require('morgan');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var exphbs  = require('express-handlebars');
var routes = require('./routes');

module.exports = function(app) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.engine('handlebars', exphbs({
    layoutsDir: 'app/views/layouts/',
    defaultLayout: 'main',
    partialsDir: ['../app/views/partials/']
  }));
  app.set('views', 'app/views');
  app.set('view engine', 'handlebars');
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(compress());
  app.use(express.static('public'));
  app.use(methodOverride());

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error.handlebars', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error.handlebars', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
