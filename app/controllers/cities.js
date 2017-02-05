var Playlist = require('../models/playlist');
var City = require('../models/city');
var genres = require('../services/genres');

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
    const genreArr = genres.allGenreNames();
    City.findOne({
      slug: req.params.citySlug
    })
    .then(function(city) {
      if(city) {
        res.render('city', {
          genres: genreArr,
          city: city
        });
      }
      else {
        res.send(404);
      }
    });
  },
  playlist: function(req, res) {
    City.findOne({
      slug: req.params.citySlug
    })
    .populate('playlists')
    .then(function(city) {
      if(city) {
        var tracks = city.playlists[0].tracks;
        var playlistUrl = city.playlists[0].externalUrl;
        delete city.playlists;
        res.render('playlist', {
          title: city.name,
          city: city,
          tracks: tracks,
          playlistUrl: playlistUrl
        });
      }
      else {
        res.send(404);
      }
    });
  }
};
