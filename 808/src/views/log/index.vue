<template>
  <div class="log-index-page">
    <formFilter :data="formData" class="form-box" :search-loading="tableStatus==='loading'" @onSearch="onSearch" />
    <div class="cont">
      <el-table
        ref="table"
        v-loading="tableStatus==='loading'"
        v-keepTableScroll="payLoads"
        size="mini"
        border
        class="p-table-style el-table-tart"
        :data="tableData"
        style="width: 100%"
        height="100%"
      >
        <el-table-column
          prop="_index"
          label="序号"
          width="50"
        />
        <el-table-column
          prop="checkLogNo"
          label="检测编号"
        />
        <el-table-column
          prop="manufactName"
          label="厂商"
          width="170"
        />
        <el-table-column
          prop="terminalType"
          label="终端型号"
          width="120"
        />
        <el-table-column
          prop="terminalNo"
          width="80"
          label="终端编号"
        />
        <el-table-column
          prop="terminalNumber"
          label="终端ID"
          width="180"
        />
        <el-table-column
          prop="num"
          width="80"
          label="检测轮次"
        />
        <el-table-column
          prop="checkLogTime"
          label="检测时间"
          width="160"
        />
        <el-table-column
          align="center"
          label="详细日志"
          fixed="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row)">查看日志</el-button>

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
        @current-change="getSearchAll"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>
<script>
import { searchAll } from '@/api/log'
import formFilter from './components/formFilter'
export default {
  name: 'LogIndex',
  components: {
    formFilter
  }, data() {
    return {
      formData: {
        terminalType: '',
        terminalNo: '',
        checkNo: '',
        manufacturerName: '',
        num: ''
      },
      dataTotal: 0,
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      tableStatus: '',
      payLoads: '' // 记住当前表格的滚动条位置
    }
  },
  created() {
    this.getSearchAll()
  },
  activated() {
    this.payLoads = new Date().getTime()
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.getSearchAll()
    },
    onSearch(formData) {
      this.currentPage = 1
      this.formData = formData
      this.getSearchAll()
    },
    getSearchAll() {
      this.tableStatus = 'loading'
      var params = Object.assign({
        currentPage: this.currentPage,
        itemNum: this.pageSize
      }, this.formData)
      searchAll(params).then(rst => {
        if (rst.code === 0) {
          if (rst.data && rst.data.length > 0) {
            var indexStart = (this.currentPage - 1) * this.pageSize
            rst.data.map((item, index) => {
              item['_index'] = index + 1 + indexStart
            })
            this.tableData = rst.data
          } else {
            this.tableData = []
          }

          this.dataTotal = rst.total
          this.tableStatus = 'success'
        } else {
          this.tableStatus = 'error'
        }
        if (this.$refs['table']) {
          this.$refs['table'].$el.querySelector('.el-table__body-wrapper').scrollTop = 0
        }
      }).catch(e => {
        this.tableStatus = 'error'
      })
    },
    toDetail(data) {
      this.$router.push({
        name: 'LogDetail',
        query: {
          logData: JSON.stringify({ checkLogId: data.checkLogId })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.log-index-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px;
  >.form-box{
    margin-top:10px;

  }
  >.cont{
    flex: 1;
    position: relative;
    >.el-table-tart{
        position: absolute;
        height: 100%;
        width: 100%;
        left:0;top:0;
    }
  }
  >.fot-pagination{
    padding-top: 15px;
    text-align: center;
  }
}
</style>
