export default {
  GETUSER (state, token) { // 设置登录TOken
    state.TOKEN = token
  },
  GETLOGINUSER (state, obj) {
    state.LOGINUSER = obj
  },
  getSimList (state, obj) {
    state.simList = obj
  },
  GETUSERLIST (state,data) {
    state.userList = data
  }
}
