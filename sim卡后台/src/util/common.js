// 递归转换树结构
// 源数据, 最上级ID,名称,父ID名称,创建子级名称

export function handleTree(data, root, idTxt, pidTxt, pushTxt) {
  var idTxt = idTxt || "id";
  var pidTxt = pidTxt || "pid";
  var pushTxt = pushTxt || "children";
  // 递归方法

  function getNode(id) {
    var node = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][pidTxt] == id) {
        data[i][pushTxt] = getNode(data[i][idTxt]);
        node.push(data[i]);
      }
    }
    if (node.length == 0) {
      return;
    } else {
      return node;
    }
  }
  // 使用根节点
  return getNode(root);
}

/**
 * @desc   转化树形图
 * @param  {Object}
 * @return {Array}
 */

export function toTreeData(data) {
  let result = [];
  let resultKeys = {};
  data.map(item => {
    let yearKey = item.groupName.substring(0, 4);
    let monthKey = item.groupName.substring(0, 6);
    let daykey = item.groupName;

    if (!resultKeys[yearKey]) {
      result.push({
        id: yearKey,
        pid: -1,
        label: yearKey
      });
      resultKeys[yearKey] = true;
    }
    if (!resultKeys[monthKey]) {
      result.push({
        id: monthKey,
        pid: yearKey,
        label: monthKey
      });
      resultKeys[monthKey] = true;
    }
    result.push({
      id: daykey,
      groupName: item.groupName,
      pid: monthKey,
      label: daykey + ` (${item.outNum}/${item.totalNum})`
    });
  });

  //toTree
  result.map(item => {
    delete item.children;
  });
  var map = {};
  result.map(item => {
    map[item.id] = item;
  });
  var newData = [];
  result.map((item, index) => {
    var parent = map[item.pid];
    if (parent) {
      (parent.children || (parent.children = [])).push(item); // parent 引用 item
    } else {
      newData.push(item);
    }
  });
  return newData;
}

export function findByGprsBagList() {
  this.$API.findByGprsBagList().then(res => {
    if (res.code === 0) {
      let simList = [{
        value: "",
        label: "全部套餐"
      }];
      res.data.map(item => {
        let gprsType = item.gprsType;
        item.label = gprsType;
        item.value = gprsType;
        //只有库存管理页面需要inventoryValue
        if (gprsType.indexOf("M") === -1) {
          item.inventoryValue =
            Number(gprsType.slice(0, gprsType.length - 1)) * 1024;
        } else {
          item.inventoryValue = Number(gprsType.slice(0, gprsType.length - 1));
        }
        simList.push(item);
      });
      this.$store.commit("getSimList", simList);
    } else {
      this.$msg({
        message: res.msg,
        type: "error"
      });
    }
  });
}

// 节流
export let throttle = (function (immediate) {
  let timer = null;
  let callNow = immediate;

  return function (fn, wait) {
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

/**
 * @desc   时间格式化
 * @param  {String} fmt  default: 'yyyy-MM-dd hh:mm:ss'
 * @return {String}
 */
Date.prototype.Format = function (fmt) {
  if ((fmt == null) | (fmt == "")) {
    fmt = "yyyy-MM-dd hh:mm:ss";
  }
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }

  return fmt.replace(/\//g, "-");
};

/**
 * @desc   字符串转date对象
 * @param  {String} fmt  default: 'yyyy-MM-dd hh:mm:ss'
 * @return {Object}
 */
export function toDate(dateString) {
  var DATE_REGEXP = new RegExp(
    "(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*"
  );
  if (DATE_REGEXP.test(dateString)) {
    var timestamp = dateString.replace(DATE_REGEXP, function (
      $all,
      $year,
      $month,
      $day,
      $part1,
      $hour,
      $minute,
      $second,
      $part2,
      $milliscond
    ) {
      var date = new Date(
        $year,
        $month,
        $day,
        $hour || "00",
        $minute || "00",
        $second || "00",
        $milliscond || "00"
      );
      return date.getTime();
    });
    var date = new Date();
    date.setTime(timestamp);
    return date;
  }
  return null;
}

/**
 * @desc   下载文件
 * @param  {String} baseUrl
 * @param  {Object} params
 */
export function exportFile(json, params) {
  const arr = Object.entries(params).map(([key, val]) => `${key}=${val}`);
  const baseUrl = "/";
  const url = baseUrl + json + "?" + arr.join("&");

  window.open(url);
}

/**
 * @desc   判断有无小数点
 * @param  {number}
 */
export function hasDot(num) {
  if (!isNaN(num)) {
    return (num + "").indexOf(".") === -1 ? num : num.toFixed(2);
  }
}
