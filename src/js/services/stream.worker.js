import _ from 'lodash';

let data = {}


function init(tags) {
  data = {
    count: 0,
    tags: {},
    countries: {},
    sentimentByTags: {}
  }

  tags.forEach(tag => {
    data.tags[tag.toLowerCase()] = {
      count: 0
    }
  })
}

function reset() {
  data = {
    count: 0,
    tags: {},
    countries: {},
    sentiment: {
      "Anger": 0.0,
      "Fear": 0.0,
      "Disgust": 0.0,
      "Joy": 0.0,
      "Sadness": 0.0
    }
  }

  for (let tag in data.tags) {
    if (data.tags.hasOwnProperty(tag)) {
      data.tags[tag] = {
        count: 0
      }
    }
  }
}

function processTweet(tweet) {
  data.count++;
  let parsedSentiment = JSON.parse(tweet.sentiment);
  let emotionArr = parsedSentiment.document_tone.tone_categories[0].tones;  
  let hashtagsInTweet=tweet.entities.hashtags;
  
  tweet.mainTags = tweet.mainTags.map(tag => tag.substr(1)); //gets rid of hashtag
  hashtagsInTweet = hashtagsInTweet.map(tagObj => tagObj.text.toLowerCase());
  let filteredTags = _.intersection(tweet.mainTags, hashtagsInTweet);
  console.log("filteredTags: ", filteredTags);

    filteredTags.forEach(tag =>{

      	if (data.sentimentByTags.hasOwnProperty(tag.toLowerCase())) {
	        let existingSentimentObjectForKey = data.sentimentByTags[tag.toLowerCase()];

	        for (let i = 0; i < emotionArr.length; i++) {
	          let currEmotion = emotionArr[i];
	          existingSentimentObjectForKey[currEmotion.tone_name] += currEmotion.score;
	        }
   		} else {
   			let sentimentsForTag = {};

   			for (let i = 0; i < emotionArr.length; i++) {
	          let currEmotion = emotionArr[i];
	          sentimentsForTag[currEmotion.tone_name] = currEmotion.score;
	        }
	   
	        data.sentimentByTags[tag.toLowerCase()] = sentimentsForTag;
   		}

   		console.log('data.sentimentByTags: ', data.sentimentByTags);
  	});

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
