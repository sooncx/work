<template>
  <div class="installInfo">
    <div class="header">
      <div
        class="back iconfont icon-fanhui"
        @click="goBack"
      ></div>
      <div class="header_title">
        <span class="header_titleStyle">上传安装信息</span>
      </div>
    </div>
    <div class="mainbox">
      <div class="companyName">
        创建人：{{name}}
      </div>
      <div class="installHeader">
        <div class="installStyle">安装设备</div>
        <div class="installMain">
          <div
            v-for="(list,index) in deviceVos"
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
            <!-- <div class="seiBei_right">
                <span class="iconfont icon-shuaxin"></span>
                <span class="iconfont icon-dizhi"></span>
              </div> -->
          </div>

        </div>
      </div>
      <div class="main">

        <div class="main_contant main_contant_first">
          <span class="main_left">联系方式</span>
          <span class="main_right">{{phone}}</span>
        </div>
        <div class="main_contant">
          <span class="main_left">车主姓名</span>
          <span class="main_right">{{carOwner||'--'}}</span>
        </div>
        <div class="main_contant">
          <!-- createTime -->
          <span class="main_left">创建时间</span>
          <!-- <span class="main_right">{{$store.state.createTime}}</span> -->
          <span class="main_right">{{createTime}}</span>
        </div>
        <div class="main_contant">
          <!-- updateTime -->
          <span class="main_left">{{timeType}}</span>
          <!-- <span class="main_right">{{$store.state.confirmTime}}</span> -->
          <span class="main_right_last">{{timeData}}</span>
        </div>

        <div class="main_contant">
          <span class="main_left"><span style="color:red;">*</span>备注</span>
          <span class="main_right"><input
              type="text"
              class="placeholderStyle"
              v-model="remark"
              placeholder="请输入备注信息"
            ></span>

        </div>
        <div class="devRemark">请备注设备号信息！</div>
      </div>

      <div class="
              main">
        <div class="main_contant">
          <span class="main_left">车身照片</span>
          <div class="carPicStyle">
            <div
              class="boxStyle"
              v-for="(lists,indexs) in carList_CS"
              :key="indexs"
              :class="indexs==0?'padding10':'padding15'"
            >
              <span
                class="jian"
                v-show="lists.isShowJian_cs"
                @click="doDelete_CS(indexs)"
              ><b>一</b></span>
              <img
                class="imgStyle"
                v-show="lists.isShowPic_CS"
                :src="lists.basestr_CS"
                @click="doSelectPhoto_CS(indexs)"
              >
              <span
                class="main_right_upload"
                v-show="!lists.isShowPic_CS"
                @click="doSelectPhoto_CS(indexs)"
              >
                <div class="iconfont icon-jia1"></div>
              </span>
              <div
                class="loadPic2"
                v-show="lists.isShowLoadPic_CS"
              >加载中...</div>
              <!-- <div class="loadPic2" v-show="true">加载中...</div> -->
            </div>
          </div>

        </div>
      </div>
      <!-- <div  class="main">
        <div class="main_contant">
          <span class="main_left">车身照片</span>
          <div>
            <img class="imgStyle" v-show="isShowPic_CS" :src="basestr_CS" @click="doSelectPhoto_CS()">
            <span class="main_right_upload" v-show="!isShowPic_CS" @click="doSelectPhoto_CS()">
            <div class="iconfont icon-jia1"></div>
            </span>
            <div class="loadPic2" v-show="isShowLoadPic_CS">加载图片中...</div>
          </div>
      </div>
      </div> -->

      <div
        class="companyName"
        v-show="isShowDevice"
      >
        安装信息
      </div>

      <div
        v-show="isShowDevice"
        class="main"
        v-for="(lists,indexs) in deviceVos"
        :key="indexs"
      >

        <div class="main_contant">
          <span class="main_left">设备{{indexs+1}}</span>
          <span class="main_right"> {{lists.terminalNo}} ({{lists.terminalType}}--{{lists.longStayTer==0?'有线':'无线'}})</span>
        </div>
        <div class="main_contant">
          <span class="main_left"><span style="color:red;">*</span>安装位置</span>
          <span class="main_right"><input
              type="text"
              class="placeholderStyle"
              v-model="installPositions[indexs]"
              placeholder="请输入安装位置"
            ></span>
        </div>
        <div class="main_contant">
          <span class="main_left">相关照片</span>
          <img
            class="imgStyle"
            v-show="lists.isShowPic"
            :src="lists.basestr"
            @click="doSelectPhoto(lists.deviceId,$event,indexs)"
          >
          <span
            class="main_right_upload"
            v-show="!lists.isShowPic"
            @click="doSelectPhoto(lists.deviceId,$event,indexs)"
          >
            <div class="iconfont icon-jia1"></div>
          </span>
          <div
            class="loadPic"
            v-show="lists.isShowLoadPic"
          >正在加载图片...</div>
        </div>
      </div>

    </div>
    <div
      class="footer"
      @click="upload_install()"
    >
      <div :class="isClick?'installStyle_c':'installStyle'">已安装，点击上传安装信息</div>
    </div>
    <!-- 弹窗 -->
    <!-- <confirm :isShowConfirm="isShowTC" @leftEvent="backGD()" @rightEvent="goTo()"></confirm> -->
    <toast
      v-model="showValue"
      type="text"
      :time="1500"
      is-show-mask
      :text="msg"
      width="5rem"
      position="middle"
    >{{ msg }}</toast>
  </div>
</template>

<script>
import { Toast } from "vux";
import confirm from "@/components/confirm";
export default {
  data() {
    return {
      carList_CS: [
        {
          isShowPic_CS: false,
          basestr_CS: "",
          pics_CS: "",
          isShowLoadPic_CS: false,
          isShowJian_cs: false
        }
      ],
      createTime: "",
      timeType: "",
      timeData: "",
      isRequest: true,
      isClick: false,
      isShowLoadPic: false,
      isShowLoadPic_CS: false,
      name: "",
      isShowTC: false,
      phone: "",
      isShowDevice: true,
      remark: null,
      carOwner: "",
      plate: "",
      installPositions: [],
      deviceVos: "",
      isShowPic: true,
      isShowPic_CS: true,
      basestr_CS: "",
      uploadPhotoImg: "",
      msg: "",
      showValue: false,
      showPosition: null,
      pics_CS: "",
      isShowPic_CS: ""
    };
  },
  components: {
    confirm,
    Toast
  },
  methods: {
    doDelete_CS(index) {
      let param = this.carList_CS[index].pics_CS;
      this.$byApi
        .deleteUploadPicture({
          fileUrl: param
        })
        .then(res => {
          if (res.data.flag == 1) {
            this.deleteCarPic(index);
          }
        });
    },
    deleteCarPic(index) {
      if (this.carList_CS.length == 3 && this.carList_CS[2].pics_CS != "") {
        this.carList_CS.splice(index, 1);
        let addList = {
          isShowPic_CS: false,
          basestr_CS: "",
          pics_CS: "",
          isShowLoadPic_CS: false,
          isShowJian_cs: false
        };
        this.carList_CS.push(addList);
      } else {
        this.carList_CS.splice(index, 1);
      }
    },
    doSelectPhoto_CS(index) {
      dsBridge.call("doSelectPhoto", null, rst => {
        ///从安卓获取图片（原始没有转换的图片代码）
        if (rst.imageBase) {
          // this.isShowLoadPic_CS=true;
          // this.onConfirm_CS(rst.imageBase);
          this.$set(this.carList_CS[index], "isShowLoadPic_CS", true);
          this.onConfirm_CS(rst.imageBase, index);
        } else {
          this.msg = rst.msg;
          this.showValue = true;
          this.showPosition = "middle";
        }
      });
    },
    onConfirm_CS(base64Img, deviceIndex) {
      let param = new FormData();
      let basestr = "data:image/jpg;base64," + base64Img;
      param.append("multipartFile", basestr);
      param.append("type", 2);
      param.append("id", -localStorage.getItem("id"));

      this.$byApi.uploadPicture(param).then(res => {
        if (res.data.flag == 1) {
          this.$set(this.carList_CS[deviceIndex], "basestr_CS", basestr);
          this.$set(this.carList_CS[deviceIndex], "pics_CS", res.data.obj);
          this.$set(this.carList_CS[deviceIndex], "isShowPic_CS", true);
          this.$set(this.carList_CS[deviceIndex], "isShowLoadPic_CS", false);
          this.$set(this.carList_CS[deviceIndex], "isShowJian_cs", true);
          if (this.carList_CS.length > 2) {
            console.log(1111);
          } else {
            let addList = {
              isShowPic_CS: false,
              basestr_CS: "",
              pics_CS: "",
              isShowLoadPic_CS: false,
              isShowJian_cs: false
            };
            this.carList_CS.push(addList);
          }
        }
      });
    },
    doSelectPhoto(deviceId, e, deviceIndex) {
      dsBridge.call("doSelectPhoto", null, rst => {
        ///从安卓获取图片（原始没有转换的图片代码）
        if (rst.imageBase) {
          this.$set(this.deviceVos[deviceIndex], "isShowLoadPic", true);
          this.onConfirm(rst.imageBase, deviceId, deviceIndex);
        } else {
          this.msg = rst.msg;
          this.showValue = true;
          this.showPosition = "middle";
        }
      });

      // var dd =
      //   "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAAeABUDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAEDAgT/xAAfEAACAgICAwEAAAAAAAAAAAABAgARAzESISJBQoH/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQID/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAExAiH/2gAMAwEAAhEDEQA/AK5MhZqXURR071Ep4ZO/Us+ReBo3cuQztFjyWPLYhJIha6hBpDTZTMn0P2RAs0J1nUwqBTYiWuDeemkXitQmoSSj/9k=";

      // this.onConfirm(dd, deviceId, deviceIndex);
    },
    onConfirm(base64Img, deviceId, deviceIndex) {
      let param = new FormData();
      let basestr = "data:image/jpg;base64," + base64Img;
      param.append("multipartFile", basestr);
      param.append("type", 1);
      param.append("device", deviceId); ///deviceId
      param.append("id", localStorage.getItem("id"));

      this.$byApi.uploadPicture(param).then(res => {
        if (res.data.flag == 1) {
          this.$set(this.deviceVos[deviceIndex], "basestr", basestr);
          this.$set(this.deviceVos[deviceIndex], "pics", res.data.obj);
          this.$set(this.deviceVos[deviceIndex], "isShowPic", true);
          this.$set(this.deviceVos[deviceIndex], "isShowLoadPic", false);
        }
      });
    },

    getData() {
      var id = localStorage.getItem("id");
      let param = {
        id: id
      };
      this.$byApi.getWorkSheetInfo(param).then(res => {
        if (res.data.flag == 1) {
          localStorage.setItem("GD_data", JSON.stringify(res.data.obj));
          this.createTime = res.data.obj.createTime;
          this.backFill(res.data.obj);
          this.statuShow(res.data.obj.status);
        }
      });
    },
    backFill(data) {
      this.name = data.name;
      this.phone = data.phone;
      this.isShowDevice = data.vehicleFlag == 0 ? true : false;
      this.remark = data.remark;
      this.carOwner = data.carOwner;
      this.plate = data.plate;
      this.deviceVos = data.deviceVos.length > 0 ? data.deviceVos : [{}];
      this.getLineInfo();
    },
    getGongDan() {
      var id = localStorage.getItem("id");
      let param = {
        id: id
      };
      this.$byApi.getWorkSheetInfo(param).then(res => {
        if (res.data.flag == 1) {
          localStorage.setItem("GD_data", JSON.stringify(res.data.obj));
          this.$router.push("/Details");
        }
      });
    },
    getLineInfo() {
      this.Zdata = JSON.parse(localStorage.getItem("GD_data")).deviceVos;
      this.onlineList = [];
      for (var i = 0; i < this.Zdata.length; i++) {
        this.getFromVehicleId(this.Zdata[i].deviceId, i);
      }
    },
    getFromVehicleId(vehicleId, n) {
      /////////////////////////////////////////////////////////根据VehicleId请求具体数据
      let that = this;
      let param = {
        vehicleId: vehicleId
      };
      this.$byApi
        .getCarLocationInfo(param)
        .then(res => {
          if (res.data.flag == 1) {
            this.$set(
              that.deviceVos[n],
              "isOnlineType",
              that.isOnlines(res.data.obj.Z, res.data.obj.B)
            );
            this.$set(
              that.deviceVos[n],
              "bgColor",
              that.bgColor(res.data.obj.Z, res.data.obj.B)
            );
          }
        })
        .catch(() => {});
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
    statuShow(key) {
      switch (Number(key)) {
        case 1: ///////待确认
          this.timeType = "预安装时间";
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).installTime;
          break;
        case 2: ///////待安装
          this.timeType = "确认时间";
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).confirmTime;
          break;
        case 3: ///////已安装
          this.timeType = "安装时间";
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).installedTime;
          break;
        case 4: ///////已完成
          this.timeType = "完成时间";
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).finishTime;
          break;
        case 5: ///////已取消
          this.timeType = "取消时间";
          this.timeData = JSON.parse(
            localStorage.getItem("GD_data")
          ).cancelTime;
          break;
      }
    },
    upload_install() {
      // if (this.installPositions.length != this.deviceVos.length) {
      //   this.msg = "请先输入安装位置！";
      //   this.showValue = true;
      //   this.showPosition = "middle";
      //   return;
      // }
      if (this.isShowDevice) {
        if (this.installPositions.length == 0) {
          this.msg = "请先输入设备1的安装位置！";
          this.showValue = true;
          this.showPosition = "middle";
          return;
        } else {
          for (var i = 0; i < this.deviceVos.length; i++) {
            if (!this.installPositions[i]) {
              console.log(i);
              this.msg = "请先输入设备" + (i + 1) + "的安装位置！";
              this.showValue = true;
              this.showPosition = "middle";
              return;
            }
          }
        }
      }
      for (var i = 0; i < this.deviceVos.length; i++) {
        if (!this.deviceVos[i].basestr) {
          this.isBasestr = false;
        } else {
          this.isBasestr = true;
        }
      }
      // if (!this.isBasestr) {
      //   this.msg = "请先选择上传图片！";
      //   this.showValue = true;
      //   this.showPosition = "middle";
      //   return;
      // }

      this.isClick = true;

      let id = JSON.parse(localStorage.getItem("id"));
      let installPositions = this.installPositions.join(",");
      let majorIds = [];
      let pictures = [];
      let carPictures = [];
      for (var i = 0; i < this.deviceVos.length; i++) {
        majorIds.push(this.deviceVos[i].majorId);
        pictures.push(this.deviceVos[i].pics);
      }
      majorIds = majorIds.join(",");
      pictures = pictures.join(",");

      console.log(this.carList_CS);
      for (var i = 0; i < this.carList_CS.length; i++) {
        if (this.carList_CS[i].pics_CS != "") {
          carPictures.push(this.carList_CS[i].pics_CS);
        }
      }
      if (carPictures) {
        carPictures = carPictures.join(",");
      } else {
        carPictures = "";
      }
      console.log(carPictures);

      let param = {
        id: id,
        installPositions: installPositions,
        majorIds: majorIds,
        pictureUrls: pictures,
        // carPicture:this.pics_CS
        carPicture: carPictures,
        remark: this.remark,
        vehicleFlag: this.isShowDevice ? 0 : 1
      };

      if (this.isRequest) {
        this.isRequest = false;
        this.$byApi
          .uploadWorkSheetInfo(param)
          .then(res => {
            if (res.data.flag == 1) {
              this.isClick = false;
              this.isRequest = true;
              this.isShowTC = true;
              localStorage.setItem("isInstall", true);
              localStorage.setItem("isGoDetails", true);
              this.goTo();
            } else {
              this.isRequest = true;
              this.isClick = false;
            }
          })
          .catch(() => {
            this.isRequest = true;
            this.isClick = false;
          });
      }
    },
    goBack() {
      this.$router.push("/home");
    },
    backGD() {
      this.$router.push("/home");
    },
    // goTo() {
    //   localStorage.setItem('detailToMap',true)
    //   this.$router.push("/Equipment");
    // },
    goTo() {
      this.getGongDan();
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="less">
.installInfo {
  .mainbox {
    position: absolute;
    z-index: -999;
    overflow-y: scroll;
    top: 1rem;
    height: 82vh;
    width: 100%;
  }

  .header {
    // position: relative;
    // background: #fff;
    // text-align: center;
    // padding: 0.1rem 0.2rem;
    // height: 0.7rem;
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
      margin-top: 0.08rem;
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
        margin-right: 0.5rem;
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
    min-height: 66px;
    padding-top: 6px;
    overflow: hidden;
    .installStyle {
      color: #999999;
      margin-left: 0.2rem;
      font-size: 0.25rem;
    }
  }
  .main {
    //   flex: 1;
    margin-top: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    //  border-top: 1px solid #ddd;
    .main_footer {
      color: #cbcbcb;
      font-size: 0.3rem;
      margin-left: 1.8rem;
    }
    .installStyle {
      color: #999999;
      margin-left: 0.2rem;
    }
    .installMain {
      margin-top: 0.1rem;
    }
    .main_contant_first {
      padding-top: 20px !important;
    }
    .carPicStyle {
      width: 99%;
      display: flex;
    }
    .main_contant {
      clear: both;
      min-height: 0.8rem;
      display: flex;
      font-size: 0.25rem;
      padding: 0.2rem;
      .loadPic {
        font-size: 0.2rem;
        margin-top: 37px;
        margin-left: 0.3rem;
      }
      .loadPic2 {
        height: 20px;
        padding: 5px 10px 0px 20px;
        text-align: center;
      }
      .imgStyle {
        width: 60px;
        height: 60px;
        padding-left: 0.2rem;
      }
      .main_right_last {
        color: #999;
        padding-left: 0.2rem;
      }
      .main_left {
        display: inline-block;
        width: 20%;
        color: #999999;
      }
      .main_right {
        color: #999;
        // color: #333;
        display: inline-block;
        width: 80%;
        border-bottom: 1px solid #ddd;
        padding-left: 0.2rem;
        input {
          border: none;
          width: 100%;
        }
        ::-webkit-input-placeholder {
          color: #333;
        }
        input,
        textarea,
        select,
        a:focus {
          outline: none;
        }
      }
      .main_right_upload {
        color: #999999;
        display: flex;
        // width: 80%;
        width: 60px;
        height: 60px;
        background: #f2f2f2;
        margin-left: 0.2rem;
        // text-align: center;
        justify-content: center;
        align-items: center;
        div {
          font-size: 0.5rem;
        }
      }
      .orangeStyle {
        color: #ff803a;
      }
      .greenStyle {
        color: #1ccc4a;
      }
    }
  }
  .footer {
    // width: 100%;
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // text-align: center;
    text-align: center;
    position: fixed;
    bottom: 0rem;
    width: 100%;
    z-index: 999999999;
    .installStyle {
      font-size: 0.3rem;
      color: #fff;
      background: #0866f6;
      height: 1rem;
      line-height: 1rem;
    }
    .installStyle_c {
      font-size: 0.3rem;
      color: #fff;
      background: #4a92ff;
      height: 1rem;
      line-height: 1rem;
    }
  }
  .seiBei_left {
    align-items: center;
    padding: 0.2rem;
    font-size: 12px;
    display: flex;
    width: 70%;
    float: left;
    .iconfontStyle {
      // position: relative;
      // top:-4px;
      // display:inline-block;
      // color: #c1c1c1;
      // margin-right:10px;
      display: inline-block;
      color: #c1c1c1;
      margin-right: 5px;
      -webkit-transform: scale(1);
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
      // width: 100px;
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
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      // width: 48px;
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
    font-size: 18px;
    // border: 1px solid #ddd;
    width: 18%;
    float: right;
    display: flex;
    justify-content: flex-end;
    .icon-shuaxin,
    .icon-dizhi {
      font-size: 18px;
      background: #e9f2ff;
      padding: 1px 3px;
      border-radius: 20px;
      color: #0866f6;
      margin-right: 20px;
    }
    .icon-dizhi {
      margin-right: 10px;
    }
  }
  .boxStyle {
    position: relative;
    .jian {
      position: absolute;
      top: -7px;
      right: -7px;
      color: #fff;
      background: red;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      padding: 5px;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      b {
        font-size: 12px;
        transform: scale(0.8);
      }
    }
  }
  .padding10 {
    padding-left: 10px;
  }
  .padding15 {
    padding-left: 15px;
  }
}
.devRemark {
  color: red;
  font-size: 0.2rem;
  margin-left: 21%;
}
.placeholderStyle {
  font-size: 0.25rem;
}
</style>