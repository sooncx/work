<template>
  <div class="dataTable-div">
    <el-table
      v-if="data"
      size="mini"
      class="p-table-style"
      :data="data"
      height="100%"
      border
      style="width:100%"
      @selection-change="SelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
      />
      <el-table-column
        prop="_index"
        label="序号"
        align="center"
        width="100"
      />
      <el-table-column
        prop="terminalType"
        label="终端型号"
        width="180"
      >
        <template slot-scope="scope">
          <div
            class="terminalType-col"
            title="进入编辑"
            @click="doDetil( scope.row)"
          >{{ scope.row.terminalType }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manufacturerName"
        label="厂商"
        width="180"
      />
      <el-table-column label="定位类型">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.locationType">{{ item|locationTypeFilter }}{{ index!==scope.row.locationType.length-1?'，':'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本"
      />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div>{{ scope.row.state |stateFilter }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: 1
    }
  },
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    doDetil(itemData) {
      console.log("what:" + JSON.stringify(itemData));
      this.$router.push({
        name: "DeviceManageAddNew",
        params: {
          data: itemData
        }
      });
    },
    SelectionChange(arr) {
      var idList = [];
      arr.forEach(item => {
        idList.push(item.id);
      });
      this.$emit("setIdList", idList);
    }
  }
};
</script>
<style lang="scss" scoped>
.dataTable-div {
  width: 100%;
}
.terminalType-col {
  color: #1890ff;
  cursor: pointer;
}
</style>
