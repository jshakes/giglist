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
  return songkick.getArtistsEvents(city.metroId);
})
.mapSeries(function(track) {
  console.log('Finding a track for', track.artist);
  // Get each artist's most popular track and save it to an array
  return spotify.getArtistMostPopularTrack(track.artist)
  .then(function(spotifyTrack) {
    // scrap anything we couldn't find a spotify track for
    if(spotifyTrack === null) {
      throw 'No suitable track found for ' + track.artist;
    }
    console.log('Adding track', spotifyTrack.topTrackName, 'for artist', track.artist);
    track = Object.assign(track, {
      name: spotifyTrack.topTrackName,
      genres: spotifyTrack.genres,
      spotify: {
        id: spotifyTrack.topTrackId,
        url: spotifyTrack.topTrackUrl
      }
    });
    return track;
  })
  .catch(function(err) {
    console.error(err);
    return null;
  });
})
.then(function(trackArr) {
  var cleanArr = _.filter(trackArr, function(track) {
    return track !== null;
  });
  // temporary - we must return no more than 100 tracks or spotify will cry
  if(cleanArr.length >= 100) {
    cleanArr = cleanArr.slice(0, 100);
  }
  // Adding tracks to playlist model
  playlist.tracks = cleanArr;
  // Create an array of spotify track ids to pass to the endpoint
  var spotifyTracks = cleanArr.map(function(track) {
    return 'spotify:track:' + track.spotify.id;
  });
  // Add tracks to spotify
  return spotify.addTracksToPlaylist(playlist.spotifyId, spotifyTracks);
})
.then(function() {
  console.log('Saving tracks to playlist model');
  return playlist.save();
})
.then(function() {
  return console.log('Playlist model saved, exiting');
  process.exit();
})
.catch(function(err) {
  return console.error(err);
  process.exit();
});
