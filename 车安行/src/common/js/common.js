import GetDisance from "@/common/js/GetDisance"
import AddressUtil from "@/common/js/AddressUtil"
var _ = require('lodash'); //在extend.js中有引用
import _extendDeep from "./extend"
import Cookies from "js-cookie"
window["Cookies"]=Cookies
Vue.prototype.$msg={
    error:"网络异常请稍后再试"
}
function getCookie(name) { 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
} 
function TransData(a, idStr, pidStr, chindrenStr) { //json转树状图结构
    var r = [],
        hash = {},
        id = idStr,
        pid = pidStr,
        children = chindrenStr,
        i = 0,
        j = 0,
        len = a.length;
    for (; i < len; i++) {
        hash[a[i][id]] = a[i];
    }
    for (; j < len; j++) {
        var aVal = a[j],
            hashVP = hash[aVal[pid]];
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
        } else {
            r.push(aVal);
        }
    }
    return r;
}
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
var CarDataKeyTrans = (function (carData) { //转换两中不同keycarData,比如  V <=> vehicleId的相互转换 ;
    var mapKeys = {
        get: {
            vehicleId: "V",
            terType: "T",
            plate: "P",
            terminal: "N",
            time: "R",
            stateKeepTime: "D",
            stateKeepTimeMin: "d",
            vehicleId: "V",
            x: "X",
            yx: "X",
            y: "Y",
            yy: "Y",
            lon: "X",
            lat: "Y",
            o: "O",
            speed: "S",
            mileage: "L",
            angle: "F",
            power: "E",
            alarm: "B",
            pos: "G",
            lbs: "J",
            wifi: "W",
            isgroup: "W",
            status: "A",
            groupId: "M"
        },
        set: {}
    };
    for (var key in mapKeys.get) { //反转get
        var newVal = mapKeys.set[mapKeys.get[key]];
        if (newVal) {
            if (typeof newVal === "string") {
                newVal = [newVal, key]
            } else {
                newVal.push(key)
            }
            mapKeys.set[mapKeys.get[key]] = newVal;
        } else {
            mapKeys.set[mapKeys.get[key]] = key;
        }

    }
    var toKey = function (obj) {
        for (var key in mapKeys.set) {
            if (obj[key] !== undefined) {
                var val = mapKeys.set[key];
                if (typeof val === "string") {
                    obj[val] = obj[key];
                } else {
                    $.each(val, function (index, item) {
                        obj[item] = obj[key]
                    })
                }
                // console.log(val)
            }
        };
        if(obj.alarm){
            obj.alarmObj=JSON.parse(obj.alarm);
        }
        return getEncrypt(obj);
    };
    var getEncrypt = function (obj) {
        if (obj.X != undefined & obj.Y != undefined) {
            var s = GPS.gcj_encrypt(obj.Y, obj.X);
            obj.y = s.lat;
            obj.x = s.lon;
            var bdPoint= GPS.bd_encrypt(obj.y, obj.x)
            // obj.bdPoint=bdPoint.bdPoint;
            obj.bdX=bdPoint.lon;
            obj.bdY=bdPoint.lat;
        }
        return obj;
    }
    return {
        mapKeys: mapKeys,
        toKey: toKey
    }
    // var toLetter
})();
var GPS = {
    PI: 3.14159265358979324,
    x_pi: 3.14159265358979324 * 3000.0 / 180.0,
    a: 6378245.0, //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    ee: 0.00669342162296594323, //  ee: 椭球的偏心率。
    delta: function(lat, lon) {
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;

        if (this.outOfChina(lat, lon)) {
            return { 'lat': lat, 'lon': lon };
        }

        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.PI);
        lat = lat + dLat;
        lon = lon + dLon;
        return { 'lat': lat, 'lon': lon };
    },
    deltaOut: function(lat, lon) {
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;

        if (this.outOfChina(lat, lon)) {
            return { 'lat': lat, 'lon': lon };
        }

        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.PI);
        lat = lat - dLat;
        lon = lon - dLon;
        return { 'lat': lat, 'lon': lon };
    },

    //WGS-84 to GCJ-02
    gcj_encrypt: function(wgsLat, wgsLon) {


        var d = this.delta(wgsLat, wgsLon);

        return { 'lat': d.lat, 'lon': d.lon };
    },
    //GCJ-02 to WGS-84
    gcj_decrypt: function(gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon))
            return { 'lat': gcjLat, 'lon': gcjLon };

        var d = this.delta(gcjLat, gcjLon);
        return { 'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon };
    },
    //GCJ-02 to WGS-84 exactly
    gcj_decrypt_exact: function(gcjLat, gcjLon) {
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta,
            dLon = initDelta;
        var mLat = gcjLat - dLat,
            mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat,
            pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.gcj_encrypt(wgsLat, wgsLon)
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                break;

            if (dLat > 0) pLat = wgsLat;
            else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon;
            else mLon = wgsLon;

            if (++i > 10000) break;
        }
        //console.log(i);
        return { 'lat': wgsLat, 'lon': wgsLon };
    },
    //GCJ-02 to BD-09
    bd_encrypt: function(gcjLat, gcjLon) {
        var x = gcjLon,
            y = gcjLat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
         var bdLon = z * Math.cos(theta) + 0.0065;
        var bdLat = z * Math.sin(theta) + 0.006;
        return { 'lat': bdLat, 'lon': bdLon };
    },
    //BD-09 to GCJ-02
    bd_decrypt: function(bdLat, bdLon) {
        var x = bdLon - 0.0065,
            y = bdLat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
        var gcjLon = z * Math.cos(theta);
        var gcjLat = z * Math.sin(theta);
        return { 'lat': gcjLat, 'lon': gcjLon };
    },
    //WGS-84 to Web mercator
    //mercatorLat -> y mercatorLon -> x
    mercator_encrypt: function(wgsLat, wgsLon) {
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return { 'lat': y, 'lon': x };
        /*
        if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
            return null;
        var x = 6378137.0 * wgsLon * 0.017453292519943295;
        var a = wgsLat * 0.017453292519943295;
        var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
        return {'lat' : y, 'lon' : x};
        //*/
    },
    // Web mercator to WGS-84
    // mercatorLat -> y mercatorLon -> x
    mercator_decrypt: function(mercatorLat, mercatorLon) {
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return { 'lat': y, 'lon': x };
        /*
        if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
            return null;
        if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
            return null;
        var a = mercatorLon / 6378137.0 * 57.295779513082323;
        var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
        var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
        return {'lat' : y, 'lon' : x};
        //*/
    },
    // two point's distance
    distance: function(latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        var distance = alpha * earthR;
        return distance;
    },
    outOfChina: function(lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
    transformLat: function(x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon: function(x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    },
    defaultToPosition:function(x,y){ //默认坐标转成position
        //x:43.984348,y:122.386888
        var amapPosition=GPS.delta(x,y)
        //    lat: 43.986719632572296,lon: 122.39272395305956
        return GPS.amapToPosition(amapPosition.lon,amapPosition.lat)
    },
    defaultToPositionList:function({list,xKey,yKey}){ //批量默认坐标转成position
        var result={};
        var tepList=[]
        list.map(item=>{
            tepList.push(GPS.defaultToPosition(item[xKey],item[yKey]));
        });
        tepList.map(item=>{
            Object.keys(item).map(subKey=>{
                if(!result[subKey]){
                    result[subKey]=[]
                }
                result[subKey].push(item[subKey])
            })
        })
        
        return  result
    },
    amapToPosition:function(x,y){ //高德地图坐标到position
        //x:122.39272395305956 ,y:43.986719632572296
        var bdPoint=GPS.bd_encrypt(y,x)
        return{
            aMap:{
                x,y
            },
            bMap:{
                x:bdPoint.lat,
                y:bdPoint.lon
            }
        }
    },
    amapToPositionList:function({list,xKey,yKey}){ //批量高德坐标转成批量position
        /*
        list=[
            {"oriLat":22.669176,"oriLon":113.934125,"pathId":9535,"pointId":0}
        ]
        xKey="oriLon"
        yKey="oriLat"
        */        
        var result={};
        var tepList=[]
        list.map(item=>{
            tepList.push(GPS.amapToPosition(item[xKey],item[yKey]));
        });
        tepList.map(item=>{
            Object.keys(item).map(subKey=>{
                if(!result[subKey]){
                    result[subKey]=[]
                }
                result[subKey].push(item[subKey])
            })
        })
        
        return  result
    },
    positioListTran:function(list){
        /*
            [
                {
                    amap:{1a},
                    bmap:{1b}
                },
                {
                    amap:{2a},bmap:{2b}
                }
            ]
            转换到
            {
                amap:[{1a},{2a}],
                bmap:[{1b},{2b}]
            }
         */
        var result={}
        list.map((item,index)=>{
                Object.keys(item).map(type=>{
                    if(!result[type]){
                        result[type]=[]
                    }
                    result[type][index]=item[type]
                })
            
        })
        
        return result
    }
}
var IsNaN=function(val){
    if(val ===val){
        return false;
    }else{
        return true
    }
}
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null; 
} 
var CacheUtil = (function () {
    var globalPrefix = "bsjCache_"
    var everCacheKey = "__everCacheList__";
    var everCacheList = {}; //全局永不删除的cache;
  
    /***********/
    var _init = function () {
      if (typeof (Storage) === "undefined") {
        console.error("抱歉！您的浏览器不支持 Web Storage ...");
      } else {
        /*****解决localStorage change不能本页面触发（只能在其他页面触发的问题）start****/
        // var oriSetItem = localStorage.setItem;
        // localStorage.setItem = function (k, v) {
        //   if (v !== localStorage.getItem(k)) { //如果值不一样
        //     var se = document.createEvent("StorageEvent");
        //     se.initStorageEvent('storage', false, false, k, null, v, null, null);
        //     window.dispatchEvent(se);
        //     oriSetItem.apply(this, arguments);
        //   }
  
        // }
        /*****解决localStorage change不能本页面触发（只能在其他页面触发的问题）end****/
      }
    };
    _init();
    var set = function (key, value, isEver) { //isEver 是否永久保存
      isEver =isEver ||false; 
      key = globalPrefix + key
      if (isEver && !everCacheList.hasOwnProperty(key)) { //保存永久的key,在clear的时候做判断
        everCacheList[key] = 1;
        localStorage.setItem(everCacheKey, everCacheList);
      };
      if(typeof value ==="object"){
        value=JSON.stringify(value)
      }
      localStorage.setItem(key,value);
    };
    var get = function (key, isNonePrefix) {
      if (isNonePrefix !== false) {
        key = globalPrefix + key
      }
  
      var getData = localStorage.getItem(key);
      if (getData == "undefined") {
        return getData;
      }
      try {
        return JSON.parse(getData);
      } catch (err) {
        return getData;
      }
    };
    var remove = function (key, hasGlobalPrefix) {
      hasGlobalPrefi=hasGlobalPrefix||false;
      if (!hasGlobalPrefix) {
        key = globalPrefix + key
      }
      localStorage.removeItem(key)
    }
    var clear = function (isRemoveAll) { //存储
      isRemoveAll=isRemoveAll||false;
      //这里不用localStorage.clear();是为了不删除map.js的一些数据，用于加载速度
      Object.keys(localStorage).forEach(function(itemCacheKey){
        if (itemCacheKey.indexOf(globalPrefix) === 0) {
          if (isRemoveAll) {
            remove(itemCacheKey, true)
          } else if (!everCacheList.hasOwnProperty(itemCacheKey)) { //不删除永久保存的cache
            remove(itemCacheKey, true)
          }
        }
      });
    }
    return {
      prefix: globalPrefix,
      set: set,
      get: get,
      remove: remove,
      clear: clear
    }
  })();

// TransData(data,"idKey","pidKey","chindrenKey")
window["GetDisance"]=GetDisance;
window["getCookie"]=getCookie;
window["TransData"]=TransData;
window["CarDataKeyTrans"]=CarDataKeyTrans;
window["GPS"]=GPS;
window["IsNaN"]=IsNaN
window["CacheUtil"]=CacheUtil;
window["getQueryString"]=getQueryString
window["AddressUtil"]=AddressUtil
window["_"]=_
window["_extendDeep"]=_extendDeep
window["_LoginNoUse"]=function(result){ //判断是否是登录过期
    if(result.data === null){ //为登录
        console.error("未登录")
    }
}
