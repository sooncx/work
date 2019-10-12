/** 管理员配置指令参数**/

import Layout from '@/layout'
const configRouter = {
  path: '/config',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'index',
      noShowingChildren: true,
      component: () => import('@/views/config/index'),
      name: 'configIndex',
      meta: { title: '配置管理', leavAfterClose: true, icon: 'config', roles: ['admin'], tagKey: 'config' },
      children: [
        {
          hidden: true,
          alwaysShow: false,
          path: 'standard',
          component: () => import('@/views/config/standard/index'),
          name: 'configStandard',
          meta: { title: '配置管理', roles: ['admin'], tagKey: 'config' }
        }
      ]
    }
  ]
}
export default configRouter
