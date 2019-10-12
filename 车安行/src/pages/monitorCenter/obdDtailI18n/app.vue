<template>
  <div  class="app-wrap">
    <div class="obdVue-wrap">
      <div class="tab-header">
        <div class="col-left">
            <div class="h-title">{{$t("BYLANG_1")}}</div>
            <div class="refresh-control" v-if="isInit">
              <div class="refresh-time clr">
                  <template v-if="!isRefreshIng">
                     <span class="fr">秒后刷新</span>
                      <span class="count c-blue fr">{{refreshTime}}</span>
                  </template>
                  <template v-else>
                      {{$t("BYLANG_2")}}
                  </template>
                 
              </div>
              <div class="refresh-btn" :class="[isRefreshIng?'resfreshIng':'']" @click="doRefreshTime">
                    <i class="iconfont icon-refresh1"></i>
              </div>
               <transition name="el-fade-in">
                <div class="refresh-msg" v-show="isShowRefreshMsg" :class="[errorMsg?'error':'']">
                      {{!errorMsg?$t("BYLANG_3"):$t("BYLANG_4")}}
                </div>
              </transition>
            </div>
        </div>
        <div class="col-right">
          <div class="closeLayer-btn" @click="doCloseLayer()">
            <i class="iconfont icon-guanbi1"></i>
          </div>
        </div>
      </div>
      <div class="tab-cont" :class="[errorMsg&&!isLoading?'error-wrap':'']" v-loading="isLoading"  :element-loading-text="$t('BYLANG_5')" >
          <template v-if="!errorMsg">
            <section class="obdDetail-chunk">
              <div class="chunk-title">{{$t("BYLANG_6")}}</div>
              <div class="chunk-cont">
                 <div class="detail-row" v-if="plate">
                  <div class="detail-title">
                      {{$t("BYLANG_7")}}
                  </div>
                  <div class="detail-cont">{{plate}}</div>
                </div>
                <div class="detail-row" v-for="(item,key) in basicListKey" :key="key">
                  <div class="detail-title">
                      {{item.title}}：
                  </div>
                  <div class="detail-cont">{{displayData[key]||"--"}}</div>
                </div>
              </div>
            </section>
            <section class="obdDetail-chunk" v-if="false">
                <div class="chunk-title">{{$t("BYLANG_8")}}</div>
                <div class="chunk-cont">
                  <div class="detail-row" v-for="(item,key) in obdCarInfoListKey" :key="key">
                    <div class="detail-title">
                        {{item.title}}：
                    </div>
                    <div class="detail-cont">{{displayData["obdCarInfo"]&&displayData["obdCarInfo"][key]?displayData["obdCarInfo"][key]:'--'}}</div>
                  </div>
                </div>
            </section>
          </template>
          <template v-if="errorMsg">
              <div class="error-box">
                  <img :src="errorImg" width="100" alt="">
                  <div class="p-msg">{{errorMsg}},{{$t("BYLANG_9")}}<span class="c-blue reset-btn" @click="init">{{$t("BYLANG_10")}}</span></div>
              </div>
          </template>
      </div>
    </div> 
  </div>
</template>

<script>
export default {
  data() {
    return {
      plate:getQueryString("plate"),
      vehicleId:getQueryString("vehId"),
      isLoading:false,
      isInit:false,
      errorMsg:"",
      data:{},
      basicListKey:{
          barometricPressure:{
            title:this.$t("BYLANG_11")
          },
          engineErrorNum:{
            title:this.$t("BYLANG_12")
          },
          engineLoad:{
            title:this.$t("BYLANG_13")
          },
          engineRPM:{
            title:this.$t("BYLANG_14")
          },
          engineRunTime:{
            title:this.$t("BYLANG_15"),
            unit:"s"
          },
          environmentTemperature:{
            title:this.$t("BYLANG_16"),
            unit:"℃"
          },
          faultMileage:{
            title:this.$t("BYLANG_17")
          },
          fuelLevel:{
            title:this.$t("BYLANG_18"),
            unit:"%"
          },
          fuelPressure:{
            title:this.$t("BYLANG_19")
          },
          fuelTrim:{
            title:"长期燃油修正"
          },
          intakePressure:{
            title:"进气歧管压力"
          },
          lampStatus:{
            title:"故障码灯状态"
          },
          mileageType:{
            title:"里程类型"
          },
          pedalPosition:{
             title:"油门踏板位置"
          },
          sensorAir:{
            title:"空气流量"
          },
          sparkAngle:{
            title:"点火提前角"
          },
          speed:{
            title:"速度",
            unit:"km/h"
          },
          temperatureAir:{
            title:"进气口温度",
            unit:"℃"
          },
          temperatureCoolant:{
            title:"水箱温度",
            unit:"℃"
          },
          throttleSensor:{
            title:"	绝对节气门位置传感器"
          },
          totalConsumption:{
            title:"总的燃油油耗能量"
          },
          totalMileage:{
            title:"总里程"
          },
          voltage:{
            title:"电瓶电压",
            unit:"V"
          },
      },
      obdCarInfoListKey:{
        acc:{
          title:"acc状态",
          type:"acc"
        },
        guard:{
          title:"设防/撤防",
           type:"defend"
        },
        lbd:{
          title:"左后门"
        },
        lbl:{
          title:"左后锁"
        },
        lbw:{
          title:"左后窗"
        },
        lfd:{
          title:"左前门"
        },
         lfl:{
           title:"左前锁"
         },
         lfw:{
           title:"左前窗"
         },
         rbd:{
          title:"右后门"
         },
         rbl:{
           title:"右后锁"
        },
        rbw:{
          title:"右后窗"
        },
         rfd:{
           title:"右前门"
         },
         rfl:{
           title:"右前锁"
         },
          rfw:{
           title:"右前窗"
         },
         trunkD:{
           title:"关后备箱"
         },
         trunkLock:{
           title:"后备箱锁"
         }
      },
      errorImg:require("@/assets/img/error.svg"),
      refreshTime:10,
      refreshTimer:null,
      isRefreshIng:false,
      isShowRefreshMsg:false
    };
  },
  created(){
    this.init();
  },
  computed:{
    displayData(){
      var result={}
      Object.keys(this.data).map(key=>{
          var val=this.data[key];
          var item=this.basicListKey[key]||{}
          switch(key){
            case "engineRunTime": //发动机启动后运行时间(s)
              result[key]=this.formatStartTime(val)
              break;
            case "totalMileage": //里程 故障行驶里程
            case "faultMileage":
              result[key]=this.formatMileage(val)
              break; 
            case "obdCarInfo":
              result[key] = this.genObdCarInfo()
              break;
            default:
              result[key]= ((val!==undefined&&val!==null)?val+(item.unit||""):"--")
          }
      });
      return result
    }
  },
  methods: {
    init(){
      this.getOBDVehicleInfo();
    },
    formatStartTime(val){ //秒转成时分秒格式
      if(isNaN(val)){
        return val
      }
      var theTime = parseInt(val);// 秒  
      var theTime1 = 0;// 分  
      var theTime2 = 0;// 小时  
      if(theTime > 60) {  
          theTime1 = parseInt(theTime/60);  
          theTime = parseInt(theTime%60);  
              if(theTime1 > 60) {  
              theTime2 = parseInt(theTime1/60);  
              theTime1 = parseInt(theTime1%60);  
              }  
      }  
          var result = ""+parseInt(theTime)+"秒";  
          if(theTime1 > 0) {  
          result = ""+parseInt(theTime1)+"分"+result;  
          }  
          if(theTime2 > 0) {  
          result = ""+parseInt(theTime2)+"小时"+result;  
          }  
      return result;  
    },
    formatMileage(val){ //米转成公里
        if(isNaN(val)){
          return val
        }
        var kmSize=1000;
        var theMeter=parseInt(val);
        if(theMeter>=kmSize){
          return (theMeter/kmSize).toFixed(2)+"公里"
        }else{
          return  theMeter+"米"
        }
    },
    genObdCarInfo(){ //计算车身详细显示
      var result={}
      var infoData=this.data["obdCarInfo"]||{}
      Object.keys(this.obdCarInfoListKey).map(key=>{
        var item=this.obdCarInfoListKey[key];
        var val=infoData[key];
        if(val!==undefined&&val!==null){
            if(isNaN(val)){
                result[key]=val
            }else{
              var val_number=Number(val)
              switch(item.type){
                case "defend":
                  if(val===0){
                    result[key]="撤防"
                  }else{
                     result[key]="设防"
                  }
                  break;
                default:
                  if(val===0){
                    result[key]="关"
                  }else{
                     result[key]="开"
                  }
              }
            }
            
        }else{
          result[key]="--"
        }
      })
      return result
    },
    getOBDVehicleInfo(isRefresh=false){ 
        if(!isRefresh){
          this.isInit=false
          this.isLoading=true
          this.$set(this,"data",{})
        }else{
          this.isRefreshIng=true
        }
        this.errorMsg=""
        return new Promise((succCall,failCall)=>{
            this.$http({
              url:this.HOST+"/http/vehicle/getOBDVehicleInfo.json",
              // url:"http://120.77.58.193:10111/mockjsdata/31/http/vehicle/getOBDVehicleInfo.json",
              params:{
                vehicleId:this.vehicleId
              }
            }).then(rst=>{
              if(rst&&rst.flag===1){
                this.isInit=true
                this.errorMsg="";
                this.$set(this,"data",rst.obj||{});
                if(!isRefresh){
                  this.startRefreshTime()
                }
              }else{
                this.errorMsg=rst.msg
              }
              if(!isRefresh){
                this.isLoading=false
              }else{
                this.isRefreshIng=false
              }
              succCall(rst)
            }).catch(e=>{
              // var rst={
              //       "flag": 1,
              //       "msg": "请求成功",
              //       "obj": {
              //           "barometricPressure": 0,
              //           "engineErrorNum": 0,
              //           "engineLoad": 0,
              //           "engineRPM": 0,
              //           "engineRunTime": 0,
              //           "environmentTemperature": 0,
              //           "faultMileage": 0,
              //           "fuelLevel": 0,
              //           "fuelPressure": 0,
              //           "fuelTrim": 0,
              //           "intakePressure": 0,
              //           "lampStatus": 0,
              //           "mileageType": 0,
              //           "obdCarInfo": {
              //               "acc": 0,
              //               "guard": 0,
              //               "lbd": 0,
              //               "lbl": 0,
              //               "lbw": 0,
              //               "lfd": 0,
              //               "lfl": 0,
              //               "lfw": 0,
              //               "rbd": 0,
              //               "rbl": 0,
              //               "rbw": 0,
              //               "rfd": 0,
              //               "rfl": 0,
              //               "rfw": 0,
              //               "trunkD": 0,
              //               "trunkLock": 0
              //           },
              //           "pedalPosition": 0,
              //           "sensorAir": 0,
              //           "sparkAngle": 0,
              //           "speed": 0,
              //           "temperatureAir": 0,
              //           "temperatureCoolant": 0,
              //           "throttleSensor": 0,
              //           "totalConsumption": 0,
              //           "totalMileage": 0,
              //           "voltage": 0
              //       }
              //   }
            //  this.errorMsg="";
            //    this.$set(this,"data",rst.obj)
             
              this.isLoading=false
              this.isRefreshIng=false
              this.errorMsg="网络异常，请稍后再试"
               failCall(e)
            });
        })
    },
    doCloseLayer() {
      if (parent.ObdDetailManage) {
        parent.ObdDetailManage.close();
      }
    },
    startRefreshTime(){//开始倒计时刷新
      this.clearRefreshTime();
      if(this.refreshTime===0){
        this.refreshTime=10
      }
      this.refreshTimer=setTimeout(()=>{
        this.refreshTime--;
        if(this.refreshTime===0){
          this.doRefreshTime()
        }else{
          this.startRefreshTime()
        } 
      },1000)
    },
    clearRefreshTime(){ //请吃倒计时刷新
      this.refreshTimer&&clearTimeout(this.refreshTimer)
    },
    doRefreshTime(){ //刷新
      if(this.isRefreshIng){
        return
      }
      this.clearRefreshTime()
      this.refreshTime=10
      this.getOBDVehicleInfo(true).then(rst=>{
        if(rst.flag===1){
          this.doShowRefreshError()
          this.startRefreshTime()
        }
      }).catch(e=>{
        // this.doShowRefreshError()
        // this.startRefreshTime()
      })
      
    },
    doShowRefreshError(){ //显示刷新失败的ui
      this.isShowRefreshMsg=true;
      this.ShowRefreshMsgTimer&&clearTimeout(this.ShowRefreshMsgTimer)
      this.ShowRefreshMsgTimer=setTimeout(()=>{
        this.isShowRefreshMsg=false
      },2000)
    }
  }
};
</script>
<style lang="less">

@import "~@/assets/css/style";
</style>

<style lang="less" >
@import "~@/assets/css/lessKey";
body{
  background-color: #ffffff;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clr:after{
  content:"";
  display:block;
  clear:both;
}
.app-wrap{
  height: 100%;

}
.obdVue-wrap {
  display: flex;
     flex-direction: column;
     height: 100%;
     width:100%;
     font-size:12px;
     .tab-cont{
       flex:1;
       &.error-wrap{
            justify-content: center;
          display: flex;
          flex-direction: column;
       }
     }
     .detail-row{
       display:flex;
       width:50%;
       float: left;
       align-items: center;
       >.detail-title{
         width:140px;
         text-align:right;
         line-height:28px;
         color:#999;
       }
       >.detail-cont{
         flex:1;
         padding: 0 5px
       }
     }
     
     .obdDetail-chunk{
       >.chunk-cont{
         background-color:#fff;
         padding:10px 0;
         &:after{
           display:block;
           clear:both;
           content:"",
         }
       }
        >.chunk-title{
        clear: both;
        padding:6px 20px;
        background-color: #F2F2F2;
            color: #333;
      }
     }
     .error-box{
        align-self: center;
        margin-top:-100px;
        text-align:center;
        .reset-btn{
          cursor: pointer;
        }
        .p-msg{
          margin-top:10px;
        }
     }
     
}
.tab-header {
  padding: 10px 20px;
  display: flex;
      align-items: center;
  .col-left{
    flex:1;
    display: flex;
        align-items: center;
    .refresh-control{
      margin-left:40px;
      display:flex;
          align-items: center;
          .refresh-time{
            width:70px;
            text-align:right;
          }
          .refresh-btn{
            height: 20px;
            width:20px;
            text-align:center;
            line-height:20px;
            margin-left:10px;
            background-color:#DDEEFD;
            &.resfreshIng{
              .iconfont{
                display:block;
                -webkit-animation-fill-mode:both;
                 animation:refreshRotate 2s infinite linear ;
              }
            }
            .iconfont{
              font-weight:600;
              color:#5BA7EA;
              font-size:12px;
            }
          }
          .refresh-msg{
              margin-left:10px;
              color:#67c23a;
              &.error{
                color:#f56c6c
              }
          }
          
    }
  }
  .h-title{
    font-size:14px;
    font-weight:600
  }
  >.col-right{
    flex: 1;
    display:flex;
    justify-content: flex-end;
  }
}
.closeLayer-btn{
  margin-left:10px;
  line-height:26px;
  cursor: pointer;
  &:hover{
    color:#20A1FF
  }
}
.tabTitle-box.fl{
  float: left;
  +.tabTitle-box.fl{
    margin-left:@SPACE_SIZE4;
  }
}

@-webkit-keyframes refreshRotate{
        0%{ transform:rotate(0deg); }
        100%{ transform:rotate(360deg); }
    }
</style>


