var _ = require('underscore');
var Promise = require('bluebird');
var City = require('../models/city');
var cache = require('../lib/cache');
var genres = require('./genres');
var playlists = require('./playlists');
var songkick = require('./songkick')();
var tracks = require('./tracks');

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
  _updatePlaylistsMeta: function(trackObj) {
    return Promise.mapSeries(trackObj.city.playlists, playlists.updatePlaylistMeta);
  },
  _getCityEvents: function(city) {
    // Get upcoming events for the city
    return songkick.getEvents(city.metroId)
    .then(function(events) {
      return {
        city: city,
        events: events
      }
    });
  },
  _dispenseTracksToPlaylists: function(trackObj) {
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
    })
    .then(function() {
      return trackObj;
    });;
  },
  updateCityPlaylists: function(id) {
    return City.findById(id)
    .populate('playlists')
    .then(function(city) {
      var trackObj = {
        city: city
      };
      // try and get the tracks from the cache first
      return cache.tryCache(`tracks-${city.id}`)
      .then(function(cacheContents) {
        if(cacheContents) {
          var parsedCache = JSON.parse(cacheContents);
          trackObj = Object.assign(trackObj, {
            events: parsedCache.events
          });
        }
        return trackObj;
      });
    })
    .then(function(trackObj) {
      if(trackObj.events) {
        return cities._dispenseTracksToPlaylists(trackObj)
        .then(cities._updatePlaylistsMeta);
      }
      else {
        return cache.tryCache(`events-${trackObj.city.id}`)
        .then(function(cacheContents) {
          if(cacheContents) {
            var parsedCache = JSON.parse(cacheContents);
            trackObj = Object.assign(trackObj, {
              events: parsedCache
            });
            return Promise.resolve(trackObj);
          }
          else {
            return cities._getCityEvents(trackObj.city)
            .then(function(trackObj) {
              return cache.writeCache(`events-${trackObj.city.id}`, trackObj.events)
              .then(function() {
                return trackObj;
              });
            });
          }
        })
        .then(genres.getEventGenres)
        .then(tracks.getArtistTracks)
        .then(function(tracks) {
          return cache.writeCache(`tracks-${trackObj.city.id}`, tracks);
        })
        .then(cities._dispenseTracksToPlaylists)
        .then(cities._updatePlaylistsMeta)
      }
    })
  }
};

module.exports = cities;
