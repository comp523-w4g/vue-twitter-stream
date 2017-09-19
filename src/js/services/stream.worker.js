let data = {}


function init(tags) {
  data = {
    count: 0,
    tags: {},
    countries: {}
  }

  tags.forEach(tag => {
    data.tags[tag.toLowerCase()] = {
      count: 0
    }
  })
}

function reset() {
  data.count = 0
  data.countries = {}

  for (let tag in data.tags) {
    if (data.tags.hasOwnProperty(tag)) {
      data.tags[tag] = {
        count: 0
      }
    }
  }
}

function processTweet(tweet) {
  data.count++
  console.log(tweet);
  let parsedSentiment = JSON.parse(tweet.sentiment)
  console.log(parsedSentiment)
  let emotionArr = parsedSentiment.document_tone.tone_categories[0].tones
  console.log(emotionArr)

    if (tweet.place && tweet.place.country_code) {
      let code = tweet.place.country_code

      if (!data.countries[code]) {
        data.countries[code] = {
          count: 0
        }
      }

      data.countries[code].count++
    }

  let tags = tweet.entities.hashtags.map(obj => {
    return obj.text.toLowerCase()
  })

  tags.forEach(tag => {
    if (!!tag && data.tags.hasOwnProperty(tag)) {
      data.tags[tag].count++
    }
  })
}

self.addEventListener('message', (e) => {
  let d = e.data

  switch (d.cmd) {
    case 'init':
      init(d.tags)
      break
    case 'reset':
    case 'stop':
      reset()
      break
    case 'close':
      self.close()
      break
    case 'tweet':
      processTweet(d.tweet)
      break
    case 'broadcast':
      self.postMessage({
        cmd: 'data',
        data
      })
      break
  };
}, false)
