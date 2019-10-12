<template>
  <div>
    <!-- v-if="orderParams" -->
    <!-- @open="handlerOperating()" -->
    <el-dialog
      :visible.sync="visible"
      :width="width"
      v-if="orderParams"
    >
      <div slot="title">
        {{orderParams.orderStatus === 4?'订单出库':'订单详情'}}
        <orderType
          v-if="orderParams.sellType"
          :sellType="orderParams.sellType"
        ></orderType>
        <orderType
          v-if="orderParams.orderType"
          :orderType="orderParams.orderType"
        ></orderType>
      </div>
      <div class="orderDetail-wrap">
        <div class="orderDetail-item">
          <span>客户代码</span>
          <input
            type="text"
            class="inputBg"
            v-model="orderParams.userCode"
            :disabled="isOperating.userCode.disabled"
          >
        </div>
        <div class="orderDetail-item">
          <span>订单号</span>
          <input
            type="text"
            class="inputBg"
            v-model="orderParams.orderNum"
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
            v-model="orderParams.counts"
            :disabled="isOperating.counts.disabled"
          >
        </div>
        <div class="orderDetail-item" v-if="isOperating.serMeal.isShow">
          <span>套餐规格</span>
          <input
            type="text"
            class="inputBg"
            v-model="orderParams.serMeal"
            disabled
          >
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.changeType.isShow"
        >
          <span>订购套餐</span>
          <input
            v-model="orderParams.changeType"
            type="text"
            class="inputBg"
          >
        </div>
        <div class="orderDetail-item">
          <span>{{ orderParams.orderType === 3 ? '续费价格' : '购买单价' }}</span>
          <input
            type="text"
            class="inputBg"
            v-model="orderParams.orderPrice"
            :disabled="isOperating.orderPrice.disabled"
          >
        </div>
        <div class="orderDetail-item" v-if="isOperating.totalPrice.isShow">
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
            v-model="orderParams.exYears"
            style="width: 140px;margin-right: 8px;"
            :disabled="isOperating.exYears.disabled"
          >
          年
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.sellStatus.isShow"
        >
          <span>付款状态</span>
          <el-select
            v-model="orderParams.sellStatus"
            placeholder="请选择付款状态"
            size="small"
            :style="{'width':orderParams.iconStream?'104px':'170px'}"
            :disabled="isOperating.sellStatus.disabled"
          >
            <el-option
              v-for="(item, index) in sellStatusOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
            type="info"
            size="small"
            style="border:none;margin:0 0 0 10px;background:#F3F7FB!important;color:#2878DA!important"
            @click="showPreview()"
            v-if="orderParams.iconStream && orderParams.sellStatus === 1"
          >查看</el-button>
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.prodCode.isShow"
        >
          <span>选择套餐</span>
          <el-select
            v-model="getSimMealChangeParams.prodCode"
            placeholder="请选择套餐规格"
            size="small"
          >
            <el-option
              v-for="item in prodCodeConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- <div
          class="orderDetail-item"
          v-if="isOperating.ifInstall.isShow"
        >
          <span>是否装机</span>
          <el-select
            v-model="orderParams.ifInstall"
            placeholder="请选择是否装机"
            size="small"
          >
            <el-option
              v-for="item in ifInstallOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div> -->
        <div
          class="orderDetail-item"
          v-if="isOperating.assistantName.isShow"
        >
          <span>业务助理</span>
          <input
            type="text"
            class="inputBg"
            v-model="orderParams.assistantName"
          >
        </div>
        <div
          class="orderDetail-item"
          v-if="isOperating.sellType.isShow"
        >
          <span>订单类型</span>
          <el-select
            v-model="orderParams.sellType"
            placeholder="请选择订单类型"
            size="small"
          >
            <el-option
              v-for="(item, index) in sellTypeOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
          v-if="isOperating.address.isShow"
        >
          <span>收货地址</span>
          <input
            type="text"
            class="inputBg"
            v-model="orderParams.address"
            placeholder="1.姓名2.电话3.收货人地址"
          >
        </div>

        <div
          class="orderDetail-item special"
          style="align-items:baseline"
        >
          <span>备注</span>
          <textarea
            class="inputBg"
            v-model="orderParams.remark"
            placeholder="填写备注信息"
          ></textarea>
        </div>
        <div
          class="orderDetail-item special"
          style="justify-content: center;"
          v-if="orderParams.orderStatus === 4"
        >
          <div v-if="orderParams.orderType === 3">
            <el-button
              type="primary"
              size="small"
              @click="renewOrder()"
            >
              确认续费
            </el-button>
          </div>
          <div v-if="orderParams.orderType === 4">
            <el-button
              type="primary"
              size="small"
              @click="getSimMealChange()"
            >
              确认订单
            </el-button>
          </div>
          <div v-if="orderParams.orderType !== 3 && orderParams.orderType !== 4">
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
        <div
          class="orderDetail-item special"
          style="justify-content: center;"
          v-if="orderParams.orderStatus === 1"
        >
          <el-button
            type="primary"
            size="small"
            @click="updateFinishOrder()"
          >
            确认修改
          </el-button>
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
import comfirDialog from "@/components/comfir/";
import previewImg from "@/components/previewImg/";
import orderType from "@/components/orderType/";
import { exportFile } from "@/util/common";
import prodCodeConfig from "./prodCodeConfig";
import { isOperating, handlerOperating } from "./handlerOperating";
export default {
  methods: {
    //续费
    renewOrder() {
      let {exYears, orderId, userCode} = this.orderParams;
      this.$API.renewOrder({exYears, orderId, userCode}).then(res => {
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
    //已完成订单修改
    updateFinishOrder() {
      let paramsConfig = {
        address: "", //	地址	string
        assistantName: "", //	业务操作人员姓名	string
        counts: "", //	购买数量	string
        exYears: "", //	购买年限	number
        ifInstall: "", //	是否装机 是否装机 1:是 2:否	number
        orderPrice: "", //	购买单价	string
        orderType: "", //	订单类型订单类型 1:卡订单 2:叠加包 3:批量续费 4:套餐升级	number
        remark: "", //	订单备注	string
        sellStatus: "", //	付款状态1:已付款 2:未付款	number
        sellType: "", //	出售类型出售类型 1:销售 2:赠送 3:换卡 4:领用	number
        serMeal: "", //	套餐规格	string
      };
      let params = {
        userId: this.defaultParams.userId,
        orderStatus: this.defaultParams.orderStatus,
        orderId:  this.defaultParams.orderId, //	订单号	number
        userCode: this.defaultParams.userCode, //	客户代码	string
      };
      Object.entries(paramsConfig).map(([key, val]) => {
        if(this.orderParams[key] === null || this.orderParams[key] === undefined) return;
        this.defaultParams[key] != this.orderParams[key] &&(params[key] = this.orderParams[key])
      });
      if(Object.keys(params).length === 4) {
        this.$msg({
          message: '无修改信息！',
          type: "warning"
        });
        return;
      }
      
      this.$API.updateFinishOrder(params).then(res => {
        if (res.code === 0) {
          this.visible = false;
          console.log(this.visible);
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
    getSimMealChangeParamsInit() {
      const orderId = this.orderParams.orderId;
      const serMeal = this.orderParams.serMeal;
      const map = {
        "100M": 111,
        "30M": 116,
        "2M": 123
      };

      this.getSimMealChangeParams = {
        orderId,
        prodCode: map[serMeal],
        changePrice: ""
      };
    },
    getSimMealChange() {
      const prodCode = this.getSimMealChangeParams.prodCode;

      this.prodCodeConfig.map(item => {
        if (item.value === prodCode) {
          this.getSimMealChangeParams.changePrice = item.label
            .split("元")
            .join("");
        }
      });

      this.$API.getSimMealChange(this.getSimMealChangeParams).then(res => {
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
    getTotalPrice() {
      const orderType = this.orderParams.orderType;
      const defaultPrice =
        this.orderParams.orderPrice * this.orderParams.counts;
      if (orderType === 1) {
        return (defaultPrice * this.orderParams.exYears).toFixed(2);
      } else {
        return defaultPrice.toFixed(2);
      }
    },
    exportOrderSimCard() {
      const json = "exportExcel/exportOrderSimCard.json";
      let params = {
        aUserId: this.orderParams.userId,
        orderId: this.orderParams.orderId,
        sessionId: this.$store.state.LOGINUSER.sId
      };
      exportFile(json, params);
    },
    showPreview() {
      this.$refs.previewImg.url =
        "data:image;png;base64," + this.orderParams.iconStream;
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
        address: "", //	地址	string
        assistantName: "", //	业务操作人员姓名	string
        counts: "", //	购买数量	string
        exYears: "", //	购买年限	number
        ifInstall: "", //	是否装机 是否装机 1:是 2:否	number
        orderId: "", //	订单号	number
        orderPrice: "", //	购买单价	string
        orderType: "", //	订单类型订单类型 1:卡订单 2:叠加包 3:批量续费 4:套餐升级	number
        remark: "", //	订单备注	string
        sellStatus: "", //	付款状态1:已付款 2:未付款	number
        sellType: "", //	出售类型出售类型 1:销售 2:赠送 3:换卡 4:领用	number
        serMeal: "", //	套餐规格	string
        userCode: "" //	客户代码	string
      };
      Object.entries(params).map(([key, val]) => {
        this.defaultParams[key] && (params[key] = this.defaultParams[key]);
      });

      try {
        if (!params.orderPrice) throw "请填写单价！";
        let reg = /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/;
        if (!reg.test(params.orderPrice)) throw "单价请输入数字！";
        if (!reg.test(params.exYears)) throw "年限请输入数字！";
        if (!reg.test(params.counts)) throw "数字请输入数字！";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }

      let formData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }

      this.$API.runOrderInfo(formData).then(res => {
        if (res.data.code === 0) {
          this.$refs.ComfirDialog.visible = false;
          this.visible = false;
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
      let commonParams = {
        address: "", //	地址	string
        assistantName: "", //	业务操作人员姓名	string
        counts: "", //	购买数量	string
        counts: "", //	数量	string
        exYears: "", //	购买年限	number
        ifInstall: "", //	是否装机 是否装机 1:是 2:否	number
        orderId: "", //	订单号	number
        orderPrice: "", //	购买单价	string
        orderType: "", //	订单类型订单类型 1:卡订单 2:叠加包 3:批量续费 4:套餐升级	number
        remark: "", //	订单备注	string
        sellStatus: "", //	付款状态1:已付款 2:未付款	number
        sellType: "", //	出售类型出售类型 1:销售 2:赠送 3:换卡 4:领用	number
        serMeal: "", //	套餐规格	string
        userCode: "" //	客户代码	string
      };
      this.outPutCardParams.appendNum = this.outPutCardParams.appendNum
        .split(/[\n\s+,]/g)
        .join(",");
      let params = Object.assign({}, this.outPutCardParams, commonParams);
      for (let key in params) {
        this.orderParams[key] && (params[key] = this.orderParams[key]);
        key === "price" && (params[key] = this.orderParams["orderPrice"]);
        key === "aUserId" && (params[key] = this.orderParams["userId"]);
      }

      try {
        if (!params.price) throw "请填写单价！";
        let reg = /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/;
        if (!reg.test(params.price)) throw "单价请输入数字！";
        if (!reg.test(params.exYears)) throw "年限请输入数字！";
        if (!reg.test(params.counts)) throw "数字请输入数字！";
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

      this.visible = false;
      this.$emit("outPutCardChange", {
        orderId: this.orderParams.orderId,
        status: 1
      });
      this.$API.orderCard(formData).then(res => {
        if (res.data.code === 0) {
          this.getUploadStatus(params.pushTime);
        } else {
          this.$emit("outPutCardChange", {
            orderId: this.orderParams.orderId,
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
                orderId: this.orderParams.orderId,
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
                orderId: this.orderParams.orderId,
                status: 3
              });
              this.$msg({
                message: res.data.msg,
                type: "success"
              });
            } else {
              this.$emit("outPutCardChange", {
                orderId: this.orderParams.orderId,
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
      this.handlerOperating();
      this.getSimMealChangeParamsInit();

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
    orderParams: {
      handler: function(val) {
        this.orderParams.orderPrice = String(val.orderPrice).replace(/[^\d+(\.\d+)*]+/, "");
        this.orderParams.exYears = Number(
          String(val.exYears).replace(/[^.0-9]+/g, "")
        );
        this.orderParams.counts = Number(
          String(val.counts).replace(/[^.0-9]+/g, "")
        );
      },
      deep: true
    },
    defaultParams(val) {
      this.orderParams = { ...val };
      this.paramsInit();
    }
  },

  props: {
    //原始数据
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
      visible: false,
      orderParams: null,
      outPutCardParams: {
        aUserId: "", //出库A级客户ID	number
        file: "", //上传excel文件	object
        orderId: "", //订单ID	number
        outType: 1, //出库类型	number	1:卡段出库，2:Excel文件
        price: "", //单价	number
        phase: "", //卡段
        appendNum: "" //散卡
      },
      getSimMealChangeParams: {
        orderId: "",
        prodCode: "",
        changePrice: ""
      },
      prodCodeConfig,
      handlerOperating,
      outPutCardList: [{ startCard: "", endCard: "" }],
      isAddCardSegment: true,
      isAddScatterCard: true,
      sellTypeOption: [
        { label: "销售", value: 1 },
        { label: "赠送", value: 2 },
        { label: "换卡", value: 3 },
        { label: "领用", value: 4 }
      ],
      isOperating,
      ifInstallOption: [{ label: "是", value: 1 }, { label: "否", value: 2 }],
      sellStatusOption: [
        {
          value: 2,
          label: "未付款"
        },
        {
          value: 1,
          label: "已付款"
        }
      ]
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
.el-select {
  width: 170px;
  margin: 0;
}
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
  input {
    flex: 1;
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

