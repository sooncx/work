<template>
  <div class="passWord">
    <div class="header">
      <div class="back iconfont icon-fanhui" @click="goBack()"></div>
      <div class="header_title">
        <span class="header_titleStyle">修改密码</span>
      </div>
    </div>
    <div class="main">
      <div class="title">旧密码</div>
      <input type="passWord" v-model="oldPassWord" placeholder="请输入旧密码">
      <span class="title">新密码</span>
      <input type="passWord" v-model="newPassWord1" placeholder="请输入6-12位的新密码">
      <input style="margin-top:.2rem;" v-model="newPassWord2" @blur="jiaoYan" type="passWord" placeholder="再次输入6-12位的新密码">
    </div>
    <toast v-model="showValue" type="text" :time="1500" is-show-mask :text="msg" width="5rem" position="middle">{{ msg }}</toast>
    <div class="footer">
      <div class="text_footer" @click="confirmEvent()">
        确认修改
      </div>

    </div>

  </div>
</template>

<script>
import { Toast } from "vux";
export default {
  data() {
    return {
      isSame: false,
      msg: "",
      oldPassWord: "",
      newPassWord1: "",
      newPassWord2: "",
      showValue: false,
      showPosition: null
    };
  },
  components: { Toast },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    jiaoYan() {
      if (this.newPassWord1 != "" || this.newPassWord2 != "") {
        if (this.newPassWord1 !== this.newPassWord2) {
          this.isSame = false;
          this.msg = "两次输入的新密码不一致！";
          this.showValue = true;
          this.showPosition = "middle";
        } else {
          this.isSame = true;
        }
      } else {
        this.msg = "请先输入新密码！";
        this.showValue = true;
        this.showPosition = "middle";
      }
    },
    confirmEvent() {
      this.jiaoYan();
      if (this.oldPassWord == "") {
        this.msg = "请先输入旧密码！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      if (this.newPassWord1 == "" || this.newPassWord2 == "") {
        this.msg = "请先输入新密码！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      if (this.newPassWord1.length < 6 || this.newPassWord2.length < 6) {
        this.msg = "新密码输入有误！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      if (!this.isSame) {
        this.msg = "两次输入的新密码不一致！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      if (
        this.newPassWord1 == this.oldPassWord ||
        this.newPassWord2 == this.oldPassWord
      ) {
        this.msg = "旧密码和新密码一致！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      let param = {
        newPassword: this.newPassWord2,
        password: this.oldPassWord
      };
      this.$byApi.updatePassword(param).then(res => {
        if(res.data.flag==1){
          this.msg = "密码修改成功";
          this.showValue = true;
          this.showPosition = "middle";

          this.oldPassWord='';
          this.newPassWord1='';
          this.newPassWord2='';
        }else{
          this.msg = res.data.msg;
          this.showValue = true;
          this.showPosition = "middle";
        }
      });
    }
  }
};
</script>

<style lang="less">
.passWord {
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #fff;
    padding: 0.1rem 0.2rem;
    height: 0.7rem;
    .back {
      font-size: 0.35rem;
      font-weight: 600;
       margin-top: .08rem;
    }
    .header_title {
       .header_titleStyle{
        margin-right:.35rem;
      }
      flex: 1;
      text-align: center;
      height: 0.7rem;
      color: #333333;
      font-size: 0.4rem;
       margin-top: .08rem;
    }
  }
  .main {
    display: flex;
    flex-direction: column;
    .title {
      padding: 0.2rem;
      font-size: 0.3rem;
      color: #999999;
    }
    input {
      color: #999;
      padding: 0.1rem 0.2rem 0.1rem 0.6rem;
      height: 0.8rem;
      border: none;
    }
    ::-webkit-input-placeholder {
      color: #999;
    }
    input,
    textarea,
    select,
    a:focus {
      outline: none;
    }
    textarea {
      color: #999;
      padding: 0.2rem 0.6rem 0.2rem 0.6rem;
      border: none;
    }
  }
  .footer {
    position: fixed;
    left: 50%;
    transform: translate(-50%, -5%);
    bottom: 0.2rem;
    width: 90%;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.4rem;
    text-align: center;
    background: #0866f6;
    color: #fff;
  }
}
</style>