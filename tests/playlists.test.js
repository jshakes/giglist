require('dotenv').config();
require('../config/db')();
const playlists = require('../app/services/playlists.js');
const Playlist = require('../app/models/playlist');

let testPlaylistModel;

describe('Playlist service methods', () => {
  it('Creates a playlist', () => {
    const testPlaylistData = {
      name: `giglist-testing-${Date.now()}`,
      spotifyName: `giglist-testing-${Date.now()}`,
      tracks: [{
        artist: 'Pretenders',
        songkick: {
          date: '2017-04-03',
          venue: 'Terminal 5',
          name: 'Pretenders with Lowlight at Terminal 5 (April 3, 2017)',
          url: 'http://www.songkick.com/concerts/29292654-pretenders-at-terminal-5?utm_source=38907&utm_medium=partner',
          id: 29292654
        },
        lastfm: {
          tags: [ 
            'rock', 
            '80s', 
            'new wave', 
            'female vocalists', 
            'classic rock'
          ]
        },
        spotify: {
          genres: [ 
            'album rock', 
            'art rock', 
            'classic rock', 
            'dance rock', 
            'folk', 
            'folk christmas', 
            'lilith', 
            'mellow gold', 
            'new romantic', 
            'new wave', 
            'new wave pop', 
            'permanent wave', 
            'pop rock', 
            'power pop', 
            'rock', 
            'roots rock', 
            'singer-songwriter', 
            'soft rock', 
            'synthpop'
          ],
          url: 'https://open.spotify.com/track/6Wiamk8BAAP50gAAJopsy2',
          id: '6Wiamk8BAAP50gAAJopsy2'
        }
      }]
    };
    return playlists.createPlaylist(testPlaylistData)
    .then((savedPlaylist) => {
      testPlaylistModel = savedPlaylist;
      expect(savedPlaylist).toBeInstanceOf(Playlist);
    })
  });
  it('Updates a playlist with an array of tracks', () => {
    const testTrackData = [{
      artist: 'Engelbert Humperdinck',
      songkick: {
        date: '2017-04-04',
        venue: 'St. George Theatre',
        name: 'Engelbert Humperdinck at St. George Theatre (April 4, 2017)',
        url: 'http://www.songkick.com/concerts/28436384-engelbert-humperdinck-at-st-george-theatre?utm_source=38907&utm_medium=partner',
        id: 28436384
      },
      lastfm: {
        tags: [ 
          'oldies', 
          '60s', 
          'easy listening', 
          'pop'
        ]
      },
      spotify: {
        genres: [ 
          'adult standards', 
          'brill building pop', 
          'bubblegum pop', 
          'christmas', 
          'easy listening', 
          'lounge', 
          'mellow gold', 
          'nashville sound', 
          'rock-and-roll', 
          'soft rock'
        ],
        url: 'https://open.spotify.com/track/0vIxAh0xt3gikNAmod9pzc',
        id: '0vIxAh0xt3gikNAmod9pzc'
      },
      genres: [ 
        1, 
        5, 
        13, 
        14
      ]
    }];
    return playlists.replacePlaylistTracks(testPlaylistModel, testTrackData)
    .then((savedPlaylist) => {
      expect(savedPlaylist.tracks[0]).toMatchObject(testTrackData[0]);
    });
  });
  it('Updates the playlist metadata', () => {
    const expects = expect.objectContaining({
      followers: expect.any(Number),
      coverImage: expect.any(String),
      topArtists: expect.arrayContaining([expect.any(String)])
    });
    return playlists.updatePlaylistMeta(testPlaylistModel)
    .then((savedPlaylist) => {
      expect(savedPlaylist).toEqual(expects);
    });
  });
});    
    