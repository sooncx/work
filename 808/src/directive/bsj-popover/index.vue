<template>
  <div v-show="isShow" ref="box" class="bsj-popover" :style="{left,top}" @mouseout="onMouseout" @mouseover="onMouseover">
    <div class="bsj-popover-title">详情</div>
    <div v-html="displayData.remark" />
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      isShow: false,
      displayData: {},
      left: 0,
      top: 0,
      isHover: false
    }
  },
  methods: {
    show({ data, event }) {
      this.displayData = Object.assign({}, data)
      this.displayData.remark = this.getPopverRemark(this.displayData.remark)
      this.isShow = true
      this.$nextTick(() => {
        const clientWidth = document.body.clientWidth
        // const clientHeight = document.body.clientHeight
        const boxWidth = this.$refs['box'].offsetWidth
        const boxHeight = this.$refs['box'].offsetHeight
        // let left=

        const tarentClientRect = event.target.getBoundingClientRect()
        tarentClientRect.x = tarentClientRect.left
        tarentClientRect.y = tarentClientRect.top
        console.log('clientWidth', clientWidth, 'tarentClientRect', tarentClientRect)
        const left = Number(tarentClientRect.x) + Number(boxWidth) > Number(clientWidth) ? clientWidth - 20 - Number(boxWidth) : Number(tarentClientRect.x)
        const top = Number(tarentClientRect.y) - Number(boxHeight) - 10

        this.left = left + 'px'
        this.top = top + 'px'
      })
    },
    onMouseout() {
      this.isHover = false
      this.hide()
    },
    onMouseover() {
      this.isHover = true
    },
    hide() {
      if (this.isHover) {
        return
      }
      this.isShow = false
    },
    getPopverRemark(val) { // 多行超出以省略号显示
      const maxLen = 570
      if (val.length > maxLen) {
        val = val.substring(0, maxLen) + '...'
      }
      return val
    }
  }
}
</script>

<style lang="scss" scoped>
.bsj-popover{
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          color: #606266;
  position: fixed;
  width: 400px;
  word-wrap:break-word;
  background-color: #fff;
  z-index: 99999999;
  border-radius: 5px;
  font-size: 12px;
  padding:10px;
  border:1px solid #dedede;
  &:after{
    position: absolute;
    content: "";
    border:1px solid #dedede;
    height:10px;
    width:10px;
    transform: rotate(45deg);
    bottom:-5px;
    left:70%;
    border-top: none;
    border-left:none;
    background: #fff;
  }
  .bsj-popover-title{
        color: #303133;
    font-size: 16px;
    line-height: 1;
    margin-bottom: 12px;
  }
}
</style>
