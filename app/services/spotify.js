var Promise = require('bluebird');
var prompt = require('prompt');
var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('underscore');
var config = require('../../config/config');

var SPOTIFY_CONFIG = config.spotify;

var spotify = {
  /**
   * Search for an artist on Spotify and return the artist object of the first result
   * @param artistName {String} The artist to search form
   * @return artistID {String} The Spotify ID of the first artist result
   */
  _getArtistByName: function(artistName) {

    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);

    return new Promise(function(resolve, reject) {

      spotifyApi.searchArtists(artistName)
      .then(function(data) {

        // get the artist ID, if it exists
        var artist = data.body.artists.items.length ? data.body.artists.items[0] : null;
        resolve(artist);
      })
      .catch(function(err) {
       
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

    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);

    return new Promise(function(resolve, reject) {

      spotify._getArtistByName(artistName)
      .then(function(artist) {

        if(artist === null) {

          // nullify the whole track if there were no artists
          return resolve(null);
        }
        var track = {
          genres: artist.genres
        };
        spotifyApi.getArtistTopTracks(artist.id, 'US')
        .then(function(data) {
          
          if(data.body.tracks.length) {
            var topTrack = data.body.tracks[0];
            track.topTrackId = topTrack.id;
            track.topTrackName = topTrack.name;
            track.topTrackUrl = topTrack.external_urls.spotify;
          }
          else {
            // nullify the whole track if there were no tracks available
            track = null;
          }
          resolve(track);
        })
        .catch(function(err) {

          console.error('Something went wrong!', err);
          reject(err);
        });
      });
    })
  },
  addTracksToPlaylist: function(playlistId, tracks) {

    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {

      spotify._authenticate(spotifyApi)
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
    
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {
      
      spotify._authenticate(spotifyApi)
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

module.exports = spotify;
