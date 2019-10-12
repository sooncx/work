<template>
  <div id="app" class="app-wrap">
    <div class="erYaDian_header clr">
      <div class="fl erYaDian_font">二押点
        <span class="iconfont icon-wenti1 c-999 ml-5 pointerStyle" @mouseover="showHelp()" @mouseout="hideHelp()"></span>
      </div>
      <div class="fr">
        <span title="自定义二押点" class="colorStyle iconfont icon-icon-plus mr-5 pointerStyle" @click="addTwoCharge()"></span>
        <span title="绑车" class="colorStyle iconfont icon-bangding mr-5 pointerStyle" @click="bindingChe()"></span>
        <span title="云端二押点" class="colorStyle iconfont icon-weather9 mr-5 pointerStyle" @click="cloudTwoCharge()"></span>
        <span title="关闭" class="colorStyle iconfont icon-guanbi1 ml-10 pointerStyle"></span>
      </div>
    </div>
    <!-- 列表 -->
    <div class="erYaDianTableBox">
      <ul class="clr erYaDian_tableStyle mt-10">
        <li class="clr li_paddingStyle" v-for="(item,index) in this.erYaDianTableData" :key="index" :class="{liBjActive:index == num}">
          <span class="fl leftContent" :data-uniqueid="item.chargeId" :data-index="index"  @click="changeLiBg(index)">{{item.name}}</span>
          <div class="fr rightContent">
            <span title="删除" class="colorStyle iconfont icon-lajitong pointerStyle" @click="delErYaDian(item.chargeId,index)"></span>
          </div>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pageFooter">
      <el-pagination @current-change="handleCurrentChange" :current-page="this.currentPage" :page-size="this.currentPageSize" 
      layout="total, prev, pager, next" :total="this.totalNumber">
      </el-pagination>
    </div>

    <div v-if="isShowHelp" class="helpBox">
      <div class="noticBox">
        <p>
          <i class="iStyle">功能简介</i>
        </p>
        <p class="contentStyle">
          防止车辆在二手车抵押点停留，增加风险预防。
        </p>
        <p>
          <i class="iStyle">自定义二押点</i>
        </p>
        <p class="contentStyle">
          用户可以在地图上自定义位置添加二押点。
        </p>
        <p>
          <i class="iStyle">绑车</i>
        </p>
        <p class="contentStyle">
          用户绑定车辆将作用于（自定义二押点 + 云端二押点）
        </p>
        <p>
          <i class="iStyle">云端二押点</i>
        </p>
        <p class="contentStyle">
          由云平台提供的二押点，用户默认拥有，云平台会定时更新云端二押点。
        </p>
        <p>
          <i class="iStyle">报警：</i>
        </p>
        <p class="contentStyle">
          当绑定的车辆在您设置的二押点(您设置的半径)范围，或者经过云端二押点(半径50米)范围，并且满足停留时间60分钟，系统会自动报警。
        </p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      erYaDianTableData: null,
      currentPage: 1,
      currentPageSize: 2,
      totalNumber: 0,
      isShowHelp:false,
      num:null
    };
  },
  created() {
    this.getErYaDianTableData();
  },
  computed:{

  },
  methods: {
    changeLiBg(index){
      this.num=index;
    },
    cloudTwoCharge(){///云端二押点
      this.$http({
        url:this.HOST+"/http/monitor/getAreaBaseInfo.json",
      }).then(rst=>{
          if(rst.flag===1){

          }
        });
    },
    bindingChe(){///绑定
      this.loadGroups();///获取车组信息
      this.getVehicleChargeByUserId();///获取车辆信息
      this.UpdateOrAddVehicleCharge();///批量添加
      this.deleteVehicleCharge()///批量删除
    },
    UpdateOrAddVehicleCharge(){
      this.$http({///批量添加
        url:this.HOST+"/http/twoChargeVehicle/UpdateOrAddVehicleCharge.json?vehicleId"+vehicleId,
      }).then(rst=>{
          if(rst.flag===1){
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          }
        });
    },
    deleteVehicleCharge(){
      this.$http({///批量删除
        url:this.HOST+"/http/twoChargeVehicle/deleteVehicleCharge.json?vehicleId"+vehicleId,
      }).then(rst=>{
          if(rst.flag===1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        });
    },
    loadGroups(){
      this.$http({///获取车组信息
        url:this.HOST+"/http/Monitor/loadGroups.json",
      }).then(rst=>{
          if(rst.flag===1){

          }
        });
    },
    getVehicleChargeByUserId(){///获取车辆信息
      this.$http({
        url:this.HOST+"/http/twoChargeVehicle/getVehicleChargeByUserId.json",
      }).then(rst=>{
          if(rst.flag===1){
 
          }
        });
    },
    addTwoCharge(){////自定义二押点
      this.$http({///添加保存api
        url:this.HOST+"/http/twoChargeVehicle/addTwoCharge.json",
        params: {
            name:'test',
            radius:'50',
            lon:114.413561,
            lat:23.099811,
        }
      }).then(rst=>{
          if(rst.flag===1){
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.handleCurrentChange(1);
          }
        });
    },
    getErYaDianTableData() {
      this.$http({
        url:
          this.HOST +
          "/http/twoChargeVehicle/getTwoChargeByUserId.json?pageSize=" +
          this.currentPageSize +
          "&pageNumber=" +
          this.currentPage
      }).then(rst => {
        if (rst.flag === 1) {
          this.erYaDianTableData = rst.rows;
          this.totalNumber = rst.total;
        }
      });
    },

    delErYaDian(chargeId,index) {
      this.$confirm("是否删除二押点?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url:
              this.HOST +
              "/http/twoChargeVehicle/deleteTwoCharge.json?chargeId=" +
              chargeId
          }).then(rst => {
            if (rst.flag === 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // this.erYaDianTableData.splice(index,1);
              // // this.erYaDianTableData=this.erYaDianTableData;
              // this.totalNumber=this.totalNumber-1;
              this.handleCurrentChange(1);
            } else {
              this.$message({
                type: "info",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {});
    },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getErYaDianTableData();
    },
    showHelp() {
      this.isShowHelp=true;
    },
    hideHelp() {
      this.isShowHelp=false;
    },
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/style";
</style>

<style lang="less" scoped>
@import "~@/assets/css/lessKey";
body {
  background-color: #ffffff;
}
.app-wrap {
  height: 100%;
}
.erYaDian_font {
  position: relative;
  color: @c-blue2;
}
.erYaDian_header {
  border-bottom: 1px solid #ddd;
  padding: @SPACE_SIZE;
}
.erYaDian_tableStyle {
  width: 100%;
  overflow: auto;
}

.erYaDian_tableStyle li:nth-child(odd) {
  background: #f9f9f9;
}
.erYaDian_tableStyle li {
  color: #999;
}
.pointerStyle {
  cursor: pointer;
}
.erYaDian_tableStyle li:hover {
  background: #f2efef;
}
.pageFooter {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.erYaDianTableBox {
  max-height: 880px;
  overflow: auto;
}
.colorStyle:hover {
  color: @c-blue2;
}
.li_paddingStyle {
  padding: @SPACE_SIZE;
}
.leftContent {
  display: table-cell;
  width: 90%;
}
.rightContent {
  white-space: nowrap;
}
.liBjActive{
  background:#ddd!important;
}
// helpBox
.helpBox{
  box-shadow:#999 3px 2px 11px;
  background-color: #fff;
  z-index: 99999; 
  top: 34px;
  left: 80px;
  width: 310px;
  border: 1px solid #EBEEF5;
  position: absolute; 
  display: block;
}
.iStyle{
  font-size: 14px; 
  font-weight: bold;
}
.noticBox{
  padding:@SPACE_SIZE3;
}
.contentStyle{
  text-indent: 20px;
   font-size: 13px; 
}
</style>


