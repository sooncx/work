<template>
    <div class="modified_data">
        <div class="header">
            <div class="back iconfont icon-fanhui" @click="goBack"></div>
            <div class="header_title">
                <span class="header_titleStyle">修改资料</span>
            </div>
        </div>
        <div class="main">
            <div class="title">名称</div>
            <input type="text" v-model="name" placeholder="请输入名称">
            <span class="title">手机号码</span>
            <input type="text" v-model="phoneNum" placeholder="请输入手机号码">
            <div class="title">个人简介</div>
            <textarea name="" v-model="remark" placeholder="请输入个人简介" cols="15" rows="10"></textarea>
        </div>
        <!-- <div class="footer">
            <div class="text_footer">
                确认修改
            </div>

        </div> -->

    </div>
</template>

<script>
export default {
  data() {
    return {
      name:'',
      phoneNum:'',
      remark:'',
    };
  },
  components: {},
  methods: {
    goBack(){
      this.$router.go(-1)
    }
  },
  created(){
    this.name=JSON.parse(localStorage.getItem('loginData')).name;
    this.phoneNum=JSON.parse(localStorage.getItem('loginData')).phone;
    this.remark=JSON.parse(localStorage.getItem('loginData')).remark;
  }
};
</script>

<style lang="less">
.modified_data {
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