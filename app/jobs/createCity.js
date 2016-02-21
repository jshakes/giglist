/*
  Create City

  Given the name of a city:
  - fetches Songkick metro ID
  - adds city to the DB
  - creates a playlist for each specified genre
  - populates the playlist with tracks
 */

var songkick = require('../services/songkick');
var City = require('../models/city');

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
    return city.save();
  })
  .then(function() {

    console.log('City saved');
  })
  .catch(function(err) {

    console.error(err);
  });
