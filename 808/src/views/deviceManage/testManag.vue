<template>
  <div class="testManag">
    <div class="left-tree">
      <el-row class="top10">
        <el-autocomplete
          v-model="val"
          value-key="name"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <el-button slot="append" icon="el-icon-search" />
        </el-autocomplete>
      </el-row>
      <el-row class="my-tree">
        <el-scrollbar class="leftMenuScroll" wrap-class="scrollbar-wrapper">

          <my-tree
            ref="myTree"
            size="mini"
            :datat-list="list"
            :default-expanded="defaultArr"
            @nodeclick="getlistByTerminal"
            @dblclick="dblclick"
          />
        </el-scrollbar>
      </el-row>
    </div>
    <div class="right-main">
      <div class="data-table">
        <el-table v-loading="isLoading" size="mini" border class="p-table-style " :data="tableData" height="100%">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="sim" label="送检SIM卡号" />
          <el-table-column prop="num" label="检测轮次" />
          <el-table-column prop="remark" label="备注说明" />
          <el-table-column prop="remark" label="操作" align="center">
            <template slot-scope="scope">
              <div class="table-handler-btns">
                <el-button type="primary" size="mini" @click="toTest(scope.row)">检测</el-button>
              </div>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import myTree from './components/myTree'
import { search, getTerminal, getlistTerminal } from '@/api/testList.js'
export default {
  name: 'TestManag',
  components: { myTree },
  props: {},
  data() {
    return {
      isLoading: false,
      val: '',
      searchVal: '',
      list: [],
      tableData: [],
      defaultArr: [],
      restaurants: [],
      timeout: null,
      selectedTreeId: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getList()
  },
  activated() {
    if (this.selectedTreeId) {
      this.getlistByTerminal(this.selectedTreeId)
    }
    this.getList()
  },
  methods: {
    createFilter(queryString) {
      return restaurant => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    querySearchAsync(queryString, cb) {
      if (queryString.length > 1 && this.searchVal !== queryString) {
        this.searchVal = queryString
        this.getSearch(queryString, cb)
      } else {
        cb([])
      }
    },
    handleSelect(item) {
      console.log('handleSelect', item)
      this.$refs.myTree.setCurrent(item.id)
    },
    getSearch(queryString, cb) {
      this.isLoading = true
      var params = { keyword: queryString }
      search(params)
        .then(res => {
          this.isLoading = false
          if (res.code === 0 && res.data) {
            cb(res.data)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
              duration: 2 * 1000
            })
          }
        })
        .catch(error => {
          this.isLoading = false
          console.log('error', error)
        })
    },
    getList() {
      this.isLoading = true
      var params = {}
      getTerminal(params)
        .then(res => {
          this.isLoading = false
          if (res.code === 0 && res.data) {
            var arr = []
            res.data.forEach(obj => {
              var temp = []
              if (obj.typeAndInfoId.length !== 0) {
                obj.typeAndInfoId.forEach(e => {
                  temp.push({
                    id: e.terminalInfoId,
                    label: e.terminalType
                  })
                })
              }
              arr.push({
                id: 'p_' + obj.id,
                label: obj.manufacturer,
                children: temp
              })
            })
            this.list = [{ label: '送检终端', children: arr, id: -1 }]
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
              duration: 2 * 1000
            })
          }
        })
        .catch(error => {
          this.isLoading = false
          console.log('error', error)
        })
    },
    getlistByTerminal(id) {
      this.isLoading = true
      this.selectedTreeId = id
      var params = { terminalInfoId: id }
      getlistTerminal(params)
        .then(res => {
          this.isLoading = false
          if (res.code === 0 && res.data) {
            this.tableData = res.data
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
              duration: 2 * 1000
            })
          }
        })
        .catch(error => {
          this.isLoading = false
          console.log('error', error)
        })
    },
    dblclick(obj) {
      console.log('tree_dblclick', obj)
    },
    toTest(itemData) {
      var prevDeviceData = this.$store.state.testFunction.deviceData
      if (prevDeviceData && prevDeviceData.terminalVehicleId !== itemData.terminalVehicleId && prevDeviceData.num !== itemData.num) {
        this.$store.dispatch('tagsView/delCachedView', {
          name: 'FunctionIndex'
        })
      }
      this.$nextTick(() => {
        this.$router.push({
          name: 'FunctionIndex',
          query: {
            deviceData: JSON.stringify(itemData)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-handler-btns{
  padding:2px 0
}
.testManag {
	display: flex;
	flex-direction: row;
	padding: 10px;
	height: 100%;
	width: 100%;
	.left-tree {
		margin: 10px;
		padding: 10px;
		min-width: 300px;
		max-width: 300px;
		display: flex;
		flex-direction: column;
		border: 1px solid #dfe6ec;
		.top10 {
			padding-bottom: 10px;
			.el-autocomplete {
				width: 100%;
			}
		}
		.my-tree {
			flex: 1;
			border: 1px solid #dfe6ec;
			// display: flex;
			width: 100%;
		}
	}
	.right-main {
		flex: 1;
		width: 100%;
		margin: 10px;
    position: relative;
    .data-table{
      position: absolute;
      left: 0;
      top:0;height:100%;
      width: 100%
    }
	}
}
.td-sim {
	color: #1890ff;
	cursor: pointer;
}
.leftMenuScroll {
  position: absolute;
  left:0;top:0;width: 100%;
      height: 100%;
    }
</style>
