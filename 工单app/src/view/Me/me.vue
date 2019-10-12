<template>
  <div class="me">
    <div class="header">
      <div class="contant">
        <div class="user_pic">
          <img src="@/assets/image/user_pic.png">
        </div>
        <div class="user_tex">
          <div>{{userName}}</div>
          <div>个人资料</div>
        </div>
        <div
          class="right_pic iconfont icon-you"
          @click="goModified_data()"
        ></div>
      </div>
    </div>
    <div class="main">
      <div
        class='changePassWord'
        @click="goPassWord()"
      >
        <img src="@/assets/image/yaoshi.png">
        <div class="main_center">修改密码</div>
        <div class="main_right iconfont icon-you"></div>
      </div>
    </div>
    <div
      class="exit"
      @click="exit"
    >
      退出登录
    </div>
  </div>
</template>

<script>
import { byUtil } from "@/public/js/plugin/base";
export default {
  //   name: 'App'
  data() {
    return {
      userName: "test"
    };
  },
  methods: {
    exitZhuXiao() {
      this.$store.commit("GETUSER", "");

        byUtil.removeCookie("sid");
        this.$router.push("/Login");
        localStorage.setItem("loginData", "");
        localStorage.setItem('tabIndex','');
    
        localStorage.setItem('sid','')
    },
    goModified_data() {
      this.$router.push("/modified_data");
    },
    goPassWord() {
      this.$router.push("/passWord");
    },
    exit() {
     
      let appId = localStorage.getItem("appId");
      let deviceId = localStorage.getItem("deviceId");
      console.log(8888888, appId, deviceId);

      let param = {
        appId: appId,
        deviceId: deviceId
      };
      this.$byApi.exitPushApp(param).then(res => {
           this.exitZhuXiao();
      });
      
    }
  },

  created() {
    // alert(this.$route.path)
    this.userName = JSON.parse(localStorage.getItem("loginData")).name;
  }
};
</script>

<style lang="less" >
.me {
  .header {
    position: relative;
    height: 3.2rem;
    background: -webkit-linear-gradient(left, #63799b, #a6b9d0);
    .contant {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      .user_pic {
        float: left;
        margin-left: 0.4rem;
      }
      .user_tex {
        float: left;
        margin-top: 0.2rem;
        font-size: 0.3rem;
        margin-left: 0.2rem;
      }
      .right_pic {
        float: right;
        font-size: 0.5rem;
        margin-right: 0.3rem;
        margin-top: 0.4rem;
      }
    }
  }
  .main {
    margin-top: 0.3rem;
    .changePassWord {
      display: flex;
      background: #fff;
      padding: 0.2rem 0.3rem;
      img {
        display: inline-block;
        height: 21px;
        width: 17px;
      }
      .main_center {
        margin-left: 0.3rem;
        font-size: 0.3rem;
      }
      .main_right {
        position: absolute;
        right: 0.3rem;
      }
    }
  }
  .exit {
    padding: 0.2rem 0.3rem;
    margin-top: 0.4rem;
    text-align: center;
    font-size: 0.3rem;
    background: #fff;
    color: #0866f6;
  }
}
</style>
