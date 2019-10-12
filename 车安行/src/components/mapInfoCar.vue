<template>
  <div class="mapInfoCar-wrap">
    <div class="close-btn" @click="$emit('close')"><i class="iconfont icon-guanbi1"></i></div>
    <div class="info-row">
        <div class="info-title">车牌号：</div>
        <div class="info-cont">{{data.plate}}</div>
    </div>
    <div class="info-row">
        <div class="info-title">速度：</div>
        <div class="info-cont">{{data.speed||0}}km/h</div>
    </div>
    <div class="info-row">
        <div class="info-title">里程：</div>
        <div class="info-cont">{{data.mlileage}}km</div>
    </div>
    <div class="info-row" v-if="data.lastPower!==''">
        <div class="info-title">电量：</div>
        <div class="info-cont">{{data.lastPower}}%</div>
    </div>
    <div class="info-row">
        <div class="info-title">状态：</div>
        <div class="info-cont">{{data.formatTime}}</div>
    </div>
     
    <div class="info-row">
        <div class="info-title">信号时间：</div>
        <div class="info-cont">{{data.gpsTime}}</div>
    </div>
    <div class="info-row">
        <div class="info-title">定位时间：</div>
        <div class="info-cont">{{data.gpsTime}}</div>
    </div>
    <div class="info-row">
        <div class="info-title">定位方式：</div>
        <div class="info-cont">{{data.posTxt}}</div>
    </div>
    <div class="info-row" v-show="data.alarmInfo">
        <div class="info-title">报警：</div>
        <div class="info-cont">{{data.alarmInfo}}</div>
    </div>
    <div class="info-row" >
        <div class="info-title">地址：</div>
        <div class="info-cont">{{displayAddress||"获取中..."}}</div>
    </div>
   
  </div>
</template>
<script>
export default {
  props:{
    data:{
      type:Object,
      default:function(){
        return {
         
        }
      }
    }
  },
  data(){
    return{
       displayAddress:""
    }
  },
  methods:{
    getDisplayAddress(){
      CarUtil.getAddress(this.data.point).then(rst=>{
        this.displayAddress=rst
      }).catch(e=>{
        console.error(e);
        this.displayAddress="获取地址失败"
      })
    }
  },
  watch:{
    data:{
      deep:true,
      handler:function(val){
        if(val){
          this.getDisplayAddress()
        }
      }
    }
  }

}
</script>
<style lang="less" scoped>
.mapInfoCar-wrap{
  background: #fff;
  border-radius: 10px;
  border:1px solid #e5e5e5;
  padding: 35px 10px 10px 10px;
  width: 250px;
  position: relative;
  box-shadow:2px 2px 5px #999;
  
  &:after{
    background: #fff;
    position: absolute;
    content: "";
    left:50%;
    margin-left:-15px;
    display: block;
    height: 20px;
    width: 20px;
     border-right:1px solid #ddd;
    border-bottom:1px solid #ddd;
    transform: rotate(45deg);
    // box-shadow:0px 2px -10px #333333;
  }
  .close-btn{
    position: absolute;
    color: #999;
    right:10px;
    top:10px;
    >.iconfont{
      font-size: 14px;
    }
  }
}
.info-row{
  display: flex;
  .info-title{
    text-align: right;
    // padding-right: 5px;
    color: #666;
    width: 80px;
    font-weight: 600;
  }
  .info-cont{
    flex: 1
  }
}
</style>


