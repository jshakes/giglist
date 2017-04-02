const mongoose = require('mongoose');
const Promise = require('bluebird');

module.exports = (app) => {
  mongoose.Promise = Promise;
  mongoose.connect(process.env.MONGO_URL);
  const db = mongoose.connection;
  db.on('error', () => {
    throw new Error('unable to connect to database at ' + process.env.MONGO_URL);
  });
  return db;
};
