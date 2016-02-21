/*
  City

  A city with a name, Songkick Metro ID, and 0 to many playlists
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  created: Date,
  metroId: Number,
  playlists: [{
    type: Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  created: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('City', schema);
