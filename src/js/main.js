import './bootstrap'

import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import App from './components/App.vue'
import Visualizations from './components/Visualizations.vue'
// scrolling
import InfiniteScroll from 'v-infinite-scroll'
import 'v-infinite-scroll/dist/v-infinite-scroll.css'

Vue.use(Router)
Vue.use(Resource)
Vue.use(InfiniteScroll)

const routes = [{
  path: '/',
  name: 'visualizations',
  component: Visualizations
}, {
  path: '*',
  redirect: {
    name: 'visualizations'
  }
}]

const router = new Router({
  mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  next()
})

Object.assign(App, {
  el: '#app',
  router: router
})

const app = new Vue(App)
