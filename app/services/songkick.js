/*
  Songkick 
  
  Services object for interacting with the Songkick API
 */

var SONGKICK_API_KEY = 'RpuYqxFiPPsJPs5l';
var http = require('http');
var Songkick = require('songkick-api');

module.exports = {
  getEvents: new Promise(function(resolve, reject) {

    var songkick = new Songkick(SONGKICK_API_KEY);
    songkick.searchEvents({
      location: 'sk:7644'
    }).then(function(events) {

      resolve(events);
    });
  })
};