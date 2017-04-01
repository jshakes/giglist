const Promise = require('bluebird');
const SpotifyWebApi = require('spotify-web-api-node');
const levenshtein = require('fast-levenshtein');
const Bottleneck = require('bottleneck');
const arrayLib = require('../lib/arrays');

const SPOTIFY_CONFIG = {
  username: process.env.SPOTIFY_USERNAME,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
  redirectUri: 'http://localhost:3000'
};
const MAX_TRACK_ARRAY = 50;
const ARTIST_BLACKLIST = ['djs', 'various artists'];

module.exports = () => {

  const limiter = new Bottleneck(1, 500);  
  let spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
  
  function _authenticate() {
    return new Promise(function(resolve, reject) {
      spotifyApi.refreshAccessToken()
      .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        resolve(spotifyApi);
      })
      .catch(function(err) {
        console.error('Failed to authenticate Spotify', err);
        reject(err);
      });
    });
  }
  
  const spotify = {
    /**
     * Search for an artist on Spotify and return the artist object of the first result
     * @param artistName {String} The artist to search form
     * @return artistID {String} The Spotify ID of the first artist result
     */
    _getArtistByName: (query) => {
      if(spotify._inBlacklist(query)) {
        console.log('Artist query found in blacklist:', query);
        return Promise.resolve();
      }
      return _authenticate()
      .then(() => spotifyApi.searchArtists(query))
      .then(function(data) {
        let artist;
        // get the first artist name with a levenshtein distance of less than n
        if(data.body.artists.items.length) {
          artist = data.body.artists.items.find(function(artist) {
            return levenshtein.get(query, artist.name, {useCollator:true}) < 2;
          });
        }
        return artist;
      })
      .catch(function(err) {
        console.error('Something went wrong!', err);
        return err;
      });
    },
    _inBlacklist: (query) => {
      const lower = query.toLowerCase();
      return ARTIST_BLACKLIST.indexOf(lower) !== -1;
    },
    getPlaylistMeta: (playlistId) => {
      return _authenticate()
      .then(() => spotifyApi.getPlaylist(SPOTIFY_CONFIG.username, playlistId))
      .then((data) => data.body)
    },
    getArtistsMeta: (artistIdArr) => {
      let artistInfoArr = [];
      return _authenticate()
      .then(() => Promise.mapSeries(artistIdArr, (artistId) => {
        return limiter.schedule(spotifyApi.getArtist.bind(spotifyApi), artistId)
        .then((data) => {
          const artistInfo = data.body;
          console.log('Found data for', artistInfo.name);
          artistInfoArr.push({
            name: artistInfo.name,
            popularity: artistInfo.popularity,
            spotifyId: artistInfo.id
          });
        });
      }))
      .then(() => artistInfoArr);
    },
    getArtistMostPopularTrack: (artistName) => {
      return spotify._getArtistByName(artistName)
      .then((artist) => {
        if(!artist) {
          // nullify the whole track if there were no artists
          console.log('No artist on Spotify called', artistName);
          return null;
        }
        let track = {
          genres: artist.genres
        };
        // todo: customize for region
        return limiter.schedule(spotifyApi.getArtistTopTracks.bind(spotifyApi), artist.id, 'US')
        .then(function(data) {
          if(data.body.tracks.length) {
            // Get the most popular track that isn't a collab with another artist
            const topTrack = data.body.tracks.find(function(track) {
              return track.artists.length === 1;
            });
            if(topTrack) {
              track.topTrackId = topTrack.id;
              track.topTrackName = topTrack.name;
              track.topTrackUrl = topTrack.external_urls.spotify;
            }
            else {
              track = null;
            }
          }
          else {
            // nullify the whole track if there were no tracks available
            track = null;
          }
          return track;
        })
        .catch(function(err) {
          console.error('Something went wrong!', err);
          reject(err);
        });
      });
    },
    createPlaylist: (playlistName) => {
      return new Promise((resolve, reject) => {
        _authenticate()
        .then(() => {
          console.log('Attempting to create a playlist called', playlistName);
          return spotifyApi.createPlaylist(SPOTIFY_CONFIG.username, playlistName, { public: true })
        })
        .then((data) => {
          const playlist = data.body;
          console.log('Created new Spotify playlist', playlist.name, 'with id', playlist.id);
          resolve(playlist);
        })
        .catch((err) => {
          console.error('Something went wrong!', err);
          reject(err);
        });
      });
    },
    addTracksToPlaylist: (playlistId, tracks) => {
      if(!tracks.length) {
        console.log('No tracks to add to', playlistId);
        return Promise.resolve();
      }
      const parsedTrackArr = tracks.map((track) => `spotify:track:${track}`);
      const chunkedTrackArr = arrayLib.chunkArray(parsedTrackArr, MAX_TRACK_ARRAY);
      return new Promise(function(resolve, reject) {
        _authenticate()
        .then(() => Promise.mapSeries(chunkedTrackArr, (trackChunk) => {
          return spotifyApi.addTracksToPlaylist(SPOTIFY_CONFIG.username, playlistId, trackChunk);
        }))
        .then((data) => {
          console.log('added tracks', tracks, 'to playlist', playlistId);
          resolve(data[0].body);
        })
        .catch((err) => {
          console.error('Something went wrong trying to add', tracks.length, 'track to', playlistId, err);
          reject(err);
        });
      });
    },
    deleteTracksFromPlaylist: (playlistId, tracks) => {
      if(!tracks.length) {
        console.log('No tracks to delete from', playlistId);
        return Promise.resolve();
      }
      const parsedTrackArr = tracks.map((track) => { return {uri: `spotify:track:${track}`}});
      const chunkedTrackArr = arrayLib.chunkArray(parsedTrackArr, MAX_TRACK_ARRAY);
      return new Promise((resolve, reject) => {
        _authenticate()
        .then(() => Promise.mapSeries(chunkedTrackArr, (trackChunk) => {
          return spotifyApi.removeTracksFromPlaylist(SPOTIFY_CONFIG.username, playlistId, trackChunk);
        }))
        .then((data) => {
          console.log('deleted tracks', tracks, 'from playlist', playlistId);
          resolve(data[0].body);
        })
        .catch((err) => {
          console.error('Something went wrong attempting to delete', tracks.length, 'tracks from', playlistId, err);
          reject(err);
        });
      });
    }
  };
  
  return spotify;
};
