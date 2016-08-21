var async = require('async');
var express = require('express');
var router = express.Router();
var songkick = require('../services/songkick');
var spotify = require('../services/spotify');
var _ = require('underscore');
var City = require('../models/city');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/:citySlug', function (req, res, next) {

  City.findOne({
    slug: req.params.citySlug
  }).then(function(city) {

    console.log(city);
    if(city) {

      res.render('city', {
        title: city.name,
        city: city
      });
    }
    else {

      res.send(404);
    }
  });
});
