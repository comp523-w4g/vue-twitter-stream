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
       tweets: [{
          title: 'hello world', // *时间点标题
          text: '',
          linkUrl: 'https://www.google.com', 
          linkText: 'Read detail'
          // date: '2017-1-1' 
        }, {
          title: '',
          text: 'Wait for more tweets!',
          linkUrk: ''
        }, {
          title: '',
          text: 'Wait for more tweets!',
          linkUrk: ''
        }
        ],
        maxTweetsShownAtOneTime: 3
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
        if (numCumulativeTweets === 0) {
          return;
        } else if (numCumulativeTweets === 1) {
          this.tweets[0].title = data.user.username;
          this.tweets[0].text = data.text;
        } else if (numCumulativeTweets === 2) {
            this.tweets[1].title = data.user.username;
            this.tweets[1].text = data.text;
        } else {
          // 3 or more cumulative tweets
          console.log("Tweet count: ", numCumulativeTweets);
          // Not sure why this doesn't cycle through all the tweets
          // for (let i = 0; i < 2; i++) {
          //   this.tweets[i] = this.tweets[i + 1];
          // }
          this.tweets[this.maxTweetsShownAtOneTime - 1].title = data.user.username;
          this.tweets[this.maxTweetsShownAtOneTime - 1].text = data.text;
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