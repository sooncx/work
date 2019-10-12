export default {
  GETUSER (state, token) { // 设置登录TOken
    state.TOKEN = token
  },
  GetCountOfNoread (state, val) { // 未读数
    state.GetCountOfNoread = val
  },
  GongDanList (state, val) { // 工单列表
    state.GongDanList = val
  },
  name (state, val) { // 工单列表
    state.name = val
  },
  carOwner (state, val) { // 工单列表
    state.carOwner = val
  },
  phone (state, val) { // 工单列表
    state.phone = val
  },
  installTime (state, val) { // 工单列表
    state.installTime = val
  },
  createTime (state, val) { // 工单列表
    state.createTime = val
  },
  address (state, val) { // 工单列表
    state.address = val
  },
  remark (state, val) { // 工单列表
    state.remark = val
  },
  deviceVos (state, val) { // 工单列表
    state.deviceVos = val
  },
  status (state, val) { // 工单列表
    state.status = val
  },
  carPicture (state, val) { // 工单列表
    state.carPicture = val
  },
  GD_data (state, val) { // 工单列表
    state.GD_data = val
  },
  newGongDanLoading (state, val) { // 工单列表
    state.newGongDanLoading = val
  },
  onlineList (state, val) { // 工单列表
    state.onlineList = val
  },
}
