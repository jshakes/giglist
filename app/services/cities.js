var Promise = require('bluebird');
var genres = require('./genres');
var playlists = require('./playlists');
var songkick = require('./songkick');
var City = require('../models/city');
var _ = require('underscore');

var cities = {
  _createCityPlaylist: function(city, playlistData) {
    return playlists.createPlaylist(playlistData)
    .then(function(record) {
      console.log('Associating playlist', record.id, 'with city', city.id);
      city.playlists.push(record);
      return city.save();
    });
  },
  createCity(coords) {
    return songkick.getMetroFromCoords(coords)
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
      console.log('Creating new city record:', cityName);
      return city.save();
    });
  },
  createCityGenrePlaylists: function(city) {
    var _this = this;
    var genreArr = genres.getGenres();
    return new Promise(function(resolve, reject) {
      Promise.mapSeries(genreArr, function(genre) {
        var playlistData = {
          name: genre.name,
          spotifyName: `Giglist ${city.name} - ${genre.name}`,
          genreId: genre.id
        };        
        return cities._createCityPlaylist(city, playlistData);
      })
      .then(function() {
        resolve(city);
      });
    });
  },
  getCityEvents: function(city) {
    // Get upcoming events for the city
    return songkick.getEvents(city.metroId)
    .then(function(events) {
      return {
        city: city,
        events: events
      }
    });
  },
  dispenseTracksToPlaylists: function(trackObj) {
    // Sort the tracks into a map by genreId
    var genreTracks = {};
    trackObj.events.forEach(function(event) {
      event.genres.forEach(function(genreId) {
        if(typeof(genreTracks[genreId]) === 'undefined') {
          genreTracks[genreId] = [];
        }
        genreTracks[genreId].push(event);
      });
    });
    return Promise.mapSeries(Object.keys(genreTracks), function(genreId, index) {
      var playlist = trackObj.city.playlists.find(function(playlist) {
        return playlist.genreId == genreId;
      });
      return playlists.replacePlaylistTracks(playlist, genreTracks[genreId]);
    });
  }
};

module.exports = cities;
