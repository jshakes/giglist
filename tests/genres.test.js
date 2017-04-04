require('dotenv').config();
var genres = require('../app/services/genres');

describe('Genre service methods', () => {
  it('Returns the genre map as an array of objects', () => {
    const expects = expect.arrayContaining([
      expect.any(Object)
    ]);
    return expect(genres.getGenres()).toEqual(expects);
  });
  it('Returns an array of genre names as strings we will map to', () => {
    const expects = expect.arrayContaining([
      expect.any(String)
    ]);
    return expect(genres.getGenreNames()).toEqual(expects);
  });
  it('Returns an array of genre IDs for an artist by name', () => {
    const expects = expect.arrayContaining([
      expect.any(Number)
    ]);
    return genres._getArtistGenres({artist:'David Bowie'})
    .then((genreIds) => {
      expect(genreIds).toEqual(expects);
    });
  });
});   
