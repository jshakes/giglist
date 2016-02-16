var SpotifyWebApi = require('spotify-web-api-node');
var SPOTIFY_CONFIG = {
  accessToken: 'BQAiOOvGDhOHxXQVHT4E8Nx9PLYaIkyTbNUlMrXnBICOPHJ_llsx3JCpxkkypZWoBHUElvMhZrPGoWfKmYjUcDSJsdx8xp2rdvTw-QBisfUA5XRFVC4gvUakwsG5vZVks-1kHk_PFLtQT7Cy_FFaeRSBfW_oNgSYmA2FHVgV2Q0R0ekSDrBgQLY',
  refreshToken: 'AQAxd_QaSh06fZbP_fjDXtUr-mAJNQ07HJVBwEau97sTjElpckbFJGjZwaqOvhBuUKbuYdfdiF-H7o7jEw4IsuzOmLVNGx6N8QHi3VC7K5KI5w9gdikbMxUsWN4mOcpe62E',
  clientId: '29322511988c4e5a92ca78ba8f109842',
  clientSecret: 'f52f057dd25c42108fdeb1216d4e9c73',
  redirectUri: 'http://localhost:3000'
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
    var code = 'AQAqma-1uuw4dGIYSaqUcsxUBAWYm08jRSEohtvbxA83E3kq7mYI2xBjgzPK2YygCBd38-fFrVJ7sPj961O9wWQ6PadwXKqrVw1c7Wk5_UOz_b5K8ZVTJrN2bhX-jRXRtp3ePDpnjn0Codsi7Kl7PtacjSc9s0Ln8yB1ITW34dER32Br_TYXQlmOoIn1u_IP26ve2SIHB3lg8-FQzV7J179GBw';
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
  }
};
