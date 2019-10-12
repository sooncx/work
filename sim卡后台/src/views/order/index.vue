<template>
  <div class="order">
    <div class="order-header">
      <el-select
        v-model="getOrderListParams.orderStatus"
        placeholder="请选择"
        size="small"
        style="width:165px;margin:0 20px 0 0"
      >
        <el-option
          v-for="item in $store.state.statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
        type="date"
        placeholder="开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="getOrderListParams.startTime"
      >
      </el-date-picker>
      <span class="split-line"></span>
      <el-date-picker
        value-format="yyyy-MM-dd 23:59:59"
        v-model="getOrderListParams.endTime"
        type="date"
        placeholder="结束时间"
      >
      </el-date-picker>
      <input
        placeholder="客户代码 / 订单号"
        class="filter-type-input"
        style="margin:0 auto 0 20px;width:15%"
        v-model="getOrderListParams.findCode"
      />
      <el-button
        type="primary"
        size="small"
        @click="getOrderList()"
      >查询</el-button>
      <el-button
        type="primary"
        size="small"
        @click="getOrderListParamsInit()"
      >重置</el-button>
    </div>
    <div class="order-content">
      <div class="filter-table-wrap">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          height="calc(100% - 70px)"
          :default-sort="{prop: 'createTime', order: 'descending'}"
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
              {{ (getOrderListParams.pageNumber - 1) * getOrderListParams.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="userCode"
            align="center"
            label="客户代码"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="orderNum"
            align="center"
            label="订单号"
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
              ></orderType>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            prop="serMeal"
            align="center"
            label="套餐规格"
          >
          </el-table-column>
          <el-table-column
            width="50"
            prop="counts"
            align="center"
            label="数量"
          >
          </el-table-column>
          <el-table-column
            width="150"
            prop="orderPrice"
            align="center"
            label="单价"
          >
          </el-table-column>
          <el-table-column
            width="150"
            prop="totalPrice"
            align="center"
            label="总金额"
          >
          </el-table-column>
          <el-table-column
            width="200"
            prop="remark"
            align="center"
            label="备注"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="订单日期"
            width="200"
            sortable
          >
          </el-table-column>
          <el-table-column
            width="150"
            label="状态"
            prop="orderStatus"
          >
            <template slot-scope="scope">
              <my-badge :orderStatus="scope.row.orderStatus"></my-badge>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.outPutCardStatus === 0">
                <my-badge
                  :text="scope.row.orderStatus === 4 ?'处理':'详情'"
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
          @size-change="getOrderList()"
          @current-change="getOrderList()"
          :current-page.sync="getOrderListParams.pageNumber"
          :page-sizes="[50, 100]"
          :page-size.sync="getOrderListParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 订单详情(出库) 弹出框     -->
    <order-dialog
      ref="dialogOrder"
      @outPutCardChange="outPutCardChange"
      :defaultParams.sync="detailParams"
    />
    <!-- 废除订单弹窗 -->
    <logisticsDialog
      ref="officeDialog"
      :type="2"
    ></logisticsDialog>
  </div>
</template>


<script>
import myTree from "@/components/myTree/";
import myBadge from "@/components/myBadge/";
import orderDialog from "@/components/order/";
import logisticsDialog from "@/components/logistics/";
import tableItemStatus from "@/components/tableItemStatus/";
import orderType from "@/components/orderType/";
import markIcon from "@/components/markIcon/";

export default {
  methods: {
    //标记栏颜色
    markIconClass({ row, rowIndex }) {
      if (row.oFlag === 1) {
        return "mark-active";
      }
    },
    updateMark(obj) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].orderId === obj.orderId) {
          this.tableData[i].oFlag = obj.oFlag;
          this.tableData[i].oRemark = obj.oRemark;
          break;
        }
      }
    },
    deleteOffice(orderId) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].orderId === orderId) {
          this.tableData.splice(i, 1);
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
        this.tableData.map(item => {
          if (this.outPutCardStatus[item.orderId]) {
            item.outPutCardStatus = this.outPutCardStatus[item.orderId];
          }
        });
      });
    },
    handlerOffice(row) {
      this.$refs.officeDialog.defaultParams = row;
      this.$refs.officeDialog.visible = true;
    },
    pollingRefresh() {
      let timer = setInterval(() => {
        this.getOrderList();
      }, 30 * 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    openDetail(row) {
      this.detailParams = row;
      this.$refs.dialogOrder.visible = true;
    },
    getOrderList() {
      this.$API.getOrderList(this.getOrderListParams).then(res => {
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
          this.tableData = res.data;
          this.total = res.total;
          this.judgePutCardStatus();
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getOrderListParamsInit() {
      this.getOrderListParams = {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: "", //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 100, //条数	number
        serMeal: "" //套餐规格	string
      };
    },
    handleClick(row) {
      console.log(row);
    }
  },

  created() {
    this.getOrderList();
    this.pollingRefresh();
  },

  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: null,
      total: null,
      detailParams: null,
      getOrderListParams: {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: "", //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 50, //条数	number
        serMeal: "", //套餐规格	string
        startTime: "",
        endTime: ""
      },
      outPutCardStatus: {}
    };
  },

  components: {
    myTree,
    myBadge,
    orderDialog,
    logisticsDialog,
    tableItemStatus,
    orderType,
    markIcon
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
.order {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;
  .order-header {
    display: flex;
    margin-bottom: 20px;
    padding: 0 40px;
    background: #fff;
    height: 105px;
    align-items: center;
    font-size: 14px;
    box-sizing: border-box;
    .split-line {
      width: 20px;
      height: 3px;
      margin: auto 10px;
      background: #b5c0ce;
    }
    .filter-type-input {
      background: #f3f7fb;
      color: #828588;
      border: none;
      outline: 0;
      padding: 0 15px;
      height: 30px;
    }
    /deep/ .el-date-editor {
      width: 15%;
      .el-input__inner {
        padding-left: 30px;
        height: 30px;
        border-radius: 0;
        outline: none;
        border: 0;
        background: #f3f7fb;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
  .order-content {
    flex: 1;
    display: flex;
    background: #fff;
    padding: 20px;
    overflow: hidden;
    .filter-table-wrap {
      width: 100%;
      border: 1px solid #ebf0f6;
      /deep/ .el-table {
        .mark-active {
          background: #dcebff;
          td {
            background: #dcebff;
          }
        }
      }
    }
  }
}
</style>

