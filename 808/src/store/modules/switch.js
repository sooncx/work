const state = {
  flag: null,
  flag2: null
}

const mutations = {

  switch: (state, myflag) => {
    state.flag = myflag;
  },
  switch2: (state, myflag2) => {
    state.flag2 = myflag2;
  }
}

const actions = {

  switchFooter(context, myflag) {
    context.commit('switch', myflag)
  },
  switchFooter2(context, myflag2) {
    context.commit('switch2', myflag2)
  }
}

export default {
  state,
  mutations,
  actions
}
