var Promise = require('bluebird');
var genres = require('./genres');
var playlists = require('./playlists');

module.exports = {
  _createCityPlaylist: function(city, playlistData) {
    return playlists.createPlaylist(playlistData)
    .then(function(record) {
      console.log('Associating playlist', record.id, 'with city', city.id);
      city.playlists.push(record);
      return city.save();
    });
  },
  createCityGenrePlaylists: function(city) {
    var _this = this;
    var genreArr = genres.getGenres();
    return new Promise(function(resolve, reject) {
      Promise.mapSeries(genreArr, function(genre) {
        var playlistData = {
          name: `Giglist ${city.name} - ${genre.name}`,
          genreId: genre.id
        };        
        return _this._createCityPlaylist(city, playlistData);
      })
      .then(resolve);
    });
  }
};
