/*
  Songkick

  Services object for interacting with the Songkick API
 */

var Promise = require('bluebird');
var _ = require('underscore');
var Songkick = require('songkick-api');
var dates = require('../lib/dates');
var promises = require('../lib/promises');
var fetch = require('node-fetch');
var querystring = require('querystring');
var MAX_DAYS = 14;

var SONGKICK_API_URI_ROOT = 'http://api.songkick.com/api/3.0/events.json';

module.exports = {
  _makeQueryUrl: function(params) {
    params = params || {};
    var query = Object.assign({
      apikey: process.env.SONGKICK_API_KEY
    }, params);
    var queryStr = querystring.stringify(query);
    return `${SONGKICK_API_URI_ROOT}?${queryStr}`;
  },
  _getSkEvents: function(metroID, dayRange) {

    var _this = this;
    var minDate = new Date();
    var maxDate = new Date();
    maxDate.setDate(minDate.getDate() + dayRange);
    var minDateStr = dates.toYYYYMMDD(minDate);
    var maxDateStr = dates.toYYYYMMDD(maxDate);

    return new Promise(function(resolve, reject) {
      var perPage = 50;
      var totalEvents = 1;
      var page = 1;
      var events = [];

      function fetchEvents() {
        var url = _this._makeQueryUrl({
          location: 'sk:' + metroID,
          page: page,
          per_page: perPage,
          min_date: minDateStr,
          max_date: maxDateStr
        });
        console.log('fetching', url);
        return fetch(url)
        .then(function(res) {
          return res.json();
        })
        .then(function(json) {
          page++;
          var pagedEvents = json.resultsPage.results.event;
          totalEvents = json.resultsPage.totalEntries;
          if(pagedEvents) {
            events = events.concat(pagedEvents);
            console.log('Fetched results', events.length, 'to', events.length + pagedEvents.length);
          }
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
      }

      promises.promiseWhile(function() {
        return events.length < totalEvents;
      }, _.throttle(fetchEvents, 500))
      .then(function() {
        console.log('Fetched', totalEvents, 'events');
        resolve(events);
      });
    })
  },
  getMetroFromCoords: function(coords) {

    var songkick = new Songkick(process.env.SONGKICK_API_KEY);
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
  getEvents: function(metroID) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this._getSkEvents(metroID, MAX_DAYS)
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
            var artist = performance.artist.displayName;
            // add an artist only if they aren't already in the array
            if(!_.findWhere(artists, {artist: artist})) {
              artists.push({
                artist: performance.artist.displayName,
                songkick: songkickEvent
              });
            }
          });
        });
        resolve(artists);
      })
      .catch(function(err) {
        console.error(err);
      });
    });
  }
};