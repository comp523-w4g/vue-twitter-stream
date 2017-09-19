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
        this.chart = this.initChart(StreamService.tags)
      },
      onReset() {
        let points = this.chart.series[0].points
        for (let i = 0; i < points.length; i++) {
          points[i].update(0)
        }
      },
      onUpdate(data) {
        let count = 0;
        let index = 0;
        for (let key in data.sentiment){
          console.log(key);
        }
        for (let key in data.sentiment) {
//            console.log("at zero:" + this.chart.series[0]);

            let point = this.chart.series[index].points[count++];
            console.log(point);
            point.update(data.sentiment[key] / data.count);
            index++;

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
            type: 'column'
          },
          credits: {
            enabled: false
          },
          title: {
            text: 'Emotion Analysis'
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            type: 'category',
            categories: [
              'Anger',
              'Disgust',
              'Fear',
              'Joy',
              'Sadness'
            ]

          },
          yAxis: {
            min: 0.0,
            max: 1.0,
            title: {
              text: 'Tone Value'
            }

          },
          legend: {
            enabled: false
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: '{point.y}'
              }
            }
          },

          tooltip: {
            // headerFormat: '',
            pointFormat: '<span><b>{point.y:,.0f}</b> tweets<br/>'
          },

          series: [{
            name: 'Anger',
            data: [0]
          }, {
            name: 'Disgust',
            data: [0]
          }, {
            name: 'Fear',
            data: [0]
          },
            {
              name: 'Joy',
              data: [0]
            },
            {
              name: 'Sadness',
              data: [0]
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
