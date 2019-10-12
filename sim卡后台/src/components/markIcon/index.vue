<template>
  <div class="mark-icon">
    <i
      @click="visible = true"
      :style="{color: this.defaultParams.oFlag === -1 ? '#909CF4' : '#d32222'}"
      class="iconfont icon-biaoji"
    ></i>
    <el-dialog
      :visible.sync="visible"
      width="400px"
      class="mark-dialog"
      v-if="defaultParams"
    >
      <textarea
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        placeholder="请填写备注"
        width="100%"
        rows="5"
        v-model="defaultParams.oRemark"
      ></textarea>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <!-- <el-button
          @click="updateOrderInfo(-1)"
          size="small"
          v-if="defaultParams.oFlag === 1"
        >取消标记</el-button> -->
        <el-button
          type="primary"
          @click="updateOrderInfo(1)"
          size="small"
        >标记</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    defaultParams: null
  },

  data() {
    return {
      visible: false
    };
  },

  methods: {
    updateOrderInfo(flag) {
      let params = {
        oFlag: flag, //	备注标识，0为默认未标识	number	备注标识
        oRemark: this.defaultParams.oRemark, //	备注标识	string	备注标识
        orderId: this.defaultParams.orderId //		number	订单ID
      };
      console.log(flag);
      this.$API.updateOrderInfo(params).then(res => {
        console.log(res);
        if (res.code === 0) {
          console.log({ orderId: params.orderId, oFlag: flag });
          this.$emit("updateMark", {
            oRemark: params.oRemark,
            orderId: params.orderId,
            oFlag: flag
          }); //废除订单时将orderId抛出
          this.visible = false;
          this.$msg({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mark-icon {
  i {
    cursor: pointer;
    font-size: 16px;
  }
  i:hover {
    color: #5160d4 !important;
  }
}

/deep/ .el-dialog {
  .el-dialog__header {
    border: none;
  }
  .el-dialog__body {
    padding: 20px;
  }
  .el-dialog__footer {
    padding: 0 80px 20px;
    .dialog-footer {
      display: flex;
      justify-content: center;
      .el-button {
        &:nth-child(2) {
          width: 80px;
          margin-left: auto;
        }
      }
    }
  }
}
</style>
