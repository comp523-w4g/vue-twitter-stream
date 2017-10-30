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
        let numCumulativeTweets = data.count;
        //set color
        let currSentiment = data.currSentiment;
        let currMax = 0.0
        let maxKey;
        let color;
        for (var i in currSentiment) {
          if (currSentiment[i].score >= currMax){
            currMax = currSentiment[i].score;
            maxKey = currSentiment[i].tone_name;
          }
        }
        console.log("maxKey", maxKey);
        switch(maxKey) {
            case "Anger":
                color = 'red';
                break;
            case "Sadness":
                color = 'blue';
                break;
            case "Joy":
                color = 'yellow';
                break;
            case "Disgust":
                color = 'green';
                break;
            case "Fear":
                color = 'orange';
                break;  
            case "Openness":
                color = 'teal';
                break;  
            case "Conscientiousness":
                color = 'lime';
                break;  
            case "Emotional Range":
                color = 'lime';
                break;  
            case "Agreeableness":
                color = 'lime';
                break;  
            case "Extraversion":
                color = 'lime';
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
            // console.log('this.tweets: ', this.tweets);
          } else {
              newTweet.title = data.user.username;
              newTweet.text = data.text;
              this.tweets.unshift(newTweet);
              // console.log('this.tweets: ', this.tweets);
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