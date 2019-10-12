class apiUtil {
    constructor(_vue) {
        this.$http = _vue.prototype.$http;
        this.HOST = _vue.prototype.HOST;
        this.HOST7515 = _vue.prototype.HOST7515;
        //this.MYHOST = _vue.prototype.MYHOST;
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
        return this.GET(this.HOST + '/http/Monitor/loadGroups.json', params)
    }
    getVehiclesByGroupRds(params, config) {
        return this.GET(this.HOST + '/http/Vehicle/getVehiclesByGroupRds.json', params, config)
    }
    searchBindingOfVehicles(params) {
        return this.GET(this.HOST + '/http/Monitor/SearchBindingOfVehicles.json', params)
    }
    GetVehTrackMongo(params, config) { //获取轨迹详情
        return this.POST(this.HOST + '/http/Vehicle/GetVehTrackMongo.json', params, config)
    }
    MkGetVehTrackMongo(params, config) { //获取轨迹详情
        return this.POST(this.HOST7515 + '/TrajectoryData/GetVehTrackMongoDataByNo.json', params, config)
    }
    getVehicleStayPoint(params, config) { //获取经常停留点
        return this.GET(this.HOST + '/http/SafetyZone/GetVehicleStayPoint.json', params, config)
    }
    getVehicleCircle(params, config) { //获取车辆圆形围栏
        return this.GET(this.HOST + '/http/SafetyZone/GetVehicleCircle.json', params, config)
    }
    getPathIdByVehicleId(params, config) { //获取车辆多边形围栏
        return this.GET(this.HOST + '/http/VehBindPath/getPathIdByVehicleId.json', params, config)
    }
    getStopReport(params, config) { //获取车辆多边形围栏
        return this.GET(this.HOST + '/report/StopReport/GetStopReport.json', params, config)
    }
    getAlarmInfoList(params, config) { //获取单个报警信息集合
        return this.GET(this.HOST + '/report/alarm/AlarmInfoList.json', params, config)
    }




    getIndexCountApi(params, config) { //首页统计
        return this.GET(this.HOST + '/http/ClientFp247/StatisticHomePage.json', params, config)
    }
    getCarTypeCountApi(params, config) { //车辆类型统计
        return this.GET(this.HOST + '/http/ClientFp247/StatisticCarKind.json', params, config)
    }
    setRadioApi(params, config) { //设置提现提成积分、提成积分转消费积分比例
        return this.GET(this.HOST + '/http/ClientFp247/SetRadio.json', params, config)
    }
    setUserTypeApi(params, config) { //设置子级账户积分用户类型
        return this.GET(this.HOST + '/http/ClientFp247/SetUserType.json', params, config)
    }
    calcMortgageRecondApi(params, config) { //计算按揭还款信息
        return this.GET(this.HOST + '/http/ClientFp247/CalcMortgageRecond.json', params, config)
    }
    getCarTypeApi(params, config) { //获取车辆种类和车辆类别
        return this.GET(this.HOST + '/http/ClientFp247/GetCarKind.json', params, config)
    }
    getIntegralInfoApi(params, config) { //获取积分记录
        return this.GET(this.HOST + '/http/ClientFp247/GetIntegralInfo.json', params, config)
    }
    getWarningDataApi(params, config) { //获取报警数据
        return this.GET(this.HOST + '/http/ClientFp247/SelectAlarm.json', params, config)
    }
    getRemindExamineInfoApi(params, config) { //获取年审过期提醒
        return this.GET(this.HOST + '/http/ClientFp247/GetRemindExamineInfo.json', params, config)
    }
    getInsuranceCompanyApi(params, config) { //获取保险公司列表
        return this.GET(this.HOST + '/http/ClientFp247/GetInsuranceCompany.json', params, config)
    }
    getDowloadListApi(params, config) { //获取下载文件列表
        return this.GET(this.HOST + '/http/ClientFp247/GetFileList.json', params, config)
    }
    changeExamineApi(params, config) { //点击续费年审
        return this.GET(this.HOST + '/http/ClientFp247/ChangeExamine.json', params, config)
    }
    getCountOfCarStatusApi(params, config) { //统计车辆行驶状态
        return this.GET(this.HOST + '/http/ClientFp247/GetCountOfCarStatus.json', params, config)
    }
    addOperateRecondApi(params, config) { //添加用户积分操作记录
        return this.GET(this.HOST + '/http/ClientFp247/AddOperateRecond.json', params, config)
    }
    getExamineInfoByCaridApi(params, config) { //根据车辆id获取车辆年审信息
        return this.GET(this.HOST + '/http/ClientFp247/GetExamineInfo.json', params, config)
    }
    getCarInfoByCaridApi(params, config) { //根据车辆id获取车辆信息
        return this.GET(this.HOST + '/http/ClientFp247/GetCarInfo.json', params, config)
    }
    changeStateOfMortgageApi(params, config) { //根据按揭记录修改还款或提醒状态
        return this.GET(this.HOST + '/http/ClientFp247/ChangeStateOfMortgage.json', params, config)
    }
    getMortgageRecondInfoApi(params, config) { //查询按揭记录信息
        return this.GET(this.HOST + '/http/ClientFp247/GetMortgageRecond.json', params, config)
    }
    getIntegralTypeApi(params, config) { //查询所有的操作积分类型
        return this.GET(this.HOST + '/http/ClientFp247/GetIntegralType.json', params, config)
    }
    getMortgageAndRemindInfoApi(params, config) { //查询年审和按揭提醒信息
        return this.GET(this.HOST + '/http/ClientFp247/GetRemindInfo.json', params, config)
    }
    transferRewardToMoneyApi(params, config) { //提现提成积分 客户使用
        return this.GET(this.HOST + '/http/ClientFp247/TransferRewardToMoney.json', params, config)
    }
    getOverdueInfoApi(params, config) { //提前7天和逾期的还款记录
        return this.GET(this.HOST + '/http/ClientFp247/GetMortgageRemind.json', params, config)
    }
    saveVehicleApi(params, config) { //录入设备信息
        return this.GET(this.HOST + '/http/ClientFp247/SaveVehicleInfo.json', params, config)
    }
    saveAndChangeVehicleApi(params, config) { //录入和修改车辆信息
        return this.GET(this.HOST + '/http/ClientFp247/SaveCarInfo.json', params, config)
    }
    saveDriverInfoApi(params, config) { //录入和修改车主信息
        return this.GET(this.HOST + '/http/ClientFp247/SaveDriverInfo.json', params, config)
    }
    saveExamineInfoApi(params, config) { //录入和修改年审信息
        return this.GET(this.HOST + '/http/ClientFp247/SaveExamineInfo.json', params, config)
    }
    exporeRemindInfoApi(params, config) { //年审和按揭信息 报表导出
        return this.GET(this.HOST + '/http/ClientFp247/ExportExcelOfRemindInfo.json', params, config)
    }
    getMonitorInfoApi(params, config) { //实时车辆监控
        return this.GET(this.HOST + '/http/ClientFp247/GetMonitorInfo.json', params, config)
    }
    saveMortgageRecondApi(params, config) { //存储按揭计算记录 (包含存储计算参数)
        return this.GET(this.HOST + '/http/ClientFp247/SaveMortgageRecond.json', params, config)
    }
    deleteChoseFileApi(params, config) { //删除指定文件
        return this.GET(this.HOST + '/http/ClientFp247/RemoveFile.json', params, config)
    }
    deleteImgApi(params, config) { //删除图片(单独删除)
        return this.GET(this.HOST + '/http/ClientFp247/RemovePicture.json', params, config)
    }
    downloadFileApi(params, config) { //下载指定文件
        return this.GET(this.HOST + '/http/ClientFp247/DownloadFile.json', params, config)
    }
    uploadFileApi(params, config) { //上传文件
        return this.FROM(this.HOST + '/http/ClientFp247/UploadFile.json', params, config)
    }
}
export default apiUtil