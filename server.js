var app = require('./app');
var config = require('./config/config');

app.listen(config.port, function () {

  console.log('Express server listening on port ' + config.port);
});
