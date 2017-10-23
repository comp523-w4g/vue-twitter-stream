var webpack = require('webpack');

module.exports = {
  entry: [
    './src/js/main.js'
  ],
  output: {
    path: '/public/js',
    publicPath: '/public/',
    filename: 'app.js'
  },
  watch: true,
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules|vue\/src|vue-router\//,
      loader: 'babel'
    }, {
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.worker\.js$/,
      loader: 'worker?inline=true!babel'
    }]
  },
  node: {
    fs: 'empty',
    child_process: 'empty'
  },
  plugins: [],
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  resolve: {
    modulesDirectories: ['node_modules']
  }
}
