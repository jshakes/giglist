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
  it('Returns an array of genre IDs for an artist by name when there are no Spotify genres', () => {
    const expects = expect.arrayContaining([
      expect.any(Number)
    ]);
    return genres._getArtistGenres({artist: 'Floating Points'})
    .then((genreIds) => {
      expect(genreIds).toEqual(expects);
    });
  });
  it('Returns an array of genre IDs for an artist by name when there are Spotify genres', () => {
    const expects = expect.arrayContaining([
      expect.any(Number)
    ]);
    const input = {
      artist: 'Floating Points',
      spotify: {
        genres: ['bass music', 'chamber psych', 'chillwave', 'deep house', 'electronic', 'float house', 'fluxwork', 'future garage', 'indie jazz', 'indie r&b', 'indietronica', 'microhouse', 'minimal techno', 'new rave', 'ninja', 'nu jazz', 'outsider house', 'trip hop', 'uk garage', 'wonky']
      }
    };
    return genres._getArtistGenres(input)
    .then((genreIds) => {
      expect(genreIds).toEqual(expects);
    });
  });
});   
