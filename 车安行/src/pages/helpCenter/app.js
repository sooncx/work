import Vue from 'vue'

// import VueRouter from 'vue-router'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './app.vue'
import store from './store/store.js'
import router from  './router/index'

new Vue({
  // el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#HelpApp')

// new Vue({
//   el: '#HelpApp',
//   router,
//   store,
//   render: h => h(App)
// })