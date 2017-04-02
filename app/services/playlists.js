var spotify = require('./spotify')();
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
      return playlist.save();
    })
    .catch(function(err) {
      console.error(err);
    });
  },
  replacePlaylistTracks: function(playlist, newTracks) {
    const existingTrackIds = playlist.tracks.map((track) => track.spotify.id);
    const newTrackIds = newTracks.map((track) => track.spotify.id);
    const spotifyIdsToAdd = _.difference(newTrackIds, existingTrackIds);
    const spotifyIdsToDelete = _.difference(existingTrackIds, newTrackIds);
    playlist.tracks = newTracks;
    return spotify.addTracksToPlaylist(playlist.spotifyId, spotifyIdsToAdd)
    .then(() => spotify.deleteTracksFromPlaylist(playlist.spotifyId, spotifyIdsToDelete))
    .then(() => playlist.save())
  },
  updatePlaylistMeta: function(playlist) {
    console.log('Updating playlist meta for', playlist.id);
    // get the latest top artists, followers and cover image for a playlist from spotify
    return spotify.getPlaylistMeta(playlist.spotifyId)
    .then(function(spotifyMeta) {
      // update number of followers
      playlist.followers = spotifyMeta.followers.total;
      // update cover art mosaic image
      playlist.coverImage = spotifyMeta.images[0].url;
      // find the most popular artists featured in this playlist
      var artistIdArr = spotifyMeta.tracks.items.map(function(item) {
        if(item && item.track && item.track.artists && item.track.artists.length) {
          return item.track.artists[0].id;
        }
      });
      return spotify.getArtistsMeta(artistIdArr)
    })
    .then(function(artistInfoArr) {
      var topArtists = _.pluck(_.sortBy(artistInfoArr, function(artist) {
        return -artist.popularity;
      }), 'name').slice(0, 5);
      playlist.topArtists = topArtists;
      return playlist.save();
    });
  }
};
