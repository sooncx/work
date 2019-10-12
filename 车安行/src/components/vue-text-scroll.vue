<template>
  <div class="textScroll-wrap">
      <div class="textScroll-cont">
         
        <slot>
           <div v-html="text">
              
          </div>
        </slot>
      </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String
    }
  }
};
</script>
<style lang="less" scoped>
.textScroll-wrap {
  width: 100%;
  overflow: hidden;
}
</style>
