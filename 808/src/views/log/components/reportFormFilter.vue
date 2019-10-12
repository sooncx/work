<template>
  <el-form
    ref="ruleForm"
    :model="formData"
    :rules="rules"
    label-position="right"
    :inline="true"
    size="mini"
  >
    <el-row
      class="clear"
      :gutter="0"
      align="middle"
      justify="center"
    >
      <el-col
        :span="5"
        :xs="12"
      >
        <el-form-item label="终端型号">
          <el-input v-model.trim="formData.terminalType" />
        </el-form-item>
      </el-col>
      <el-col
        :span="5"
        :xs="12"
      >
        <el-form-item label="厂商检索">
          <el-input v-model.trim="formData.manufacturerName" />
        </el-form-item>
      </el-col>
      <el-col
        :span="5"
        :xs="12"
      >
        <el-form-item label="终端编号">
          <el-input v-model.trim="formData.terminalNo" />
        </el-form-item>
      </el-col>
      <el-col
        :span="5"
        :xs="12"
      >
        <el-form-item
          label="检测结果"
          prop="checkNo"
        >
          <el-select
            v-model="formData.state"
            placeholder="检测结果"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col
        :span="3"
        :xs="12"
      >
        <el-button
          type="primary"
          size="mini"
          :loading="searchLoading"
          icon="el-icon-search"
          @click.native="doSearch"
        >搜索</el-button>
        <!-- <el-button type="" plain icon="el-icon-circle-plus-outline" @click.native="toAddNew">新增</el-button> -->
        <!-- <el-button type="" plain icon="el-icon-circle-plus-outline" @click.native="batchDel">批量删除</el-button> -->
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { validPositiveInteger } from "@/utils/validate";
import { stateCodes } from "@/utils/functionUtil";
export default {
  props: {
    data: {
      type: Object,
      required: 1,
      default: () => {
        return {};
      }
    },
    searchLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stateOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: stateCodes.success,
          label: "通过"
        },
        {
          value: stateCodes.error,
          label: "不通过"
        }
      ],
      formData: { ...this.data },
      rules: {
        num: [{ validator: this.validatorNum, trigger: "change" }]
      }
    };
  },
  methods: {
    doSearch() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$refs["ruleForm"].clearValidate();
          this.$emit("onSearch", Object.assign({}, this.formData));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    validatorNum(rule, value, callback) {
      if (value === "") {
        callback();
      } else if (validPositiveInteger(value)) {
        callback();
      } else {
        callback(new Error("请再次正整数"));
      }
    }
  }
};
</script>
