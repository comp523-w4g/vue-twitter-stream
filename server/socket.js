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
      console.log('received data array from client: ', data);

      if(data.tweetRate) {
        redis.set('tweetRate', JSON.stringify(data));
      } else {
        redis.set('sentimentArray', JSON.stringify(data));
      }
    });

    socket.on('cacheEmotionArrays', emotionArrays =>  {
      console.log('Received emotion arrays dict from client: ', emotionArrays);
      redis.set('emotionArraysDict', JSON.stringify(emotionArrays));
    });

    socket.on('grabSentimentFromServer', msg => {
      console.log('Socket: grabSentimentFromServer');
      let sentimentArray = [];
      redis.get('emotionArraysDict', function(err, cachedSentiment) {
        if (!err) {
          // indexOfFirstSingleQuotationMark = cachedSentiment.find(''')
          // Remove first ' and last ' from string to make cachedSentiment valid JSON
          JSON.parse(cachedSentiment, (key, value) => {
            key = String(key);
          });
          console.log(typeof cachedSentiment);
          console.log('cachedSentiment: ', cachedSentiment);
          sentimentArray.push(cachedSentiment);
          console.log('sentimentArray: ', sentimentArray);
          
        }
      });
      let mockData = [
            {
               "car": "Audi",
               "price": 40000,
               "color": "blue"
             }
          ];
          let options = {
            data: mockData,
            fields: ['trump']
          };
          let csv = json2csv(options);
          fs.writeFile('file.csv', csv, function(err) {
            if (err) throw err;
            console.log(csv);
            console.log('file saved');  
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
