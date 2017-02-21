/*
  Resort genres
 */

var _ = require('underscore');
var Promise = require('bluebird');
var app = require('../app');
var City = require('../app/models/city');
var genres = require('../app/services/genres');
var cities = require('../app/services/cities');
var cache = require('../app/lib/cache');

City.find({})
.populate('playlists')
.then(function(cityArr) {
  return Promise.mapSeries(cityArr, function(city) {
    var trackObj = {
      city: city
    };
    return cache.tryCache(`tracks-${city.id}`)
    .then(function(cacheContents) {
      if(cacheContents) {
        var parsedCache = JSON.parse(cacheContents);
        trackObj = Object.assign(trackObj, {
          events: parsedCache.events
        });
      }
      return trackObj;
    })
    .then(genres.getEventGenres)
    .then(cities._dispenseTracksToPlaylists);
  });
});
