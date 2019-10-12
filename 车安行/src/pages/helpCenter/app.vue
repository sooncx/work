<template>
  <div class="helpCenter-wrap">
    <!-- <div class="leftPal">
        <div class="left-nav">
            <div class="nav-item"  v-for="(item,index) in dataNav" :class="{'active':avtiveNavIndex===index}" @click="toPage(item,index)">
                <i class="iconfont " :class="item.icon" v-show="item.icon"></i>
                <span class="title ver-ali-m">{{item.title}}</span>
            </div>
        </div>
    </div> -->
    <div class="rightPal">
        <router-view class="child-view" ></router-view>
    </div>
  </div>
</template>
<script>
import logo from 'assets/img/logo.png';
export default {
  data(){
    return{
      dataNav:[
        {

          title:"常见问题",
          toPage:"faq",
          icon:"icon-wentiquestion24"
        },
        {
          title:"操作文档",
          toPage:"downFile",
          icon:"icon-icon"
        }
      ],
      avtiveNavIndex:0
    }
  },
  methods:{
    toPage(item,index){
      if(item.toPage === "downFile"){
        alert("下载")
      }else{
        this.avtiveNavIndex=index
        this.$router.push({name:item.toPage})
      }
    }
  }
}
</script>
<style lang="less">
  @import "~assets/css/style.less"; 
  @import "~assets/css/lessKey";
  @leftWidth:0;
  .helpCenter-wrap{
    width: 100%;
    height: 100%;
    position: relative;
    >.leftPal{
       width: @leftWidth;
       position: absolute;
       height:100%;
       background-color: #4E647A;
       >.left-nav{
         .nav-item{
           padding: @SPACE_SIZE2 0;
           padding-left: 16px;
           color:#fff;
            .title{
              margin-left:2px;
            }
            &:hover,&.active{
              background: #68839C;
              cursor: pointer;
            }
         }
       }
       
    }
    >.rightPal{
        height: 100%;
        overflow: auto;
         padding-left: @leftWidth
       }
  }
</style>
