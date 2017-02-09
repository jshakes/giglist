/*
  Update City

  Upsert the playlist(s) for a city
 */

var app = require('../app');
var City = require('../app/models/city');
var cities = require('../app/services/cities');
var genres = require('../app/services/genres');
var tracks = require('../app/services/tracks');
  var fs = require('fs');

var id = process.argv[2];

City.findById(id)
.populate('playlists')
.then(cities.getCityEvents)
.then(tracks.getArtistTracks)
.then(cities.dispenseTracksToPlaylists)
.then(function() {
  return console.log('Playlist model saved, exiting');
  process.exit();
})
.catch(function(err) {
  return console.error(err);
  process.exit();
});

