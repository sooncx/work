<template>
  <div>
    <!-- v-if="defaultParams" -->
    <!-- @open="handlerOperating()" -->
    <el-dialog
      :visible.sync="visable"
      :width="width"
      @closed="paramsInit()"
      v-if="defaultParams"
    >
      <div slot="title">
        {{defaultParams.orderStatus === 4?'订单出库':'订单详情'}}
        <orderType
          v-if="defaultParams.sellType"
          :sellType="defaultParams.sellType"
        ></orderType>
        <orderType
          v-if="defaultParams.orderType"
          :orderType="defaultParams.orderType"
        ></orderType>
      </div>
      <div class="orderDetail-wrap">
        <div class="orderDetail-item">
          <span>客户代码</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.userCode"
            disabled
          >
        </div>
        <div class="orderDetail-item">
          <span>订单号</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.orderNum"
            disabled
          >
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.counts.isShow"
        >
          <span>购买数量</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.counts"
            disabled
          >
        </div>
        <div>
          <span>套餐规格</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.serMeal"
            disabled
          >
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.changeType.isShow"
        >
          <span>订购套餐</span>
          <!-- v-model="defaultParams.changetType" -->
          <input
            type="text"
            class="inputBg"
            disabled
          >
        </div>
        <div class="orderDetail-item">
          <span>购买单价</span>
          <input
            type="text"
            class="inputBg"
            v-model="defaultParams.orderPrice"
            :disabled="isOperating.orderPrice.disabled"
          >
        </div>
        <div class="orderDetail-item">
          <span>购买总价</span>
          <input
            type="text"
            class="inputBg"
            :value="getTotalPrice()"
            disabled
          >
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.exYears.isShow"
        >
          <span>购卡年限</span>
          <input
            type="text"
            class="inputBg"
            :value="`${defaultParams.exYears}年`"
            disabled
          >
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.sellStatus.isShow"
        >
          <span>付款状态</span>
          <input
            type="text"
            class="inputBg"
            :style="{'width':defaultParams.iconStream?'94px':'160px'}"
            :value="defaultParams.sellStatus === 1 ? '已付款' : '未付款'"
            disabled
          >
          <el-button
            type="info"
            size="small"
            style="border:none;margin:0 0 0 10px;background:#F3F7FB!important;color:#2878DA!important"
            @click="showPreview()"
            v-if="defaultParams.iconStream && defaultParams.sellStatus === 1"
          >查看</el-button>
        </div>
        <!-- <div
          class="orderDetail-item"
          v-if="isOperating.ifInstall.isShow"
        >
          <span>是否装机</span>
          <input
            type="text"
            class="inputBg"
            :value="defaultParams.ifInstall === 1 ? '是' : '否'"
            disabled
          >
        </div> -->
        <div
          class="orderDetail-item"
          v-if="isOperating.sellType.isShow"
        >
          <span>订单类型</span>
          <input
            type="text"
            class="inputBg"
            :value="sellTypeOption[defaultParams.sellType - 1]"
            disabled
          >
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.exportOrderSimCard.isShow"
        >
          <div>
            <span>出库卡号</span>
            <el-button
              size="small"
              style="padding: 9px 20px;"
              @click="exportOrderSimCard()"
            >导出</el-button>
          </div>
        </div>
        <div
          class="orderDetail-item special"
          v-if="isOperating.outType.isShow"
        >
          <div style="display:flex;align-items:center">
            <span>出库方式</span>
            <el-radio
              v-model="outPutCardParams.outType"
              :label="1"
            >号段出库</el-radio>
            <el-radio
              v-model="outPutCardParams.outType"
              :label="2"
            >表格出库</el-radio>
            <br>
          </div>
        </div>
        <div
          class="orderDetail-item special"
          v-if="isOperating.outType.isShow"
        >
          <div class="import-wrap">
            <div v-if="outPutCardParams.outType === 1">
              <div
                class="input-item"
                v-for="(item,index) in outPutCardList"
                :key="index"
              >
                <input v-model="item.startCard">
                <span class="split-line"></span>
                <input v-model="item.endCard">
                <div
                  v-if="index === 0"
                  style="display:flex;flex-direction:column"
                >
                  <my-badge
                    text="增加卡段"
                    :type="isAddCardSegment?'':'disabled'"
                    @click="addCardSegment()"
                  ></my-badge>
                  <my-badge
                    @click="isAddScatterCard = !isAddScatterCard"
                    text="追加散卡"
                    :type="isAddScatterCard?'':'disabled'"
                  ></my-badge>
                </div>
                <i
                  v-if="index !== 0"
                  class="iconfont icon-jianshao"
                  @click="reduceCardSegment()"
                ></i>
              </div>
              <div
                class="input-item"
                v-show="!isAddScatterCard"
              >
                <textarea
                  v-model="outPutCardParams.appendNum"
                  placeholder="多个追加单卡用回车键隔开"
                  rows="4"
                ></textarea>
              </div>
            </div>
            <div v-if="outPutCardParams.outType === 2">
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
        </div>
        <div
          class="orderDetail-item special"
          style="align-items:baseline"
        >
          <span>备注</span>
          <textarea
            class="inputBg"
            v-model="defaultParams.remark"
            placeholder="填写备注信息"
            :disabled="isOperating.remark.disabled"
          ></textarea>
        </div>
        <div
          class="orderDetail-item special"
          style="justify-content: center;"
          v-if="defaultParams.orderStatus === 4"
        >
          <div v-if="defaultParams.orderType === 4">
            <el-button
              type="primary"
              size="small"
              @click="getSimMealChange()"
            >
              确认订单
            </el-button>
          </div>
          <div v-else>
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
              @click="$refs.ComfirDialog.visible = true;"
            >
              驳回
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <comfir-dialog
      ref="ComfirDialog"
      text="是否确认驳回！"
      @comfir="runOrderInfo()"
    ></comfir-dialog>
    <previewImg ref="previewImg"></previewImg>
  </div>
</template>

<script>
import myBadge from "@/components/myBadge/";
import comfirDialog from "@/components/dialog/comfir";
import previewImg from "@/components/previewImg/";
import orderType from "@/components/orderType/";
import { exportFile } from "@/util/common";
export default {
  methods: {
    getSimMealChange() {
      const orderId = this.defaultParams.orderId;
      this.$API.getSimMealChange({orderId}).then(res => {
        if (res.code === 0) {
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
      })
    },
    getTotalPrice() {
      const orderType = this.defaultParams.orderType;
      const defaultPrice =
        this.defaultParams.orderPrice * this.defaultParams.counts;
      if (orderType === 1) {
        return (defaultPrice * this.defaultParams.exYears).toFixed(2);
      } else {
        return defaultPrice.toFixed(2);
      }
    },
    handlerOperating() {
      const orderStatus = this.defaultParams.orderStatus;
      const orderType = this.defaultParams.orderType; //this.defaultParams.orderType;

      switch (orderType) {
        case 1:
          this.isOperating = {
            counts: {
              disabled: false,
              isShow: true
            },
            serMeal: {
              disabled: false,
              isShow: true
            },
            orderPrice: {
              disabled: orderStatus === 1 ? true : false,
              isShow: true
            },
            sellStatus: {
              disabled: false,
              isShow: true
            },
            ifInstall: {
              disabled: false,
              isShow: true
            },
            sellType: {
              disabled: false,
              isShow: true
            },
            remark: {
              disabled: orderStatus === 1 ? true : false,
              isShow: true
            },
            exYears: {
              disabled: true,
              isShow: true
            },
            exportOrderSimCard: {
              disabled: false,
              isShow: orderStatus === 1 ? true : false
            },
            outType: {
              disabled: false,
              isShow: orderStatus === 4 ? true : false
            },
            changeType: {
              disabled: false,
              isShow: false
            }
          };
          break;
        case 4:
          this.isOperating = {
            counts: {
              disabled: true,
              isShow: true
            },
            serMeal: {
              disabled: false,
              isShow: false
            },
            orderPrice: {
              disabled: orderStatus === 1 ? true : false,
              isShow: true
            },
            sellStatus: {
              disabled: false,
              isShow: false
            },
            ifInstall: {
              disabled: false,
              isShow: false
            },
            sellType: {
              disabled: false,
              isShow: false
            },
            remark: {
              disabled: orderStatus === 1 ? true : false,
              isShow: true
            },
            exYears: {
              disabled: false,
              isShow: false
            },
            exportOrderSimCard: {
              disabled: false,
              isShow: orderStatus === 1 ? true : false
            },
            outType: {
              disabled: false,
              isShow: false
            },
            changeType: {
              disabled: false,
              isShow: true
            }
          };
          break;
        default:
          this.isOperating = {
            counts: {
              disabled: true,
              isShow: true
            },
            serMeal: {
              disabled: false,
              isShow: false
            },
            orderPrice: {
              disabled: orderStatus === 1 ? true : false,
              isShow: true
            },
            sellStatus: {
              disabled: false,
              isShow: false
            },
            ifInstall: {
              disabled: false,
              isShow: false
            },
            sellType: {
              disabled: false,
              isShow: false
            },
            remark: {
              disabled: orderStatus === 1 ? true : false,
              isShow: true
            },
            exportOrderSimCard: {
              disabled: false,
              isShow: orderStatus === 1 ? true : false
            },
            outType: {
              disabled: false,
              isShow: false
            },
            changeType: {
              disabled: false,
              isShow: false
            }
          };
          break;
      }
    },
    exportOrderSimCard() {
      const json =
        "exportExcel/exportOrderSimCard.json";
      let params = {
        aUserId: this.defaultParams.userId,
        orderId: this.defaultParams.orderId,
        sessionId: this.$store.state.LOGINUSER.sId
      };
      exportFile(json, params);
    },
    showPreview() {
      this.$refs.previewImg.url =
        "data:image;png;base64," + this.defaultParams.iconStream;
      this.$refs.previewImg.visible = true;
    },
    addCardSegment() {
      if (this.outPutCardList.length === 3) return;
      this.outPutCardList.push({ startCard: "", endCard: "" });
      this.outPutCardList.length === 3 && (this.isAddCardSegment = false);
    },
    reduceCardSegment() {
      if (!this.outPutCardList.length) return;
      this.outPutCardList.pop();
      this.isAddCardSegment = true;
    },
    runOrderInfo() {
      let params = {
        counts: "", //购买数量	string
        orderId: "", //订单ID	number
        orderPrice: "", //购买单价	string
        remark: "", //备注说明	string
        serMeal: "" //套餐规格	string
      };
      for (let key in params) {
        this.defaultParams[key] && (params[key] = this.defaultParams[key]);
      }
      let formData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }

      this.$API.runOrderInfo(formData).then(res => {
        if (res.data.code === 0) {
          this.$refs.ComfirDialog.visible = false;
          this.visable = false;
          this.$msg({
            message: "处理成功！",
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
    orderCard() {
      let params = Object.assign({}, this.outPutCardParams);
      for (let key in params) {
        this.defaultParams[key] && (params[key] = this.defaultParams[key]);
        key === "price" && (params[key] = this.defaultParams["orderPrice"]);
        key === "aUserId" && (params[key] = this.defaultParams["userId"]);
      }

      try {
        if (!params.price) throw "请填写单价！";
        let reg = /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/;
        if (!reg.test(params.price)) throw "单价请输入数字！";
        if (params.outType === 1) {
          delete params.file; //删除不必要的参数
          //处理卡段号
          let arr = new Array();
          this.outPutCardList.map(item => {
            if (!item.startCard) throw "请输入开始卡段！";
            if (!item.endCard) throw "请输入结束卡段！";
            arr.push(`${item.startCard}-${item.endCard}`);
          });
          params.phase = arr.join("|"); //多个卡段用竖线分隔，结构(xxxx-xxxx|xxxx-xxxx)
          //处理散卡号
          if (!params.appendNum && !this.isAddScatterCard)
            throw "请输入散卡号！";
          params.appendNum = params.appendNum.split("\n").join(",");
        } else {
          delete params.phase;
          delete params.appendNum;
          if (!params.file) throw "请导入表格！";
        }
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }
      params.pushTime = new Date().getTime();

      let formData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }

      this.visable = false;
      this.$emit("outPutCardChange", {
        orderId: this.defaultParams.orderId,
        status: 1
      });
      this.$API.orderCard(formData).then(res => {
        if (res.data.code === 0) {
          this.getUploadStatus(params.pushTime);
        } else {
          this.$emit("outPutCardChange", {
            orderId: this.defaultParams.orderId,
            status: 2
          });
          this.$msg({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getUploadStatus(time) {
      let timer = setInterval(() => {
        this.$API
          .getUploadStatus({ time })
          .then(res => {
            if (res.code !== 0) {
              clearInterval(timer);
              this.$emit("outPutCardChange", {
                orderId: this.defaultParams.orderId,
                status: 2
              });
              this.$msg({
                message: res.data.msg,
                type: "error"
              });
              return;
            }
            if (JSON.stringify(res.data) === "{}") return;
            clearInterval(timer);
            if (res.data.status === 0) {
              this.$emit("outPutCardChange", {
                orderId: this.defaultParams.orderId,
                status: 3
              });
              this.$msg({
                message: res.data.msg,
                type: "success"
              });
            } else {
              this.$emit("outPutCardChange", {
                orderId: this.defaultParams.orderId,
                status: 2
              });
              this.$msg({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            clearInterval(timer);
          });
      }, 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    importSimExcel(e) {
      if (e.target.files.length === 0) {
        this.$msg({
          message: "请选择文件！",
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
        file: "", //上传excel文件	object
        orderId: "", //订单ID	number
        outType: 1, //出库类型	number	1:卡段出库，2:Excel文件
        price: "", //单价	number
        phase: "", //卡段
        appendNum: "" //散卡
      };

      this.outPutCardList = [{ startCard: "", endCard: "" }];
      this.isAddCardSegment = true;
      this.isAddScatterCard = true;

      this.$refs.previewImg.url = "";
    }
  },

  watch: {
    "defaultParams.orderPrice"(val) {
      this.defaultParams.orderPrice = val.replace(/[^.0-9]+/g, "");
    },
    defaultParams(val) {
      this.handlerOperating()
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
        file: "", //上传excel文件	object
        orderId: "", //订单ID	number
        outType: 1, //出库类型	number	1:卡段出库，2:Excel文件
        price: "", //单价	number
        phase: "", //卡段
        appendNum: "" //散卡
      },
      outPutCardList: [{ startCard: "", endCard: "" }],
      isAddCardSegment: true,
      isAddScatterCard: true,
      sellTypeOption: ["销售", "赠送", "换卡"],
      isOperating: {
        counts: {
          disabled: false,
          isShow: true
        },
        serMeal: {
          disabled: false,
          isShow: true
        },
        orderPrice: {
          disabled: false,
          isShow: true
        },
        sellStatus: {
          disabled: false,
          isShow: true
        },
        ifInstall: {
          disabled: false,
          isShow: true
        },
        sellType: {
          disabled: false,
          isShow: true
        },
        remark: {
          disabled: false,
          isShow: true
        },
        exYears: {
          disabled: false,
          isShow: true
        },
        exportOrderSimCard: {
          disabled: false,
          isShow: true
        },
        outType: {
          disabled: false,
          isShow: true
        },
        changeType: {
          disabled: false,
          isShow: true
        }
      }
    };
  },

  components: {
    myBadge,
    comfirDialog,
    previewImg,
    orderType
  }
};
</script>


<style lang="scss" scoped>
@import "@/public/css/mixin.scss";
.orderDetail-wrap {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.orderDetail-item.special {
  width: 100%;
  textarea {
    flex: 1;
    height: 60px;
    padding: 10px;
    color: #828588;
  }
}
.orderDetail-item {
  display: inline-flex;
  align-items: center;
  color: #828588;
  width: 250px;
  margin-top: 30px;
  &:nth-child(1) {
    margin: 0;
  }
  &:nth-child(2) {
    margin: 0;
  }
  .inputBg {
    width: 160px;
    color: #828588;
  }
  span {
    width: 66px;
    font-size: 12px;
    display: inline-block;
  }
  .import-wrap {
    display: flex;
    & > div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .input-item {
      width: 100%;
      input {
        width: 160px;
        padding: 0 0 0 10px;
      }
      .icon-jianshao {
        color: #d74c4c;
        font-size: 20px;
        margin-left: 10px;
        cursor: pointer;
      }
      &:nth-child(n) {
        margin-left: 66px;
      }
    }
  }
  .importExcel {
    display: inline-flex;
    width: 170px;
    padding: 0;
    background: none;
    margin-left: 66px;
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

