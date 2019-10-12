<template>
  <div class="LoginBox">
    <div class="bgStyle" :style="{'backgroundImage':'url('+bg_pic+')'}">
      <div class="header"><img
          class="imgStyles"
          :src="logo_pic"
          alt=""
        ></div>
      <div class="main">
        <div class="login">

          <div class="underline">
            <div>
              <i class="img iconfont icon-zhanghao"></i>
            </div>
            <div class="input_border">
              <input
                class="input"
                v-model.trim="user.name"
                placeholder='账号/手机号'
              />
            </div>

          </div>
          <div class="underline">
            <div>
              <i class="img iconfont icon-mima"></i>
            </div>
            <div class="input_border">
              <input
                class="input"
                @keyup.enter="login"
                v-model.trim="user.password"
                type="password"
                placeholder='请输入6~12位密码'
              />
            </div>
          </div>
          <div
            class="login-btn btn_style"
            @click="login"
          >登录</div>
        </div>
      </div>
    </div>

    <toast
      v-model="showValue"
      type="text"
      :time="1000"
      is-show-mask
      :text="msg"
      width="5rem"
      position="middle"
    >{{ msg }}</toast>
  </div>
</template>

<script>
import { Toast, ToastPlugin } from "vux";
import { byUtil } from "@/public/js/plugin/base";
export default {
  data() {
    return {
      msg: "",
      showValue: false,
      user: {
        name: "",
        password: ""
      },
      logo_pic:require("@/assets/image/logo.png")
    };
  },
  mounted() {},
  created() {
    // this.getUser();
    // if(localStorage.getItem('loginData')){
    //    this.$router.push('/Details')
    //   }
  },
  components: {
    Toast
  },
  methods: {
    pushMethod(userId) {
      let appId = localStorage.getItem("appId");
      let deviceId = localStorage.getItem("deviceId");

      console.log(appId, deviceId);
      // if (localStorage.getItem("loginData")) {

      let param = {
        appId: appId,
        deviceId: deviceId,
        userId: userId
      };
      this.$byApi.register(param).then(res => {}).catch(e=>{
        console.error(e)
      });
      // }
    },
    getUser() {
      if (localStorage.getItem("loginData")) {
        this.user.name = JSON.parse(localStorage.getItem("loginData")).user;
        this.user.password = JSON.parse(
          localStorage.getItem("loginData")
        ).password;
        // this.login()
        // this.$router.push("/home");
      }
    },
    login() {
      if (this.user.name == "" || this.user.password == "") {
        this.msg = "用户名或密码不能为空";
        this.showValue = true;
        this.showPosition = "middle";
        return false;
      }
      if (this.user.password.length < 6 || this.user.password.length > 12) {
        this.msg = "请输入6-12位密码";
        this.showValue = true;
        this.showPosition = "middle";
        return false;
      }
      let param = {
        username: this.user.name,
        password: this.user.password
      };
      this.$byApi
        .login(param)
        .then(res => {
          if (res.data.flag == 1) {
            // this.msg = "登录成功";
            // this.showValue = true;
            // this.showPosition = "middle";
            this.$vux.toast.text("登录成功");
            this.$set(res.data.obj, "user", this.user.name);
            this.$set(res.data.obj, "password", this.user.password);

            localStorage.setItem('sid',res.data.obj.sessionId)

            this.pushMethod(res.data.obj.userId);
            localStorage.setItem("loginData", JSON.stringify(res.data.obj));
            byUtil.setCookie("sid", res.data.obj.sessionId, "h12");
            this.$store.commit("GETUSER", res.data.obj.sessionId);
            this.$router.push("/home");
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(e => {
          // this.$vux.toast.text("请求超时，请稍后再试");
        });
    }
  },
  computed: {
    bg_pic() {
      return require("@/assets/image/bg.png");
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
.LoginBox {
  .bgStyle {
    margin: 0px;
    padding: 0px;
    width: 100%;
    background: url('/assets/image/bg.png');
    background-size: 100% 100%;
    height: 100%;
    overflow: hidden;
    background-position: center top;
    background-repeat: no-repeat;
    position: absolute;
    z-index: -999;
  }
  .header {
    width: 100%;
    height: 4rem;
    text-align: center;

    .imgStyles {
      position: relative;
      // left:50%;
      top: 50%;
      width: 40%;
    }
  }
  .main {
    margin: 0.2rem 0.64rem;
    .login {
      // line-height: 1rem;
      display: block;
      text-align: center;
      z-index: 999;
      .login-btn {
        margin-top: 1rem;
        position: relative;
        width: 100%;
        height: 0.78rem;
        color: #fff;
        font-size: 0.3rem;
        // font-family: PingFang-SC-Bold;
        // font-weight: bold;
        // text-indent: 0.4rem;
        // letter-spacing: 0.1rem;
        border: 0px;
        background: #0a5ce5;
        border-radius: 0.4rem;
      }
      .underline {
        display: flex;
        align-items: center;
        width: 100%;
        line-height: 1rem;
        height: 1rem;
        .input_border {
          border-bottom: 1px solid blue;
        }
        .img {
          // font-size: .875rem;
          margin: 0.1rem 0.44rem 0.2rem 0;
          background-repeat: no-repeat;
          color: #0a5ce5;
          font-size: 0.65rem;
        }
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s;
        }
        input,
        textarea,
        select,
        a:focus {
          outline: none;
        }
        input {
          border-bottom: solid 0.02rem #c5c5c5;

          vertical-align: middle;
          font-size: 0.32rem !important;
          line-height: 0.6rem !important;
          width: 5rem;
          border: solid 1px transparent;
          background-color: transparent !important;
          color: #333333;
          &::-webkit-input-placeholder {
            color: #c3c3c3 !important;
          } /* 使用webkit内核的浏览器 */
          &:-moz-placeholder {
            color: #c3c3c3 !important;
          } /* Firefox版本4-18 */
          &::-moz-placeholder {
            color: #c3c3c3 !important;
          } /* Firefox版本19+ */
          &:-ms-input-placeholder {
            color: #c3c3c3 !important;
          } /* IE浏览器 */
        }
      }
    }
    .login-btn {
      margin-top: 0.12rem;
      position: relative;
      width: 100%;
      height: 0.78rem;
      line-height: 0.78rem;
      color: #4f9cfb;
      font-size: 0.3rem;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      text-indent: 0.4rem;
      letter-spacing: 0.1rem;
      border: 0px;
    }
    .loginType {
      display: flex;
      justify-content: space-between;
      a {
        color: #fff;
        font-family: PingFang-SC-Medium;
        font-size: 0.28rem;
      }
    }
  }
}
</style>