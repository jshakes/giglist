/*
  Songkick 
  
  Services object for interacting with the Songkick API
 */

var Promise = require('bluebird');
var SONGKICK_API_KEY = 'RpuYqxFiPPsJPs5l';
var _ = require('underscore');
var http = require('http');
var Songkick = require('songkick-api');

module.exports = {
  _getEvents: function(metroID) {

    var songkick = new Songkick(SONGKICK_API_KEY);
    return new Promise(function(resolve, reject) {

      songkick.searchEvents({
        location: 'sk:' + metroID
      })
      .then(function(events) {
        resolve(events);
      });
    });
  },
  getMetroFromCoords: function(coords) {

    var songkick = new Songkick(SONGKICK_API_KEY);
    return new Promise(function(resolve, reject) {
      
      songkick.searchLocations({
        location: 'geo:' + coords
      })
      .then(function(locations) {

        resolve(locations[0]);
      })
      .catch(function(err) {
        
        reject('No locations found with those coordinates');
      });
    });
  },
  getArtistsEvents: function(metroID) {

    var _this = this;
    return new Promise(function(resolve, reject) {

      _this._getEvents(metroID)
      .then(function(events) {  
        var artists = [];
        events.forEach(function(event) {
          var songkickEvent = {
            id: event.id,
            url: event.uri,
            name: event.displayName,
            venue: event.venue.displayName,
            date: event.start.date,
          };
          event.performance.forEach(function(performance) {
            artists.push({
              artist: performance.artist.displayName,
              songkick: songkickEvent
            })
          });
        });
        resolve(artists);
      });
    });
  }
};