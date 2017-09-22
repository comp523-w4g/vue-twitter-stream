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
        this.chart.xAxis.categories = Object.keys(data.tags);
        for (let tag in data.tags) {
          if (data.tags.hasOwnProperty(tag)) {
            // number of times tweet with tag has been tweeted
            let numberOfTweetsAssociatedWithTag = data.tags[tag].count;
            let accumulatedSentiment = data.sentimentByTags[tag];
            console.log("Accumulated sentiment", accumulatedSentiment);
            for (let key in accumulatedSentiment) {
                  console.log("Value of Accumulated sentiment with key", key, accumulatedSentiment[key]);
                  console.log("chart series points: ", this.chart.series[0].points);
                  let aggregateEmotionData = [];
                  // Make sure array contains one element
                  aggregateEmotionData.push(0);
                  // TOOD (Victor:) Clean this up, pretty sure this for-loop is more work than we need
                  for (let i = 0; i < this.chart.series.length; i++) {
                    let emotion = this.chart.series[i];
                    if (key == emotion.name) {
                      console.log("Found series with emotion name", emotion.name);
                      // Rounds to 3 decimal places
                      aggregateEmotionData[0] = +((accumulatedSentiment[key] / numberOfTweetsAssociatedWithTag)).toFixed(3);
                      // Even though aggregateEmotionData only contains one element, setData() method expects an array as a paremeter
                      this.chart.series[i].setData(aggregateEmotionData);
                      console.log("Data for series with key", key, this.chart.series[i].data);
                      break;
                    }
                  }
                  
                  // point.update(accumulatedSentiment[key] / tag.count);
                  // console.log("curr accumulatedSentiment:",accumulatedSentiment[key]);
            }
          }
        }
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

        // let cats = [];
        // for(let i = 0; i < data.length;i++){
        //   cats[i] = data[i].name;
        // }
        // console.log("categories array", cats);

        let startingPoints = [];

        for(let i = 0; i < data.length;i++){
          startingPoints[i] = 0;
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
            categories: tweetTags // TODO (Victor): Figure out if this is correct
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
