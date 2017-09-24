<script>
  import Highcharts from 'highcharts'
  import { Bus, StreamService } from '../../services'

  export default {
    name: 'EmotionBar',
    data: () => ({
      chart: null
    }),
    mounted() {
      this.init()
      Bus.$on('reset', this.onReset)
      Bus.$on('update', this.onUpdate)
    },
    destroyed() {
      Bus.$off('reset', this.onReset)
      Bus.$off('update', this.onUpdate)
      setTimeout(() => {
        this.chart.destroy()
        this.chart = null
      }, 1000)
    },
    methods: {
      init(tags) {
        console.log("Stream service tags", StreamService.tags);
        this.chart = this.initChart(StreamService.tags)
      },
      onReset() {
        let points = this.chart.series[0].points
        for (let i = 0; i < points.length; i++) {
          points[i].update(0);
        }
      },
      onUpdate(data) {
        console.log("Full Tweet data", data);
        console.log("Tags in data", data.tags);

        let anger = [];
        let fear = [];
        let disgust = [];
        let joy = [];
        let sadness = [];
        
        let i = 0;
        for (let tag in data.mainTags) {

            console.log("Tag: ", tag);
            let numberOfTweetsAssociatedWithTag = data.tags[tag].count; // number of times tweet with tag has been tweeted
            let accumulatedSentiment = data.sentimentByTags[tag];
            console.log("Accumulated sentiment", accumulatedSentiment);

            if (numberOfTweetsAssociatedWithTag == 0) {
              i++;
              break;
            }
            else {
              anger[i] = +((accumulatedSentiment["Anger"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              fear[i] = +((accumulatedSentiment["Fear"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              disgust[i] = +((accumulatedSentiment["Disgust"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              joy[i] = +((accumulatedSentiment["Joy"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              sadness[i] = +((accumulatedSentiment["Sadness"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              i++;
            }
            
          
        }   
        this.chart.series[0].setData(anger);
        this.chart.series[1].setData(fear);
        this.chart.series[2].setData(disgust);
        this.chart.series[3].setData(joy);
        this.chart.series[4].setData(sadness);
            
      },
      initChart(tags) {
        let colors = [
          'rgb(255, 0, 0)',
          'rgb(0, 0, 0)',
          'rgb(102, 255, 102)',
          'rgb(255, 255, 102)',
          'rgb(0, 128, 255)'
        ];
        let count = 0;
        let data = tags.map((tag) => {
          return {
            name: `#${tag}`,
            y: 0,
            drilldown: `#${tag}`,
            color: count < colors.length ? colors[count++] : '#000'
          }
        })

        let tweetTags = tags.splice(-1, 1);
        console.log("Tags in tweet", tweetTags);

        let categories = [];
        for(let i = 0; i < data.length;i++){
          categories[i] = data[i].name;
        }

        let startingPoints = [];

        for(let i = 0; i < data.length;i++){
          startingPoints[i] = 0.0;
        }

        const chart = Highcharts.chart(this.$el, {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Tweet sentiment Analysis'
          },
          subtitle: {
            text: ''
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: categories 
          },
          yAxis: {
            min: 0.0,
            max: 1.0,
            title: {
            
            }
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
          },
          plotOptions: {
            bar: {
               dataLabels: {
                enabled: true
              }
            }
          },

          tooltip: {
            // headerFormat: '',
            pointFormat: '<span><b>{point.y:,.0f}</b><br/>'
          },

          series: [{
              name: 'Anger',
              color: colors[0],
              data: startingPoints
          }, {
              name: 'Fear',
              color: colors[1],
              data: startingPoints
          },{
              name: 'Disgust',
              color: colors[2],
              data: startingPoints
          },{
              name: 'Joy',
              color: colors[3],
              data: startingPoints
          }, {
              name: 'Sadness',
              color: colors[4],
              data: startingPoints
          }]
        })
        return chart
      }
    }
  }
</script>

<template>
  <div>
  </div>
</template>
