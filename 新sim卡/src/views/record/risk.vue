<template>
  <div class="customer-box">
    <div class="customer-itemBox">
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-select class="selectStyle" size="small" v-model="value" placeholder="风控类型">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker class="timeSelectStyle" size="small" v-model="value6" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </el-col>
            <el-col :span="14">
              <el-button type="primary" class="search">查询</el-button>
              <el-button class="bs-btn2" @click.native="setDay(0)">今天</el-button>
              <el-button class="bs-btn2" @click.native="setDay(1)">昨天</el-button>
              <el-button class="bs-btn2" @click.native="setDay(3)">近三天</el-button>
              <el-button class="bs-btn2" @click.native="setDay(7)">近七天</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="line">

    </div>
    <div class="filter-table-wrap">
      <el-table :data="tableData" stripe style="width: 100%" height="calc(100% - 70px)">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column prop="caozuo" label="操作类型" width="180">
        </el-table-column>
        <el-table-column prop="kazu" label="卡组">
        </el-table-column>
        <el-table-column prop="kehu" label="所属客户" width="180">
        </el-table-column>
        <el-table-column prop="zhuangtai" label="状态" width="180">
        </el-table-column>
        <el-table-column prop="taocan" label="套餐类型" width="180">
        </el-table-column>
        <el-table-column prop="beizhu" label="备注" width="180">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="500">
      </el-pagination>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {}
          },
          {
            text: "近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近七天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData: [
        {
          caozuo: "22",
          kazu: "22",
          kehu: "222",
          zhuangtai: "22",
          taocan: "22",
          beizhu: "33"
        },
        {
          caozuo: "22",
          kazu: "22",
          kehu: "222",
          zhuangtai: "22",
          taocan: "22",
          beizhu: "33"
        }
      ], // 用户表格数据
      value: "",
      value6: "",
      currentPage: 1,
      options: [
        {
          value: "选项1",
          label: "流量"
        },
        {
          value: "选项2",
          label: "日期"
        }
      ]
    };
  },
  methods: {
    setDay(day) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
      this.value6 = [start,end];
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
    //   async getNextUsers() {
    //    let user = await this.$API.getNextUserInfo({
    //     userId: this.$store.state.LOGINUSER.id
    //   });
    //   this.tableData = user.data
    // },
  },
  created() {
    // this.getNextUsers()
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/mixin.scss";
.customer-box {
  margin: 17px;
  height: calc(100% - 34px);
  display: flex;
  flex-direction: column;
  .customer-itemBox {
    // padding: 19px 26px;
    background: #fff;

    input {
      width: 80%;
      height: 30px;
    }
    .search {
      margin-left: -84px;
      height: 30px;
      line-height: 7px;
      border-radius: 0;
      background: #4b88f6;
      font-size: 12px;
    }
  }
  .footer-box {
    margin-top: 12px;
    height: calc(100% - 150px);
    padding: 10px 7px;
    background: #fff;
    .table-warp {
      margin-top: 10px;
      height: calc(100% - 30px);
    }
    .footer-title {
      display: flex;
      justify-content: space-between;
      .footer-f {
        color: #58616c;
        font-weight: bold;
        font-size: 16px;
      }
      .risk-set-icon {
        margin-right: 20px;
        display: flex;
        align-items: center;
        span {
          font-size: 12px;
          font-weight: bold;
          margin-left: 8px;
        }
        i {
          font-size: 18px;
          color: #899ab9;
        }
      }
    }
  }
  .customer-icon-box {
    display: flex;
    justify-content: space-evenly;
    .customer-icon {
      width: 70px;
      height: 70px;
      cursor: pointer;
      color: #1c5ed6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      background: #fff;
      box-shadow: 0px 2px 4px 0px rgba(45, 67, 234, 0.1);
      border-radius: 50%;
      i {
        font-size: 14px;
      }
      span {
        margin-top: 8px;
        font-weight: bold;
      }
    }
  }
  .filter-table-wrap {
    // margin:20px 20px 0px 20px;
    border: 1px solid #ebf0f6;
    flex: 1;
    // position: absolute;
    // top: 84px;
    // left: 20px;
    // right: 20px;
    // bottom: 20px;
    .cus_box {
      display: flex;
      justify-content: center;
      .cus_btn {
        @include btn1;
        border-radius: 50px;
        font-size: 12px;
        width: 50px;
        margin: 0 5px;
      }
    }

  }
  .line {
    border-bottom: 1px solid #eff3f7;
    margin: 20px 0px;
  }
  .customer-right {
    background: #fff;
    flex: 1;
    min-width: 900px;
    position: relative;
  }
  .selectStyle {
    /deep/ .el-input__inner {
      // height: 30px;
      background: #f3f7fb;
      border-radius: 0;
      border: none;
    }
  }
  .timeSelectStyle {
    //  height: 30px;
    background: #f3f7fb;
    border-radius: 0;
    border: none;
  }
  .timeSelectStyle {
    /deep/.el-range-editor--small .el-range-input {
      background: #f3f7fb;
    }
  }
  .bs-btn2 {
    background: #fff;
    border: 1px solid #4b88f6;
    color: #4b88f6;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    height: 30px;
    line-height: 7px;
    border-radius: 0;
  }
}
</style>



