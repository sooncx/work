<template>
  <el-button :disabled="!isShow" size="mini" type="primary" :loading="isLoading" plain @click="doAjax">{{ data.title||'停止计时' }}</el-button>
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
      prevCount: 0,
      isLoading: false
    }
  },
  computed: {
    logData() {
      return this.$store.state.testFunction.logData
    },
    count() {
      const len = this.logData.length
      if (len === 0) return this.prevCount
      return this.logData[len - 1].count === undefined ? this.prevCount : this.logData[len - 1].count
    },
    isShow() {
      if (this.data.count === undefined) return false
      if (this.count >= this.data.count) return false
      return true
    },
    deviceData() {
      return this.$store.state.testFunction.deviceData
    }
  },
  watch: {
    count(val) {
      this.prevCount = val
    }
  },
  methods: {
    doAjax() {
      this.isLoading = true
      externButton({
        type: this.data.type,
        sim: this.deviceData.sim
      }).then(rst => {
        if (rst.code === 0) {
          this.$message({
            message: '下发成功',
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
 .displayInput-sp{
  vertical-align: middle;
  display: inline-block;
  padding:2px 5px;
  border:1px solid #ddd;
}
</style>
