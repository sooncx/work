import Vuex from 'vuex'
import Vue from 'vue'
import State from './state'
import mutations from './mutations'
import Action from './action'
Vue.use(Vuex)

let Store = new Vuex.Store({
  state: State,
  mutations: mutations,
  actions: Action
})

export default Store
