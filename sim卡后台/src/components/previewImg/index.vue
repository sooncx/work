<template>
  <el-dialog
    :visible.sync="visible"
    width="700px"
  >
    <img :src="url">
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      url: "",
    };
  }
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ .el-dialog {
    border-radius: 0;
    box-shadow: none;
    .el-dialog__header {
      // display: none;
      padding: 0;
      border: 0;
      .el-dialog__headerbtn .el-dialog__close {
        font-size: 30px
      }
    }
    .el-dialog__body {
      padding: 0;
      img {
        width: 100%;
        vertical-align: bottom;
      }
    }
  }
}
</style>


