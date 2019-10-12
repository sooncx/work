
export default [
  // user login
  {
    url: '/api/terminal/addOne.json',
    type: 'post',
    response: config => {
      return {
        code: 0,
        msg: '添加成功'
      }
    }
  }
]
