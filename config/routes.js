module.exports = function(app, config) {
  const cities = require(config.root + '/app/controllers/Cities');
  app.get('/', cities.index);
  app.get('/:citySlug', cities.city);
  //app.get('/:city/:genre', Cities.playlist);
};
