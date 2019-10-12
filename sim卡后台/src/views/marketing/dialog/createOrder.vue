<template>
  <div>
    <el-dialog
      title="创建订单"
      :visible.sync="visible"
      width="600px"
      @open="initParams()"
    >
      <el-row>
        <el-col :span="12">
          <div class="input-item">
            <label>客户代码</label>
            <input v-model="customerOrderParams.userCode" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item">
            <label>套餐规格</label>
            <el-select
              v-model="customerOrderParams.type"
              placeholder="请选择"
              size="small"
              style="width:auto;margin:0"
              :disabled="$store.state.simList.length <= 1"
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
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="input-item">
            <label>套餐单价</label>
            <input v-model="customerOrderParams.orderPrice" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item">
            <label>购卡数量</label>
            <input v-model="customerOrderParams.count" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="input-item">
            <label>购卡总价</label>
            <input
              disabled
              :value="(customerOrderParams.orderPrice * customerOrderParams.count * customerOrderParams.exYears).toFixed(2)"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item">
            <label>购卡年限</label>
            <el-select
              v-model="customerOrderParams.exYears"
              placeholder="请选择"
              size="small"
              style="width:auto;margin:0"
            >
              <el-option
                v-for="(item, index) in exYearOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <div class="input-item">
            <label>是否装机</label>
            <el-radio
              v-model="customerOrderParams.ifInstall"
              :label="1"
            >是</el-radio>
            <el-radio
              v-model="customerOrderParams.ifInstall"
              :label="2"
            >否</el-radio>
          </div>
        </el-col> -->
        <el-col :span="12">
          <div class="input-item">
            <label>订单类型</label>
            <el-select
              v-model="customerOrderParams.sellType"
              placeholder="请选择"
              size="small"
              style="width:auto;margin:0"
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
        <el-col :span="12">
          <div
            class="input-item"
            style="width:265px"
          >
            <label>付款状态</label>
            <el-select
              v-model="customerOrderParams.sellStatus"
              placeholder="请选择"
              size="small"
              style="flex:1;margin:0"
            >
              <el-option
                v-for="item in sellStatusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div class="upload-wrap">
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
              >上传</el-button>
              <p v-if="previewText">上传成功，<span @click="$refs.previewImg.visible = true">预览</span></p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="input-item">
            <label>业务助理</label>
            <input v-model="customerOrderParams.assistantName" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <label>收货地址</label>
            <input
              v-model="customerOrderParams.address"
              style="width: 448px;"
              placeholder="1.姓名2.电话3.收货人地址"
            />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div
            class="input-item"
            style="align-items:baseline"
          >
            <label>备注信息</label>
            <textarea
              style="flex: none;width: 478px"
              v-model="customerOrderParams.remark"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              width="100%"
              rows="5"
            ></textarea>
          </div>
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="small"
          @click="pushCustomerOrder()"
        >提交</el-button>
      </span>
    </el-dialog>
    <previewImg ref="previewImg"></previewImg>
  </div>
</template>

<script>
import previewImg from "@/components/previewImg/";
export default {
  data() {
    return {
      visible: false,
      previewText: false,
      exYearOptions: [
        {
          value: 1,
          label: "1年"
        },
        {
          value: 2,
          label: "2年"
        },
        {
          value: 3,
          label: "3年"
        }
      ],
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
      customerOrderParams: {
        count: "",
        orderPrice: "",
        remark: "",
        userCode: "",
        type: "",
        orderType: 1,
        exYears: 1,
        sellStatus: 1,
        file: "",
        ifInstall: 1,
        sellType: 1,
        address: "",
        assistantName: "" //	业务操作人员姓名	string
      }
    };
  },

  watch: {
    "customerOrderParams.count"(val) {
      if (!val) return;
      this.customerOrderParams.count = val.replace(/[^0-9]+/g, "");
    },
    "customerOrderParams.orderPrice"(val) {
      if (!val) return;
      this.customerOrderParams.orderPrice = val.replace(/[^\d+(\.\d+)*]+/, "");
    }
  },

  methods: {
    initParams() {
      this.customerOrderParams = {
        count: "",
        orderPrice: "",
        remark: "",
        userCode: "",
        type:
          this.$store.state.simList.length > 1
            ? this.$store.state.simList[1].value
            : "",
        orderType: 1,
        exYears: 1,
        sellStatus: 1,
        file: "",
        ifInstall: 1,
        sellType: 1,
        address: "",
        assistantName: "" //	业务操作人员姓名	string
      };
      this.previewText = false;
      this.$refs.previewImg.url = "";
    },
    pushCustomerOrder() {
      let params = Object.assign({}, this.customerOrderParams);
      try {
        if (!params.userCode) throw "请填写客户代码！";
        if (!params.orderPrice) throw "请填写套餐单价！";
        let reg = /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/;
        if (!reg.test(params.orderPrice)) throw "单价请输入数字！";
        if (!params.count) throw "请填写购卡数量！";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }

      params.file === '' && delete params.file;
      let formData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }

      this.$API.pushCustomerOrder(formData).then(res => {
        if (res.data.code === 0) {
          this.$msg({
            message: res.data.msg,
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
        this.customerOrderParams.file = file;
        this.$refs.File.value = "";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
      }
    }
  },

  components: {
    previewImg
  }
};
</script>

<style lang="scss" scoped>
</style>
