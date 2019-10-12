import vue from 'vue'
import vuex from 'vuex'
vue.use(vuex)

function genCarGrounpTree(a, idStr, pidStr, chindrenStr) { //json转树状图结构
  var r = [],
    hash = {},
    id = idStr,
    pid = pidStr,
    children = chindrenStr,
    i = 0,
    j = 0,
    len = a.length;
  for (; i < len; i++) {
    hash[a[i][id]] = a[i];
  }
  for (; j < len; j++) {
    var aVal = a[j],
      hashVP = hash[aVal[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(aVal);
    } else {
      r.push(aVal);
    }
  }
  return r;
}
const store = new Vuex.Store({
  state: {
    grouData: null,
    dowloadList: [],
  },
  actions: {
    setDowloadListRoot(context) {
      context.commit('setDowloadList');
    }
  },
  mutations: {
    setGroupData(state, data) {
      state.grouData = data
    },
    setDowloadList(state, data) {
      state.dowloadList = data;
    }
  },
  getters: {
    grouTreeData(state) {
      return state.grouData === null ? null : genCarGrounpTree(state.grouData, 'gi', 'pi', 'children')
    },
    getDowloadList() {
      return state.dowloadList;
    }
  }
})
export default store