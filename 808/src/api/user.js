import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login.json',
    method: 'post',
    data
  })
}

// export function logout() {
//   return request({
//     url: '/user/logout',
//     method: 'post'
//   })
// }

export function changePwd(data) {
  return request({
    url: '/api/user/changePwd.json',
    method: 'post',
    data
  })
}

export function GetUserInfo(data) {
  return request({
    url: '/api/user/findOne.json',
    method: 'post',
    data
  })
}

export function GetAllUser(data) {
  return request({
    url: '/api/user/findAll.json',
    method: 'post',
    data
  })
}

export function AddUser(data) {
  return request({
    url: '/api/user/addOne.json',
    method: 'post',
    data
  })
}

export function DelUser(data) {
  return request({
    url: '/api/user/delOne.json',
    method: 'post',
    data
  })
}

export function EditUser(data) {
  return request({
    url: '/api/user/modifyOne.json',
    method: 'post',
    data
  })
}

