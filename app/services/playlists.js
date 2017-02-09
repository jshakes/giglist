var spotify = require('./spotify');
var Playlist = require('../models/playlist');
var _ = require('underscore');

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
  },
  replacePlaylistTracks: function(playlist, tracks) {
    var spotifyIdsToAdd = _.difference(tracks, playlist.tracks).map(function(track) {
      return `spotify:track:${track.spotify.id}`;
    });
    var spotifyIdsToDelete = _.difference(playlist.tracks, tracks).map(function(track) {
      return `spotify:track:${track.spotify.id}`;
    });
    // Replace the playlist track array with the current events
    playlist.tracks = tracks;
    return spotify.addTracksToPlaylist(playlist.spotifyId, spotifyIdsToAdd)
    .then(function() {
      return spotify.deleteTracksFromPlaylist(playlist.spotifyId, spotifyIdsToDelete);
    })
    .then(playlist.save);
  }
};
