var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('underscore');

var SPOTIFY_CONFIG = _.pluck(config.spotify, 'accessToken', 'refreshToken', 'clientId', 'clientSecret', 'redirectUri');

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
  addTracksToPlaylist: function(tracks) {

    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {

      spotifyApi.refreshAccessToken()
      .then(spotifyApi.addTracksToPlaylist('jshakes', '2hPN2te8wwnKrI4UoqtOUS', tracks))
      .then(function(data) {
          
        console.log('Added tracks to playlist!');
        resolve(data);
      }, function(err) {
        
        console.error('Something went wrong!', err);
        reject(err);
      });
    });
  },
  createPlaylist: function(playlistName) {

    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {
    
      spotifyApi.refreshAccessToken()
      .then(spotifyApi.createPlaylist(config.spotify.username, playlistName { public: true }))
      .then(function(data) {

        console.log('Created new Spotify playlist \'playlistName\' with ID', data.id);
        resolve(data);
      }, function(err) {

        console.error('Something went wrong!', err);
        reject(err);
      })
    });
  }
};
