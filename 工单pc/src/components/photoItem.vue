<!-- 基础加载地图  -->
<template>
  <div class="photoItem" ref="box">
      <div class="cont">
          <img v-lazy="imgSrc" @click="imgClick" alt="">
          <div class="date-toast">{{getLocalTime(data.crateTime)}}</div>
      </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui';
export default {
  props:{
    data:{
      type:Object,
      required:1
    },
    vehicleId:{
      type:[Number,String],
      required:1
    }
  },
  data() {
    return {
      LoadingService:null,
      imgBase64:null,
      imgSrc:this.HOST+"/http/Monitor/GetMultiForImgStream.json?vehicleId="+this.vehicleId+"&fileId="+this.data.crateTime
    };
  },
  mounted() {
    // this.LoadingService=Loading.service({
    //   target:this.$refs["box"]
    // })
   
  },
  methods: {
    getLocalTime(nS) {
      return dayjs(Number(nS)).format("YYYY-MM-DD/HH:mm:ss");     
    },
    imgClick(target){
      if(parent&&parent.iframeBigPicTure){
        parent.iframeBigPicTure(this.imgSrc)
      }else{
        this.$seeImage(target)
      }
      
    }
  }
};
</script>

<style lang="less"  scoped>
  .cont{
    display: inline-block;
    color: #fff;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 0;
    position: relative;
    padding-bottom: 75%;
    >.date-toast{
      position: absolute;
      bottom:0;
      left: 0;
      width: 100%;
      padding: 5px;
      background:rgba(0, 0, 0, 0.5);
      text-align: center;
    }
    img{
      position: absolute;
      left: 0;
      top:0;
      width: 100%;
      height: 100%;
    }
  }  
</style>
