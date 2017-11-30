<script>
import Highcharts from 'highcharts'
import { Bus, StreamService } from '../../services'

export default {
  name: 'SolidGauge',
  data: () => ({
    combinedLastTime: null,
    combinedLastCount: 0,
    lastTimes: {},
    lastCounts: {},
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
      this.combinedLastTime = Date.now()
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
      this.combinedLastTime = Date.now();
      this.combinedLastCount = data.count;
    },
    onUpdate(data) {
      let tweetRate = this.calculateCombinedTweetRate(data);
      let point = this.chart.series[0].points[0]
      point.update(tweetRate);

      let tweetRateByTag = {};
      for (let tag in data.tags) {
        tweetRateByTag[tag] = this.calculateTweetRate(data.tags[tag], tag);
      }

      // emit tweets/s value back to server to update RSS
      const dataToCast = {
        combinedTweetRate: tweetRate,
        tweetRateByTag: Object.values(tweetRateByTag)
      };
      StreamService.updateRSS(dataToCast);
    },
    calculateTweetRate(data, tag) {
      if (this.lastTimes[tag] && this.lastCounts[tag]) {
        let seconds = (Date.now() - this.lastTimes[tag]) / 1000;
        let perSecond = Math.abs(data.count - this.lastCounts[tag]) / seconds;
        this.lastCounts[tag] = data.count;
        this.lastTimes[tag] = Date.now();
        return Math.round(perSecond * 100) / 100;
      }
      this.lastCounts[tag] = data.count;
      this.lastTimes[tag] = Date.now();
      return 0;
    },
    calculateCombinedTweetRate(data) {
      let seconds = (Date.now() - this.combinedLastTime) / 1000;
      let perSecond = Math.abs(data.count - this.combinedLastCount) / seconds;
      this.combinedLastCount = data.count;
      this.combinedLastTime = Date.now();
      return Math.round(perSecond * 100) / 100;
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
