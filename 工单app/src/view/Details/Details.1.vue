<template>
  <div class="Details">
    <div class="header">
      <div
        class="back iconfont icon-fanhui"
        @click="backGo"
      ></div>
      <div class="header_title">
        <span>工单详情</span>
      </div>
    </div>
    <div class="companyName">
      博实结科技有限公司
    </div>
    <div class="main">
      <div class="main_contant">
        <span class="main_left">工单状态</span>
        <span class="main_right orangeStyle">等待确认</span>
      </div>
      <div class="main_contant">
        <span class="main_left">安装设备</span>
        <span class="main_right">A5C / A5C / A5C / A5C</span>
      </div>
      <div class="main_contant">
        <span class="main_left">车主姓名</span>
        <span class="main_right">周润发</span>
      </div>
      <div class="main_contant">
        <span class="main_left">联系方式</span>
        <span class="main_right">18599665848</span>
      </div>
      <div class="main_contant">
        <span class="main_left">安装时间</span>
        <span class="main_right">2019-08-08 下午1点30分（明天）</span>
      </div>
      <div class="main_contant">
        <span class="main_left">安装地点</span>
        <span class="main_right">深圳市福田区冰河大道阿里巴巴阿里巴巴阿里巴巴深圳市福田区冰河巴</span>
      </div>
      <div class="main_contant">
        <span class="main_left">备注信息</span>
        <span class="main_right_last">我是备注我是备注我是备注我是备注我</span>
      </div>
    </div>
    <!-- footer -->
    <div class="footer">
      <div
        class="drag"
        ref="dragDiv"
      >
        <div class="drag_bg"></div>
        <div class="drag_text">{{confirmWords}}</div>
        <div
          ref="moveDiv"
          @touchstart="mousedownFn($event)"
          :class="{'handler_ok_bg':confirmSuccess}"
          class="handler handler_bg"
          style="position: absolute;top: 0px;left: 0px;"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  //   name: 'App'
  data() {
    return {
      beginClientX: 0 /*距离屏幕左端距离*/,
      mouseMoveStata: false /*触发拖动状态  判断*/,
      maxwidth: "" /*拖动最大宽度，依据滑块宽度算出来的*/,
      confirmWords: "" /*滑块文字*/,
      confirmSuccess: false /*验证成功判断*/
    };
  },
  methods: {
    backGo() {},
    mousedownFn: function(e) {
      var x = e.changedTouches[0].clientX;

      if (!this.confirmSuccess) {
        e.preventDefault && e.preventDefault(); //阻止文字选中等 浏览器默认事件
        this.mouseMoveStata = true;
        // this.beginClientX = e.clientX;
        this.beginClientX = x;
      }
    }, //mousedoen 事件
    successFunction() {
      this.confirmSuccess = true;
      this.confirmWords = "验证通过";
      if (window.addEventListener) {
        document
          .getElementsByTagName("html")[0]
          //   .removeEventListener("touchmove", this.mouseMoveFn);
          .removeEventListener("touchmove", this.mouseMoveFn);
        document
          .getElementsByTagName("html")[0]
          //   .removeEventListener("touchend", this.moseUpFn);
          .removeEventListener("touchend", this.moseUpFn);
      } else {
        document
          .getElementsByTagName("html")[0]
          //   .removeEventListener("touchend", () => {});
          .removeEventListener("touchend", () => {});
      }
      document.getElementsByClassName("drag_text")[0].style.color = "#fff";
      document.getElementsByClassName("handler")[0].style.left =
        this.maxwidth + "px";
      document.getElementsByClassName("drag_bg")[0].style.width =
        this.maxwidth + "px";
    }, //验证成功函数
    mouseMoveFn(e) {
      var x = e.changedTouches[0].clientX;
      if (this.mouseMoveStata) {
        // let width = e.clientX - this.beginClientX;
        let width = x - this.beginClientX;
        if (width > 0 && width <= this.maxwidth) {
          document.getElementsByClassName("handler")[0].style.left =
            width + "px";
          document.getElementsByClassName("drag_bg")[0].style.width =
            width + "px";
        } else if (width > this.maxwidth) {
          this.successFunction();
        }
      }
    }, //mousemove事件
    moseUpFn(e) {
      debugger;
      var x = e.changedTouches[0].clientX;
      this.mouseMoveStata = false;
      //   var width = e.clientX - this.beginClientX;
      var width = x - this.beginClientX;
      if (width < this.maxwidth) {
        document.getElementsByClassName("handler")[0].style.left = 0 + "px";
        document.getElementsByClassName("drag_bg")[0].style.width = 0 + "px";
      }
    }
  },
  mounted() {
    this.maxwidth =
      this.$refs.dragDiv.clientWidth - this.$refs.moveDiv.clientWidth;
    document
      .getElementsByTagName("html")[0]
      //   .addEventListener("touchmove", this.mouseMoveFn);
      .addEventListener("touchmove", this.mouseMoveFn);
    document
      .getElementsByTagName("html")[0]
      //   .addEventListener("touchend", this.moseUpFn);
      .addEventListener("touchend", this.moseUpFn);
  },
  components: {
    //   cell
  }
};
</script>

<style lang="less" >
.Details {
  .header {
    position: relative;
    background: #fff;
    text-align: center;
    padding: 0.1rem 0.2rem;
    height: 0.7rem;
    .back {
      font-size: 0.35rem;
      float: left;
      font-weight: 600;
    }
    .inputStyle {
      height: 0.55rem;
      margin-top: 0.1rem;
      border: none;
      background: #f5f5f5;
      width: 74%;
    }
    .header_title {
      height: 0.7rem;
      color: #333333;
      font-size: 0.4rem;
    }
  }
  .companyName {
    margin-top: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    padding: 0.2rem;
    color: #333333;
    font-weight: 600;
  }
  .main {
    margin-top: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    .main_contant {
      min-height: 0.8rem;
      display: flex;
      font-size: 0.25rem;
      padding: 0.2rem;
      .main_left {
        display: inline-block;
        width: 20%;
        color: #999999;
      }
      .main_right {
        color: #333;
        display: inline-block;
        width: 80%;
        border-bottom: 1px solid #ddd;
        padding-left: 0.2rem;
      }
      .main_right_last {
        color: #333;
        display: inline-block;
        width: 80%;
        // border-bottom: 1px solid #ddd;
        padding-left: 0.2rem;
      }
      .orangeStyle {
        color: #ff803a;
      }
    }
  }
  .footer {
    .drag {
      position: relative;
      background-color: #e8e8e8;
      width: 100%;
      height: 34px;
      line-height: 34px;
      text-align: center;
    }
    .handler {
      width: 40px;
      height: 32px;
      border: 1px solid #ccc;
      cursor: move;
    }
    .handler_bg {
      background: #fff
        url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==")
        no-repeat center;
    }
    .handler_ok_bg {
      background: #fff
        url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==")
        no-repeat center;
    }
    .drag_bg {
      background-color: #7ac23c;
      height: 34px;
      width: 0px;
    }
    .drag_text {
      position: absolute;
      top: 0px;
      width: 100%;
      text-align: center;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      -o-user-select: none;
      -ms-user-select: none;
    }
  }
}
</style>
