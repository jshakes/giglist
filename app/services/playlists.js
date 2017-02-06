var spotify = require('./spotify');
var Playlist = require('../models/playlist');

module.exports = {
  createPlaylist: function(playlistName, genreId) {
    return spotify.createPlaylist(playlistName)
    .then(function(playlistData) {
      playlist = new Playlist({
        name: playlistData.name,
        spotifyId: playlistData.id,
        externalUrl: playlistData.external_urls.spotify,
        genreId: genreId
      });
      return playlist.save();
    });
  }  
};
