/*
  City

  A city with a name, Songkick Metro ID, and 0 to many playlists
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var URLSlugs = require('mongoose-url-slugs');

var schema = new Schema({
  name: String,
  created: {
    type: Date,
    default: Date.now()
  },
  slug: String,
  metroId: Number,
  playlists: [{
    type: Schema.Types.ObjectId,
    ref: 'Playlist'
  }]
});

schema.plugin(URLSlugs('name'));

module.exports = mongoose.model('City', schema);
