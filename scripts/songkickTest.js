var songkick = require('../app/services/songkick');

songkick.getEvents('7644', 30)
.then(function(events) {
  console.log('done!');
});
