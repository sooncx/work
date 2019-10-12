<template>
  <div id="app" class="app-wrap">
    <div class="weiLan_header clr">
      <div class="fl weiLan_font">围栏</div>
      <div class="fr">
        <span  title="添加围栏" class="colorStyle iconfont icon-icon-plus mr-5 pointerStyle" @click="addPath()"></span>
        <span  title="查看围栏" class="colorStyle iconfont mr-5 pointerStyle" :class="{'icon-xianshi':isXianshi,'icon-buxianshi':isBuxianshi}" @click="isLookEvent()"></span>
        <span  title="关闭" class="colorStyle iconfont icon-guanbi1 ml-10 pointerStyle"></span>
      </div>
    </div>

    <div class="weiLanBox">
      <ul class="clr weiLanStyle mt-10">
        <li class="clr li_paddingStyle" v-for="(item,index) in displayData" :key="index" :class="{liBjActive:index == num}">
        <!-- <li class="clr li_paddingStyle" v-for="(item,index) in this.currentWeiLanData" :key="index" :class="{liBjActive:index == num}"> -->
          <span class="fl leftContent" :pathId="item.pathId" :lon="item.pointList[0].oriLon" 
            :lat="item.pointList[0].oriLat" :name="item.pathName" :type="item.pathType"  @click="changeLiBg(index)">{{item.pathName}}</span>
          <div class="fr rightContent">
            <span title="绑定车辆" class="mr-10 colorStyle iconfont icon-bangding pointerStyle" @click="bindingCheLiang(item.pathId)"></span>
            <span title="编辑围栏" class="mr-10 colorStyle iconfont icon-bianji1 pointerStyle" @click="editWeiLan(item.pathId)"></span>
            <span title="删除" class="colorStyle iconfont icon-lajitong pointerStyle" @click="delWeiLan(item.pathId,index)"></span>
          </div>      
        </li>
      </ul>
    </div>

    <!-- 分页 jumper-->
    <div class="pageFooter">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="this.currentPage"
        :page-size="this.currentPageSize"
        layout="total, prev, pager, next"
        :total="this.totalNumber">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isXianshi:true,
      isBuxianshi:false,
      weiLanData:null,
      currentWeiLanData:null,
      currentPage:1,
      currentPageSize:2,
      totalNumber:0,
      num:null,  
    };
  },
  created() {
    this.getWeiLanData()
  },
  computed:{
    displayData() {
      var start=this.currentPageSize*this.currentPage-this.currentPageSize;
      var end=this.currentPageSize*this.currentPage;
      var isKong=this.weiLanData!==undefined&&this.weiLanData!==null&&this.weiLanData!=='';
      if(isKong){
         return this.weiLanData.slice(start,end);
      }else{
        return [];
      }
    },
  },
  methods: {
    changeLiBg(index){
       this.num = index;
    },
    isLookEvent(){
      if( this.isXianshi){
        this.isXianshi=false;
        this.isBuxianshi=true;
      }else{
        this.isXianshi=true;
        this.isBuxianshi=false;
      } 
    },
    addPath(){////添加围栏
      var currentArea = {
            // pathId: pathId,
            // pathName: ,/////区域名称
            // pathType: pathType,
            // param: ,////区域类型
            // pointList: areaPoints,
            // settingTime: ,////////停留时间
             };
      this.$http({///保存api
        url:this.HOST+"/http/SafetyZone/addPath.json",
        params: {jsonData: JSON.stringify(currentArea)}
      }).then(rst=>{
          if(rst.flag===1){
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          }
        });

    },
    editWeiLan(pathId){///编辑围栏
       this.getVehicleInfo(pathId);

    },
    bindingCheLiang(pathId){/////绑定车辆
        this.getVehicleInfo(pathId);

        this.$http({///////保存api
            url:this.HOST+"/http/VehBindPath/bindVehicleToPath.json",
            params:{
              pathId:pathId,
              // vids:,
              // gids:,
            }
          }).then(rst=>{
            if(rst.flag===1){
              this.$message({
                type: 'success',
                message: '绑定成功!'
              });
            }
          });
    },
    getVehicleInfo(pathId){
      this.$http({
          url:this.HOST+"/http/SafetyZone/getVehicleInfo.json?pathId="+pathId
        }).then(rst=>{
          if(rst.flag===1){
            
          }
        });
    },
    getWeiLanData(){////获取列表数据
      this.$http({
          url:this.HOST+"/http/SafetyZone/getArea.json"
        }).then(rst=>{
          if(rst.flag===1){
            this.weiLanData=rst.obj;
            this.totalNumber=rst.obj.length
            // if(this.totalNumber>0){

              // this.currentWeiLanData=this.weiLanData.slice(0,this.currentPageSize)
            // }
          }
        });
    },

    delWeiLan(pathId,index){
      this.$confirm('是否删除该围栏?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {   
          this.$http({
            url:this.HOST+"/http/SafetyZone/delPath.json?pathId="+pathId 
            }).then(rst=>{
              if(rst.flag===1){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                // this.currentWeiLanData.splice(index,1);
                this.weiLanData.splice(index,1);
                this.totalNumber=this.totalNumber-1;
              }else{
                this.$message({
                  type: 'info',
                  message: '删除失败!'
                });
              }
            });
        }).catch(() => {});
    },
      // handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      // },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage=val;
    },
  },
};
</script>

<style lang="less" scoped>

@import "~@/assets/css/style";
</style>

<style lang="less" scoped>
@import "~@/assets/css/lessKey";
body{
  background-color: #ffffff;
}
.app-wrap{
  height: 100%;
}
.weiLan_font{
  color:@c-blue2;
}
.weiLan_header{
  border-bottom:1px solid #ddd;
  padding:@SPACE_SIZE;
}
.weiLanStyle{
  width:100%;
  overflow: auto;
}
.weiLanStyle li:nth-child(odd) {
     background:#F9F9F9;
}
.weiLanStyle li span{
  color:#999;
}
.pointerStyle{
  cursor: pointer;
}
.weiLanStyle li:hover{
  background:#F2EFEF;
}
.pageFooter{
  position: absolute;
  bottom:10px;
  left:10px;
}
.weiLanBox{
  max-height:880px;
  overflow: auto;
}
.colorStyle:hover{
  color:@c-blue2;
}
.li_paddingStyle{
  padding:@SPACE_SIZE
}
.leftContent{
  display: table-cell;
  width:62%;
}
.rightContent{
  white-space: nowrap;
}
.liBjActive{
  background:#ddd!important;
}
</style>


