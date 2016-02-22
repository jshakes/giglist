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
      metroId: location.metroArea.id,
      latitude: location.metroArea.lat,
      longitude: location.metroArea.lng,
      country: location.metroArea.country.displayName
    };

    // Add the state if it's a US city
    if(location.metroArea.state) {

      params.name += ', ' + location.metroArea.state.displayName;
    }

    var city = new City(params);
    console.log('attempting to save', city);
    return city.save();
  })
  .then(function() {

    console.log('City saved');
    process.exit();
  })
  .catch(function(err) {

    return console.error(err);
  });
