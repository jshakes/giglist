/*
  Track

  A track with a Spotify ID and an associated Songkick event ID
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  spotifyId: String,
  songkickId: String,
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Track', schema);
