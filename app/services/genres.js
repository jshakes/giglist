const Promise = require('bluebird');
const _ = require('underscore');
const lastfm = require('./lastfm')();

const genreMap = require('../data/genres');

const genres = {
  _getArtistGenres: (track) => {
    console.log('Finding a genre for', track.artist);
    function getTags() {
      if(track.lastfm && track.lastfm.tags) {
        return Promise.resolve(track.lastfm.tags);
      }
      else {
        return lastfm.getArtistTagArray(track.artist)
      }
    }
    return getTags()
    .then((tags) => {
      console.log('Found tags', tags, 'for', track.artist);
      track = Object.assign(track, {
        lastfm: {
          tags: tags
        }
      });
      return genres._getGenresFromTags(tags);
    })
    .then(function(genres) {
      console.log('Found genres', genres, 'for', track.artist);
      // reject a track if it has no genres or matches too many genres
      if(genres && genres.length && genres.length < 5) {
        return Object.assign(track, {
          genres: genres
        });
      }
    })
    .catch(function(err) {
      console.error('Could not get genre for', track.name);
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
    return Promise.mapSeries(eventObj.events, genres._getArtistGenres)
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
  }
};

module.exports = genres;
