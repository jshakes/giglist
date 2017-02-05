const genres = require('../app/services/genres');
const lastfm = require('../app/services/lastfm');
const artist = process.argv[2];
lastfm.getArtistTagArray(artist)
.then(function(tags) {
  console.log(genres.getGenreFromTag(tags[0]));
  process.exit();
});
