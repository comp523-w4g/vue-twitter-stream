<script>
import { Bus, StreamService } from '../services'

export default {
  name: 'Controls',
  data: () => ({
    chips: [],
    chipsPlaceholder: '+Tag',
    chipsShortPlaceholder: '+Tag',
    value: '',
    streamActive: false,
    connectedClients: 0,
    streamOccupied: false,
    numTweets: 0,
    chipsLimit: 3,
    chipsLimitText: 'three'
  }),
  created() {
    Bus.$on('tweet', this.onTweet)
    Bus.$on('end', this.onEnd)
    Bus.$on('reset', this.onReset)
    Bus.$on('stream_status', this.onStreamStatus)
    Bus.$on('connections', this.onConnections)
  },
  beforeDestroy() {
    Bus.$off('tweet', this.onTweet)
    Bus.$off('end', this.onEnd)
    Bus.$off('reset', this.onReset)
    Bus.$off('stream_status', this.onStreamStatus)
    Bus.$off('connections', this.onConnections)
  },
  mounted() {
    setTimeout(() => {
      this.focus()
    }, 500)
  },
  methods: {
    onStreamStatus(status) {
      this.connectedClients = status.connections
      this.streamOccupied = status.streamActive
    },
    onConnections(status) {
      this.connectedClients = status.connections
      this.streamOccupied = status.streamActive
    },
    onEnd() {
      this.numTweets = 0
      this.streamActive = false
    },
    onReset() {
      this.numTweets = 0
    },
    onTweet() {
      this.numTweets++
    },
    startStream() {
      this.streamActive = true
      StreamService.start(this.chips)
    },
    addChip() {
      let split = this.value.trim().split(' ')
      this.value = ''
      let maxLen = this.chipsLimit - this.chips.length
      for (let i = 0; i < split.length; i++) {
        if (i >= maxLen) break
          // TODO: Parse valid hashtag from passed string
        let tag = split[i].trim().replace(/#/gi, '')
        let lower = this.chips.map(entry => entry.toLowerCase())
        if (lower.indexOf(tag.toLowerCase()) !== -1) continue
        this.chips.push(tag)
      }
    },
    removeChip(index) {
      this.chips.splice(index, 1)
    },
    removePrevChip() {
      if (!this.value.length) {
        this.chips.splice(-1, 1)
      }
    },
    focus() {
      this.$refs.tagsInput.focus()
    }
  },
  computed: {
    limitReached() {
      return this.chips.length >= this.chipsLimit
    },
    placeholderText() {
      if (this.limitReached) {
        return ''
      }

      if (this.chips.length) {
        return this.chipsShortPlaceholder
      }

      return this.chipsPlaceholder
    }
  }
}
</script>

<template>
<div>
  <div class="row">
    <div class="col s12">
      <div class="card white">
        <div class="card-content center-align black-text">
          <span class="card-title cyan-text">Watson For Good</span>

          <blockquote>
            Enter up to {{ chipsLimitText }} tags below and we'll stream live data from the
            <a class="btn-flat" href="https://dev.twitter.com/streaming/overview" target="_blank">Twitter API</a> to visualize it with the power of <a class="btn-flat" href="https://www.ibm.com/watson/services/tone-analyzer/" target="_blank">IBM Watson</a>
          </blockquote>

          <div class="row answers left-align">
            <div class="col s12 m2 hide-on-small-only"></div>
            <div class="col s12 m8" @click="focus">
              <div class="chips chips-placeholder" :style="{ 'border-bottom-color': chips.length ? 'transparent' : null }">
                <div class="chip" v-for="(chip, index) in chips">
                  #{{ chip }}<i v-show="!streamActive" class="material-icons close" @click="removeChip(index)">close</i>
                </div>
                <input class="input" ref="tagsInput" :readonly="limitReached" :placeholder="placeholderText" :style="{ width: !chips.length ? '250px !important' : limitReached || streamActive ? '0 !important' : '120px !important' }" @keydown.enter.prevent="addChip" @keydown.tab.prevent="addChip"
                    @keydown.delete="removePrevChip" v-model="value" maxlength="50">
              </div>
            </div>
            <div class="col s12 m2 hide-on-small-only"></div>
            <div v-if="!streamActive" class="col s12 center-align">
              <div v-if="chips.length > 0 && !streamOccupied">
                <transition name="fade-button" appear>
                  <span class="btn start-button waves-effect waves-light" @click="startStream">Start Stream</span>
                </transition>
              </div>
              <div v-else class="button-placeholder center-align grey-text text-lighten-1">
                <div v-if="streamOccupied">
                  Due to Twitter limitations, only one client can start a stream. Please wait until the stream is released. (Connections: {{ connectedClients }})
                </div>
                <div v-else>
                  Enter at least one tag to start a stream.
                </div>
              </div>
            </div>
            <div v-else class="col s12 center-align">
              <div class="center-align grey-text text-lighten-1">
                <a class="btn-flat disabled">Stream is active, counting {{ numTweets }} tweets <i><div class="loader running"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.loader {
  margin-left: 20px;
  margin-bottom: -5px;
  position: relative;
  display: inline-block;
  left: initial;
  top: initial;
  height: 24px;
  width: 24px;
  border-top: 3px solid #00bcd4;
  border-bottom: 3px solid #00bcd4;
  border-left: 3px solid #00bcd4;
  border-right: 3px solid #00bcd4;
}

.loader.running {
  animation-duration: 0.8s;
}

.loader:after {
  background-color: #fff;
  width: 15px;
  height: 16.5px;
  top: 14px;
  left: 7.5px;
}

.start-button {
  margin-top: 15px;
}

.button-placeholder {
  margin-top: 15px;
  max-width: 400px;
  height: 36px;
  left: 50%;
  margin-left: auto;
  margin-right: auto;
  overflow: visible;
}

.chips {
  margin-top: 1rem;
}

.card blockquote {
  max-width: 36rem;
  margin: 15px auto 25px auto;
  line-height: 1.7;
}

.card blockquote a.btn-flat {
  margin: 0;
  height: 20px;
  padding: 0 5px;
  line-height: 20px;
  margin-top: -2px;
}

.fade-button-enter-active {
  animation: fadeInDown 0.3s;
}
</style>
