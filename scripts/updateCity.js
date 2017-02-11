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
var CACHE_EXPIRES = 86400000; // 24 hours
var id = process.argv[2];

City.findById(id)
.populate('playlists')
.then(function(city) {
  var trackObj = {
    city: city
  };
  // try and get the tracks from the cache first
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
      return cachePrefix === 'tracks' && cacheCityId === city.id && cacheDate > cacheMinAge;
    });
    if(!validCaches.length) {
      throw('No cache available');
    }
    console.log('Found valid cache, not fetching new data');
    return fs.readFile(`./${CACHE_DIR}/${validCaches[0]}`)
    .then(function(contents) {
      var parsedCache = JSON.parse(contents);
      return Object.assign(trackObj, {
        events: parsedCache.events
      });
    })
  })
  .catch(function(err) {
    console.error(err);
    return trackObj;
  })
})
.then(function(trackObj) {
  if(trackObj.events) {
    return cities.dispenseTracksToPlaylists(trackObj);
  }
  else {
    return cities.getCityEvents(trackObj.city)
    .then(tracks.getArtistTracks)
    .then(function(tracks) {
      return fs.ensureDir(CACHE_DIR)
      .then(function() {
        fs.writeFile(`./${CACHE_DIR}/tracks-${trackObj.city.id}-${Date.now()}`, JSON.stringify(tracks));
      })
      .then(function() {
        return tracks;
      });
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

