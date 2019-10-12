import axios from 'axios'
// import qs from 'qs'
import { Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 35000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 是否可以自动出现api错误提示弹框
    config.isAutoShowMessage = config.isAutoShowMessage === undefined ? true : config.isAutoShowMessage
    if (store.getters.sessionId) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['sessionId'] = store.getters.sessionId
    }
    switch (config.method) {
      case 'post':
      case 'POST':
        // if (config.headers['Content-Type'] !== 'multipart/form-data') {
        //   config.data = qs.stringify(config.data, {
        //     // indices: false
        //   })
        // }

        break
      case 'get':
        break
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // code=0是成功 -是失败
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      if (response.config && response.config.isAutoShowMessage) {
        Message({
          showClose: true,
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      // USER_NULL(11002,"没此用户"),
      // UPDATE_FAIL(11003,"更新失败"),
      // DELETE_FAIL(11004, "删除失败"),
      // INSERT_FAIL(11005, "插入失败"),
      // PASSWORD_ERROR(11006,"密码错误"),
      // NOT_ADMINS_AUTH(11007, "无管理员权限"),

      if (res.code === 11001) {
        // to re-login
        store.dispatch('user/logout').then(() => {
          location.reload()
        })
      } else {
        return res
      }
      // debugger
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.config && error.config.isAutoShowMessage) {
      Message({
        message: '网络异常,请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
