/*
  Resort genres
 */

var _ = require('underscore');
var Promise = require('bluebird');
var app = require('../app');
var City = require('../app/models/city');
//var genres = require()

City.find({})
.populate('playlists')
.then(function(cities) {
  return Promise.mapSeries(cities, function(city) {
    var allTracks = [];
    city.playlists.forEach(function(playlist) {
      allTracks = allTracks.concat(playlist.tracks);
    });
    var uniqueTracks = _.uniq(allTracks, function(item, key) { 
      return item.spotify.id;
    });
    console.log('Found', uniqueTracks.length, 'unique tracks total for', city.name);
  });
});
