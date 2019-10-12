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
        :span="9"
        :xs="12"
      >
        <el-form-item label="消息编号">
          <el-input v-model.trim="formData.msgNo" />
        </el-form-item>
      </el-col>
      <el-col
        :span="9"
        :xs="12"
      >
        <el-form-item label="测试功能">
          <el-select
            v-model="formData.function"
            placeholder="请选择"
            size="mini"
          >
            <template v-for="itemFunction in functionOptions">
              <el-option-group
                v-if="itemFunction.options"
                :key="itemFunction.label"
                :label="itemFunction.label"
              >
                <el-option
                  v-for="item in itemFunction.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-option-group>
              <el-option
                v-else
                :key="itemFunction.value"
                :label="itemFunction.label"
                :value="itemFunction.value"
              />
            </template>

          </el-select>
        </el-form-item>
      </el-col>

      <el-col
        :span="6"
        :xs="12"
      >
        <el-button
          type="primary"
          size="mini"
          :loading="searchLoading"
          icon="el-icon-search"
          @click="doSearch"
        >搜索</el-button>
        <!-- <el-button type="" plain icon="el-icon-circle-plus-outline" @click.native="toAddNew">新增</el-button> -->
        <!-- <el-button type="" plain icon="el-icon-circle-plus-outline" @click.native="batchDel">批量删除</el-button> -->
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { validPositiveInteger } from "@/utils/validate";
import testList from "@/json/functionList/index.js";
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
    const functionOptions = [
      {
        value: "",
        label: "全部"
      }
    ];
    const otherOptions = [];
    Object.keys(testList).map(key => {
      var item = testList[key];
      if (item.children) {
        var subResult = [];
        Object.keys(item.children).map(subKey => {
          const subItem = item.children[subKey];
          subResult.push({
            value: subItem.function || subItem.title,
            label: subItem.title
          });
        });
        functionOptions.push({
          label: item.title,
          options: subResult
        });
      } else {
        otherOptions.push({
          value: item.function || item.title,
          label: item.title
        });
      }
    });
    functionOptions.push({
      options: otherOptions
    });
    return {
      formData: { ...this.data },
      rules: {
        num: [{ validator: this.validatorNum, trigger: "change" }]
      },
      functionOptions: functionOptions
    };
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.formData = { ...val };
      }
    }
  },
  methods: {
    test(data) {
      consol.log("data:" + data);
    },
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
