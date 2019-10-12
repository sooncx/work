import url from "./baseUrl";
import {
  GET,
  POST,
  JSONP,
  Form
} from "./apiFn";

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
   @method pushNumSegment
   @param {string,string,string,number,string} 参数名:{allDate,batch,endCard,pushType,startCard	}
   @description 批量入库卡号,入库批次,结束卡号,入库类型,起始卡号
 */
  pushNumSegment: params => POST(url.pushNumSegment, params), // 卡段入库OR批量入库

  /**
      @method addAndUpdateGprsBag
      @param {number,string,string,number} 参数名:{	gprsId,gprsType,remark,type}
      @description 套餐ID,套餐量,套餐说明,套餐单位
    */
  addAndUpdateGprsBag: params => POST(url.addAndUpdateGprsBag, params), // 新增修改套餐

  /**
      @method findByGprsBagList
      @param {} 参数名:{}
      @description 
    */
  findByGprsBagList: params => GET(url.findByGprsBagList, params), // 获取套餐信息列表

  /**
      @method findByGprsBagInfo
      @param {} 参数名:{}
      @description 
    */
  findByGprsBagInfo: params => GET(url.findByGprsBagInfo, params), // 获取套餐信息详情

  /**
   @method delGprsBagInfo
   @param {number} 参数名:{gprsId}
   @description 套餐ID
    */
  delGprsBagInfo: params => POST(url.delGprsBagInfo, params), // 获取套餐信息详情

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
  orderCard: params => Form(url.orderCard, params), // 订单出库

  /**
   @method backCard
   @param {string} 参数名:{cardNo}
   @description 卡号
    */
  backCard: params => POST(url.backCard, params), // 退卡入库

  /**
   @method chargeOffCard
   @param {string,string} 参数名:{cardNo,remark}
   @description 卡号,销卡说明
    */
  chargeOffCard: params => POST(url.chargeOffCard, params), // 销卡

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
  updateUser: params => GET(url.updateUser, params), // 修改客户

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
   @description 模糊搜索（客户代码/订单号,订单状态,当前页,条数,套餐规格
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
  pushCustomerOrder: params => Form(url.pushCustomerOrder, params), // 订单提交

  /**
   @method runOrderInfo
   @param {string,number,string,string,string} 参数名:{counts,orderId,orderPrice,remark,serMeal}
   @description 购买数量,订单ID,购买单价,备注说明,套餐规格
    */
  runOrderInfo: params => Form(url.runOrderInfo, params), // 销售端设置购买单价

  /**
   @method setGlobalRisk
   @param {string,string,string,string,number,string} 参数名:{allIccid,exceedGprs,fixDate,overGprs,riskType,simType}
   @description 对选择卡进行设置,预超流量,	停卡时间,	剩余流量,风控类型1:全局 2:部分,套餐规格
    */
  setGlobalRisk: params => POST(url.setGlobalRisk, params), // 销售端设置购买单价

  /**
   @method getNextUserInfo
   @param {number} 参数名:{userId}
   @description 用户ID
    */
  getNextUserInfo: params => GET(url.getNextUserInfo, params), // 获得用户子集用户

  /**
  @method uploadSimExcel
  @param {string,object} 参数名:{type,upfile}
  @description 导入类型,excel文件
   */
  uploadSimExcel: params => Form(url.uploadSimExcel, params), // 批量导入SIM卡

  /**
   @method getIndexRunData
   @param {number} 参数名:{userId}
   @description 用户ID
    */
  getIndexRunData: params => GET(url.getIndexRunData, params), // 获得动态数据

  /**
   @method getIndexStopData
   @param {number} 参数名:{userId}
   @description 用户ID
    */
  getIndexStopData: params => GET(url.getIndexStopData, params), // 获得静态数据

  /**
   @method loadInventoryData
   @param 
   @description 
    */
  loadInventoryData: params => GET(url.loadInventoryData, params), // 获得静态数据

  /**
   @method searchSimListByInventory
   @param {string,string,number,string,number,number,string,string} 参数名:{	endIccid,endTime,searchType,simCard	,simState,simType,startIccid,startTime}
   @description 结束iccid号, 结束时间, 不传入库，1出库，2未出库, sim卡号, sim卡状态, sim卡类型, 开始iccid号, 开始时间
    */
  searchSimListByInventory: params => GET(url.searchSimListByInventory, params), // 获得静态数据

  /**
   @method getUploadStatus
   @param {number} 参数名:{time	}	
   @description 文件上传时间戳
    */
  getUploadStatus: params => GET(url.getUploadStatus, params), // 获得静态数据

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
  @method updateOrderInfo
  @param {number,number,string} 参数名:{orderId, status, wRemark	}
  @description 		订单ID, status=3(为空时是更新物流信息) 废除订单,商务备注，物流信息等
   */
  updateOrderInfo: params => POST(url.updateOrderInfo, params), // 更新订单物流信息

  /**
  @method getDevReplyNewOne
  @param {String} 参数名:{cardNo}
  @description 物联网卡号
   */
  getDevReplyNewOne: params => GET(url.getDevReplyNewOne, params), // 获取批量短信下发的状态

  /**
  @method exportOrderSimCard
  @param {number, number, string} 参数名:{	aUserId, orderId, sessionId }
  @description 该订单客户ID, 订单ID, sessionId
   */
  exportOrderSimCard: params => GET(url.exportOrderSimCard, params), // 获取批量短信下发的状态

  /**
  @method getSimMealChange
  @param {number, number} 参数名:{	orderId, prodCode  }
  @description 订单Id, 变更套餐代码
   */
  getSimMealChange: params => GET(url.getSimMealChange, params), // 获取套餐变更订单的ICCID

  /**
  @method getOrderOfIccids
  @param {number, number, number, number} 参数名:{	aUserId, orderId, pageNumber,	pageSize}
  @description 订单提交用户ID, 订单Id, pageNumber, pageSize
   */
  getOrderOfIccids: params => GET(url.getOrderOfIccids, params), // 获取套餐变更订单的ICCID

  /**
  @method updateFinishOrder
  @param {string, number, number, number, string, number} 参数名:{	address, counts, ifInstall, orderId, remark, sellType }
  @description 地址, 数量, 是否装机, 订单号, 订单备注, 销售类型
   */
  updateFinishOrder: params => GET(url.updateFinishOrder, params), // 获取套餐变更订单的ICCID

  /**
  @method updatePasswordOfA
  @param {string, string, number} 参数名:{	newPassword, counts, userId }
  @description 新密码, 旧密码, 需要更新密码的用户id
   */
  updatePasswordOfA: params => POST(url.updatePasswordOfA, params), // 获取套餐变更订单的ICCID

  /**
  @method addCustomOfA
  @param {string, string, string, string, string} 参数名:{	companyName, password, remark, userCode, userName}
  @description 用户名称, 密码, 备注, 客户代码, 登录账户
   */
  addCustomOfA: params => POST(url.addCustomOfA, params), // 增加A级用户

  /**
  @method transferEquative
  @param {string, number} 参数名:{	iccids, userId }
  @description 需要转移的iccid卡号, 转移目标的userId
   */
  transferEquative: params => POST(url.transferEquative, params), // SIM卡批量转移(A级转A级)


  transferDifferent: params => POST(url.transferDifferent, params), //商务端转出卡接口（类似于出库）

  /**
  @method updateSimInfo
  @param {string, string, string, string, number} 参数名:{	activationTime,	expireTime, iccid, openTime, simState }
  @description 激活日期, 过期时间, iccid, 开卡日期, sim卡状态
   */
  updateSimInfo: params => POST(url.updateSimInfo, params), // 编辑卡资料

  /**
  @method getSimMarkUserList
  @param {} 参数名:{ }
  @description 
   */
  getSimMarkUserList: params => POST(url.getSimMarkUserList, params), // 编辑卡资料

  /**
  @method getDataFromOldTerrace
  @param {string, string, string, number} 参数名:{ customCode, price, simType, userId }
  @description 客户代码, 价格, 套餐规格, 客户代码
   */
  getDataFromOldTerrace: params => GET(url.getDataFromOldTerrace, params), // 编辑卡资料

  /**
  @method shutDownPhoneByList
  @param {string} 参数名:{ simCard }
  @description 需要停机的SIM卡号，多个用逗号隔开
   */
  shutDownPhoneByList: params => POST(url.shutDownPhoneByList, params), // 批量停卡

  /**
   @method openPhoneBySimCard
   @param {string} 参数名:{ simCard }
   @description 需要停机的SIM卡号，多个用逗号隔开
    */
  openPhoneBySimCard: params => POST(url.openPhoneBySimCard, params), // 批量开卡操作

  /**
  @method renewOrder
  @param {number,number,string} 参数名:{ exYears, orderId, userCode }
  @description 年限， 订单号， 客户代码
   */
  renewOrder: params => POST(url.renewOrder, params), // 续费

  /**
  @method updatePriceByList
  @param {iccids,price} 参数名:{ string, string }
  @description 	需要修改的iccid, 价格
   */
  updatePriceByList: params => POST(url.updatePriceByList, params), // 批量修改sim卡单价

  /**
  @method renewalByList
  @param {iccids,years} 参数名:{ string, string }
  @description 	需要修改的iccid, 年限
   */
  renewalByList: params => POST(url.renewalByList, params), // 批量续费
};
