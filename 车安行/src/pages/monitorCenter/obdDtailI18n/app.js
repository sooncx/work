import App from './app.vue'
import axiosUtil from '@/common/js/axiosConfig'
import {initAppConfig} from '@/common/js/appConfig'

Vue.prototype.$http = axiosUtil;


// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: 'zh', // 设置地区
  messages: {
    'zh': require('./language/zn'),
    'en': require('./language/en'),
  }
})


initAppConfig(IS_DEV)

new Vue({
  el: '#oCarApp',
  i18n,
  render: h => h(App)
})
