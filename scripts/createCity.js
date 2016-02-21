/*
  Create City

  Given the name of a city:
  - fetches Songkick metro ID
  - adds city to the DB
  - creates a playlist for each specified genre
  - populates the playlist with tracks
 */

var app = require('../app');
var City = require('../app/models/city');
var songkick = require('../app/services/songkick');

var coords = process.argv[2];

songkick.getMetroFromCoords(coords)
  .then(function(location) {

    var params = {
      name: location.metroArea.displayName,
      metroId: location.metroArea.id
    }

    // Add the state if it's a US city
    if(location.metroArea.state) {

      params.name += ', ' + location.metroArea.state;
    }

    var city = new City(params);
    console.log('attempting to save', city);
    city.save(function(err) {

      if(err) {

        console.error(err);
      }
      else {

        console.log('City saved');
      }
    });
  })
  .then(function() {

  })
  .catch(function(err) {

    console.error(err);
  });
