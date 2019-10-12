// import axios from 'axios'
// import Store from './Store'
import axiosJsonp from '@/common/js/axiosJsonp';
import common from '@/common/js/common';

let defaultError = {
  data: {
    flag: 0,
    msg: "请求失败，请稍后再试"
  }
}
/* 创建一个新的 AXIOS 对象，确保原有的对象不变 */
let axiosUtil = axios.create({
  // headers: {
  //     // "Access-Control-Allow-Origin":"*"
  //     // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  // },
  timeout: 20000,
  CancelToken: axios.CancelToken
});
let getSessionId = function () {
  var sessionId = "";
  if (localStorage.getItem("sessionId") && localStorage.getItem("sessionId") !== "undefined") {
    sessionId = localStorage.getItem("sessionId") ? JSON.parse(localStorage.getItem("sessionId")) : ""
  }
  return sessionId
}
let cancel, promiseArr = {};
const CancelToken = axios.CancelToken;
/* 过滤请求 */
axiosUtil.interceptors.request.use((config) => {

  /*cancel  取消重复请求*/
  config.cancelToken = new config.CancelToken(function executor(c) {
    cancel = c;
    if (typeof config.userCancelToken === "function") { //如果还有设置的其他cancel的方式
      config.userCancelToken(cancel);
    };
  })
  config.isCanNotCancel = config.isCanNotCancel === undefined ? true : config.isCanNotCancel;
  if (!config.isCanNotCancel) { //是否不做限制同时请求多个
    if (promiseArr[config.url]) {
      promiseArr[config.url]()
      promiseArr[config.url] = cancel
    } else {
      promiseArr[config.url] = cancel
    }
  }
  // config.params['sessionId'] = '9c0f181e-3f8c-4c91-8d7c-520140bc2555'
  // config.params['loginToken'] = '4cdb8094-09a0-5272-c4bc-905bfefb50e3'

  config.responseType = config.responseType || "json"
  /*jsonp*/
  if (config.adapter === "jsonp") {
    config.adapter = axiosJsonp

  }
  if (!config.params) {
    config.params = {};
  }
  var sid = getSessionId()
  if (config.url.indexOf("login.json") === -1 && config.adapter !== "jsonp" && sid) {
    config.params = Object.assign({
      sessionId: sid
    }, config.params)
    // config.params.token = Store.state.token;
    // config.params.sessionId = Store.state.sessionId;
  }
  if (Vue.prototype.loginToken) {
    config.params.loginToken = Vue.prototype.loginToken
  }

  if (config.url.indexOf("http://restapi.amap.com/") !== -1) { //添加高德webApi的key
    // config.params.key = Store.state.mapAPIKey;
  }
  config.params['sessionId'] = 'cfb1c1b4-54f8-4039-87a1-c881c39a39ed'
  config.params['loginToken'] = '4cdb8094-09a0-5272-c4bc-905bfefb50e3'
  return config;
})
/* 过滤响应 */
axiosUtil.interceptors.response.use((result) => {
  var _result = result;
  // if (result.isJSONP) {
  //     _result = result.response;
  // }
  _LoginNoUse(result); //判断是否是登录过期
  return _result.data
}, (failRst) => {
  console.log("请求失败", failRst)
  if (failRst && failRst.request && failRst.request.status === 0) {
    console.log("请求超时")
    return Promise.reject({
      status: 'timeOut',
      msg: '请求超时,请稍后再试'
    });
  }
  if (failRst && failRst["__CANCEL__"]) {
    console.warn("取消请求", failRst);
    return Promise.reject({
      status: 'cancel',
      msg: 'cancel操作取消'
    });
  } else if (failRst && failRst.response && failRst.response.data) {

    if (failRst.config.isHandler) { //公用handler,

      APP.$handlerError(failRst.response)
    };
    if (typeof failRst.response.data === "stringf") {
      failRst.response.data = {
        msg: failRst.response.data
      }
    }
    return Promise.resolve(failRst.response)
  } else {
    return Promise.reject(defaultError)
  }
});
axiosUtil.CancelToken = axios.CancelToken
export default axiosUtil