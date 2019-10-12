<template>
  <div class="login-box">
    <div class="login-logo">
      <img src="../../public/img/logo.png">
    </div>
    <div class="login-content">
      <div class="content-left">
        <div class="form-box">
          <div class="form-title">欢迎登陆博云物联</div>
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
      <div class="content-right"></div>
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
        this.$msg({
          message: "账号或密码不能为空",
          type: "warning"
        });
        return;
      }
      console.log(this.$API.login)
      this.$API.login(params).then(res => {
        if (res.code === 0) {
          if (!(res.data.obj.userType === 1 || res.data.obj.userType === 2)) {
            this.$msg({
              message: "客户端账号不能登录！",
              type: "warning"
            });
            return;
          }
          this.$msg({
            message: "登录成功！",
            type: "success"
          });
          localStorage.setItem("LOGINUSER", JSON.stringify(res.data.obj));
          this.$store.commit("GETLOGINUSER", res.data.obj);
          res.data.obj.userType === 1 && this.$router.push("/");
          res.data.obj.userType === 2 && this.$router.push("/marketing");
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
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
  min-width: 1100px;
  min-height: 700px;
  background: url("../../public/img/login/loginBg.png");
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  .login-content {
    @extend .fix-center;
    width: 50%;
    height: 50%;
    // background: #fff;
    display: flex;
    .content-left {
      width: 50%;
      background: #fff;
      .form-box {
        padding: 68px 76px 86px 81px;
        .form-btn {
          cursor: pointer;
          background: #1556cd;
          width: 100%;
          height: 35px;
          line-height: 35px;
          text-align: center;
          color: #fff;
          margin-top: 60px;
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
            width: 60px;
            text-align: center;
            line-height: 35px;
            color: #fff;
            background: #e2e7f0;
          }
          input {
            width: 100%;
            height: auto;
            @extend .inputBg;
          }
        }
        .form-title {
          color: #0545c7;
          font-size: 21px;
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
