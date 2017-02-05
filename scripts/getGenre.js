const genres = require('../app/services/genres');
const tag = process.argv[2];
console.log(genres.getGenreFromTag(tag));
process.exit();
