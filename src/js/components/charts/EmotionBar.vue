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
        let count = 0;
        console.log("logging data in component: ", data);

        for (let tag in data.tags) {
          if (data.tags.hasOwnProperty(tag)) {
           
          
            
            let tagCount = data.tags[tag].count;
            let accumulatedSentiment = data.sentimentByTags[tag];
            let averagedData = {};
           
          
              for (let key in accumulatedSentiment) {
                for(let i = 0; i < 5;i++){
                    console.log("chart series: ", this.chart.series[0]);
                    let point = this.chart.series[i].points[count++]
                    point.update(accumulatedSentiment[i]/tag.count);
                    console.log("curr accumulatedSentiment:",accumulatedSentiment[key]);
                }
            }
          }
        }
      },
      initChart(tags) {
        let colors = [
          'rgb(136, 179, 231)',
          'rgb(166, 234, 138)',
          'rgb(235, 167, 104)',
          'rgb(224, 102, 129)',
          'rgb(75, 142, 142)'
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

        const chart = Highcharts.chart(this.$el, {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Tweet sentiment'
          },
          subtitle: {
            text: 'TEST'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: [
              '1',
              '2',
              'Fear',
              'Joy',
              'Sadness'
              ]
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
              data: [0.0]
          }, {
              name: 'Fear',
              data: [0.0]
          },{
              name: 'Disgust',
              data: [0.0]
          },{
              name: 'Joy',
              data: [0.0]
          }, {
              name: 'Sadness',
              data: [0.0]
          }]
      });

        return chart
      }
    }
  }
</script>

<template>
  <div>
  </div>
</template>
