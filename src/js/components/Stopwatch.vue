<template>
    <div id="time">
        {{hours}}: {{minutes}}: {{seconds}}
        <p>
            Hours Minutes Seconds 
        </p>
        <p>
            since the stream has been running
        </p>
    </div>
</template>

<style>
    #time p {
        display: block;
        font-size: 70%;
    }
</style>

<script>
    import { Bus, StreamService } from '../services'
    export default {
        name: 'Stopwatch',
        data: () => ({
            state: null,
            startTime: Date.now(),
            currentTime: Date.now(),
            interval: null
        }),
        mounted() {
            Bus.$on('start', this.startTimer);
            Bus.$on('end', this.stopTimer);
        },
        beforeDestroy() {
            Bus.$off('startTimer');
            Bus.$off('stopTimer');
        },
        destroyed() {
            clearInterval(this.interval)
        },
        computed: {
            time() {
                return this.hours + ':' + this.minutes + ':' + this.seconds;
            },
            milliseconds() {
                return this.currentTime - this.$data.startTime;
            },
            hours() {
                var lapsed = this.milliseconds;
                var hrs = Math.floor((lapsed / 1000 / 60 / 60));
                return hrs >= 10 ? hrs : '0' + hrs;
            },
            minutes() {
                var lapsed = this.milliseconds;
                var min = Math.floor((lapsed / 1000 / 60) % 60);
                return min >= 10 ? min : '0' + min;
            },
            seconds() {
                var lapsed = this.milliseconds;
                var sec = Math.ceil((lapsed / 1000) % 60);
                return sec >= 10 ? sec : '0' + sec;
            }
        },
        methods: {
            reset() {
                this.$data.state = "started";
                this.$data.startTime = Date.now();
                this.$data.currentTime = Date.now();
            },
            pause() {
                this.$data.state = "paused";
            },
            resume() {
                this.$data.state = "started";
            },
            updateCurrentTime()  {
                if (this.$data.state == "started") {
                    this.currentTime = Date.now();
                }
            },
            startTimer() {
                console.log("In start timer method!");
                this.reset();
                this.interval = setInterval(this.updateCurrentTime, 10);
            },
            stopTimer() {
                console.log("in stop timer method");
                clearInterval(this.interval);
                this.pause();
            } 
        }
    } 
</script>