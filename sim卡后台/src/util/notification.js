export default class simNotification {
  constructor() {
    var Notification =
      window.Notification ||
      window.mozNotification ||
      window.webkitNotification; // 浏览器兼容性
    this.init(Notification);
  }

  // 初始化信息通知
  init(Notification) {
    if (Notification) {
      //  granted 表示已经允许
      if (Notification.permission == "granted") {
        
      } else {
        // 询问用户是否同意打开通知
        var _this = this;
        Notification.requestPermission(function(status) {
          if (status === "granted") {
            // 用户允许
            // _this.sendMsg()
          } else {
            // 用户禁止
            // alert("禁止通知会导致新订单无法通知");
            return false;
          }
        });
      }
    }
  }

  // 发送消息

  /* @params title String 标题信息  
    @params data Object   {
      body     // String 信息内容  
      icon    // String 图片路径
    }
  */
  sendMsg(title, data) {
    title = title
    data = data
    this.instance = new Notification(title, data);

    // 点击时弹出浏览器 
    this.instance.onclick = () => {
      window.focus();
      this.instance.close()
    };
    return this;
  }
}
