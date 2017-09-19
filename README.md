# Twitter Realtime Visualization

This app will stream live data from the [Twitter Streaming API](https://dev.twitter.com/streaming/overview) to visualize it with the power of [Vue](https://vuejs.org) and [Highcharts](http://www.highcharts.com/).

# Quickstart

```sh
$ git clone https://github.com/fabiandev/vue-twitter-stream-app.git
$ cd vue-twitter-stream-app
$ cp server/.env.example server/.env
$ yarn
```

Now fill in your credentials in `server/.env` and run `yarn start`.

# Live Example

[https://ivapp.herokuapp.com/](https://ivapp.herokuapp.com/)

> Since the app is hosted on a free [Heroku](https://www.heroku.com/) instance, it may need some time to boot up.  
> Please also note, that due to restrictions of the Twitter streaming API, only one concurrent stream is allowed.

*Fun fact:* The app is named "iv", because the course at University, where this project was born,
was called "Information Visualisation".

# Credits

This app uses:
- [Vue](https://vuejs.org) as a front-end framework.
- [Express](https://github.com/expressjs/express) with [twit](https://github.com/ttezel/twit) for the server.
- [socket.io](http://socket.io) for realtime websockets.
- [Twitter API](https://dev.twitter.com/streaming/overview) for live data.
- [Highcharts](http://www.highcharts.com/) for visualizations.
- [Materialize](http://materializecss.com/) for styling.
- [Material icons](https://github.com/google/material-design-icons/) and [Icons8 Flat Color Icons](https://github.com/icons8/flat-color-icons) for icons.
=======
# vue-twitter-stream
Uses Vue.js as client, Twitter API for streaming, Watson Tone Analyzer, socket.io to tie server and client
