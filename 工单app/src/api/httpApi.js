import url from './baseUrl';
import axios from './apiConfig';
import { GET, POST, JSONP,Form,custom} from './apiFn';

export default {
  /**
   @method login
   @param {String,String} 参数名:{user,psw}
   @description 账号,密码
 */
  login: params => GET(url.login, params), // 登录

  /**
   @method updatePassword
   @param {String,String} 
   @description 
 */
  updatePassword: params => GET(url.updatePassword, params), // 修改密码

  /**
   @method checkDevice
   @param {String,String} 
   @description 
 */
  checkDevice: params => GET(url.checkDevice, params), // 校验设备号

  /**
   @method newWorkSheetInfo
   @param {String,String} 
   @description 
 */
newWorkSheetInfo: params => GET(url.newWorkSheetInfo, params), // 新建工单

  /**
   @method getWorkSheetByStatus
   @param {String,String} 
   @description 
 */
getWorkSheetByStatus: params => GET(url.getWorkSheetByStatus, params), // 首页tab获取工单信息

  /**
   @method updateWorkSheetStatusByApp
   @param {String,String} 
   @description 
 */
updateWorkSheetStatusByApp: params => GET(url.updateWorkSheetStatusByApp, params), // 工单确认

  /**
   @method getWorkSheetInfo
   @param {String,String} 
   @description 
 */
getWorkSheetInfo: params => GET(url.getWorkSheetInfo, params), // 获取上传安装信息

  /**
   @method getWorkSheetByCondition
   @param {String,String} 
   @description 
 */
getWorkSheetByCondition: params => GET(url.getWorkSheetByCondition, params), // 获取上传安装信息

  /**
   @method uploadPicture
   @param {String,String} 
   @description 
 */
uploadPicture: params => Form(url.uploadPicture, params), // 获取上传安装信息

  /**
   @method uploadWorkSheetInfo
   @param {String,String} 
   @description 
 */
uploadWorkSheetInfo: params => GET(url.uploadWorkSheetInfo, params), // 上传图片地址和安装部位

  /**
   @method getCarLocationInfo
   @param {String,String} 
   @description 
 */
getCarLocationInfo: params => GET(url.getCarLocationInfo, params), // 获取设备所需的具体信息

  /**
 @method GetLocations
 @param {Number} 参数名:{vehicleId}
 @description 获取地址
 */
 GetLocations: params =>
   JSONP('http://120.76.69.92:8080/geo/GetGeo.json', params), // 获取地址

     /**
   @method GetLocationbd
  @param {Number} 参数名:{vehicleId}
  @description 获取地址
  */
 GetLocationbd: params =>
 JSONP('http://api.map.baidu.com/geocoder/v2/', params), // 获取地址

     
/**
   @method register
   @param {String,String} 
   @description 
 */
register: params => GET(url.register, params), // 推送注册

/**
   @method exitPushApp
   @param {String,String} 
   @description 
 */
exitPushApp: params => GET(url.exitPushApp, params), // 注销注册

/**
   @method getCountsOfNoRead
   @param {String,String} 
   @description 
 */
getCountsOfNoRead: params => GET(url.getCountsOfNoRead, params), // 获取未读数

/**
   @method changeReadFlag
   @param {String,String} 
   @description 
 */
changeReadFlag: params => GET(url.changeReadFlag, params), // 改变未读状态
/**
   @method deleteUploadPicture
   @param {String,String} 
   @description 
 */
deleteUploadPicture: params => POST(url.deleteUploadPicture, params), // 改变未读状态

 
}
