/*
  Update City

  Upsert the playlist(s) for a city
 */

var app = require('../app');
var cities = require('../app/services/cities');

var id = process.argv[2];

cities.updateCityPlaylists(id)
.then(function() {
  return console.log('Playlist model saved, exiting');
  process.exit();
})
.catch(function(err) {
  return console.error(err);
  process.exit();
});
