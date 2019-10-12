import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import apiUtil from '@/common/js/apiUtil'
import {
  initAppConfig
} from '@/common/js/appConfig'
Vue.prototype.$http = axiosUtil;
import CarUtil from '@/common/js/carUtil'
import "@/assets/css/style.less";
import "@/common/css/animate.less";
import Store from "@/store/store"
window["CarUtil"] = new CarUtil();
initAppConfig(IS_DEV);
Vue.prototype.$api = new apiUtil(Vue);
window['app'] = new Vue({
  store: Store,
  el: '#fc68VehApp',
  render: h => h(App)
})