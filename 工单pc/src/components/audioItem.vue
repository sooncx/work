<!-- 基础加载地图  -->
<template>
  <div class="audioItem" ref="box">
      <div class="cont">
        <div class="date-toast">{{getLocalTime(data.crateTime)}}</div>
        
        <div class="audio-display-row">
            <div class="headHhoto">
               <img :src="photoImg" alt="">
            </div>
            <div class="col-cont" @click="toggle">
                <div class="audio-displayHeader">
                  <div class="loading-wrap" >
                    <wxPlayLoading class="loading" :isAnimation="isPlay"/>
                  </div>
              </div>
              <div class="placeholder-len" :style="{width:curWid}"></div>
              <div class="audio-size" v-if="!isInitIng&&!isShowError" >
                  {{data.interval}}"
              </div>
              <div class="audio-loding" v-else-if="!isShowError" >
                  <sPinner/>
              </div>
              <div class="audio-error" v-show="isShowError">
                  <el-tooltip class="item" effect="dark" content="获取录音失败，点击重新获取播放" placement="right">
                    <i class="iconfont icon-exclaim"></i>
                  </el-tooltip>
              </div>
            </div>
             
        </div>
      </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui';
import wxPlayLoading from '@/components/wxPlayLoading';
import sPinner from '@/components/SPinner-1s-28px';
import {debounce,throttle} from 'lodash';
import AmrPlayer from '@/assets/js/amrplayer/amrplayer'
import AudioPlay from '@/components/AudioPlay/AudioPlay.js'
export default {
  props:{
    data:{
      type:Object,
      required:1
    },
    vehicleId:{
      type:[Number,String],
      required:1
    },
    vehicleType:{
      type:String,
      required:1
    }
  },
  components:{
    wxPlayLoading,sPinner
  },
  data() {
    return {
      photoImg:require("@/assets/img/toux.png"),
      LoadingService:null,
      imgBase64:null,
      audioUrl:this.HOST+"/app/App/GetAudioInfo.json?vehicleId="+this.vehicleId+"&fileId="+this.data.crateTime,
      // audioProgress:0,
      boxWidth:120,
      maxInterval:300,
      isInit:false,
      player:null,
      isPlay:false,
      isInitIng:false,
      handlerDebounce:null,
      isShowError:false,
      isMidwayPause:false, //是否在初始化過程中執行暫停事件，true就取消初始成功后默認播放事件
    };
  },
  computed:{
    curWid(){
        return this.boxWidth*(this.data.interval/this.maxInterval)+"px"
    },
    playType(){ //x6播放为wav 其他类型为amr
      const type=this.vehicleType.toLocaleLowerCase();
      switch(type){
        case "x6":
        case "a5e-8w":
          return "wav"
          break;
        default:
          return "amr"
      }
    }
  },
  mounted() {
  
    this.handlerDebounce=debounce(this.handlerToggle, 100)
  },
  methods: {
    loadSound(url,callBack) {
      this.isInitIng=true;
      this.isShowError=false
      this.$http({
        url: url,
        responseType:"blob"
      }).then(res=>{
          if(res&&res.type==="text/html"&&!res.status){
              var arraybuffer = res;
              var arraybuffer=new Blob([arraybuffer],{type : 'audio/mpeg'});
              var audioSrc=URL.createObjectURL(arraybuffer)
              if(this.playType==="amr"){
                  this.player = new AmrPlayer(audioSrc,()=>{
                  setTimeout(()=>{
                    this.isInit=true;
                    this.isInitIng=false;
                    if(typeof callBack === 'function'){
                      callBack();
                    }
                  },100);
                });
                this.player.endedWith(()=>{ //播放结束
                  this.isPlay=false
                })
              }else{
                 
                  this.player =new AudioPlay({
                   src:audioSrc,
                   playEnd:()=>{ //播放结束
                      this.isPlay=false
                    }
                  })
                   setTimeout(()=>{
                    this.isInit=true;
                    this.isInitIng=false;
                    if(typeof callBack === 'function'){
                      callBack();
                    }
                  },100);
              }
             
          }else{
              this.isInit=false;
              this.isInitIng=false;
              this.isShowError=true
          }
      }).catch(e=>{
        console.error(e)
        this.isInit=false;
        this.isInitIng=false;
        this.isShowError=true
      });
      
    },
    toggle(){
      this.handlerDebounce()
    },
    handlerToggle(){
      if(this.isPlay){
        this.pause();
      }else{
        this.play();
      }
    },
    play(){
      this.$emit("playBefore")
      this.isMidwayPause=false;
      if(this.isInit&&!this.isPlay){
         this.player.play();
         this.isPlay=true;
         this.$emit("play")
      }else if(!this.isInitIng&&!this.isInit){ //避免重複初始化
         this.loadSound( this.audioUrl,()=>{
           if(!this.isMidwayPause){
             this.play();
           }
         })
      }
    },
    pause(source){
       this.isMidwayPause=true;
       this.isPlay=false
       if(this.isInit){
         this.player.pause();
         this.$emit("pause")
      }
    },
    getLocalTime(nS) {
      return dayjs(Number(nS)).format("YYYY-MM-DD/HH:mm:ss");     
    }
  }
};
</script>

<style lang="less"  scoped>
.audioItem{
  width: 100%;
  text-align: center;
}
  .cont{
    display: inline-block;
    color: #fff;
    position: relative;
    overflow: hidden;
    width: 100%;
       text-align: center;
    >.date-toast{
      border-radius: 6px;
      display: inline-block;
      padding: 0px 10px;
      background:#DADADA;
      color: #fff;
      text-align: center;
    }
    img{
      width: 100%;
    }
  }  
  .audio-display-row{
    padding: 10px;
    .headHhoto{
      height: 32px;
      width: 32px;
      border-radius: 6px;
      overflow: hidden;
      background: #DADADA;
      float: left;
      margin-right: 15px;
      img{
        height: 100%;
        width: 100%
      }
    }
    .col-cont{
      float: left;
    }
    .placeholder-len{
       float: left;
      background: #98E165;
      height: 32px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      width: 60px;
      cursor: pointer;
    }
    .audio-displayHeader{
      float: left;
      background: #98E165;
      height: 32px;
      width: 42px;
      cursor: pointer;
      
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      position: relative;
      .loading-wrap{
        transform:  translate(0,-50%) ;
        position:absolute;
        left: 0px;
        top:50%;
      }
      .loading{
        
        transform:  scale(0.45)
      }
      &::before{
        position: absolute;
        content: "";
        top:50%;
        left: 0%;
        background: #98E165;
        display: block;
        height: 10px;
        width: 10px;
        transform: rotate(45deg) translate(-56%, -4%)  scale(0.6);
      }
    }
    .audio-size{
      float: left;
      color: #9c9c9c;
      margin-top:6px;
      margin-left: 6px;
    }
    .audio-loding{
      float: left;
      margin-left: 6px;
      margin-top:2px
    }
    .audio-error{
      cursor: help;
          color: red;
    float: left;
    margin-left: 8px;
    margin-top: 1px;
    font-size: 18px;
      
    }
  }
</style>
