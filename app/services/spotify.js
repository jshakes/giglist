var Promise = require('bluebird');
var prompt = require('prompt');
var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('underscore');
var config = require('../../config/config');

var SPOTIFY_CONFIG = config.spotify;

module.exports = {
  /**
   * Search for an artist on Spotify and return the artist ID of the first result
   * @param artistName {String} The artist to search form
   * @return artistID {String} The Spotify ID of the first artist result
   */
  _getArtistId: function(artistName) {

    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);

    return new Promise(function(resolve, reject) {

      spotifyApi.searchArtists(artistName).then(function(data) {

        // get the artist ID, if it exists
        var artistId = data.body.artists.items.length ? data.body.artists.items[0].id : 0;
        resolve(artistId);
      }, function(err) {
       
        console.error('Something went wrong!', err);
        reject(err);
      });
    });
  },
  _authenticate: function(spotifyApi) {
    
    return new Promise(function(resolve, reject) {
      spotifyApi.refreshAccessToken()
      .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        resolve(spotifyApi);
      })
      .catch(function(err) {
        
        console.error('Something went wrong!', err);
        reject(err);
      });
    });
  },
  getArtistMostPopularTrack: function(artistName) {

    _this = this;
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);

    return new Promise(function(resolve, reject) {

      _this._getArtistId(artistName).then(function(artistId) {

        if(artistId === 0) {

          return resolve(0);
        }
        spotifyApi.getArtistTopTracks(artistId, 'US').then(function(data) {

          var trackId = data.body.tracks.length ? 'spotify:track:' + data.body.tracks[0].id : 0;
          resolve(trackId);
        }, function(err) {

          console.error('Something went wrong!', err);
          reject(err);
        });
      });
    })
  },
  addTracksToPlaylist: function(playlistId, tracks) {

    var _this = this;
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {

      _this._authenticate(spotifyApi)
      .then(spotifyApi.replaceTracksInPlaylist(SPOTIFY_CONFIG.username, playlistId, tracks))
      .then(function(data) {
          
        resolve(data);
      })
      .catch(function(err) {
        
        console.error('Something went wrong!', err);
        reject(err);
      });
    });
  },
  createPlaylist: function(playlistName) {
    
    var _this = this;
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {
      
      _this._authenticate(spotifyApi)
      .then(function() {
        console.log('Attempting to create a playlist called', playlistName);
        return spotifyApi.createPlaylist(SPOTIFY_CONFIG.username, playlistName, { public: true })
      })
      .then(function(data) {
        var playlist = data.body;
        console.log('Created new Spotify playlist', playlist.name, 'with id', playlist.id);
        resolve(playlist);
      })
      .catch(function(err) {
        console.error('Something went wrong!', err);
        reject(err);
      });
    });
  }
};
