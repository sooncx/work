import { login, changePwd } from '@/api/user'
import { getSessionId, setSessionId, removeSessionId, getUserData, setUserData, removeUserData } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  sessionId: getSessionId(),
  roles: [],
  data: getUserData() || {}
}
const mutations = {
  SET_TOKEN: (state, sessionId) => {
    state.sessionId = sessionId
    setSessionId(sessionId)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles || []
  },
  SET_USER_DATA: (state, data) => {
    state.data = data
    setUserData(data)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        data.avatar = require('@/assets/user/admin.svg')
        commit('SET_TOKEN', data.sessionId)
        commit('SET_USER_DATA', data)
        // this.dispatch('user/genRoles')
        // this.dispatch('permission/generateRoutes')
        resolve()
      }).catch(error => {
        setSessionId(12312)
        setUserData({
          name: 12312,
          permissionLevel: 0
        })
        reject(error)
      })
    })
  },
  changePwd({ commit }, data) {
    return new Promise((resolve, reject) => {
      changePwd(data).then(rst => {
        if (rst.code === 0) {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USER_DATA', {})
          removeSessionId()
          resetRouter()
          removeUserData()
        }
        resolve(rst)
      }).catch(error => {
        reject(error)
      })
    })
  },
  genRoles({ commit }) {
    var roles = []
    switch (this.state.user.data.permissionLevel) {
      case 0:
        roles = ['admin']
        break
      case 1:
        roles = ['test']
        break
      default:
        roles = ['test']
        break
    }
    commit('SET_ROLES', roles)
    return roles
  },
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_USER_DATA', {})
      removeSessionId()
      resetRouter()
      removeUserData()
      resolve()
    })
  },

  // remove sessionId
  resetSessionId({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeSessionId()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const sessionId = role + '-sessionId'

      commit('SET_TOKEN', sessionId)
      setSessionId(sessionId)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
