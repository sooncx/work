<template>
  <div class="main">

    <div
      class="content"
      v-if="type ==1"
    >
      <div class="tableBox">
        <el-table
          height="400"
          :data="data"
          :row-class-name="tableRowClassName"
          :cell-class-name="addClass"
        >
          <el-table-column
            type="index"
            :index="indexMethod"
            alien="center"
            label="序号"
            class="first"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="plate"
            align="center"
            label="车牌号"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="driLicenseExpDate"
            align="center"
            label="行驶证年审日期"
            :formatter="Dataformat"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="operateExpDate"
            align="center"
            :formatter="Dataformat"
            label="营运证年审日期"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="trafficInsExpDate"
            align="center"
            :formatter="Dataformat"
            label="交强险日期"
          >
          </el-table-column>
          <el-table-column
            prop="tradeInsExpDate"
            align="center"
            width="100"
            :formatter="Dataformat"
            label="商业险日期"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="gPSExpireDate"
            align="center"
            :formatter="Dataformat"
            label="GPS续费日期"
          >
          </el-table-column>
          <el-table-column
            min-width="150"
            prop="tachographExpDate"
            align="center"
            :formatter="Dataformat"
            label="行驶记录仪续费日期"
          >
          </el-table-column>
          <!-- <el-table-column
            min-width="100"
            prop="mortgageList[1].repaymentDate"
            align="center"
            :formatter="Dataformat"
            label="车主还款日期"
          >
          </el-table-column> -->
          <el-table-column
            label="车主还款日期"
            align="center"
          >
            <template slot-scope="scope">
              <div
                v-for="(item,index) in scope.row.mortgageList"
                :key="index"
                class="list"
              >
                <span
                  v-if="item.repaymentDate"
                  :style="formatStyle(item.status)"
                >
                  {{formatData(item.repaymentDate)}}
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=this.data.length
        >
        </el-pagination>
      </div>
    </div>

    <div
      class="content"
      v-if="type ==2"
    >
      <div class="tableBox">
        <el-table
          height="400"
          :data="data"
          :row-class-name="tableRowClassName"
        >
          <!-- <el-table-column
            type="index"
            :index="indexMethod"
            alien="center"
            label="序号"
            class="first"
            min-width="100"
          ></el-table-column> -->
          <el-table-column
            prop="integralType"
            align="center"
            label="积分类别"
            :formatter="contentFormat"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="content"
            align="center"
            label="内容"
            :formatter="contentFormat"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="terminalType"
            align="center"
            :formatter="contentFormat"
            label="设备类型"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="terminalNo"
            align="center"
            :formatter="contentFormat"
            label="设备号"
          >
          </el-table-column>
          <el-table-column
            prop="installDate"
            align="center"
            width="100"
            :formatter="Dataformat"
            label="安装时间"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="consumerIntegral"
            align="center"
            :formatter="contentFormat"
            label="消费积分"
          >
          </el-table-column>
          <el-table-column
            min-width="150"
            prop="returnIntegral"
            align="center"
            :formatter="contentFormat"
            label="返还积分"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="surplusIntegral"
            align="center"
            :formatter="contentFormat"
            label="剩余积分"
          >
          </el-table-column>

        </el-table>

      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=this.data.length
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    data: {
      type: Array
    },
    type: {
      type: Number
    }
  },
  watch: {
    data: {
      handler(newval, oldval) {}
    }
  },
  data() {
    return {
      w: 800,
      currentPage: 1,
      pageSize: 10
    };
  },

  components: {},

  created() {},
  methods: {
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    formatStyle(status) {
      if (status == 1) {
        return {
          color: "red"
        };
      } else if (status == 2) {
        return {
          color: "#3667a3"
        };
      } else
        return {
          color: "black"
        };
    },
    //表格合并
    // :span-method="arraySpanMethod"
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 8) {
    //     return [1, 2];
    //   }
    // },

    //element表格日期截断
    Dataformat(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue.split(" ")[0];
      }
      return "无";
    },
    //自定义内容日期截断
    formatData(data) {
      if (data) {
        return data.split(" ")[0];
      }
      return "无";
    },
    //表格空数据转换
    contentFormat(row, column, cellValue, index) {
      if (cellValue) {
        if (index == 1) {
          if (cellValue == 1) {
            return "提成积分提现";
          } else if (cellValue == 2) {
            return "充值积分";
          } else if (cellValue == 3) {
            return "安装";
          } else if (cellValue == 4) {
            return "消费";
          } else if (cellValue == 5) {
            return "提成积分转消费积分";
          }
        }
        return cellValue;
      }
      return "-";
    },

    //给表格每个单元格添加不同样式
    addClass({ row, column, rowIndex, columnIndex }) {
      console.log(JSON.stringify(row));
      if (columnIndex == 0) {
        return "cell-black";
      } else if (row.driLicenseFlag == 1 && columnIndex == 2) {
        return "cell-red";
      } else if (row.operateFlag == 1 && columnIndex == 3) {
        return "cell-red";
      } else if (row.trafficInsFlag == 1 && columnIndex == 4) {
        return "cell-red";
      } else if (row.tradeInsFlag == 1 && columnIndex == 5) {
        return "cell-red";
      } else if (row.gPSFlag == 1 && columnIndex == 6) {
        return "cell-red";
      } else if (row.tachographFlag == 1 && columnIndex == 7) {
        return "cell-red";
      } else if (row.mortgageList[1].status == 1 && columnIndex == 8) {
        return "cell-red";
      } else return "cell-blue";
    },
    //生成序号
    indexMethod(index) {
      return index + 1;
    },
    //给el-table单双行添加不同背景色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 === 1) {
        return "success-row";
      }
      return "";
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
/deep/ .el-table .warning-row {
  background: #ffffff;
}
/deep/ .el-table .success-row {
  background: #f0f0f0;
}
// /deep/ .el-table .cell {
//   color: #3667a3;
// }
/deep/ .el-table th > .cell {
  color: #999999;
}
/deep/ .el-table th,
.el-table tr {
  background-color: #f0f0f0;
  border: none;
}

/deep/ .el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
}
/deep/ .el-pagination {
  margin: 20px 0;
}
/deep/ .el-pagination .el-pagination__total {
  margin-right: auto;
}
/deep/ .el-pagination {
  display: flex;
}
/deep/ .cell-black {
  color: #333333 !important;
}
/deep/ .cell-blue {
  color: #3667a3 !important;
}
/deep/ .cell-red {
  color: red !important;
}
.main {
  width: 100%;
}
.list {
  // display: inline;
}
.list > span {
  padding: 0 5px;
}

.content {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
  padding: 0 20px;
  padding-top: 20px;
  padding-bottom: 1px;
  width: 100%;
  height: auto;
  margin: auto;
  .tableBox {
    overflow: auto;
    // max-height: 500px;
    border: 1px solid rgba(240, 240, 240, 1);
    // overflow-y: scroll;
    background-color: rgb(255, 255, 255);
  }
}
</style>

