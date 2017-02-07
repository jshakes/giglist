var Promise = require('bluebird');
var genres = require('./genres');
var playlists = require('./playlists');
var songkick = require('./songkick');
var City = require('../models/city');

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
          name: `Giglist ${city.name} - ${genre.name}`,
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
    return songkick.getArtistsEvents(city.metroId)
    .mapSeries(function(track) {
      return Object.assign(track, {
        cityId: city.id
      });
    });
  }
};

module.exports = cities;
