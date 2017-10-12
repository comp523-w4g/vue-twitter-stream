// Load the Cloudant library.
var Cloudant = require('cloudant');

// Initialize Cloudant with settings from .env
var username = process.env.CLOUDANT_USERNAME || "nodejs";
var password = process.env.CLOUDANT_PASSWORD;
var cloudant = Cloudant({account:username, password:password});

let insertIntoTable = (tableName, payload) => {
  var table = cloudant.db.use(tableName);

  table.insert(payload, 'rabbit', function(err, body, header) {
    if (err) {
      return console.log('[table.insert] ', err.message);
    }

    console.log('Successfully inserted into db:');
    console.log(body);
  });
}

module.exports = {insertIntoTable: insertIntoTable};
