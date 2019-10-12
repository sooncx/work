import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import bsjError from './directive/bsjError/directive' // global filters
import imgsShow from './directive/imgsShow' // global filters
import keepTableScroll from './directive/keep-table-scroll' // global filters
import bsjPopover from './directive/bsj-popover' // global filters

import popLogDetail from './directive/popLogDetail/index.js' // global filters
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
Vue.use(VueVirtualScroller)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(bsjError)
Vue.use(imgsShow)
Vue.use(popLogDetail)
Vue.use(bsjPopover)
Vue.directive('keepTableScroll', keepTableScroll)

Vue.config.productionTip = false

Vue.$vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
