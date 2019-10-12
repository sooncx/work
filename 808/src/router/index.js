import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
import configRouter from './modules/config'
// leavAfterClose 离开当前页面后自动关闭头部tag
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/profile/index'),
      name: 'Profile',
      meta: {
        title: '个人资料',
        icon: 'user',
        noCache: true
      }
    }, {
      path: 'changepwd',
      component: () => import('@/views/profile/changePwd'),
      name: 'ChangePwd',
      meta: {
        title: '修改密码',
        icon: 'user',
        noCache: true
      }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/devicemanage/index',
    meta: {
      title: '终端管理',
      icon: 'deviceList',
      affix: false
    },
    children: [{
        path: '/devicemanage/index',
        component: () => import('@/views/deviceManage/index'),
        name: 'DeviceManageIndex',
        meta: {
          title: '终端列表',
          icon: 'list',
          affix: false
        }
      },
      {
        path: 'addnew',
        component: () => import('@/views/deviceManage/addNew'),
        name: 'DeviceManageAddNew',
        meta: {
          title: '新增终端',
          icon: 'add',
          affix: true,
          noCache: true
        }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    alwaysShow: false,
    redirect: '/test/device',
    meta: {
      title: '检测管理',
      icon: 'jiance',
      affix: false
    },
    children: [{
        path: 'device',
        component: () => import('@/views/deviceManage/testManag'),
        name: 'TestManag',
        meta: {
          title: '终端检测',
          icon: 'check',
          affix: true
        }
      },
      {
        path: 'index',
        component: () => import('@/views/log/index'),
        name: 'LogIndex',
        meta: {
          title: '检测日志',
          icon: 'rizhi'
        }
      }, {
        path: 'report',
        component: () => import('@/views/log/report'),
        name: 'LogReport',
        meta: {
          title: '检测报告',
          icon: 'report'
        }
      },
      {
        hidden: true,
        path: 'logdetail',
        component: () => import('@/views/log/detail'),
        name: 'LogDetail',
        meta: {
          title: '检测日志详情'
        }
      },
      {
        hidden: true,
        path: 'logdetailItem',
        component: () => import('@/views/log/itemDetail'),
        name: 'logdetailItem',
        meta: {
          title: '详情',
          noCache: true,
          leavAfterClose: true
        }
      }
    ]
  },
  {
    path: '/function',
    component: Layout,
    alwaysShow: true,
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/function/index'),
      name: 'FunctionIndex',
      meta: {
        title: '功能测试',
        icon: 'test',
        roles: ['admin', 'test'],
        tagKey: 'testFunction'
      },
      children: [{
        path: 'standard',
        component: () => import('@/views/function/standard/index'),
        name: 'FunctionStandard',
        meta: {
          title: '功能测试',
          roles: ['admin', 'test'],
          tagKey: 'testFunction'
        }
      }]
    }]
  }
]
/**
 * asyncRoutes
 * 根据用户权限动态生成路由
 */

export const asyncRoutes = [
  configRouter,
  {
    path: '/manage',
    component: Layout,
    children: [{
      path: 'user',
      component: () => import('@/views/userManage/index'),
      name: 'userManage',
      meta: {
        title: '用户管理',
        icon: 'user',
        roles: ['admin']
      }
    }]
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
