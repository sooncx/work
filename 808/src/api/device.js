import request from '@/utils/request'

export function addOneTerminal(data, config) {
  return request(Object.assign({
    url: '/api/terminal/addOne.json',
    method: 'post',
    data
  }, config))
}
export function updateOne(data, config) {
  return request(Object.assign({
    url: '/api/terminal/updateOne.json',
    method: 'post',
    data
  }, config))
}

export function getTerminalList(data) {
  return request({
    url: '/api/terminal/getTerminalList.json',
    method: 'get',
    params: data
  })
}

export function getTerminal(data) {
  return request({
    url: '/api/terminal/getTerminal.json',
    method: 'get',
    params: data
  })
}

export function delList(data) {
  return request({
    url: '/api/terminal/delList.json',
    method: 'get',
    params: data
  })
}
