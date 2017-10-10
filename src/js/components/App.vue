<script>
import { AnimationBuilder } from 'css-animator/builder'
import { Bus, Socket } from '../services'
import Modal from './Modal.vue'
import Nav from './Nav.vue'

export default {
  name: 'App',
  data: () => ({
    errorMessage: 'Sorry, there was an error.',
    errorDetail: '',
    refreshVisualizations: true
  }),
  components: {
    AppNav: Nav,
    AppModal: Modal
  },
  created() {
    Socket.on('connections', status => {
      Bus.$emit('connections', status)
    })

    Socket.on('stream_active', status => {
      Bus.$emit('stream_status', status)
    })

    Socket.on('stream_inactive', status => {
      Bus.$emit('stream_status', status)
    })

    Socket.on('connect', err => {
      this.hideError()
    })

    Socket.on('error', err => {
      this.errorMessage = 'There was an error with the socket connection.'
      this.errorDetail = ''
      this.showError()
    })


    Socket.on('connect_timeout', () => {
      this.errorMessage = 'Socket connection timed out.'
      this.errorDetail = ''
      this.showError()
    })

    Socket.on('reconnect', number => {
      this.hideError()
    })

    Socket.on('reconnect_attempt', () => {

    })

    Socket.on('reconnecting', number => {
      this.errorMessage = 'Socket connection lost.'
      this.errorDetail = `Trying to reconnect now... (attempt ${number})`
    })

    Socket.on('reconnect_error', err => {
      this.showError()
    })

    Socket.on('reconnect_failed', () => {
      this.errorDetail = 'Reconnecting failed. Please reload the page.'
      this.showError()
    })

    Socket.on('stream_recovered', () => {
      this.hideError()
    })

    Socket.on('stream_error', () => {
      this.errorMessage = 'There was an error with the Twitter stream.'
      this.errorDetail = 'There may be too many concurrent connectins.'
      this.showError()
    })
  },
  mounted() {
    Bus.$on('refresh', this.refreshVisualizations);
    let animator = new AnimationBuilder()
    let element = document.getElementById('app-loading')

    animator
      .setType('fadeOut')
      .setDelay(500)
      .setDuration(500)
      .hide(element)
      .then(() => {
        element.classList.remove('running');
      })
  },
  destroyed() {
    Socket.removeAllListeners()
  },
  methods: {
    hideError() {
      this.$refs.errorModal.hide()
      this.errorMessage = 'Sorry, there was an error.'
      this.errorDetail = ''
    },
    showError() {
      this.$refs.errorModal.show()
    },
    refreshVisualizations() {
      this.refreshVisualizations = true;
    }
  }
}
</script>

<template>
<div class="container">
  <transition name="fade-nav" appear>
    <app-nav></app-nav>
  </transition>
  <transition name="fade-route" appear>
    <keep-alive>
      <router-view v-if="refreshVisualizations"></router-view>
    </keep-alive>
  </transition>


  <app-modal ref="errorModal" :closeButton="false" :canHide="false">
    <div slot="title">
      {{ errorMessage }}
    </div>
    <div slot="content">
      {{ errorDetail }}
    </div>
    <div slot="footer">
      <span class="waves-effect waves-teal btn-flat" onclick="window.location.reload(false)">Reload Page Now</span>
    </div>
  </app-modal>
</div>
</template>

<style scoped>
.fade-nav-enter-active {
  opacity: 0;
  animation: fadeInDown 0.8s ease 0.8s;
}

.fade-nav-leave-active {
  opacity: 1;
  animation: fadeOutUp 0.5s;
}

.fade-route-enter-active {
  opacity: 0;
  animation: fadeInUp 0.7s ease 1s;
}

.fade-route-leave-active {
  opacity: 1;
  animation: fadeOutDown 0.5s ease-out;
}
</style>
