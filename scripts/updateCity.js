/*
  Update City

  Upsert the playlist(s) for a city
 */

var app = require('../app');
var City = require('../app/models/city');
var songkick = require('../app/services/songkick');
var spotify = require('../app/services/spotify');

var id = process.argv[2];

City.findById(id).then(function(city) {
  
  var i = 0;
  // Get upcoming events for the city
  songkick.getEventsArtists(id).then(function(artists) {

    console.log('there are this many artists to get through:', artists.length);
    async.mapSeries(artists, function(artist, callback) {

      // Get each artist's most popular track and save it to an array
      spotify.getArtistMostPopularTrack(artist.displayName).then(function(trackId) {

        i++;
        callback(null, trackId);
        console.log('called', i, 'times.', 'Track ID is', trackId);
      });
    // All items have been iterated over
    }, function(err, trackArr) {

      var validTracks = _.filter(trackArr, function(item) {
        return item !== 0;
      });
      spotify.addTracksToPlaylist(validTracks).then(function(data) {

        res.json({
          response: data,
          tracksAdded: validTracks
        });
      });
    });
  });
});
