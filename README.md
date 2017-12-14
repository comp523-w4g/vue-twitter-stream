# Twitter Realtime Visualization
This is a demo powering the live [Twitter streaming dashboard](http://vue-twitter-stream-watson.mybluemix.net/). 
This is an active collaboration between UNC Chapel Hill Computer Science, IBM Watson, and UNC Basketball's GoHeels Media team.

# Integration w/ UNC Basketball Video Board
[![Twitter Stream @ Dean Dome](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://drive.google.com/file/d/1n65L1zIoGyEv5Y2qN2DlxwDC_FByFHm_/view?usp=sharing)


# Backend Architecture
![diagram](https://image.ibb.co/i4eidw/w4g_backend_architecture.png "architecture")

# Client-side Architecture Diagram
![client-side architecture](https://image.ibb.co/cCCDyw/client_architecture.png)

# Technologies used
Uses Vue.js as client, Twitter API for streaming, Watson Tone Analyzer, redis chacheing for RSS feed, and socket.io to tie server and client.

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
- [redis.io](http://redis.io) for cache storage to produce RSS feed (found at /rss route)
- [Twitter API](https://dev.twitter.com/streaming/overview) for live data.
- [Highcharts](http://www.highcharts.com/) for visualizations.
- [Materialize](http://materializecss.com/) for styling.
- [Material icons](https://github.com/google/material-design-icons/) and [Icons8 Flat Color Icons](https://github.com/icons8/flat-color-icons) for icons.
