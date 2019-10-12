<template>
  <div>
    <el-dialog
      @closed="initParams()"
      :visible.sync="visible"
      width="600px"
      v-if="defaultParams"
      class="order-dialog"
    >
      <div slot="title">
        {{defaultParams.orderStatus === 4 ? '订单详情' : '操作订单'}}
        <orderType
          v-if="defaultParams.sellType && defaultParams.orderStatus === 4"
          :sellType="defaultParams.sellType"
        ></orderType>
        <orderType
          v-if="defaultParams.orderType"
          :orderType="defaultParams.orderType"
        ></orderType>
      </div>
      <el-row>
        <el-col :span="12">
          <div class="input-item">
            <label>客户代码</label>
            <input
              v-model="defaultParams.userCode"
              :disabled="isOperating.userCode.disabled"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item">
            <label>订单号</label>
            <input
              v-model="defaultParams.orderNum"
              disabled
            />
          </div>
        </el-col>
        <el-col :span="12"  v-if="isOperating.counts.isShow">
          <div class="input-item">
            <label>购买数量</label>
            <input
              v-model="defaultParams.counts"
              :disabled="isOperating.counts.disabled"
            />
          </div>
        </el-col>
        <el-col
          :span="12"
          v-if="isOperating.serMeal.isShow"
        >
          <div class="input-item">
            <label>套餐规格</label>
            <el-select
              v-model="defaultParams.serMeal"
              placeholder="请选择"
              size="small"
              style="width:auto;margin:0"
              :disabled="isOperating.serMeal.disabled"
            >
              <el-option
                v-for="item in $store.state.simList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-show="item.value !== ''"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col
          :span="12"
          v-if="isOperating.changeType.isShow"
        >
          <div class="input-item">
            <label>订购套餐</label>
            <!-- v-model="defaultParams.changeType"
                  :disabled="isOperating.changeType.disabled" -->
            <input disabled />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item">
            <label>{{defaultParams.orderType === 3 ? '续费价格' : '套餐单价'}}</label>
            <input
              v-model="defaultParams.orderPrice"
              :disabled="isOperating.orderPrice.disabled"
            />
          </div>
        </el-col>
        <el-col :span="12" v-if="isOperating.totalPrice.isShow">
          <div class="input-item">
            <label>套餐总价</label>
            <input
              :value="(defaultParams.orderPrice * defaultParams.counts * defaultParams.exYears).toFixed(2)"
              disabled
            />
          </div>
        </el-col>
        <el-col
          :span="12"
          v-if="isOperating.exYears.isShow"
        >
          <div class="input-item">
            <label>购卡年限</label>
            <input
              style="width: 150px;margin-right: 5px;"
              v-model="defaultParams.exYears"
              :disabled="isOperating.exYears.disabled"
            />
            年
          </div>
        </el-col>
        <el-col
          :span="12"
          v-if="isOperating.sellStatus.isShow"
        >
          <div
            class="input-item"
            style="width:265px"
          >
            <label>付款状态</label>
            <el-select
              v-model="defaultParams.sellStatus"
              placeholder="请选择"
              size="small"
              style="flex:1;margin:0"
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
            <div
              class="upload-wrap"
              v-if="defaultParams.sellStatus === 1"
            >
              <input
                ref="File"
                type="file"
                style="display: none;"
                @change="uploadImg($event)"
              >
              <el-button
                type="primary"
                size="small"
                style="border:none;margin:0 0 0 10px"
                @click="$refs.File.click()"
                v-if="!isOperating.sellStatus.disabled"
              >上传</el-button>
              <el-button
                type="info"
                size="small"
                style="border:none;margin:0 0 0 10px;background:#F3F7FB!important;color:#2878DA!important"
                @click="showPreview()"
                v-if="isOperating.sellStatus.disabled && defaultParams.iconStream"
              >查看</el-button>
              <p v-if="previewText">上传成功，<span @click="$refs.previewImg.visible = true">预览</span></p>
            </div>
          </div>
        </el-col>
        <el-col
          :span="12"
          v-if="isOperating.simPreview.isShow"
        >
          <div
            class="input-item"
            style="width:265px"
          >
            <label>升级卡号</label>
            <div class="upload-wrap">
              <el-button
                type="info"
                size="small"
                style="border:none;margin:0 0 0 10px;background:#F3F7FB!important;"
                :style="{'color': isSimListShow ? '#999!important' : '#2878DA!important' }"
                @click="getOrderOfIccids()"
              >预览卡号</el-button>
            </div>
          </div>
        </el-col>
        <el-col
          :span="12"
          v-if="isOperating.sellType.isShow"
        >
          <div
            class="input-item"
            style="width:265px"
          >
            <label>订单类型</label>
            <el-select
              v-model="defaultParams.sellType"
              placeholder="请选择"
              size="small"
              style="flex:1;margin:0"
              :disabled="isOperating.sellType.disabled"
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
        </el-col>
        <!-- <el-col
          :span="12"
          v-if="isOperating.ifInstall.isShow"
        >
          <div
            class="input-item"
            style="width:265px"
          >
            <label>是否装机</label>
            <el-select
              v-model="defaultParams.ifInstall"
              placeholder="请选择是否装机"
              size="small"
              style="flex:1;margin:0"
              :disabled="isOperating.ifInstall.disabled"
            >
              <el-option
                v-for="item in ifInstallOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col> -->
        <el-col :span="12" v-if="isOperating.assistantName.isShow">
          <div class="input-item">
            <label>业务助理</label>
            <input
              v-model="defaultParams.assistantName"
              :disabled="isOperating.assistantName.disabled"
            />
          </div>
        </el-col>
        <el-col :span="12" v-if="isOperating.exportOrderSimCard.isShow">
          <div class="input-item">
            <label>出库卡号</label>
            <el-button
              size="small"
              style="padding: 9px 20px;"
              @click="exportOrderSimCard()"
            >导出</el-button>
          </div>
        </el-col>
        <el-col
          :span="24"
          v-if="isOperating.address.isShow"
        >
          <div class="input-item">
            <label>收货地址</label>
            <input
              style="width:448px"
              v-model="defaultParams.address"
              :disabled="isOperating.address.disabled"
              placeholder="1.姓名2.电话3.收货人地址"
            />
          </div>
        </el-col>
        <el-col :span="24">
          <div
            class="input-item"
            style="align-items:baseline"
          >
            <label>备注信息</label>
            <textarea
              style="flex:none;width:478px"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              width="100%"
              rows="5"
              v-model="defaultParams.remark"
              :disabled="isOperating.remark.disabled"
            ></textarea>
          </div>
        </el-col>
      </el-row>
      <div
        class="table-wrap"
        v-if="isSimListShow"
      >
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          size="small"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="simCard"
            label="SIM卡号"
            width="130"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          small
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page.sync="pageNumber"
          style="text-align:right;margin-top:10px"
        >
        </el-pagination>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="defaultParams.orderStatus !== 4"
          type="primary"
          size="small"
          @click="runOrderInfo()"
        >提交</el-button>
      </span>
    </el-dialog>
    <previewImg ref="previewImg"></previewImg>
  </div>
</template>

<script>
import orderType from "@/components/orderType/";
import previewImg from "@/components/previewImg/";
import { isOperating, handlerOperating } from "./handlerOperating";
import { exportFile } from "@/util/common";
export default {
  methods: {
    exportOrderSimCard() {
      const json = "exportExcel/exportOrderSimCard.json";
      let params = {
        aUserId: this.defaultParams.userId,
        orderId: this.defaultParams.orderId,
        sessionId: this.$store.state.LOGINUSER.sId
      };
      exportFile(json, params);
    },
    getOrderOfIccids() {
      if (this.tableData) {
        this.isSimListShow = !this.isSimListShow;
        return;
      }
      const params = {
        aUserId: this.defaultParams.userId, //订单提交用户ID	number
        orderId: this.defaultParams.orderId, //订单Id	number
        pageNumber: this.pageNumber, //number
        pageSize: this.pageSize //number
      };

      this.$API.getOrderOfIccids(params).then(res => {
        if (res.code === 0) {
          res.data && (this.tableData = res.data);
          this.total = res.total;
          this.isSimListShow = true;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    showPreview() {
      this.$refs.previewImg.url =
        "data:image;png;base64," + this.defaultParams.iconStream;
      this.$refs.previewImg.visible = true;
    },
    initParams() {
      this.isSimListShow = false;
      this.previewText = false;
      this.$refs.previewImg.url = "";
      this.tableData = null;
      this.total = 0;
    },
    uploadImg(e) {
      try {
        if (e.target.files.length === 0) throw "请选择文件！";
        const file = e.target.files[0];
        const imageType = /image.*/;
        if (!file.type.match(imageType)) throw "请选择图片！";
        const reader = new FileReader();
        const _this = this;
        reader.onload = function() {
          _this.$refs.previewImg.url = reader.result;
        };
        reader.readAsDataURL(file);

        this.previewText = true;
        this.defaultParams.file = file;
        this.$refs.File.value = "";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
      }
    },
    runOrderInfo() {
      try {
        if (!this.defaultParams.orderPrice) throw "请填写单价！";
        let reg = /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/;
        if (!reg.test(this.defaultParams.orderPrice)) throw "单价请输入数字！";
        if (!reg.test(this.defaultParams.exYears)) throw "年限请输入数字！";
        if (this.defaultParams.orderType !== 3 && !reg.test(this.defaultParams.counts)) throw "数量请输入数字！";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }
      
      let params = {
        counts: "", //	购买数量	string
        file: "", //	付款流水图	object
        ifInstall: "", //	是否装机	number	1:是 2:否
        orderId: "", //	订单ID	number
        orderPrice: "", //	购买单价	string
        remark: "", //	备注说明	string
        sellStatus: "", //	付款状态	number	1:已付款 2:未付款
        sellType: "", //	出售类型	number	1:销售 2:赠送 3:换卡
        serMeal: "", //	套餐规格	string
        address: "", //快递地址
        assistantName: "", //	业务操作人员姓名	string
        exYears: "", //	购买年限	number
        orderType: "", //	订单类型订单类型 1:卡订单 2:叠加包 3:批量续费 4:套餐升级	number
        userCode: "" //	客户代码	string
      };

      for (let key in params) {
        this.defaultParams[key] && (params[key] = this.defaultParams[key]);
        if (key === "file" && !this.defaultParams[key]) {
          delete params.file;
        }
      }

      let formData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }
      this.$API.runOrderInfo(formData).then(res => {
        if (res.data.code === 0) {
          this.$msg({
            message: "处理成功！",
            type: "success"
          });
          this.visible = false;
          this.$emit("refresh");
        } else {
          this.$msg({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    }
  },

  data() {
    return {
      visible: false,
      isSimListShow: false,
      tableData: null,
      pageNumber: 1,
      pageSize: 50,
      total: 0,
      defaultParams: null,
      isOperating,
      handlerOperating,
      sellTypeOption: [
        { label: "销售", value: 1 },
        { label: "赠送", value: 2 },
        { label: "换卡", value: 3 },
        { label: "领用", value: 4 }
      ],
      sellStatusOption: [
        {
          value: 2,
          label: "未付款"
        },
        {
          value: 1,
          label: "已付款"
        }
      ],
      ifInstallOption: [{ label: "是", value: 1 }, { label: "否", value: 2 }],
      previewText: false
    };
  },

  watch: {
    defaultParams: {
      handler: function(val) {
        this.defaultParams.orderPrice = String(val.orderPrice).replace(/[^\d+(\.\d+)*]+/, "");
        this.defaultParams.exYears = Number(
          String(val.exYears).replace(/[^.0-9]+/g, "")
        );
        this.defaultParams.counts = Number(
          String(val.counts).replace(/[^.0-9]+/g, "")
        );
      },
      deep: true
    },
  },

  components: {
    orderType,
    previewImg
  }
};
</script>

<style lang="scss" scoped>
.order-dialog {
  /deep/ .el-dialog {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
.table-wrap {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  transform: translateX(100%);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  box-shadow: 0px 6px 10px 0px rgba(179, 179, 179, 0.24);
  .el-table {
    flex: 1;
  }
  .el-pagination {
    justify-content: flex-end;
  }
}
</style>


