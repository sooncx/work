<template>
  <el-form ref="ruleForm" :model="formData" :rules="rules" label-position="right" :inline="true" size="mini">
    <el-row class="clear filter-form-row" :gutter="0" align="middle" justify="center">
      <el-col :span="4" :xs="12" :md="8" :lg="4">
        <el-form-item label="终端型号">
          <el-input v-model.trim="formData.terminalType" />
        </el-form-item>
      </el-col>
      <el-col :span="4" :xs="12" :md="8" :lg="4">
        <el-form-item label="终端编号">
          <el-input v-model.trim="formData.terminalNo" />
        </el-form-item>
      </el-col>
      <el-col :span="4" :xs="12" :md="8" :lg="4">
        <el-form-item label="检测编号" prop="checkNo">
          <el-input v-model.trim="formData.checkNo" />
        </el-form-item>
      </el-col>
      <el-col :span="4" :xs="12" :md="8" :lg="4">
        <el-form-item label="  厂商">
          <el-input v-model.trim="formData.manufacturerName" />
        </el-form-item>
      </el-col>
      <el-col :span="4" :xs="12" :md="8" :lg="4">
        <el-form-item label="   轮次" prop="num">
          <el-input v-model.trim="formData.num" />
        </el-form-item>
      </el-col>
      <el-col :span="4" :xs="12" :md="8" :lg="4">
        <el-button type="primary" size="mini" :loading="searchLoading" icon="el-icon-search" @click.native="doSearch">搜索</el-button>
        <!-- <el-button type="" plain icon="el-icon-circle-plus-outline" @click.native="toAddNew">新增</el-button> -->
        <!-- <el-button type="" plain icon="el-icon-circle-plus-outline" @click.native="batchDel">批量删除</el-button> -->
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { validPositiveInteger } from '@/utils/validate'
export default {
  props: {
    data: {
      type: Object,
      required: 1,
      default: () => {
        return {
        }
      }
    },
    searchLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: { ...this.data },
      rules: {
        num: [
          { validator: this.validatorNum, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    doSearch() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$refs['ruleForm'].clearValidate()
          this.$emit('onSearch', Object.assign({}, this.formData))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    validatorNum(rule, value, callback) {
      if (value === '') {
        callback()
      } else if (validPositiveInteger(value)) {
        callback()
      } else {
        callback(new Error('请再次正整数'))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-form-row{
  .el-form-item{
    // white-space: nowrap;
  }
  /deep/ .el-form-item__label{
    width:69px;
    text-align: right
  }
}
@media (min-width: 1200px) and (max-width:1540px) {
  .filter-form-row{

    /deep/ .el-form-item__label{
      text-align: left
    }
}
}
</style>

