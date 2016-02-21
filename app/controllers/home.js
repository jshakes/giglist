var express = require('express');
var router = express.Router();
var City = require('../models/city');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  
  City.find().then(function(cities) {

    res.render('index', {
      cities: cities
    });
  }).catch(function(err) {

    console.error(err);
  });
});
