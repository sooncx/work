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
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
        type="date"
        placeholder="开始时间"
      >
      </el-date-picker>
      <span class="split-line"></span>
      <el-date-picker
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
          :default-sort="{prop: 'name', order: 'descending'}"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          >
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
            width="150"
            prop="serMeal"
            align="center"
            label="套餐类型"
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
            label="总金额"
          >
          </el-table-column>
          <el-table-column
            width="150"
            prop="allPrice"
            align="center"
            label="单价"
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
          >
          </el-table-column>
          <el-table-column
            width="150"
            label="状态"
            prop="orderStatus"
            sortable
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
              <my-badge
                :text="scope.row.orderStatus === 4 ?'详情':'处理'"
                @click="openDetail(scope.row);"
              ></my-badge>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="getOrderListParams.pageNumber"
          :page-sizes="[100, 200, 300, 400]"
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
      :defaultParams.sync="detailParams"
    />
  </div>
</template>


<script>
import myTree from "@/components/myTree/";
import myBadge from "@/components/myBadge/";
import orderDialog from "@/components/dialog/order";

export default {
  methods: {
    openDetail(row) {
      this.detailParams = row;
      this.$refs.dialogOrder.visable = true;
    },
    getOrderList() {
      this.$API.getOrderList(this.getOrderListParams).then(res => {
        if (res.code === 0) {
          res.data.map(item => {
            if (item.counts && item.orderPrice) {
              item.allPrice = item.counts * item.orderPrice;
            }
          });
          this.tableData = res.data;
          this.total = res.total;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getOrderListParamsInit(){
      this.getOrderListParams = {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: "", //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 100, //条数	number
        serMeal: "" //套餐类型	string
      } 
    },
    handleClick(row) {
      console.log(row);
    }
  },

  created() {
    this.getOrderList();
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
      statusOptions: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: 0,
          label: "待处理"
        },
        {
          value: 1,
          label: "已出库"
        },
        {
          value: 2,
          label: "驳回"
        },
        {
          value: 3,
          label: "删除"
        },
        {
          value: 4,
          label: "处理中"
        }
      ],
      getOrderListParams: {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: "", //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 100, //条数	number
        serMeal: "" //套餐类型	string
      }
    };
  },

  components: {
    myTree,
    myBadge,
    orderDialog
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
    .filter-type-input {
      background: #edf2f8;
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
    .filter-table-wrap {
      border: 1px solid #ebf0f6;
      flex: 1;
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
.split-line {
  width: 20px;
  height: 3px;
  margin: auto 10px;
  background: #b5c0ce;
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
/deep/ .el-select {
  width: 200px;
  margin-left: 10px;
  &:nth-child(1) {
    margin: 0;
  }
  .el-input--suffix {
    .el-input__inner {
      background: #f3f7fb;
      color: #828588;
      border: none;
    }
  }
}
.el-select-dropdown {
  .el-select-dropdown__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 15px;
    color: #828588;
  }
  .el-select-dropdown__item.selected {
    color: $btnColor;
  }
}
</style>

