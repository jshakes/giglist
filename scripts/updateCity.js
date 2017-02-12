/*
  Update City

  Upsert the playlist(s) for a city
 */

var app = require('../app');
var City = require('../app/models/city');
var cities = require('../app/services/cities');
var genres = require('../app/services/genres');
var tracks = require('../app/services/tracks');
var fs = require('fs-promise');

var CACHE_DIR = './cache';
var id = process.argv[2];

City.findById(id)
.populate('playlists')
.then(function(city) {
  var trackObj = {
    city: city
  };
  // try and get the tracks from the cache first
  return getCache('tracks', city.id)
  .then(function(cacheContents) {
    if(cacheContents) {
      var parsedCache = JSON.parse(cacheContents);
      trackObj = Object.assign(trackObj, {
        events: parsedCache.events
      });
    }
    return trackObj;
  })
})
.then(function(trackObj) {
  if(trackObj.events) {
    return cities.dispenseTracksToPlaylists(trackObj);
  }
  else {
    return getCache('events', trackObj.city.id)
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
    .then(tracks.getArtistTracks)
    .then(function(tracks) {
      return writeCache('events', trackObj.city.id, tracks);
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

function getCache(prefix, cityId) {
  var CACHE_EXPIRES = 86400000; // 24 hours
  return fs.readdir(CACHE_DIR)
  .then(function(files) {
    if(!files.length) {
      throw('No cache available');
    }
    var cacheMinAge = Date.now() - CACHE_EXPIRES;
    var validCaches = files.filter(function(file) {
      var parts = file.split('-');
      var cachePrefix = parts[0];
      var cacheCityId = parts[1];
      var cacheDate = parseInt(parts[2], 10);
      return cachePrefix === prefix && cacheCityId === cityId && cacheDate > cacheMinAge;
    });
    if(!validCaches.length) {
      throw('No cache available');
    }
    console.log('Found valid cache:', validCaches[0], 'not fetching new data');
    return fs.readFile(`./${CACHE_DIR}/${validCaches[0]}`)
    .then(function(contents) {
      return contents;
    });
  })
  .catch(function(err) {
    console.error(err);
  });
}

function writeCache(prefix, cityId, contents) {
  return fs.ensureDir(CACHE_DIR)
  .then(function() {
    return fs.writeFile(`./${CACHE_DIR}/${prefix}-${cityId}-${Date.now()}`, JSON.stringify(contents));
  })
  .then(function() {
    console.log('Wrote to cache');
    return contents;
  });
}
