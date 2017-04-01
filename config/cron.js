var CronJob = require('cron').CronJob;
var City = require('../app/models/city');
var cities = require('../app/services/cities');

module.exports = function(app, config) {
  // Update all playlists at 4am EST
  return City.find({})
  .then(function(cityArr) {
    cityArr.forEach(function(city) {
      console.log('Scheduling cron job to update', city.name, 'playlists at 4am');
      var task = new CronJob({
        cronTime: '00 40 23 * * *',
        onTick: function() {
          return cities.updateCityPlaylists(city.id);
        },
        start: true,
        timeZone: 'America/New_York'
      });
      return task;
    });
  });
}
