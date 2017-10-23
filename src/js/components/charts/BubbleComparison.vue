<template>
  <svg width="500" height="270">
    <g style="transform: translate(0, 10px)">
      <path :d="line" />
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3';
import { chart } from './bubbleGenerator.vue'
import Bus from '../../services/bus'

export default {
  name: 'vue-line-chart',
  data() {
    return {
      chart: null,
      tagToIndex: null,
      userInputTags: [],
      data: [99, 71, 78, 25, 36, 92],
      line: ''
    };
  },
  destroyed() {
    Bus.$off('reset', this.onReset)
    Bus.$off('update', this.onUpdate)
    Bus.$off('end', this.onReset)
    setTimeout(() => {
      this.chart.destroy()
      this.chart = null
    }, 1000)
  },
  mounted() {
    this.renderChart();
    Bus.$on('reset', this.onReset);
    Bus.$on('end', this.onReset);
    Bus.$on('start', this.onStart);
    Bus.$on('update', this.onUpdate);
  },
  methods: {
    renderChart() {
      // const x = d3.scaleTime().range([0, 430]);
      // const y = d3.scaleLinear().range([210, 0]);
      // d3.axisLeft().scale(x);
      // d3.axisBottom().scale(y);
      // x.domain(d3.extent(this.data, (d, i) => i));
      // y.domain([0, d3.max(this.data, d => d)]);
      // return { x, y };

      d3.csv('../../../data/gates_money.csv', (error, data) => {

        if (error) {
          console.log(error);
        }

        chart(data, this.$el)
      });
    },
    // calculatePath() {
    //   const scale = this.getScales();
    //   const path = d3.line()
    //     .x((d, i) => scale.x(i))
    //     .y(d => scale.y(d));

    //   this.line = path(this.data);
    // },
  },
};
</script>

<style scoped>
  .svg {
    margin: 25px;
  }

  .path {
    fill: none;
    stroke: #76BF8A;
    stroke-width: 3px;
  }
  
</style>
