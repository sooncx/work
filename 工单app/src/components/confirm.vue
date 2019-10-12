<template>
  <div class="confirmBox" v-show="this.isShowConfirm">
    <div class="mask"></div>
    <div class="confirmMain">
        <div class="iconfont icon-gou"></div>
        <div class="titleStyle">{{title_main}}</div>
        <div class="buttonBox">
          <span class="left_button" @click="leftEvent">{{left_button}}</span>
          <span class="right_button" @click="rightEvent">{{right_button}}</span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props:{
    isShowConfirm:{
      default:false,
      type:Boolean
    }
  },
  data() {
    return {
      isShowtc:false,
      title_main:'工单信息上传完毕',
      left_button:'返回工单',
      right_button:'查看设备'
    };
  },
  methods: {
    leftEvent(){

      this.$emit('leftEvent');
    },
    rightEvent(){
      this.$emit('rightEvent');
    }
  },
  created(){
    this.isShowtc=this.isShowConfirm
  },
  mounted() {}
};
</script>

<style lang="less">
.confirmBox {
  .mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .confirmMain {
    position: fixed;
    display: table;
    z-index: 5000;
    width: 80%;
    max-width: 300px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: #ffffff;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
    .icon-gou{
      margin-top:.3rem;
      color:#26D05A;
      font-size: 1rem;
    }
    .titleStyle{
      padding-bottom: .6rem;
      margin-top:.1rem;
      color:#555D65;
      font-size: .3rem;
      border-bottom: 1px solid #ddd;
    }
    .buttonBox{
      // margin:.2rem 0;
      height:1rem;
      line-height: 1rem;
      display: flex;
      flex-direction: row;
       color:#555D65;
      font-size: .3rem;
      .left_button{
        flex:1;
      }
      .right_button{
        color:#fff;
        flex:1;
        background:#0866F6;
      }
    }
  }
}
</style>