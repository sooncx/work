import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/index'
import home from '@/view/GongDan/home'
import me from '@/view/Me/me'
import Login from '@/view/Login/Login'
import modified_data from '@/view/modified_data/modified_data'
import passWord from '@/view/passWord/passWord'
import Details from '@/view/Details/Details'
import AddNew from '@/view/AddNew/AddNew'
import InstallInfo from '@/view/InstallInfo/InstallInfo'
import Equipment from '@/view/Equipment/Equipment'

console.log(InstallInfo)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login', // 修改个人信息
      name: 'Login',
      component: Login
    },
    {
      path: '/', // 头部底部
      // redirect: '/index', // 重定向至首页
      name: 'index',
      // meta: {
      //   requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      // },
      component: index,
      children: [
        {
          path: '/home', // 首页
          name: 'home',
          component: home,
        },
        {
          path: '/me',
          name: 'me', // 我的
          component:me 
        }
      ]
    },
    {
      path: '/Details', // 工单详情
      name: 'Details',
      component: Details
    },
    {
      path: '/AddNew', // 新建工单
      name: 'AddNew',
      component: AddNew
    },
    {
      path: '/InstallInfo', // 上传安装信息
      name: 'InstallInfo',
      component: InstallInfo
    },
    {
      path: '/Equipment', // 查看设备信息
      name: 'Equipment',
      component: Equipment
    },
    {
      path: '/modified_data', // 修改个人信息
      name: 'modified_data',
      component: modified_data
    },
    {
      path: '/passWord', // 修改个人信息
      name: 'passWord',
      component: passWord
    },

    
  ]
})
