/*
  Songkick 
  
  Services object for interacting with the Songkick API
 */

var Promise = require('bluebird');
var SONGKICK_API_KEY = 'RpuYqxFiPPsJPs5l';
var _ = require('underscore');
var Songkick = require('songkick-api');
var dates = require('../lib/dates');
var promises = require('../lib/promises');
var fetch = require('node-fetch');
var querystring = require('querystring');

var SONGKICK_API = {
  uriRoot: 'http://api.songkick.com/api/3.0/events.json',
  apiKey: 'RpuYqxFiPPsJPs5l'
};

module.exports = {
  _makeQueryUrl: function(params) {
    params = params || {};
    var query = Object.assign({
      apikey: SONGKICK_API.apiKey
    }, params);
    var queryStr =  querystring.stringify(query);
    return `${SONGKICK_API.uriRoot}?${queryStr}`;
  },
  getEvents: function(metroID, dayRange) {
    
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
        console.log('Fetched', events.length, 'events');
        resolve(events);
      });
    })
  },
  getMetroFromCoords: function(coords) {

    var songkick = new Songkick(SONGKICK_API.apiKey);
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

      _this.getEvents(metroID, 30)
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