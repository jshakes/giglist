
var express = require('express');
var router = express.Router();
var songkick = require('../services/songkick');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/city', function (req, res, next) {

  res.render('city', {
    title: 'A City Playlist'
  });
});


router.get('/test', function (req, res, next) {

  // Get upcoming events for New York
  songkick.getEventsArtists(7644).then(function(artists) {

    res.json(artists);
  });
});

