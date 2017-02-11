/*
  Truncate Playlists

  Truncate the playlist(s) for a city
 */

var Promise = require('bluebird');
var app = require('../app');
var City = require('../app/models/city');
var spotify = require('../app/services/spotify');
var fs = require('fs-promise');

var id = process.argv[2];

City.findById(id)
.populate('playlists')
.then(function(city) {
  return Promise.mapSeries(city.playlists, function(playlist) {
    var spotifyTrackArr = playlist.tracks.map(function(track) {
      return `spotify:track:${track.spotifyId}`;
    });
    return spotify.deleteTracksFromPlaylist(playlist.spotifyId, spotifyTrackArr)
    .then(function() {
      playlist.tracks = [];
      return playlist.save();
    })
  });
})
.then(function() {
  return console.log('Playlist model saved, exiting');
  process.exit();
})
.catch(function(err) {
  return console.error(err);
  process.exit();
});
