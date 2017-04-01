/*
  Songkick

  Services object for interacting with the Songkick API
 */

const Promise = require('bluebird');
const _ = require('underscore');
const Songkick = require('songkick-api');
const dates = require('../lib/dates');
const promises = require('../lib/promises');
const fetch = require('node-fetch');
const querystring = require('querystring');

const MAX_DAYS = 14;
const SONGKICK_API_URI_ROOT = 'http://api.songkick.com/api/3.0/events.json';

module.exports = () => {
  
  const songkickApi = new Songkick(process.env.SONGKICK_API_KEY);
  
  const songkick = {
    _makeQueryUrl: (params = {}) => {
      const query = Object.assign({
        apikey: process.env.SONGKICK_API_KEY
      }, params);
      const queryStr = querystring.stringify(query);
      return `${SONGKICK_API_URI_ROOT}?${queryStr}`;
    },
    _getSkEvents: (metroID, dayRange) => {
      const minDate = new Date();
      let maxDate = new Date();
      maxDate.setDate(minDate.getDate() + dayRange);
      const minDateStr = dates.toYYYYMMDD(minDate);
      const maxDateStr = dates.toYYYYMMDD(maxDate);
      return new Promise((resolve, reject) => {
        const perPage = 50;
        let totalEvents = 1;
        let page = 1;
        let events = [];

        const fetchEvents = () => {
          const url = songkick._makeQueryUrl({
            location: 'sk:' + metroID,
            page: page,
            per_page: perPage,
            min_date: minDateStr,
            max_date: maxDateStr
          });
          console.log('fetching', url);
          return fetch(url)
          .then((res) => res.json())
          .then((json) => {
            page++;
            const pagedEvents = json.resultsPage.results.event;
            totalEvents = json.resultsPage.totalEntries;
            if(pagedEvents) {
              events = events.concat(pagedEvents);
              console.log('Fetched results', events.length, 'to', events.length + pagedEvents.length);
            }
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
        };
        promises.promiseWhile(() => {
          return events.length < totalEvents;
        }, _.throttle(fetchEvents, 500))
        .then(() => {
          console.log('Fetched', totalEvents, 'events');
          resolve(events);
        });
      })
    },
    getMetroFromCoords: (coords) => {
      return songkickApi.searchLocations({
        location: 'geo:' + coords
      })
      .then((locations) => locations[0])
      .catch((err) => {
        console.log('No locations found with those coordinates');
        return err;
      });
    },
    getEvents: (metroID) => {
      return songkick._getSkEvents(metroID, MAX_DAYS)
      .then((events) => {
        let artists = [];
        events.forEach((event) => {
          const songkickEvent = {
            id: event.id,
            url: event.uri,
            name: event.displayName,
            venue: event.venue.displayName,
            date: event.start.date,
          };
          event.performance.forEach((performance) => {
            const artist = performance.artist.displayName;
            // add an artist only if they aren't already in the array
            if(!_.findWhere(artists, {artist: artist})) {
              artists.push({
                artist: performance.artist.displayName,
                songkick: songkickEvent
              });
            }
          });
        });
        return artists;
      })
      .catch((err) => {
        console.error(err);
      });
    }
  };
  return songkick;
};