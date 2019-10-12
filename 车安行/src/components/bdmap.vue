<!-- 基础加载地图  -->
<template>
  <div class="bdmap-wrap">
      <div class="bdmap" ref="bdmap"></div>
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
    if (window["BMap"]) {
      this.initMap();
    } else {
      this.callBackName = "loadBdMapJScript" + this.timer;
      var self = this;
      window[this.callBackName] = function() {
        self.initMap();
      };
      this.loadJScript();
    }
  },
  methods: {
    initMap() {
      this.map = new BMap.Map(this.$refs["bdmap"]);
      var point = new BMap.Point(116.404, 39.915); // 创建点坐标
      this.map.centerAndZoom(point, 15);
      this.map.enableScrollWheelZoom();
      this.$emit("inited",this.map)
    },
    loadJScript() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "http://api.map.baidu.com/api?v=2.0&ak=USuGv25IMVIO5MM7K0LWf83KUiAeOYv5&callback=" +
        this.callBackName;
      document.body.appendChild(script);
    },
    destroy(){ //删除地图 避免内存泄露
      if(this.map){
        this.map.destroy();
        this.map=null
      }
    },
    addCarMark(){ //添加车辆标识
    },
  },
  beforeDestory(){ //当前组件销毁前
      this.destroy();
  }
};
</script>
<style lang="less" scoped>
.bdmap-wrap {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  .bdmap {
    height: 100%;
    width: 100%;
  }
}
</style>
