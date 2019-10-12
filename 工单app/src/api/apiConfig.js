import axios from 'axios'
import store from '../store/index'
import axiosJsonp from 'axios-jsonp'
import $route from '../router/index'
import {
  Message
} from 'element-ui'
import {
  INSPECT_MAX_BYTES
} from 'buffer';
axios.defaults.withCredentials = true
// 创建axios实例
var instance = axios.create({
  timeout: 60000,
  withCredentials: false
})
// var instance = axios.create({ timeout: 2000 })
if (process.env.NODE_ENV === 'development') {
  // instance.defaults.baseURL = 'http://120.77.58.193:10111/'    // mock
  // instance.defaults.baseURL = '/api'    // 温志发
  // instance.defaults.baseURL = "http://120.78.4.57:7999" //生产环境
  // instance.defaults.baseURL ="http://39.108.197.42:8017/"//测试环境
  instance.defaults.baseURL = "http://192.168.100.226:7999" // 温志发

} else if (process.env.NODE_ENV === 'production') {
  // instance.defaults.baseURL = 'http://120.77.58.193:10111/'  // mock
  // instance.defaults.baseURL = 'http://39.108.197.42:8017/'  // 测试环境
  instance.defaults.baseURL = 'http://192.168.100.226:7999/' // 温志发
  //instance.defaults.baseURL = 'http://120.78.4.57:7999'; //生产环境
  // instance.defaults.baseURL = 'http://120.76.21.111:7999'; //生产测试

}

// 设置post请求头
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
// 设置Get  请求投
// instance.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8'

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // config.headers['sessionId'] = store.state.TOKEN

    config.headers['sessionId'] = localStorage.getItem('sid');

    // console.log(config.headers['sessionId'],"config.headers['sessionId']");
    config.params = config.params || {}
    //config.params['sessionId'] = store.state.TOKEN
    //config.params['loginToken'] = store.state.LOGINKOKEN
    //config.params['sessionId'] = localStorage.getItem('sid');
    config.adapter = config.adapter === 'jsonp' ? axiosJsonp : config.adapter
    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  res => {
    // debugger
    if (res.data && res.data.flag === 101) {
      $route.push('/Login')
      // store.commit('SetLoginFlag', 0)
      return
    }
    return (res.status === 200 ? Promise.resolve(res) : Promise.reject(res))
  },
  // 服务器状态码不是200的情况
  (error, a) => {
    if (error.response == undefined) {
      Message.error({
        message: '网络连接错误',
        duration: 1000
      });
    } else if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          if ($route) {
            $route.push('/Login')
            store.commit('SetLoginFlag', 0)
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
