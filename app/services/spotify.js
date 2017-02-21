var Promise = require('bluebird');
var prompt = require('prompt');
var SpotifyWebApi = require('spotify-web-api-node');
var levenshtein = require('fast-levenshtein');
var _ = require('underscore');
var config = require('../../config/config');
var arrayLib = require('../lib/arrays');

var SPOTIFY_CONFIG = config.spotify;
var MAX_TRACK_ARRAY = 50;
var ARTIST_BLACKLIST = ['djs', 'various artists']; // Lowercase array of artist queries to ignore

var spotify = {
  _authenticate: function(spotifyApi) {
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
  },
  /**
   * Search for an artist on Spotify and return the artist object of the first result
   * @param artistName {String} The artist to search form
   * @return artistID {String} The Spotify ID of the first artist result
   */
  _getArtistByName: function(query) {
    if(spotify._inBlacklist(query)) {
      console.log('Artist query found in blacklist:', query);
      return Promise.resolve();
    }
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {
      spotifyApi.searchArtists(query)
      .then(function(data) {
        var artist;
        // get the first artist name with a levenshtein distance of less than n
        if(data.body.artists.items.length) {
          artist = data.body.artists.items.find(function(artist) {
            return levenshtein.get(query, artist.name, {useCollator:true}) < 2;
          });
        }
        resolve(artist);
      })
      .catch(function(err) {
        console.error('Something went wrong!', err);
        reject(err);
      });
    });
  },
  _inBlacklist: function(query) {
    var lower = query.toLowerCase();
    return ARTIST_BLACKLIST.indexOf(lower) !== -1;
  },
  getPlaylistMeta: function(playlistId) {
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return spotify._authenticate(spotifyApi)
    .then(function() {
      return spotifyApi.getPlaylist(SPOTIFY_CONFIG.username, playlistId);
    })
    .then(function(data) {
      return data.body;
    });
  },
  getArtistsMeta: function(artistIdArr) {
    var artistInfoArr = [];
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return spotify._authenticate(spotifyApi)
    .then(function() {
      return Promise.mapSeries(artistIdArr, function(artistId) {
        return spotifyApi.getArtist(artistId)
        .then(function(data) {
          var artistInfo = data.body;
          console.log('Found data for', artistInfo.name);
          artistInfoArr.push({
            name: artistInfo.name,
            popularity: artistInfo.popularity,
            spotifyId: artistInfo.id
          });
        });
      });
    })
    .then(function() {
      return artistInfoArr;
    });
  },
  getArtistMostPopularTrack: function(artistName) {
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {

      spotify._getArtistByName(artistName)
      .then(function(artist) {
        if(!artist) {
          // nullify the whole track if there were no artists
          console.log('No artist on Spotify called', artistName);
          return resolve(null);
        }
        var track = {
          genres: artist.genres
        };
        // todo: customize for region
        spotifyApi.getArtistTopTracks(artist.id, 'US')
        .then(function(data) {
          if(data.body.tracks.length) {
            // Get the most popular track that isn't a collab with another artist
            var topTrack = data.body.tracks.find(function(track) {
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
          resolve(track);
        })
        .catch(function(err) {

          console.error('Something went wrong!', err);
          reject(err);
        });
      });
    })
  },
  addTracksToPlaylist: function(playlistId, tracks) {
    if(!tracks.length) {
      console.log('No tracks to add to', playlistId);
      return Promise.resolve();
    }
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    var chunkedTrackArr = arrayLib.chunkArray(tracks, MAX_TRACK_ARRAY);
    return new Promise(function(resolve, reject) {
      spotify._authenticate(spotifyApi)
      .then(function() {
        return Promise.mapSeries(chunkedTrackArr, function(trackChunk) {
          return spotifyApi.addTracksToPlaylist(SPOTIFY_CONFIG.username, playlistId, trackChunk)
        });
      })
      .then(function(data) {
        console.log('added tracks', tracks, 'to playlist', playlistId);
        resolve(data);
      })
      .catch(function(err) {
        console.error('Something went wrong trying to add', tracks.length, 'to', playlistId, err);
        reject(err);
      });
    });
  },
  deleteTracksFromPlaylist: function(playlistId, tracks) {
    if(!tracks.length) {
      console.log('No tracks to delete from', playlistId);
      return Promise.resolve();
    }
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    var parsedTrackArr = tracks.map(function(track) {
      return {
        uri: track
      }
    });
    var chunkedTrackArr = arrayLib.chunkArray(parsedTrackArr, MAX_TRACK_ARRAY);
    return new Promise(function(resolve, reject) {
      spotify._authenticate(spotifyApi)
      .then(function() {
        return Promise.mapSeries(chunkedTrackArr, function(trackChunk) {
          return spotifyApi.removeTracksFromPlaylist(SPOTIFY_CONFIG.username, playlistId, trackChunk)
        });
      })
      .then(function(data) {
        console.log('deleted tracks', tracks, 'from playlist', playlistId);
        resolve(data);
      })
      .catch(function(err) {
        console.error('Something went wrong attempting to delete', tracks.length, 'tracks from', playlistId, err);
        reject(err);
      });
    });
  },
  createPlaylist: function(playlistName) {
    
    var spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);
    return new Promise(function(resolve, reject) {
      
      spotify._authenticate(spotifyApi)
      .then(function() {
        console.log('Attempting to create a playlist called', playlistName);
        return spotifyApi.createPlaylist(SPOTIFY_CONFIG.username, playlistName, { public: true })
      })
      .then(function(data) {
        var playlist = data.body;
        console.log('Created new Spotify playlist', playlist.name, 'with id', playlist.id);
        resolve(playlist);
      })
      .catch(function(err) {
        console.error('Something went wrong!', err);
        reject(err);
      });
    });
  }
};

module.exports = spotify;
