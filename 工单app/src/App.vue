<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">showValue -->
    <toast
      v-model="showValue"
      type="text"
      :time="5000"
      is-show-mask
      :text="msg"
      width="50%"
      position="top"
      @click.native='jumpTo()'
    >{{ msg }}</toast>
     <keep-alive :include="alivePages" :exclude="excludePages">
        <router-view ref="routerView"  />
     </keep-alive>
  </div>
</template>

<script>
import { Toast } from "vux";
import { setTimeout } from 'timers';
import { byUtil } from '@/public/js/plugin/base'
export default {
  name: "App",
  data() {
    return {
      gd_list:null,
      idd:'',
      msg: "",
      showValue: false,
      showPosition: null,
      alivePages:["index","AddNew",],
      excludePages:["sliding",'TabItem']
    };
  },
  components: {
    Toast
  },
  created(){
    this.initToPage();
    // this.jumpTo();
  },
  mounted() {
    // window["vm"]=this;
    dsBridge.register("getPushInfo", data => {
      /////安卓和ios在有推送的时候主动扣我
      let id = data.id;
      let title=data.title;
      this.idd=id;
      console.log(1111,data)
      this.getDetails(id);
      this.getCountsOfNoRead()
     this.newGongDan(title);
      
    });

    dsBridge.call("WebViewfinish", {}, function() {}); /////页面加载完通知安卓和ios

    dsBridge.call("pushInfo", {}, res => {
      //////推送注册
      let that = this;
      localStorage.setItem("appId", res.appId);
      localStorage.setItem("deviceId", res.deviceId);
      that.pushMethod(res.appId, res.deviceId);
    });
  },
  methods: {
    initToPage(){
      
      // let Token = byUtil.getCookie('sid')

      // if (Token) {
      //   this.$store.commit('GETUSER', Token)
      //   this.$router.push({name:"home"})
      // }else{
      //   this.$router.push({name:"Login"})
      // }

      if (localStorage.getItem('sid')) {
        this.$router.push("/home");
      }else{
        this.$router.push("/Login");
      }
    },
    getCountsOfNoRead(){
       this.$byApi.getCountsOfNoRead().then(res => {
         this.$store.commit("GetCountOfNoread", res.data.obj);
       })
    },
    getDetails(id) {
      let param = {
        id: id
      };
      this.$byApi.getWorkSheetInfo(param).then(res => {console.log(11,res)
        if (res.data.flag == 1) {
          localStorage.setItem('isNewGongDan',true)
         
          localStorage.setItem("GD_data", JSON.stringify(res.data.obj));
          this.$store.commit("GD_data", res.data.obj);

        }
      });
    },
    changeReadFlag() {
      let param = {
        id: this.idd
      };
      this.$byApi.changeReadFlag(param).then(res => {
        this.getCountsOfNoRead()

      });
    },
    jumpTo() {
      if (this.$route.path == "/Details") {
        this.$refs.routerView.closePreviewer()  
        this.$refs.routerView.backFill()  
        this.$refs.routerView.statuShow()  

        console.log(this.$refs.routerView)
        let data=this.$store.state.GD_data;
        localStorage.setItem('GD_data',JSON.stringify(this.$store.state.GD_data))
            this.$store.commit("name", data.name);
            this.$store.commit("carOwner",data.carOwner);
            this.$store.commit("phone", data.phone);
            this.$store.commit("installTime", data.installTime);
            this.$store.commit("address", data.address);
            this.$store.commit("remark", data.remark);
            this.$store.commit("deviceVos", data.deviceVos);
            this.$store.commit("status", data.status);
      

      }else{
         this.$router.push("/Details");
         
      }
      this.changeReadFlag();
      this.showValue = false;
    },
    refreshHome(){
      console.log(this.$route.path)
      if (this.$route.path == "/home" || this.$route.path == "/") {
        //  window.location.reload()
        this.reloadHome();
      }
    },
    reloadHome(){
      let param = {
        status: 0 ////订单状态
      };
      this.$byApi.getWorkSheetByStatus(param).then(res => {
        if (res.data.flag == 1) {
          this.gd_list = res.data.obj;

          let list=this.gd_list.slice(0, 5);
          this.$store.commit("GongDanList", list);
          // this.current_GDlist = this.$store.state.GongDanList;
        }
      }).catch(function (error) {
      console.log(error);
  });
    },
    newGongDan(title) {
      this.msg = title;
      this.showValue = true;
      this.showPosition = "top";
      this.$store.commit("newGongDanLoading", 1);
      setTimeout(()=>{
        this.refreshHome();
        this.$store.commit("newGongDanLoading", 2);
      },3000)
    },
    pushMethod(appId, deviceId) {
      if (localStorage.getItem("loginData")) {
        let userId = JSON.parse(localStorage.getItem("loginData")).userId;
        let param = {
          appId: appId,
          deviceId: deviceId,
          userId: userId
        };
        this.$byApi.register(param).then(res => {});
      }
    }
  }
};
</script>

<style  lang="less">
    #app {
      height: 100%;
    }
    html{
      background:#F8F9FC;
      font-size: .1rem;
      color:#454545;
    }
    body, html{
      line-height: inherit;
      margin:0;
      padding:0;
      font-size: 13.33333333333333333vw;
      /* height: 100%;
      overflow: hidden; */
    }
    .el-message{
      font-size:.2rem!important;
      min-width: 30%!important;
      top: 30%!important;
    }
    .amap-logo{
       display: none;
       opacity:0 !important;
       }
       .amap-copyright {
           opacity:0;
       }

</style>
