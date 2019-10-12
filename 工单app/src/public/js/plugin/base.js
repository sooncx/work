import api from '@/api/httpApi'
var byUtil = {
  // GetLocations(LocationList) {
  //   return new Promise((resolve, reject) => {
     
  //     for(var i=0;i<LocationList.length;i++){
  //       if(LocationList[i]){
  //         let lat=LocationList[i].lat;
  //         let lon=LocationList[i].lon;
  //         let position=[lat,lon]
  //         console.log(position)
  //       api.GetLocationbd({
  //           ak:'536137a6254fcce2978b9d49983942df',
  //           pois:0,
  //           output:'json',
  //           callback:'renderReverse',
  //           location:position
  //       })
  //       .then(res => {
  //         console.log(1313)
  //         if (res.data.result) {
  //             let addressList = [];
  //             let address = "";
  //             if(res.data.result.formatted_address){
  //               if(res.data.result.sematic_description){
  //                   address=res.data.result.formatted_address+","+res.data.result.sematic_description
  //                   addressList.push({
  //                           address ,
  //                           tag: 0
  //                         })
  //               }else{
  //                 address=res.data.result.formatted_address
  //                 addressList.push({
  //                         address ,
  //                         tag: 0
  //                       })
  //               }
                
  //             }else{
  //               addressList.push({
  //                 address: '获取位置失败', ////获取位置失败
  //                 tag: 0
  //               })
  //             }
        
  //             resolve(addressList)
            
  //         }
  //       })
  //     }
  //     }

  //   })
  // },

  GetLocations (LocationList) {
    return new Promise((resolve, reject) => {
      api
        .GetLocations({
          param: JSON.stringify({ posList: LocationList })
        })
        .then(res => {
          if (res.data.flag) {
            if (res.data.obj.length > 0) {
              let addressList = []
              res.data.obj.map(item => {
                if (item.regeocode) {
            
                  let address = ""
                  if (item.regeocode.roads.length > 0) {
                    let road = item.regeocode.roads[0]
                    address = `${item.regeocode.formatted_address}(在${road.name}的${road.direction}方向约${parseInt(road.distance)}米)`
                  } else {
                    address = item.regeocode.formatted_address
                  }
                  
                  addressList.push({
                    address,
                    tag: item.tag
                  })
                } else {
                  addressList.push({
                    address: '获取位置失败',
                    tag: item.tag
                  })
                }
              })
              resolve(addressList)
            }
          }
        })
    })
  },



  /**
   * @desc 获取地址 {lat,lon,tag}  经,纬,下标
   * @param {Array} list
   * @return {Promise}
   */

  isChinese(str){
    var reg=/[\u4e00-\u9fa5]/g;
    if(reg.test(str)){
        return true
    }else{
      return false
    }
  }, 
 
  /**
   * @desc 获取地址 {lat,lon}  经,纬
   * @param {Array} list
   * @return {Promise}
   */

 
  /**
   * @desc 判断元素是否有某个class
   * @param {HTMLElement} ele
   * @param {String} cls
   * @return {Boolean}
   */
  hasClass(ele, cls) {
    return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(ele.className)
  },

  /**
   * @desc   为元素添加class
   * @param  {HTMLElement} ele
   * @param  {String} cls
   */
  addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
      ele.className += ' ' + cls
    }
  },

  /**
   * @desc 为元素移除class
   * @param {HTMLElement} ele
   * @param {String} cls
   */
  removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
      ele.className = ele.className.replace(reg, ' ')
    }
  },

  /**
   * @desc 格式化CSS样式代码
   * @param {String} s
   * @return {String} s
   */
  formatCss(s) {
    // 格式化代码
    s = s.replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
    s = s.replace(/;\s*;/g, ';') // 清除连续分号
    s = s.replace(/\,[\s\.\#\d]*{/g, '{')
    s = s.replace(/([^\s])\{([^\s])/g, '$1 {\n\t$2')
    s = s.replace(/([^\s])\}([^\n]*)/g, '$1\n}\n$2')
    s = s.replace(/([^\s]);([^\s\}])/g, '$1;\n\t$2')
    return s
  },

  /**
   * @desc 压缩CSS样式代码
   * @param {String} s
   * @return {String} s
   */
  yasuoCss(s) {
    // 压缩代码
    s = s.replace(/\/\*(.|\n)*?\*\//g, '') // 删除注释
    s = s.replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
    s = s.replace(/\,[\s\.\#\d]*\{/g, '{') // 容错处理
    s = s.replace(/;\s*;/g, ';') // 清除连续分号
    s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/) // 去掉首尾空白
    return s == null ? '' : s[1]
  },

  /**
   * @desc 检测对象是否是空对象(不包含任何可读属性)。
   *       方法只既检测对象本身的属性，不检测从原型继承的属性。
   * @param {*} obj
   * @return {Boolean}
   **/
  isOwnEmpty(obj) {
    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        return false
      }
    }
    return true
  },

  /**
   *  @desc 获取本地缓存
   *  @param {String} key
   **/
  localStorage_GetItem(key) {
    var temp = localStorage.getItem(key)

    if (temp != null) {
      return JSON.parse(temp)
    } else {
      return temp
    }
  },

  /**
   *  @desc  添加本地缓存
   *  @param {String}  key
   *  @param  {obj}  value
   *  @return  {Boolean}
   **/
  localStorage_SetItem(key, value) {

    if (value) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },

  /**
   * @desc  用户名校验：只能输入1-30个以字母开头的字串
   * @param {String} s
   */
  isTrueName(s) {
    var patrn = /^[a-zA-Z]{1,30}$/
    if (!patrn.exec(s)) return false
    return true
  },

  /**
   * @desc  校验密码：只能输入6-20个字母、数字、下划线
   * @param {String} s
   */
  isPasswd(s) {
    var patrn = /^(\w){6,20}$/
    if (!patrn.exec(s)) return false
    return true
  },

  /**
   *
   * @desc   判断是否为数字
   * @param  {String}  str
   * @return {Boolean}
   */
  isNum(str) {
    return /^[0-9]+.?[0-9]*/.test(str)
  },

  /**
   *
   * @desc   判断是否为正整数
   * @param  {String}  str
   * @return {Boolean}
   */
  isZAdd(str) {
    return /^[1-9]+[0-9]*]*$/.test(str)
  },

  /**
   *
   * @desc   判断是否为邮箱地址
   * @param  {String}  str
   * @return {Boolean}
   */
  isEmail(str) {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str)
  },

  /**
   *
   * @desc  判断是否为身份证号
   * @param  {String|Number} str
   * @return {Boolean}
   */
  isIdCard(str) {
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
      str
    )
  },

  /**
   *
   * @desc   判断是否为手机号
   * @param  {String|Number} str
   * @return {Boolean}
   */
  isPhoneNum(str) {
    return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(
      str
    )
  },

  /**
   *
   * @desc   判断是否为URL地址
   * @param  {String} str
   * @return {Boolean}
   */
  isUrl(str) {
    return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(
      str
    )
  },

  /**
   * @desc 获取域名主机
   * @param  {String}  url:域名
   */
  getHost(url) {
    var host = 'null'
    if (typeof url === 'undefined' || url == null) {
      url = window.location.href
    }
    var regex = /^\w+\:\/\/([^\/]*).*/
    var match = url.match(regex)
    if (typeof match !== 'undefined' && match != null) {
      host = match[1]
    }
    return host
  },

  /**
   * @desc   url参数转对象
   * @param  {String} url  default: window.location.href
   * @return {Object}
   */
  parseQueryString(url) {
    url = url == null ? window.location.href : url
    var search = url.substring(url.lastIndexOf('?') + 1)
    if (!search) {
      return {}
    }
    return JSON.parse(
      '{"' +
      decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
      '"}'
    )
  },

  /**
   * @desc  获取url参数值
   * @param {String} name
   */
  getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },

  /**
   * @desc  左填充
   * @param {String|Number} str
   * @param {Number} lenght
   */
  padLeft(str, lenght) {
    if (str.length >= lenght) {
      return str
    } else {
      return padLeft('0' + str, lenght)
    }
  },

  /**
   * @desc  右填充
   * @param {String|Number} str
   * @param {Number} lenght
   */
  padRight(str, lenght) {
    if (str.length >= lenght) {
      return str
    } else {
      return padRight(str + '0', lenght)
    }
  },

  /**
   * @desc  数组排序 keysrt('name',true)
   * @param {String} key
   * @param {*} desc
   */
  keysrt(key, desc) {
    return function (a, b) {
      return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key])
    }
  },
  /**
   * @desc 判断元素是否有某个class
   * @param {Number} dir
   * @return {String}
   */
 
  // s20是代表20秒
  // h是指小时，如12小时则是：h12
  // d是天数，30天则：d30
  // setCookie("name","hayden","s20");
  // 坐标转换
  setCookie(name, value, time) {
    var strsec = this.getsec(time)
    var exp = new Date()
    exp.setTime(exp.getTime() + strsec * 1)
    document.cookie =
      name + '=' + escape(value) + ';expires=' + exp.toGMTString()
  },
  getCookie(name) {
    var arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) return unescape(arr[2])
    else return null
  },

  //  删除Cookie  cookie名 
  removeCookie(name) {
    this.setCookie(name, '0', 0)
  },
  getsec(str) {
    if (str === 0) return 0
    var str1 = str.substring(1, str.length) * 1
    var str2 = str.substring(0, 1)
    if (str2 === 's') {
      return str1 * 1000
    } else if (str2 === 'h') {
      return str1 * 60 * 60 * 1000
    } else if (str2 === 'd') {
      return str1 * 24 * 60 * 60 * 1000
    }
  }
}

var GPS = {
  PI: 3.14159265358979324,
  x_pi: (3.14159265358979324 * 3000.0) / 180.0,
  a: 6378245.0, //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
  ee: 0.00669342162296594323, //  ee: 椭球的偏心率。
  delta: function (lat, lon) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;

    if (this.outOfChina(lat, lon)) {
      return {
        lat: lat,
        lon: lon
      }
    }

    var dLat = this.transformLat(lon - 105.0, lat - 35.0)
    var dLon = this.transformLon(lon - 105.0, lat - 35.0)
    var radLat = (lat / 180.0) * this.PI
    var magic = Math.sin(radLat)
    magic = 1 - this.ee * magic * magic
    var sqrtMagic = Math.sqrt(magic)
    dLat =
      (dLat * 180.0) /
      (((this.a * (1 - this.ee)) / (magic * sqrtMagic)) * this.PI)
    dLon = (dLon * 180.0) / ((this.a / sqrtMagic) * Math.cos(radLat) * this.PI)
    lat = lat + dLat
    lon = lon + dLon
    return {
      lat: lat,
      lon: lon
    }
  },
  deltaOut: function (lat, lon) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;

    if (this.outOfChina(lat, lon)) {
      return {
        lat: lat,
        lon: lon
      }
    }

    var dLat = this.transformLat(lon - 105.0, lat - 35.0)
    var dLon = this.transformLon(lon - 105.0, lat - 35.0)
    var radLat = (lat / 180.0) * this.PI
    var magic = Math.sin(radLat)
    magic = 1 - this.ee * magic * magic
    var sqrtMagic = Math.sqrt(magic)
    dLat =
      (dLat * 180.0) /
      (((this.a * (1 - this.ee)) / (magic * sqrtMagic)) * this.PI)
    dLon = (dLon * 180.0) / ((this.a / sqrtMagic) * Math.cos(radLat) * this.PI)
    lat = lat - dLat
    lon = lon - dLon
    return {
      lat: lat,
      lon: lon
    }
  },

  // WGS-84 to GCJ-02
  gcj_encrypt: function (wgsLat, wgsLon) {
    var d = this.delta(wgsLat, wgsLon)

    return {
      lat: d.lat,
      lon: d.lon
    }
  },
  // GCJ-02 to WGS-84
  gcj_decrypt: function (gcjLat, gcjLon) {
    if (this.outOfChina(gcjLat, gcjLon)) {
      return {
        lat: gcjLat,
        lon: gcjLon
      }
    }

    var d = this.delta(gcjLat, gcjLon)
    return {
      lat: gcjLat - d.lat,
      lon: gcjLon - d.lon
    }
  },
  // GCJ-02 to WGS-84 exactly
  gcj_decrypt_exact: function (gcjLat, gcjLon) {
    var initDelta = 0.01
    var threshold = 0.000000001
    var dLat = initDelta,
      dLon = initDelta
    var mLat = gcjLat - dLat,
      mLon = gcjLon - dLon
    var pLat = gcjLat + dLat,
      pLon = gcjLon + dLon
    var wgsLat,
      wgsLon,
      i = 0
    while (1) {
      wgsLat = (mLat + pLat) / 2
      wgsLon = (mLon + pLon) / 2
      var tmp = this.gcj_encrypt(wgsLat, wgsLon)
      dLat = tmp.lat - gcjLat
      dLon = tmp.lon - gcjLon
      if (Math.abs(dLat) < threshold && Math.abs(dLon) < threshold) {
        break
      }

      if (dLat > 0) pLat = wgsLat
      else mLat = wgsLat
      if (dLon > 0) pLon = wgsLon
      else mLon = wgsLon

      if (++i > 10000) break
    }
    // console.log(i);
    return {
      lat: wgsLat,
      lon: wgsLon
    }
  },
  // GCJ-02 to BD-09
  bd_encrypt: function (gcjLat, gcjLon) {
    var x = gcjLon,
      y = gcjLat
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi)
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi)
    var bdLon = z * Math.cos(theta) + 0.0065
    var bdLat = z * Math.sin(theta) + 0.006
    return {
      lat: bdLat,
      lon: bdLon
    }
  },
  // BD-09 to GCJ-02
  bd_decrypt: function (bdLat, bdLon) {
    var x = bdLon - 0.0065,
      y = bdLat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi)
    var gcjLon = z * Math.cos(theta)
    var gcjLat = z * Math.sin(theta)
    return {
      lat: gcjLat,
      lon: gcjLon
    }
  },
  // WGS-84 to Web mercator
  // mercatorLat -> y mercatorLon -> x
  mercator_encrypt: function (wgsLat, wgsLon) {
    var x = (wgsLon * 20037508.34) / 180.0
    var y =
      Math.log(Math.tan(((90.0 + wgsLat) * this.PI) / 360.0)) /
      (this.PI / 180.0)
    y = (y * 20037508.34) / 180.0
    return {
      lat: y,
      lon: x
    }
  },
  // Web mercator to WGS-84
  // mercatorLat -> y mercatorLon -> x
  mercator_decrypt: function (mercatorLat, mercatorLon) {
    var x = (mercatorLon / 20037508.34) * 180.0
    var y = (mercatorLat / 20037508.34) * 180.0
    y =
      (180 / this.PI) *
      (2 * Math.atan(Math.exp((y * this.PI) / 180.0)) - this.PI / 2)
    return {
      lat: y,
      lon: x
    }
  },
  // two point's distance
  distance: function (latA, lonA, latB, lonB) {
    var earthR = 6371000.0
    var x =
      Math.cos((latA * this.PI) / 180.0) *
      Math.cos((latB * this.PI) / 180.0) *
      Math.cos(((lonA - lonB) * this.PI) / 180)
    var y =
      Math.sin((latA * this.PI) / 180.0) * Math.sin((latB * this.PI) / 180.0)
    var s = x + y
    if (s > 1) s = 1
    if (s < -1) s = -1
    var alpha = Math.acos(s)
    var distance = alpha * earthR
    return distance
  },
  outOfChina: function (lat, lon) {
    if (lon < 72.004 || lon > 137.8347) {
      return true
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true
    }
    return false
  },
  transformLat: function (x, y) {
    var ret = -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x))
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
          20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0
    ret +=
      ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) *
        2.0) /
      3.0
    ret +=
      ((160.0 * Math.sin((y / 12.0) * this.PI) +
          320 * Math.sin((y * this.PI) / 30.0)) *
        2.0) /
      3.0
    return ret
  },
  transformLon: function (x, y) {
    var ret =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x))
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
          20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0
    ret +=
      ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) *
        2.0) /
      3.0
    ret +=
      ((150.0 * Math.sin((x / 12.0) * this.PI) +
          300.0 * Math.sin((x / 30.0) * this.PI)) *
        2.0) /
      3.0
    return ret
  }
}

/**
 * @desc   时间格式化
 * @param  {String} fmt  default: 'yyyy-MM-dd hh:mm:ss'
 * @return {String}
 */
Date.prototype.Format = function (fmt) {
  if ((fmt == null) | (fmt == '')) {
    fmt = 'yyyy-MM-dd hh:mm:ss'
  }
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }

  return fmt.replace(/\//g, '-')
}

/**
 * @desc  移除元素
 * @param {Number} dx
 */
Array.prototype.remove = function (dx) {
  if (isNaN(dx) || dx > this.length) {
    return false
  }
  for (var i = 0, n = 0; i < this.length; i++) {
    if (this[i] != this[dx]) {
      this[n++] = this[i]
    }
  }
  this.length -= 1
}

/**
 * @desc  数组去重
 */
Array.prototype.unique = function () {
  var res = [this[0]]
  for (var i = 1; i < this.length; i++) {
    var repeat = false
    for (var j = 0; j < res.length; j++) {
      if (this[i] == res[j]) {
        repeat = true
        break
      }
    }
    if (!repeat) {
      res.push(this[i])
    }
  }
  return res
}

let throttle = (function(immediate) {////节流
  let timer = null;
  let callNow = immediate;

  return function(fn, wait) {
    let context = this,
      args = arguments;

    if (callNow) {
      fn.apply(context, args);
      callNow = false;
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
})();

export {
  throttle,
  GPS,
  byUtil
}
