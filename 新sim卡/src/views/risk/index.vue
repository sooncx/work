<template>
  <div class="customer-box">
    <div class="customer-itemBox">
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="space-around">
            <el-col :span="14">
              <el-select class="selectStyle" size="small" v-model="value" placeholder="套餐类型">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <input type="text" class="inputStyle" placeholder="ICCID号段" />
              <span class="line1"></span>
              <input type="text" class="inputStyle1" placeholder="ICCID号段" />
              <input type="text" class="inputStyle1" placeholder="订单号" />
              <input type="text" class="inputStyle1" placeholder="SIM卡号" />
            </el-col>
            <el-col :span="7" style="display:flex;">
              <el-button class="bs-btn2" @click="piLiang = true">批量搜索</el-button>
              <!-- <el-button class="bs-btn2">选择客户</el-button> -->
              <select-tree style="margin:0px 10px;" size="medium"></select-tree>
              <el-button type="primary" class="search">查询</el-button>
              <el-button type="primary" class="search">重置</el-button>
            </el-col>
            <el-col :span="3">
              <el-button title="批量设置" class="iconfont icon-fengkongguanli bgStyle" @click="batchForflow = true"></el-button>
              <el-button title="关停日期" class="iconfont icon-riqi1 bgStyle" @click="dialogVisible = true"></el-button>
              <el-button title="流量风控" class="iconfont icon-liuliang1 bgStyle" @click="riskForflow = true"></el-button>

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
        <el-table-column prop="caozuo" label="ICCID" width="180">
        </el-table-column>
        <el-table-column prop="kazu" label="SIM卡号">
        </el-table-column>
        <el-table-column prop="kehu" label="卡组" width="180">
        </el-table-column>
        <el-table-column prop="zhuangtai" label="所属客户" width="180">
        </el-table-column>
        <el-table-column prop="taocan" label="状态" width="180">
        </el-table-column>
        <el-table-column prop="beizhu" label="操作" width="180">
          <template slot-scope="scope">
            <div class="cus_box">
              <span class="tableBtn" @click="forFlow= true">流量设置</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="500">
      </el-pagination>
    </div>
    <!-- 关停日期 -->
    <el-dialog title="关停日期" :visible.sync="dialogVisible" width="300px">
      <div class="dialog-item">
        <span class="item-left">关停日期</span>
        <div class="item-right">
          <el-date-picker v-model="outTime" format="当月dd号" value-format="dd" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>

      </div>
      <div class="dialog-btn noBorderRadius" @click="commitRisk">
        保存
      </div>
    </el-dialog>
    <!-- 流量风控 -->
    <el-dialog title="流量风控" :visible.sync="riskForflow" width="300px">
      <div class="dialog-item">
        <span class="item-left">设置对象</span>
        <div class="item-right">
          <el-dropdown placement="bottom-start" @command="handleCommand" trigger="click">
            <div class="inputBg select">
              {{riskParams.simType}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="item.gprsType" v-for="(item,index) in simList" :key="index" v-if="item.gprsType">{{item.gprsType}}</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="dialog-item">
        <div class="item-left">关停流量≤</div>
        <input type="text" v-model="overGprs" class="inputBg item-last item-right" />
        <span>M</span>
      </div>
      <div class="dialog-item">
        <div class="item-left">预超流量≤</div>
        <input type="text" v-model="exceedGprs" class="inputBg item-last item-right" />
        <span>M</span>
      </div>
      <div class="dialog-btn noBorderRadius" @click="setGlobalRisk">
        保存
      </div>
    </el-dialog>
    <!-- 批量设置 -->
    <el-dialog title="批量设置" :visible.sync="batchForflow" width="320px">
      <div class="dialog-item">
        <div class="item-left">关停流量≤</div>
        <input type="text" v-model="overGprs" class="inputBg item-last item-right guanStyle" />
        <span>M</span>
      </div>
      <div class="dialog-item">
        <div class="item-left">预超流量≤</div>
        <input type="text" v-model="exceedGprs" class="inputBg item-last item-right" />
        <span>M</span>
      </div>
      <div class="dialog-btn noBorderRadius" @click="setGlobalRisk">
        保存
      </div>
    </el-dialog>
    <!-- 流量设置 -->
    <el-dialog title="流量设置" :visible.sync="forFlow" width="320px">
      <div class="dialog-item">
        <div class="item-left">关停流量≤</div>
        <input type="text" v-model="overGprs" class="inputBg item-last item-right guanStyle" />
        <span>M</span>
      </div>
      <div class="dialog-item">
        <div class="item-left">预超流量≤</div>
        <input type="text" v-model="exceedGprs" class="inputBg item-last item-right" />
        <span>M</span>
      </div>
      <div class="dialog-btn noBorderRadius" @click="setGlobalRisk">
        保存
      </div>
    </el-dialog>
    <!-- 批量搜索 -->
    <el-dialog title="批量搜索" :visible.sync="piLiang" width="40%">
      <textarea autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="请粘贴内容" width="100%" rows="20"></textarea>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small">开始搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import selectTree from "@/components/selectTree/";
import myTree from "@/components/myTree/";
export default {
  data() {
    return {
      riskParams: {
        exceedGprs: "",
        overGprs: "",
        simType: "请选择套餐类型",
        riskType: 2
      },
      outTime: "",
      dialogVisible: false,
      riskForflow: false,
      batchForflow: false,
      forFlow: false,
      piLiang: false,
      tableData: [
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
          label: "沉默"
        },
        {
          value: "选项2",
          label: "激活"
        }
      ]
    };
  },
  methods: {
    //  设置全局日期
    async commitRisk() {
      if (this.outTime == "") {
        alert("请选择时间");
      }
      let params = {
        fixDate: this.outTime,
        riskType: 1
      };

      let data = await this.$API.setGlobalRisk(params);

      this.dialogVisible = false;
      console.log(data);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleCommand(command) {
      this.riskParams.simType = command;
    },
    //  设置流量风控
    async setGlobalRisk() {
      let simType = this.riskParams.simType;
      if (this.riskParams.simType.indexOf("G") !== -1) {
        simType = parseInt(this.riskParams.simType.split("G")[0]) * 1024;
      } else {
        simType = this.riskParams.simType.split("M")[0];
      }
      let params = {
        exceedGprs: this.exceedGprs,
        overGprs: this.overGprs,
        simType: simType,
        riskType: this.riskParams.riskType
      };
      let data = await this.$API.setGlobalRisk(params);
      console.log(data);
    }
  },
  created() {},
  computed: {
    simList() {
      return this.$store.state.simList;
    },
    exceedGprs: {
      set: function(value) {
        this.riskParams.exceedGprs = value;
      },
      get: function() {
        return this.riskParams.exceedGprs == ""
          ? "1"
          : this.riskParams.exceedGprs.replace(/[^0-9]+/g, "");
      }
    },
    overGprs: {
      set: function(value) {
        this.riskParams.overGprs = value;
      },
      get: function() {
        return this.riskParams.overGprs == ""
          ? "1"
          : this.riskParams.overGprs.replace(/[^0-9]+/g, "");
      }
    }
  },
    components: {
    selectTree,
    myTree
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/mixin.scss";
.customer-box {
  background: #fff;
  padding: 10px;
  margin: 17px;
  height: calc(100% - 34px);
  display: flex;
  flex-direction: column;
  .customer-itemBox {
    background: #fff;
    .search {
      // margin-left: -84px;
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
      background: #f3f7fb;
      border-radius: 0;
      border: none;
    }
  }

  .inputStyle {
    background: rgba(243, 247, 251, 1);
    height: 20px;
    margin: 0px 5px 0 10px;
    padding: 5px;
    border: none;
  }
  .inputStyle::-webkit-input-placeholder {
    color: #ddd;
  }
  .inputStyle1 {
    background: rgba(243, 247, 251, 1);
    height: 20px;
    margin: 0px 10px 0 5px;
    padding: 5px;
    border: none;
  }
  .inputStyle1::-webkit-input-placeholder {
    color: #ddd;
  }
  .line1 {
    border-top: 3px solid #ddd;
    display: inline-block;
    width: 20px;
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
  .bgStyle {
    background: rgba(228, 238, 255, 1);
    color: #4b88f6;
    border: none;
    border-radius: 0;
    height: 30px;
    line-height: 7px;
  }
  .tableBtn {
    color: #4b88f6;
    cursor: pointer;
  }
  .dialog-item {
    display: flex;
    align-items: center;
    margin: 0 0 25px 0px;
    // &:nth-child(3) {
    //   .item-right {
    //     margin-right: 10px;
    //     width: 150px;
    //   }
    // }
    .item-last {
      margin-right: 10px;
      width: 150px !important;
    }
    &:first-child {
      margin: 0 0 20px 0;
      // padding: 20px 0;
      .item-right {
        font-weight: Bold;
        color: #1c5ed6;
      }
    }
    .item-left {
      width: 80px;
      .el-radio__label {
        font-size: 12px;
      }
    }
    .item-right {
      margin-left: 10px;
      width: 160px;

      .select {
        height: 30px;
        line-height: 30px;
        width: 150px;
        color: #bdc6d0;
      }
      .el-date-editor.el-input {
        width: auto;
      }
      .el-input__inner {
        padding-left: 30px;
        height: 30px;
        width: 160px;
        border-radius: 0;
        @extend .inputBg;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
  .dialog-btn {
    width: 90px;
    cursor: pointer;
    height: 30px;
    background: #1c5ed6;
    border-radius: 3px;
    line-height: 30px;
    margin: 20px auto;
    color: #fff;
    text-align: center;
  }
  .guanStyle {
    color: #000 !important;
    font-weight: normal !important;
  }
  .noBorderRadius {
    border-radius: 0;
  }
  /deep/ .select-btn.medium {
    height: 28px;
    line-height: 28px;
    }
}
</style>

