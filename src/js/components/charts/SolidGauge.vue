<script>
import Highcharts from 'highcharts'
import { Bus, StreamService } from '../../services'

export default {
  name: 'SolidGauge',
  data: () => ({
    lastTime: null,
    lastCount: 0,
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
      this.lastTime = Date.now()
      this.chart = this.initChart()
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
    onReset(tags) {
      this.lastTime = Date.now();
      this.lastCount = data.count;
    },
    onUpdate(data) {
      
      let seconds = (Date.now() - this.lastTime) / 1000;
      let perSecond = Math.abs(data.count - this.lastCount) / seconds;
      let point = this.chart.series[0].points[0]
      this.lastCount = data.count
      this.lastTime = Date.now()
      let tweetRate = Math.round(perSecond * 100) / 100;
      point.update(tweetRate);

      // emit tweets/s value back to server to update RSS
      const dataToCast = {
        tweetRate
      };
      StreamService.updateRSS(dataToCast);
    },
    initChart(max) {
      let gaugeOptions = this.getChartOptions()

      const chart = Highcharts.chart(this.$el, Highcharts.merge(gaugeOptions, {
        yAxis: {
          min: 0,
          max: max || 10,
          title: {
            text: ''
          }
        },

        credits: {
          enabled: false
        },

        series: [{
          name: 'Speed',
          data: [
            0
          ],
          dataLabels: {
            format: `
              <div style="text-align:center">
                <span style="font-size:25px;color:
                  ${((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black')}"
                >
                  {y}
                </span>
                <br>
                <span style="font-size:12px;color:silver">Tweets/s</span>
              </div>
              `
          },
          tooltip: {
            valueSuffix: ' Tweets/s'
          }
        }]

      }))

      return chart
    },
    getChartOptions() {
      return {

        chart: {
          type: 'solidgauge'
        },

        title: null,

        pane: {
          center: ['50%', '75%'],
          size: '100%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: (
              Highcharts.theme && Highcharts.theme.background2
            ) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        },

        tooltip: {
          enabled: false
        },

        // the value axis
        yAxis: {
          stops: [
            [0.1, 'rgb(166, 234, 138)'], // green
            [0.5, 'rgb(250, 237, 128)'], // yellow
            [0.9, 'rgb(233, 133, 155)'] // red
          ],
          lineWidth: 0,
          minorTickInterval: null,
          tickAmount: 5,
          title: {
            y: -70
          },
          labels: {
            y: 16
          }
        },

        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          }
        }
      }
    }
  }
}
</script>

<template>
<div>
</div>
</template>
