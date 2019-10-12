<template>
  <span>
    <el-button size="mini" type="primary" plain @click.native="onBtnClick">{{ data.title }}</el-button>

  </span>
</template>
<script>
import { isEmpty } from '@/utils/validate'
export default {
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    deviceData() {
      return this.$store.state.testFunction.deviceData
    },
    lensId() {
      if (this.data.data && this.data.data.lensId !== undefined) return this.data.data.lensId
      return this.$store.state.testFunction.activeFunction.function + '_WARN'
    }

  },
  methods: {
    onBtnClick() {
      if (isEmpty(this.lensId)) {
        this.$message({
          message: '请按照流程发送指令，发送指令后等待设备上传完成',
          type: 'warning'
        })
        return
      }

      this.$imgsShow.show({ imgList: [
        process.env.VUE_APP_BASE_API + 'api/multi/getMultiFileStream.json?multiType=1&sim=' + this.deviceData.sim + '&lens=' + this.lensId+'&checkLogId='+this.deviceData.checkLogId
      ] })
    }
  }
}
</script>

