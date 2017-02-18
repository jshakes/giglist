var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'livelist'
    },
    port: 80,
    db: 'mongodb://giglist:aEyXVxuEpSmc8h6Q@candidate.43.mongolayer.com:10005/giglist_dev',
    spotify: {
      username: 'giglistdev',
      clientId: '29322511988c4e5a92ca78ba8f109842',
      clientSecret: 'f52f057dd25c42108fdeb1216d4e9c73',
      redirectUri: 'http://localhost:3000',
      refreshToken: 'AQAQrI2sItY6A7kmsX8de4TPHLG7m9-TgaV1C5uGPSbMTTXedIFgH1759F_fkUdvyob_vahTMKcAcwRoOzkV77v4sIZVF4hveAMOE11OT7xU7gyy1-UsIbes_6cfBfPDTTM'
    }
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
