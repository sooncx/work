/***
 云平台全局配置
 使用前必须最少调用一次update接口更新配置
 配置根据用户更新
 包括
  轨迹、监控地图车辆图标-
  监控车辆列表图标
  
 * ****/
import customerCodes from "./customerCodes";
import moduleConfig from "./module/index";
import userDataUtil from "./userDataUtil/index";
class BSJ_CONFIG {
  constructor() {
    this.codes = customerCodes;
  }
  init() {
    this.userData = userDataUtil.get();
    this.data = {
      module: moduleConfig.update({ userData: this.userData })
    };
  }
  update() {
    //同步更新，获取用户数据更新congfig
    this.init();
  }
  updateSync() {
    //异步更新，暂未有需要
  }
  getTrackMapImg({ terminalType }) {
    //获取轨迹回放播放车辆的图标
    if (this.data) {
      let km_06mConfig = this.data.module.km_06m;
      let trackMapImgConfig = this.data.module.trackMapImgConfig;
      if (
        km_06mConfig.mapImg &&
        km_06mConfig.terminalTypeList.indexOf(
          terminalType.toLocaleUpperCase()
        ) !== -1
      ) {
        //是否使用摩托车图标
        return require("@/bsjConfig/img/km-06m/map_online.png");
      } else {
        return trackMapImgConfig.playImg;
      }
    } else {
      return require("@/assets/img/map/travel.png");
    }
  }
  getTrackMapAngle({ terminalType, angle }) {
    //获取轨迹回放播放车辆旋转角度
    if (this.data) {
      let km_06mConfig = this.data.module.km_06m;
      if (
        !km_06mConfig.mapRotate &&
        km_06mConfig.terminalTypeList.indexOf(
          terminalType.toLocaleUpperCase()
        ) !== -1
      ) {
        //不启用旋转角度 且 设备类型是符合规定的
        return 0;
      } else {
        return angle;
      }
    }else {
      return angle;
    }
  }
}

export default new BSJ_CONFIG();
