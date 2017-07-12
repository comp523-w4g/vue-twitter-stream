<script>
import Highcharts from 'highcharts'
import { Bus, StreamService } from '../../services'

export default {
  name: 'StarPlot',
  data: () => ({
    chart: null
  }),
  mounted() {
    this.init()
  },
  destroyed() {
    this.destroy()
  },
  methods: {
    init() {
      this.chart = this.initChart(StreamService.tags)
      Bus.$on('reset', this.onReset)
      Bus.$on('update', this.onUpdate)
    },
    destroy() {
      Bus.$off('reset', this.onReset)
      Bus.$off('update', this.onUpdate)

      setTimeout(() => {
        this.chart.destroy()
        this.chart = null
      }, 1000)
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
      const chart = Highcharts.chart(this.$el, {

        chart: {
          polar: true,
          type: 'line'
        },

        credits: {
          enabled: false
        },

        title: {
          text: ''
        },

        pane: {
          size: '90%',
          center: ['50%', '60%'],
        },

        xAxis: {
          categories: tags.map(tag => {
            return `#${tag}`
          }),
          tickmarkPlacement: 'on',
          lineWidth: 0
        },

        yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0
        },

        tooltip: {
          shared: true,
          pointFormat: '<span><b>{point.y:,.0f}</b> tweets<br/>'
        },

        series: [{
          name: 'Tweets',
          type: 'area',
          data: tags.map(tag => 0),
          pointPlacement: 'on'
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
