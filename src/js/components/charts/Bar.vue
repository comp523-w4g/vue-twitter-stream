<script>
import Highcharts from 'highcharts'
import { Bus, StreamService } from '../../services'

export default {
  name: 'Bar',
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
      for (let tag in data.tags) {
        if (data.tags.hasOwnProperty(tag)) {
          let point = this.chart.series[0].points[count++]
          point.update(data.tags[tag].count)
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
          color: '#FFF'
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
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: 'Tweets'
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
          name: 'Tweets',
          colorByPoint: true,
          data: data
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
