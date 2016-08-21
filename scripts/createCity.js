/*
  Create City

  Given the name of a city:
  - fetches Songkick metro ID
  - adds city to the DB
  - creates a playlist for each specified genre
  - populates the playlist with tracks
 */

var app = require('../app');
var City = require('../app/models/city');
var Playlist = require('../app/models/playlist');
var songkick = require('../app/services/songkick');
var spotify = require('../app/services/spotify');

var coords = process.argv[2];
var city;

songkick.getMetroFromCoords(coords)
  .then(function(location) {
    
    var cityName = location.metroArea.displayName;
    // Add the state if it's a US city
    if(location.metroArea.state) {
      cityName += ', ' + location.metroArea.state.displayName;
    }
    var playlistName = 'Livelist ' + cityName;
    var params = {
      name: cityName,
      metroId: location.metroArea.id,
      latitude: location.metroArea.lat,
      longitude: location.metroArea.lng,
      country: location.metroArea.country.displayName,
      playlists: [
        new Playlist({
          name: playlistName
        })
      ]
    };

    city = new City(params);
    console.log('attempting to save', city);
    return city.save();
  })
  .then(function(record) {
    console.log(record);
    return spotify.createPlaylist(record.playlists[0].name);
  })
  .then(function(playlist) {
    
    console.log('playlist data', playlist);
    city.playlists[0] = playlist;
    return city.save();
  })
  .then(function() {

    console.log('City saved');
    process.exit();
  })
  .catch(function(err) {

    return console.error(err);
    process.exit();
  });
