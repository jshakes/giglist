var SpotifyWebApi = require('spotify-web-api-node');
var SPOTIFY_CONFIG = {
  clientId: '29322511988c4e5a92ca78ba8f109842',
  clientSecret: 'f52f057dd25c42108fdeb1216d4e9c73',
  redirectUri: 'http://www.example.com/callback'
};

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

          var trackId = data.body.tracks.length ? data.body.tracks[0].id : 0;
          resolve(trackId);
        }, function(err) {

          console.error('Something went wrong!', err);
          reject(err);
        });
      });
    })
  }
};
