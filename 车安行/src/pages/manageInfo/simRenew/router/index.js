import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
/*** 
  requireAuth: false, //是否需要登录
  keepAlive: true, //是否离开当前页面的时候缓存当前页面
*/
import index from './../view/index/index'
import handlerRecord from './../view/handlerRecord'
export default new VueRouter({
  routes : [{
      path: "/",
      name: "Index",
      component: index,
      meta: {
        title: "sim卡列表",
        keepAlive: false
      }
    },
    {
      path: "/handlerRecord",
      name: "HandlerRecord",
      component:handlerRecord,
      meta: {
        title: "操作记录",
        keepAlive: false
      }
    }
  ],
  // mode: 'history'
})