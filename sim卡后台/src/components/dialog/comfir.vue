<template>
  <el-dialog
    :visible.sync="visible"
    width="300px"
  >
    <div>
      <div class="error-icon"><i class="iconfont icon-gantanhao"></i></div>
      <p
        class="comfir-msg"
        v-html="text"
        v-if="text"
      ></p>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="$emit('comfir')"
        size="small"
        round
      >确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false
    };
  },

  props: {
    text: [String]
  }
};
</script>
<style lang="scss" scoped>
@import "@/public/css/base.scss";
.el-dialog__wrapper {
  /deep/ .el-dialog__header {
    border: none;
  }
  /deep/ .el-dialog__body {
    height: auto;
    padding-bottom: 0;
  }
  /deep/ .el-dialog__footer{
    padding: 10px 20px 20px;
  }
  .error-icon {
    text-align: center;
    i {
      font-size: 60px;
      color: #dd5e5e;
      margin: 0 auto;
    }
  }
  .comfir-msg {
    color: #5e6571;
    margin: 20px 0;
    text-align: center;
    span {
      color: $btnColor;
    }
  }
}
</style>

