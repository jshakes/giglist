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
    db: 'mongodb://giglist:aEyXVxuEpSmc8h6Q@candidate.43.mongolayer.com:10005/giglist_dev',
    spotify: {
      username: 'giglistdev',
      clientId: '29322511988c4e5a92ca78ba8f109842',
      clientSecret: 'f52f057dd25c42108fdeb1216d4e9c73',
      redirectUri: 'http://localhost:3000',
      accessToken: 'AQBL06KHVSge-pSH9_ga3wBx2mD4fOVlgJ_2ty92xeAQLA3dWaihaKp0d0SW_Rfk_4LkbjIHPA1yLbNY9ZmNeq0cBqIWPlUnv53FS8y0HURpFMa_64aPol4RkfooT7P0Wp_jb6e_X7McHldh2HAWp3CiAyiQtf7r8IKp-x4d-U-_ghEasj4h5NzeShMALdMk4nVX1RT3yOnVZQNsvBDPlJEU1w'
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
