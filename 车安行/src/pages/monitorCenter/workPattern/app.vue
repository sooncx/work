<template>
  <div  class="app-wrap ">
    <div class="bsj-layer-tab photo-tab">
        <div class="tab-header">
          <div class="col-left">
              <div class="header-nav">
                <div class="header-nav-item active">
                工作模式
                </div>
              </div>
          </div>
          <div class="col-right">
            <div class="closeLayer-btn" @click="doCloseLayer">
              <i class="iconfont icon-guanbi1"></i>
            </div>
          </div>
      </div>
      <div class="tab-cont" ref="tabCont">
          <div class="tab-contChild" v-loading="isLoading" element-loading-text="拼命加载中">
              <el-radio-group v-model="workValue"  class="radio-box">
                <div class="radio-item" v-for="item in radioList"><el-radio :label="item.value" >{{item.title}}<span class="msg ">({{item.msg}})</span></el-radio></div>
              </el-radio-group>
              <div class="pattern-box">
                  多种智能定位方式，不同定位方式，耗电量不同。推荐使用定时10分钟定位
              </div>
              <div class="btn-box">
                   <el-button type="primary" :loading="isSetIng" @click="set">确定</el-button>
              </div>
          </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { Loading } from "element-ui";
export default {
  data() {
    return {
      isLoading:false,
      isSetIng:false,
      defaultWorkValue:"",
      workValue: "",
      vid:getQueryString("vid"),
      radioList: [
        {
          value: 30,
          title: "30秒",
          msg:"耗电"
        },{
          value: 600,
          title: "10分钟",
          msg:"推荐"
        },{
          value: 1800,
          title: "30分钟",
          msg:"省电"
        },{
          value: 3600,
          title: "1个小时",
          msg:"比较省电"
        },{
          value: 0,
          title: "手动定位",
          msg:"非常省电"
        },
      ]
    };
  },
  components: {
    Loading
  },
  created(){
    this.get()
  },
  methods: {
    doCloseLayer(msg="") {
      
         if (parent.workPatternManage) {
        parent.workPatternManage.close(msg);
      }
    },
    get(){
      this.isLoading=true
      this.$http({
        url:this.HOST+"/http/Monitor/GetWorkMode.json",
        params:{
          vehicleId:this.vid,
          commandID: "DISPATCH"
        }
      }).then(rst=>{
        if(rst&&rst.flag===1){
            if(rst.obj){
              this.defaultWorkValue=rst.obj
              this.workValue=rst.obj
            }
        }else{
            this.$message.error(res.msg||this.$msg.error);
        }
        this.isLoading=false
      }).catch(e=>{
         this.isLoading=false
        console.error(e)
         this.$message.error("获取工作模式失败");
      })
    },
    set(){
      this.isSetIng=true
      this.$http({
        url:this.HOST+"/http/Monitor/CommandDown.json",
        params:{
          vehicleId:this.vid,
          commandType: "DISPATCH",
          commandMsg: "<SPBSJ*P:BSJGPS*C:"+this.workValue+">@1"
        }
      }).then(rst=>{
        if(rst&&rst.flag===1){
            this.doCloseLayer(rst.msg)
        }else{
            this.$message.error(res.msg||this.$msg.error);
        }
        this.isSetIng=false
      }).catch(e=>{
        this.isSetIng=false
        console.error(e)
           this.$message.error(this.$msg.error);
      })
    }
  }
};
</script>
<style lang="less">
@import "~@/assets/css/style";
</style>

<style lang="less" >
@import "~@/assets/css/lessKey";
body {
  background-color: #ffffff;
}
.app-wrap {
  height: 100%;
}
.photo-tab .col-left {
  display: flex;
}
.header-nav-item {
  font-size: 23px;
}
.header-nav-item.active {
  color: #1184e5;
  font-weight: 600;
}
.radio-box{
  padding:10px;
}
.radio-item{
  .msg{
    font-size:12px;
    color:#999
  }
  &+.radio-item{
    margin-top:10px;
  }
}
.pattern-box{
  background-color:#DDEFFF;
  color:#1184E5;
  padding:10px;
  margin:10px;
}
.btn-box{
  margin-top:20px;
  text-align:center
}
</style>


