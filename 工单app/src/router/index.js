import router from './router'
import store from '../store/index'
// import { byUtil } from '../public/js/plugin/base'

router.beforeEach((to, from, next) => {

  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    // if (store.state.TOKEN) {
    if (localStorage.getItem('sid')) {
      // 通过vuex state获取当前的token是否存在
      next()
    } else {
      next({
        path: '/Login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router
