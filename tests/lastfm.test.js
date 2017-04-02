require('dotenv').config();
const lastfm = require('../app/services/lastfm')();

describe('Last.fm service methods', () => {
  it('Gets an array of genre tags from an artist name', () => {
    const expects = expect.arrayContaining([
      expect.any(String)
    ]);
    return lastfm.getArtistTagArray('david bowie')
    .then((tags) => {
      expect(tags).toEqual(expects);
    });
  }, 10000);
});
