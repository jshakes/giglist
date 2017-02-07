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
var genres = require('../app/services/genres');
var tracks = require('../app/services/tracks');

var coords = process.argv[2];

cities.createCity(coords)
.then(cities.createCityGenrePlaylists)
.then(cities.getCityEvents)
.mapSeries(tracks.getArtistTrack)
//.then(cities.dispenseTracksToPlaylists)
// .then(function(trackArr) {
//   var cleanArr = _.filter(trackArr, function(track) {
//     return track !== null;
//   });
//   // Split tracks by genre
//   var genreArr = genres.getGenres();
//   return Promise.mapSeries(genreArr, function(genre) {
//     var genreTracks = _.where(cleanArr, {
//       genreId: genre.id
//     });
//     var playlist = city.playlists.findWhere({
//       genreId: genre.id
//     });
//     // Adding tracks to playlist model
//     playlist.tracks = genreTracks;
//     // Create an array of spotify track ids to pass to the endpoint
//     var spotifyTracks = cleanArr.map(function(track) {
//       return 'spotify:track:' + track.spotify.id;
//     });
//     // Add tracks to spotify
//     return spotify.addTracksToPlaylist(playlist.spotifyId, spotifyTracks)
//     .then(playlist.save());
//   });
// })
.then(function() {
  return console.log('Playlist model saved, exiting');
  process.exit();
})
.catch(function(err) {
  return console.error(err);
  process.exit();
});
