const state = {
  flag: 0,
}

const mutations = {

  switch: (state, myflag) => {
    state.flag = myflag;
  },
}

const actions = {
  switchFooter(context, myflag) {
    context.commit('switch', myflag)
  },
}

export default {
  state,
  mutations,
  actions
}
