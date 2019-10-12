<template>
  <img :src="curSrc" alt="" :title="curTitle">
</template>
<script>
export default {
  name: 'ImgLoading',
  props: {
    loadSrc: {
      type: String,
      default: require('@/assets/img/loading_img.gif')
    },
    src: {
      type: String,
      default: '',
      required: 1
    },
    title: {
      type: String,
      default: ''
    },
    errorSrc: {
      type: String,
      default: require('@/assets/img/load_img_error.png')
    }
  },
  data() {
    return {
      curSrc: this.loadSrc,
      status: 'loading'
    }
  },
  computed: {
    curTitle() {
      var result = ''
      switch (this.status) {
        case 'loading':
          result = '加载中...'
          break
        case 'success':
          result = this.title
          break
        case 'error':
          result = '加载图片失败'
          break
        default:
          break
      }
      return result
    }
  },
  created() {
    this.doLoadImg()
  },
  methods: {
    doLoadImg() {
      var img = new Image()
      img.src = this.src
      img.onload = () => {
        this.curSrc = this.src
        this.status = 'success'
      }
      img.onerror = () => {
        this.curSrc = this.errorSrc
        this.status = 'error'
      }
    }
  }
}
</script>
