<template>
  <div class="carInfo" :class="statusCls">
    <content-loader class="loaderCont" v-if="!isInitData"
        :height="160"
        :width="400"
        :speed="2"
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
    >
      <rect x="28" y="77.75" rx="3" ry="3" width="39" height="22.56" /> 
      <rect x="86.26" y="75.22" rx="3" ry="3" width="307.11" height="25.79" /> 
      <rect x="26" y="118.96" rx="3" ry="3" width="95.67" height="32.11" /> 
      <rect x="283" y="114.96" rx="3" ry="3" width="95.67" height="32.11" /> 
      <rect x="150" y="114.96" rx="3" ry="3" width="95.67" height="32.11" /> 
      <rect x="25" y="34.75" rx="3" ry="3" width="39" height="22.56" /> 
      <rect x="85.26" y="35.22" rx="3" ry="3" width="307.11" height="25.79" /> 
      <rect x="24" y="0.75" rx="3" ry="3" width="85.41" height="22.56" /> 
      <rect x="153" y="-1.25" rx="3" ry="3" width="39" height="22.56" /> 
      <rect x="204" y="-0.25" rx="3" ry="3" width="39" height="22.56" /> 
      <rect x="249.75" y="6.53" rx="0" ry="0" width="0" height="0" /> 
      <rect x="268" y="-1.25" rx="3" ry="3" width="78.78" height="22.56" />
    </content-loader>
        <div  class="carInfoCont" :class="{'inited':isInitData}">

            <div class="header">
                <div class="col-title col" @click="onSelect">{{data.name}}</div>
                <div class="col-state col"  @click="onSelect" :class="{'online':data.statusText=='在线'}">
                    <span class="car-state-sp">{{data.statusText}}</span>
                </div>
                <div class="col-type col"  @click="onSelect">
                    <span class="iconfont ver-ali-m" :class="{'icon-budingwei-':data.locateMode=='不定位','icon-GPS-':data.locateMode=='GPS','icon-WIFI-':data.locateMode=='WIFI','icon-duojizhan-':data.locateMode=='多基站','icon-danjizhan-':data.locateMode=='单基站'}"></span>
                </div>
                <div class="col-dianliang  col" v-show="data.isLowTension>0"  @click="onSelect">
                    <span class="flash" :class="{'mandian':data.isLowTension==1,'dianchi':data.isLowTension==2,'meidian animated':data.isLowTension==3}">
                        <i class="iconfont ver-ali-m" :class="{'icon-man-1':data.isLowTension==1,'icon-que-1':data.isLowTension==2,'icon-meidian-1':data.isLowTension==3}"></i>
                    </span>
                </div>
                <div class="col-right">
                    <div class="col-close" @click="$emit('close')">
                        <i class="iconfont icon-suoxiao"></i>
                    </div>
                </div>
            </div>
            <div class="row-chunk" v-if="data.B"  @click="onSelect">
                <div class="row-title red">
                    报警：
                </div>
                <div class="row-cont red">
                  <my-marquee class="wen-oh address-p" :lists="JSON.parse(data.B).name"></my-marquee>
                </div>
            </div>
            <div class="row-chunk" v-else  @click="onSelect">
                <div class="row-title red">
                   <br/>
                </div>
                <div class="row-cont red">
                    
                </div>

            </div>
            <div class="row-chunk"  @click="onSelect">
                <div class="row-title">
                    信号：
                </div>
                <div class="row-cont">
                    {{data.R}}
                </div>
            </div>
            <div class="row-chunk"  @click="onSelect">
                <div class="row-title">
                    位置：
                </div>
                <div class="row-cont">
                  <span class="wen-oh address-p" v-if="displayAddress==''" >未获取到地理位置</span>
                  <my-marquee class="wen-oh address-p" v-else :lists="displayAddress"></my-marquee>
                </div>
            </div>
            <div class="row-chunk" v-if="data.Z==1||data.Z==2">
                <div class="row-title">
                    最后定位时间：
                </div>
                <div class="row-cont">
                  <span class="wen-oh address-p">{{data.timeago}}</span>
                </div>
            </div>
            <div class="row-chunk" v-else>
                <div class="row-title">
                  状态：
                </div>
                <div class="row-cont">
                  <span class="wen-oh address-p">{{data.timeago}}</span>
                </div>
            </div>
            <div class="fot-chunk">
                <div class="col">
                    <XButton  type="primary" @click.native="toLocation">
                      <i class="iconfont icon-shuaxin1" :class="{'xuanzhun':timer!=30}"></i>
                        刷新
                    </XButton>
                </div>
                <div class="col">
                    <XButton plain class="btn-plain-default" @click.native="toNavigation">
                        <i class="iconfont icon-guiji"></i>
                        导航
                    </XButton>
                </div>
                <div class="col col-3" @click="$emit('clickMore')">
                        <i class="iconfont icon-quanbu"></i>
                        <span class="ver-ali-m">更多</span>
                </div>
            </div>
        </div>
  </div>
</template>
<script>
import { ContentLoader, FacebookLoader } from "vue-content-loader";
import { defaultCoreCipherList } from "constants";
import myMarquee from "@/components/my-marquee";
export default {
  props: {
    data: {
      type: Object
    }
  },
  components: {
    FacebookLoader,
    ContentLoader,
    myMarquee
  },
  data() {
    return {
      displayAddress: "获取中...",
      uuid: "",
      timer: 30
    };
  },
  computed: {
    isInitData() {
      if (this.data && JSON.stringify(this.data) !== "{}") {
        return true;
      } else {
        return false;
      }
    },
    statusCls() {
      return CarUtil.getStatusCls(this.data);
    }
  },
  created() {
    this.getGeo(this.data.point);
  },
  methods: {
    onSelect(){
      this.$emit("onSelect")
    },
    getGeo(val) {
      CarUtil.getAddress(val).then(address => {
        if(this.data.locateMode&&this.data.locateMode.indexOf('基站')!=-1){
          this.displayAddress = address.replace("[", "").replace("]", "")+"(模糊定位)";
        }else{
          this.displayAddress = address.replace("[", "").replace("]", "");
        }
      });
    },
    toLocation() {
      if (this.timer != 30) {
        return false;
      }
      console.log("刷新...");
      this.$api
        .CommandDown({
          commandType: "NAMED",
          commandMsg: "",
          vehicleId: this.data.vehicleId
        })
        .then(rst => {
          if (rst.flag === 1) {
            this.uuid = rst.obj.uuid;
            this.$vux.toast.show("下发成功，请等待设备响应");
            this.GetCommandResult();
          } else {
            this.$vux.toast.show(rst.msg);
          }
          this.isLoading = false;
        })
        .catch(e => {
          this.$vux.toast.show(this.ERROR_MSG);
          this.isLoading = false;
        });
    },
    toNavigation() {
      if(this.data.Z==3){
            this.$vux.toast.show("设备未启用");
        return false;
      }
      if(this.data.Z==4){
            this.$vux.toast.show("设备已过期");
        return false;
      }
      this.$router.push({
        name: "navigation",
        params: {
          carData: this.data
        }
      });
    },
    cmdSuccessCall(){ //设备刷新成功后
      this.$app.updateVehicleList().then(rst=>{
        if(rst.flag ===1){
           this.$vux.toast.show("刷新成功");
        }else{
          this.$vux.toast.show("刷新失败");
        }
      });
    },
    GetCommandResult() {
      let _this = this;
      if (_this.timer > 0) {
        setTimeout(function() {
          _this.$api
            .GetCommandResult({
              id: _this.uuid,
              terminalNo: _this.data.terminalNo
            })
            .then(rst => {
              _this.timer -= 2;
              console.log(_this.timer);
              if (rst.flag === 1) {
                console.log("设备刷新成功，本地加载api刷新之前");
               _this.cmdSuccessCall()
                _this.timer = 30;
              } else if (rst.flag === 2) {
                _this.GetCommandResult();
              } else {
                _this.GetCommandResult();
                console.log(rst.msg);
                // this.$vux.toast.show(rst.msg);
              }
            })
            .catch(e => {
              console.error(e)
              _this.timer--;
              _this.GetCommandResult();
              _this.$vux.toast.show(_this.ERROR_MSG);
            });
        }, 2000);
      } else {
        _this.timer = 30;
      }
    }
  },
  watch: {
    "data.point": {
      handler(val) {
        this.getGeo(val);
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/common/less/lessKey.less";
.carInfo {
  padding: @SPACE_SIZE @SPACE_SIZE2;
  position: relative;
  .loaderCont {
    position: absolute;
  }
  .carInfoCont {
    opacity: 0;
    &.inited {
      opacity: 1;
    }
  }
  .header {
    display: flex;
    align-items: center;
    > .col + .col {
      margin-left: @SPACE_SIZE2;
    }
    .col-title {
      color: #333;
      font-weight: 600;
      font-size: 15px;
    }
    .online {
      span {
        color: #1afa29;
      }
      .car-state-sp::before {
        background: #1afa29;
      }
    }
    .car-dianliang-sp {
      //   color: #999999;
      // &.c-red {
      //   color: @c-red;
      // }
    }
    .col-dianliang {
      vertical-align: middle;
      .mandian {
        color: #1afa29;
        i::before {
          color: #1afa29;
        }
        span {
          color: #1afa29;
        }
      }
      .dianchi {
        color: #f49c2c;
        i::before {
          color: #f49c2c;
        }
        span {
          color: #f49c2c;
        }
      }
      .meidian {
        color: #d81e06;
        i::before {
          color: #d81e06;
        }
        span {
          color: #d81e06;
        }
      }
    }
    .col-right {
      text-align: right;
      flex: 1;
    }
  }
  .row-chunk {
    color: #999999;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    .row-title {
    }
    .row-cont {
      flex: 1;
      position: relative;
    }
    .address-p {
      position: absolute;
      left: 0;
      top: 0;
    }
    .red {
      color: red;
    }
  }

  .fot-chunk {
    margin-top: @SPACE_SIZE;
    padding: @SPACE_SIZE 0;
    display: flex;
    border-top: 1px solid #efefef;
    .col {
      flex: 1;
      text-align: center;
      align-self: center;
      button {
        width: 90%;
      }
      .btn-plain-default {
        border-color: #efefef;
      }
    }
    .col-3 {
      color: #666666;
    }
  }
  .col-close:active,
  .col-3:active,
  .btn-plain-default:active {
    color: @c-406DEF;
  }
}

.xuanzhun {
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 1s;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 1s;
  -webkit-animation: rotate 3s linear infinite;
  -moz-animation: rotate 3s linear infinite;
  -o-animation: rotate 3s linear infinite;
  animation: rotate 3s linear infinite;
  display: inline-block;
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(359deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(359deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>


