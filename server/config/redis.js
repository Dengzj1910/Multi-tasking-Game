var redis = require('redis');
var url = require('url');

module.exports = function(){
  var redisURL = {};
  if ( process.env.REDISTOGO_URL ) {
    redisURL = url.parse(process.env.REDISTOGO_URL);
  }
  else{
    redisURL.port = '6379';
    redisURL.hostname = '127.0.0.1';
  }

  var db = redis.createClient(redisURL.port, redisURL.hostname);
  if ( process.env.REDISTOGO_URL ) db.auth(redisURL.auth.split(":")[1]);

  db.on('connect', function() {
    console.log('connected to redis');
  });

  return db;
};