<template>
  <div class="log-index-page">
    <formFilter
      :data="formData"
      class="form-box"
      :search-loading="tableStatus==='loading'"
      @onSearch="onSearch"
    />
    <div class="cont">
      <el-table
        ref="table"
        v-loading="tableStatus==='loading'"
        v-keepTableScroll="payLoads"
        class="p-table-style el-table-tart"
        :data="tableData"
        style="width: 100%"
        :row-class-name="computedRowClass"
        height="100%"
        border
        size="mini"
      >
        <el-table-column
          prop="_index"
          label="序号"
          width="50"
        />
        <el-table-column
          prop="source"
          label="日志来源"
          width="100"
        />
        <el-table-column
          prop="createTime"
          label="日志时间"
          width="160"
        />
        <el-table-column
          prop="msgNo"
          label="消息编号"
          width="100"
        />
        <el-table-column
          prop="msgSerial"
          label="消息流水号"
          width="100"
        />
        <el-table-column
          prop="function"
          label="检测功能"
          width="150"
        />
        <el-table-column
          prop="descp"
          label="日志描述"
          width="150"
        />
        <el-table-column
          min-width="250px"
          label="备注"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="详细"
              width="400"
              trigger="hover"
            >
              <div v-html="scope.row.remark" />
              <div
                slot="reference"
                class="reference-p wen-oh-p wen-oh"
              >{{ scope.row.remark |filterBr }}</div>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          label="详细"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="toItemDetail(scope.row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="fot-pagination">
      <el-pagination
        background
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        layout="prev, pager, next,total,sizes"
        :total="dataTotal"
        @current-change="getCheckLogDetail"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>
<script>
import { checkLogDetail } from "@/api/log";
import formFilter from "./components/detailFormFilter";
import { handlerItemLogData } from "@/utils/functionUtil";
export default {
  name: "LogDetail",
  components: {
    formFilter
  },
  filters: {
    filterBr(val) {
      if (!val) return "";
      return val.replace(/<br\/>/g, "");
    }
  },
  data() {
    return {
      logData: null,
      prevLogDataString: "",
      formData: {
        function: "",
        msgNo: ""
      },
      dataTotal: 0,
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      tableStatus: "",
      payLoads: "" // 记住当前表格的滚动条位置
    };
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.logData = this.$route.query.logData
        ? JSON.parse(this.$route.query.logData)
        : null;
      if (!this.logData) {
        this.$router.push({
          name: "logIndex"
        });
      } else {
        if (this.prevLogDataString !== this.$route.query.logData) {
          this.prevLogDataString = this.$route.query.logData;
          this.formData = {
            function: "",
            msgNo: ""
          };
          this.currentPage = 1;
          this.payLoads = new Date().getTime();
        }
        this.getCheckLogDetail();
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.getCheckLogDetail();
    },
    onSearch(formData) {
      this.currentPage = 1;
      this.formData = formData;
      this.getCheckLogDetail();
    },
    getCheckLogDetail() {
      this.tableStatus = "loading";
      var params = Object.assign(
        {
          currentPage: this.currentPage,
          itemNum: this.pageSize,
          checkLogId: this.logData.checkLogId
        },
        this.formData
      );
      checkLogDetail(params)
        .then(rst => {
          if (rst.code === 0) {
            if (rst.data && rst.data.length > 0) {
              var indexStart = (this.currentPage - 1) * this.pageSize;
              rst.data.map((item, index) => {
                item["_index"] = index + 1 + indexStart;
                handlerItemLogData(item);
              });
              this.tableData = rst.data;
            } else {
              this.tableData = [];
            }
            this.dataTotal = rst.total;
            this.tableStatus = "success";
          } else {
            this.tableStatus = "error";
          }
        })
        .catch(e => {
          this.tableStatus = "error";
        });
      if (this.$refs["table"]) {
        this.$refs["table"].$el.querySelector(
          ".el-table__body-wrapper"
        ).scrollTop = 0;
      }
    },
    toItemDetail(data) {
      this.$popLogDetail.show({
        data: data,
        isNeedGetDetail: true
      });
      // this.$router.push({
      //   name: 'logdetailItem',
      //   params: {
      //     detailData: {
      //       id: data.id
      //     }
      //   }
      // })
    },
    computedRowClass({ row }) {
      var classArr = [];
      if (row.pass !== null && row.pass !== undefined) {
        classArr.push("row-red");
      }
      switch (row.source) {
        case "系统":
          classArr.push("row-red");
          break;
        case "备服":
          classArr.push("row-beifu");
          break;
        case "从服":
          classArr.push("row-congfu");
          break;
      }
      return classArr;
      // return (row.pass !== null && row.pass !== undefined) || row.source === '系统' ? 'row-red' : ''
    }
  }
};
</script>
<style lang="scss" scoped>
.log-index-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px;
  > .form-box {
    margin-top: 10px;
  }
  > .cont {
    flex: 1;
    position: relative;
    > .el-table-tart {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
    }
  }
  > .fot-pagination {
    padding-top: 15px;
    text-align: center;
  }
  .reference-p {
    color: #1890ff;
  }
  /deep/ .el-table__row.row-red .cell,
  .el-table__row.row-red .wen-oh-p {
    color: #db302e;
  }
  /deep/ .el-table__row.row-beifu .cell,
  .el-table__row.row-beifu .wen-oh-p {
    color: #11b95c;
  }
  /deep/ .el-table__row.row-congfu .cell,
  .el-table__row.row-congfu .wen-oh-p {
    color: #7a08ec;
  }
}
</style>
