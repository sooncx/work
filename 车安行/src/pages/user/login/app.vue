<template>
  <el-card class="login-card">
    <div slot="header">
      <img :src="logo" class="logo-img">
      <span class="logo-text">Management System</span>
    </div>
    <el-form class="login" label-width="100px" >
      <el-form-item label="Phone">
        <el-input placeholder="Please enter phone number" v-model="ruleForm.userName" type="tel" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input placeholder="Please enter password" v-model="ruleForm.password" type="password" @keyup.enter="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">Login</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import logo from "assets/img/logo.png";

export default {
  data() {
    return {
      logo: logo,
      ruleForm: {
        userName: "",
        password: ""
      }
    };
  },

  methods: {
    login() {
      this.$http({
        method:"post",
        url: this.HOST + "/login/login.json",
        params: this.ruleForm
      })
        .then(rst => {
          console.log(rst);
          if (rst.flag === 1) {
            this.setCookie("sessionId",rst.obj.sid)
            location.assign("../monitorCenter.html");
          } else {
            alert(rst.msg);
          }
        })
        .catch(e => {
          alert("未知错误");
        });
      // location.assign('../user/index.html')
    },
    setCookie(c_name, value, expiredays) {
      Cookies.set(c_name, value);
      
    }
  }
};
</script>

<style>
.login-card {
  width: 800px;
  margin: 100px auto;
}
.login {
  display: block;
  width: 400px;
  margin: 100px auto;
}
.logo-img {
  width: 90px;
}
.logo-text {
  margin-left: 20px;
}
</style>
