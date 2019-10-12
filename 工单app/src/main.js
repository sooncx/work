// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import api from '@/api/httpApi'

import '@/assets/css/iconfont.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import dsBridge from 'dsBridge'
import  { ToastPlugin,DatetimePlugin } from 'vux'
Vue.use(ToastPlugin, {position: 'middle'})
import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)
// import  vconsole from 'vconsole'
// var consol = new vconsole()

// Vue.use(ElementUI);

window['dsBridge'] = dsBridge;
Vue.config.productionTip = false;
Vue.prototype.$byApi = api;
var vm=new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
window["OnAMapApiLoaded"]=function(){
  vm&&vm.$emit("onAmapApiLoaded")
}
window["app"]=vm
