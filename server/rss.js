const Feed = require('feed')

let feed = new Feed({
  title: 'W4G RSS Feed',
  description: 'Feed for Twitter+Watson Based on Tweet',
  link: 'http://vue-twitter-stream-watson.mybluemix.net',
})

module.exports = feed;