<template>
  <el-dialog
    :visible.sync="visible"
    width="600px"
    title="修改信息"
    class="edit-card"
    v-if="defaultParams"
    @opened="initParams()"
  >
    <el-row>
      <el-col :span="12">
        <div class="input-item">
          <label>ICCID</label>
          <input disabled :value="defaultParams.iccid">
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>SIM卡号</label>
          <input disabled :value="defaultParams.simCard">
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>所属客户</label>
          <input disabled :value="defaultParams.userName ? defaultParams.userName : ''">
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>套餐规格</label>
          <el-select
            v-model="updateSimInfoParams.simState"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in $store.state.simStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-show="item.value !== 0"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>价格</label>
          <input
            disabled
            :value="defaultParams.prices"
          >
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>总流量</label>
          <input
            disabled
            :value="defaultParams.traffic + 'kb'"
          >
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>剩余流量</label>
          <input
            disabled
            :value="defaultParams.surplusGprs ? defaultParams.surplusGprs + 'kb' : '0kb'"
          >
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>开卡日期</label>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="updateSimInfoParams.openTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>激活日期</label>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="updateSimInfoParams.activationTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="input-item">
          <label>到期日期</label>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="updateSimInfoParams.expireTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </el-col>
    </el-row>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="updateSimInfo()"
        size="small"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      value1: "",
      defaultParams: null,
      updateSimInfoParams: {
        activationTime: "", //	激活日期	string
        expireTime: "", //	过期时间	string
        iccid: "", //	iccid	string
        openTime: "", //	开卡日期	string
        simState: 0 //	sim卡状态	number
      },
    };
  },

  methods: {
    initParams() {
      this.updateSimInfoParams = {
        activationTime: "", //	激活日期	string
        expireTime: "", //	过期时间	string
        iccid: "", //	iccid	string
        openTime: "", //	开卡日期	string
        simState: 0 //	sim卡状态	number
      }

      Object.keys(this.updateSimInfoParams).map(item => {
        this.defaultParams[item] && (this.updateSimInfoParams[item] = this.defaultParams[item]);
      });
    },
    updateSimInfo() {
      this.$API.updateSimInfo(this.updateSimInfoParams).then(res => {
        if (res.code === 0) {
          this.$msg({
            message: res.msg,
            type: "success"
          });
          this.$emit('updateSimInfo', this.updateSimInfoParams);
          this.visible = false;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.edit-card {
  .input-item {
    height: 30px;
    margin-bottom: 20px!important;

    label {
      width: 56px;
    }
  }
}
/deep/ .el-date-editor.el-input {
  width: 199px;
  line-height: 40px;
  input {
    padding: 0 30px;
  }
}

.el-select {
  width: 199px;
  margin: 0
}
</style>
