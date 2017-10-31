// Configure Redis client connection
const redis = require('redis');
var redisClient;
// Check if we are in Bluemix or localhost
if(process.env.VCAP_SERVICES) {
  // On Bluemix read connection settings from
  // VCAP_SERVICES environment variable
	var vcap_services = process.env.VCAP_SERVICES;
	var rediscloud_service = JSON.parse(vcap_services)["rediscloud"][0]["credentials"]
  redisClient = redis.createClient(rediscloud_service.port, rediscloud_service.hostname);
  if('password' in rediscloud_service) {
		// On Bluemix we need to authenticate against Redis
		redisClient.auth(rediscloud_service.password);
  }
} else {
  redisClient = redis.createClient();
}

module.exports = redisClient;
