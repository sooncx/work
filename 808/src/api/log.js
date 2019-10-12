import request from '@/utils/request'

export function searchAll(data) {
  return request({
    url: '/api/checkLog/searchAll.json',
    method: 'post',
    data
  })
}

export function checkLogDetail(data) {
  return request({
    url: '/api/checkLogDetail/search.json',
    method: 'post',
    data
  })
}

export function findOneById(params) {
  return request({
    url: '/api/checkLogDetail/findOneById.json',
    method: 'get',
    params
  })
}

export function searchReport(data) {
  return request({
    url: '/api/report/search.json',
    method: 'post',
    data
  })
}

export function fuzzySearchReport(data) {
  return request({
    url: '/api/report/searchName.json',
    method: 'post',
    data
  })
}

//获取测试结果详细信息
// export function getCheckResult(data) {
//   return request({
//     url: '/api/report/getPossInfoByType.json',
//     method: 'get',
//     params: data
//   })
// }

export function getCheckResult(data) {
  return request({
    url: '/api/report/getPossInfoByType.json',
    method: 'post',
    data
  })
}
