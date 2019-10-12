
import 'element-ui/lib/theme-chalk/index.css'
import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import apiUtil from '@/common/js/apiUtil'
import CarUtil from '@/common/js/carUtil'
import Store from "@/store/store"
window["CarUtil"]=new CarUtil();
// import common from '@/common/js/common'
Vue.prototype.$http = axiosUtil;
console.error(IS_DEV)
if(IS_DEV){
  Vue.prototype.HOST="/api"
 
}else{
  Vue.prototype.HOST=""
} 
Vue.prototype.$apiUtil=new apiUtil(Vue) 
window["jkApp"]=new Vue({
  el: '#jkApp',
  store:Store,
  render: h => h(App)
})
