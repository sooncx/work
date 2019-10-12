<template>
  <el-dialog
    title="退卡入库"
    :visible.sync="visible"
    width="40%"
    @open="initParams()"
  >
    <textarea
      v-model="backCardParams.cardNo"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      placeholder='请粘贴ICCID,数据用“回车”隔开'
      width="100%"
      rows="20"
    ></textarea>
    <div
      class="input-item"
      style="margin-top:20px;justify-content:center"
    >
      <el-button
        type="primary"
        @click="backCard()"
        size="small"
      >入库</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      backCardParams: {
        userId: null,
        orderId: null,
        cardNo: "" //卡号	string
      },
      defaultParams: null
    };
  },

  methods: {
    backCard() {
      this.backCardParams.cardNo = this.backCardParams.cardNo
        .split(/[\n\s+,]/g)
        .join(",");

      if (!this.backCardParams.cardNo) {
        this.$msg({
          message: "请填写退卡入库卡号！",
          type: "warning"
        });
        return;
      }
      this.$API.backCard(this.backCardParams).then(res => {
        if (res.code === 0) {
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
    initParams() {
      this.backCardParams = {
        cardNo: "", //卡号	string
        userId: this.defaultParams.userId,
        orderId: this.defaultParams.orderId,
        orderNum: this.defaultParams.orderNum
      };
    }
  }
};
</script>

<style lang="scss">
</style>
