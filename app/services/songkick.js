/*
  Songkick 
  
  Services object for interacting with the Songkick API
 */

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
      }).then(function(events) {

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
  getEventsArtists: function(metroID) {

    var _this = this;
    return new Promise(function(resolve, reject) {

      _this._getEvents(metroID).then(function(events) {

        var performances = _.flatten(_.pluck(events, 'performance'));
        var artists = _.pluck(performances, 'artist');
        resolve(artists);
      });
    });
  }
};