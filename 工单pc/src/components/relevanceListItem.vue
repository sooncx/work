<template>
  <div class="relevanceItem" :class="statusCls" >
      <el-popover
        placement="right-start"
        trigger="hover"
        >
        <div class="popover-cont">
            <div class="relevanceItem-popover" v-if="mainData.vehicleId === data.vehicleId">
                  <div class="mainmsg">
                    当前设备是目标设备
                  </div>
            </div>
            <div v-else  class="relevanceItem-popover">
                <div class="row">
                <span class="title">信号时间：</span>   
                <span class="col-right">{{data.time}}</span>
              </div>
              <div class="row">
                <span class="title">定位：</span>   
                <span class="col-right">{{displayPos}}</span>
              </div>
              <div class="row">
                <span class="title">车辆状态：</span>   
                <span class="col-right">{{statusTime}}{{data.D}}</span>
              </div>
              <div class="row" v-show="data.sDisance">
                <span class="title">距离目标设备：</span>   
                <span class="col-right">{{data.sDisance}}</span>
              </div>
            </div>
            
        </div>
        <div slot="reference">
            <i class="iconfont " :class="iconCls"></i>
            <span>{{data.plate}}</span>
            <span class="statusTime">({{statusTime}}){{data.D}}</span>
        </div>
      </el-popover>
  </div>
</template>
<script>
export default {
  props:{
    data:{
      type:Object,
    },
    mainData:{
      type:Object
    }
  },
  computed: {
    iconCls(){
      var resutlIcon=""
       if (this.data["_isCurrent"]) {
            resutlIcon = "icon-zhuche"
        }else{
          resutlIcon= "icon-che"
        }
        return  resutlIcon
    },
    statusCls() {
      var statusCls="";
      switch(this.data.Z){
        case 0:
            statusCls="color-lixian";
            break;
        case 1:
        case 2:
             statusCls="color-shangxian";
            break;
        default:
          statusCls="color-guoqi"
      }
      return statusCls;
    },statusTime() {
     return  CarUtil.getMapStatusTxt(this.data)
    },
    displayPos(){
      return CarUtil.getPos(this.data)
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/lessKey";
.relevanceItem{
      color: #ADADAD;    cursor: no-drop;
  white-space: nowrap;
  padding:2px @SPACE_SIZE2;
}
.relevanceItem.color-shangxian:hover{
  color:#333
}
.relevanceItem.color-lixian{
  cursor: pointer;
}
.relevanceItem.color-lixian:hover{
  color:#000
}
.relevanceItem.color-lixian{color:#333;}
.relevanceItem.color-shangxian{color: #4CA1E7;cursor: pointer;}
.relevanceItem.color-shangxian{color: #4CA1E7;cursor: pointer;}
.relevanceItem-popover{
  font-size: 12px;
    color: #333;
  .title{
    font-weight: 600;
  }
}
</style>
