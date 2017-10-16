

<template>
  <div id="tweetDashboard">
    <vueTimeline :tweets="tweets"></vueTimeline>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { Bus, StreamService } from '../services'
  import vueTimeline from './Timeline.vue'
  export default {  
    name: 'tweetDashboard',
    components: {
      vueTimeline
    },
    data: () => ({
       tweets: undefined, 
       numTweetsSeenSoFar: 0
     }),
    mounted() {
      this.init();
      Bus.$on('update', this.onUpdate);
    },

    methods: {
      init() {
      },
      onUpdate(data) {
        let numCumulativeTweets = data.count;
        //set color
        let currSentiment = data.currSentiment;
        let currMax = 0.0
        let maxKey = '';
        let color = '';

        for (var i in currSentiment) {
          if(currSentiment[i].score >= currMax){
            currMax = currSentiment[i].score;
            maxKey = currSentiment[i].tone_name;
          }
        }
        

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
            default:
                color = 'grey';
                break;
        }

        if (numCumulativeTweets > this.numTweetsSeenSoFar) {
          if (this.tweets === undefined) {
            // Initialize tweets
            this.tweets = [];
            let newTweet = {
              title: '',
              text: '',
              tweetColor: color
            };
            newTweet.title =  data.user.username;
            newTweet.text = data.text;
            this.tweets.push(newTweet);
            this.numTweetsSeenSoFar = numCumulativeTweets;
          } else {
              let newTweet = {
                title: '',
                text: '', 
                tweetColor: color
              };
              newTweet.title =  data.user.username;
              newTweet.text = data.text;
              this.tweets.push(newTweet);
              this.numTweetsSeenSoFar = numCumulativeTweets;
          }
            
        }
    
          // Not sure why this doesn't cycle through all the tweets
          // for (let i = 0; i < 2; i++) {
          //   this.tweets[i] = this.tweets[i + 1];
          // }
       
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