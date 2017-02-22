var fs = require('fs-promise');

var CACHE_DIR = './cache';

var cache = {
  tryCache: function(prefix) {
    var CACHE_EXPIRES = 43200000; // 12 hours
    return fs.readdir(CACHE_DIR)
    .then(function(files) {
      if(!files.length) {
        throw('No cache available');
      }
      var cacheMinAge = Date.now() - CACHE_EXPIRES;
      var validCache = files.find(function(file) {
        // deal with the filename, not the extension
        var fileName = file.split('.')[0];
        // get the timestamp from the filename
        var parts = fileName.split('_');
        var cachePrefix = parts[0];
        var cacheDate = parseInt(parts[1], 10);
        return cachePrefix === prefix && cacheDate > cacheMinAge;
      });
      if(!validCache) {
        throw('No cache available');
      }
      console.log('Found valid cache:', validCache, 'not fetching new data');
      return fs.readFile(`./${CACHE_DIR}/${validCache}`)
      .then(function(contents) {
        return contents;
      });
    })
    .catch(function(err) {
      console.error(err);
    });
  },
  writeCache: function(fileName, contents) {
    return fs.ensureDir(CACHE_DIR)
    .then(function() {
      return fs.writeFile(`./${CACHE_DIR}/${fileName}_${Date.now()}.json`, JSON.stringify(contents));
    })
    .then(function() {
      console.log('Wrote to cache');
      return contents;
    });
  }
};

module.exports = cache;
