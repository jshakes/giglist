/*
  Playlist

  A playlist with a Spotify ID and 0 to many tracks
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var URLSlugs = require('mongoose-url-slugs');

var schema = new Schema({
  name: String,
  spotifyName: String,
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  genreId: Number,
  spotifyId: String,
  coverImage: String,
  externalUrl: String,
  description: String,
  followers: {
    type: Number,
    default: 0
  },
  topArtists: [String],
  tracks: [Schema.Types.Mixed]
});

schema.pre('update', function() {
  this.update({},{ $set: { updated: new Date() } });
});
schema.plugin(URLSlugs('name', {field: 'slug'}));
module.exports = mongoose.model('Playlist', schema);
