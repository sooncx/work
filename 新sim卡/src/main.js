import App from './App'
import router from './router'
import store from './store/'
import Vue from './util/usePlugin'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$url = ''
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  store
})