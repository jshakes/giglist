/*
  Create City

  Given the name of a city:
  - fetches Songkick metro ID
  - adds city to the DB
  - creates a playlist for each specified genre
  - populates the playlist with tracks
 */

var songkick = require('../services/songkick');

var coords = process.argv[2];

songkick.getMetroFromCoords(coords)
  .then(function(location) {

    console.log('found:', location);
  })
  .catch(function(err) {

    console.error(err);
  });
