<template>
  <div  class="app-wrap ">
    <div class="bsj-layer-tab photo-tab">
        <div class="tab-header">
          <div class="col-left">
              <div class="header-nav">
                <div class="header-nav-item active">
                录音库
                </div>
              </div>
              <div class="header-date" v-if="false" @click="openSelectDate">
                <i class="ver-ali-m iconfont icon-date"></i>
                <span class="ver-ali-m">日期</span>
                  <selectDate  ref="selectDate"/>
              </div>
          </div>
          <div class="col-right">
            
            <div class="closeLayer-btn" @click="doCloseLayer">
              <i class="iconfont icon-guanbi1"></i>
            </div>
          </div>
      </div>
      <div class="tab-cont" ref="tabCont">
          <div class="tab-contScroll">
               <happy-scroll hide-horizontal class="happyScroll" size="6"
                right
                color="rgba(55, 55, 55, .2)"
                resize
                :scroll-top="scrollTop" @vertical-end="verticalEnd">
                  <div>
                    <ul class="audio-ul" >
                        <li class="audio-item" v-for="(item,index,key) of displayPhotoList">
                            <audioItem :data="item" :vehicleId="vehicleId"  :vehicleType="vehicleType" :ref="audioItemStr+index"  @playBefore="audioItemPlay(index)" />
                        </li>
                    </ul>
                    <div class="endMsg" v-show="isDisplayEnd">
                        <span class="" v-if="displayPhotoList.length>0">
                            我是有底线的
                        </span>
                        <span v-else>
                              暂无录音
                        </span>
                    </div>
                  </div>
              </happy-scroll>
          </div>
          
      </div>
    </div>
  </div>
</template>

<script>
import audioItem from '@/components/audioItem'
import selectDate from '@/components/selectDate'
// import amrnb from '@/assets/js/amrplayer/amrnb'

import { Loading } from 'element-ui';
export default {
  data() {
    return {
      photoList:[],
      total:0,
      pageNumber:1,
      pageSize:1,
      vehicleId:getQueryString("vid"),
      vehicleType:getQueryString("type"),
      LoadingService:null,
      audioItemStr:"audioItem-",
      scrollTop:0,
      isDisplayEnd:false,
      isInitFirst:false,
      isInitApi:false
    };
  },
  computed:{
    displayPhotoList(){
      var result=this.photoList.slice(0,this.pageNumber*this.pageSize)
      if(this.photoList<=result){
        this.isDisplayEnd=true
      }else{
        this.isDisplayEnd=false
      }
      
      return result
    }
  },
  components:{
    audioItem,selectDate
  },
  mounted() {
    this.getAudioInfoList();
  },
  methods: {
    openSelectDate(){
      this.$refs["selectDate"].focus();
    },
    openLoadingSerVice(){
      this.LoadingService=Loading.service({
        target:this.$refs["tabCont"]
      })
    },
    doCloseLayer() {
      if (parent.AudioManage) {
        parent.AudioManage.close();
      }
    },
    getAudioInfoList(toIndex){
      this.openLoadingSerVice()
      
      this.$http({
          url:this.HOST+"/app/App/AudioInfoList.json",
          get:"get",
          params:{
            // pageNumber:toIndex,
            // pageSize:this.pageSize,
            vehicleId:this.vehicleId
          }
        }).then(res=>{
          if(res.flag ===1){
              this.photoList=res.obj;
              this.total=res.obj.length;
              this.isInitApi=true
          }else{
             this.$message.error(res.msg||this.$msg.error);
          }
          this.LoadingService.close()
        }).catch(e=>{
           this.$message.error(this.$msg.error);
          this.LoadingService.close()
        })
     
    },
    audioItemPlay(index){
      for(var key in this.$refs){
        if(this.$refs.hasOwnProperty(key)){
          if(key.indexOf(this.audioItemStr)!==-1){
            var curIndex=Number(key.replace(this.audioItemStr,""));
            if(curIndex !== index){
              this.$refs[key][0].pause();
            }
          }
        }
      }
    },
    verticalEnd(){
      if(!this.isDisplayEnd&&this.displayPhotoList.length>0){
        this.pageNumber++
      }
    }
    
  }
};
</script>
<style lang="less">
@import "~@/assets/css/style";
</style>

<style lang="less"  scoped>
@import "~@/assets/css/lessKey";

.app-wrap {
  height: 100%;background-color: #ffffff;
}
.photo-tab .col-left{
 display:flex;
}
.header-nav-item{
  font-size:23px;
}
.header-nav-item.active{
color:#1184E5; font-weight:600
}
.tab-cont{
  position: relative;
}
.tab-contScroll{
  position: absolute;
  height: 100%;
  width:100%;
  left: 0;
  top:0
}

.header-date{
  position: relative;
  display:flex;
      align-items: center;
  margin-left:50px;
 color:#0092FE; 
}
.header-date span{
  font-size:16px;
}
.audio-ul{
  margin-top:20px;
>li{
  width:100%;
}}
.happyScroll{
  
}
.endMsg{
  padding:10px;
  text-align:center;
  margin-bottom:20px;
  margin-top: 20px;
}
</style>


