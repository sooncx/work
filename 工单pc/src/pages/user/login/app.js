// import Vue from 'vue'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import {initAppConfig} from '@/common/js/appConfig'

Vue.prototype.$http = axiosUtil;
initAppConfig(IS_DEV);
 
new Vue({
  el: '#app',
  render: h => h(App)
})
