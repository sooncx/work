<template>
  <div class="addDeviceTable-box">
    <section class="row-device table-header">
      <span class="col-index">
        终端编号
      </span>
      <span class="col-id col">
        终端ID
      </span>
      <span class="col-sim  col">
        SIM卡号
      </span>
      <span class="col-plate  col">
        车牌号
      </span>
      <span class="col-plateColor col">
        车牌颜色
      </span>
      <span class="col-vin col">
        VIN
      </span>
      <span class="col-code col">
        鉴权码
      </span>
    </section>
    <el-form
      v-for="(item,index) in formData"
      :key="index"
      :ref="formNameKy+index"
      size="mini"
      :status-icon="true"
      :show-message="false"
      :model="formData[index]"
      :rules="rules"
    >
      <section
        v-if="item"
        class="row-device"
      >
        <span class="col-index">{{ item.terminalNo }}</span>
        <!-- <span class="col-id col">
          <el-form-item prop="terminalNumber">
            <el-input v-model="item.terminalNumber" placeholder="终端id" />
          </el-form-item>
        </span> -->
        <span class="col-id col">
          <el-form-item prop="terminalNumber">
            <el-input
              v-model="item.terminalNumber"
              placeholder="终端id"
            />
          </el-form-item>
        </span>
        <span class="col-sim  col">
          <el-form-item prop="sim">
            <el-input
              v-model="item.sim"
              placeholder="SIM卡号"
            />
          </el-form-item>
        </span>
        <span class="col-plate  col">
          <el-form-item prop="plate">
            <el-input
              v-model="item.plate"
              placeholder="车牌号"
            />
          </el-form-item>
        </span>
        <span class="col-plateColor col">
          <el-form-item prop="color">
            <el-select
              v-model="item.color"
              placeholder="请选择"
            >
              <el-option
                v-for="itemColor in colorOptions"
                :key="itemColor.value"
                :label="itemColor.label"
                :value="itemColor.value"
              />
            </el-select>
          </el-form-item>
        </span>
        <span class="col-vin col">
          <el-form-item prop="vin">
            <el-input
              v-model="item.vin"
              placeholder="VIN"
            />
          </el-form-item>
        </span>
        <span class="col-code col">
          <el-form-item prop="authCode">
            <el-input
              v-model="item.authCode"
              placeholder="鉴权码"
            />
          </el-form-item>
        </span>
      </section>
    </el-form>
  </div>
</template>
<script>
import { validPhone } from "@/utils/validate";
export default {
  props: {
    value: {
      required: 1,
      type: Array
    }
  },
  data() {
    const validPhoneForm = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      formNameKy: "ruleForm-",
      input: "",
      rules: {
        terminalNumber: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        terminalNo: [
          { required: true, message: "请输入设备id", trigger: "blur" }
        ],
        sim: [{ validator: validPhoneForm, trigger: "change" }],
        plate: [{ required: true, message: "", trigger: "blur" }],
        color: [
          { required: true, message: "", trigger: "change" },
          { required: true, message: "", trigger: "change" }
        ],
        vin: [{ required: true, message: "", trigger: "blur" }],
        authCode: [{ required: true, message: "", trigger: "blur" }]
      },
      colorOptions: [
        {
          label: "蓝色",
          value: 1
        },
        {
          label: "黄色",
          value: 2
        },
        {
          label: "黑色",
          value: 3
        },
        {
          label: "白色",
          value: 4
        },
        {
          label: "未上牌",
          value: 5
        },
        {
          label: "其他",
          value: 6
        }
      ],
      formData: this.genTerminalNo(JSON.parse(JSON.stringify(this.value)))
    };
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.formData)) {
          this.$set(this, "formData", this.cloneArrau(this.value));
        }
      }
    },
    formData: {
      deep: true,
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit("setVehlist", this.cloneArrau(this.formData));
        }
      }
    }
  },
  methods: {
    genTerminalNo(data) {
      data.map((item, index) => {
        if (item.terminalNo === undefined) {
          item.terminalNo = index + 1;
        }
        if (item.color === undefined) {
          item.color = 1;
        }
      });
      return data;
    },
    cloneArrau(arr) {
      return JSON.parse(JSON.stringify(arr));
    },
    validateAllForm() {
      var isValidate = true;
      var msg = "";
      const simList = []; // 校验sim不能重复
      const terminalNumberList = []; // 校验终端id不能重复

      Object.keys(this.$refs).map(key => {
        if (key.indexOf(this.formNameKy) === 0) {
          var index = Number(key.replace(this.formNameKy, ""));
          var itemFormData = this.formData[index];
          this.$refs[key][0] &&
            this.$refs[key][0].validate((valid, errorRst) => {
              if (valid) {
              } else {
                isValidate = false;
                this.$message({
                  showClose: true,
                  message: "请填写完成车辆信息",
                  type: "warning"
                });
                return false;
              }
            });
          if (isValidate) {
            if (simList.indexOf(itemFormData.sim) !== -1) {
              // 校验sim不能重复
              isValidate = false;
              this.$message({
                showClose: true,
                message: "sim号码不能相同，请重新输入",
                type: "warning"
              });
              return false;
            }
            if (
              terminalNumberList.indexOf(itemFormData.terminalNumber) !== -1
            ) {
              // 校验终端id不能重复
              isValidate = false;
              this.$message({
                showClose: true,
                message: "终端id不能相同，请重新输入",
                type: "warning"
              });
              return false;
            }
            itemFormData.terminalNumber &&
              terminalNumberList.push(itemFormData.terminalNumber);
            itemFormData.sim && simList.push(itemFormData.sim);
          }
        }
      });
      return {
        status: isValidate
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.addDeviceTable-box {
}
.table-header {
  background: #ddd;
  padding: 4px 0;
  font-size: 12px;
}
.row-device {
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  > .col-index {
    width: 60px;
    text-align: center;
  }
  > .col {
    text-align: left;
    flex: 1;
    padding: 5px;
    min-width: 120px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>

