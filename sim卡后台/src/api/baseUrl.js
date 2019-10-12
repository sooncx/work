export default {
  login: '/login/login.json', // 登录

  getMap: 'http://120.77.62.74/test/map.json', // 获取地图信息

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

  loadInventoryData: 'customer/loadInventoryData.json', //加载库存

  searchSimListByInventory: 'customer/searchSimListByInventory.json', //搜索库存下的sim卡新

  getUploadStatus: '/stock/getUploadStatus.json', //轮询SIM卡导入状态

  sendBatchSms: "/operator/sendBatchSms.json", //批量短信下发

  getSendSmsStatus: "/operator/getSendSmsStatus.json", //获取批量短信下发的状态

  getDevReply: "/operator/getDevReply.json", //获取单卡的设备回复历史内容

  getIotLlcx: "/operator/getIotLlcx.json", //更新单卡的套餐流量信息

  getSendMsg: "/operator/getSendMsg.json", //获取短信下发记录

  updateOrderInfo: "/order/updateOrderInfo.json", //更新订单物流信息

  getDevReplyNewOne: "/operator/getDevReplyNewOne.json", // 获取SIM卡设备回复的最新一条历史内容

  exportOrderSimCard: '/exportExcel/exportOrderSimCard.json', //导出已完成订单对应的ICCID

  getSimMealChange: '/order/getSimMealChange.json', //sim卡套餐改变

  getOrderOfIccids: '/order/getOrderOfIccids.json', //获取套餐变更订单的ICCID

  updateFinishOrder: '/order/updateFinishOrder.json', //修改已完成订单接口

  updatePasswordOfA: '/operator/updatePasswordOfA.json', //更新A级用户密码

  addCustomOfA: '/operator/addCustomOfA.json', //增加A级用户

  transferEquative: '/customer/transferEquative.json', //SIM卡批量转移(A级转A级)

  transferDifferent: '/order/businessTransferOut.json', //商务端转出卡接口（类似于出库）

  updateSimInfo: '/operator/updateSimInfo.json', //编辑卡资料

  getSimMarkUserList: 'user/getSimMarkUserList.json', //获取simMark标记的新建用户列表

  getDataFromOldTerrace: '/stock/getDataFromOldTerrace.json', //同步客户旧平台数据

  shutDownPhoneByList: '/operator/shutDownPhoneByList.json', //批量停卡

  openPhoneBySimCard: '/operator/openPhoneBySimCard.json', //批量开卡操作

  renewOrder: '/order/renewOrder.json', //续费

  updatePriceByList: '/operator/updatePriceByList.json', //批量修改sim卡单价

  renewalByList: 'operator/renewalByList.json', //批量续费
}
