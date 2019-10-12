<template>
  <div  class="app-wrap">
    <div class="tab-header">
        <div class="col-left">
            <div class="h-title">BMS数据</div>
        </div>
        <div class="col-right">
          <div class="closeLayer-btn" @click="doCloseLayer()">
            <i class="iconfont icon-guanbi1"></i>
          </div>
        </div>
    </div>
    <div class="tab-cont" v-if="displayData">
        <section class="data-chunk">
            <div class="chunk-header">
              基本信息
            </div>
            <div class="chunk-cont clr">
                <span class="display-col" :class="[item.block?'row':'']" v-for="(item,index) in chunkBasic" :key="index">
                    <span class="title">{{item.title}}:</span>
                    <span class="cont">{{displayData  | filterBasic(item.key) }}{{item.unit||""}}</span>
                </span>
            </div>
        </section>
        <section class="data-chunk">
            <div class="chunk-header">
              电池状态
            </div>
            <div class="chunk-cont clr">
                <span class="display-col" :class="[item.block?'row':'']" v-for="(item,index) in chunkStatus" :key="index">
                    <span class="title">{{item.title}}:</span>
                    <span class="cont">{{displayData.status  | filterStatus(item.key)  }}{{item.unit||""}}</span>
                </span>
            </div>
        </section>
        <section class="data-chunk">
            <div class="chunk-header">
              电池电压值
            </div>
            <div class="chunk-cont clr">
                <span class="display-col" :class="[item.block?'row':'']" v-for="(item,index) in displayData.strArr" :key="index">
                    <span class="title">第{{index+1}}个:</span>
                    <span class="cont">{{item}}MV</span>
                </span>
            </div>
        </section>
        <section class="data-chunk">
            <div class="chunk-header">
              电池包温度集
            </div>
            <div class="chunk-cont clr">
                <span class="display-col" :class="[item.block?'row':'']" v-for="(item,index) in displayData.ntcArr" :key="index">
                    <span class="title">第{{index+1}}个:</span>
                    <span class="cont">{{item}}℃</span>
                </span>
            </div>
        </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // displayData:{"capacity":0,"chiefCell":0,"current":2000,"cycles":0,"harging":0,"ntcArr":[246,246,246],"ntcNum":3,"soc":0,"soh":100,"status":{"LVWP":0,"HTP":0,"HTW":0,"CRY":0,"OPP":0,"CHS":0,"DS":0,"UPP":0,"CW":0,"OCCHG":0,"WM":0,"OWB":0,"OCDSG":0},"strArr":[3300,3300,3300,3299,3299,3301,3300,3300,3300,3299,3295,3300,3299,3298,3298,3299],"strNum":16,"temperature":246,"voltage":5.27},
      displayData:parent.BmsManage?parent.BmsManage.getBmsData():null,
      chunkBasic:[
        {
          title:"当前使用电池",
          key:"chiefCell"
        },
        {
          title:"电池温度",
          key:"temperature",
          unit:"℃"
        },{
          title:"电池当前电压",
          key:"voltage",
          unit:"V"
        },{
          title:"电池当前剩余容量",
          key:"capacity",
          unit:"AH"
        },{
          title:"电池当前电流",
          key:"current",
          unit:"A"
        },{
          title:"电池当前剩余百分比",
          key:"soc",
          unit:"%"
        },{
          title:"电池健康度",
          key:"soh",
          unit:"%"
        },{
          title:"电池循环次数",
          key:"cycles"
        },{
          title:"电池充电次数",
          key:"harging"
        },{
          title:"电池串数",
          key:"strNum"
        },{
          title:"NTC个数",
          key:"ntcNum"
        }
      ],
      chunkStatus:[
        {
          title:"充电状态",
          key:"CHS"
        },{
          title:"充电过流保护",
          key:"OCCHG"
        },{
          title:"放电状态",
          key:"DS"
        },{
          title:"放电过流保护",
          key:"OCDSG"
        },{
          title:"过压警告位",
          key:"OWB"
        },{
          title:"过压保护位",
          key:"OPP"
        },{
          title:"低压警告位",
          key:"LVWP"
        },{
          title:"欠压保护位",
          key:"UPP"
        },{
          title:"高温警告",
          key:"HTW"
        },{
          title:"高温保护",
          key:"HTP"
        },{
          title:"低温警告",
          key:"CW"
        },{
          title:"低温保护",
          key:"CRY"
        },{
          title:"BMS工作模式",
          key:"WM"
        }
        
      ]
    
    }
  },
  filters:{
    filterBasic(data,key){
      let itemData=data[key]
       let result=itemData
      switch(key){
        case "chiefCell":
          if(itemData===0){
            result="主电池"
          }else{
             result="备用电池"
          }
          break
      }
      return  result
    },
    filterStatus(data,key){
      let itemData=data[key]
       let result=itemData
      console.log(itemData,key)
      switch(key){
        case "CHS":
          if(itemData===0){
            result="未充电"
          }else{
             result="充电中"
          }
          break;
        case "OCCHG":
          if(itemData===0){
            result="未过流保护"
          }else{
             result="过流保护"
          }
          break;
        case "OPP":
          if(itemData===0){
            result="未过压保护"
          }else{
             result="过压保护"
          }
          break;
        case "DS":
          if(itemData===0){
            result="未放电"
          }else{
             result="放电中"
          }
          break;
        case "OCDSG":
          if(itemData===0){
            result="未过流保护"
          }else{
             result="过流保护"
          }
          break;
        case "OWB":
          if(itemData===0){
            result="未过压警告"
          }else{
             result="过压警告"
          }
          break;
        case "LVWP":
          if(itemData===0){
            result="未低压警告"
          }else{
             result="低压警告"
          }
          break;
        case "UPP":
          if(itemData===0){
            result="未欠压保护"
          }else{
             result="欠压保护"
          }
          break;
        case "HTW":
          if(itemData===0){
            result="未高温警告"
          }else{
             result="高温警告"
          }
          break;
        case "HTP":
          if(itemData===0){
            result="未高温保护"
          }else{
             result="高温保护"
          }
          break;
        case "CW":
          if(itemData===0){
            result="未低温警告"
          }else{
             result="低温警告"
          }
          break;
        case "CRY":
          if(itemData===0){
            result="未低温保护"
          }else{
             result="低温保护"
          }
          break;
        case "WM":
          if(itemData===0){
            result="初始化模式"
          }else if(itemData===1){
             result="断电模式"
          }else if(itemData===2){
             result="休眠模式"
          }else if(itemData===3){
             result="待机模式"
          }else if(itemData===4){
             result="行车模式"
          }else if(itemData===5){
             result="充电模式"
          }else{
             result="无效"
          }
          break;
      }
      return  result
    }
  },
  methods:{
    doCloseLayer() {
      if (parent.BmsManage) {
        parent.BmsManage.close();
      }
    }
  }
};
</script>
<style lang="less">
@import "~@/assets/css/style";
</style>
<style lang="less" >
@import "~@/assets/css/lessKey";
body{
  background-color: #ffffff;
}
.app-wrap{
  height: 100%;
}
.display-col{
  width:50%;
  display: inline-block;
  float:left;
  &.row{
    width: 100%;
  }
  >.cont{
    color: #000;
  }
}
.data-chunk{
    padding:0 20px;

    +.data-chunk{
       margin-top:10px;
    }
  .chunk-header{
    // font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  
}
.tab-header {
  padding: 10px 20px;
      border-bottom: 1px solid #dedede;
    margin-bottom: 10px;
  display: flex;
      align-items: center;
  .col-left{
    flex:1;
    display: flex;
        align-items: center;
    .refresh-control{
      margin-left:40px;
      display:flex;
          align-items: center;
          .refresh-time{
            width:70px;
            text-align:right;
          }
          .refresh-btn{
            height: 20px;
            width:20px;
            text-align:center;
            line-height:20px;
            margin-left:10px;
            background-color:#DDEEFD;
            &.resfreshIng{
              .iconfont{
                display:block;
                -webkit-animation-fill-mode:both;
                 animation:refreshRotate 2s infinite linear ;
              }
            }
            .iconfont{
              font-weight:600;
              color:#5BA7EA;
              font-size:12px;
            }
          }
          .refresh-msg{
              margin-left:10px;
              color:#67c23a;
              &.error{
                color:#f56c6c
              }
          }
          
    }
  }
  .h-title{
    font-size:14px;
    font-weight:600
  }
  >.col-right{
    flex: 1;
    display:flex;
    justify-content: flex-end;
  }
}
.closeLayer-btn{
  margin-left:10px;
  line-height:26px;
  cursor: pointer;
  &:hover{
    color:#20A1FF
  }
}
</style>


