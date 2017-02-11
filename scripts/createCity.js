/*
  Create City

  Given the name of a city:
  - fetches Songkick metro ID
  - adds city to the DB
  - creates a playlist for each specified genre
  - populates the playlist with tracks
 */

var _ = require('underscore');
var Promise = require('bluebird');
var app = require('../app');
var cities = require('../app/services/cities');
var tracks = require('../app/services/tracks');
var fs = require('fs-promise');

var coords = process.argv[2];

cities.createCity(coords)
.then(cities.createCityGenrePlaylists)
.then(cities.getCityEvents)
.then(tracks.getArtistTracks)
.then(function(tracks) {
  return fs.ensureDir('./cache')
  .then(function() {
    fs.writeFile(`./cache/tracks-${Date.now()}`, JSON.stringify(tracks));
  });
})
.then(cities.dispenseTracksToPlaylists)
.then(function() {
  return console.log('Playlist model saved, exiting');
  process.exit();
})
.catch(function(err) {
  return console.error(err);
  process.exit();
});
