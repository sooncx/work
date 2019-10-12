<template>
    <div class="report">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%;border:1px solid #EBF0F6;"
          height="calc(100vh - 200px)"
          v-loading="loadingTable"
        >
          <el-table-column
            type="index"
            width="55"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="订单时间"
            min-width="130"
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
            prop="openTime"
            align="center"
            label="	订单状态"
          >
            <template slot-scope="scope">
                <my-badge :orderStatus="scope.row.orderStatus"></my-badge>
            </template>
          </el-table-column>

          <el-table-column
            prop="serMeal"
            align="center"
            label="	套餐类型"
          >
          </el-table-column>
          <el-table-column
            prop="counts"
            align="center"
            label="	数量"
          >
          </el-table-column>
          <el-table-column
            prop="orderPrice"
            align="center"
            label="	单价"
          >
          </el-table-column>
          <el-table-column
            prop="remark"
            width="120"
            align="center"
            label="	备注"
          >
          </el-table-column>
          <el-table-column
            width="300"
            prop="wRemark"
            align="center"
            label="物流信息"
            fixed="right"
          >
          </el-table-column>
        </el-table>
                <el-pagination
          :current-page.sync="pageNumber"
          :page-sizes="[50,100]"
          :page-size.sync="pageSize"
          @current-change="currentChange"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
    </div>
</template>


<script>
import myBadge from "@/components/myBadge/";
export default {
  data() {
    return {
      tableData: [],
      pageNumber:1,
      pageSize:50,
      total:0,
      loadingTable:false
    };
  },
  methods: {
    async getorder() {
      this.loadingTable = true
      let params = {
        pageNumber: this.pageNumber,
        pageSize: 50
      };
      let res = await this.$API.getOrderHistory(params);
      this.total = res.total
      this.tableData = res.data;
      this.loadingTable = false
    },
    currentChange (page) {
      this.pageNumber = page
      this.getorder()
    }
  },
  components: {
    myBadge
  },
  mounted() {
    this.getorder();
  }
};
</script>

<style lang="scss" scoped>
.report {
  padding: 10px 20px 0;
  & /deep/ .el-table th {
    padding: 5px 0;
    font-size: 13px;
  }
}
</style>


