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
var Playlist = require('../app/models/playlist');
var City = require('../app/models/city');
var songkick = require('../app/services/songkick');
var spotify = require('../app/services/spotify');

var coords = process.argv[2];
var city;
var playlist;

songkick.getMetroFromCoords(coords)
.then(function(location) {
  
  var cityName = location.metroArea.displayName;
  // Add the state if it's a US city
  if(location.metroArea.state) {
    cityName += ', ' + location.metroArea.state.displayName;
  }
  var params = {
    name: cityName,
    metroId: location.metroArea.id,
    latitude: location.metroArea.lat,
    longitude: location.metroArea.lng,
    country: location.metroArea.country.displayName
  };
  city = new City(params);
  console.log('Attempting to create new city:', cityName);
  return city.save();
})
.then(function(record) {
  console.log('Created new city:', record.name);
  return spotify.createPlaylist('Livelist ' + record.name);
})
.then(function(playlistData) {
  console.log('Associating new Spotify playlist details with city');
  playlist = new Playlist({
    name: playlistData.name,
    spotifyId: playlistData.id,
    externalUrl: playlistData.external_urls.spotify
  });
  return playlist.save();
})
.then(function(record) {
  city.playlists.push(record);
  return city.save();
})
.then(function() {
  console.log('Spotify playlist details associated with city');
  // Get upcoming events for the city
  return songkick.getEventsArtists(city.metroId);
})
.mapSeries(function(artist) {
  console.log('Finding and adding a track for', artist.displayName);
  // Get each artist's most popular track and save it to an array
  return spotify.getArtistMostPopularTrack(artist.displayName);
})
.then(function(trackArr) {
  var validTracks = _.filter(trackArr, function(item) {
    return item !== 0;
  });
  return spotify.addTracksToPlaylist(playlist.spotifyId, validTracks);
})
.then(function() {
  return console.log('Complete');
  process.exit();
})
.catch(function(err) {
  return console.error(err);
  process.exit();
});
