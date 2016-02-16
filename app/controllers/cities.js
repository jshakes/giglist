var async = require('async');
var express = require('express');
var router = express.Router();
var songkick = require('../services/songkick');
var spotify = require('../services/spotify');
var _ = require('underscore');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/city', function (req, res, next) {

  res.render('city', {
    title: 'A City Playlist'
  });
});


router.get('/test', function (req, res, next) {

  var i =0;
  // Get upcoming events for New York
  songkick.getEventsArtists(7644).then(function(artists) {

    console.log('there are this many artists to get through:', artists.length);
    async.mapSeries(artists, function(artist, callback) {

      // Get each artist's most popular track and save it to an array
      spotify.getArtistMostPopularTrack(artist.displayName).then(function(trackId) {

        i++;
        setTimeout(function() {
          
          console.log('called', i, 'times.', 'Track ID is', trackId);
          callback(null, trackId);
        }, 500);
      });
    // All items have been iterated over
    }, function(err, trackArr) {

      var validTracks = _.filter(trackArr, function(item) {

        return item !== 0;
      });
      spotify.addTracksToPlaylist(validTracks).then(function(data) {
        
        res.json({
          response: data,
          tracksAdded: validTracks
        });
      });
    });
  });
});

