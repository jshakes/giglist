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

  songkick.getEvents.then(function(events) {

    res.json(events);
  });
});

