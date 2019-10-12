class carUtil{
    constructor(_vue){
        /*
            7515为fc68用户id
        */
       
    }
    isWired(carData){ //是否是有线设备 监控中心直接根据longStayTer判断无线：1，有线：0 
        if(carData.longStayTer===undefined){
            console.error("carData.longStayTer为undefined，不能获取设备有线还是无线")
            return true
        }else if(carData.longStayTer === 0){
            return true
        }else{
            return false
        }
    }
    getStatusImg(carData,key='Z',alarmKey="alarm"){
        var alarmImg=require("@/assets/img/map/alarm.png");
        var offlineImg=require("@/assets/img/map/offline.png");
        var parkingImg=require("@/assets/img/map/parking.png");
        var travelImg=require("@/assets/img/map/travel.png");
        if(carData[alarmKey]){
            return alarmImg
        };
        switch(carData[key]){
            case 0:
                return offlineImg;
            case 1:
                return travelImg;
            case 2:
                return parkingImg;
            default:
                console.error("车辆状态图标未识别")
        }
    }
    getAddress(point) { //根据经纬度获取地址
        return new Promise((succCall, failCall) => {
          AddressUtil.getGeo({
            params: {
              param: {
                posList: [{
                  "lat": point.lat,
                  "lon": point.lon,
                  "tag": "1"
                }]
              }
            }
          }).then(res => {
            if (res.flag === 1) {
              succCall(res.obj[0].regeocode.formatted_address)
    
            } else {
              succCall("获取地址失败")
            }
    
          }).catch(e => {
            succCall("获取地址失败")
          })
        })
    }
    getMapStatusTxt(carData, key="Z") {
        var result = "";
        switch (carData[key]) {
            case 0:
                result = "离线";
                break;
            case 1:
                result = "行驶";
                break;
            case 2:
                result = "停车";
                break;
            case 3:
                result = "从未上线";
                break;
            case 4:
                result = "已过期";
                break;
            default:
                break;
        };
        return result;
    }
    getPos(data,key='pos'){
        var result=""
        switch (data[key]) {
            case 0:
                result = "GPS信号弱";
                break;
            case 1:
                result = "GPS定位";
                break;
            case 2:
                result = "WIFI定位";
                break;
            case 3:
                result = "多基站";
                break; //多基站
            case 4:
                result = "单基站";
                break; //单基站
            case 5:
                result = "混合定位";
                break; //单基站
        }
        return result
    }
    getIsStop(data,key="x"){
        if(data[key]  === 2){
            
            return true
        }
        return false
    }
    canShowMap(carData,key="Z"){
        if( (carData[key] === 0||carData[key] === 1|| carData[key] === 2)&&(carData.x&&carData.y)){
            return true;
        }else{
          return false
        }
    }
    canShowMap7515(carData,key='vehicleStatus'){
        if( (carData[key] === 3||carData[key] === 1|| carData[key] === 2)&&(carData.lat&&carData.lon)){
            return true;
        }else{
          return false
        }
    }
    getPos7515(carData,key="posStyle"){
        var result=""
        switch (carData[key]) {
            case 0:
                result = "不定位";
                break;
            case 1:
                result = "卫星";
                break;
            case 2:
                result = "WIFI";
                break;
            case 3:
                result = "多基站";
                break; //多基站
            case 4:
                result = "单基站";
                break; //单基站
        }
        return result
    }
    getStatusImg7515(carData,key='vehicleStatus',alarmKey="alarmInfo"){ //状态码跟正常的不一样
        var alarmImg=require("@/assets/img/map/alarm.png");
        var offlineImg=require("@/assets/img/map/offline.png");
        var parkingImg=require("@/assets/img/map/parking.png");
        var travelImg=require("@/assets/img/map/travel.png");
        if(carData[alarmKey]){
            return alarmImg
        };
        switch(carData[key]){
            case 3: //从未上线
                return offlineImg;
            case 1:
                return travelImg;
            case 2:
                return parkingImg;
            default:
                console.error("车辆状态图标未识别")
        }
    }
    getMapDefaulOp() { //map默认设置
        return {
            size: new AMap.Size(40, 40),
            imageSize: new AMap.Size(30, 30),
            imageOffset: new AMap.Pixel(0, 0),
        }
    }
    getAccStateTxt(carData,key="e"){ //获取Acc状态--轨迹回放key="e"
        var result="";
        switch(carData[key]){
            case 0:
                result="ACC开"
                break;
            case 1:
                result="ACC关"
                break;
        };
        return result
    }
    getComponentStateTxt(carData){ //获取部件状态--轨迹回放
        var result=carData.posTxt + " " +carData.accStateTxt
        if(carData.b === 1){
            result+=" 盲补数据"
        }
        return result
    }
    getStopTxt(mongoData,key="m"){ //轨迹回放获取静止的文本
        var minutes = parseInt(mongoData[key] / 60);
        //累加停车时间
        if (minutes == 0) {
            minutes = minutes == 0 ? "<1分" : minutes + "分";
        }
        else if (minutes > 60) {
            var h = parseInt(minutes / 60);
            var m = minutes % 60;
            if (m == 0) {
                minutes = h + "小时";
            }
            else {
                minutes = h + "小时" + m + "分";
            }
        }
        else {
            minutes = minutes + "分";
        }
        return "静止"+minutes
    }
    handerCarData7515(carData){ //VehicleData/GetPosDataByNo接口返回的数据
        carData.mapImg=this.getStatusImg7515(carData)
        carData.canShowMap=this.canShowMap7515(carData)
        carData.posTxt=this.getPos7515(carData)
        carData.point=GPS.gcj_encrypt(carData.lat, carData.lon)
        return carData
    }
    getHasNoLocation(mongoData){ //是否包含不定位补数据
        if(mongoData.extend&&mongoData.extend.snp&&mongoData.extend.snp.length>0) return true
        return false
    }
    handerlMongo(mongoData){ //处理轨迹GetVehTrackMongo.json接口返回的数据
        // var aMapPosition=GPS.delta(mongoData.a, mongoData.o);
        // var bMapPosition=GPS.bd_encrypt(aMapPosition.lat,aMapPosition.lon)
        
        var result=Object.assign(mongoData,{
            isWired:this.isWired(mongoData), //是否有线
            statusTxt:this.getMapStatusTxt(mongoData,"x"), //行驶状态
            speed: mongoData["x"] ===1? mongoData["s"]:this.getStopTxt(mongoData),//速度
            date:mongoData["t"],//时间
            mileage:mongoData["g"],//里程
            posType:mongoData["i"],//定位方式
            posTxt:this.getPos(mongoData,"i"),//定位方式显示文本
            angle:mongoData["d"], //方向
            accStateTxt:this.getAccStateTxt(mongoData),
            isStop:this.getIsStop(mongoData,"x"),
            // 
            hasNoLocation:this.getHasNoLocation(mongoData),
            position:GPS.defaultToPosition(mongoData.a, mongoData.o)
        })
        result.componentStateTxt=this.getComponentStateTxt(result)
        return result
    }
}
export default carUtil