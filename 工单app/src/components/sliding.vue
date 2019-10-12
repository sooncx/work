<template>
  <div
    class="drag"
    ref="dragDiv"
  >
    <div class="drag_bg"></div>
    <div
      ref="drag_text"
      class="drag_text"
    >{{confirmWords}}</div>
    <!-- <div ref="moveDiv" @touchstart="mousedownFn($event)" :class="{'handler_ok_bg':confirmSuccess}" class="handler handler_bg" style="position: absolute;top: 0px;left: 0px;"></div> -->
    <div
      ref="moveDiv"
      @touchstart="mousedownFn($event)"
      class="handler iconfont "
      :class="['iconfont',{'icon-you-copy-copy':isShowJT}]"
      style="position: absolute;top: 0px;left: 0px;"
    ></div>
  </div>
</template>

<script>
export default {
  name: "sliding",
  data() {
    return {
      isShowJT: true,
      beginClientX: 0 /*距离屏幕左端距离*/,
      mouseMoveStata: false /*触发拖动状态  判断*/,
      maxwidth: "" /*拖动最大宽度，依据滑块宽度算出来的*/,
      confirmWords: "拖动滑块,确认收到订单" /*滑块文字*/,
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
      this.$emit("successEvent");
      console.log(99999);
      if (localStorage.getItem("isQueRen") == "true") {
        this.isShowJT = false;
        this.confirmSuccess = true;
        this.confirmWords = "已安装，点击上传安装信息";
        this.$refs.drag_text.style.background = "#0866F6";
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
      } else {
        localStorage.setItem("isQueRen", false);
        document.getElementsByClassName("handler")[0].style.left = "0px";
        document.getElementsByClassName("drag_bg")[0].style.width = "0px";
      }
    }, //验证成功函数
    mouseMoveFn(e) {
      var x = e.changedTouches[0].clientX;
      if (this.mouseMoveStata) {
        // let width = e.clientX - this.beginClientX;
        let width = x - this.beginClientX;
        if (width > 0 && width <= this.maxwidth) {
          if (document.getElementsByClassName("handler")[0]) {
            document.getElementsByClassName("handler")[0].style.left =
              width + "px";
          }
          if (document.getElementsByClassName("drag_bg")[0]) {
            document.getElementsByClassName("drag_bg")[0].style.width =
              width + "px";
          }
        } else if (width > this.maxwidth) {
          this.successFunction();
        }
      }
    }, //mousemove事件
    moseUpFn(e) {
      var x = e.changedTouches[0].clientX;
      this.mouseMoveStata = false;
      //   var width = e.clientX - this.beginClientX;
      var width = x - this.beginClientX;
      if (width < this.maxwidth) {
        if (document.getElementsByClassName("handler")[0]) {
          document.getElementsByClassName("handler")[0].style.left = 0 + "px";
        }
        if (document.getElementsByClassName("drag_bg")[0]) {
          document.getElementsByClassName("drag_bg")[0].style.width = 0 + "px";
        }
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
  }
};
</script>

<style scoped>
.drag {
  position: relative;
  background-color: #e8e8e8;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
}
.handler {
  width: 40px;
  height: 1rem;
  /* border: 1px solid #ccc; */
  cursor: move;
  color: #fff;
  background: #0866f6;
}

.drag_bg {
  /* background-color: #7ac23c; */
  background-color: #0866f6;
  height: 1rem;
  width: 0px;
}
.drag_text {
  font-size: 0.3rem;
  color: #999999;
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
</style>