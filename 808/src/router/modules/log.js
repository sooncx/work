/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
const logRouter = {
  path: '/log',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/log/index'),
      name: 'logIndex',
      meta: { title: '检测日志', icon: 'test', roles: ['admin', 'test'], tagKey: 'log' },
      children: [
        {
          hidden: false,
          path: 'detailList',
          component: () => import('@/views/log/detailList'),
          name: 'testStandard',
          meta: { title: '检测日志列表', roles: ['admin', 'test'], tagKey: 'log' }
        }
      ]
    }
  ]
}

export default logRouter
