var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'livelist'
    },
    port: 3000,
    db: 'mongodb://giglist:aEyXVxuEpSmc8h6Q@candidate.43.mongolayer.com:10005/giglist_dev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'livelist'
    },
    port: 3000,
    db: 'mongodb://localhost/livelist-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'livelist'
    },
    port: 3000,
    db: 'mongodb://localhost/livelist-production'
  }
};

module.exports = config[env];
