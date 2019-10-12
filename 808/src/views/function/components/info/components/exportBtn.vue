<template>
  <el-button size="mini" type="primary" plain :disabled="isDisabled" @click="doExport">{{ data.title||'导出Excel' }}</el-button>
</template>
<script>
import store from '@/store'
import downloadFile from '@/utils/downloadFile'
import { setTimeout } from 'timers'
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      isDisabled: false
    }
  },
  computed: {
    deviceData() {
      return this.$store.state.testFunction.deviceData
    }
  },
  methods: {
    doExport() {
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 2000)
      var downUrl = process.env.VUE_APP_BASE_API + this.data.url || process.env.VUE_APP_BASE_API + '/api/externButton/button.json'
      downloadFile(downUrl + '?sessionId=' + store.getters.sessionId + '&sim=' + this.deviceData.sim + '&type=' + this.data.type)
    }
  }
}
</script>

