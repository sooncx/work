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
 * @desc   字符串转date对象
 * @param  {String} fmt  default: 'yyyy-MM-dd hh:mm:ss'
 * @return {Object}
 */
export function toDate(dateString){
  var DATE_REGEXP = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*");
  if(DATE_REGEXP.test(dateString)){
      var timestamp = dateString.replace(DATE_REGEXP, function($all,$year,$month,$day,$part1,$hour,$minute,$second,$part2,$milliscond){
          var date = new Date($year, $month,$day, $hour||"00", $minute||"00", $second||"00", $milliscond||"00");
          return date.getTime();
      });
      var date = new Date();
      date.setTime(timestamp);
      return date;
  }
  return null;
}


export function getUserType () {
  if (this.$store.state.LOGINUSER.checkSim === 2) {
    return 'monitoring';
  } else if(this.$store.state.LOGINUSER.parentId !== 1 && this.$store.state.LOGINUSER.checkSim === 1) {
    return 'custom';
  } else {
    return true
  }
}