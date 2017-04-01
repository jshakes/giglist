/*
  Songkick

  Services object for interacting with the Last FM API
 */

const _ = require('underscore');
const fetch = require('node-fetch');
const querystring = require('querystring');

const LASTFM_API_URI_ROOT = 'http://ws.audioscrobbler.com/2.0/';

module.exports = () => {
  
  const lastfmApi = {
    _makeQueryUrl: (params) => {
      params = params || {};
      const query = Object.assign({
        api_key: process.env.LASTFM_API_KEY,
        format: 'json'
      }, params);
      const queryStr = querystring.stringify(query);
      return `${LASTFM_API_URI_ROOT}?${queryStr}`;
    },
    getArtistTagArray: (artist) => {
      const url = lastfmApi._makeQueryUrl({
        artist,
        method: 'artist.getTopTags'
      });
      return fetch(url)
      .then((res) => res.json())
      .then((json) => {
        return json.toptags ? _.pluck(json.toptags.tag.filter((tag) => {
          return parseInt(tag.count, 10) > 50;
        }), 'name') : [];
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    }
  };
  return lastfmApi;
};