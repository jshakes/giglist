var Playlist = require('../models/playlist');
var City = require('../models/city');
var genres = require('../services/genres');
var _ = require('underscore');

module.exports = {
  index: function(req, res) {
    City.find().then(function(cities) {
      res.render('index', {
        cities: cities
      });
    }).catch(function(err) {
      console.error(err);
    });
  },
  city: function(req, res) {
    City.findOne({
      slug: req.params.citySlug
    })
    .populate('playlists')
    .then(function(city) {
      if(city) {
        res.render('city', {
          playlists: city.playlists,
          city: city
        });
      }
      else {
        res.status(404);
      }
    });
  },
  playlist: function(req, res) {
    console.log('playlist route');
    var city = req.params.citySlug;
    var genre = req.params.genreSlug;
    City.findOne({
      slug: city
    })
    .populate('playlists')
    .then(function(city) {
      var playlist = _.findWhere(city.playlists, {
        slug: genre
      });
      if(playlist) {
        var tracks = playlist.tracks;
        var playlistUrl = playlist.externalUrl;
        delete city.playlists;
        res.render('playlist', {
          playlist: playlist,
          city: city,
          tracks: tracks
        });
      }
      else {
        res.status(404);
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send(err);
    });
  }
};
