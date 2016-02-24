/*
  Update City

  Upsert the playlist(s) for a city
 */

var app = require('../app');
var City = require('../app/models/city');
var songkick = require('../app/services/songkick');

var id = process.argv[2];

City.findById(id).then(function(city) {

  
});
