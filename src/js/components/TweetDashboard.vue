<template>
  <div id="tweetDashboard">
    <vueTimeline :tweets="tweets"></vueTimeline>
  </div>
</template>

<script>
  import { Bus, StreamService } from '../services'
  import vueTimeline from 'vue-timeline/src/components/timeLine.vue'
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
        }]
     }),
    mounted() {
      this.init();
      Bus.$on('update', this.onUpdate);
    },

    methods: {
      init(data) {
        console.log("Dashboard data: ", data);
      },
      onUpdate(data) {
        console.log("Tweet text: ", data.text);
        
        this.tweets[0].text = data.text;
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