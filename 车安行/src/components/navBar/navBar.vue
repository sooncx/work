<template>
  <div id="app">
    <transition name="draw">
      <div :class="['box',navShow?'hide':'show']">
        <div class="listBox">
          <ul
            v-for="(item,index) in navList"
            :key="index"
            class="uul"
          >
            <i class="el-icon-edit-outline"></i>
            <li :class="['lli',navShow?'txtHide':'txtShow']">{{item.name}}</li>
          </ul>

        </div>
        <div class="btn1">
          <i
            :class="navShow?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
            @click="toggle"
          ></i>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navShow: false,
      navList: [
        { url: "", name: "首页" },
        { url: "", name: "监控中心" },
        { url: "", name: "轨迹回放" },
        { url: "", name: "数据报表" },
        { url: "", name: "车辆管理" },
        { url: "", name: "风控评估" },
        { url: "", name: "年审汇总" },
        { url: "", name: "我的积分" }
      ]
    };
  },
  methods: {
    toggle() {
      this.navShow = !this.navShow;
      this.$emit("toggle", this.navShow);
    }
  },
  mounted() {},
  components: {}
};
</script>

<style lang="less" scoped>
#app {
  height: 100%;
}
.box {
  height: 100%;
  width: 200px;
  background-color: #3f4143;
  transition: 0.5s;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
}
.hide {
  width: 65px;
}
.show {
  width: 200px;
}
.listBox {
  padding-top: 100px;
  border-bottom: 1px solid black;
  height: 95%;
}
.uul > i {
  padding: 15px 20px;
}
.lli {
  position: absolute;
  margin-top: 10px;
  width: 100px;
  overflow: hidden;
  display: inline-block;
}
.txtHide {
  opacity: 0;
  transition: 0.3s;
}
.txtShow {
  opacity: 1;
  transition: 0.3s;
}
.btn1 {
  display: flex;
  padding-left: 25px;
  align-items: center;
  width: 100%;
  height: 5%;
  cursor: pointer;
}
</style>