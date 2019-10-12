<template>
  <div  class="app-wrap ">
    <div class="bsj-layer-tab photo-tab">
        <div class="tab-header">
          <div class="col-left">
              <div class="header-nav">
                <div class="header-nav-item active">
                照片库
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
          <div class="tab-contChild">
            <ul class="photo-ul" v-for="item in displayPhotoList">
                <li class="photo-item">
                    <photoItem :data="item" :vehicleId="vehicleId" />
                </li>
            </ul>
          </div>
      </div>
      <div class="tab-footer">
          <el-pagination
            :page-size="pageSize"
            @current-change="GetMultiForImgList"
            :current-page="pageNumber"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import photoItem from '@/components/photoItem'
import selectDate from '@/components/selectDate'
import { Loading } from 'element-ui';
export default {
  data() {
    return {
      displayPhotoList:[
       
      ],
      total:0,
      pageNumber:1,
      pageSize:35,
      vehicleId:getQueryString("vid"),
      LoadingService:null
    };
  },
  components:{
    photoItem,selectDate
  },
  mounted() {
    
    this.GetMultiForImgList(this.pageNumber);
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
      if (parent.PhotoManage) {
        parent.PhotoManage.close();
      }
    },
    GetMultiForImgList(toIndex){
      this.openLoadingSerVice()
      
      this.$http({
          url:this.HOST+"/http/Monitor/GetMultiForImgList.json",
          params:{
            pageNumber:toIndex,
            pageSize:this.pageSize,
            vehicleId:this.vehicleId
          }
        }).then(res=>{
          if(res.flag ===1){
              this.displayPhotoList=res.rows;
              this.total=res.total
              this.pageNumber=toIndex
          }else{
             this.$message.error(res.msg||this.$msg.error);
             
          }
          this.LoadingService.close()
        }).catch(e=>{
           this.$message.error(this.$msg.error);
          this.LoadingService.close()
        })
     
    }
  }
};
</script>


<style lang="less" >
@import "~@/assets/css/lessKey";
body {
  background-color: #ffffff;
}
.app-wrap {
  height: 100%;
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
.header-date{
  position: relative;
  display:flex;
      align-items: center;
  margin-left:50px;
 color:#0092FE; 
}
.tab-cont{
  position: relative;

  .tab-contChild{
    width:100%;
    height: 100%;
  left: 0;
    top:0;
    overflow: auto;;
      position: absolute;
  }
}
.header-date span{
  font-size:16px;
}
.photo-ul{
    li{
      float: left;
      width:20%;
      padding:10px;
    }
}
</style>


