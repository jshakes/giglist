const Promise = require('bluebird');
const _ = require('underscore');
const lastfm = require('./lastfm')();

const genreMap = require('../data/genres');

const genres = {
  _getArtistGenres: (artist) => {
    console.log('Finding a genre for', artist);
    return lastfm.getArtistTagArray(artist)
    .then((tags) => {
      console.log('Found tags', tags, 'for', artist);
      return genres._getGenresFromTags(tags);
    })
    .catch(function(err) {
      console.error('Could not get genre for', artist);
      return err;
    });
  },
  _getGenresFromTags: (tags) => {
    return _.pluck(_.filter(genreMap, function(genre) {
      return _.intersection(genre.tags, tags).length;
    }), 'id');
  },
  getGenres: () => {
    return genreMap;
  },
  getGenreNames: () => {
    return _.pluck(genreMap, 'name');
  },
  getEventGenres: function(eventObj) {
    return Promise.mapSeries(eventObj.events, (event) => {
      return getGenres(event)
      .then((genres) => {
        console.log('Found genres', genres, 'for', event.artist);
        // reject a track if it has no genres or matches too many genres
        if(genres && genres.length && genres.length < 5) {
          return Object.assign(event, {
            genres: genres
          });
        }
      });
    })
    .then((events) => {
      const cleanEvents = events.filter((event) => !!event );
      return Object.assign(eventObj, {
        events: cleanEvents
      });
    })
    .catch(function(err) {
      console.error(err);
      return err;
    });
    function getGenres(event) {
      if(event.lastfm && event.lastfm.tags) {
        return Promise.resolve(event.lastfm.tags);
      }
      return genres._getArtistGenres(event.artist)
    }
  }
};

module.exports = genres;
