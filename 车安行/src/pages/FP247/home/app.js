import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import apiUtil from '@/common/js/apiUtil'
import router from "../../workSheet/router/index"
import {
  initAppConfig
} from '@/common/js/appConfig'
Vue.prototype.$http = axiosUtil;
import CarUtil from '@/common/js/carUtil'
import Store from "@/store/store"
window["CarUtil"] = new CarUtil();
initAppConfig(IS_DEV);
Vue.prototype.$api = new apiUtil(Vue);
window['app'] = new Vue({
  store: Store,
  router,
  el: '#fc68VehApp',
  render: h => h(App)
})