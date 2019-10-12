<template>
  <div  class="app-wrap">
    <div class="oCarList">
      <div class="tab-header">
          <div class="col-left">
              <div class="tabTitle-box fl">
                 <div class="tabTitle-item" :class="{active:avtiveTab===0}" @click="changeAvtiveTab(0)">
                      全部({{total}})
                  </div>
                  
                  <div class="tabTitle-item" :class="{active:avtiveTab===1}" @click="changeAvtiveTab(1)">
                      在库({{inTotal}})
                  </div>
                  <div class="tabTitle-item" :class="{active:avtiveTab===2}" @click="changeAvtiveTab(2)">
                      出库({{outTotal}})
                  </div>
              </div>
              <div class="tabTitle-box fl">
                  <div class="tabTitle-item" :class="{active:avtiveTab===3}" @click="changeAvtiveTab(3)"> 
                      掉电({{missTotal}})
                  </div>
              </div>
          </div>
          <div class="col-right">
            <div class="p-searchBox">
                <input class="p-search " v-model="searchVal" placeholder="车牌号/车架号/车组名称" />
                <i class="iconfont icon-fangdajing iconRight"></i>
            </div>
            <div class="closeLayer-btn" @click="doCloseLayer">
              <i class="iconfont icon-guanbi1"></i>
            </div>
          </div>
          
      </div>
      <div class="tab-cont">
          <div class="cont-table">
            <!--  :defaultSort = "{prop: 'status', order: 'ascending'}" -->
              <el-table
                :data="curDisplayTableData"
                height="100%"
                stripe
              
                style="width: 100%">
                
                <el-table-column
                  prop="plate"
                  label="车牌号"
                  align="center"
                  >
                  <template slot-scope="scope">
                    {{ scope.row.plate || "--" }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="frameNo"
                  label="车架号"
                    align="center"
                  >
                </el-table-column>
                <el-table-column
                  label="状态"
                   prop="status"
                   align="center"
                  
                  >
                  <template slot-scope="scope">
                    <span class="status-mark" :class="'status-mark-'+scope.row.statusCode">{{ scope.row.status}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="time"
                  
                  label="时间"
                  align="center"
                  >
                </el-table-column>
                <el-table-column
                  prop="groupName"
                  label="车组名称"
                  align="center"
                  >
                </el-table-column>
                <el-table-column
                  prop="remark"
                  align="center"
                  label="备注">
                </el-table-column>
              </el-table>
          </div>
      </div>
      <div class="tab-footer">
        <div class="fot-chunk1">
          <div class="col-left"  >
            <el-button type="primary" size="medium" @click.native="doExport">导出</el-button>
          </div>
          <div class="col-right">
              <el-pagination
                background
                :pageSize="page.size"
                :currentPage.sync="page.number"
                layout="prev, pager, next"
                :total="pageTotal">
              </el-pagination>
            </div>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
export default {
  data() {
    return {
      avtiveTab:0,
      searchVal:"",
      tableData: [
      ],
      page:{
        size:30,
        number:1
      },
      missTotal:0,
      outTotal:0,
      inTotal:0,
      statusTableData:{
        1:[],
        2:[],
        3:[]
      },
      missListData:[]   ////掉电单独独立出来为status:3
    };
  },
  created() {
    //	1：入库 2：出库 3：掉电
    this.getFastMatchCarVehicle();
    this.getDiaodianListData();
  },
  computed:{
    displayTableDataALL(){
      // if(this.ac)
      var result=null;
      switch(this.avtiveTab){
        case 0:
          result= this.tableData;
          break;
        case 3:
          result=this.missListData;
           break;
        default:
          result= this.getCurStatusTableData(this.avtiveTab);
          break;
      };
      if(!this.searchVal){
        return result;
      }else{
        var searchVal=this.searchVal.toLowerCase()
        var newResult=[]
        result.forEach((item)=>{
          if(item.groupName.toLowerCase().indexOf(searchVal) !== -1 || item.plate.toLowerCase().indexOf(searchVal) !== -1|| item.frameNo.toLowerCase().indexOf(searchVal) !== -1 ){
            newResult.push(item)
          }
        })
        return newResult;
      }
    },
    curDisplayTableData(){
      return this.displayTableDataALL.slice(this.page.size*(this.page.number-1),this.page.size*this.page.number)
    },
    total(){
      return this.tableData.length;
    },
    pageTotal(){ //页码总数
       return this.displayTableDataALL.length;
    }
  },
  filters:{
    filterStatus(val){
      switch(val){
        case 1:
          return "出库"
        case 2:
          return "在库"
        case 2:
          return "掉电"
      }
    },
    
  },
  methods: {
    getDiaodianListData(){ 
        this.missTotal=0;
        this.$http({
          url:this.HOST+"/report/InOutStockReport/QueryInOutStockReport.json?status=3"
        }).then(rst=>{
          if(rst.flag===1){
            rst.obj.forEach(item=>{
                 item.statusCode =3;
              });
              this.missListData=rst.obj;
              this.missTotal=this.missListData.length;
          }
        });
    },
    getFastMatchCarVehicle(){
      this.$http({
          url:this.HOST+"/report/InOutStockReport/QueryInOutStockReport.json"
      }).then(rst=>{
        if(rst.flag===1){
         
          this.outTotal=0;
          this.inTotal=0;
          this.statusTableData={
            1:[],
            2:[],
            3:[]
          }
          rst.obj.forEach(item => {
              switch(item.status){
                 case "出库":
                  item.statusCode =2;
                  this.outTotal++;
                  break;
                case "入库":
                case "在库":
                  item.statusCode=1;
                  this.inTotal++
                  break;
                // case "掉电":
                //   this.missTotal++
                //   item.statusCode =3;
                //   break;
              }
              this.statusTableData[item.statusCode].push(item)
          });
          this.tableData=rst.obj;

        }
      })
    },
    getCurStatusTableData(statusCode){
      return this.statusTableData[statusCode]
    },
    changeAvtiveTab(curStatusCode){
        this.avtiveTab=curStatusCode;
    },
    doCloseLayer(){
      if(parent.OCarManage){
        parent.OCarManage.close();
      }
    },
    getSessionId(){
      var sessionId="";
      if(localStorage.getItem("sessionId")&&localStorage.getItem("sessionId")!=="undefined"){
        sessionId=localStorage.getItem("sessionId")
      }
      return sessionId
    },
    doExport(){
      var stateTxt=this.avtiveTab === 0 ? "":("state="+this.avtiveTab)
      window.open(this.HOST+"/http/ExcelExport/ExportInOutStock.json?"+stateTxt+"&sessionId="+this.getSessionId()+"&loginToken="+this.loginToken)
    }
  },
  watch:{
    searchVal(){
      this.page.number=1
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
.oCarList {
  display: flex;
     flex-direction: column;
     height: 100%;
     width:100%;
}
.tab-header {
  padding: @SPACE_SIZE2;
  display: flex;
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
.tabTitle-box.fl{
  float: left;
  +.tabTitle-box.fl{
    margin-left:@SPACE_SIZE4;
  }
}
.tabTitle-box{
  border-radius:6px;
  overflow: hidden;
   border:1px solid @c-bor;

  
  &:after{
    content: "";
    display: block;
    clear: both;
  }
  .tabTitle-item{
    padding:@SPACE_SIZE @SPACE_SIZE4;
    float: left;
    font-size:14px;
      color:#9A9A9A;
      cursor: pointer;
   
    &.active,&:hover{
      color:#20A1FF;
      // border-color:#20A1FF!important;
    }
    &+.tabTitle-item{
      border-left:1px solid @c-bor
      // margin-left:2px;
    }
  }
}
.p-searchBox{
  position: relative;
  .iconRight{
    position: absolute;
    right:8px;
    top:50%;
        transform: translateY(-57%);
  }
}
.p-search{
  border:1px solid   @c-bor;
  border-radius:16px;
  height: 28px;
  line-height:28px;
  padding: 0 16px;
}
.tab-cont{
  flex:1;
  position: relative;
  .cont-table{
    position: absolute;
    height: 100%;
    width:100%;
    overflow:auto;
    left:0;top:0;
  }
  .el-table thead tr,.el-table thead th{
    background-color:#EEF1F6;
  }
}
.fot-chunk1{
  padding:@SPACE_SIZE2;
  display: flex;
  .col-left{

  }
  .col-right{
    flex:1;
    text-align:right;
  }
}
.status-mark{
  font-size:10px;
  border-radius:10px;
  padding:0 6px;
  color:#fff;
  min-width: 40px;
  display: inline-block;
  text-align:center;
  line-height:1.5;
  &.status-mark-1{
      background-color:#49E03D;
  }
  &.status-mark-2{
      background-color:#F6231A;
  }
  &.status-mark-3{
      background-color :#999999;
  }
}
</style>


