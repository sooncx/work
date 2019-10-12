import url from "./baseUrl";
import {
  GET,
  POST,
  JSONP,
  Form,
  POSTBody
} from "./apiFn";
import {
  get
} from "https";

export default {
  /**
   @method login
   @param {String,String} 参数名:{user,psw}
   @description 账号,密码
 */
  login: params => GET(url.login, params), // 企业登录

  /**
   @method getMap
   @param {String,String} 参数名:{user,psw}
   @description 账号,密码
 */
  getMap: params => GET(url.getMap, params), // 获取地图信息

  /**
   @method updatePwd
   @param {String,String,Number} 参数名:{newPwd,oldPwd，userId}
   @description 新密码,旧密码,userId
 */
  updatePwd: params => POST(url.updatePwd, params), // 修改密码

  /**
   @method loadGroupsData
   @param {} 参数名:{} 
   @description 
 */
  loadGroupsData: params => GET(url.loadGroupsData, params), // 加载车组或批次数据

  /**
   @method delGprsBagInfo
   @param {number} 参数名:{gprsId}
   @description 套餐ID
 */
  delGprsBagInfo: params => GET(url.delGprsBagInfo, params), // 删除套餐信息

  /**
   @method pushNumSegment
   @param {string,string,string,number,string} 参数名:{allDate,batch,endCard,pushType,startCard	}
   @description 批量入库卡号,入库批次,结束卡号,入库类型,起始卡号
 */
  pushNumSegment: params => GET(url.pushNumSegment, params), // 卡段入库OR批量入库

  /**
      @method addAndUpdateGprsBag
      @param {number,string,string,number} 参数名:{	gprsId,gprsType,remark,type}
      @description 套餐ID,套餐量,套餐说明,套餐单位
    */
  addAndUpdateGprsBag: params => GET(url.addAndUpdateGprsBag, params), // 新增修改套餐

  /**
      @method findByGprsBagList
      @param {} 参数名:{}
      @description 
    */
  findByGprsBagList: params => GET(url.findByGprsBagList, params), // 获取套餐信息列表

  /**
   @method delGprsBagInfo
   @param {number} 参数名:{gprsId}
   @description 套餐ID
    */
  delGprsBagInfo: params => GET(url.delGprsBagInfo, params), // 获取套餐信息详情

  /**
   @method getDestroyCardDetail
   @param {number,number,number} 参数名:{destroyId,pageNumber,pageSize	}
   @description ID,当前页,条数
    */
  getDestroyCardDetail: params => GET(url.getDestroyCardDetail, params), // 获取销卡详细信息

  /**
      @method orderCard
      @param {number,string,number,number,number,string,string} 参数名:{aUserId,orderId,outType,price,remark,startCard}
      @description 出库A级客户ID,结束卡号,订单ID,出库类型,出库单价,备注说明,开始卡号
    */
  orderCard: params => GET(url.orderCard, params), // 订单出库

  /**
   @method backCard
   @param {string} 参数名:{cardNo}
   @description 卡号
    */
  backCard: params => GET(url.backCard, params), // 退卡入库

  /**
   @method chargeOffCard
   @param {string,string} 参数名:{cardNo,remark}
   @description 卡号,销卡说明
    */
  chargeOffCard: params => GET(url.chargeOffCard, params), // 销卡

  /**
   @method getDestroyCardInfo
   @param {number,number} 参数名:{pageNumber,pageSize}
   @description 当前页,条数
    */
  getDestroyCardInfo: params => GET(url.getDestroyCardInfo, params), // 获取销卡详细信息

  /**
   @method loadSimListByGroups
   @param {string,string,number,string,number,number,string,number} 参数名:{endIccid,groups,searchType,simCard,simState,simType,startIccid,userId}
   @description 结束卡号,卡组批次,搜索类型,卡号,SIM卡状态,SIM卡类型,开始卡号,用户ID
    */
  loadSimListByGroups: params => GET(url.loadSimListByGroups, params), // 获得卡组或批次的SIM卡信息

  /**
   @method updateUser
   @param {number,string,string,string,string,string,number,string,string,string,number} 参数名:{accountType,address,corpName,customCode,idCard,name,parentId,password,phone,remark,userId}
   @description 账号类型,地址,公司名称,客户代码,身份证,姓名,上级用户ID,密码,电话,备注,用户ID
    */
  updateUser: params => POST(url.updateUser, params), // 修改客户

  /**
   @method addUser
   @param {number,string,string,string,string,string,number,string,string,string} 参数名:{accountType,address,corpName,customCode,idCard,name,parentId,password,phone,remark}
   @description 账号类型,地址,公司名称,客户代码,身份证,姓名,上级用户ID,密码,电话,备注
    */
  addUser: params => POST(url.addUser, params), // 添加用户

  /**
   @method getUserInfo
   @param {number} 参数名:{userId}
   @description 用户ID
    */
  getUserInfo: params => GET(url.getUserInfo, params), // 获取用户信息

  /**
   @method getManageUserInfo
   @param {number} 参数名:{userId}
   @description 用户ID
    */
  getManageUserInfo: params => GET(url.getManageUserInfo, params), // 获得用户列表

  /**
   @method getOrderList
   @param {string,number,number,number,string} 参数名:{findCode,orderStatus,pageNumber,pageSize,serMeal}
   @description 模糊搜索（客户代码/订单号,订单状态,当前页,条数,套餐类型
    */
  getOrderList: params => GET(url.getOrderList, params), // 获取订单列表

  /**
   @method getOrderDetail
   @param {number} 参数名:{orderId}
   @description 订单ID
    */
  getOrderDetail: params => GET(url.getOrderDetail, params), // 获取订单详情

  /**
   @method pushCustomerOrder
   @param {string,string,string,string,string} 参数名:{count,orderPrice,remark,type,userCode}
   @description 数量,单价,备注,套餐,客户代码
    */
  pushCustomerOrder: params => POST(url.pushCustomerOrder, params), // 订单提交

  /**
   @method runOrderInfo
   @param {string,number,string,string,string} 参数名:{counts,orderId,orderPrice,remark,serMeal}
   @description 购买数量,订单ID,购买单价,备注说明,套餐类型
    */
  runOrderInfo: params => GET(url.runOrderInfo, params), // 销售端设置购买单价

  /**
   @method setGlobalRisk
   @param {string,string,string,string,number,string} 参数名:{allIccid,exceedGprs,fixDate,overGprs,riskType,simType}
   @description 对选择卡进行设置,预超流量,	停卡时间,	剩余流量,风控类型1:全局 2:部分,套餐类型
    */
  setGlobalRisk: params => POST(url.setGlobalRisk, params), // 销售端设置购买单价

  /**
   @method getNextUserInfo
   @param {number} 参数名:{userId}
   @description 用户ID
    */
  getNextUserInfo: params => GET(url.getNextUserInfo, params), // 获得用户子集用户

  /**
   @method getIndexRunData
   @param {number} 参数名:{userId}
   @description 用户ID
    */
  getIndexRunData: params => GET(url.getIndexRunData, params), // 获得动态数据

  /**
   @method getIndexStopData
    */
  getIndexStopData: params => GET(url.getIndexStopData, params), // 获得静态数据

  /**
   @method loadInventoryData
    */
  loadInventoryData: params => GET(url.loadInventoryData, params), // 获得静态数据

  /**
   @method addSimGroup
    */
  addSimGroup: params => POSTBody(url.addSimGroup, params), // 新增卡组

  /**
  @method loadSimGroup
   */
  loadSimGroup: params => GET(url.loadSimGroup, params), // 新增卡组

  /**
   @method searchSimListByInventory
    */
  searchSimListByInventory: params => GET(url.searchSimListByInventory, params), // 搜索库存下的sim卡新

  /**
   @method searchSimListByGroups
    */
  searchSimListByGroups: params => GET(url.searchSimListByGroups, params), // 搜索库存下的sim卡新

  /**
   @method transferGroupSim
   @param {String,Number} 参数名:{batch,groupId}
   @description 
    */
  transferGroupSim: params => POSTBody(url.transferGroupSim, params), // 搜索库存下的sim卡新

  /**
   @method transferUserSim
   @param {String,Number} 参数名:{batch,groupId}
   @description 
    */
  transferUserSim: params => POSTBody(url.transferUserSim, params), // 搜索库存下的sim卡新

  /**
   @method sellSimList
   @param {String,Number} 参数名:{batch,groupId}
   @description 
    */
  sellSimList: params => GET(url.sellSimList, params), // 搜索库存下的sim卡新

  /**
   @method sendBatchSms
   @param {string,string} 参数名:{content,iccids}
   @description 下发内容,iccid(批量短信下发用逗号隔开)
    */
  sendBatchSms: params => POST(url.sendBatchSms, params), // 批量短信下发

  /**
   @method getSendSmsStatus
   @param {string,string} 参数名:{contentId,iccids}
   @description 短信下发时返回的内容ID,iccid(批量短信下发用逗号隔开)
    */
  getSendSmsStatus: params => GET(url.getSendSmsStatus, params), // 获取批量短信下发的状态

  /**
   @method getDevReply
   @param {String} 参数名:{cardNo}
   @description 物联网卡号
    */
  getDevReply: params => GET(url.getDevReply, params), // 获取单卡的设备回复历史内容

  /**
  @method getIotLlcx
  @param {String} 参数名:{iccid}
  @description 	物联网卡ICCID
   */
  getIotLlcx: params => GET(url.getIotLlcx, params), // 更新单卡的套餐流量信息

  /**
  @method getSendMsg
  @param {String} 参数名:{simCard}
  @description 		物联网卡号
   */
  getSendMsg: params => GET(url.getSendMsg, params), // 获取短信下发记录

  /**
  @method getOrderHistory
  @description 		获取订单历史
   */
  getOrderHistory: params => GET(url.getOrderHistory, params), // 获取订单历史

  /**
  @method updateSimGroup
  @description 		修改卡组信息
   */
  updateSimGroup: params => POST(url.updateSimGroup, params), // 修改卡组信息

  /**
  @method getDevReplyNewOne
  @param {String} 参数名:{cardNo}
  @description 物联网卡号
   */
  getDevReplyNewOne: params => GET(url.getDevReplyNewOne, params), // 获取批量短信下发的状态

  /**
  @method restockUserSim
  @description 		获取订单历史
   */
  /**
     @method getRiskManage
  */
  getRiskManage: params => GET(url.getRiskManage, params), // 获取预期/过期卡信息

  getSimGprsCount: params => GET(url.getSimGprsCount, params), //获取预/已超流量的sim卡数量

  getSimCardsCount: params => GET(url.getSimCardsCount, params), //获取预/已过期的sim卡数量

  exportRiskSimCard: params => GET(url.exportRiskSimCard, params), //导出对应所有sim卡

  getCountOfStock: params => GET(url.getCountOfStock, params), //获取出入库数据

  restockUserSim: params => POST(url.restockUserSim, params), // 获取订单历史

  exportCustomerSim: params => GET(url.exportCustomerSim, params), // 导出

  getIotLlcxAll: params => GET(url.getIotLlcxAll, params), // 批量获取SIM卡信息

  uploadPayCode: params => Form(url.uploadPayCode, params), // 上传二维码

  getCustomPayCode: params => GET(url.getCustomPayCode, params), // 获取二维码

  addRemarkOfSim: params => GET(url.addRemarkOfSim, params), // 获取二维码
};