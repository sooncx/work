<template>
  <span class="setMemorySize-box">
    <el-input v-model.trim="value" class="inline-input" :placeholder="data.data.placeholder" size="mini">
      <template v-if="data.data.append" slot="append">{{ data.data.append }}</template>
    </el-input>
    <el-button plain size="mini" type="primary" :loading="isLoading" :disabled="!value" @click.stop="submitMemorySize">提交 </el-button>
  </span>
</template>

<script>
import { externButton } from '@/api/testFunction'
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      value: '',
      isLoading: false
    }
  },
  computed: {
    deviceData() {
      return this.$store.state.testFunction.deviceData
    }
  },
  methods: {
    submitMemorySize() {
      if (isNaN(this.value)) {
        this.$message({
          type: 'error',
          message: '请输入数字'
        })
      } else if (Number(this.value) < 8) {
        this.$message({
          type: 'error',
          message: '不能少于8G，请重新输入'
        })
      } else {
        this.doAjax()
      }
    },
    doAjax() {
      this.isLoading = true
      externButton({
        type: this.data.type,
        sim: this.deviceData.sim,
        data: {
          storageSize: this.value
        }

      }).then(rst => {
        if (rst.code === 0) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        }
        this.isLoading = false
      }).catch(e => {
        this.isLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.setMemorySize-box{
  display:flex
}
</style>

