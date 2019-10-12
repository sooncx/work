// import App from './app.vue'
// import axiosUtil from '@/common/js/axiosConfig'
// import {initAppConfig} from '@/common/js/appConfig'
// import seeImage from '@/directives/seeImage/index'
// import apiUtil from '@/common/js/apiUtil'
// import router from './router'
// Vue.prototype.$http = axiosUtil;

// import Store from "@/store/store"
// Vue.prototype.$api = new apiUtil(Vue);
// initAppConfig(IS_DEV);
// new Vue({
//   el: '#APP',
//   router,
//   store:Store,
//   render: h => h(App)
// })


import App from './app.vue'
import router from './router'
import axiosUtil from '@/common/js/axiosConfig'
import apiUtil from '@/common/js/apiUtil'
import {initAppConfig} from '@/common/js/appConfig'
Vue.prototype.$http = axiosUtil;
import CarUtil from '@/common/js/carUtil'
import "@/assets/css/style.less";
import "@/common/css/animate.less";
import Store from "@/store/store"
window["CarUtil"]=new CarUtil();
initAppConfig(IS_DEV);
Vue.prototype.$api = new apiUtil(Vue);
window['app']=new Vue({
  router,
  store:Store,
  el: '#APP',
  render: h => h(App)
})
