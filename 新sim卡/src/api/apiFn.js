import axios from "./apiConfig";
import QS from "qs";
import {message} from '../util/message'

export function GET(url, params) {
  return new Promise((resolve,reject)=>{
    axios.get(url, { params }).then(res=>{
      console.log(res.status)
      if(res.data.code !== -1 && res.status === 200) {
        resolve(res.data)
      }else {
        message(-1,res.data.msg || '服务器错误')
        reject(res)
      }
    })
  })
}

export function POSTBody(url, params) {
  return axios({
    url,
    data: params,
    method: "post",
    headers: {
      "Content-Type": "application/json"
    }
  });
}
export function POST(url, params) {
  return new Promise((resolve,reject)=>{
    axios.post(url, QS.stringify(params)).then(res=>{
      if(res.data.code === 0 && res.status === 200) {
        resolve(res.data)
      }else {
        message(-1,res.data.msg || '服务器错误')
        reject(res)
      }
    })
  })
}

export function Form(url, params) {
  return axios({
    url,
    data: params,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export function JSONP(url, params) {
  return axios({
    adapter: "jsonp",
    url: url,
    params: params,
    callbackName: "JsonCallBack",
    method: "get"
  });
}
