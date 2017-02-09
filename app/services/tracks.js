var Promise = require('bluebird');
var genres = require('./genres');
var spotify = require('./spotify');

var tracks = {
  _getArtistTrack: function(track) {
    console.log('Finding a track for', track.artist);
    // Get each artist's genre and most popular track
    return genres.getArtistGenres(track.artist)
    .then(function(genreArr) {
      if(!genreArr || !genreArr.length) {
        throw 'No genres found for ' + track.artist;        
      }
      console.log('Found the following genres for', track.artist, genreArr);
      track = Object.assign(track, {
        genres: genreArr
      });
      return track.artist;
    })
    .then(spotify.getArtistMostPopularTrack)
    .then(function(spotifyTrack) {
      // scrap anything we couldn't find a spotify track for
      if(spotifyTrack === null) {
        throw 'No suitable track found for ' + track.artist;
      }
      console.log('Found track', spotifyTrack.topTrackName, 'for', track.artist);
      track = Object.assign(track, {
        name: spotifyTrack.topTrackName,
        spotify: {
          id: spotifyTrack.topTrackId,
          url: spotifyTrack.topTrackUrl,
          genres: spotifyTrack.genres
        }
      });
      return track;
    })
    .catch(function(err) {
      console.error(err);
    });
  },
  getArtistTracks: function(eventObj) {
    return Promise.mapSeries(eventObj.events, tracks._getArtistTrack)
    .then(function(events) {
      // Remove any null events
      var cleanEvents = events.filter(function(event) {
        return !!event;
      });
      return Object.assign(eventObj, {
        events: cleanEvents
      });
    })
    .catch(function(err) {
      console.error(err);
    });
  }
};

module.exports = tracks;
