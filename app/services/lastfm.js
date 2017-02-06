var fetch = require('node-fetch');
var querystring = require('querystring');
var Promise = require('bluebird');

var LASTFM_API = {
  uriRoot: 'http://ws.audioscrobbler.com/2.0/', 
  apiKey: '6ee3283f5fc7908343674bb728234129',
  secret: 'e5c7b2fa9d230e62effad9919bd2928f'
};

module.exports = {
  _makeQueryUrl: function(params) {
    params = params || {};
    var query = Object.assign({
      api_key: LASTFM_API.apiKey,
      format: 'json'
    }, params);
    var queryStr =  querystring.stringify(query);
    return `${LASTFM_API.uriRoot}?${queryStr}`;
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
        return json.toptags ? json.toptags.tag.map(function(tag) {
          return tag.name;
        }) : '';
      })
      .then(resolve)
      .catch(function(err) {
        console.log(err);
        reject(err);
      })
    })
  }
};
