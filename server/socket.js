"use strict";

const http = require('http');
const socket = require('socket.io');
const twitter = require('./twitter');
const { tone_analyzer } = require('./watson-nlu');
const _ = require('lodash');

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
