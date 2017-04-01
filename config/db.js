var mongoose = require('mongoose');

module.exports = function(app) {
  mongoose.connect(process.env.MONGO_URL, {
    promiseLibrary: require('bluebird')
  });
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + process.env.MONGO_URL);
  });
  return db;
};
