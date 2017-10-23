<script>
import { Bus, StreamService } from '../services'
import Modal from './Modal.vue'

export default {
  name: 'Nav',
  components: {
    AppModal: Modal
  },
  data: () => ({
    streamActive: false,
    resetting: false,
    ending: false,
  }),
  created() {
    Bus.$on('reset', this.onReset)
    Bus.$on('start', this.onStart)
    Bus.$on('end', this.onEnd)
  },
  beforeDestroy() {
    Bus.$off('reset', this.onReset)
    Bus.$off('start', this.onStart)
    Bus.$off('end', this.onEnd)
  },
  methods: {
    onStart() {
      this.streamActive = true
    },
    onEnd() {
      this.streamActive = false
      setTimeout(() => {
        this.ending = false
      }, 500)
    },
    onReset() {
      this.resetting = false
    },
    end() {
      this.ending = true
      setTimeout(() => {
        StreamService.end()
      }, 200)
      Bus.$emit('stopTimer');
    },
    reset() {
      this.resetting = true
      setTimeout(() => {
        StreamService.reset()
      }, 200)
    },
    showInfo() {
      this.$refs.infoModal.show()
    }
  }
}
</script>

<template>
<div class="nav-wrapper">
  <div class="row">
    <div class="col s12">
      <nav>
        <div class="nav-wrapper white black-text">
          <a class="brand-logo cyan-text hide-on-small-only">
            <img src="assets/icons/line_chart.svg" title="logo">
          </a>
          <ul class="right">
            <li><a class="menuitem"><i class="material-icons teal-text text-lighten-1" @click="showInfo">info_outline</i></a></li>
            <li><a class="menuitem" :class="{ resetting: resetting, disabled: resetting || !streamActive }"><i class="material-icons" :class="{ 'blue-grey-text': !resetting && streamActive, 'grey-text': resetting || !streamActive }" @click="reset">refresh</i></a></li>
            <li><a class="menuitem" :class="{ resetting: ending, disabled: ending || !streamActive }"><i class="material-icons" :class="{ 'red-text': !ending && streamActive, 'grey-text': ending || !streamActive }" @click="end">close</i></a></li>
            <li class="github-button"><a href="https://github.com/comp523-w4g/vue-twitter-stream" target="_blank" class="waves-effect waves-light btn"><i class="material-icons left">code</i>GitHub</a></li>
             <li class="github-button"><a href="https://comp523-w4g.github.io/watson-4-good-old/" target="_blank" class="waves-effect waves-light btn"><i class="material-icons left">link</i>W4G</a></li>
          </ul>
          <div class="progress">
            <div class="determinate" style="width:0%"></div>
          </div>
        </div>
      </nav>
    </div>
  </div>

  <app-modal ref="infoModal" :closeButton="true" :canHide="true">
    <div slot="title">
      Watson 4 Good
    </div>
    <div slot="content">
      This is a project for the course <strong>COMP 520</strong> at the <a href="https://github.com/comp523-w4g/vue-twitter-stream" target="_blank">University of North Carolina at Chapel-Hill</a> by Victor Cui, Michael Gu, Greer Glenn, and Amogh Sharma. To learn more about the project, please head over to our <a href="https://github.com/comp523-w4g/vue-twitter-stream" target="_blank">repository on GitHub</a>.
    </div>
  </app-modal>
</div>
</template>

<style scoped>
@keyframes ldboxrotate {
  to {
    transform: rotate(1turn);
  }
}

.resetting {
  animation-fill-mode: both;
  animation-name: ldboxrotate;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: running;
  animation-duration: 0.8s;
}

a.menuitem.disabled {
  transition: none;
}

a.menuitem.disabled:hover {
  background: transparent;
  cursor: default;
}

.progress {
  position: absolute;
  border-radius: 0;
  margin: 0;
  background-color: transparent;
  bottom: 0;
}

.nav-wrapper {
  margin-bottom: 0.5rem;
}

.nav-wrapper>.row {
  margin-bottom: 5px;
}

.menuitem {
  cursor: pointer;
}

ul li .btn i {
  font-size: 1.3rem;
  line-height: 36px;
}

ul li a.menuitem:hover {
  background-color: rgba(236, 239, 241, 1);
}

ul li a.btn {
  padding: 0 1.8rem 0 1.3rem;
}

.brand-logo {
  height: 100%;
  left: 0;
}

a.brand-logo {
  cursor: default;
}

.brand-logo img {
  cursor: default;
  height: 1.3em;
  margin-left: 10px;
  display: block;
  position: absolute;
  top: 50%;
  /* put further to top than center */
  margin-top: -0.7em;
}

@media only screen and (max-width: 369px) {
  .github-button {
    display: none;
  }
}
</style>
