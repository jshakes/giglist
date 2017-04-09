/*
  Update City

  Update/Create playlists for a city based on the genres array
 */

const Promise = require('bluebird');
const _ = require('underscore');
const app = require('../app');
const City = require('../app/models/city');
const genres = require('../app/services/genres');
const playlists = require('../app/services/playlists');
const spotify = require('../app/services/spotify')();

var id = process.argv[2];

return City.findById(id)
.populate('playlists')
.then(function(city) {
  const genreArr = genres.getGenres();
  return Promise.mapSeries(genreArr, (genre) => {
    const playlist = _.findWhere(city.playlists, {
      genreId: genre.id
    });
    const spotifyName = playlists.generatePlaylistSpotifyName(city.name, genre.name);
    const spotifyDescription = playlists.generatePlaylistSpotifyDescription(city.name, genre.name);
    return spotify.updatePlaylist(playlist.spotifyId, {
      name: spotifyName,
      description: spotifyDescription
    })
    .then(() => {
      playlist.name = genre.name;
      playlist.spotifyName = spotifyName;
      playlist.description = spotifyDescription;
      return playlist.save();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  })
  .then((playlists) => {
    console.log('Updated all playlists');
  });
});
