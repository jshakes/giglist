module.exports = function(app, config) {
  const cities = require(config.root + '/app/controllers/cities');
  app.get('/', cities.index);
  app.get('/:citySlug([a-z-]+)', cities.city);
  app.get('/:citySlug([a-z-]+)/:genreSlug([a-z-]+)', cities.playlist);
};
