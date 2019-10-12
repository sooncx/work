import Vue from 'vue'
import VueRouter from 'vue-router'

import work from '../work/index.vue'
import user from '../user/index.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes : [{
      path: "/work",
      name: "work",
      component: work,
      meta: {
        title: "默认页",
        requireAuth: false, //是否需要登录
        keepAlive: true, //是否离开当前页面的时候缓存当前页面
      }
    },
    {
      path: "/user",
      name: "user",
      component: user,
      meta: {
        title: "首页",
        requireAuth: false, //是否需要登录
        keepAlive: true, //是否离开当前页面的时候缓存当前页面
      }
    }
  ],
  // mode: 'history'
})