<template>
  <el-dialog
    :title="type === 1 ? '物流信息' : '废除订单'"
    :visible.sync="visible"
    width="600px"
    @open="paramsInit()"
    class="logistics"
  >
    <textarea
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      width="100%"
      rows="10"
      v-model="remark"
    ></textarea>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="updateOrderInfo()"
        size="small"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  methods: {
    updateOrderInfo() {
      let params = Object.assign({}, this.updateOrderInfoParams);
      if (!this.remark) {
        this.$msg({
          message: "请填写备注！",
          type: "warning"
        });
        return;
      }

      if(this.type === 1) {
        params.wRemark = this.remark;
      }else{
        params.dRemark = this.remark;
      }
      
      this.remark = "";
      this.$API.updateOrderInfo(params).then(res => {
        if (res.code === 0) {
          params.status === "" && this.$emit("updateLogistics", {orderId:params.orderId, wRemark: params.wRemark}); //废除订单时将orderId抛出
          params.status === 3 && this.$emit("deleteOffice", params.orderId); //废除订单时将orderId抛出
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
    },
    paramsInit() {
      this.updateOrderInfoParams = {
        orderId: this.defaultParams.orderId, //number	订单ID
        status: this.type === 1 ? "" : 3 //status=3(为空时是更新物流信息)		废除订单
      };

      this.remark =
        this.type === 1
          ? this.defaultParams.wRemark
          : this.defaultParams.dRemark;
    }
  },

  data() {
    return {
      visible: false,
      updateOrderInfoParams: {
        orderId: "", //number	订单ID
        status: "" //status=3(为空时是更新物流信息)		废除订单
      },
      remark: "",
      defaultParams: null
    };
  },

  props: {
    type: [Number] //type 为1时为物流，2时为废除订单
  }
};
</script>

<style lang="scss" scoped>
.logistics {
  /deep/ .el-dialog__footer {
    padding: 0 20px 20px;
  }
}
</style>


