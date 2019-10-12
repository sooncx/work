import request from '@/utils/request'

// 获取终端详细信息
export function terminalInfo(data) {
  return request({
    url: '/api/checkLog/terminalInfo.json',
    method: 'post',
    data
  })
}

// 获取功能列表检测状态
export function checkStateList(data) {
  return request({
    url: '/api/checkState/list.json',
    method: 'post',
    data
  })
}
// 获取功能列表检测状态
export function addOrUpdate(data) {
  return request({
    url: '/api/checkState/addOrUpdate.json',
    method: 'post',
    data
  })
}

// 获取功能某个功能下具体步骤的状态
export function selectByCheckLogIdFunction(params) {
  return request({
    url: '/api/checkState/selectByCheckLogIdFunction.json',
    method: 'get',
    params
  })
}
// 结束检测
export function changeState(data) {
  return request({
    url: '/api/checkLog/changeState.json',
    method: 'post',
    data
  })
}

// 接口名称 统一指令下发接口
export function orderDown(data) {
  return request({
    url: '/api/order/order.json',
    method: 'post',
    data
  })
}

// 上传升级包
export function updateFile(data, config) {
  return request(Object.assign({}, config, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/api/multi/updateFile.json',
    method: 'post',
    data
  }))
}

// 其他按钮统一接口 例如查看系统日志
export function externButton(data, config) {
  return request(Object.assign({}, config, {
    url: '/api/externButton/button.json',
    method: 'post',
    data
  }))
}

// 获取本轮webSocket推送的记录
export function getHistoryLog(params) {
  return request({
    url: '/api/checkLogDetail/getHistory.json',
    method: 'get',
    params
  })
}
