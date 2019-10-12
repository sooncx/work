
const users = {
  'admin': {
    name: '管理员',
    permissionLevel: 0,
    sessionId: 'swasfsaewafweaewafawewerrqe'
  },
  'test': {
    name: '测试胡飞飞',
    permissionLevel: 1,
    sessionId: 'swasfsaewafweaewafawewerrqe'
  }
}

export default [
  // user login
  {
    url: '/api/user/login.json',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = users[username]

      // mock error
      if (!token) {
        return {
          code: -1,
          message: ''
        }
      }

      return {
        code: 0,
        data: token
      }
    }
  },
  {
    url: '/api/user/changePwd\.*',
    type: 'post',
    response: config => {
      return {
        code: 0
      }
    }
  },
  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
