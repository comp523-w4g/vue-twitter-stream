# Twitter Realtime Visualization
This is a demo powering the live (http://vue-twitter-stream-watson.mybluemix.net/)[Twitter streaming dashboard] This is a collaboration between UNC Chapel Hill Computer Science and IBM Watson.

# Backend Architecture
![diagram](https://image.ibb.co/i4eidw/w4g_backend_architecture.png "architecture")


# Technologies used
Uses Vue.js as client, Twitter API for streaming, Watson Tone Analyzer, socket.io to tie server and client.

# Quickstart

```sh
$ git clone https://github.com/fabiandev/vue-twitter-stream-app.git
$ cd vue-twitter-stream-app
$ cp server/.env.example server/.env
$ yarn
```

Now fill in your credentials in `server/.env` and run `yarn start`.

# Live Example
http://vue-twitter-stream-watson.mybluemix.net/

# Credits
Primary development team: Victor Cui, Greer Glenn, Amogh Sharma, Michael Gu

Our app depends on:
- [Vue](https://vuejs.org) as a front-end framework.
- [Express](https://github.com/expressjs/express) with [twit](https://github.com/ttezel/twit) for the server.
- [socket.io](http://socket.io) for realtime websockets.
- [Twitter API](https://dev.twitter.com/streaming/overview) for live data.
- [Highcharts](http://www.highcharts.com/) for visualizations.
- [Materialize](http://materializecss.com/) for styling.
- [Material icons](https://github.com/google/material-design-icons/) and [Icons8 Flat Color Icons](https://github.com/icons8/flat-color-icons) for icons.
