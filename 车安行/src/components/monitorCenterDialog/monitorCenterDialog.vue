<template>
  <div
    class="main"
    v-show="show"
  >
    <div class="content">
      <div class="headBar">
        <div class="title">车辆资料</div>
        <i
          class="el-icon-close"
          @click="hide"
        ></i>
      </div>
      <div class="dialog">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="主车车辆信息"
            name="first"
          >
            <div>
              <carInfo></carInfo>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="车辆年审信息"
            name="second"
          >
            <div>
              <annualInfo></annualInfo>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="挂车信息"
            name="third"
          >挂车信息</el-tab-pane>
          <el-tab-pane
            label="挂车年审信息"
            name="fourth"
          >挂车年审信息</el-tab-pane>
          <el-tab-pane
            label="车主信息"
            name="fifth"
          >车主信息</el-tab-pane>
          <el-tab-pane
            label="按揭信息"
            name="sixth"
          >
            <div>
              <mortgage></mortgage>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="设备信息"
            name="seventh"
          >
            <div>
              <diviceInfo></diviceInfo>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="btnBox">
        <span class="print">打印</span>
        <span class="save">保存</span>
      </div>
    </div>

  </div>
</template>


<script>
import diviceInfo from "./deviceInfo";
import annualInfo from "./annualInfo";
import carInfo from "./carInfo";
import mortgage from "./mortgageInfo";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: "second"
    };
  },
  mounted() {},

  methods: {
    hide() {
      this.$emit("hide");
    }
  },

  components: {
    diviceInfo,
    annualInfo,
    carInfo,
    mortgage
  },
  created() {}
};
</script>

<style lang="less" scoped>
/deep/ .el-tabs__item {
  padding-left: 15px !important;
}
// /deep/ .el-tabs__active-bar {
//   left: 11px !important;
// }
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
}
.content {
  width: 988px;
  height: 735px;
  background: rgba(255, 255, 255, 1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .headBar {
    width: 100%;
    height: 42px;
    background: rgba(246, 246, 246, 1);
    .title {
      position: fixed;
      left: 10px;
      top: 10px;
      font-size: 16px;
      font-weight: bold;
    }
    i {
      position: fixed;
      right: 10px;
      top: 14px;
      cursor: pointer;
    }
  }
  .print,
  .save {
    width: 84px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .print {
    position: fixed;
    bottom: 10px;
    right: 120px;
    color: #666666;
    background: rgba(242, 242, 242, 1);
    border: 1px solid rgba(228, 228, 228, 1);
  }
  .save {
    position: fixed;
    bottom: 10px;
    right: 20px;
    background: rgba(2, 80, 193, 1);
    color: #ffffff;
  }
}

.dialog {
  margin: 0 11px;
}
</style>

