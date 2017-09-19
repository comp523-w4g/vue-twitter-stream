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
  data.count++
  console.log(tweet);
  let parsedSentiment = JSON.parse(tweet.sentiment);
  let emotionArr = parsedSentiment.document_tone.tone_categories[0].tones;
  console.log("Emotion array");
  console.log(emotionArr);

    tweet.entities.hashtags.forEach(tag =>{
      	if (data.sentimentByTags.hasOwnProperty(tag.text.toLowerCase())) {
	      	console.log('has tag')
	        let existingSentimentObjectForKey = data.sentimentByTags[tag.text.toLowerCase()];

	        for (let i = 0; i < emotionArr.length; i++) {

	          let currEmotion = emotionArr[i];
	          console.log('currEmotion: ', currEmotion);
	          existingSentimentObjectForKey[currEmotion.tone_name] += currEmotion.score;
	        }
   		} else {
   			console.log('does not have tag');
   			let sentimentsForTag = {};

   			for (let i = 0; i < emotionArr.length; i++) {

	          let currEmotion = emotionArr[i];
	          console.log('currEmotion: ', currEmotion);

	          sentimentsForTag[currEmotion.tone_name] = currEmotion.score;
	        }
	        console.log('sentimentsForTag: ', sentimentsForTag);
	        data.sentimentByTags[tag.text.toLowerCase()] = sentimentsForTag;
   		}

   		console.log('data.sentimentByTags: ', data.sentimentByTags);
  	});


  console.log("Data sentiment");
  console.log(data.sentiment);
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
