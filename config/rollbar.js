module.exports = function(app) {
  if(process.env.NODE_ENV !== 'development') {
    var rollbar = require('rollbar');
    rollbar.init(process.env.ROLLBAR_TOKEN);
  }
};
