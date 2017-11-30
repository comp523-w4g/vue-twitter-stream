"use strict";
// Node modules
const http = require('http');
const socket = require('socket.io');
const twitter = require('./twitter');
const { tone_analyzer } = require('./watson-nlu');
const _ = require('lodash');
const redis = require('./redis');
// Modules for JSON -> CSV conversion
const json2csv = require('json2csv');
const fs = require('fs');

let connections = 0;
let streamActive = false;
let twitterStream;

module.exports = app => {
  let server = http.Server(app);
  let io = socket(server);

  io.on('connection', (socket) => {
    ++connections;

    io.sockets.emit('connections', {
      connections,
      streamActive
    });

    socket.on('disconnect', () => {
      --connections;

      io.sockets.emit('connections', {
        connections,
        streamActive
      });

      if (twitterStream && twitterStream.stop) {
        twitterStream.stop();
        streamActive = false;

        io.sockets.emit('stream_inactive', {
          connections,
          streamActive
        });
      }
    });

    socket.on('updateRSS', data => {
      console.log('socket updated: ', data);
      redis.get('RSSData', (err, rssCache) => {
        const cachedData = JSON.parse(rssCache);
        console.log('cachedData', cachedData);
        let updatedRSSData = _.assignIn(cachedData, data);
        console.log('updatedRSSData: ', updatedRSSData);

        redis.set('RSSData', JSON.stringify(updatedRSSData));
      })
    });

    socket.on('cacheEmotionArrays', emotionArrays =>  {
      console.log('Received emotion arrays from client: ', emotionArrays);
      redis.set('emotionArraysDict', JSON.stringify(emotionArrays));
    });
    
    socket.on('grabSentimentFromServer', msg => {
      console.log('Socket: grabSentimentFromServer');
      let sentimentArray = [];
      redis.get('emotionArraysDict', function(err, cachedSentiment) {
        if (!err) {
          let sentiment = JSON.parse(cachedSentiment);
          console.log("cached sentiment after calling JSON.parse");
          console.log(sentiment);
          let numHashtags = sentiment.anger.length;
          let emotions = Object.keys(sentiment);
          console.log("sentiment.fear", sentiment.fear);
          let data = [];
          for (let i = 0; i < numHashtags; i++) {
            let emotionsAssociatedWithHashTag = {};
            for (var prop in emotions) {
              if (emotions.hasOwnProperty(prop)) {
                emotionsAssociatedWithHashTag[prop] = emotions[prop];
              }
            }
            emotionsAssociatedWithHashTag.anger = sentiment.anger[i];
            emotionsAssociatedWithHashTag.fear = sentiment.fear[i];
            emotionsAssociatedWithHashTag.disgust = sentiment.disgust[i];
            emotionsAssociatedWithHashTag.joy = sentiment.joy[i];
            emotionsAssociatedWithHashTag.sadness = sentiment.sadness[i];
            emotionsAssociatedWithHashTag.openness = sentiment.openness[i];
            emotionsAssociatedWithHashTag.conscience = sentiment.conscience[i];
            emotionsAssociatedWithHashTag.extraversion = sentiment.extraversion[i];
            emotionsAssociatedWithHashTag.emotionalRange = sentiment.emotionalRange[i];
            emotionsAssociatedWithHashTag.hashtag = sentiment.hashtag[i];
            data.push(emotionsAssociatedWithHashTag);
          }
           console.log('CSV fields: ', emotions);
           let options = {
             data: data,
             fields: emotions
           };
           let csv = json2csv(options);
           fs.writeFile('file.csv', csv, function(err) {
             if (err) throw err;
             console.log(csv);
             console.log('file saved');  
           }); 
        }
      });
    });

    socket.on('download', data => {
      fs.write(data)
    })

    socket.on('filter', msg => {
        if (streamActive) {
          return;
        }

        twitter(msg)
          .then((stream) => {
            twitterStream = stream
            streamActive = true;

            io.sockets.emit('stream_active', {
              connections,
              streamActive
            });

      	    stream.on('tweet', tweet => {
    		      tone_analyzer.tone({ text: tweet.text }, function(err, tone) {
                if (err) {
                  console.log(err);
                } 
                const toneResult = JSON.stringify(tone, null, 2);

                tweet.sentiment = toneResult;
                tweet.inputTags = msg.track;
        	      socket.emit('tweet', tweet);
        	    });
            });
            stream.on('disconnect', msg => {
              streamActive = false;
              socket.emit('stream_error')
              io.sockets.emit('stream_inactive', {
                connections,
                streamActive
              });
            });
            stream.on('error', msg => socket.emit('stream_error'));
            stream.on('reconnect', msg => {
              streamActive = true;
              socket.emit('stream_recovered')
              io.sockets.emit('stream_active', {
                connections,
                streamActive
              });
            });

          })
          .catch(e => socket.emit('error', e));
    });
  });

  return server;
};
