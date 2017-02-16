var spotify = require('./spotify');
var Playlist = require('../models/playlist');
var _ = require('underscore');

module.exports = {
  createPlaylist: function(playlistData) {      
    return spotify.createPlaylist(playlistData.spotifyName)
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
    var existingTrackIds = playlist.tracks.map(function(track) {
      return `spotify:track:${track.spotify.id}`;
    });
    var newTrackIds = tracks.map(function(track) {
      return `spotify:track:${track.spotify.id}`;
    });
    var spotifyIdsToAdd = _.difference(newTrackIds, existingTrackIds);
    var spotifyIdsToDelete = _.difference(existingTrackIds, newTrackIds);
    // Replace the playlist track array with the current events
    playlist.tracks = tracks;
    return spotify.addTracksToPlaylist(playlist.spotifyId, spotifyIdsToAdd)
    .then(function() {
      return spotify.deleteTracksFromPlaylist(playlist.spotifyId, spotifyIdsToDelete);
    })
    .then(function() {
      return playlist.save()
    });
  }
};
