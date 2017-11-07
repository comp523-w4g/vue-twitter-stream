import _ from 'lodash';

let data = {}
let userInputTags = {}

function init(tags) {
  // sent into onUpdate() method
  data = {
    count: 0,
    tags: {},
    countries: {},
    sentimentByTags: {},
    text: {},
    user: {},
    currSentiment: [],
<<<<<<< HEAD
<<<<<<< HEAD
    totalAggregatedSentiment : {}
=======
    checkedEmotions: []
>>>>>>> checkbox
=======
    checkedEmotions: [],
    totalAggregatedSentiment : {}
>>>>>>> a46a1c9740efcb208d7cef38a77bbf35844b8a22
  }
  userInputTags = tags;

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
    countries: {}
  }

  for (let tag in data.tags) {
    if (data.tags.hasOwnProperty(tag)) {
      data.tags[tag] = {
        count: 0
      }
    }
  }
}

function filterSentiment(checkedEmotions) {
  data.checkedEmotions = checkedEmotions;
  console.log("stream worker got checkedEmotions: ", data.checkedEmotions);
}

function processTweet(tweet) {
  data.count++;
  let parsedSentiment = JSON.parse(tweet.sentiment);
<<<<<<< HEAD
<<<<<<< HEAD
=======

  let emotionArr = parsedSentiment.document_tone.tone_categories[0].tones;  
  let hashtagsInTweet = tweet.entities.hashtags;
  
>>>>>>> a46a1c9740efcb208d7cef38a77bbf35844b8a22
  let emotionArr = parsedSentiment.document_tone.tone_categories[0].tones;
  let socialArr = parsedSentiment.document_tone.tone_categories[2].tones;  
  let hashtagsInTweet=tweet.entities.hashtags;  
  let toneArr = socialArr.concat(emotionArr);

<<<<<<< HEAD
=======
  let emotionArr = parsedSentiment.document_tone.tone_categories[0].tones;  
  let hashtagsInTweet = tweet.entities.hashtags;
  
>>>>>>> checkbox
=======
>>>>>>> a46a1c9740efcb208d7cef38a77bbf35844b8a22
  hashtagsInTweet = hashtagsInTweet.map(tagObj => tagObj.text.toLowerCase());
  // match the user inputted tags with the hashtags found in tweet
  let filteredTags = _.intersection(userInputTags, hashtagsInTweet);
  // grab full text of tweet
  data.text = tweet.text;
  // grab username who tweeted
  data.user.username = tweet.user.name;
<<<<<<< HEAD
<<<<<<< HEAD
=======

  data.currSentiment = emotionArr;
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
	});

  if (tweet.place && tweet.place.country_code) {
    let code = tweet.place.country_code
    if (!data.countries[code]) {
      data.countries[code] = {
        count: 0

>>>>>>> a46a1c9740efcb208d7cef38a77bbf35844b8a22
  data.currSentiment = toneArr;

    filteredTags.forEach(tag =>{
      	if (data.sentimentByTags.hasOwnProperty(tag.toLowerCase())) {
	        let existingSentimentObjectForKey = data.sentimentByTags[tag.toLowerCase()];

	        for (let i = 0; i < toneArr.length; i++) {
	          let currEmotion = toneArr[i];
	          existingSentimentObjectForKey[currEmotion.tone_name] += currEmotion.score;
            data.totalAggregatedSentiment[currEmotion.tone_name] += currEmotion.score;
	        }
          
   		} else {
   			let sentimentsForTag = {};

     			for (let i = 0; i < toneArr.length; i++) {
  	          let currEmotion = toneArr[i];
  	          sentimentsForTag[currEmotion.tone_name] = currEmotion.score;
              data.totalAggregatedSentiment[currEmotion.tone_name] = currEmotion.score;
  	        }
	   
	        data.sentimentByTags[tag.toLowerCase()] = sentimentsForTag;
   		}

  	});
     

    if (tweet.place && tweet.place.country_code) {
      let code = tweet.place.country_code
      if (!data.countries[code]) {
        data.countries[code] = {
          count: 0
        }
<<<<<<< HEAD
=======
  data.currSentiment = emotionArr;
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
	});

  if (tweet.place && tweet.place.country_code) {
    let code = tweet.place.country_code
    if (!data.countries[code]) {
      data.countries[code] = {
        count: 0
>>>>>>> checkbox
=======
>>>>>>> a46a1c9740efcb208d7cef38a77bbf35844b8a22
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
    case 'filterSentiment':
      filterSentiment(d.checkedEmotions)
      break
  };
}, false)
