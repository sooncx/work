<template>
  <div class="Details">
    <div class="header">
      <div
        class="back iconfont icon-fanhui"
        @click="backGo"
      ></div>
      <div class="header_title">
        <span class="header_titleStyle">新建工单</span>
        <img
          @click="toggle"
          :class="[checked?'inputshow':'']"
          src="../../assets/image/device.png"
          alt=""
        >
      </div>
    </div>
    <div class="mainbox">
      <div class="inputList">
        <autoInput
          @devicesList="devicesLists"
          :checked="checked"
        ></autoInput>
      </div>
      <div class="main">
        <div class="main_contant">
          <span class="redMust"></span>
          <span class="main_left">车主姓名</span>
          <span class="main_right"><input
              type="text"
              v-model="carOwner"
              placeholder="请输入车主姓名"
            ></span>
        </div>
        <div class="main_contant">
          <span class="redMust">*</span>
          <span class="main_left">联系方式</span>
          <span class="main_right"><input
              type="number"
              v-model="phone"
              placeholder="请输入联系方式"
            ></span>
        </div>
        <div class="main_contant">
          <span class="redMust">*</span>
          <span class="main_left">安装时间</span>
          <span
            class="main_right"
            @click="showPlugin"
          >
            <span v-if="isShowInstall">{{installTime}}</span>
            <span
              v-else
              class="install2"
            >请输入安装时间</span>

            <!-- <input
              type="number"
              v-model="installTime"
              placeholder="请输入安装时间"
            > -->

            <!-- <datetime
              v-model="installTime"
              placeholder="请选择安装时间"
              format="YYYY-MM-DD HH:mm"
              @on-change="change"
              year-row="{value}年"
              month-row="{value}月"
              day-row="{value}日"
              hour-row="{value}点"
              minute-row="{value}分"
              confirm-text="完成"
              cancel-text="取消"
            ></datetime> -->
          </span>
        </div>
        <div class="main_contant">
          <span class="redMust"></span>
          <span class="main_left">安装地点</span>
          <span class="main_right"><input
              type="text"
              v-model="address"
              placeholder="请输入安装地点"
            ></span>
        </div>
        <div class="main_contant">
          <span class="redMust"></span>
          <span class="main_left">备注信息</span>
          <textarea
            class="textareaStyle"
            name=""
            v-model="remark"
            placeholder="请输入备注"
            cols="40"
            rows="10"
          ></textarea>
        </div>
      </div>
    </div>
    <toast
      v-model="showValue"
      type="text"
      :time="1500"
      is-show-mask
      :text="msg"
      width="5rem"
      position="middle"
    >{{ msg }}</toast>
    <div
      class="footerbox"
      @click="jumbTo()"
    >
      确认新增，继续添加安装信息
    </div>
  </div>
</template>
<script>
import { Toast } from "vux";
import autoInput from "@/components/autoInput";
import { Datetime } from "vux";
import { win32 } from "path";
export default {
  name: "AddNew",
  data() {
    return {
      checked: false,
      isShowInstall: false,
      address: "",
      carOwner: "",
      installTime: "",
      devices: null,
      showValue: false,
      msg: "",
      showPosition: null,
      phone: "",
      remark: ""
    };
  },
  created() {
    window["aw"] = this;
  },
  activated() {
    this.clearData();
    this.isShowInstall = false;
  },
  methods: {
    toggle() {
      this.checked = !this.checked;
      if (!this.checked) {
        this.clearData();
      }
    },
    showPlugin() {
      var that = this;
      aw.$vux.datetime.show({
        cancelText: "取消",
        confirmText: "确定",
        format: "YYYY-MM-DD HH:mm",
        value: "请输入安装时间",
        onConfirm(val) {
          console.log("plugin confirm", val);
          that.isShowInstall = true;
          that.installTime = val;
        },
        onShow() {
          console.log("plugin show");
        },
        onHide() {
          console.log("plugin hide");
        }
      });
    },
    clearData() {
      this.carOwner = "";
      this.devices = [
        {
          sheBei: "",
          isloading: false,
          isDui: false,
          isError: false,
          errorData: "请填写正确的设备号！"
        }
      ];
      this.installTime = "";
      this.phone = "";
      this.remark = "";
      this.address = "";
    },
    backGo() {
      this.checked = false;
      this.$router.go(-1);
      this.clearData();
    },
    devicesLists(data) {
      this.devices = data;
    },
    change() {
      console.log("time::" + this.installTime);
    },
    jumbTo() {
      if (
        (this.checked && this.devices[0].sheBei === "") ||
        this.devices === null ||
        localStorage.getItem("isNot") == "true" ||
        (this.checked && this.devices.length < 2)
      ) {
        this.msg = "请先输入正确的设备号！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      if (localStorage.getItem("isSame") == "true") {
        this.msg = "请误输入相同的设备号";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      // }
      if (this.phone.length == 0) {
        this.msg = "请先输入联系方式！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      if (this.installTime == "") {
        this.msg = "请先输入安装时间！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }

      if (this.remark == "" && !this.checked) {
        this.msg = "请先输入备注信息！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      let param = {
        carOwner: this.carOwner, ////车主
        devices: this.devices, ///设备id
        installTimes: this.installTime, ///安装时间
        phone: this.phone, ///联系方式
        remark: this.remark, ///备注
        address: this.address
      };

      this.$byApi.newWorkSheetInfo(param).then(res => {
        if (res.data.flag == 1) {
          this.msg = "新建成功！";
          this.showValue = true;
          this.showPosition = "middle";

          localStorage.setItem("id", res.data.obj);

          this.$router.push("/InstallInfo");
          localStorage.setItem("addSuccess", true);
        } else {
          this.msg = res.data.msg;
          this.showValue = true;
          this.showPosition = "middle";
        }
      });
    }
  },

  components: {
    autoInput,
    Datetime,
    Toast
  }
};
</script>

<style lang="less" scoped >
@import "~vux/src/styles/reset.less";
.Details {
  /deep/ .vux-datetime {
    color: #cfcfcf;
  }
  .textareaStyle::-webkit-input-placeholder {
    color: #cfcfcf !important;
    font-size: 0.25rem;
  }
  input,
  textarea,
  select,
  a:focus {
    outline: none;
  }
  textarea {
    color: #333;
    //   padding: 0.2rem 0.6rem 0.2rem 0.6rem;
    padding: 0.1rem;
    padding-left: 0.3rem;
    border: none;
  }
  .header {
    width: 100%;
    position: fixed;
    background: #fff;
    text-align: center;
    padding: 0.1rem 0.2rem;
    height: 0.7rem;
    border-bottom: 1px solid #e1e5e9;
    .back {
      font-size: 0.35rem;
      float: left;
      font-weight: 600;
      // margin-top:.08rem;
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
      img {
        width: 0.5rem;
        height: 0.5rem;
        opacity: 0.5;
        float: right;
        position: fixed;
        right: 0.3rem;
        // margin-top:.08rem;
        padding: 0.1rem 0 0.2rem 0;
      }
    }
  }
  .mainbox {
    position: absolute;
    z-index: -999;
    overflow: scroll;
    top: 1rem;
    height: 100vh-15rem;
    width: 100%;
  }
  .main {
    // flex: 1;
    margin-top: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    .main_contant {
      min-height: 0.8rem;
      display: flex;
      font-size: 0.25rem;
      padding: 0.2rem;
      .redMust {
        display: inline-block;
        width: 5.7px;
        color: red;
      }
      .main_left {
        display: inline-block;
        width: 20%;
        color: #999999;
      }
      .main_right {
        color: #333;
        display: inline-block;
        width: 80%;
        border-bottom: 1px solid #ddd;
        padding-left: 0.2rem;
        input {
          border: none;
          width: 100%;
          font-size: 0.25rem;
        }
        ::-webkit-input-placeholder {
          color: #cbcbcb;
        }
      }
      .main_right_last {
        color: #333;
        display: inline-block;
        width: 80%;
        // border-bottom: 1px solid #ddd;
        padding-left: 0.2rem;
      }
      .orangeStyle {
        color: #ff803a;
      }
      .greenStyle {
        color: #1ccc4a;
      }
    }
  }
  .footerbox {
    position: absolute;
    background: #0866f6;
    font-size: 0.3rem;
    bottom: 0rem;
    color: #fff;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
  }
  .install2 {
    color: #cfcfcf;
    font-size: 0.25rem;
  }
}
.inputshow {
  opacity: 1 !important;
}
</style>
