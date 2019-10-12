import { extend} from "lodash";
var defaultConfig={ //轨迹回放配置
  playImg: require("@/assets/img/map/travel.png")
}
var useConfig=extend({},defaultConfig);
const configKey="trackMapImgConfig"
const configParams={ //配置参数, 读取对应客户代码配置参数，否则使用默认
    350703:{
        playImg: require("@/sp110/img/map/map_online.png") 
    },
    2:{
        playImg: require("@/sp110/img/map/map_online.png") 
    }
}
function update({userData}){
    useConfig= extend({},defaultConfig,configParams[userData.userId],configParams[userData.cuserId])
    return {[configKey]:useConfig}
}
export default update