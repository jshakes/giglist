var Promise = require('bluebird');
var genres = require('./genres');
var playlists = require('./playlists');

module.exports = {
  createCityGenrePlaylists: function(city) {
    var _this = this;
    var genreArr = genres.allGenreNames();
    return new Promise(function(resolve, reject) {
      Promise.mapSeries(genreArr, function(genre) {
        var playlistName = `Giglist ${city.name} - ${genre}`;
        return playlists.createPlaylist(playlistName)
        .then(function(record) {
          console.log('Associating new Spotify playlist details with city:', record.name);
          city.playlists.push(record);
          city.save();
        })
      })
      .then(resolve);
    });
  }
};
