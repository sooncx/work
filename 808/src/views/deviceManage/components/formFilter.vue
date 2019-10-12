<template>
  <el-form label-position="right" :inline="true" size="mini">
    <el-row :gutter="0" align="middle" justify="center">
      <el-col :span="7" :xs="12">
        <el-form-item label="终端型号">
          <el-input v-model.trim="data.terminalType" />
        </el-form-item>
      </el-col>
      <el-col :span="7" :xs="12">
        <el-form-item label="   厂商">
          <el-input v-model.trim="data.manufacturerName" />
        </el-form-item>
      </el-col>
      <el-col :span="7" :xs="12">
        <el-form-item label="检测状态">
          <el-select v-model="data.state" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="3" :xs="12">
        <el-button type="primary" size="mini" icon="el-icon-search" @click.native="doSearch">搜索</el-button>
        <!-- <el-button type="" plain icon="el-icon-circle-plus-outline" @click.native="toAddNew">新增</el-button> -->
        <!-- <el-button type="" plain icon="el-icon-circle-plus-outline" @click.native="batchDel">批量删除</el-button> -->
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: 1,
      default: () => {
        return {
          manufacturerName: '',
          state: '',
          terminalType: ''
        }
      }
    }
  },
  data() {
    return {
      data: { ...this.value },
      stateOptions: [{
        value: '',
        label: '全部'
      }, {
        value: 0,
        label: '待检'
      }, {
        value: 1,
        label: '已检'
      }]
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.$emit('input', { ...this.data })
      }
    }
  },
  methods: {
    doSearch() {
      this.$emit('onSearch')
    }
  }
}
</script>
