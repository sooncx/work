<template>
  <div class="main">
    <div class="title">{{hint}}</div>
    <div class="box">
      <div class="box1">
        <div
          class="box1-1"
          v-for="(item,index) in box1"
          :key="index"
        >
          <div class="inputTitle">
            <span>{{item.title}}</span>
          </div>
          <el-input
            v-if="item.type == 0"
            class="input"
            size="mini"
            v-model=item.value
            placeholder="请输入内容"
          >
          </el-input>
          <el-select
            v-else
            v-model=item.value
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in item.options"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="box2">
        <div class="tableBox">
          <el-table
            height="400"
            :data="data"
            :row-class-name="tableRowClassName"
            :cell-class-name="addClass"
            header-align="center"
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
              prop="returnData"
              align="center"
              label="还款日期"
              :formatter="Dataformat"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              min-width="100"
              prop="actualData"
              align="center"
              :formatter="Dataformat"
              label="实际还款日期"
            >
            </el-table-column>
            <el-table-column
              min-width="100"
              prop="isReturn"
              align="center"
              label="是否还款"
            >
            </el-table-column>
            <el-table-column
              prop="mark"
              align="center"
              min-width="200"
              label="备注"
            >
            </el-table-column>
          </el-table>

        </div>
        <!-- <div class="pagination">
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
        </div> -->
      </div>

    </div>
  </div>
</template>


<script>
export default {
  props: {},
  data() {
    return {
      hint: "注意：以下内容仅作为车主按揭挂靠还款提醒作用，请根据需求填写",
      box1: [
        { title: "借款日期：", value: null, type: 0 },
        { title: "计息方式：", value: null, type: 0 },
        {
          title: "还款方式：",
          value: null,
          type: 1,
          options: [
            {
              value: "设备1"
            },
            {
              value: "设备2"
            }
          ]
        },
        {
          title: "还款周期：",
          value: null,
          type: 1,
          options: [
            {
              value: "选项1"
            },
            {
              value: "选项2"
            }
          ]
        },
        {
          title: "挂靠日期：",
          value: null,
          type: 1,
          options: [
            {
              value: "选项1"
            },
            {
              value: "43234234234"
            },
            {
              value: "选项3"
            }
          ]
        }
      ],
      data: [
        {
          returnData: "2019-09-02",
          actualData: "2019-10-02",
          isReturn: "是",
          mark: "我是备注我是备注"
        },
        {
          returnData: "2019-10-02",
          actualData: "2019-11-02",
          isReturn: "否",
          mark: "我是备注我是备注"
        }
      ]
    };
  },
  mounted() {},

  methods: {
    //生成序号
    indexMethod(index) {
      return index + 1;
    },

    Dataformat(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue.split(" ")[0];
      }
      return "无";
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

  components: {},
  created() {}
};
</script>

<style lang="less" scoped>
/deep/ .el-table .warning-row {
  background: #ffffff;
}
/deep/ .el-table .success-row {
  background: #f0f0f0;
}
/deep/ .el-table th,
.el-table tr {
  background-color: #f0f0f0;
  border: none;
}
/deep/ .el-input,
/deep/ .el-input--mini,
/deep/ .el-input__inner,
/deep/ .el-textarea {
  width: 180px;
  height: 28px;
  font-size: 12px;
  * {
    border-radius: 0 !important;
  }
}
.main {
  width: 98%;
  height: 81%;
  left: 1%;
  top: 90px;
  position: fixed;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;
    background: rgba(238, 245, 255, 1);
    color: #2174eb;
  }
  .box {
    height: 96%;
    background-color: #fff;
    padding-top: 10px;
    .box1 {
      height: 18%;
      width: 100%;
      border-bottom: 1px solid #eeeeee;
    }
    .box2 {
      height: 82%;
      width: 100%;
    }
    .box1-1 {
      display: inline-block;
      margin: 8px 14px;
    }
  }

  .inputTitle {
    width: 100px;
    height: 24px;
    display: inline-block;
    span {
      display: flex;
      align-content: flex-end;
      justify-content: flex-end;
    }
  }
}
</style>

