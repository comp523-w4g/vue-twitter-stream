// Configure Redis client connection
const redis = require('redis');
var redisClient;
// Check if we are in Bluemix or localhost
if(process.env.VCAP_SERVICES) {
  // On Bluemix read connection settings from
  // VCAP_SERVICES environment variable
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var credentials = env['redis-2.6'][0]['credentials'];
  redisClient = redis.createClient(credentials.port, credentials.host);
  if('password' in credentials) {
	// On Bluemix we need to authenticate against Redis
	redisClient.auth(credentials.password);
  }
} else {
  redisClient = redis.createClient();
}

module.exports = redisClient;
