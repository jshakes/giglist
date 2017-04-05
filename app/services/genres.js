const Promise = require('bluebird');
const _ = require('underscore');
const lastfm = require('./lastfm')();

const genreMap = require('../data/genres');

const genres = {
  _getArtistTags: (event) => {
    let tags = {
      spotify: [],
      lastfm: []
    };
    if(event.spotify && event.spotify.genres.length) {
      console.log('Found Spotify tags for', event.artist);
      tags.spotify = event.spotify.genres;
    }
    console.log('Getting last.fm tags for', event.artist);
    return lastfm.getArtistTagArray(event.artist)
    .then((lastfmTags) => {
      tags.lastfm = lastfmTags;
      return tags;
    });
  },
  _getArtistGenres: (event) => {
    return genres._getArtistTags(event)
    .then((tags) => {
      // return intersection of genres if both arrays are populated, otherwise just use lastfm genres
      const spotifyGenres = genres._getGenresFromTags(tags.spotify);
      const lastfmGenres = genres._getGenresFromTags(tags.lastfm);
      if(spotifyGenres.length && lastfmGenres.length) {
        return _.intersection(lastfmGenres, spotifyGenres);
      }
      return lastfmGenres;
    })
    .catch(function(err) {
      console.error('Could not get genre for', event.artist);
      return err;
    });
  },
  _getGenresFromTags: (tags) => {
    if(!tags || !tags.length) {
      return [];
    }
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
      return genres._getArtistGenres(event)
    }
  }
};

module.exports = genres;
