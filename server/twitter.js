"use strict";

const twit = require('twit');

const twitter = new twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

module.exports = (obj) => new Promise((resolve, reject) => {
  if (obj !== null && typeof obj === 'object') {
    let settings = {};

    if (obj.follow) {
      settings.follow = obj.follow;
    }

    if (obj.track) {
      settings.track = obj.track;
    }

    if (obj.locations) {
      settings.locations = obj.locations;
    }

    let stream = twitter.stream('statuses/filter', settings);

    return resolve(stream);
  }
  
  return reject('Parameter was not an object!');
});

