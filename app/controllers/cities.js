var async = require('async');
var express = require('express');
var router = express.Router();
var songkick = require('../services/songkick');
var spotify = require('../services/spotify');
var _ = require('underscore');
var Playlist = require('../models/playlist');
var City = require('../models/city');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/:citySlug', function (req, res, next) {
  City.findOne({
    slug: req.params.citySlug
  })
  .populate('playlists')
  .then(function(city) {
    if(city) {
      tracks = city.playlists[0].tracks;
      delete city.playlists;
      res.render('city', {
        title: city.name,
        city: city,
        tracks: tracks
      });
    }
    else {
      res.send(404);
    }
  });
});
