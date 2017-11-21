import Bus from './bus';
import Socket from './socket';
import StreamWorker from './stream.worker'
import { debounce, interval } from './helpers'

class StreamService {

  constructor() {
    this.init()
  }

  init() {
    this.tags = []
    this.worker = new StreamWorker()
    this.forceUpdate = this.forceUpdate.bind(this)
    this.onBroadcast = this.onBroadcast.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onTweet = this.onTweet.bind(this)
    this.updateInterval = interval(this.forceUpdate, 5500)
    this.worker.addEventListener('message', this.onBroadcast, false)
    this.onUpdate = debounce(this.onUpdate, 1000)
  }
 
  start(tags) {
    this.tags = tags

    Socket.on('tweet', this.onTweet)

    this.worker.postMessage({
      cmd: 'init',
      tags: tags
    })

    Socket.emit('filter', {
      track: tags.map((value) => {
        return `#${value}`
      })
    })

    this.updateInterval.start()

    Bus.$emit('start', tags);
  }

  reset() {
    Bus.$emit('reset', this.tags)
    this.worker.postMessage({
      cmd: 'reset'
    })
    this.worker.postMessage({
      cmd: 'broadcast'
    })
  }

  updateRSS(data) {
    Socket.emit('updateRSS', data);
  }
  
  end() {
    this.updateInterval.stop()

    Socket.off('tweet', this.onTweet)

    this.worker.postMessage({
      cmd: 'stop'
    })

    Socket.disconnect()

    setTimeout(() => {
      Socket.connect()
    }, 1000)
    Bus.$emit('end')
  }

  onTweet(tweet) {
    Bus.$emit('tweet', tweet)

    this.worker.postMessage({
      cmd: 'tweet',
      tweet
    })

    this.onUpdate()
  }

  onUpdate(data) {
    this.worker.postMessage({
      'cmd': 'broadcast'
    })
  }

  onBroadcast(e) {
    let data = e.data

    if (data.cmd !== 'data') {
      return
    }

    Bus.$emit('update', data.data)
  }

  forceUpdate() {
    this.onUpdate(true)
  }

  destroy() {
    this.worker.postMessage({
      cmd: 'close'
    })
    this.worker.removeEventListener('message', this.onMessage, false)
  }

}

export default (new StreamService())
