var Promise = require('bluebird');
var genres = require('./genres');
var playlists = require('./playlists');

module.exports = {
  createCityGenrePlaylists: function(city) {
    var _this = this;
    var genreArr = genres.getGenres();
    return new Promise(function(resolve, reject) {
      Promise.mapSeries(genreArr, function(genre) {
        var playlistName = `Giglist ${city.name} - ${genre.name}`;
        return playlists.createPlaylist(playlistName, genre.id)
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
