<template>
  <div class="home-box">
    <el-row
      type="flex"
      class="home-top-box"
    >
      <el-col
        :span="8"
        class="order-box"
      >
        <div
          class="order-item"
          @click="$router.push('/order')"
        >
          <div class="order-icon">
            <i class="iconfont icon-shalou"></i>
            <span>当月订单数</span>
          </div>
          <span class="order-Num">{{ indexRunData ? indexRunData.noDeal : 0 }}</span>
        </div>
        <div
          class="order-item"
          @click="dialog.risk = true"
        >
          <div class="order-icon">
            <i class="iconfont icon-dunpai"></i>
            <span>风控预警</span>
          </div>
          <span class="order-Num">{{ indexStopData ? indexStopData.maybeAlarmNum : 0 }}</span>
        </div>
      </el-col>
      <el-col
        :span="8"
        class="order-box"
      >
        <piecharts :option="lchartsOption" />
        <div class="charts-num">
          <span>总数</span>
          <span>{{ indexRunData ? indexRunData.totalNum : 0 }}</span>
        </div>
      </el-col>
      <el-col
        :span="8"
        class="order-box"
      >
        <piecharts :option="rchartsOption" />
        <div class="charts-num">
          <span>总数</span>
          <span>{{ indexStopData ? (Number(indexStopData.activationNum) + Number(indexStopData.disableNum) + Number(indexStopData.removeNum)) : 0 }}</span>
        </div>
      </el-col>
      <!-- 风险预警   待处理订单 弹出框 -->
      <el-dialog
        :visible.sync="dialog.risk"
        width="50%"
      >
        <div class="dialog-header">
          <div
            @click="handleheader(1)"
            :class="{active:headerActive === 1}"
          >
            预过期(757)
          </div>
          <div
            @click="handleheader(2)"
            :class="{active:headerActive === 2}"
          >
            已过期(1052)
          </div>
        </div>
        <div
          class="order-tabelBox"
          style="height:400px;"
        >
          <el-table
            :data="ltableData"
            stripe
            border
            max-height="93%"
            height="93%"
            style="width: 100%;"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
            >
            </el-table-column>
          </el-table>
          <el-pagination
            class="bs-pagination"
            :total="ltotal"
            :current-page.sync="ltableParams.pageNumber"
            :page-sizes="[50, 100]"
            :page-size.sync="ltableParams.pageSize"
            layout="total, prev, pager, next"
          >
          </el-pagination>
        </div>
      </el-dialog>
    </el-row>
    <el-row
      type="flex"
      class="home-bottom-box"
    >

      <el-col
        :span="24"
        class="order-box"
      >
        <div class="order-title">
          <span
            :class="{'active':tableType === 'left'}"
            @click="tableType = 'left'"
          >{{`待处理订单 (${ltotal})`}}</span>
          <span
            :class="{'active':tableType === 'right'}"
            @click="tableType = 'right'"
          >{{`已处理订单 (${rtotal})`}}</span>
          <div
            class="export"
            style="position: absolute;right:130px;"
            @click="exportBusinessSim()"
          >
            <i class="iconfont icon-daochu"></i>已用流量导出
          </div>
          <el-dropdown @command="exportOrder">
            <div class="export">
              <i class="iconfont icon-daochu"></i>订单导出
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="本日订单">本日订单</el-dropdown-item>
              <el-dropdown-item command="本月订单">本月订单</el-dropdown-item>
              <el-dropdown-item command="上月订单">上月订单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div
          v-show="tableType === 'left'"
          class="order-content-wrap"
        >
          <div class="order-content">
            <div class="order-input">
              <input
                v-model="ltableParams.findCode"
                type="text"
                class="inputBg"
                placeholder="客户代码 / 订单号"
              >
            </div>
            <el-button
              type="primary"
              size="small"
              @click="getOrderList(1)"
            >
              查询
            </el-button>
          </div>
          <div class="order-tabelBox">
            <el-table
              :data="ltableData"
              stripe
              max-height="93%"
              height="93%"
              style="width: 100%;"
              :row-class-name="markIconClass"
            >
              <el-table-column
                min-width="50"
                label="标记"
                prop="sellType"
              >
                <template slot-scope="scope">
                  <mark-icon
                    :defaultParams="scope.row"
                    @updateMark="updateMark"
                  ></mark-icon>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                min-width="100"
                label="序号"
              >
                <template slot-scope="scope">
                  {{ (ltableParams.pageNumber - 1) * ltableParams.pageSize + scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="userCode"
                align="center"
                label="客户代码"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="orderNum"
                align="center"
                label="订单号"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                min-width="80"
                label="订单类型"
                prop="sellType"
              >
                <template slot-scope="scope">
                  <orderType
                    :sellType="scope.row.sellType"
                    :plain="true"
                    v-if="scope.row.orderType === 1"
                  ></orderType>
                  <orderType
                    :orderType="scope.row.orderType"
                    :plain="true"
                    v-else
                  ></orderType>
                </template>
              </el-table-column>
              <el-table-column
                min-width="150"
                label="状态"
                prop="orderStatus"
              >
                <template slot-scope="scope">
                  <my-badge :orderStatus="scope.row.orderStatus"></my-badge>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                align="center"
                label="时间"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="serMeal"
                align="center"
                label="套餐规格"
              >
              </el-table-column>
              <el-table-column
                min-width="50"
                prop="counts"
                align="center"
                label="数量"
              >
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="orderPrice"
                align="center"
                label="单价"
              >
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="totalPrice"
                align="center"
                label="总金额"
              >
              </el-table-column>
              <el-table-column
                min-width="150"
                align="center"
                label="操作"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.outPutCardStatus === 0">
                    <my-badge
                      text="处理"
                      @click="openDetail(scope.row);"
                    ></my-badge>
                    <my-badge
                      text="废除"
                      @click="handlerOffice(scope.row)"
                    ></my-badge>
                  </div>
                  <tableItemStatus
                    @errorClick="openDetail(scope.row);"
                    :status="scope.row.outPutCardStatus"
                    v-else
                  ></tableItemStatus>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="bs-pagination"
              @current-change="getOrderList(1)"
              :total="ltotal"
              :current-page.sync="ltableParams.pageNumber"
              :page-sizes="[50, 100]"
              :page-size.sync="ltableParams.pageSize"
              layout="total, prev, pager, next"
            >
            </el-pagination>
          </div>
        </div>
        <div
          v-show="tableType === 'right'"
          class="order-content-wrap"
        >
          <div class="order-content">
            <div class="order-input">
              <input
                v-model="rtableParams.findCode"
                type="text"
                class="inputBg"
                placeholder="客户代码 / 订单号"
              >
            </div>
            <el-button
              type="primary"
              size="small"
              @click="getOrderList(2)"
            >
              查询
            </el-button>
          </div>
          <div class="order-tabelBox">
            <el-table
              :data="rtableData"
              stripe
              max-height="93%"
              height="93%"
              style="width: 100%;"
              :row-class-name="markIconClass"
            >
              <el-table-column
                min-width="50"
                label="标记"
                prop="sellType"
              >
                <template slot-scope="scope">
                  <mark-icon
                    :defaultParams="scope.row"
                    @updateMark="updateMark"
                  ></mark-icon>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                min-width="100"
                label="序号"
              >
                <template slot-scope="scope">
                  {{ (rtableParams.pageNumber - 1) * rtableParams.pageSize + scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="userCode"
                align="center"
                label="客户代码"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="orderNum"
                align="center"
                label="订单号"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                min-width="80"
                label="订单类型"
                prop="sellType"
              >
                <template slot-scope="scope">
                  <orderType
                    :sellType="scope.row.sellType"
                    :plain="true"
                    v-if="scope.row.orderType === 1"
                  ></orderType>
                  <orderType
                    :orderType="scope.row.orderType"
                    :plain="true"
                    v-else
                  ></orderType>
                </template>
              </el-table-column>
              <el-table-column
                min-width="150"
                label="状态"
                prop="orderStatus"
              >
                <template slot-scope="scope">
                  <my-badge :orderStatus="scope.row.orderStatus"></my-badge>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                align="center"
                label="时间"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="serMeal"
                align="center"
                label="套餐规格"
              >
              </el-table-column>
              <el-table-column
                min-width="50"
                prop="counts"
                align="center"
                label="数量"
              >
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="orderPrice"
                align="center"
                label="单价"
              >
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="totalPrice"
                align="center"
                label="总金额"
              >
              </el-table-column>
              <el-table-column
                min-width="150"
                align="center"
                label="操作"
                fixed="right"
              >
                <template slot-scope="scope">
                  <my-badge
                    text="详情"
                    @click="openDetail(scope.row);"
                  ></my-badge>
                  <my-badge
                    text="物流"
                    @click="handlerLogistics(scope.row)"
                  ></my-badge>
                  <my-badge
                    text="退卡"
                    @click="handlerTuika(scope.row)"
                  ></my-badge>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="bs-pagination"
              @current-change="getOrderList(2)"
              :total="rtotal"
              :current-page.sync="rtableParams.pageNumber"
              :page-sizes="[50, 100]"
              :page-size.sync="rtableParams.pageSize"
              layout="total, prev, pager, next"
            >
            </el-pagination>
          </div>
        </div>

        <!-- 订单详情(出库) 弹出框     -->
        <order-dialog
          ref="dialogOrder"
          @outPutCardChange="outPutCardChange"
          :defaultParams="detailParams"
        />
        <!-- 物流信息填写弹出框 -->
        <logisticsDialog
          @updateLogistics="updateLogistics"
          ref="logisticsDialog"
          :type="1"
        ></logisticsDialog>
        <!-- 废除订单弹窗 -->
        <logisticsDialog
          ref="officeDialog"
          :type="2"
          @deleteOffice="deleteOffice"
        ></logisticsDialog>
        <!-- 退卡弹窗 -->
        <tuikaDialog ref="tuikaDialog"></tuikaDialog>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import piecharts from "@/components/piecharts/";
import chartsOption from "./chartConfig";
import orderDialog from "@/components/order/";
import myBadge from "@/components/myBadge/";
import logisticsDialog from "@/components/logistics/";
import tuikaDialog from "@/components/tuika/";
import tableItemStatus from "@/components/tableItemStatus/";
import simNotification from "@/util/notification";
import orderType from "@/components/orderType/";
import markIcon from "@/components/markIcon/";
import { exportFile } from "@/util/common";

export default {
  name: "home",

  methods: {
    // 更新物流信息
    updateLogistics({ orderId, wRemark }) {
      for (let i = 0; i < this.rtableData.length; i++) {
        if (this.rtableData[i].orderId === orderId) {
          this.rtableData[i].wRemark = wRemark;
          break;
        }
      }
    },
    //标记栏颜色
    markIconClass({ row, rowIndex }) {
      if (row.oFlag === 1) {
        return "mark-active";
      }
    },
    updateMark(obj) {
      for (let i = 0; i < this.ltableData.length; i++) {
        if (this.ltableData[i].orderId === obj.orderId) {
          this.ltableData[i].oFlag = obj.oFlag;
          this.ltableData[i].oRemark = obj.oRemark;
          break;
        }
      }
      for (let i = 0; i < this.rtableData.length; i++) {
        if (this.rtableData[i].orderId === obj.orderId) {
          this.rtableData[i].oFlag = obj.oFlag;
          this.rtableData[i].oRemark = obj.oRemark;
          break;
        }
      }
    },
    exportBusinessSim() {
      const json = "exportExcel/exportBusinessSim.json";
      const params = {
        sessionId: this.$store.state.LOGINUSER.sId, //	sessionId	string
        exportFlag: 1 //标识为导出流量相关
      };

      exportFile(json, params);
    },
    exportOrder(command) {
      const json = "exportExcel/exportOrder.json";
      let params = {
        startTime: "", //	开始时间	string
        endTime: "", //结束时间	string
        orderStatus: 1,
        sessionId: this.$store.state.LOGINUSER.sId //	sessionId	string
      };

      const nowDate = new Date();
      switch (command) {
        case "本日订单":
          params.startTime = nowDate.Format("yyyy-MM-dd") + " 00:00";
          params.endTime = nowDate.Format("yyyy-MM-dd") + " 23:59";
          break;
        case "本月订单":
          const nowMonthfirstDay = new Date(
            nowDate.getFullYear(),
            nowDate.getMonth(),
            1
          );
          const nowMonthlastDay = new Date(
            nowDate.getFullYear(),
            nowDate.getMonth() + 1,
            0
          );
          params.startTime = nowMonthfirstDay.Format("yyyy-MM-dd") + " 00:00";
          params.endTime = nowMonthlastDay.Format("yyyy-MM-dd") + " 23:59";
          break;
        case "上月订单":
          const lastMonthfirstDay = new Date(
            nowDate.getFullYear(),
            nowDate.getMonth() - 1,
            1
          );
          const lastMonthlastDay = new Date(
            nowDate.getFullYear(),
            nowDate.getMonth(),
            0
          );
          params.startTime = lastMonthfirstDay.Format("yyyy-MM-dd") + " 00:00";
          params.endTime = lastMonthlastDay.Format("yyyy-MM-dd") + " 23:59";
          break;
      }

      exportFile(json, params);
    },
    deleteOffice(orderId) {
      for (let i = 0; i < this.ltableData.length; i++) {
        if (this.ltableData[i].orderId === orderId) {
          this.ltableData.splice(i, 1);
          break;
        }
      }
    },
    outPutCardChange(data) {
      this.outPutCardStatus[data.orderId] = data.status;
      this.judgePutCardStatus();
    },
    judgePutCardStatus() {
      this.$nextTick(() => {
        this.ltableData.map(item => {
          if (this.outPutCardStatus[item.orderId]) {
            item.outPutCardStatus = this.outPutCardStatus[item.orderId];
          }
        });
      });
    },
    handlerTuika(row) {
      this.$refs.tuikaDialog.defaultParams = row;
      this.$refs.tuikaDialog.visible = true;
    },
    handlerLogistics(row) {
      this.$refs.logisticsDialog.defaultParams = row;
      this.$refs.logisticsDialog.visible = true;
    },
    handlerOffice(row) {
      this.$refs.officeDialog.defaultParams = row;
      this.$refs.officeDialog.visible = true;
    },
    pollingRefresh() {
      this.init();
      let timer = setInterval(() => {
        if (this.$route.path !== "/home") return;
        this.init();
      }, 30 * 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
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
          this.lchartsOption = chartsOption(1, res.data);
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
          this.rchartsOption = chartsOption(2, res.data);
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    openDetail(row) {
      this.detailParams = row;
      this.$refs.dialogOrder.visible = true;
    },
    getOrderList(type) {
      //type为1时是左表格
      let params = type === 1 ? this.ltableParams : this.rtableParams;

      this.$API.getOrderList(params).then(res => {
        if (res.code === 0) {
          res.data.map(item => {
            item.outPutCardStatus = 0;
            //计算购买总价
            const defaultPrice = item.orderPrice * item.counts;
            if (item.orderType === 1) {
              item.totalPrice = (defaultPrice * item.exYears).toFixed(2);
            } else {
              item.totalPrice = defaultPrice.toFixed(2);
            }
          });

          if (type === 1) {
            this.ltableData = res.data;
            this.ltotal = res.total;
            this.judgePutCardStatus();
          } else {
            this.rtableData = res.data;
            this.rtotal = res.total;
          }
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    handleheader(val) {
      this.headerActive = val;
    },
    async init() {
      await this.getIndexRunData(); //获取动态数据
      await this.getIndexStopData(); //获取静态数据
      await this.getOrderList(1); //获取左表格数据
      await this.getOrderList(2); //获取右表格数据
    }
  },

  created() {
    this.pollingRefresh();
  },

  mounted() {
    this.simNotification = new simNotification();
  },

  watch: {
    ltotal(newVal, curVal) {
      if (curVal === 0 || curVal >= newVal || !this.simNotification) return;
      this.simNotification.sendMsg("新的订单！", {
        icon: require("@/public/img/other/desktop_tip.png"),
        body: `您有${newVal - curVal}个订单`
      });
    }
  },

  data() {
    return {
      simNotification: null,
      tableType: "left",
      ltableData: [],
      rtableData: [],
      ltotal: 0,
      rtotal: 0,
      ltableParams: {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: 4, //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 50, //条数	number
        serMeal: "" //套餐规格	string
      },
      rtableParams: {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: 1, //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 50, //条数	number
        serMeal: "" //套餐规格	string
      },
      lchartsOption: null,
      rchartsOption: null,
      headerActive: 1,
      detailParams: null,
      indexStopData: null,
      indexRunData: null,
      dialog: {
        logistics: false,
        risk: false
      },
      outPutCardStatus: {}
    };
  },

  components: {
    piecharts,
    orderDialog,
    myBadge,
    logisticsDialog,
    tableItemStatus,
    orderType,
    markIcon,
    tuikaDialog
  }
};
</script>

<style scoped lang='scss'>
@import "@/public/css/mixin.scss";

.home-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  & /deep/ .el-table {
    & th,
    td {
      padding: 5px 0;
    }
    .el-table__fixed-right::before,
    .el-table__fixed::before {
      display: none;
    }

    .mark-active {
      background: #dcebff;
      td {
        background: #dcebff;
      }
    }
  }
  .bs-pagination {
    text-align: end;
    padding: 10px 20px 0;
  }

  & /deep/ .dialog-header {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    & > div {
      cursor: pointer;
      width: 150px;
      line-height: 40px;
      text-align: center;
      height: 40px;
      font-size: 12px;
      background: #f5f7f9;
      color: #b9c2cc;
      font-weight: bold;
    }
    & > .active {
      background: #fff;
      color: #1c3fd6;
    }
  }
  .home-top-box {
    height: 200px;
    & /deep/ .el-dialog__header {
      border-bottom: none;
    }
    .order-box {
      background: #fff;
      position: relative;
      padding: 16px 17px;
      height: 100%;
      overflow: hidden;
      .charts-num {
        position: absolute;
        width: 92px;
        height: 92px;
        left: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: #213d71;
        border-radius: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        & > span {
          &:first-child {
            font-weight: bold;
            font-size: 14px;
          }
          &:last-child {
            margin-top: 5px;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
      &:nth-child(2) {
        margin: 0 20px;
      }
      .order-item {
        background: #f47878;
        display: inline-flex;
        height: 100%;
        width: 48%;
        justify-content: center;
        align-items: center;
        color: #fff;
        float: left;
        cursor: pointer;
        .order-icon {
          display: flex;
          flex-direction: column;
          width: 60px;
          align-items: center;
          i {
            font-size: 40px;
          }
          span {
            font-size: 12px;
            margin-top: 10px;
          }
        }
        .order-Num {
          margin-left: 40px;
          font-size: 30px;
          font-weight: bold;
        }
        &:last-child {
          background: #c28aec;
          float: right;
        }
      }
    }
  }
  .home-bottom-box {
    overflow: hidden;
    flex: 1;
    margin-top: 20px;
    .order-box {
      background: #fff;
      // padding: 16px 17px;
      position: relative;
      display: flex;
      flex-direction: column;
      .order-title {
        font-size: 14px;
        color: #58616c;
        font-weight: bold;
        display: flex;
        border-bottom: 2px solid rgba(230, 235, 242, 1);
        height: 50px;
        position: relative;
        span {
          width: 150px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          display: block;
          cursor: pointer;
          // background: #f5f7f9;
          color: #58616c;
          border-bottom: 2px solid transparent;
          position: absolute;
          &:nth-of-type(2) {
            left: 150px;
          }
        }
        span.active {
          background: #fff;
          border-color: $btnColor;
        }
        .export {
          padding: 0 10px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: $btnColor;
          cursor: pointer;
          height: 100%;
          &:hover {
            background: #f5f6ff;
          }
          i {
            margin-right: 10px;
          }
        }
        .el-dropdown {
          position: absolute;
          right: 20px;
          top: 0;
          height: 100%;
        }
      }
      .order-tabelBox {
        padding: 10px 10px;
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .order-content-wrap {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }
      .order-content {
        padding: 15px 20px 15px 10px;
        display: flex;
        align-items: center;
        .order-input {
          input {
            width: 250px;
            height: 30px;
            margin-right: 20px;
          }
        }
      }
    }
    // background: #fff;
  }
}
</style>


