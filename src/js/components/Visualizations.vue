<script>
import Bus from '../services/bus'

import Controls from './Controls.vue'
import Card from './Card.vue';

// Import all HighCharts Vue Components
import SolidGauge from './charts/SolidGauge.vue'
import StarPlot from './charts/StarPlot.vue'
import LiveSpline from './charts/LiveSpline.vue'
import Bar from './charts/Bar.vue'
import SentimentComparisonBarGraph from './charts/SentimentComparisonBarGraph.vue'
import WorldMap from './charts/WorldMap.vue'

// Incoming Tweets timeline
import TweetsTimeline from './TweetsTimeline.vue'

export default {
  name: 'Visualizations',
  components: {
    AppControls: Controls,
    AppCard: Card,
    ChartSolidGauge: SolidGauge,
    ChartStarPlot: StarPlot,
    ChartLiveSpline: LiveSpline,
    ChartBar: Bar,
    ChartWorldMap: WorldMap,
    ChartSentimentComparison: SentimentComparisonBarGraph,
    TweetsTimeline: TweetsTimeline
  },
  data: () => ({
    visualsActive: false,
    showSentimentComparisonChart: false
  }),
  created() {
    Bus.$on('start', this.onStart)
    Bus.$on('end', this.onEnd)
  },
  beforeDestroy() {
    Bus.$off('start', this.onStart)
    Bus.$off('end', this.onEnd)
  },
  methods: {
    onStart() {
      this.visualsActive = true,
      this.showSentimentComparisonChart = true
    },
    onEnd() {
      // this.visualsActive = false
      // this.showSentimentComparisonChart = false
    },
  
  }
}
</script>

<template>
<div>
  <app-controls></app-controls>
  <transition name="container">
    <div class="row" v-if="visualsActive">
      <transition name="card1" appear v-if="showSentimentComparisonChart">
        <app-card size="s12">
          <div slot="content">
            <chart-sentiment-comparison></chart-sentiment-comparison>
          </div>
        </app-card>
      </transition>
      <transition name="card2" appear>
        <app-card size="s12 m6">
          <div slot="content">
            <chart-solid-gauge></chart-solid-gauge>
          </div>
        </app-card>
      </transition>

      <!--<transition name="card2" appear>-->
        <!--<app-card size="s12 m6">-->
          <!--<div slot="content">-->
            <!--<chart-star-plot></chart-star-plot>-->
          <!--</div>-->
        <!--</app-card>-->
      <!--</transition>-->

      <!--<transition name="card3" appear>-->
        <!--<app-card size="s12 m6">-->
          <!--<div slot="content">-->
            <!--<chart-live-spline></chart-live-spline>-->
          <!--</div>-->
        <!--</app-card>-->
      <!--</transition>-->

      <transition name="card3" appear>
        <app-card size="s12 m6">
          <div slot="content">
            <chart-bar></chart-bar>
          </div>
        </app-card>
      </transition>

     

      <transition name="card4" appear>
        <app-card size="s12">
          <div slot="content">
            <tweets-timeline></tweets-timeline>
          </div>
        </app-card>
      </transition>

      <transition name="card6" appear>
        <app-card size="s12">
          <div slot="content">
            <chart-world-map></chart-world-map>
          </div>
        </app-card>
      </transition>

    </div>
  </transition>
</div>
</template>

<style scoped>
.container-leave-active {
  animation: fadeOutDown 0.8s ease 0s;
}

.container-enter-active {
  animation: fadeInUp 0.8s ease 0s;
}

.card1-enter-active {
  opacity: 0;
  animation: fadeIn 0.6s ease 0.4s;
}

.card2-enter-active {
  opacity: 0;
  animation: fadeIn 0.6s ease 0.6s;
}

.card3-enter-active {
  opacity: 0;
  animation: fadeIn 0.6s ease 0.75s;
}

.card4-enter-active {
  opacity: 0;
  animation: fadeIn 0.6s ease 0.9s;
}

.card5-enter-active {
  opacity: 0;
  animation: fadeIn 0.6s ease 1s;
}

.card6-enter-active {
  opacity: 0;
  animation: fadeIn 0.6s ease 1s;
}
</style>
