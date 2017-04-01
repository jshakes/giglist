require('dotenv').config();
var spotify = require('../app/services/spotify')();
let testPlaylistId;

describe('Spotify service methods', () => {
  it('Finds an artist object by string', () => {
    const expects = expect.objectContaining({
      name: 'David Bowie'
    });
    return spotify._getArtistByName('david bowie')
    .then((artistObject) => {
      expect(artistObject).toEqual(expects);
    });
  }, 10000);
  it('Gets an array of objects for artists by their IDs', () => {
    const expects = expect.arrayContaining([
      expect.objectContaining({
        name: 'Hot Chip'
      }),
      expect.objectContaining({
        name: 'David Bowie'
      }),
      expect.objectContaining({
        name: 'LCD Soundsystem'
      })
    ]);
    return spotify.getArtistsMeta(['37uLId6Z5ZXCx19vuruvv5', '0oSGxfWSnnOXhD2fKuz2Gy', '066X20Nz7iquqkkCW6Jxy6'])
    .then((artistsArray) => {
      expect(artistsArray).toEqual(expects);
    });
  }, 10000);
  it('Gets the most popular track for an artist by name', () => {
    const expects = expect.objectContaining({
      topTrackId: expect.any(String)
    });
    return spotify.getArtistMostPopularTrack('David Bowie')
    .then((trackObject) => {
      expect(trackObject).toEqual(expects);
    });
  }, 10000);
  it('Creates a test playlist', () => {
    const expects = expect.objectContaining({
      owner: expect.objectContaining({
        id: process.env.SPOTIFY_USERNAME
      })
    });
    return spotify.createPlaylist(`giglist-testing-${Date.now()}`)
    .then((playlistObject) => {
      testPlaylistId = playlistObject.id;
      expect(playlistObject).toEqual(expects);
    });
  }, 10000);
  it('Gets information about the test playlist from its ID', () => {
    const expects = expect.objectContaining({
      owner: expect.objectContaining({
        id: process.env.SPOTIFY_USERNAME
      })
    });
    return spotify.getPlaylistMeta(testPlaylistId)
    .then((playlistObject) => {
      expect(playlistObject).toEqual(expects);
    });
  }, 10000);
  it('Adds What is Love by Haddaway to the test playlist', () => {
    const expects = expect.objectContaining({
      snapshot_id: expect.any(String)
    });
    return spotify.addTracksToPlaylist(testPlaylistId, ['0lqNstW27BvhHXn6sqyQhX'], process.env.SPOTIFY_USERNAME)
    .then((response) => {
      expect(response).toEqual(expects);
    });
  });
  it('Removes What is Love by Haddaway from the test playlist', () => {
    const expects = expect.objectContaining({
      snapshot_id: expect.any(String)
    });
    return spotify.deleteTracksFromPlaylist(testPlaylistId, ['0lqNstW27BvhHXn6sqyQhX'])
    .then((response) => {
      expect(response).toEqual(expects);
    });
  }, 10000);
});

afterAll(() => {
  console.log('\n----- NOTICE -----\nYou should now manually delete the empty test playlist with ID', testPlaylistId, 'from within the Spotify App. This action is not supported by the API.')
});
