import axios from 'axios'
import store from '../store/index'
// import axiosJsonp from 'axios-jsonp'
import $route from '../router/index'
// 创建axios实例
var instance = axios.create({ timeout: 15000 })
if (process.env.NODE_ENV === 'development') {
  instance.defaults.baseURL = '/api'   // 开发环境
  //http://192.168.130.240:8080/   浩哥本地
  // http://192.168.130.241:8083   小华本地
  // http://120.77.97.58:8080/   测试服务器
  // http://47.106.47.148:6404/   正式服务器
} else if (process.env.NODE_ENV === 'production') {
  instance.defaults.baseURL = '/'  // 生产环境
}

// 设置post请求头
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
// 设置Get  请求投
// instance.defaults.headers.get['Content-Type'] ='application/json;charset=UTF-8'

// 请求拦截器
instance.interceptors.request.use(
  config => {
    config.params = config.params || {}
    config.headers['sessionId'] = store.state.LOGINUSER ? store.state.LOGINUSER.sId : ""
    // config.params['loginToken'] = store.state.LOGINKOKEN
    // config.adapter = config.adapter === 'jsonp' ? axiosJsonp : config.adapter

    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  res => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
  // 服务器状态码不是200的情况
  error => {
    console.error(error)
    if(!error.response) {
      return Promise.reject(error)
    }
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          if ($route) {
            $route.push('/login')
          }
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          break
        // 404请求不存在
        case 404:
          break
        // 其他错误，直接抛出错误提示
        default:
      }
      return Promise.reject(error.response)
    }
  }
)

export default instance
