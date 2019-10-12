<template>
  <div class="log-index-page">
    <reportFormFilter
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
        size="mini"
        class="p-table-style el-table-tart"
        :data="tableData"
        style="width: 100%"
        height="100%"
        border
      >
        <el-table-column
          prop="_index"
          label="序号"
          width="50"
        />
        <el-table-column
          prop="checkNo"
          label="检测编号"
          max-width="200"
        />
        <el-table-column
          prop="manufacturerName"
          label="厂商"
          width="200"
        />
        <el-table-column
          prop="terminalType"
          label="终端型号"
          width="120"
        >
          <template slot-scope="scope">
            <div
              class="terminalType-col"
              title="详情"
              @click="doDetil( scope.row)"
            >{{ scope.row.terminalType }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="terminalNo"
          label="终端编号"
          width="80"
        />
        <el-table-column
          prop="terminalNumber"
          label="终端ID"
          width="180"
        />
        <el-table-column
          prop="num"
          label="检测轮次"
          width="80"
        />
        <el-table-column
          prop="checkTime"
          label="检测时间"
          width="160"
        />
        <el-table-column
          label="检测结果"
          align="center"
          width="80"
          style="position:relative"
        >
          <!-- <template slot-scope="scope">
            <div slot="reference" @click="handle(scope.row.checkLogId)">
              <span v-if="scope.row.checkResult">{{scope.row.checkResult}}</span>
              <span v-else>正在检测</span>
            </div>
          </template> -->

          <template slot-scope="scope">
            <el-popover
              placement="left-start"
              width="0"
              trigger="click"
            >
              <div class="checkResultBox">
                详细
                <div
                  class="checkResultBox2"
                  v-for="(item,index) in checkList"
                  :key="index"
                >
                  <span class="checkBoxleft">{{item.title}}</span>
                  <span class="checkBoxright">{{item.tag}}</span>
                </div>
              </div>
              <div
                slot="reference"
                @click="handle(scope.row.checkLogId)"
              >
                <span v-if="scope.row.checkResult">{{scope.row.checkResult}}</span>
                <span v-else>正在检测</span>
              </div>
            </el-popover>

          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="详细报告"
          width="100"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="toDetail(scope.row)"
            >查看报告</el-button>
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
import { searchReport, fuzzySearchReport, getCheckResult } from "@/api/log";
import reportFormFilter from "./components/reportFormFilter";

export default {
  name: "LogReport",
  components: {
    reportFormFilter
  },
  data() {
    return {
      passNum: null,
      unpassNum: null,
      checkResult: [],
      formData: {
        manufacturerName: "",
        terminalType: "",
        terminalNo: "",
        state: ""
      },
      dataTotal: 0,
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      tableStatus: "",
      payLoads: "", // 记住当前表格的滚动条位置

      allData: null,
      local: [
        { title: "定位精度", tag: "未检测" },
        { title: "位置信息", tag: "未检测" }
      ],
      other: [{ title: "盲区补传", tag: "未检测" }],
      alarm: [
        { title: "主动安全报警", tag: "未检测" },
        { title: "行驶状态报警", tag: "未检测" },
        { title: "进出区域", tag: "未检测" },
        { title: "路线偏离报警", tag: "未检测" },
        { title: "人工报警确认", tag: "未检测" },
        { title: "自动提醒", tag: "未检测" },
        { title: "禁行时段报警", tag: "未检测" }
      ],
      device: [
        { title: "人机交互", tag: "未检测" },
        { title: "使用前锁定", tag: "未检测" },
        { title: "终端管理", tag: "未检测" },
        { title: "自检", tag: "未检测" },
        { title: "终端存储及安全", tag: "未检测" },
        { title: "多中心接入", tag: "未检测" },
        { title: "电话回拨", tag: "未检测" },
        { title: "远程升级", tag: "未检测" }
      ],
      message: [
        { title: "CAN总线", tag: "未检测" },
        { title: "车辆载货状态", tag: "未检测" },
        { title: "驾驶员身份识别，电子运单", tag: "未检测" },
        { title: "终端控制与信号采集", tag: "未检测" },
        { title: "收费结算数据", tag: "未检测" },
        { title: "ETC功能", tag: "未检测" },
        { title: "行驶记录", tag: "未检测" },
        { title: "终端休眠", tag: "未检测" }
      ],
      media: [
        { title: "存储多媒体数据检索", tag: "未检测" },
        { title: "终端录像", tag: "未检测" },
        { title: "终端拍照", tag: "未检测" }
      ],
      checkList: []
    };
  },
  created() {
    this.getSearchAll();
  },
  activated() {
    this.payLoads = new Date().getTime();
  },
  methods: {
    changeMeg(data) {
      //定位  "定位精度"---19  "位置信息"---24

      //"盲区补传"---23

      //警示  "主动安全报警"---4  "行驶状态报警"---5 "进出区域"---6  "路线偏离报警"---7 "人工报警确认"---8
      //"自动提醒"---9  "禁行时段报警"---27

      //设备操作 "人机交互"---10   "使用前锁定"---11   "终端管理"---12   "自检"---13   "终端存储及安全"---30
      // "多中心接入"---20   "电话回拨"---22   "远程升级"---25

      //信息采集  "CAN总线"---14  "车辆载货状态"---15  "驾驶员身份识别，电子运单"---17  "终端控制与信号采集"---18
      // "收费结算数据"---28  "ETC功能"---29  "行驶记录"---21  "终端休眠"---26

      //多媒体  "存储多媒体数据检索"---1  "终端录像"---2  "终端拍照"---3
      //notPassNum: "8,9,27", passNum: "4,5,6",

      // let local = [19, 24]; //定位
      // let other = [23]; //盲区补传
      // let alarm = [4, 5, 6, 7, 8, 9, 27]; //警示
      // let device = [10, 11, 12, 13, 30, 20, 22, 25]; // 设备操作
      // let message = [14, 15, 17, 18, 28, 29, 21, 26]; //信息采集
      // let media = [1, 2, 3]; //多媒体
      var flag = null;
      let pass = [],
        unpass = [];

      if (!data.passNum && !data.notPassNum) {
        flag = "返回数据空";
        pass = [];
        unpass = [];
      } else {
        pass = data.passNum.split(",");
        unpass = data.notPassNum.split(",");
      }
      // console.log("pass:" + pass);
      // console.log("unpass:" + unpass);

      if (pass[0] == 19 || pass[0] == 24) {
        flag = "定位";
      } else if (pass[0] == 23) {
        flag = "盲区补传";
      } else if (
        pass[0] == 4 ||
        pass[0] == 5 ||
        pass[0] == 6 ||
        pass[0] == 7 ||
        pass[0] == 8 ||
        pass[0] == 9 ||
        pass[0] == 27
      ) {
        flag = "警示";
      } else if (
        pass[0] == 10 ||
        pass[0] == 11 ||
        pass[0] == 12 ||
        pass[0] == 13 ||
        pass[0] == 30 ||
        pass[0] == 20 ||
        pass[0] == 22 ||
        pass[0] == 25
      ) {
        flag = "设备操作";
      } else if (
        pass[0] == 14 ||
        pass[0] == 15 ||
        pass[0] == 17 ||
        pass[0] == 18 ||
        pass[0] == 28 ||
        pass[0] == 29 ||
        pass[0] == 21 ||
        pass[0] == 26
      ) {
        flag = "信息采集";
      } else if (pass[0] == 1 || pass[0] == 2 || pass[0] == 3) {
        flag = "多媒体";
      } else if (
        (!pass || pass[0] == "" || pass[0] == null) &&
        (!unpass || unpass[0] == "" || unpass == null)
      ) {
        flag = "返回数据空";
      }
      // for (let i = 0; i < unpass.length; i++) {
      if (unpass[0] == 19 || unpass[0] == 24) {
        flag = "定位";
      } else if (unpass[0] == 23) {
        flag = "盲区补传";
      } else if (
        unpass[0] == 4 ||
        unpass[0] == 5 ||
        unpass[0] == 6 ||
        unpass[0] == 7 ||
        unpass[0] == 8 ||
        unpass[0] == 9 ||
        unpass[0] == 27
      ) {
        flag = "警示";
      } else if (
        unpass[0] == 10 ||
        unpass[0] == 11 ||
        unpass[0] == 12 ||
        unpass[0] == 13 ||
        unpass[0] == 30 ||
        unpass[0] == 20 ||
        unpass[0] == 22 ||
        unpass[0] == 25
      ) {
        flag = "设备操作";
      } else if (
        unpass[0] == 14 ||
        unpass[0] == 15 ||
        unpass[0] == 17 ||
        unpass[0] == 18 ||
        unpass[0] == 28 ||
        unpass[0] == 29 ||
        unpass[0] == 21 ||
        unpass[0] == 26
      ) {
        flag = "信息采集";
      } else if (unpass[0] == 1 || unpass[0] == 2 || unpass[0] == 3) {
        flag = "多媒体";
      } else if (
        (!pass || pass[0] == "" || pass[0] == null) &&
        (!unpass || unpass[0] == "" || unpass == null)
      ) {
        flag = "返回数据空";
      }
      // console.log("flag:" + flag);
      if (flag == "定位") {
        let mylocal = [];
        this.local.forEach(function(e, i) {
          mylocal.push(e);
          mylocal[i].tag = "未检测";
        });
        for (let i = 0; i < pass.length; i++) {
          if (pass[i] == 19) {
            mylocal[0].tag = "通过";
          } else if (pass[i] == 24) {
            mylocal[1].tag = "通过";
          }
        }
        for (let i = 0; i < unpass.length; i++) {
          if (unpass[i] == 19) {
            mylocal[0].tag = "不通过";
          } else if (unpass[i] == 24) {
            mylocal[1].tag = "不通过";
          }
        }
        this.checkList = mylocal;
      } else if (flag == "盲区补传") {
        let myother = [];
        this.other.forEach(function(e, i) {
          myother.push(e);
          myother[i].tag = "未检测";
        });
        for (let i = 0; i < pass.length; i++) {
          if (pass[i] == 23) {
            myother[0].tag = "通过";
          }
        }
        for (let i = 0; i < unpass.length; i++) {
          if (unpass[i] == 23) {
            myother[0].tag = "不通过";
          }
        }
        this.checkList = myother;
      } else if (flag == "警示") {
        let myalarm = [];
        this.alarm.forEach(function(e, i) {
          myalarm.push(e);
          myalarm[i].tag = "未检测";
        });
        for (let i = 0; i < pass.length; i++) {
          if (pass[i] == 4) {
            myalarm[0].tag = "通过";
          } else if (pass[i] == 5) {
            myalarm[1].tag = "通过";
          } else if (pass[i] == 6) {
            myalarm[2].tag = "通过";
          } else if (pass[i] == 7) {
            myalarm[3].tag = "通过";
          } else if (pass[i] == 8) {
            myalarm[4].tag = "通过";
          } else if (pass[i] == 9) {
            myalarm[5].tag = "通过";
          } else if (pass[i] == 27) {
            myalarm[6].tag = "通过";
          }
        }
        for (let i = 0; i < unpass.length; i++) {
          if (unpass[i] == 4) {
            myalarm[0].tag = "不通过";
          } else if (unpass[i] == 5) {
            myalarm[1].tag = "不通过";
          } else if (unpass[i] == 6) {
            myalarm[2].tag = "不通过";
          } else if (unpass[i] == 7) {
            myalarm[3].tag = "不通过";
          } else if (unpass[i] == 8) {
            myalarm[4].tag = "不通过";
          } else if (unpass[i] == 9) {
            myalarm[5].tag = "不通过";
          } else if (unpass[i] == 27) {
            myalarm[6].tag = "不通过";
          }
        }
        this.checkList = myalarm;
      } else if (flag == "设备操作") {
        let mydevice = [];
        this.device.forEach(function(e, i) {
          mydevice.push(e);
          mydevice[i].tag = "未检测";
        });
        for (let i = 0; i < pass.length; i++) {
          if (pass[i] == 10) {
            mydevice[0].tag = "通过";
          } else if (pass[i] == 11) {
            mydevice[1].tag = "通过";
          } else if (pass[i] == 12) {
            mydevice[2].tag = "通过";
          } else if (pass[i] == 13) {
            mydevice[3].tag = "通过";
          } else if (pass[i] == 30) {
            mydevice[4].tag = "通过";
          } else if (pass[i] == 20) {
            mydevice[5].tag = "通过";
          } else if (pass[i] == 22) {
            mydevice[6].tag = "通过";
          } else if (pass[i] == 25) {
            mydevice[7].tag = "通过";
          }
        }
        for (let i = 0; i < unpass.length; i++) {
          if (unpass[i] == 10) {
            mydevice[0].tag = "不通过";
          } else if (unpass[i] == 11) {
            mydevice[1].tag = "不通过";
          } else if (unpass[i] == 12) {
            mydevice[2].tag = "不通过";
          } else if (unpass[i] == 13) {
            mydevice[3].tag = "不通过";
          } else if (unpass[i] == 30) {
            mydevice[4].tag = "不通过";
          } else if (unpass[i] == 20) {
            mydevice[5].tag = "不通过";
          } else if (unpass[i] == 22) {
            mydevice[6].tag = "不通过";
          } else if (unpass[i] == 25) {
            mydevice[7].tag = "不通过";
          }
        }
        this.checkList = mydevice;
      } else if (flag == "信息采集") {
        let mymessage = [];
        this.message.forEach(function(e, i) {
          mymessage.push(e);
          mymessage[i].tag = "未检测";
        });
        for (let i = 0; i < pass.length; i++) {
          if (pass[i] == 14) {
            mymessage[0].tag = "通过";
          } else if (pass[i] == 15) {
            mymessage[1].tag = "通过";
          } else if (pass[i] == 17) {
            mymessage[2].tag = "通过";
          } else if (pass[i] == 18) {
            mymessage[3].tag = "通过";
          } else if (pass[i] == 28) {
            mymessage[4].tag = "通过";
          } else if (pass[i] == 29) {
            mymessage[5].tag = "通过";
          } else if (pass[i] == 21) {
            mymessage[6].tag = "通过";
          } else if (pass[i] == 26) {
            mymessage[7].tag = "通过";
          }
        }
        for (let i = 0; i < unpass.length; i++) {
          if (unpass[i] == 14) {
            mymessage[0].tag = "不通过";
          } else if (unpass[i] == 15) {
            mymessage[1].tag = "不通过";
          } else if (unpass[i] == 17) {
            mymessage[2].tag = "不通过";
          } else if (unpass[i] == 18) {
            mymessage[3].tag = "不通过";
          } else if (unpass[i] == 28) {
            mymessage[4].tag = "不通过";
          } else if (unpass[i] == 29) {
            mymessage[5].tag = "不通过";
          } else if (unpass[i] == 21) {
            mymessage[6].tag = "不通过";
          } else if (unpass[i] == 26) {
            mymessage[7].tag = "不通过";
          }
        }
        this.checkList = mymessage;
      } else if (flag == "多媒体") {
        let mymedia = [];
        this.media.forEach(function(e, i) {
          mymedia.push(e);
          mymedia[i].tag = "未检测";
        });
        for (let i = 0; i < pass.length; i++) {
          if (pass[i] == 1) {
            mymedia[0].tag = "通过";
          } else if (pass[i] == 2) {
            mymedia[1].tag = "通过";
          } else if (pass[i] == 3) {
            mymedia[2].tag = "通过";
          }
        }
        for (let i = 0; i < unpass.length; i++) {
          console.log("xxxx:" + unpass[i] == 3);
          if (unpass[i] == 1) {
            mymedia[0].tag = "不通过";
          } else if (unpass[i] == 2) {
            mymedia[1].tag = "不通过";
          } else if (unpass[i] == 3) {
            mymedia[2].tag = "不通过";
          }
        }
        this.checkList = mymedia;
      } else if (flag == "返回数据空") {
        this.checkList = [{ title: "待检测", tag: "" }];
      }

      // console.log("checklist:" + JSON.stringify(this.checkList));
    },
    handle(data) {
      var params = Object.assign({
        checkLogId: data
      });
      getCheckResult(params)
        .then(rst => {
          this.changeMeg(rst.data);
          this.allData = rst.data;
          console.log("结果:" + JSON.stringify(this.allData));
        })
        .catch(e => {});
    },
    // handle(row) {
    //   var params = Object.assign({
    //     checkLogId: row.checkLogId
    //   });
    //   getCheckResult(params)
    //     .then(rst => {
    //       this.checkResult = rst.data;
    //       console.log("结果:" + JSON.stringify(rst.data));
    //     })
    //     .catch(e => {});
    //   // console.log("row:" + JSON.stringify(row.checkLogId));
    //   // console.log("column:" + JSON.stringify(column));
    //   // console.log("event:" + JSON.stringify(event));
    //   // console.log("cell:" + JSON.stringify(cell));
    // },
    doDetil(itemData) {
      console.log("test:" + JSON.stringify(itemData));
      this.$router.push({
        name: "DeviceManageAddNew",
        params: {
          data: itemData
        }
      });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.getSearchAll();
    },
    onSearch(formData) {
      this.currentPage = 1;
      this.formData = formData;
      this.getSearchAll();
    },
    getSearchAll() {
      this.tableStatus = "loading";
      var params = Object.assign(
        {
          currentPage: this.currentPage,
          itemNum: this.pageSize
        },
        this.formData
      );
      searchReport(params)
        .then(rst => {
          if (rst.code === 0) {
            if (rst.data && rst.data.length > 0) {
              var indexStart = (this.currentPage - 1) * this.pageSize;
              rst.data.map((item, index) => {
                item["_index"] = index + 1 + indexStart;
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
          if (this.$refs["table"]) {
            this.$refs["table"].$el.querySelector(
              ".el-table__body-wrapper"
            ).scrollTop = 0;
          }
        })
        .catch(e => {
          this.tableStatus = "error";
        });
    },
    toDetail(data) {
      this.$router.push({
        name: "LogDetail",
        query: {
          logData: JSON.stringify({ checkLogId: data.checkLogId })
        }
      });
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
}
.terminalType-col {
  color: #1890ff;
  cursor: pointer;
}
.reference-p {
  // color: #1890ff;
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
.checkResultBox {
  min-width: 250px;
  padding: 8px;
  position: absolute;
  right: 1px;
  top: 0px;
  background-color: #fff;
  box-shadow: -1px 2px 10px -4px #333333;
  border-radius: 3px;
  div {
    padding-bottom: 3px;
    padding-top: 10px;
    .checkBoxleft {
    }
    .checkBoxright {
      position: absolute;
      left: 195px;
    }
  }
}
</style>
