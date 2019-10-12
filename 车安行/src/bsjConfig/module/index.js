/***
 云平台全局配置
 包括
  轨迹、监控地图车辆图标-
  监控车辆列表图标

 * ****/
let updateFunctions={}
import km_06m  from "./update/km_06m"
import trackMapImgConfig from './update/trackMapImgConfig'
class moduleConfig{
    constructor(){
        this.configListKey=[km_06m,trackMapImgConfig]; //需要配置的功能列表
        this.userData={};
        this.config={}
    }
    update({userData}){
        this.userData=userData;
        this.configListKey.map(item=>{
            var itemConfig=item({userData});
            this.config=Object.assign(this.config,itemConfig)
        })
        return this.config
    }
}
export default new moduleConfig()