<template>
  <div id="tweetDashboard">
    <v-infinite-scroll :offset='20' style="max-height: 80vh; overflow-y: scroll;">
      <vueTimeline :tweets="tweets"></vueTimeline>
    </v-infinite-scroll>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { Bus, StreamService } from '../services'
  import vueTimeline from './Timeline.vue'
  export default {  
    name: 'tweetsTimeline',
    components: {
      vueTimeline
    },
    data: () => ({
       tweets: undefined, 
       numTweetsSeenSoFar: 0
     }),
    mounted() {
      Bus.$on('update', this.onUpdate);
    },
    methods: {
      onUpdate(data) {
        console.log("Full data from tweet: ", data);
        let numCumulativeTweets = data.count;
        //set color
        let currSentiment = data.currSentiment;
        let currMax = 0.0
        let maxKey;
        let color;
        for (var i in currSentiment) {
          if (currSentiment[i].score >= currMax){
            currMax = currSentiment[i].score;
            // regex removes all spaces in a string
            let sentiment = currSentiment[i].tone_name.replace(/ /g,'').toLowerCase();
            maxKey = sentiment;
          }
        }
        console.log("maxKey", maxKey);
        switch(maxKey) {
            case "anger":
                color = 'red';
                break;
            case "sadness":
                color = 'blue';
                break;
            case "joy":
                color = 'green';
                break;
            case "disgust":
                color = 'yellow';
                break;
            case "fear":
                color = 'orange';
                break;  
            case "openness":
                color = 'light-pink';
                break;  
            case "conscientiousness":
                color = 'light-orange';
                break;  
            case "emotionalrange":
                color = 'light-yellow';
                break;  
            case "agreeableness":
                color = 'light-blue';
                break;  
            case "extraversion":
                color = 'light-green';
                break;                               
            default:
                color = 'grey';
                break;
        }
        if (numCumulativeTweets > this.numTweetsSeenSoFar) {
          let newTweet = {
              title: '',
              text: '',
              tweetColor: color
          };
          if (this.tweets === undefined) {
            // Initialize tweets array
            this.tweets = [];
            // console.log("Setting new value for num tweets seen so far");
            newTweet.title = data.user.username;
            newTweet.text = data.text;
            this.tweets.push(newTweet);
          } else {
              newTweet.title = data.user.username;
              newTweet.text = data.text;
              this.tweets.unshift(newTweet);
          }
          this.numTweetsSeenSoFar = numCumulativeTweets;
        }
      }
    }
};
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  html body {
    background-color: beige;
  }
</style>