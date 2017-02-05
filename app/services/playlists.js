var spotify = require('./spotify');
var Playlist = require('../models/playlist');

module.exports = {
  createPlaylist: function(playlistName, genredId) {
    return spotify.createPlaylist(playlistName)
    .then(function(playlistData) {
      playlist = new Playlist({
        name: playlistData.name,
        spotifyId: playlistData.id,
        externalUrl: playlistData.external_urls.spotify,
        genreId: genredId
      });
      return playlist.save();
    });
  }  
};
