<template>
  <div class="p-title">
    <div class="col-title">{{ title }}</div>
    <!-- <span class="col-hr" /> -->
    <span class="col-right">
      <slot name="right" /></span>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
$c-green:#1890ff;
.p-title{
  color: $c-green;
 padding-left: 10px;
 position: relative;
 font-size: 14px;
 display: flex;
 align-items: center;
 &::before{
   display: block;
   height: 14px;
   width: 3px;
   background-color:$c-green;
   content: "";
   position: absolute;
   left: 0px;top:50%;
   transform: translate(0,-50%)
 }
//  .col-hr{
//    flex: 1;
//    margin-left:20px;
//    position: relative;
//    &::before{
//      position: absolute;
//      left:0;top:50%;
//      transform: translate(0,-50%);
//       content: '';
//       height: 0;
//       width: 100%;
//       border-top:1px dotted $c-green;
//    }
//  }
}
</style>

