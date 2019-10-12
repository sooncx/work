<template>
  <span>
    <el-button size="mini" type="primary" plain @click.native="onBtnClick">{{ data.title }}</el-button>
    <transition name="el-fade-in">
      <div v-if="videoDialogVisible" class="video-dia">
        <div class="video-cont" :style="diaStyleObj">
          <vueVideo :data="videoData" />
        </div>
        <div class="video-dia-task">
          <svg-icon class="video-dia-close-btn" icon-class="close" @click="closeVideoDia" />
        </div>
      </div>
    </transition>
  </span>
</template>
<script>
import vueVideo from '@/components/vueVideo/vueVideo'
import { isEmpty } from '@/utils/validate'
export default {
  components: { vueVideo },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      videoDialogVisible: false

    }
  },
  computed: {
    videoData() {
      return {
        sources: [{
          src: process.env.VUE_APP_BASE_API + 'api/multi/getMultiFileStream.json?multiType=2&sim=' + this.deviceData.sim + '&lens=' + this.lensId+'&checkLogId='+this.deviceData.checkLogId,
          type: 'video/mp4'
        }],
        poster: '//vjs.zencdn.net/v/oceans.png',
        options: {
          width: '400px',
          height: '300px'
        }
      }
    },
    deviceData() {
      return this.$store.state.testFunction.deviceData
    },
    diaStyleObj() {
      return {
        width: this.videoData.options.width, height: this.videoData.options.height
      }
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
      this.openVideoDia()
    },
    openVideoDia() {
      this.videoDialogVisible = true
    },
    closeVideoDia() {
      this.videoDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.video-dia{
  height: 100%;
  width: 100%;
  position:fixed;
  left:0px;
  top:0px;
  z-index: 999999;
  >.video-cont{
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%)
  }
  >.video-dia-task{
      height: 100%;
  width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .video-dia-close-btn{
    position: absolute;
   font-size: 24px;
   width: 24px;
   height: 24px;
    right: 18px;
    cursor: pointer;
    top: 18px;
  }
}
</style>

