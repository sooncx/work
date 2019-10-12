import request from '@/utils/request'

// 获取厂商列表及设备类型
export function getTerminal(data) {
  return request({
    url: '/api/manufac/listAndType.json',
    method: 'post',
    data
  })
}
// 获取某设备类型下面的所有终端
export function getlistTerminal(data) {
  return request({
    url: '/api/terminal/listTerminal.json',
    method: 'post',
    data
  })
}
// 模糊查询
export function search(data) {
  return request({
    url: '/api/terminal/search.json',
    method: 'post',
    data
  })
}

