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
      accessToken: 'BQAiOOvGDhOHxXQVHT4E8Nx9PLYaIkyTbNUlMrXnBICOPHJ_llsx3JCpxkkypZWoBHUElvMhZrPGoWfKmYjUcDSJsdx8xp2rdvTw-QBisfUA5XRFVC4gvUakwsG5vZVks-1kHk_PFLtQT7Cy_FFaeRSBfW_oNgSYmA2FHVgV2Q0R0ekSDrBgQLY',
      refreshToken: 'AQAxd_QaSh06fZbP_fjDXtUr-mAJNQ07HJVBwEau97sTjElpckbFJGjZwaqOvhBuUKbuYdfdiF-H7o7jEw4IsuzOmLVNGx6N8QHi3VC7K5KI5w9gdikbMxUsWN4mOcpe62E',
      clientId: '29322511988c4e5a92ca78ba8f109842',
      clientSecret: 'f52f057dd25c42108fdeb1216d4e9c73',
      redirectUri: 'http://localhost:3000'
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
