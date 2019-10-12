<template>
  <div>
    <el-dialog
      :visible.sync="visable"
      :title="defaultParams.orderStatus !== 4?'订单出库':'订单详情'"
      :width="width"
      v-if="defaultParams"
      @closed="paramsInit()"
    >
      <div class="orderDetail-item">
        <div>
          <span>客户代码</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.userCode"
            disabled
          >
        </div>
        <div>
          <span>订单号</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.orderNum"
            disabled
          >
        </div>
      </div>
      <div class="orderDetail-item">
        <div>
          <span>购买数量</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.counts"
            disabled
          >
        </div>
        <div>
          <span>套餐类型</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.serMeal"
            disabled
          >
        </div>
      </div>
      <div class="orderDetail-item">
        <div>
          <span>购买单价</span>
          <!-- 如用户状态为业务账号可以填写，否则判断订单状态 -->
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.orderPrice"
            :disabled="$store.state.LOGINUSER.userType === 2 ? true : defaultParams.orderStatus === 1"
          >
        </div>
        <div>
          <span>购买总价</span>
          <!-- 如用户状态为业务账号可以填写，否则判断订单状态 -->
          <input
            type="text"
            class="inputBg"
            :value="defaultParams.orderPrice * defaultParams.counts"
            disabled
          >
        </div>
      </div>
      <div class="orderDetail-item">
        <div
          style="display:flex;align-items:center"
          v-if="defaultParams.orderStatus !== 1"
        >
          <span>出库方式</span>
          <input
            ref="File"
            type="file"
            style="display: none;"
            @change="importSimExcel($event)"
          >
          <div
            class="importExcel inputBg"
            @click="$refs.File.click()"
          >
            <span>{{ outPutCardParams.file && outPutCardParams.file.name }}</span>
            <span>导入</span>
          </div>
        </div>
      </div>
      <div class="orderDetail-item">
        <div class="order-flex">
          <span>备注</span>
          <textarea
            class="inputBg"
            v-model="defaultParams.remark"
            placeholder="填写备注信息"
            disabled
          ></textarea>
        </div>
      </div>
      <div
        class="orderDetail-item"
        v-if="defaultParams.orderStatus !== 1"
      >
        <div class="order-flex">
          <el-button
            type="primary"
            size="small"
            @click="orderCard()"
          >
            出库
          </el-button>
          <el-button
            style="margin-left:60px"
            type="danger"
            size="small"
            @click="runOrderInfo()"
          >
            驳回
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    handleNodeClick(node) {
      this.outPutCardParams.batch = node.id;
    },
    runOrderInfo() {
      let params = {
        counts: "", //购买数量	string
        orderId: "", //订单ID	number
        orderPrice: "", //购买单价	string
        remark: "", //备注说明	string
        serMeal: "" //套餐类型	string
      };
      for (let key in params) {
        this.defaultParams[key] && (params[key] = this.defaultParams[key]);
      }

      this.$API.runOrderInfo(params).then(res => {
        if (res.code === 0) {
          this.visable = false;
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
    orderCard() {
      for (let key in this.outPutCardParams) {
        this.defaultParams[key] &&
          (this.outPutCardParams[key] = this.defaultParams[key]);
        key === "price" &&
          (this.outPutCardParams[key] = this.defaultParams["orderPrice"]);
        key === "aUserId" &&
          (this.outPutCardParams[key] = this.defaultParams["userId"]);
      }

      try {
        if (!this.outPutCardParams.price) throw "请填写单价！";
        if (!this.outPutCardParams.file) throw "请导入表格！";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }

      let params = new FormData();
      for (let key in this.outPutCardParams) {
        (key !== "startCard" || key !== "endCard" || key !== "batch") &&
          params.append(key, this.outPutCardParams[key]);
      }
      this.$API.orderCard(params).then(res => {
        if (res.data.code === 0) {
          this.visable = false;
          this.$emit("outPutCardChange", this.outPutCardParams.orderId);
          this.$msg({
            message: res.data.msg,
            type: "success"
          });
        } else {
          this.$msg({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    importSimExcel(e) {
      if (e.target.files.length === 0) {
        this.$msg({
          message: "请选择文件",
          type: "warning"
        });
        return;
      }
      this.outPutCardParams.file = e.target.files[0];
      this.$refs.File.value = "";
    },
    paramsInit() {
      this.outPutCardParams = {
        aUserId: "", //出库A级客户ID	number
        batch: "", //批次	string
        endCard: "", //结束卡号	string
        file: "", //上传excel文件	object
        orderId: "", //订单ID	number
        outType: 2, //出库类型	number	1:卡段出库，2:Excel文件
        price: "", //单价	number
        startCard: "" //开始卡号	string
      };
    }
  },

  props: {
    defaultParams: {
      type: Object
    },
    width: {
      type: String,
      default: "600px"
    }
  },

  data() {
    return {
      visable: false,
      outPutCardParams: {
        aUserId: "", //出库A级客户ID	number
        batch: "", //批次	string
        endCard: "", //结束卡号	string
        file: "", //上传excel文件	object
        orderId: "", //订单ID	number
        outType: 2, //出库类型	number	1:卡段出库，2:Excel文件
        price: "", //单价	number
        startCard: "" //开始卡号	string
      }
    };
  }
};
</script>


<style lang="scss" scoped>
@import "@/public/css/mixin.scss";
.orderDetail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  & /deep/ .el-select {
    .el-input__icon {
      line-height: 25px;
    }
    & .el-input__inner {
      width: 170px;
      height: 30px;

      @extend .inputBg;
    }
  }
  span {
    width: 66px;
    color: #58616c;
    font-size: 12px;
    display: inline-block;
  }
  .order-flex {
    display: flex;
    width: 100%;
    justify-content: center;
    span {
      margin-right: 5px;
      min-width: 66px;
    }
    textarea {
      width: 100%;
      height: 60px;
      padding: 10px;
    }
  }
  .inputBg {
    width: 160px;
  }
  &:not(:nth-child(1)) {
    margin-top: 30px;
  }
  .importExcel {
    display: inline-flex;
    width: 170px;
    padding: 0;
    background: none;
    margin-left: 4px;
    cursor: pointer;
    span {
      &:nth-child(1) {
        padding-left: 10px;
        flex: 1;
        line-height: 23px;
        border: 1px solid $btnColor;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:nth-child(2) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        background: $btnColor;
        color: #fff;
      }
    }
  }
}
</style>

