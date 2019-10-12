<template>
  <el-button size="mini" type="primary" :loading="isLoading" plain @click="doLookLog">查看系统日志</el-button>
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
      isLoading: false
    }
  },
  computed: {
    deviceData() {
      return this.$store.state.testFunction.deviceData
    }
  },
  methods: {
    doLookLog() {
      this.isLoading = true
      externButton({
        type: this.data.type,
        sim: this.deviceData.sim
      }).then(rst => {
        if (rst.code === 0) {
          this.$message({
            message: '下发成功，下方红色标注即为系统日志',
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

