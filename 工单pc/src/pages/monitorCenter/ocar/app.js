import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import {initAppConfig} from '@/common/js/appConfig'
Vue.prototype.$http = axiosUtil;

initAppConfig(IS_DEV)

new Vue({
  el: '#oCarApp',
  render: h => h(App)
})
