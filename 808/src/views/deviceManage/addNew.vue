<template>
  <div class="addNew-page">
    <el-form
      ref="baseForm"
      size="mini"
      :inline="true"
      :status-icon="true"
      :show-message="false"
      :model="formData"
      :rules="rules"
      class="demo-form-inline"
      label-width="80px"
    >
      <el-row
        :gutter="20"
        class="baseForm-row"
      >
        <el-col
          :span="12"
          :xs="24"
        >
          <el-form-item
            label="厂商ID"
            prop="manufacturerNo"
          >
            <el-input
              maxlength=11
              v-model="formData.manufacturerNo"
              placeholder="请输入厂商ID"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :xs="24"
        >
          <el-form-item
            label="终端型号"
            class="check-form-item"
            prop="terminalType"
          >
            <el-input
              v-model="formData.terminalType"
              placeholder="请输入终端型号"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :xs="24"
        >
          <el-form-item
            label="适用类型"
            class="check-form-item"
            prop="useType"
          >
            <el-checkbox-group v-model="formData.useType">
              <el-checkbox
                v-for="(item,index) in useTypeList"
                :key="index"
                :label="item.id"
              >{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :xs="24"
        >
          <el-form-item
            label="厂商名称"
            prop="manufacturerName"
          >
            <el-input
              v-model="formData.manufacturerName"
              placeholder="请输入厂商名称"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :xs="24"
        >
          <el-form-item
            label="定位类型"
            class="check-form-item"
            prop="locationType"
          >
            <el-checkbox-group v-model="formData.locationType">
              <el-checkbox
                v-for="(item,index) in locationTypeList"
                :key="index"
                :label="item.id"
              >{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :xs="24"
        >
          <el-form-item
            label="版本"
            prop="version"
          >
            <el-input
              v-model="formData.version"
              placeholder="请输入版本"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :xs="24"
        >
          <el-form-item
            label="具备功能"
            class="check-form-item"
            prop="function"
          >
            <el-checkbox-group v-model="formData.function">
              <el-checkbox
                v-for="(item,index) in functionList"
                :key="index"
                :label="item.id"
              >{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :xs="24"
        >
          <el-form-item
            label="说明"
            prop="remark"
            :status-icon="false"
          >
            <el-input
              v-model="formData.remark"
              placeholder=""
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="device-addList">
      <addDeviceTable
        ref="addDeviceTable"
        v-model="formData.terminalVehicleList"
        @setVehlist="setVehlist"
      />
    </div>
    <div class="fot-btns">
      <el-button
        class=""
        type="primary"
        block
        @click="onSubmit"
      >{{ mode==='new'?'新增':'保存修改' }}</el-button>

    </div>
  </div>
</template>
<script>
import { addOneTerminal, getTerminal, updateOne } from "@/api/device";
import addDeviceTable from "./components/addDeviceTable";
export default {
  components: { addDeviceTable },
  data() {
    const validateCheckBox = (rule, value, callback) => {
      var nowValue = this.formData[rule.field];
      if (nowValue instanceof Array && nowValue.length > 0) {
        callback();
      } else {
        callback(new Error("最少选择一项"));
      }
    };
    return {
      rules: {
        manufacturerNo: [{ required: true, message: "请输入厂商id" }],
        manufacturerName: [{ required: true, message: "请输入厂商名称" }],
        // function: [{ validator: validateCheckBox, trigger: "change" }],
        useType: [{ validator: validateCheckBox, trigger: "change" }],
        locationType: [{ validator: validateCheckBox, trigger: "change" }],
        terminalType: [{ required: true, message: "请输入" }],

        version: [{ required: true, message: "请输入" }],
        remark: [{ max: 200, message: "最多输入200位" }]
      },
      functionList: {
        // 具备功能
        1: {
          label: "录像",
          id: 1
        },
        2: {
          label: "录音",
          id: 2
        }
      },
      useTypeList: {
        // 适用类型
        1: {
          label: "客运",
          id: 1
        },
        2: {
          label: "危险品运输",
          id: 2
        },
        3: {
          label: "货运",
          id: 3
        },
        4: {
          label: "挂车",
          id: 4
        }
      },
      locationTypeList: {
        // 定位类型
        1: {
          label: "GPS",
          id: 1
        },
        2: {
          label: "北斗",
          id: 2
        },
        3: {
          label: "GLONASS",
          id: 3
        },
        4: {
          label: "伽利略",
          id: 4
        }
      },
      formData: {
        manufacturerNo: "", // 厂商id
        terminalType: "", // 终端型号
        manufacturerName: "", // 厂商名称
        useType: [], // 适用类型
        locationType: [], // 定位类型
        version: "", // 版本
        function: [], // 具备功能
        remark: "", // 说明
        terminalVehicleList: [{}, {}, {}, {}, {}]
      },
      isSubmiting: false,
      detailsData: this.$route.params.data,
      mode: this.$route.params.data ? "edit" : "new",
      isLoading: false
    };
  },
  created() {
    if (this.mode === "edit") {
      // 查看详情
      this.getTerminal();
    }
  },
  methods: {
    getTerminal() {
      this.isLoading = true;
      getTerminal({
        id: this.detailsData.id
      }).then(rst => {
        if (rst.code === 0) {
          rst.data.locationType = JSON.parse(rst.data.locationType || "[]");
          rst.data.function = JSON.parse(rst.data.function || "[]");
          rst.data.useType = JSON.parse(rst.data.useType || "[]");
          this.$set(
            this,
            "formData",
            Object.assign({}, this.formData, rst.data)
          );
        }
      });
    },
    onSubmit() {
      this.$refs["baseForm"].validate(valid => {
        if (valid) {
          var validate_listForm = this.$refs[
            "addDeviceTable"
          ].validateAllForm();
          if (validate_listForm.status) {
            if (this.mode === "new") {
              this.doAddOneTerminal();
            } else if (this.mode === "edit") {
              this.doUpdate();
            }
          }
        } else {
          this.$message({
            showClose: true,
            message: "请填写完成车辆信息",
            type: "warning"
          });
        }
      });
    },
    doUpdate() {
      this.isSubmiting = true;
      updateOne(
        { ...this.formData },
        {
          isAutoShowMessage: false
        }
      )
        .then(rst => {
          if (rst.code === 0) {
            this.$message({
              showClose: true,
              message: "修改成功，自动跳转至设备列表",
              type: "success"
            });
            this.$router.push({
              name: "DeviceManageIndex",
              params: { needRefresh: true }
            });
          } else {
            var msg = rst && rst.msg ? rst.msg : "网络异常,请稍后再试";
            if (rst && rst.code === 1000001 && rst.data) {
              rst.data = JSON.parse(rst.data);
              msg = "";
              if (rst.data.sim && rst.data.sim.length > 0) {
                let simMsg = "第";
                const len = rst.data.sim.length;
                rst.data.sim.map((item, index) => {
                  simMsg += item;
                  if (index !== len - 1 && len !== 1) {
                    simMsg += "、";
                  }
                  if (index === len - 1) {
                    simMsg += "台设备sim卡已存在";
                  }
                });
                msg = msg ? msg + "，" + simMsg : simMsg;
              }
              if (rst.data.vin && rst.data.vin.length > 0) {
                let vinMsg = "第";
                const len = rst.data.vin.length;
                rst.data.vin.map((item, index) => {
                  vinMsg += item;
                  if (index !== len - 1 && len !== 1) {
                    vinMsg += "、";
                  }
                  if (index === len - 1) {
                    vinMsg += "台设备vin已存在";
                  }
                });
                msg = msg ? msg + "，" + vinMsg : vinMsg;
              }
              if (
                rst.data.terminalNumber &&
                rst.data.terminalNumber.length > 0
              ) {
                let terminalNumberMsg = "第";
                const len = rst.data.terminalNumber.length;
                rst.data.terminalNumber.map((item, index) => {
                  terminalNumberMsg += item;
                  if (index !== len - 1 && len !== 1) {
                    terminalNumberMsg += "、";
                  }
                  if (index === len - 1) {
                    terminalNumberMsg += "台设备终端id已存在";
                  }
                });
                msg = msg ? msg + "，" + terminalNumberMsg : terminalNumberMsg;
              }
            }
            this.$message({
              showClose: true,
              message: msg,
              type: "error",
              duration: 5 * 1000
            });
          }
          this.isSubmiting = false;
        })
        .catch(e => {
          var msg = e && e.msg ? e.msg : "网络异常,请稍后再试";

          this.$message({
            showClose: true,
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
          // this.$router.push({ name: 'DeviceManageIndex' })
          this.isSubmiting = false;
        });
    },
    doAddOneTerminal() {
      this.isSubmiting = true;
      addOneTerminal(
        { ...this.formData },
        {
          isAutoShowMessage: false
        }
      )
        .then(rst => {
          if (rst.code === 0) {
            this.$message({
              showClose: true,
              message: "新增成功，自动跳转至设备列表",
              type: "success"
            });
            this.$router.push({
              name: "DeviceManageIndex",
              params: { needRefresh: true }
            });
          } else {
            var msg = rst && rst.msg ? rst.msg : "网络异常,请稍后再试";
            if (rst && rst.code === 1000001 && rst.data) {
              rst.data = JSON.parse(rst.data);
              msg = "";
              if (rst.data.sim && rst.data.sim.length > 0) {
                let simMsg = "第";
                const len = rst.data.sim.length;
                rst.data.sim.map((item, index) => {
                  simMsg += item;
                  if (index !== len - 1 && len !== 1) {
                    simMsg += "、";
                  }
                  if (index === len - 1) {
                    simMsg += "台设备sim卡已存在";
                  }
                });
                msg = msg ? msg + "，" + simMsg : simMsg;
              }
              if (rst.data.vin && rst.data.vin.length > 0) {
                let vinMsg = "第";
                const len = rst.data.vin.length;
                rst.data.vin.map((item, index) => {
                  vinMsg += item;
                  if (index !== len - 1 && len !== 1) {
                    vinMsg += "、";
                  }
                  if (index === len - 1) {
                    vinMsg += "台设备vin已存在";
                  }
                });
                msg = msg ? msg + "，" + vinMsg : vinMsg;
              }
              if (
                rst.data.terminalNumber &&
                rst.data.terminalNumber.length > 0
              ) {
                let terminalNumberMsg = "第";
                const len = rst.data.terminalNumber.length;
                rst.data.terminalNumber.map((item, index) => {
                  terminalNumberMsg += item;
                  if (index !== len - 1 && len !== 1) {
                    terminalNumberMsg += "、";
                  }
                  if (index === len - 1) {
                    terminalNumberMsg += "台设备终端id已存在";
                  }
                });
                msg = msg ? msg + "，" + terminalNumberMsg : terminalNumberMsg;
              }
            }
            this.$message({
              showClose: true,
              message: msg,
              type: "error",
              duration: 5 * 1000
            });
          }
          this.isSubmiting = false;
        })
        .catch(e => {
          // this.$router.push({ name: 'DeviceManageIndex' })
          var msg = e && e.msg ? e.msg : "网络异常,请稍后再试";

          this.$message({
            showClose: true,
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
          this.isSubmiting = false;
        });
    },
    setVehlist(obj) {
      this.formData.terminalVehicleList = obj;
    }
  }
};
</script>
<style lang="scss" scoped>
.addNew-page {
  padding: 15px;
  .fot-btns {
    text-align: center;
    padding: 20px 0;
    .el-button {
      padding-left: 50px;
      padding-right: 50px;
    }
  }
}
.baseForm-row {
  > .el-col {
    margin-bottom: 10px;
    height: 40px;
  }
}
.is-error.el-form-item.check-form-item {
  .el-checkbox {
    color: #ff4949;
  }
}
</style>
