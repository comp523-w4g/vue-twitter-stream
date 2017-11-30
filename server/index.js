"use strict";

require('./bootstrap');

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
// RSS feed
const Feed = require('feed')
const redis = require('./redis');
const _ = require('lodash');

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
  let feed = new Feed({
    title: 'W4G RSS Feed',
    description: 'Feed for Twitter+Watson Based on Tweet',
    link: 'http://vue-twitter-stream-watson.mybluemix.net',
  });

  redis.getAsync('RSSData').then(cachedData => {
    const dataForRSS = JSON.parse(cachedData);
    console.log('dataForRSS: ', dataForRSS);
    for (let key in dataForRSS) {
      feed.addItem({
        title: key,
        content: dataForRSS[key]
      });
    }

    const feedRes = feed.rss2('rss-2.0');
    res.set('Content-Type', 'text/xml');
    return res.send(feedRes);
  })
});

app.get('/csv', (req, res) => {
  let json2csv = require('json2csv');
  let http = require('http');
  let fs = require('fs');
  var fields = ['car', 'price', 'color'];
  var myCars = [
    {"Anger":0.07,"Fear":0.08,"Disgust":0.47,"Joy":0.282,"Sadness":0.222,"Openness":0.609,"Conscientiousness":0.6,"Extraversion":0.268,"EmotionalRange":0.562}
  ];
  var csv = json2csv({ data: myCars, fields: fields });
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved yay');  
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
