<template>
  <div class="inventory">
    <div class="inventory-header">
      <div class="header-item">
        总数
        <span>{{indexRunData?indexRunData.totalNum:0}}</span>
      </div>
      <div class="header-item">
        已出卡
        <span>{{indexRunData?indexRunData.outNum:0}}</span>
      </div>
      <div class="header-item">
        未出卡
        <span>{{indexRunData?(indexRunData.totalNum - indexRunData.outNum):0}}</span>
      </div>
      <div class="header-item">
        激活
        <span>{{indexStopData?indexStopData.activationNum:0}}</span>
      </div>
      <div class="header-item">
        停用
        <span>{{indexStopData?indexStopData.disableNum:0}}</span>
      </div>
      <div class="header-item">
        销卡
        <span>{{indexStopData?indexStopData.removeNum:0}}</span>
      </div>
      <div class="header-item export-item">
        <div class="export">
          <i class="iconfont icon-_daochu"></i>
          <span>导出</span>
        </div>
      </div>
    </div>
    <div class="inventory-content">
      <div class="inventory-left">
        <my-tree
          :treeData="treeData"
          :defaultProps="defaultProps"
          icon="icon-fangdajing"
          @node-click="searchSimListByInventory"
        ></my-tree>
      </div>
      <div class="inventory-right">
        <filter-type
          ref="filterType"
          @updateSimList="data => tableData = data"
          @chargeOffCardChange="chargeOffCardChange"
          @loadInventoryData="loadInventoryData"
        ></filter-type>
        <div class="filter-table-wrap">
          <el-table
            :data="tableData.slice((pageNumber - 1)*pageSize,pageNumber*pageSize)"
            stripe
            style="width: 100%"
            height="calc(100% - 70px)"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            >
            </el-table-column>
            <el-table-column
              prop="userName"
              align="center"
              label="所属客户"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="iccid"
              align="center"
              label="ICCID"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="simCard"
              align="center"
              label="SIM卡号"
              width="130"
            >
            </el-table-column>
            <el-table-column
              width="100"
              prop="simType"
              align="center"
              label="套餐类型"
            >
            </el-table-column>
            <el-table-column
              width="100"
              prop="prices"
              align="center"
              label="价格"
            >
            </el-table-column>
            <el-table-column
              width="100"
              prop="traffic"
              align="center"
              label="流量"
            >
            </el-table-column>
            <el-table-column
              width="100"
              prop="openTime"
              align="center"
              label="开卡"
            >
            </el-table-column>
            <el-table-column
              width="100"
              prop="activationTime"
              align="center"
              label="激活"
            >
            </el-table-column>
            <el-table-column
              width="100"
              prop="expireTime"
              align="center"
              label="过期"
            >
            </el-table-column>
            <el-table-column
              width="100"
              prop="outOrIn"
              align="center"
              label="是否出库"
            >
            <template slot-scope="scope">
                <my-badge :outOrIn="scope.row.outOrIn"></my-badge>
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              label="状态"
              prop="simState"
              sortable
            >
              <template slot-scope="scope">
                <my-badge :simState="scope.row.simState"></my-badge>
              </template>
            </el-table-column>
            <el-table-column
              prop="expireTime"
              align="center"
              label="到期时间"
            >
            </el-table-column>
            <el-table-column
              width="150"
              label="操作"
              fixed="right"
            >
              <template slot-scope="scope">
                <my-badge text="刷新"></my-badge>
                <my-badge
                  text="销卡"
                  type="default"
                  @click="chargeOffCardParams = {cardNo:scope.row.iccid,remark:scope.row.remark};$refs.ComfirOffCard.visible = true"
                ></my-badge>
                <my-badge text="停机" @click="$refs.ComfirTingJi.visible = true" ></my-badge>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="pageNumber"
            :page-sizes="[100, 200, 300, 400]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <comfir-dialog
      ref="ComfirOffCard"
      @comfir="chargeOffCard"
    ></comfir-dialog>
    <comfir-dialog
      ref="ComfirTingJi"
      :text="`是否确认对<span>(SIM卡：${21213321231123})</span><br>进行停机操作 ？`"
    ></comfir-dialog>
  </div>
</template>


<script>
import filterType from "./filterType";
import myTree from "@/components/myTree/";
import myBadge from "@/components/myBadge/";
import comfirDialog from "@/components/dialog/comfir";
import { promises } from "fs";

export default {
  methods: {
    chargeOffCardChange(iccidStr) {//销卡成功时通知tableData
      let iccidArr = iccidStr.indexOf(",") === -1 ? [iccidStr] : iccidStr.split(",");
      let totalIccidArr = new Array;//增添一个映射 tableData 的 iccid数组

      if(!this.tableData.length) return; 

      this.tableData.map(item => {
        totalIccidArr.push(item.iccid)
      })
      iccidArr.map(item => {
        let i = totalIccidArr.indexOf(item);
        i !== -1 && (this.tableData[i].simState = 3);
      })
    },
    chargeOffCard() {
      this.$API.chargeOffCard(this.chargeOffCardParams).then(res => {
        if (res.code === 0) {
          this.chargeOffCardChange(this.chargeOffCardParams.cardNo)
          this.$msg({
            message: res.msg,
            type: "success"
          });
          this.$refs.ComfirOffCard.visible = false;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    searchSimListByInventory(node) {
      if(node.id.length === 4) return; 
      let params = {
        endIccid: "", //结束iccid号	string
        endTime: "", //结束时间	string
        searchType: "", //不传入库，1出库，2未出库	number
        simCard: "", //sim卡号	string
        simState: "", //sim卡状态	number
        simType: "", //sim卡类型	number
        startIccid: "", //开始iccid号	string
        startTime: "" //开始时间	string
      };
      if(node.id.length === 6){
        params.startTime = `${node.id.substring(0,4)}-${node.id.substring(4,6)}-01 00:00:00`
        params.endTime = `${node.id.substring(0,4)}-${node.id.substring(4,6)}-31 23:59:59`
      }
      if(node.id.length === 8){
        params.startTime = `${node.id.substring(0,4)}-${node.id.substring(4,6)}-${node.id.substring(6,8)} 00:00:00`
        params.endTime = `${node.id.substring(0,4)}-${node.id.substring(4,6)}-${node.id.substring(6,8)} 23:59:59`
      }
      this.$refs.filterType.searchSimListByInventoryParams = params; //init 搜索条件
      this.$API.searchSimListByInventory(params).then(res => {
        if (res.code === 0) {
          this.tableData = res.data || [];
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    loadInventoryData() {
      this.$API.loadInventoryData().then(res => {
        if (res.code === 0) {
          this.defaultTreeData = res.data;
          this.treeData = this.toTreeData(res.data);
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    toTreeData(data) {
      let result = [];
      let resultKeys = {};
      data.map(item => {
        let yearKey = item.groupName.substring(0, 4);
        let monthKey = item.groupName.substring(0, 6);
        let daykey = item.groupName;

        if (!resultKeys[yearKey]) {
          result.push({
            id: yearKey,
            pid: -1,
            label: yearKey
          });
          resultKeys[yearKey] = true;
        }
        if (!resultKeys[monthKey]) {
          result.push({
            id: monthKey,
            pid: yearKey,
            label: monthKey
          });
          resultKeys[monthKey] = true;
        }
        result.push({
          id: daykey,
          groupName: item.groupName,
          pid: monthKey,
          label: daykey
        });
      });

      //toTree
      result.map(item => {
        delete item.children;
      });
      var map = {};
      result.map(item => {
        map[item.id] = item;
      });
      var newData = [];
      result.map((item, index) => {
        var parent = map[item.pid];
        if (parent) {
          (parent.children || (parent.children = [])).push(item); // parent 引用 item
        } else {
          newData.push(item);
        }
      });
      return newData;
    },
    getIndexRunData() {
      this.$API.getIndexRunData().then(res => {
        if (res.code === 0) {
          this.indexRunData = res.data;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getIndexStopData() {
      this.$API.getIndexStopData().then(res => {
        if (res.code === 0) {
          this.indexStopData = res.data;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    async init() {
      await this.getIndexRunData(); //获取动态数据
      await this.getIndexStopData(); //获取静态数据
      await this.loadInventoryData(); //获取树形图数据
    }
  },

  created() {
    this.init();
  },

  data() {
    return {
      defaultTreeData: null,
      treeData: null,
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: [],
      pageNumber: 1,
      pageSize: 100,
      indexRunData: null,
      indexStopData: null,
      chargeOffCardParams: {
        cardNo: "", //卡号	string
        remark: "" //销卡说明	string
      }
    };
  },

  components: {
    filterType,
    myTree,
    myBadge,
    comfirDialog
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
.inventory {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;
  .inventory-header {
    display: flex;
    margin-bottom: 20px;
    background: #fff;
    height: 58px;
    padding: 15px;
    font-size: 14px;
    box-sizing: border-box;
    .header-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(253 / 1880 * 100%);
      border-right: 1px solid #d9dbe6;
      color: #adafbd;
      &:nth-last-child(1) {
        border: none;
      }
      span {
        color: $btnColor;
        margin-left: 10px;
      }
    }
    .header-item.export-item {
      width: calc(356 / 1880 * 100%);
      color: #58616c;
      .export {
        cursor: pointer;
        span {
          margin: 0;
          color: #58616c;
        }
      }
    }
  }
  .inventory-content {
    flex: 1;
    display: flex;
    .inventory-left {
      width: 300px;
      padding: 20px;
      margin-right: 20px;
      background: #fff;
      display: flex;
      flex-direction: column;
    }
    .inventory-right {
      background: #fff;
      flex: 1;
      min-width: 900px;
      position: relative;
      .filter-table-wrap {
        border: 1px solid #ebf0f6;
        position: absolute;
        top: 84px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        /deep/ .el-pagination {
          padding: 20px;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          & > span {
            margin: 0;
          }
          .el-pagination__total {
            margin-right: auto;
          }
        }
      }
    }
  }
}
/deep/ .el-table {
  font-size: 14px;
  .cell {
    line-height: 26px;
  }
  &::before {
    display: none;
  }
  thead {
    th {
      background: #f5f8fc;
      div {
        line-height: 1;
        text-align: center;
        color: $fgray;
      }
    }
  }
  tbody {
    overflow: auto;
    tr {
      td {
        text-align: center;
        border: none;
        color: $fgray;
      }
    }
    tr.el-table__row--striped {
      td {
        background: #f5f8fc;
      }
    }
  }
}
</style>