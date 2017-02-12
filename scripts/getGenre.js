const genres = require('../app/services/genres');
const artist = process.argv[2];
genres.getArtistGenres(artist)
.then(function(tags) {
  console.log(tags);
  process.exit();
});
