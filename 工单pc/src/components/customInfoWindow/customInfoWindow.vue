<template>
<div>
  <div class="customInfoWindow-box">
      <div class="info-header">
        <!-- <slot name="header" /> -->
        <div class="info-header-title">{{title}}</div>
      </div>
       <div class="info-marker">

      </div>
      <div class="info-cont">
        <slot name="cont" />
      </div>
      <span class="close-btn" v-show="isShowClose" @click="$emit('onClose')"><i class="iconfont icon-guanbi"></i></span>
  </div>
</div>
</template>
<script>
export default {
  props:{
    title:{
      type:String,
      default:""
    },
    isShowClose:{
      default:true,
      type:Boolean,
    }
  }
}
</script>
<style lang="less" scoped>
.close-btn{
  display: none
}
.customInfoWindow-box{
  position: relative;
  box-shadow: 3px 3px 10px #aaaaaa;
  background-color: #fff;
  .close-btn{
    display: block;    position: absolute;
    right: 5px;
    top:5px;
    color:#c3c3c3;
    cursor: pointer;
    &:hover{
      color: #1184E5;
    }
    .iconfont{
      
      font: bold 12px Tahoma,Verdana,sans-serif;
    }
  }
  .info-header-title{
    font-weight: 600;
        padding: 10px ;
  }
  .info-cont{
    position: relative;
  }
  .info-marker{
    height:10px;
    position: absolute;
    width: 10px;
    background-color: #fff;
    left:50%;
    bottom:0;
    transform-origin: 50% 50%;
    box-shadow:3px 3px 10px #aaaaaa;
    transform: rotate(-45deg) translate(-76%, -10%);
  }
}
</style>

