var mongoose = require('mongoose');

module.exports = function(app, config) {
  mongoose.connect(config.db, {
    promiseLibrary: require('bluebird')
  });
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });
  return db;
};
