import router from "./routers";
// import store from '../store/index'
// import { byUtil } from '../public/js/plugin/base'
// let Token = byUtil.getCookie('sid')

// if (Token) {
//   store.commit('GETUSER', Token)
// }


router.beforeEach((to, from, next) => {
  //  设置监控中心动画
  // if (to.name === "MonitorCenter" || from.name === "login") {
  //   router.isBack = "fadeIn";
  // }

  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (store.state.TOKEN) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router;
