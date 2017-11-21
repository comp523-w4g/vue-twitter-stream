<script>
import Highcharts from 'highcharts'
import Bus from '../../services/bus'

export default {
  name: 'LiveSpline',
  data: () => ({
    chart: null,
    lastTime: null,
    lastCount: 0
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

    },
    onUpdate(data) {
      let seconds = (Date.now() - this.lastTime) / 1000;
      let perSecond = (data.count - this.lastCount) / seconds;
      let point = this.chart.series[0].points[0]
      point.update(Math.round(perSecond * 100) / 100)
      this.lastCount = data.count
      this.lastTime = Date.now()
      let series = this.chart.series[0];
      let value = Math.round(perSecond * 100) / 100
      series.addPoint(
        [
          (new Date()).getTime(),
          value < 0 ? 0 : value
        ],
        true,
        true
      );
    },
    initChart() {
      Highcharts.setOptions({
        global: {
          useUTC: false
        }
      });

      const chart = Highcharts.chart(this.$el, {
        chart: {
          type: 'spline',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
          events: {

          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: 'Tweets'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          formatter: function() {
            return '<b>' + this.series.name + '</b><br/>' +
              Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' +
              'Ø ' + Highcharts.numberFormat(this.y, 0) + '/s';
          }
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          name: 'Tweets',
          data: (function() {
            // generate an array of random data
            var data = [],
              time = (new Date()).getTime(),
              i;

            for (i = -19; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: 0
              });
            }
            return data;
          }())
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
