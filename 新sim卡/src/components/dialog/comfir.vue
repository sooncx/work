<template>
    <el-dialog
      :visible.sync="visible"
      width="300px"
    >
      <div class="removeCard">
        <div class="error-icon"><i class="iconfont icon-gantanhao"></i></div>
        <slot></slot>
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
    data(){
        return {
            visible: false
        }
    },

    props: {
        text: [String]
    }
}
</script>
<style lang="scss" scoped>
@import "@/public/css/base.scss";
.el-dialog__wrapper{
  .el-dialog__body {
    height: auto;
  }
  .removeCard {
    padding:0 30px;
  }
  .error-icon {
    margin-bottom:15px;
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
    span {
      color: $btnColor;
    }
  }
}

</style>

