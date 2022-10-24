import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import md5 from 'js-md5'

// element
import ElementUI from 'element-ui'
import './styles/element-variables.scss'
// css
import 'normalize.css'
import './styles/common.scss'

import '@/icons' // icon

import '@/router/beforeRouter' //
import i18n from './lang'
import moment from 'moment'
/* import InfiniteScroll from 'vue-infinite-scroll'*/
import * as filters from '@/filters' // global filters

import load from './utils/loading.js'
Vue.config.productionTip = false
Vue.prototype.$md5 = md5

Object.defineProperty(Vue.prototype, '$moment', {
  value: moment
})
Vue.use(Viewer)
/* Vue.use(InfiniteScroll)*/
Vue.prototype.$Loading = load

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
