var cron = require('node-cron');
var City = require('../app/models/city');
var cities = require('../app/services/cities');

module.exports = function(app, config) {
  // Update all playlists at 4am EST
  return City.find({})
  .then(function(cityArr) {
    cityArr.forEach(function(city) {
      console.log('Scheduling cron job to update', city.name, 'playlists at 4am');
      var task =  cron.schedule('30 23 * * *', function() {
        console.log('running the task');
        return cities.updateCityPlaylists(city.id);
      });
      return task;
    });
  });
}
