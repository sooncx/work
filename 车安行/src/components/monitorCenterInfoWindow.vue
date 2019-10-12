<template>
  <div class="info-wrap">
      <div class="info-header">
          <span class="ver-ali-m title"><span v-if="data['_isGuanlian']">关联设备-</span>{{data.plate}}</span>
          <span  class="ver-ali-m" v-show="lvIcon" > <i class="iconfont  iconfontLV" :class="lvIcon"></i></span>
      </div>
      <div class="info-cont">
          <div class="info-row-box">
              <div class="info-row">
                  <span class="title">
                      速度：
                  </span>
                  <span class="right">
                      {{data.speed}}km/h
                  </span>
              </div>
              <div class="info-row">
                  <span class="title">
                      里程：
                  </span>
                  <span class="right">
                      {{data.mileage|filterMileage}}km
                  </span>
              </div>
          </div>
          <div class="info-row-box">
              <div class="info-row">
                  <span class="title">
                      定位：
                  </span>
                  <span class="right">
                      {{pos}}
                  </span>
              </div>
              <div class="info-row">
                  <span class="title">
                      {{statusTitle}}：
                  </span>
                  <span class="right">
                      {{data.stateKeepTime}}
                  </span>
              </div>
          </div>
          <div class="info-row">
              <span class="title">
                  信号时间：
              </span>
              <span class="right">
                  {{data.time || "--"}}
              </span>
          </div>
          <div class="info-row">
              <span class="title">
                  定位时间：
              </span>
              <span class="right">
                  {{data.PT || "--"}}
              </span>
          </div>
          <div class="info-row alarm-infoRow" v-show="displayAlarmTxt" >
              <span class="title">
                  报警：
              </span>
              <span class="right">
                  <div class="alarm-displayName">
                      <vuetextscroll  :text="displayAlarmTxt"></vuetextscroll>
                  </div>
              </span>
          </div>
      </div>
      <div class="info-fotBtns">
          <div class="fotBtns-item hvr-bob" v-for="item in fotBtnsList" @click="item.callBack(item)">
              <div>
                  <i  class="iconfont " :class="[item.value ?item.icon2:item.icon] "></i>
              </div>
              <div>{{item.value ? item.title2:item.title}}</div>
          </div>
      </div>
  </div>
</template>
<script>
import vuetextscroll from "@/components/vue-text-scroll";
  export default{
    props:{
      data:{
        type:Object,
        default:function(){
          return {}
        }
      }
    },
    components:{
      vuetextscroll
    },
    data(){
      return {
        fotBtnsList:[
          {
            title:"跟踪",
            title2:"取消跟踪",
            value:false,
            icon:"icon-genzong",
            icon2:"icon-guanzhudu",
            callBack:this.handlerGenzhong
          },
          {
            title:"轨迹",
            icon:"icon-guiji",
            callBack:this.handlerGenzhong
          },
          {
            title:"街景",
            icon:"icon-jiejing",
            callBack:this.handlerGenzhong
          },
          {
            title:"设置",
            icon:"icon-shezhi",
            callBack:this.handlerGenzhong
          },
          {
            title:"流量",
            icon:"icon-sim",
            callBack:this.handlerGenzhong
          },
          {
            title:"区域",
            icon:"icon-weizhi",
            callBack:this.handlerGenzhong
          },
          {
            title:"关注",
            icon:"icon-guanzhu",
            callBack:this.handlerGenzhong
          },
          {
            title:"基站",
            icon:"icon-guanzhu",
            callBack:this.handlerGenzhong
          },
        ]
      }
    },
    computed:{
      lvIcon(){
        switch(this.data.CL){
          case 1:
            return "icon-gao"
          break;
          case 2:
            return "icon-zhong"
          break;
          case 3:
            return "icon-di"
          break;
          default:
            return ""
        }
      },
      statusTitle(){
          var state;
          switch (this.data.Z) {
              case 0:
                  state = "离 线";
                  break;
              case 1:
                  state = "行 驶";
                  break;
              case 2:
                  state = "停 车";
                  break;
              case 3:
                  state = "从未上线";
                  break;
          }
          return state
      },
      displayAlarmTxt(){
        if(this.data.alarmObj){
          var name=this.data.alarmObj.name;
          if(this.data.alarmObj.alarmInfo){
            console.error("未完成二押点报警，进出区域报警")
          }
          return name
        }else{
          return ""
        }
      },
      pos(){
        return CarUtil.getPos(this.data);
      }
    },
    filters:{
      filterMileage(val){
        if(val){
            return parseInt(val/1000)
        }else{
          return 0
        }
      }
    },
    methods:{
      handlerGenzhong(){
        debugger
      }
    }

  }
</script>
<style lang="less" scoped>
@import "~assets/css/lessKey";
.info-wrap{
  .info-header{
      border-bottom:1px solid @c-bor;
      padding: 2px 5px 5px 0px;
      .title{
        font-weight: 600;
        font-size: 16px;
        color: #333;
      }
      .iconfont.iconfontLV{
        cursor: pointer;
        font-size: 17px;
      }
      
  }
  .info-cont{
    margin-top:8px;
  }
  .info-row-box{
    display: flex;
    margin-bottom:2px;
    >.info-row{
      flex: 1;
      margin-bottom: 0;
    }

  }
  .info-row{
    margin-bottom: 2px;
    min-width: 150px;
  }
  .info-fotBtns{
    margin-top: 8px;
    border-top:1px solid @c-bor;
    padding-top: 8px;
    display: flex;
    .fotBtns-item{
      width: 50px;
      line-height: 1.2;
      color: #4480D8;
      text-align: center;
      cursor: pointer;
    }
  }
  .alarm-infoRow{
     color: #F85151;
     display: flex;
     >.right{

       flex: 1;
       position: relative;
     
       .alarm-displayName{
         width: 100%;
       left: 0;
       top:0;
       }
      //  line-height: lef
     }

  }
}

</style>
