var spotify = require('./spotify');
var Playlist = require('../models/playlist');

module.exports = {
  createPlaylist: function(playlistData) {      
    return spotify.createPlaylist(playlistData.name)
    .then(function(spotifyPlaylistData) {
      playlistData = Object.assign(playlistData, {
        spotifyId: spotifyPlaylistData.id,
        externalUrl: spotifyPlaylistData.external_urls.spotify
      });
      playlist = new Playlist(playlistData);
      return playlist.save()
    })
    .catch(function(err) {
      console.error(err);
    });
  }
};
