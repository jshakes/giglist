/*
  Update City

  Upsert the playlist(s) for a city
 */

var app = require('../app');
var City = require('../app/models/city');
var cities = require('../app/services/cities');
var genres = require('../app/services/genres');
var tracks = require('../app/services/tracks');
var cache = require('../app/lib/cache');

var id = process.argv[2];

City.findById(id)
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
    return cities.dispenseTracksToPlaylists(trackObj);
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
        return cities.getCityEvents(trackObj.city)
        .then(function(trackObj) {
          return writeCache('events', trackObj.city.id, trackObj.events)
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
    .then(cities.dispenseTracksToPlaylists)
  }
})
.then(function() {
  return console.log('Playlist model saved, exiting');
  process.exit();
})
.catch(function(err) {
  return console.error(err);
  process.exit();
});

