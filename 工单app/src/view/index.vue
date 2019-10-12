<template>
    <div class="contant">
        <router-view/>
        <div>
            <tabbar @on-index-change="onIndexChange"  v-model="tabbarValue">
                <tabbar-item :badge="badge" >
                <!-- <tabbar-item  > -->
                    <!-- :selected="1?true:false"   -->
                    <img slot="icon" :src="selected_gd">
                    <span slot="label">工单</span>
                </tabbar-item>
                <tabbar-item >
                    <!-- :selected="1?false:true" -->
                    <img slot="icon" :src="selected_me">
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>
        </div>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from "vux";
export default {
  name:"index",
  data() {
    return {
      selected_gd: require("@/assets/image/gd_active.png"),
      selected_me: require("@/assets/image/me.png"),
      tabbarValue:0
    };
  },
  components: {
    Tabbar,
    TabbarItem
  },
  computed:{
    badge(){  
      if(this.$store.state.GetCountOfNoread===0){
        return null
      }
      
      return String(this.$store.state.GetCountOfNoread)=='null'?null:String(this.$store.state.GetCountOfNoread)
    }
  },
  activated(){
    if(this.$route.path=='/me'){
        this.tabbarValue=1
    }else{
      this.tabbarValue=0
    }
  },
  created(){
    
},
  methods: {
    onIndexChange(newIndex, oldIndex) {
      console.log(newIndex, oldIndex);
      
      if (newIndex != 0) {
        this.selected_gd = require("@/assets/image/gd.png");
        this.selected_me = require("@/assets/image/me_active.png");
        this.$router.push("/me");
      } else {
        this.selected_gd = require("@/assets/image/gd_active.png");
        this.selected_me = require("@/assets/image/me.png");
         this.$router.push("/home");
      }
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
.contant {
  /deep/ .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon,
  .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i,
  .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    // color: #0866f6;
  }
  .weui-tabbar{
      background-color: #fff;
      box-shadow: 1px 1px 10px #ddd;
     
  }
}
</style>