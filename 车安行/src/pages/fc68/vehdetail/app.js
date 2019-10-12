import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import {initAppConfig} from '@/common/js/appConfig'
Vue.prototype.$http = axiosUtil;
import CarUtil from '@/common/js/carUtil'
window["CarUtil"]=new CarUtil();
initAppConfig(IS_DEV);
window['app']=new Vue({
  el: '#fc68VehApp',
  render: h => h(App)
})
