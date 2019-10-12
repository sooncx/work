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
      <inventoryStatus
        :indexRunData="indexRunData"
        class="header-item"
      ></inventoryStatus>
      <importExcel
        class="header-item"
        @loadInventoryData="loadInventoryData"
      ></importExcel>
    </div>
    <div class="inventory-content">
      <div class="inventory-left">
        <my-tree
          :treeData="treeData"
          :defaultProps="defaultProps"
          icon="icon-fangdajing"
          @node-click="handleNodeClick"
        ></my-tree>
      </div>
      <div class="inventory-right">
        <filter-type
          ref="filterType"
          :multipleSelection="multipleSelection"
          @updateSearchSimListByInventoryParams="val => (searchSimListByInventoryParams = val)"
          :tableData="tableData"
          @danjia="updatePrice"
          @xufei="batchRenewal"
          @updateSimList="res => {tableData = res.data;total = res.total}"
          @chargeOffCardChange="chargeOffCardChange"
          @duanxin="allSmsDialog()"
          @transferSIM="transferSIM"
        ></filter-type>
        <div class="filter-table-wrap">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            height="calc(100% - 70px)"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            >
            </el-table-column>
            <el-table-column
              type="index"
              width="100"
              label="序号"
            >
              <template slot-scope="scope">
                {{ (searchSimListByInventoryParams.pageNumber - 1) * searchSimListByInventoryParams.pageSize + scope.$index + 1 }}
              </template>
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
              width="100"
              prop="simType"
              align="center"
              label="套餐规格"
              :formatter="formatterSimType"
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
              label="总流量"
              :formatter="({traffic}) => formatterGprs(traffic)"
            >
            </el-table-column>
            <el-table-column
              width="100"
              prop="surplusGprs"
              align="center"
              label="剩余流量"
              :formatter="({surplusGprs}) => formatterGprs(surplusGprs)"
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
              prop="expireTime"
              align="center"
              label="到期时间"
              width="200"
            >
            </el-table-column>
            <el-table-column
              width="230"
              label="操作"
              fixed="right"
            >
              <template slot-scope="scope">
                <my-badge
                  text="刷新"
                  @click="getIotLlcx(scope.row.iccid)"
                ></my-badge>
                <my-badge
                  text="修改"
                  @click="editSimCard(scope.row)"
                ></my-badge>
                <my-badge
                  text="短信"
                  @click="singelSmsDialog(scope.row,scope.$index)"
                ></my-badge>
                <my-badge
                  text="销卡"
                  @click="chargeOffCardComfir(scope.row);"
                ></my-badge>
                <!-- <my-badge
                  text="停卡"
                  @click="$refs.ComfirTingJi.visible = true"
                ></my-badge> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="searchSimListByInventory()"
            @current-change="searchSimListByInventory()"
            :current-page.sync="searchSimListByInventoryParams.pageNumber"
            :page-sizes="[50, 100]"
            :page-size.sync="searchSimListByInventoryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <comfir-dialog
      ref="ComfirOffCard"
      text="是否确认销卡！"
      @comfir="chargeOffCard"
    ></comfir-dialog>
    <comfir-dialog
      ref="ComfirTingJi"
      :text="`是否确认对<span>(SIM卡：${21213321231123})</span><br>进行停机操作 ？`"
    ></comfir-dialog>

    <!-- 短信下发 -->
    <smsDialog ref="smsDialog"></smsDialog>

    <!-- 修改卡信息 -->
    <editSimCard
      ref="editSimCard"
      @updateSimInfo="updateSimInfo"
    ></editSimCard>

    <!-- 转移sim卡 -->
    <transferSimCard ref="transferSimCard"></transferSimCard>

    <!-- 批量修改单价 -->
    <batchPrice
      ref="batchPrice"
      @refresh="searchSimListByInventory"
    />

    <!-- 批量续费 -->
    <batchRenewal
      ref="batchRenewal"
      @refresh="searchSimListByInventory"
    />
  </div>
</template>


<script>
import filterType from "./filterType";
import myTree from "@/components/myTree/";
import myBadge from "@/components/myBadge/";
import comfirDialog from "@/components/comfir/";
import { toTreeData, hasDot } from "@/util/common";
import smsDialog from "./smsDialog";
import importExcel from "./importExcel";
import editSimCard from "./editSimCard";
import transferSimCard from "./transferSimCard";
import inventoryStatus from "./inventoryStatus";
import batchPrice from "./batchPrice";
import batchRenewal from "./batchRenewal";

export default {
  name: "inventory",

  methods: {
    updateSimInfo(obj) {
      //更新sim卡信息
      for (let i in this.tableData) {
        if (this.tableData[i].iccid !== obj.iccid) continue;
        Object.assign(this.tableData[i], obj);
        break;
      }
    },
    //批量修改价格
    updatePrice() {
      if (this.total === 0) {
        this.$msg({
          message: "请查询或选择SIM卡！",
          type: "warning"
        });
        return;
      }
      this.$refs.batchPrice.multipleSelection = [...this.multipleSelection];
      this.$refs.batchPrice.searchSimListByInventoryParams = {
        ...this.searchSimListByInventoryParams
      };
      this.$refs.batchPrice.total = this.total;
      this.$refs.batchPrice.price = "";
      this.$refs.batchPrice.visible = true;
    },
    //批量续费
    batchRenewal() {
      if (this.total === 0) {
        this.$msg({
          message: "请查询或选择SIM卡！",
          type: "warning"
        });
        return;
      }
      this.$refs.batchRenewal.multipleSelection = [...this.multipleSelection];
      this.$refs.batchRenewal.searchSimListByInventoryParams = {
        ...this.searchSimListByInventoryParams
      };
      this.$refs.batchRenewal.total = this.total;
      this.$refs.batchRenewal.years = "";
      this.$refs.batchRenewal.visible = true;
    },
    editSimCard(row) {
      this.$refs.editSimCard.defaultParams = row;
      this.$refs.editSimCard.visible = true;
    },
    transferSIM() {
      if (!this.tableData.length) {
        this.$msg({
          message: "请查询SIM卡！",
          type: "warning"
        });
        return;
      }

      this.$refs.transferSimCard.searchSimListByInventoryParams = this.searchSimListByInventoryParams;
      this.$refs.transferSimCard.visible = true;
      this.$refs.transferSimCard.selectIccids = this.selectIccids;
      if (this.selectIccidsCount >= 1) {
        this.$refs.transferSimCard.total = this.selectIccidsCount;
      } else {
        this.$refs.transferSimCard.total = this.total;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log("选中:" + JSON.stringify(this.multipleSelection));
      var arr = [];
      this.multipleSelection.map(item => {
        arr.push(item.iccid);
      });
      this.selectIccidsCount = arr.length;
      // console.log("选中iccid:" + arr);
      var str;
      str = arr.join(",");
      this.selectIccids = str;
      // console.log("拼接后:" + str);
    },
    getIotLlcx(iccid) {
      this.$API.getIotLlcx({ iccid }).then(res => {
        if (res.code === 0) {
          for (let i in this.tableData) {
            if (iccid === this.tableData[i].iccid) {
              this.tableData[i] = Object.assign(this.tableData[i], res.data);
              break;
            }
          }
          this.$msg({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    formatterGprs(gprs) {
      if (!gprs) return "0kb";
      if (Number(gprs) > 1024 * 1024) {
        let num = Number(gprs) / (1024 * 1024);
        return hasDot(num) + "G";
      } else if (Number(gprs) > 1024) {
        let num = Number(gprs) / 1024;
        return hasDot(num) + "M";
      } else {
        return Number(gprs) + "kb";
      }
    },
    formatterSimType({ simType }) {
      //以M为单位
      if (simType > 1024) {
        let num = Number(simType) / 1024;
        return hasDot(num) + "G";
      } else {
        return simType + "M";
      }
    },
    singelSmsDialog(row, index) {
      this.$refs.smsDialog.row = row;
      this.$refs.smsDialog.isSingle = true;
      this.$refs.smsDialog.visible = true;
    },
    allSmsDialog() {
      if (!this.multipleSelection.length) {
        this.$msg({
          message: "请选择SIM卡！",
          type: "warning"
        });
        return;
      }
      this.$refs.smsDialog.selectArr = JSON.parse(
        JSON.stringify(this.multipleSelection)
      );
      this.$refs.smsDialog.activeIndex = 0; //默认选择第一个SIM卡
      this.$refs.smsDialog.row = this.$refs.smsDialog.selectArr[0];
      this.$refs.smsDialog.isSingle = false; //设置为批量下发模式
      this.$refs.smsDialog.visible = true;
    },
    chargeOffCardChange(iccidStr) {
      //销卡成功时通知tableData
      let iccidArr =
        iccidStr.indexOf(",") === -1 ? [iccidStr] : iccidStr.split(",");
      let totalIccidArr = new Array(); //增添一个映射 tableData 的 iccid数组

      if (!this.tableData.length) return;

      this.tableData.map(item => {
        totalIccidArr.push(item.iccid);
      });
      iccidArr.map(item => {
        let i = totalIccidArr.indexOf(item);
        i !== -1 && (this.tableData[i].simState = 3);
      });
    },
    chargeOffCard() {
      this.$API.chargeOffCard(this.chargeOffCardParams).then(res => {
        if (res.code === 0) {
          this.$refs.ComfirOffCard.visible = false;
          this.chargeOffCardChange(this.chargeOffCardParams.cardNo);
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
    chargeOffCardComfir(row) {
      if (row.simState === 3) {
        this.$msg({
          message: "该卡已属于销卡状态！",
          type: "warning"
        });
        return;
      }
      this.chargeOffCardParams = { cardNo: row.iccid, remark: row.remark };
      this.$refs.ComfirOffCard.visible = true;
    },
    handleNodeClick(node) {
      if (node.children) return;
      let params = {
        endIccid: "", //结束iccid号	string
        endTime: "", //结束时间	string
        searchType: "", //不传入库，1出库，2未出库	number
        simCard: "", //sim卡号	string
        simState: 0, //sim卡状态	number
        simType: "", //sim卡类型	number
        startIccid: "", //开始iccid号	string
        startTime: "", //开始时间	string
        pageNumber: 1, //当前页	number
        pageSize: this.searchSimListByInventoryParams.pageSize, //条数	number
        simCardStr: "" //	sim卡集合
      };
      let year = node.id.substring(0, 4);
      let month = node.id.substring(4, 6);
      let day = node.id.substring(6, 8);

      params.startTime = `${year}-${month}-${day} 00:00:00`;
      params.endTime = `${year}-${month}-${day} 23:59:59`;

      this.searchSimListByInventoryParams = params;
      this.$refs.filterType.searchSimListByInventoryParams = params; //init 搜索条件 将选择的树形图的开始和结束时间传递给详细查询页
      this.searchSimListByInventory();
    },
    searchSimListByInventory() {
      this.$API
        .searchSimListByInventory(this.searchSimListByInventoryParams)
        .then(res => {
          if (res.code === 0) {
            this.tableData = res.data || [];
            this.total = res.total;
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
        //console.log("树形图数据数据:" + JSON.stringify(res.data));
        if (res.code === 0) {
          this.defaultTreeData = res.data;
          this.treeData = toTreeData(res.data);
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getIndexRunData() {
      this.$API.getIndexRunData().then(res => {
        if (res.code === 0) {
          res.data.outNum = 0;
          Object.entries(res.data.comboStock).map(([key, val]) => {
            res.data.outNum += val.outOfStock;
          });
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
      selectIccidsCount: null,
      selectIccids: null,
      defaultTreeData: null,
      treeData: null,
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: [],
      pageNumber: 1,
      pageSize: 50,
      total: 0,
      indexRunData: null,
      indexStopData: null,
      chargeOffCardParams: {
        cardNo: "", //卡号	string
        remark: "" //销卡说明	string
      },
      searchSimListByInventoryParams: {
        endIccid: "", //结束iccid号	string
        endTime: "", //结束时间	string
        searchType: "", //不传入库，1出库，2未出库	number
        simCard: "", //sim卡号	string
        simState: 0, //sim卡状态	number
        simType: "", //sim卡类型	number
        startIccid: "", //开始iccid号	string
        startTime: "", //开始时间	string
        pageNumber: 1, //当前页	number
        pageSize: 50, //条数	number
        simCardStr: "" //	sim卡集合
      },
      multipleSelection: [] //已选择tabledata
    };
  },

  components: {
    filterType,
    myTree,
    myBadge,
    comfirDialog,
    smsDialog,
    importExcel,
    editSimCard,
    transferSimCard,
    inventoryStatus,
    batchPrice,
    batchRenewal
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
    .header-item {
      flex: 1;
    }
  }
  .inventory-content {
    flex: 1;
    display: flex;
    .inventory-left {
      width: 230px;
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
      }
    }
  }
}
</style>