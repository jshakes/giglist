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
    db: 'mongodb://localhost/livelist-development'
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
