"use strict";

require('./bootstrap');
const feed = require('./rss');

if (!process.env.TWITTER_API_KEY) {
  console.log('Please set required environment variables.');
  console.log('Exciting.');
  return;
}

if (process.env.NEW_RELIC_LICENSE_KEY) {
  console.log('Enabling New Relic...');
  require('newrelic');
} else {
  console.log('New Relic not enabled.');
}

const bodyParser = require('body-parser');
const compress = require('compression');
const config = require('./config');
const errorHandler = require('errorhandler');
const express = require('express');
const methodOverride = require('method-override');
const middleware = require('./middleware');
const path = require('path');
const socket = require('./socket');
// cacheing for rss feed
const redis = require('./redis');

const app = express();
const http = socket(app);

// Define font mime types
express.static.mime.define({
  'application/x-font-woff': ['woff'],
  'application/x-font-woff2': ['woff2'],
  'application/x-font-ttf': ['ttf']
});

console.log('');
console.log('Server environment is ' + process.env.NODE_ENV);
console.log('Server public dir set to ' + config.publicDir);

// Compress responses
app.use(compress());

// Request middleware
app.use(middleware.isFile);
app.use(express.static(path.join(__dirname, config.publicDir)));

// Serve index if file does not exist
app.get('/', (req, res, next) => {
  if (!req.isFile) {
    return res.sendFile('index.html', {
      root: path.join(__dirname, config.publicDir)
    });
  }

  return next();
});

app.get('/rss', (req, res) => {
  redis.get('sentimentArray', function(err, cachedSentiment) {
    if(!err) {
      const sentimentArray = cachedSentiment.toString()
      const rssData = {
        title: 'Watson Sentiment Scores',
        content: sentimentArray
      };
      feed.addItem(rssData);
      const feedRes = feed.rss2('rss-2.0');
      res.set('Content-Type', 'text/xml');
      res.send(feedRes);
    }
  });
})

// Response middleware
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(errorHandler({
  dumpExceptions: !config.production,
  showStack: !config.production
}));

// Use port 5000 in development
var port = config.production ? process.env.PORT : 5000;
port = !port ? 5000 : port;

// Start the server
http.listen(port);

console.log('Server listening on port ' + port);
console.log('');
