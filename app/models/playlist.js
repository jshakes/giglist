/*
  Playlist

  A playlist with a Spotify ID and 0 to many tracks
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var spotify = require('../services/spotify');

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
  genre: String,
  tracks: [{
    type: Schema.Types.ObjectId,
    ref: 'Track'
  }]
});

schema.pre('update', function() {

  this.update({},{ $set: { updated: new Date() } });
});

/**
 * Create a Spotify playlist and save its ID when a new model is created
 */
schema.pre('init', function(next) {

  spotify.createPlaylist()
  .then(function(data) {

    this.spotifyId = data.id;
    next();
  });
});

module.exports = mongoose.model('Playlist', schema);
