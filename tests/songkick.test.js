require('dotenv').config();
var songkick = require('../app/services/songkick')();

describe('Songkick service methods', () => {
  it('Finds the New York Songkick metro area from Latitude and Longitude', () => {
    const expects = expect.objectContaining({
      metroArea: expect.objectContaining({
        displayName: 'New York'
      })
    });
    return songkick.getMetroFromCoords('40.712784,-74.005941')
    .then((metroObject) => {
      expect(metroObject).toEqual(expects);
    });
  });
  it('Gets an array of artists playing in New York over the next 2 weeks', () => {
    const expects = expect.arrayContaining([
      {
        artist: expect.any(String),
        songkick: expect.any(Object)
      }
    ]);
    return songkick.getEvents(7644)
    .then((events) => {
      expect(events).toEqual(expects);
    });
  }, 120000);
});
