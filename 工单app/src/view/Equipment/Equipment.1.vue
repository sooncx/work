<template>
  <div class="Equipment">
    <div class="header">
      <div
        class="back iconfont icon-fanhui"
        @click="goBack"
      ></div>
      <div class="header_title">
        <span>查看设备</span>
      </div>
      <div
        class="iconfont icon-liebiao"
        :class="isToggle?'':'blueStyle'"
        @click="toggle_lieBiao"
      ></div>
    </div>
    <!-- 地图 -->
    <div class="mapContent">
      <div
        id="container"
        class="mapStyle"
      >
        <!-- 车辆是否上线的信息窗 -->
        <div
          :class="isOnlin?'footer_info_online':'footer_info_noOnline'"
          v-show="isShowFooterInfo"
        >
          <!-- 上线车辆 -->
          <div v-show="isOnlin">
            <div >
              <span class="iconfont icon-shijian"></span>
              <span>状态：</span>
              <span>{{statutexts}}</span>
            </div>
            <div class="addressStyles">
              <span class="iconfont icon-dizhi"></span>
              <span>位置：</span>
              <span class="addressStyle">{{address}}</span>
            </div>
          </div>
          <!-- 车辆暂未上线 -->
          <div v-show="!isOnlin">
            <div class="noOnline">
              <span class="iconfont icon-gantan"></span>
              <span>暂未上线</span>
            </div>
          </div>

        </div>
        <!-- 车辆是否上线的信息窗 end -->
        <div
          class="right_Info_head"
          :class="isToggle?'changeLefts':'changeRights'"
        >
          <span>共：{{totalNum}} /</span>
          <span>在线：{{onLlineNum}} /</span>
          <span>离线：{{offlineNum}}</span>
        </div>
        <!-- 右边的（滑动的）设备信息窗 -->
        <!-- <div class="loadingStyle" v-if="isLoading" :class="isToggle?'changeLefts':'changeRights'">加载中...</div> -->
        <div
          class="right_Info"
          :class="isToggle?'changeLeft':'changeRight'"
        >

          <!-- v-for -->
          <div
            class="infoBox"
            @click="jumpToMap(list,index)"
            v-for="(list,index) in newAllData"
            :key="index"
          >
            <div class="left_pic"><img
                :src="pic(list)"
                alt=""
              ></div>
            <div class="right_text">
              <!-- <div class="headerText">
                <span class="text_header">车牌：{{list.terminalNo}}</span>
                <span class="text_header">类型：{{list.terminalType}}</span>
                
              </div> -->
              <div class="stateStyle">
                <span class="state_left">车牌：</span>
                <span class="state_right">
                  {{list.terminalNo}}
                </span>
              </div>
              <div class="stateStyle">
                <span class="state_left">类型：</span>
                <span class="state_right">
                 {{list.terminalType}}
                </span>
              </div>
              <div class="stateStyle">
                <span class="state_left">状态：</span>
                <span class="state_right">
                  {{statuText(list)}}{{list.details.d}}
                </span>
              </div>
              <div class="stateStyle">
                <span class="state_left">位置：</span>
                <span class="state_right">
                  {{list.address}}
                </span>
              </div>
            </div>
          </div>
          <!-- v-for end-->
        </div>
        <!-- 右边的（滑动的）设备信息窗   end-->

        <!-- 秒后刷新 -->
        <div
          class="timeBox"
          v-show="showTime"
        >
          <span class="timeNum">{{countNum}}</span>
          <span class="timeFont">秒后刷新</span>
        </div>
        <!-- 秒后刷新 end-->
        <div class="timeBox" v-show="!showTime">
          网络异常！点击右边按钮手动刷新。
        </div>
        <!-- 手动刷新 -->
        <img
          class="refresh"
          @click="refreshMap()"
          src="@/assets/image/Reload1.png"
          v-show="isShowRefresh"
        >
        <img
          class="refresh"
          src="@/assets/image/Reload.svg"
          v-show="!isShowRefresh"
        >
        <!-- 手动刷新 end-->
      </div>
    </div>

    <toast v-model="showValue" type="text" :time="1500" is-show-mask :text="msg"  width="5rem"  position="middle">{{ msg }}</toast>
  </div>
</template>

<script>
import { byUtil, GPS } from "@/public/js/plugin/base";
import  {Toast} from "vux";

export default {
  data() {
    return {
      msg: "",
      showValue: false,
      showPosition: null,
      isLoading:false,
      isSetFitView: true,
      maker: null,
      address: "111",
      statutexts: "",
      byUtil,
      totalNum: 0,
      onLlineNum: 0,
      offlineNum: 0,
      allData: [],
      newAllData: [],
      isShowFooterInfo: false,
      makerList: [],
      countTime: null,
      map: null,
      isShowRefresh: true,
      countNum: 10,
      showTime: true,
      isToggle: true,
      isOnlin: true,
      pic_youxian: require("@/assets/image/youxian.png"),
      pic_youxian_lixian: require("@/assets/image/youxian_lixian.png"),
      pic_wuxian_lixian: require("@/assets/image/wuxian_lixian.png"),
      pic_wuxian: require("@/assets/image/wuxian.png"),
      map_wuxian: require("@/assets/image/无线-绿.png"),
      map_wuxian_lixian: require("@/assets/image/无线-灰.png"),
      map_youxian: require("@/assets/image/有线-绿.png"),
      map_youxian_lixian: require("@/assets/image/有线-灰.png")
    };
  },
  mounted: function() {
    if (window["AMap"]) {
      this.init();
    } else {
      this.$root.$on("onAmapApiLoaded", () => {
        this.init();
      });
    }
  },
  activated(){
    // console.log(9999)
    // this.rightEvent();
    // this.daoJiShi();
    // this.isToggle=true;
    // this.newAllData = [];
  },
  created() {
    localStorage.setItem('footerIndex',null)
    localStorage.setItem('markerIndex',null)
    this.rightEvent();
    this.daoJiShi();
  },
  components:{
    Toast
  },

  methods: {
    refreshInfoWindow(index){
        let latlon=GPS.delta(parseFloat(this.newAllData[index].details.Y), parseFloat(this.newAllData[index].details.X));
        let position = [latlon.lon, latlon.lat];
        this.showInfoWindow(position, this.newAllData[index].terminalType);
    },
    refreshMakerClick(){
      if(localStorage.getItem('markerIndex')!='null'){
        console.log('refreshMakerClick')
        let index=Number(localStorage.getItem('markerIndex'));
        this.address=this.newAllData[index].address;
        this.statutexts=this.statuText(this.newAllData[index]) + this.newAllData[index].details.d;
        this.refreshInfoWindow(index)
      }
    },
    refreshFooter(){
      if(localStorage.getItem('footerIndex')!='null'){
         console.log('refreshFooter')
        let index=Number(localStorage.getItem('footerIndex'));
        this.address=this.newAllData[index].address;
        this.statutexts=this.statuText(this.newAllData[index]) + this.newAllData[index].details.d;
        this.refreshInfoWindow(index)
      }
    },
    addressEvent(list, i) {
      ///////////////////////////////////////////////////////////////////获取地址
      if(list.details.Y){
        var points = [];
        var point = GPS.delta(list.details.Y, list.details.X);
        points.push(point);

        byUtil.GetLocations(points).then(res => {
          this.$set(this.newAllData[i], "address", res[0].address);
          this.drawPoint();
        });
      }else{
         this.$set(this.newAllData[i], "address", '--');
          this.drawPoint();
      }

    },
    statuText(list) {
      /////////////////////////////////////////////////////////////判断状态
      switch (Number(list.details.Z)) {
        case 0:
          return "离线";
          break;
        case 1:
          return "行驶";
          break;
        case 2:
          return "停车";
          break;
        case 3:
          // this.isOnlin=false;
          return "从未上线";
          break;
        case 4:
          // this.isOnlin=false;
          return "过期";
          break;
      }
    },
    pic(list) {
      if (list.longStayTer == 0) {
        ///1无线，0有线
        if (list.details.Z == 1 || list.details.Z == 2) {
          return this.pic_youxian;
        } else {
          return this.pic_youxian_lixian;
        }
      } else {
        if (list.details.Z == 1 || list.details.Z == 2) {
          return this.pic_wuxian;
        } else {
          return this.pic_wuxian_lixian;
        }
      }
    },
    headData() {
      ////////////////////////////////////////////////////////////////////////////////右边栏头部
      this.totalNum = this.allData.length; ////总数
      var num = [];
      for (var i = 0; i < this.allData.length; i++) {
        if (this.allData[i].details.Z == 1 || this.allData[i].details.Z == 2) {
          num.push(i);
        }
      }
      this.onLlineNum = num.length; //////在线数
      this.offlineNum = this.totalNum - num.length; /////离线数
    },
    rightEvent() {
      ////////////////////////////////////////////////////////////////////////////右边栏
      this.allData = [];
      // this.newAllData = [];
      this.isLoading=true;
      this.allData = JSON.parse(localStorage.getItem("GD_data")).deviceVos;
      for (var i = 0; i < this.allData.length; i++) {
        this.getFromVehicleId(this.allData[i].deviceId, i);
      }
     

      setTimeout(() => {
        this.madeNewData(); /////重新按在线在前重组数据
        this.headData(); /////计算在线数和离线数,总数
      }, 1000);
    },
    getFromVehicleId(vehicleId, n) {
      /////////////////////////////////////////////////////////根据VehicleId请求具体数据
      let param = {
        vehicleId: vehicleId
      };
      this.$byApi.getCarLocationInfo(param).then(res => {
        if (res.data.flag == 1) {
          this.showTime=true;
          this.allData[n].details = res.data.obj;
          this.countNum=10;
          this.daoJiShi();
        }
      }).catch(()=>{
          this.isShowRefresh=true;
          this.showTime=false;
      });
    },
    madeNewData() {
      //////////////////////////////////////////////////////////////////////////////////////////重新按在线在前重组数据
      var result=[]
      for (var i = 0; i < this.allData.length; i++) {
        if (this.allData[i].details.Z == 1 || this.allData[i].details.Z == 2) {
          // this.newAllData.push(this.allData[i]);
          result.push(this.allData[i])
        }
      }

      for (var i = 0; i < this.allData.length; i++) {
        if (this.allData[i].details.Z != 1 && this.allData[i].details.Z != 2) {
          // this.newAllData.push(this.allData[i]);
           result.push(this.allData[i])
        }
      }
      this.$set(this,"newAllData",result)
      this.newAllData.map((item, index) => {
        this.addressEvent(item, index);
      });
      setTimeout(()=>{
        this.refreshFooter();
      },500)
      setTimeout(()=>{
        this.refreshMakerClick();
      },500)
      this.isShowRefresh = true;
      this.isLoading=false;
    },
    init() {
      /////////////////////////////////////////////////////////////////////////////////////////////////初始化地图
      this.map = new AMap.Map("container", {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 10
      });
      //   AMap.plugin(["AMap.ToolBar", "AMap.Scale"], function() {
      //     map.addControl(new AMap.ToolBar());
      //     map.addControl(new AMap.Scale());
      //   });
    },
    isOnlineEvent(data) {
      //////////////////////////////////////////////////////////////////////////////////////////////判断是在线(true)还是离线
      switch (Number(data)) {
        case 0:
          return false;
          break;
        case 1:
          return true;
          break;
        case 2:
          return true;
          break;
        case 3:
          return false;
          break;
        case 4:
          return false;
          break;
      }
    },
    isYouXianEvent(data) {
      ////////////////////////////////////////////////////////////////////////////////////////////////判断是有线还是无线
      switch (Number(data)) {
        case 1: ///无线
          return false;
          break;
        case 0: //有线true
          return true;
          break;
      }
    },
    pointInfo(iconPic, i) {
      let latlon=GPS.delta(parseFloat(this.newAllData[i].details.Y), parseFloat(this.newAllData[i].details.X));
      let lat=latlon.lat;
      let lon=latlon.lon;
      
      this.maker = new AMap.Marker({
        icon: new AMap.Icon({
          image: iconPic,
          size: new AMap.Size(52, 52), //图标大小
          imageSize: new AMap.Size(35, 35)
        }),
        // position: [this.newAllData[i].details.X, this.newAllData[i].details.Y],
        position: [lon, lat],
        terminalType: this.newAllData[i].terminalType,
        X: lon,
        Y:lat,
        index:i,
        allDatas: this.newAllData[i],
        d: this.newAllData[i].details.d,
        offset: new AMap.Pixel(-13, -30)
      });
    },
    clearmmap(){
       this.map.clearMap();
    },
    drawPoint() {
      ///////////////////////////////////////////////////////////////////////////////////////////////画点
      // this.newAllData;
      this.makerList=[];
      for (var i = 0; i < this.newAllData.length; i++) {
        if(this.newAllData[i].details.Y){
            if (this.isYouXianEvent(this.newAllData[i].details.longStayTer)) {
            ////////////////////////////////////////////////////////////////////////////有线
            if (this.isOnlineEvent(this.newAllData[i].details.Z)) {
              /////在线
              this.pointInfo(this.map_youxian, i);
            } else {
              /////离线
              this.pointInfo(this.map_youxian_lixian, i);
            }
          } else {
            ////////////////////////////////////////////////////////////////////////////无线
            if (this.isOnlineEvent(this.newAllData[i].details.Z)) {
              /////在线
              this.pointInfo(this.map_wuxian, i);
            } else {
              /////离线
              this.pointInfo(this.map_wuxian_lixian, i);
            }
          }
          // this.makerList=[];
          this.makerList.push(this.maker);
        }

      }
      
      this.map.add(this.makerList);
      // marker.setMap(this.map);

      if (this.isSetFitView) {
        this.map.setFitView();
      }

      this.makerClick();
    },

    makerClick() {
      /////////////////////////////////////////////////////////////////////////////////////////////点标记的点击事件
      var that = this;
      for (var i = 0; i < this.makerList.length; i++) {
        var clickHandle = AMap.event.addListener(
          this.makerList[i],
          "click",
          function(e) {
            let indexx=e.target.F.index;
            localStorage.setItem('markerIndex',indexx);
            localStorage.setItem('footerIndex',null)
            that.isShowFooterInfo = true; ///显示下面的窗口
            that.statutexts =
              that.statuText(e.target.F.allDatas) + e.target.F.d; /////状态
            that.address = e.target.F.allDatas.address; ////位置

            var position = [e.target.F.position.lng, e.target.F.position.lat];
            that.showInfoWindow(position, e.target.F.terminalType); //////////////////显示设备类型的小窗口
            // that.map.setZoom(15)
            that.map.setCenter(position);
          }
        );
      }
    },
    showInfoWindow(position, name) {
      //////////////////////////////////////////////////////////////////////////小窗口
      var infoWindow = new AMap.InfoWindow({
        anchor: "top-left",
        offset: new AMap.Pixel(16, -10),
        content: "<div class='infoWindow'>" + name + "</div>"
      });
      infoWindow.open(this.map, position);
    },
    goBack() {
      ////////////////////////////////////////////////////////////////////////////////////////////////返回首页
      this.clearTime();
      this.countNum = 0;
      this.$router.push("/home");
    },
    toggle_lieBiao() {
      ///////////////////////////////////////////////////////////////////////////////////////切换左边栏
      if (this.isToggle) {
        this.isToggle = false;
        // this.isBlue=true;
      } else {
        this.isToggle = true;
        // this.isBlue=false;
      }
    },
    daoJiShi() {
      //////////////////////////////////////////////////////////////////////////////////////////////////倒计时
     
      if (this.countTime) {
        clearTimeout(this.countTime);
      }
      if (this.countNum <= 0) {
        this.rightEvent();
        this.isSetFitView = false;
        this.clearmmap()
        return
      }
      this.countNum--;
      this.countTime = setTimeout(this.daoJiShi, 1000);
    },
    refreshMap() {
      //////////////////////////////////////////////////////////////////////////////////////////////////手动刷新
      this.isShowRefresh = false;
      // this.clearTime();
      this.countNum = 10;
      this.rightEvent();
    },
    clearTime() {
      //////////////////////////////////////////////////////////////////////////////////////////////清除定时器
      clearTimeout(this.countTime);
    },
    jumpToMap(data,index) {
      //////////////////////////////////////////////////////////////////////////////////////////////跳转到地图具体设备
      localStorage.setItem('footerIndex',index)
      localStorage.setItem('markerIndex',null)
      if(data.details.X){
        this.statutexts = this.statuText(data) + data.details.d;
        this.isShowFooterInfo = true;
        // this.isOnlin=true;
        this.address = data.address;
        this.isToggle = true;

        let latlon=GPS.delta(parseFloat(data.details.Y), parseFloat(data.details.X));
        var position = [latlon.lon, latlon.lat];
        // var position = [data.details.X, data.details.Y];

        this.showInfoWindow(position, data.terminalType);
        this.map.setZoom(15);
        this.map.setCenter(position);
      }else{
        this.msg = "暂未上线";
        this.showValue = true;
        this.showPosition = "middle";
      }

    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
.Equipment {
  overflow: hidden;
  .changeLefts {
    // right: 0%;
    transform: translateX(100%);
  }
  .changeRights {
    //  right: 50%;
    transform: translateX(0%);
  }
  .infoWindow {
    font-size: 0.2rem;
  }
  /deep/ .amap-info-close {
    display: none;
  }
  /deep/ .amap-info-content {
    padding: 0.1rem;
  }
  .mapContent {
    position: relative;
    top: 0.9rem;
  }
  // 头部
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #fff;
    padding: 0.1rem 0.2rem;
    height: 0.7rem;

    position: absolute;
    z-index: 999999999;
    top: 0;
    width: 94%;
    .blueStyle {
      color: #0866f6;
    }
    .back {
      font-size: 0.35rem;
      font-weight: 600;
    }
    .header_title {
      height: 0.7rem;
      color: #333333;
      font-size: 0.4rem;
    }
    .icon-liebiao {
      font-size: 0.35rem;
    }
  }
  // 头部 end

  .mapStyle {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    .addressStyles{
      display: flex;
      justify-items: center;
    }
    .icon-shijian {
      color: #0866f6;
    }
    .refresh {
      position: relative;
      z-index: 99;
      top: -1.3rem;
      left: 6.8rem;
      // width: fit-content;
      display: inline-block;
      width: 0.4rem;
      height: 0.4rem;
      background: rgba(255, 255, 255, 1);
    }

    .icon-dizhi {
      color: #0866f6;
    }
    .addressStyle {
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      width:6rem;
      display: inline-block;
    }
    .footer_info_online {
      font-size: 0.2rem;
      width: 100%;
      position: fixed;
      bottom: 0rem;
      z-index: 99;
      background: rgba(255, 255, 255, 0.7);
      padding: 0.1rem;
      height: fit-content;
      line-height: 0.5rem;
      .noOnline {
        text-align: center;
        .icon-gantan {
          color: #db2122;
        }
      }
    }
    .footer_info_noOnline {
      font-size: 0.2rem;
      width: 100%;
      position: absolute;
      bottom: 0;
      z-index: 99;
      background: rgba(255, 255, 255, 0.7);
      padding: 0.1rem;
      // height: 0.5rem;
      // line-height: .25rem;
       height: fit-content;
      line-height: 0.5rem;
      .noOnline {
        text-align: center;
        .icon-gantan {
          color: #db2122;
        }
      }
    }
    .right_Info_head {
      position: fixed;
      top: 0.9rem;
      right: 0.01rem;
      width: 44.5%;
      background: #2f7ffd;
      color: #fff;
      padding: 0.1rem 0.2rem;
      font-size: 0.2rem;
      z-index: 1000;
      transition: all 500ms;
    }
    .loadingStyle{
      font-size:.2rem;
      position: fixed;
      top:2rem;
      left:5.1rem;
      z-index: 999999999;
      width: 45.5%;
      transition: all 500ms;
    }
    .right_Info {
      width: 50%;
      height: 100%;
      position: absolute;
      overflow: scroll;
      z-index: 999;
      background: #fff;
      box-shadow: -1px -1px 5px #ddd;
      margin-top: 0.03rem;
      padding-top: 0.3rem;
      transition: all 500ms;

      .infoBox {
        display: flex;
        flex-direction: row;
        padding: 0.1rem;
        border-bottom: 1px solid #e1e5e9;
        .left_pic {
          margin-top: 0.3rem;
          display: flex;
          align-items: flex-start;
        }
        .right_text {
          margin-left: 0.1rem;
          margin-top:.15rem;
          display: flex;
          flex-direction: column;
          .text_header {
            font-size: 0.25rem;
            color: #333333;
          }
          .isGreen {
            color: #1dcc46;
          }
          .isRed {
            color: #e21e1e;
          }
          .headerText {
            // flex:1
            line-height: 0.3rem;
          }
          .stateStyle {
            margin-top: 0.1rem;
            font-size: 0.2rem;
            .state_left {
              color: #666666;
            }
            .state_right {
              color: #333333;
            }
          }
        }
      }
    }
    .changeLeft {
      // right: 0%;
      transform: translateX(200%);
    }
    .changeRight {
      //  right: 50%;
      transform: translateX(100%);
    }

    // 几秒后刷新
    .timeBox {
      position: relative;
      z-index: 999;
      font-size: 12px;
      padding: 0.1rem;
      background: rgba(255, 255, 255, 0.8);
      width: fit-content;
      margin: 0.1rem;
      left: 0.1rem;
      .timeNum {
        color: #0866f6;
      }
    }
    // 几秒后刷新 end
  }
}
</style>