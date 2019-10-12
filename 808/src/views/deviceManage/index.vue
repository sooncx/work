<template>
  <div class="page-wrap flex-page">
    <div class="form-chunk">
      <formFilter
        v-model="filterData"
        @onSearch="onSearch"
        @batchDel="delShow"
      />
    </div>
    <div class="handler-btns">
      <el-button
        icon="el-icon-remove-outline"
        type="primary"
        size="mini"
        @click.native="delShow"
      >批量删除</el-button>
      <el-button
        icon="el-icon-circle-plus-outline"
        type="primary"
        size="mini"
        @click.native="toAddNew"
      >新增</el-button>
    </div>
    <div class="table-chunk">
      <dataTable
        class="dataTable-box"
        :data="displayTableData"
        @setIdList="setIdList"
      />
    </div>
    <!-- <div class="pagination-box">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
      />
		</div>-->
  </div>
</template>
<script>
import formFilter from "./components/formFilter";
import dataTable from "./components/dataTable";
import { getTerminalList, delList } from "@/api/device";
export default {
  name: "DeviceManageIndex",
  components: { formFilter, dataTable },
  data() {
    const defaultFilterDta = {
      manufacturerName: "",
      state: "",
      terminalType: ""
    };
    return {
      defaultFilterDta: defaultFilterDta,
      filterData: { ...defaultFilterDta },
      displayTableData: [],
      selectIds: []
    };
  },
  created() {
    this.getTerminalList();
  },
  activated() {
    if (this.$route.params && this.$route.params.needRefresh) {
      // 如果需要刷新 新增成功后返回
      this.getTerminalList();
    }
  },
  methods: {
    resetFilterData() {
      this.filterData = { ...this.defaultFilterDta };
    },
    onSearch() {
      this.getTerminalList();
    },
    getTerminalList() {
      getTerminalList({ ...this.filterData }).then(rst => {
        if (rst.code === 0) {
          rst.data.map((item, index) => {
            item.locationType = JSON.parse(item.locationType || "[]");
            item.function = JSON.parse(item.function || "[]");
            item.useType = JSON.parse(item.useType || "[]");
            item["_index"] = index + 1;
          });
          this.displayTableData = rst.data;
        }
      });
    },
    setIdList(arr) {
      this.selectIds = arr;
    },
    delShow() {
      var list = this.selectIds;
      if (list.length !== 0) {
        this.$confirm("是否删除选中设备？", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认删除",
          cancelButtonText: "取消删除"
        })
          .then(() => {
            this.confirmBatchDel({ terminalIds: list.join(",") });
          })
          .catch(action => {});
      } else {
        this.$message({
          showClose: true,
          message: "请先勾选要删除的设备",
          type: "warning"
        });
      }
    },
    confirmBatchDel({ terminalIds }) {
      delList({ terminalIds })
        .then(res => {
          if (res.code === 0) {
            this.getTerminalList();
            this.isVisible = false;
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: "删除失败，" + res.msg,
              type: "warning"
            });
          }
        })
        .catch(error => {
          this.isLoading = false;
          console.log("error", error);
        });
    },
    toAddNew() {
      this.$router.push({ name: "DeviceManageAddNew" });
    }
  }
};
</script>
<style lang="scss" scoped>
.flex-page {
  display: flex;
  flex-direction: column;
  > .table-chunk {
    flex: 1;
    position: relative;
    > .dataTable-box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.pagination-box {
  text-align: center;
  padding: 10px 0;
}
.handler-btns {
  // padding-bottom: 10px;
  margin-bottom: 15px;
  // border-bottom:1px solid #dfe6ec
}
</style>

