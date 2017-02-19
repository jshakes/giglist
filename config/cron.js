var cron = require('node-cron');
var City = require('../app/models/city');
var cities = require('../app/services/cities');

module.exports = function(app, config) {
  // Update all playlists at 4am EST
  return City.find({})
  .then(function(cityArr) {
    cityArr.forEach(function(city) {
      console.log('Scheduling cron job to update', city.name, 'playlists at 39 minutes past the hour');
      var task =  cron.schedule('0 4 * * *', function() {
        console.log('running the task');
        return cities.updateCityPlaylists(city.id);
      });
      return task;
    });
  });
}
