<template>
  <div class="Details">
    <div class="header">
      <div
        class="back iconfont icon-fanhui"
        @click="backGo"
      ></div>
      <div class="header_title">
        <span class="header_titleStyle">工单详情</span>
      </div>
    </div>
    <div class="mainbox">
      <div
        class="statuStyle"
        :class="key==1||key==2?'orangeStyle':key==3||key==4?'greenStyle':'grayStyle'"
      >
        <span
          class="iconfont iconfontStyel"
          :class="key==1||key==2?'icon-shalou1':key==3||key==4?'icon-gou':'icon-guanbi'"
        ></span>
        <span class="statuFont">{{statu}}</span>
      </div>
      <div class="companyName">
        <!-- 创建人：{{name}} -->
        创建人：{{$store.state.name}}
      </div>
      <div class="installHeader">
        <div class="installStyle">安装设备</div>
        <div class="installMain">
          <!-- <div v-for="(list,index) in $store.state.deviceVos" :key="index"> -->
          <div
            v-for="(list,index) in Zdata"
            :key="index"
          >
            <!-- {{list.terminalNo}} ({{list.terminalType}}--{{list.longStayTer==0?'有线':'无线'}}) -->
            <div class="seiBei_left">
              <span
                class="iconfontStyle iconfont"
                :class="list.longStayTer==0?'icon-chatou':'icon-dianchi'"
              ></span>
              <span class="terminalNoStyle">{{list.terminalNo}}</span>
              <!-- <span class="lineStyle">从未上线</span> -->
              <span
                class="lineStyle"
                :class="list.bgColor"
              >{{list.isOnlineType}}</span>
              <span class="terminalTypeStyle">{{list.terminalType}}</span>

            </div>
            <div
              class="seiBei_right"
              v-if="$store.state.status==3"
            >
              <span
                class="icon_shuaxin"
                @click="refresh(list.deviceId,index)"
              >
                <!-- <span>
                    <span class="jiangCha" >检查中...</span>
                    <img class="jiangCha" style="margin-top:2px;display:inline-block;width:12px;height:12px;padding-left:2px;" src="@/assets/image/inputLoading.gif">
                  </span> -->
                <span class="jianCha">
                  {{list.isSuccess}}
                </span>
              </span>
              <!-- <span class="iconfont icon-dizhi" @click="lookSeiBei(list)"></span> -->
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- <div class="main_contant">
          <span class="main_left">工单状态</span>
          <span class="main_right " :class="changeColor?'orangeStyle':'greenStyle'">{{statu}}</span>
        </div> -->

        <div class="main_contant">
          <span class="main_left">车主姓名</span>
          <span class="main_right">{{$store.state.carOwner||'--'}}</span>
        </div>
        <div class="main_contant">
          <span class="main_left">联系方式</span>
          <span class="main_right">{{$store.state.phone}}</span>
        </div>
        <div class="main_contant">
          <!-- createTime -->
          <span class="main_left">创建时间</span>
          <span class="main_right">{{$store.state.createTime}}</span>
        </div>
        <div class="main_contant">
          <!-- updateTime -->
          <span class="main_left">{{timeType}}</span>
          <span class="main_right">{{timeData}}</span>
        </div>
        <div class="main_contant">
          <span class="main_left">安装地点</span>
          <span class="main_right">{{$store.state.address||'--'}}</span>
        </div>
        <div class="main_contant">
          <span class="main_left">备注信息</span>
          <span class="main_right_last">{{$store.state.remark||'--'}}</span>
        </div>
      </div>
      <div
        class="installHeader"
        v-if="$store.state.status==1||$store.state.status==2?false:true"
      >
        <div class="main_contant">
          <span class="main_left">车身照片</span>
          <div class="carPicStyle">
            <div
              v-for="(lists,index) in $store.state.carPicture"
              :key="index"
            >
              <img
                class="imgStyle previewer-demo-img"
                :src="lists"
                v-if="lists?true:false"
                @click="shows(index)"
              >
              <div
                class="main_right_upload"
                v-else
              >
                <div><img
                    class="noImg"
                    src="@/assets/image/unInstall.png"
                  ></div>
                <div class="unInstallText">未上传照片</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div v-if="isShowInstallInfo">
        <div class="companyName">安装信息</div>
        <div
          class="main"
          v-for="(lists,devIndex) in $store.state.deviceVos"
          :key="devIndex"
        >
          <div class="main_contant">
            <span class="main_left">设备{{devIndex+1}}</span>
            <span class="main_right"> {{lists.terminalNo}} ({{lists.terminalType}}--{{lists.longStayTer==0?'有线':'无线'}})</span>
          </div>
          <div class="main_contant">
            <span class="main_left">安装位置</span>
            <span class="main_right">{{lists.installPosition}}</span>
          </div>
          <div class="main_contant">
            <span class="main_left">相关照片</span>
            <img
              class="imgStyle previewer-demo-imgs"
              :src="lists.pictureUrl"
              v-if="lists.pictureUrl?true:false"
              @click="showss(devIndex)"
            >
            <span
              class="main_right_upload"
              v-else
            >
              <div><img
                  class="noImg"
                  src="@/assets/image/unInstall.png"
                ></div>
              <div class="unInstallText">未上传照片</div>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div class="footer">
      <sliding
        @successEvent="statuEvent"
        v-show="isShowSliding"
      ></sliding>
      <div
        class="installStyle"
        v-show="isUpload"
        @click="jump_Install()"
      >已安装，点击上传安装信息</div>
      <div
        class="installStyle"
        v-show="isLook"
        @click="jump_map()"
      >已安装，查看设备</div>
    </div>

    <!-- <div v-transfer-dom> -->
    <!-- <x-dialog v-model="show1" class="dialog-demo">
        <div class="img-box">
          <img :src="picInfo" style="max-width:100%;">
        </div>
        <div @click="show1=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog> -->
    <!-- </div> -->
    <toast
      v-model="showValue"
      type="text"
      :time="1500"
      is-show-mask
      :text="msg"
      width="5rem"
      position="middle"
    >{{ msg }}</toast>
    <div v-transfer-dom>
      <previewer
        :list="carList"
        ref="previewer"
        :options="options"
      ></previewer>
    </div>

    <div v-transfer-dom>
      <previewer
        :list="seiBeiList"
        ref="previewer2"
        :options="optionss"
      ></previewer>
    </div>
  </div>
</template>
<script>
import { Previewer, TransferDom } from "vux";
import sliding from "@/components/sliding";
import { Message } from "element-ui";
import { XDialog, Toast } from "vux";
export default {
  name: "Details",
  directives: {
    TransferDom
  },
  data() {
    return {
      msg: "",
      showValue: false,
      showPosition: null,
      seiBeiList: [],
      carList: [],
      picInfo: "",
      show: false,
      timeData: "",
      timeType: "",
      Zdata: null,
      onlineList: [],
      key: null,
      isShowInstallInfo: false,
      installPositions: [],
      statu: "",
      changeColor: true,
      isShowSliding: true,
      isUpload: false,
      isLook: false,
      name: "",
      carOwner: "",
      phone: "",
      installTime: "",
      address: "",
      remark: "",
      deviceVos: "",

      lists: [],
      list: [
        {
          // msrc: 'http://bsjkj.oss-cn-shenzhen.aliyuncs.com/boyun-work-sheet/304/49216ADDCBDD744E.jpg',
          // src: this.$store.state.carPicture,
          src: JSON.parse(localStorage.getItem("GD_data")).carPicture
          // w: 800,
          // h: 400
        }
      ],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[
            index
          ];
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      },
      optionss: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-imgs")[
            index
          ];
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }
    };
  },
  methods: {
    shows(index) {
      this.$refs.previewer.show(index);
    },
    imgs(list) {
      return [
        {
          src: list
        }
      ];
    },
    showss(index) {
      this.$refs.previewer2.show(index);
    },

    refresh(deviceId, index) {
      this.getFromVehicleId(deviceId, index, true);
    },
    lookSeiBei(list) {
      let lists = [list];
      localStorage.setItem("lookSingle", JSON.stringify(lists));
      this.$router.push("/Equipment");
    },
    showPic(res, src) {
      this.show = true;
      if (res == "seiBei") {
        this.picInfo = src;
      } else {
        this.picInfo = this.$store.state.GD_data.carPicture;
      }
    },
    backFill() {
      var data = JSON.parse(localStorage.getItem("GD_data"));

      this.$store.commit("GD_data", data);
      this.$store.commit("name", data.name);
      this.$store.commit("carOwner", data.carOwner);
      this.$store.commit("phone", data.phone);
      this.$store.commit("installTime", data.installTime);
      this.$store.commit("createTime", data.createTime);
      this.$store.commit("address", data.address);
      this.$store.commit("remark", data.remark);
      this.$store.commit("deviceVos", data.deviceVos);
      this.$store.commit("status", data.status);
      this.getLineInfo();
      this.madeSeiBeiPic(data.deviceVos);
      this.madeCarPic(data.carPicture);
    },
    madeCarPic(data) {
      if (data) {
        let list = data.split(",");
        this.$store.commit("carPicture", list);
        for (var i = 0; i < list.length; i++) {
          this.carList.push({ src: list[i] });
        }
      } else {
        this.$store.commit("carPicture", [""]);
      }
    },
    madeSeiBeiPic(data) {
      for (var i = 0; i < data.length; i++) {
        this.seiBeiList.push({ src: data[i].pictureUrl });
      }
    },
    getLineInfo() {
      this.Zdata = JSON.parse(localStorage.getItem("GD_data")).deviceVos;
      this.onlineList = [];
      for (var i = 0; i < this.Zdata.length; i++) {
        this.getFromVehicleId(this.Zdata[i].deviceId, i, false);
      }
    },
    getFromVehicleId(vehicleId, n, flags) {
      /////////////////////////////////////////////////////////根据VehicleId请求具体数据

      let that = this;
      if (flags) {
        this.$set(that.Zdata[n], "isSuccess", "检查中...");
      } else {
        this.$set(that.Zdata[n], "isSuccess", "检查上线");
      }
      let param = {
        vehicleId: vehicleId
      };
      this.$byApi
        .getCarLocationInfo(param)
        .then(res => {
          if (res.data.flag == 1) {
            if (flags) {
              this.showMessage(res.data.obj.Z, res.data.obj.B);
              this.$set(that.Zdata[n], "isSuccess", "检查上线");
              this.$set(
                that.Zdata[n],
                "isOnlineType",
                that.isOnlines(res.data.obj.Z, res.data.obj.B)
              );
              this.$set(
                that.Zdata[n],
                "bgColor",
                that.bgColor(res.data.obj.Z, res.data.obj.B)
              );
            } else {
              this.$set(that.Zdata[n], "isSuccess", "检查上线");
              this.$set(
                that.Zdata[n],
                "isOnlineType",
                that.isOnlines(res.data.obj.Z, res.data.obj.B)
              );
              this.$set(
                that.Zdata[n],
                "bgColor",
                that.bgColor(res.data.obj.Z, res.data.obj.B)
              );
            }
          } else {
            this.$set(that.Zdata[n], "isSuccess", "检查上线");
            Message.error({ message: "查询数据异常", duration: 1000 });
          }
        })
        .catch(() => {
          this.$set(that.Zdata[n], "isSuccess", "检查上线");
        });
    },
    bgColor(Z, B) {
      if (B) {
        return "alarm_red";
      } else {
        switch (Number(Z)) {
          case 0:
            return "offline_Gray";
            break;
          case 1:
            return "online_Green";
            break;
          case 2:
            return "online_Green";
            break;
          case 3:
            return "offline_Gray";
            break;
          case 4:
            return "offline_Gray";
            break;
        }
      }
    },
    showMessage(Z, B) {
      if (B) {
        let that = this;
        Message.error({
          message: that.isOnlines(Z, B),
          duration: 1000,
          center: true
        });
      } else {
        let that = this;
        switch (Number(Z)) {
          case 0:
          case 3:
          case 4:
            Message.error({
              message: that.isOnlines(Z, B),
              duration: 1000,
              center: true
            });
            break;
          case 1:
          case 2:
            Message.success({
              message: that.isOnlines(Z, B),
              duration: 1000,
              center: true
            });
            break;
        }
      }
    },
    isOnlines(Z, B) {
      if (B) {
        return "警报";
      } else {
        switch (Number(Z)) {
          case 0:
            return "离线";
            break;
          case 1:
            return "在线";
            break;
          case 2:
            return "在线";
            break;
          case 3:
            return "从未上线";
            break;
          case 4:
            return "离线";
            break;
        }
      }
    },
    statuShow() {
      // if(localStorage.getItem('isGoDetails')=='true'){
      //   this.key=3;
      //   this.timeData=JSON.parse(localStorage.getItem("GD_data")).installedTime ;
      //   this.backFill();
      // }else{
      //   this.key = Number(JSON.parse(localStorage.getItem("GD_data")).status);
      // }
      this.key = Number(JSON.parse(localStorage.getItem("GD_data")).status);
      console.log(this.key);
      switch (this.key) {
        case 1: ///////待确认
          this.statu = "等待确认";
          this.changeColor = true;
          this.isShowSliding = true;
          this.isLook = false;
          this.isUpload = false;
          this.timeType = "预安装时间";
          this.isShowInstallInfo = false;
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).installTime;
          break;
        case 2: ///////待安装
          // this.statu = "已确认，等待安装";
          // this.changeColor = true;
          // this.isShowSliding = false;
          // this.isLook = false;
          // this.isUpload = true;
          // this.timeType = "预安装时间";
          // this.timeData=JSON.parse(localStorage.getItem("GD_data")).installTime
          this.isShowInstallInfo = false;
          localStorage.setItem(
            "id",
            JSON.parse(localStorage.getItem("GD_data")).id
          );
          this.$router.push("/InstallInfo");
          break;
        case 3: ///////已安装
          this.statu = "已安装";
          this.changeColor = false;
          this.isShowSliding = false;
          this.isUpload = false;
          this.isLook = true;
          this.isShowInstallInfo = true;
          this.timeType = "安装时间";
          localStorage.setItem("isGoDetails", false);
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).installedTime;
          break;
        case 4: ///////已完成
          this.statu = "已完成";
          this.changeColor = false;
          this.isShowSliding = false;
          this.isUpload = false;
          this.isLook = false;
          this.isShowInstallInfo = true;
          this.timeType = "完成时间";
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).finishTime;
          break;
        case 5: ///////已取消
          this.statu = "已取消";
          this.changeColor = false;
          this.isShowSliding = false;
          this.isUpload = false;
          this.isLook = false;
          this.isShowInstallInfo = true;
          this.timeType = "取消时间";
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).cancelTime;
          break;
      }
    },

    backGo() {
      // this.$router.go(-1);
      this.$router.push("/home");
      this.getCountsOfNoRead();
    },
    getCountsOfNoRead() {
      this.$byApi.getCountsOfNoRead().then(res => {
        this.$store.commit("GetCountOfNoread", res.data.obj);
      });
    },
    statuEvent() {
      var id = JSON.parse(localStorage.getItem("GD_data")).id;
      let param = {
        id: id ////订单状态
      };
      this.$byApi.updateWorkSheetStatusByApp(param).then(res => {
        if (res.data.flag == 1) {
          this.statu = "已确认，等待安装";
          this.changeColor = false;
          this.isShowSliding = false;
          this.isLook = false;
          this.isUpload = true;
          localStorage.setItem("isQueRen", true);

          localStorage.setItem(
            "id",
            JSON.parse(localStorage.getItem("GD_data")).id
          );
          this.$router.push("/InstallInfo");
        }
      });
      // .catch(()=>{
      //   alert(1111)
      // });
    },
    jump_Install() {
      //已安装，点击上传安装信息
      localStorage.setItem(
        "id",
        JSON.parse(localStorage.getItem("GD_data")).id
      );
      this.$router.push("/InstallInfo");
    },
    jump_map() {
      this.$router.push("/Equipment");
    },
    closePreviewer() {
      this.$refs["previewer"] &&
        this.$refs["previewer"].photoswipe &&
        this.$refs["previewer"].close();
      this.$refs["previewer2"] &&
        this.$refs["previewer2"].photoswipe &&
        this.$refs["previewer2"].close();
    }
  },
  computed: {},
  activated() {
    this.statuShow();
    this.backFill();
  },
  created() {
    // this.statuShow();
    // this.backFill();
  },
  mounted() {
    this.statuShow();
    this.backFill();
  },
  components: {
    sliding,
    Message,
    XDialog,
    Toast,
    Previewer
  }
};
</script>

<style lang="less" >
@import "~vux/src/styles/close";
.dialog-demo {
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
}
.Details {
  .mainbox {
    position: absolute;
    z-index: -999;
    overflow-y: scroll;
    top: 0.9rem;
    height: 82vh;
    width: 100%;
    .orangeStyle {
      background: #ff803a;
    }
    .greenStyle {
      background: #1ccc4a;
    }
    .grayStyle {
      background: #c5c5c5;
    }
    .statuStyle {
      height: 1rem;
    }
    .statuFont {
      color: #fff;
      font-size: 14px;
      position: absolute;
      top: 0.28rem;
      left: 0.8rem;
    }
    .iconfontStyel {
      color: #fff;
      position: absolute;
      top: 0.18rem;
      left: 0.2rem;
      font-size: 20px;
    }
  }
  .header {
    width: 100%;
    border-bottom: 1px solid #e1e5e9;
    position: fixed;
    background: #fff;
    text-align: center;
    padding: 0.1rem 0.2rem;
    height: 0.7rem;
    .back {
      font-size: 0.35rem;
      float: left;
      font-weight: 600;
      //  margin-top: .08rem;
      padding: 0.1rem 0.15rem 0.2rem 0;
    }
    .inputStyle {
      height: 0.55rem;
      margin-top: 0.1rem;
      border: none;
      background: #f5f5f5;
      width: 74%;
    }
    .header_title {
      .header_titleStyle {
        margin-right: 0.6rem;
      }
      height: 0.7rem;
      color: #333333;
      font-size: 0.4rem;
      margin-top: 0.08rem;
    }
  }
  .companyName {
    margin-top: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    padding: 0.2rem;
    color: #333333;
    font-weight: 600;
  }
  .installHeader {
    margin-top: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    padding-top: 0.1rem;
    min-height: 66px;
    overflow: hidden;
    .installStyle {
      color: #999999;
      margin-left: 0.2rem;
    }
  }
  .main {
    // flex: 1;
    margin-top: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    padding-top: 0.1rem;
    .installStyle {
      color: #999999;
      margin-left: 0.2rem;
    }
    .installMain {
      margin-top: 0.1rem;
    }
  }
  .footer {
    text-align: center;
    position: fixed;
    bottom: 0rem;
    width: 100%;
    .installStyle {
      font-size: 0.3rem;
      color: #fff;
      background: #0866f6;
      height: 1rem;
      line-height: 1rem;
    }
  }
  .seiBei_left {
    display: flex;
    align-items: center;
    padding: 0.2rem;
    font-size: 12px;
    width: 70%;
    float: left;
    .iconfontStyle {
      display: inline-block;
      color: #c1c1c1;
      margin-right: 5px;
      transform: scale(1);
    }
    .terminalNoStyle {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      width: 93px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .terminalTypeStyle {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      // width: 40px;
      white-space: nowrap;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #e9f2ff;
      color: #0866f6;
      padding: 1px 7px;
      border-radius: 10px;
      transform: scale(0.7);
    }
    .lineStyle {
      white-space: nowrap;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      // width: 40px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      // background:#E9F2FF;
      // color:#0866F6;
      padding: 1px 7px;
      border-radius: 10px;
      transform: scale(0.7);
      text-align: center;
    }
    .offline_Gray {
      background: #ebebeb;
      color: #8c8c8c;
    }
    .online_Green {
      background: #e1ffe7;
      color: #25d548;
    }
    .alarm_red {
      background: #ffe1e1;
      color: #df1b1b;
    }
  }
  .seiBei_right {
    padding: 0.2rem;
    font-size: 12px;
    width: 18%;
    float: right;
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    text-align: center;
    .icon_shuaxin {
      font-size: 12px;
      background: #e9f2ff;
      padding: 1px 10px;
      border-radius: 20px;
      color: #0866f6;
      height: 16px;
      line-height: 16px;
      margin-top: 3px;
    }
    .icon-dizhi {
      font-size: 12px;
      background: #e9f2ff;
      padding: 1px 3px;
      border-radius: 20px;
      color: #0866f6;
      margin-right: 10px;
    }
  }
  .main_contant {
    clear: both;
    min-height: 0.6rem;
    display: flex;
    font-size: 0.25rem;
    padding: 0.2rem;
    .main_left {
      display: inline-block;
      width: 20%;
      color: #999999;
    }
    .carPicStyle {
      width: 99%;
      display: flex;
      // justify-content: space-around;
      padding-left: 10px;
    }
    .main_right {
      color: #333;
      display: inline-block;
      width: 80%;
      border-bottom: 1px solid #efefef;
      padding-left: 0.2rem;
    }
    .imgStyle {
      width: 70px;
      height: 70px;
      padding-left: 0.2rem;
    }
    .main_right_upload {
      // padding:5px;
      // font-size: 12px;
      // color: #999999;
      // width: 60px;
      // height: 60px;
      // background: #f2f2f2;
      // margin-left: 0.2rem;
      // text-align: center;

      color: #999999;
      width: 70px;
      height: 70px;
      background: #f2f2f2;
      margin-left: 0.2rem;
      text-align: center;

      .noImg {
        display: inline-block;
        width: 55%;
        margin-top: 15px;
      }
      .unInstallText {
        color: #ddd;
        font-size: 12px;
      }
      div {
        font-size: 15px;
      }
    }
    .main_right_last {
      color: #333;
      display: inline-block;
      width: 80%;
      padding-left: 0.2rem;
    }
    .main_right_last {
      color: #333;
      display: inline-block;
      width: 66%;
      // border-bottom: 1px solid #ddd;
      padding-left: 0.2rem;
    }
  }
  .pswp--supports-fs .pswp__button--fs {
    display: none !important;
  }
  .pswp__button--fs {
    display: none !important;
  }
  .jianCha {
    display: inline-block;
    font-size: 12px;
    transform: scale(0.9);
    white-space: nowrap;
  }
  .el-icon-error:before {
    content: "" !important;
  }
}
</style>
