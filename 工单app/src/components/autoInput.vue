<template>
  <div class="autoInputBox">
    <div
      class="main_box"
      v-for="(list,index) in inputList"
      :key="index"
    >
      <span class="redMust">*</span>
      <span class="main_left">设备号{{index+1}}</span>
      <span class="main_right">
        <!-- 输入框 -->
        <!-- <el-checkbox v-model="checked" class="checkbox"></el-checkbox> -->

        <input
          type="number"
          v-model="list.sheBei"
          @blur="blur(list.sheBei,list)"
          placeholder="请输入设备号"
          :disabled="!checked&&!list.isDui"
        >
        <!-- 输入状态 -->
        <div class="statu">
          <img
            src="@/assets/image/inputLoading.gif"
            v-show="list.isloading&&!list.isDui"
          >
          <span
            class="iconfont icon-dui"
            v-show="list.isDui"
          ></span>
          <div
            class="errorInfo"
            v-show="list.isError"
          >{{list.errorData}}</div>
        </div>
        <!-- 增加或者移除input -->
        <span
          class="iconfont icon-jia2"
          v-if="index+1===inputList.length?true:false"
          @click="addInput()"
        ></span>
        <span
          class="iconfont icon-jian1"
          v-else
          @click="doDelSelectedVeh(list)"
        ></span>

        <confirm
          v-model="show"
          @on-confirm="onConfirm(index)"
        >
          <p style="text-align:center;">确定取消该设备号</p>
        </confirm>
      </span>
    </div>
    <!-- <div v-transfer-dom> -->

    <!-- </div> -->
  </div>
</template>
<script>
import { Confirm } from "vux";
import { Message } from "element-ui";
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      devicesList: [],
      show: false,
      isCan: false,
      inputList: [
        {
          sheBei: "",
          isloading: false,
          isDui: false,
          isError: false,
          errorData: "请填写正确的设备号！"
        }
      ]
    };
  },
  watch: {
    checked(newval, oldval) {
      if (!newval) {
        this.inputList = [
          {
            sheBei: "",
            isloading: false,
            isDui: false,
            isError: false,
            errorData: "请填写正确的设备号！"
          }
        ];
      }
    }
  },
  created() {
    localStorage.setItem("isNot", false);
  },
  methods: {
    onConfirm(index) {
      this.devicesList.splice(index - 1, 1);
      this.$emit("devicesList", this.devicesList);

      this.inputList.splice(index, 1);
      this.show = false;
      console.log(this.inputList);
    },
    checkData(data, list) {
      let param = {
        terminalNo: data
      };
      this.$byApi.checkDevice(param).then(res => {
        if (res.data.flag == 1) {
          localStorage.setItem("isNot", false);
          this.successStyle(res.data.obj, list);
        } else if (res.data.flag == 11011) {
          Message.warning({ message: res.data.msg, duration: 2000 });
          this.successStyle(res.data.obj, list);
        } else {
          localStorage.setItem("isNot", true);
          list.isloading = false;
          list.isDui = false;
          list.isError = true;
          list.errorData = res.data.msg;
        }
      });
    },
    successStyle(data, list) {
      list.isloading = false;
      list.isDui = true;
      this.isCan = true;
      this.inputList[this.inputList.length - 1]["vehId"] = data;
      this.addInput();
      this.devicesList.unshift(data);
      this.$emit("devicesList", this.devicesList.join(","));
    },
    blur(data, list) {
      localStorage.setItem("isSame", false);

      if (data.length > 10) {
        list.isloading = true;
        list.isError = false;
        console.log(this.inputList);

        if (this.inputList.length == 1) {
          console.log(6666);
          this.checkData(data, list);
        } else {
          var iss = true;
          for (var i = 0; i < this.inputList.length - 1; i++) {
            if (this.inputList[i].sheBei === data) {
              list.isloading = false;
              list.isDui = false;
              list.isError = true;
              list.errorData = "请误输入相同的设备号!";
              localStorage.setItem("isSame", true);
              iss = false;
            }
          }
          if (iss) {
            console.log(7777);
            list.isloading = false;
            list.isDui = false;
            this.checkData(data, list);
          }
        }
      } else {
        list.isloading = false;
        list.isDui = false;
        list.isError = true;
        list.errorData = "请输入11位或者16位的设备号";
      }
      // if(data.length ==0){
      //   console.log(2222222)
      //         list.isloading = false;
      //         list.isDui = false;
      //         list.isError = false;
      //         list.errorData = "";
      // }
    },
    addInput() {
      if (!this.isCan) {
        return false;
      }
      this.isCan = false;
      let cope = {
        sheBei: "",
        isloading: false,
        isDui: false,
        isError: false
      };
      // this.inputList.unshift(cope);
      this.inputList.push(cope);
    },
    doDelSelectedVeh(delData) {
      this.$vux.confirm.show({
        // 组件除show外的属性
        content: "确定删除该设备号",
        onCancel: () => {
          console.log(this); //当前 vm
        },
        onConfirm: () => {
          this.devicesList.map((item, index) => {
            if (item === delData.vehId) {
              this.devicesList.splice(index, 1);
            }
          });
          this.inputList.map((item, index) => {
            if (item.vehId === delData.vehId) {
              this.inputList.splice(index, 1);
            }
          });
        }
      });
    }
  },
  activated() {
    this.devicesList = [];
    this.inputList = [
      {
        sheBei: "",
        isloading: false,
        isDui: false,
        isError: false,
        errorData: "请填写正确的设备号！"
      }
    ];
  },

  components: {
    Confirm,
    Message
  }
};
</script>

<style lang="less" >
.autoInputBox {
  width: 100%;
  background: #fff;
  input,
  textarea,
  select,
  a:focus {
    outline: none;
  }
  input:disabled {
    background: #fff;
  }
  .main_box {
    position: relative;
    min-height: 0.8rem;
    display: flex;
    font-size: 0.25rem;
    padding: 0.3rem 0.2rem 0.2rem 0.2rem;
    .redMust {
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
        width: 79%;
        float: left;
        margin-top: 0.05rem;
        font-size: 0.25rem;
      }
      ::-webkit-input-placeholder {
        color: #cbcbcb;
      }
      .statu {
        float: left;
        margin-left: 0.2rem;
        margin-top: -0.08rem;
        img {
          display: inline-block;
          width: 0.35rem;
        }
        .icon-dui {
          color: #2ed126;
        }
        .errorInfo {
          color: #d33030;
          font-size: 0.2rem;
          margin-left: -0.2rem;
          width: 224px;
        }
      }

      .icon-jia2 {
        position: absolute;
        right: 0.3rem;
        top: 0.1rem;
        font-size: 0.4rem;
        color: #0866f6;
      }
      .icon-jian1 {
        position: absolute;
        right: 0.3rem;
        top: 0.1rem;
        font-size: 0.4rem;
        color: #d12626;
      }
    }
  }
}
.checkbox {
  position: relative;
  margin-top: 4px;
  margin-left: -6px;
}
</style>
