import axios from "./apiConfig";
import QS from "qs";

export function GET(url, params) {
  return axios.get(url, { params });
}

export function POST(url, params) {
  return axios.post(url, QS.stringify(params));
}

export function custom (options) {
  return axios(options)
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
