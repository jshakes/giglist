var fetch = require('node-fetch');
var querystring = require('querystring');
var Promise = require('bluebird');
var _ = require('underscore');

var LASTFM_API_URI_ROOT = 'http://ws.audioscrobbler.com/2.0/';

module.exports = {
  _makeQueryUrl: function(params) {
    params = params || {};
    var query = Object.assign({
      api_key: process.env.LASTFM_API_KEY,
      format: 'json'
    }, params);
    var queryStr =  querystring.stringify(query);
    return `${LASTFM_API_URI_ROOT}?${queryStr}`;
  },
  getArtistTagArray: function(artist) {
    var url = this._makeQueryUrl({
      artist: artist,
      method: 'artist.getTopTags'
    });
    return new Promise(function(resolve, reject) {
      fetch(url)
      .then(function(res) {
        return res.json();
      })
      .then(function(json) {
        return json.toptags ? _.pluck(json.toptags.tag.filter(function(tag) {
          return parseInt(tag.count, 10) > 50;
        }), 'name') : [];
      })
      .then(resolve)
      .catch(function(err) {
        console.log(err);
        reject(err);
      })
    })
  }
};
