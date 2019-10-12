<!-- 基础加载地图  -->
<template>
  <div class="amap-wrap">
      <div class="amap" ref="amap"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map:null,
      timer: new Date().getTime(),
      callBackName: "",
    };
  },
  created() {
    if (window["AMap"]) {
      this.initMap();
    } else {
      this.callBackName = "loadAMapJScript" + this.timer;
      var self = this;
      window[this.callBackName] = function() {
        self.initMap();
      };
      this.loadJScript();
    }
  },
  methods: {
    initMap() { //初始化地图在js文件加载完成后执行
      this.map = new AMap.Map(this.$refs["amap"]);
      this.$emit("inited",this.map)
    },
    loadJScript() { //加载js
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://webapi.amap.com/maps?v=1.4.9&key=8ebe8b1bf92a362d7e8bc8a75c01be8f&callback=" +
        this.callBackName;
      document.body.appendChild(script);
    },
    destroy(){ //删除地图 避免内存泄露
      if(this.map){
        this.map.destroy();
        this.map=null
      }
    }
  },
  beforeDestory(){ //当前组件销毁前
      this.destroy();
  }
};
</script>

<style lang="less" >
.amap-wrap {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  .amap-marker-label{
        border: 1px solid #ccc!important;
  }
  .amap {
    height: 100%;
    width: 100%;
  }
}
</style>
