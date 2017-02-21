/*
  Resort genres
 */

var _ = require('underscore');
var Promise = require('bluebird');
var app = require('../app');
var City = require('../app/models/city');
var genres = require('../app/services/genres');
var cities = require('../app/services/cities');

City.find({})
.populate('playlists')
.then(function(cityArr) {
  return Promise.mapSeries(cityArr, function(city) {
    var allTracks = [];
    city.playlists.forEach(function(playlist) {
      allTracks = allTracks.concat(playlist.tracks);
    });
    var uniqueTracks = _.uniq(allTracks, function(item, key) { 
      return item.spotify.id;
    });
    console.log('Found', uniqueTracks.length, 'unique tracks total for', city.name);
    var trackObj = {
      city: city,
      events: uniqueTracks
    };
    return genres.getEventGenres(trackObj)
    .then(cities._dispenseTracksToPlaylists);
  });
});
