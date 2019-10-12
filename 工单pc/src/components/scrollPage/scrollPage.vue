<template>
  <div class="scrollPage">
    <happy-scroll size="6" 
             class="scrollTree"
            right
            color="rgba(55, 55, 55, .2)"
            resize
            ref="scroll"
            :scroll-top="scrollTop"   @vertical-end="handlerVerticalEnd">
            <div>
              <slot name="cont"></slot>
              <div class="loading" v-show="isShowLoading">
                loading
              </div>
            </div>
    </happy-scroll>
  </div>
</template>
<script>
export default {
  data(){
    return{
      scrollTop:0,
      isShowLoading:false
    }
  },
  methods:{
    handlerVerticalEnd(scrollTop){
      console.log("滚动到底部"+scrollTop)
    },
    reset(){
       this.$refs["scroll"]&&this.$refs["scroll"].setContainerSize()
    }
  }
}
</script>
<style lang="less" scoped>
.scrollPage{
  height: 100%;
}
</style>

