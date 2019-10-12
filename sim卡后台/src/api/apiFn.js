import axios from "./apiConfig";
import QS from "qs";

export function GET(url, params) {
  return new Promise((resolve,reject)=>{
    axios.get(url, { params }).then(res=>{
      if(res.data.flag === 1 || res.data) {
        resolve(res.data)
      }else {
        reject(res)
      }
    }).catch(e => reject(e))
  })
}

export function POST(url, params) {
  return new Promise((resolve,reject)=>{
    axios.post(url, QS.stringify(params)).then(res=>{
      if(res.data.flag === 1 || res.data) {
        resolve(res.data)
      }else {
        reject(res)
      }
    }).catch(e => reject(e))
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
