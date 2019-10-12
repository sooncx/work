import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import apiUtil from '@/common/js/apiUtil'
import {initAppConfig} from '@/common/js/appConfig'
Vue.prototype.$http = axiosUtil;

import "@/assets/css/style.less";
import Store from "@/store/store";
import VueRouter from 'vue-router'
import router from "../workSheet/router/index"
initAppConfig(IS_DEV);
Vue.use(VueRouter)
Vue.prototype.$api = new apiUtil(Vue);
window['app']=new Vue({
  store:Store,
  router,
  el: '#app',
  render: h => h(App)
})
