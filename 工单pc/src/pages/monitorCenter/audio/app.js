import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import {initAppConfig} from '@/common/js/appConfig'
import seeImage from '@/directives/seeImage/index'
Vue.prototype.$http = axiosUtil;
Vue.use(seeImage)
 
initAppConfig(IS_DEV);
window['app']=new Vue({
  el: '#photoApp',
  render: h => h(App)
})
