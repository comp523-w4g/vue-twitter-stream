<template>
  <div id="tweetDashboard">
    <vueTimeline :tweets="tweets"></vueTimeline>
  </div>
</template>

<script>
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
        // let emptyTweet = {
        //   title: '',
        //   text: '',
        //   linkUrk: ''
        // };
        // this.tweets.push(emptyTweet);
        // this.tweets.push(emptyTweet);
      },
      onUpdate(data) {
        console.log("Full Tweet data: ", data);
        let numCumulativeTweets = data.count;
        console.log("Tweet count: ", numCumulativeTweets);
        if (numCumulativeTweets > this.numTweetsSeenSoFar) {
          if (this.tweets === undefined) {
            // Initialize tweets
            this.tweets = [];
            console.log("Setting new value for num tweets seen so far");
            let newTweet = {
                title: '',
                text: ''
            };
            newTweet.title =  data.user.username;
            newTweet.text = data.text;
            this.tweets.push(newTweet);
            console.log('this.tweets: ', this.tweets);
            this.numTweetsSeenSoFar = numCumulativeTweets;
          } else {
              let newTweet = {
                title: '',
                text: ''
              };
              newTweet.title =  data.user.username;
              newTweet.text = data.text;
              this.tweets.push(newTweet);
              console.log('this.tweets: ', this.tweets);
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