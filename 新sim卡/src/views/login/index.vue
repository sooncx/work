<template>
  <div class="login-box">
    <div class="login-logo">
      <img src="../../public/img/logo.png">
    </div>
    <div class="login-content">
      <div class="content-left">
        <div class="form-box">
          <div class="form-title">欢迎登陆SIM卡系统</div>
          <div class="form-inputBox">
            <div>
              <i class="icon-my iconfont"></i>
            </div>
            <input
              v-model.trim="username"
              type="text"
              placeholder="账号"
            />
          </div>
          <div class="form-inputBox">
            <div>
              <i class="icon-14-01 iconfont"></i>
            </div>
            <input
              v-model.trim="password"
              type="password"
              placeholder="密码"
              @keyup.enter="login()"
            />
          </div>
          <div
            class="form-btn"
            @click="login()"
          >
            登录
          </div>
        </div>
      </div>
      <div class="content-bgone"></div>
      <div class="content-bgtwo"></div>
    </div>
  </div>
</template>


<script>
export default {
  methods: {
    login() {
      let params = {
        name: this.username,
        password: this.password
      };

      if (params.name == "" || params.password == "") {
        this.$message({
          message: "账号或密码不能为空",
          type: "warning"
        });
        return;
      }

      this.$API.login(params).then(res => {
        this.$message({
          message: "登录成功",
          type: "success"
        });
        localStorage.setItem("LOGINUSER", JSON.stringify(res.data.obj));
        this.$store.commit("GETLOGINUSER", res.data.obj);
        this.$router.push("/");
      });
    }
  },

  data() {
    return {
      username: "",
      password: ""
    };
  }
};
</script>


<style lang="scss" scoped>
@import "@/public/css/mixin.scss";
.login-box {
  min-width: 1200px;
  min-height: 700px;
  background: url("../../public/img/login/loginBg.jpg");
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  .login-content {
    // width: 50%;
    // height: 50%;
    // min-width: 560px;
    // width: 564px;
    // min-height: 350px;
    position: absolute;
    right: 240px;
    top: 50%;
    transform: translateY(-50%);
    // background: #fff;
    display: flex;
    .content-bgone {
      width: 430px;
      position: absolute;
      height: 387px;
      top: 10px;
      left: -19px;
      background: linear-gradient(0deg, #1261da, #4252b2);
      opacity: 0.3;
      z-index: 9;
    }
    .content-bgtwo {
      width: 460px;
      position: absolute;
      height: 367px;
      top: 20px;
      left: -35px;
      background: linear-gradient(0deg, #1261da, #4252b2);
      opacity: 0.3;
      z-index: 8;
    }
    .content-left {
      width: 396px;
      height: 406px;
      z-index: 10;
      background: linear-gradient(
        0deg,
        rgba(10, 76, 176, 1),
        rgba(68, 108, 222, 1)
      );
      .form-box {
        padding-top: 68px;
        width: 60%;
        margin: auto;
        .form-btn {
          cursor: pointer;
          background: rgba(88, 132, 255, 1);
          box-shadow: 0px 4px 8px 0px rgba(15, 79, 180, 0.2);
          width: 100%;
          height: 35px;
          line-height: 35px;
          text-align: center;
          color: #fff;
          margin-top: 30%;
          font-size: 14px;
        }
        .form-inputBox {
          display: flex;
          margin-top: 50px;
          height: 35px;
          &:nth-child(3) {
            margin-top: 30px;
          }
          div {
            width: 50px;
            text-align: center;
            line-height: 35px;
            color: #fff;
            background: #5280e6;
          }
          input {
            width: 100%;
            height: auto;
            color: #fff;
            background: #2d5fcc;
            border: 1px solid #5280e6;
            @extend .inputBg;
          }
        }
        .form-title {
          font-size: 24px;
          font-family: PingFang-SC-Heavy;
          font-weight: 800;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    .content-right {
      width: 50%;
      background: url("../../public/img/login/logincont.png");
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  .login-logo {
    padding: 45px 0 0 61px;
  }
}
</style>
