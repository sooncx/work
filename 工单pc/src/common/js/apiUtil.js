class apiUtil {
    constructor(_vue) {
        this.$http = _vue.prototype.$http;
        this.HOST = _vue.prototype.HOST;
    }
    GET(url, params, config) {
        return this.$http(Object.assign({
            method: "get",
            url: url,
            params: params
        }, config))
    }
    POST(url, params, config) {
        return this.$http(Object.assign({
            method: "post",
            url: url,
            params: params
        }, config))
    }
    FROM(url, params, config) {
        return this.$http(Object.assign({
            url: url,
            method: "post",
            url: url,
            data: params,
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }, config))
    }
    loadGroups(params) {
        return this.GET(this.HOST + '/http/Monitor/loadGroups.json',params)
    }
    getVehiclesByGroupRds(params,config) {
        return this.GET(this.HOST + '/http/Vehicle/getVehiclesByGroupRds.json',params,config)
    }
    searchBindingOfVehicles(params) {
        return this.GET(this.HOST + '/http/Monitor/SearchBindingOfVehicles.json',params)
    }
    GetVehTrackMongo(params,config){//获取轨迹详情
        return this.POST(this.HOST+'/http/Vehicle/GetVehTrackMongo.json',params,config)
    }
    getVehicleStayPoint(params,config){ //获取经常停留点
        return this.GET(this.HOST+'/http/SafetyZone/GetVehicleStayPoint.json',params,config)
    }
    getVehicleCircle(params,config){ //获取车辆圆形围栏
        return this.GET(this.HOST+'/http/SafetyZone/GetVehicleCircle.json',params,config)
    }
    getPathIdByVehicleId(params,config){ //获取车辆多边形围栏
        return this.GET(this.HOST+'/http/VehBindPath/getPathIdByVehicleId.json',params,config)
    }
    getStopReport(params,config){ //获取车辆多边形围栏
        return this.GET(this.HOST+'/report/StopReport/GetStopReport.json',params,config)
    }
    getAlarmInfoList(params,config){ //获取单个报警信息集合
        return this.GET(this.HOST+'/report/alarm/AlarmInfoList.json',params,config)
    }
}
export default apiUtil