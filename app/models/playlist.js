/*
  Playlist

  A playlist with a Spotify ID and 0 to many tracks
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  spotifyId: String,
  externalUrl: String,
  description: String,
  followers: {
    type: Number,
    default: 0
  },
  tracks: [{
    artist: String,
    track: String,
    genres: [String],
    spotify: {},
    songkick: {}
  }]
});

schema.pre('update', function() {
  
  this.update({},{ $set: { updated: new Date() } });
});

module.exports = mongoose.model('Playlist', schema);
