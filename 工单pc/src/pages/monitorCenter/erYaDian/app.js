import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
Vue.prototype.$http = axiosUtil;
Vue.use(ElementUI)
console.error(IS_DEV)
if(IS_DEV){
  Vue.prototype.HOST="/api"
 
}else{
  Vue.prototype.HOST=""
}  

window["erYaDianApp"]=new Vue({
  el: '#app',
  render: h => h(App)
})
