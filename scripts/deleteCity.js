/*
  Delete City

  Remove a city from the database given its name
 */


var app = require('../app');
var City = require('../app/models/city');

var id = process.argv[2];

City.findById(id).remove().then(function(deleted) {

  console.log('City removed');
  process.exit();
}).catch(function(err) {

  console.error(err);
});
