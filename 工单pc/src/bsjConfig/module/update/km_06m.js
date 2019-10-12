import { extend} from "lodash";
var defaultConfig={ //km-06m设备摩托车图标配置
    terminalTypeList:["KM-06M"], //匹配设置的设备类型包括但不限于km-06m
    mapImg:true, //地图上terminalTypeList这些设备类型显示摩托车图标 包括轨迹和监控中心
    mapRotate:true, //地图上位置图标是否旋转 true旋转
    listImg:true, //监控中心左下角车辆列表显示摩托车图标
}
var useConfig=extend({},defaultConfig);
const configKey="km_06m"
const configParams={ //配置参数, 读取对应客户代码配置参数，否则使用默认
    3403:{
        mapImg:false 
    }
}
function update({userData}){
    useConfig= extend({},defaultConfig,configParams[userData.userId],configParams[userData.cuserId])
    return {[configKey]:useConfig}
}
export default update