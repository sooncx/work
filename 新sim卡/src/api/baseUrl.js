export default {
  login: '/login/login.json', // 登录

  getMap: '/map.json', // 获取地图信息

  updatePwd: '/user/updatePwd.json', //修改密码

  loadGroupsData: '/customer/loadGroupsData.json', //加载车组或批次数据

  delGprsBagInfo: '/homePage/delGprsBagInfo.json', //删除套餐信息

  pushNumSegment: '/stock/pushNumSegment.json', //卡段入库OR批量入库

  addAndUpdateGprsBag: '/homePage/addAndUpdateGprsBag.json', //新增修改套餐

  findByGprsBagList: '/homePage/findByGprsBagList.json', //获取套餐信息列表

  findByGprsBagInfo: '/homePage/findByGprsBagInfo.json', //获取套餐信息详情

  getDestroyCardDetail: '/repertory/getDestroyCardDetail.json', //获取销卡详细信息

  orderCard: '/order/outPutCard.json', //订单出库

  backCard: '/stock/backCard.json', //退卡入库

  chargeOffCard: '/repertory/chargeOffCard.json', //销卡

  getDestroyCardInfo: '/repertory/getDestroyCardInfo.json', //销卡记录列表

  loadSimListByGroups: '/customer/loadSimListByGroups.json', //获得卡组或批次的SIM卡信息

  updateUser: '/user/updateUser.json', //修改客户

  addUser: '/user/addUser.json', //添加用户

  getUserInfo: '/user/getUserInfo.json', //获取用户信息

  getManageUserInfo: '/user/getManageUserInfo.json', //获得用户列表

  getOrderList: '/order/getOrderList.json', //获取订单列表

  getOrderDetail: '/order//getOrderDetail.json', //获取订单详情

  pushCustomerOrder: '/order/pushCustomerOrder.json', //订单提交

  runOrderInfo: '/order/runOrderInfo.json', //销售端设置购买单价  

  setGlobalRisk: '/riskManage/setGlobalRisk.json', //风控管理添加(包含商务端和客户端)

  getNextUserInfo: '/user/getNextUserInfo.json', //获得用户子集用户

  uploadSimExcel: '/stock/uploadSimExcel.json', //批量导入SIM卡

  getIndexStopData: '/dealerIndex/getIndexStopData.json', //  首页静态数据

  getIndexRunData: '/dealerIndex/getIndexRunData.json', // 首页动态数据

  loadInventoryData: 'customer/loadInventoryData.json', //  加载库存

  addSimGroup: '/simGroup/addSimGroup.json', //新增卡组

  loadSimGroup: '/simGroup/loadSimGroup.json', //新增卡组

  searchSimListByInventory: '/customer/searchSimListByInventory.json', //新增卡组

  searchSimListByGroups: '/customer/searchSimListByGroups.json', //搜索卡组下的sim卡信息

  transferGroupSim: "/cardProcess/transferGroupSim.json", //卡片转移到卡组

  transferUserSim: "/cardProcess/transferUserSim.json", //卡片划拨

  sellSimList: "/customer/sellSimList.json", //卡片划拨

  sendBatchSms: "/operator/sendBatchSms.json", //批量短信下发

  getSendSmsStatus: "/operator/getSendSmsStatus.json", //获取批量短信下发的状态

  getDevReply: "/operator/getDevReply.json", //获取单卡的设备回复历史内容

  getIotLlcx: "/operator/getIotLlcx.json", //更新单卡的套餐流量信息

  getSendMsg: "/operator/getSendMsg.json", //获取短信下发记录

  getOrderHistory: "/order/getOrderHistory.json", //获取短信下发记录

  updateSimGroup: "/simGroup/updateSimGroup.json", //   修改卡组信息

  restockUserSim: "/cardProcess/restockUserSim.json", //退卡入库

  getDevReplyNewOne: "/operator/getDevReplyNewOne.json", // 获取SIM卡设备回复的最新一条历史内容

  exportCustomerSim: "/homePage/exportCustomerSim.json", //  首页sim卡导出

  getIotLlcxAll: "/operator/getIotLlcxAll.json", //  首页sim卡导出

  uploadPayCode: "/customer/uploadPayCode.json", // 上传二维码

  getCustomPayCode: "/customer/getCustomPayCode.json", // 获取二维码

  addRemarkOfSim: "/cardProcess/addRemarkOfSim.json", //   获取

  getRiskManage: "/riskManage/queryPredictCard.json", //获取预期/过期卡信息

  getSimGprsCount: "/riskManage/trafficMonitoring.json", //获取预超/以超流量的sim卡数量

  getSimCardsCount: "/riskManage/warnCountOfExpire.json", //获取预/以过期sim卡数量

  exportRiskSimCard: "/exportExcel/exportRiskSimCard.json", //导出所有sim卡信息

  getCountOfStock: "/riskManage/queryCountOfStock.json", //获取出入库数据
}