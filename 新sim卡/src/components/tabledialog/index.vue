<template>
  <div
    v-main
    class="main"
    @click.stop
  >
    <button
      @click="exportChoose()"
      class="exportBtn"
    >导出</button>
    <i
      class="iconfont icon-close"
      style="font-size:20px;position: absolute; right:5px; top:5px;color: white;cursor: pointer;"
      @click="sendMsg"
    ></i>
    <ul class="nav">
      <li
        :class="menuIndex == 1 ?'active' : '' "
        @click='menuShow(1)'
      >
        <p class="btns">{{tableDataAMsg+'('+this.countA+')'}}</p>
      </li>
      <li
        :class="menuIndex == 2 ?'active' : '' "
        @click='menuShow(2)'
      >
        <p class="btns">{{tableDataBMsg+'('+this.countB+')'}}</p>
      </li>
    </ul>
    <div>
      <div class="tableBox">
        <el-table
          :data="tableData"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            type="index"
            :index="indexMethod"
            alien="center"
            label="序号"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="iccid"
            align="center"
            label="ICCID"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="simCard"
            align="center"
            label="SIM卡号"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            min-width="40"
            prop="simType"
            align="center"
            :formatter="simTypeFromat"
            label="套餐类型"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="surplusGprs"
            align="center"
            :formatter="formatterSurplusGprs"
            label="剩余流量"
          >
          </el-table-column>
          <el-table-column
            prop="expireTime"
            align="center"
            width="100"
            :formatter="dateFormat"
            label="过期日期"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="simState"
            align="center"
            :formatter="fomatterSimstate"
            label="sim卡状态"
          >
          </el-table-column>

          <!-- <el-table-column
            label="操作"
            fixed="right"
            width="100"
          >
            <template>
              <div class="cus_box">
                <i
                  class="iconfont icon-more"
                  style="font-size:12px"
                ></i>
                <span>叠加包</span>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div
        class="pagination"
        v-if="paginationShow"
      >
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[50,100]"
          :page-size="pageSize"
          @current-change="currentChange"
          layout="total, prev, pager, next, jumper"
          :total=this.count
        >
        </el-pagination>
      </div>
    </div>
  </div>

</template>


<script>
export default {
  props: [
    "tag",
    "expireSimGprsF",
    "expireSimCardsF",
    "predictSimGprsF",
    "predictSimCardsF",
    "peringatanVisibleF"
  ],
  data() {
    return {
      paginationShow: true,
      flag: this.tag,
      countA: 0,
      countB: 0,
      count: 0,
      menuIndex: 0,
      total: 100,
      currentPage: 1,
      pageSize: 50,
      exportParams: null, //导出数据
      searchSimListByInventoryParams: null,
      tableData: [],
      tableDataAMsg: null,
      tableDataBMsg: null,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      peringatanVisible: false
    };
  },
  //监听父组件传递的tag值，该值用于控制table弹窗的显示/关闭
  watch: {
    tag: {
      handler(newValue, oldValue) {
        this.flag = newValue;
        if (newValue === 1) {
          this.getRiskMes(1, 4);
          //控制弹窗默认显示左/右表 1为左，2为右
          this.menuIndex = 1;
          //tag为1，弹窗显示预超流量卡信息
          this.tableData = this.tableData4;
          this.count = this.predictSimGprsF;
          this.countA = this.predictSimGprsF;
          this.countB = this.expireSimGprsF;
          this.tableDataAMsg = "预超流量";
          this.tableDataBMsg = "已超流量";
          //tag为2，弹窗显示预过期卡信息
        } else if (newValue === 2) {
          this.getRiskMes(1, 2);
          //控制弹窗默认显示左/右表
          this.menuIndex = 1;
          this.tableData = this.tableData2;
          this.count = this.predictSimCardsF;
          this.countA = this.predictSimCardsF;
          this.countB = this.expireSimCardsF;
          this.tableDataAMsg = "预过期卡";
          this.tableDataBMsg = "已过期卡";
        }
      },
      immediate: true
    }
  },
  components: {},
  //实现sim卡表弹窗鼠标拖动
  directives: {
    main(el, bindings) {
      el.onmousedown = function(e) {
        // 获取鼠标在弹窗中的位置,注意减去div的宽和高的各一半
        let mouseX = e.clientX - el.offsetLeft - 564;
        let mouseY = e.clientY - el.offsetTop - 329;
        document.onmousemove = function(e) {
          el.style.left = e.clientX - mouseX + "px";
          el.style.top = e.clientY - mouseY + "px";
        };
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null;
        };
      };
    }
  },
  created() {
    //this.getRiskManage();
  },
  methods: {
    //关闭按钮，将改变后的peringatanVisible值传递给父组件
    sendMsg() {
      this.peringatanVisible = false;
      this.$emit("func", this.peringatanVisible);
    },
    //导出4种类型的sim卡
    exportChoose() {
      if (this.flag === 1) {
        if (this.menuIndex === 1) {
          this.exportSim(4);
        } else if (this.menuIndex === 2) {
          this.exportSim(3);
        }
      } else if (this.flag === 2) {
        if (this.menuIndex === 1) {
          this.exportSim(2);
        } else if (this.menuIndex === 2) {
          this.exportSim(1);
        }
      }
    },
    //日期格式截断，只显示年月日
    dateFormat(expireTime) {
      if (expireTime.expireTime) {
        let str = expireTime.expireTime;
        return str.substr(0, str.indexOf("T"));
      } else {
        return "暂无数据";
      }
    },
    //sim卡套餐格式转换
    simTypeFromat(simtype) {
      if (simtype.simType) {
        if (simtype.simType >= 1024) {
          return (simtype.simType % 1024) + "G";
        } else if (simtype.simType < 1024) {
          return simtype.simType + "M";
        }
      } else {
        return "暂无数据";
      }
    },
    //sim卡类型转换
    fomatterSimstate(simState) {
      if (simState.simState) {
        switch (simState.simState) {
          case 0:
            return "正常";
          case 1:
            return "正常";
          case 2:
            return "过期";
          case 3:
            return "销卡";
        }
      } else {
        return "暂无数据";
      }
    },
    //剩余流量类型转换
    formatterSurplusGprs(surplusGprs) {
      if (!surplusGprs.surplusGprs) return "0kb";
      return surplusGprs.surplusGprs + "kb";
    },
    //生成序号
    indexMethod(index) {
      return index + 1;
    },
    //预/已超流量卡和预/以过期卡tab界面切换
    menuShow(index) {
      //用于控制底部分页器的刷新
      this.paginationShow = false;
      setTimeout(() => {
        this.paginationShow = true;
      }, 0);
      if (this.flag === 1) {
        if (index === 1) {
          this.tableData = this.tableData4;
          this.count = this.predictSimGprsF;
          this.getRiskMes(1, 4);
        } else if (index === 2) {
          this.tableData = this.tableData3;
          this.count = this.expireSimGprsF;
          this.getRiskMes(1, 3);
        }
      } else if (this.flag === 2) {
        if (index === 1) {
          this.tableData = this.tableData2;
          this.count = this.predictSimCardsF;
          this.getRiskMes(1, 2);
        } else if (index === 2) {
          this.tableData = this.tableData1;
          this.count = this.expireSimCardsF;
          this.getRiskMes(1, 1);
        }
      }
      this.menuIndex = index;
    },

    //进入页面初次加载4张表第一页数据
    getRiskManage() {
      for (let i = 1; i < 5; i++) {
        this.getRiskMes(1, i);
      }
    },
    //分页按钮对应触发事件，val为当前currentPage
    currentChange(val) {
      console.log("cx:" + val);
      //flag判断左右表格，传入对应currentPage和type
      if (this.flag === 1) {
        if (this.menuIndex === 1) {
          this.getRiskMes(val, 4);
        } else if (this.menuIndex === 2) {
          this.getRiskMes(val, 3);
        }
      } else if (this.flag === 2) {
        if (this.menuIndex === 1) {
          this.getRiskMes(val, 2);
        } else if (this.menuIndex === 2) {
          this.getRiskMes(val, 1);
        }
      }
    },
    //获取各类sim卡数据
    getRiskMes(currentPage, type) {
      this.$API
        .getRiskManage({
          pageNumber: currentPage,
          pageSize: 50,
          type: type
        })
        .then(res => {
          if (type === 1) {
            //页面加载后获取表1第一页数据
            this.tableData1 = res.data;
            //将数据赋值给表B，进行分页操作
            this.tableData = res.data;
            for (let i = 0; i < this.tableData1.length; i++) {
              if (this.tableData1[i].surplusGprs === null) {
                this.tableData1[i].surplusGprs = "0";
              }
            }
          } else if (type === 2) {
            this.tableData2 = res.data;
            this.tableData = res.data;
            for (let i = 0; i < this.tableData2.length; i++) {
              if (this.tableData2[i].surplusGprs === null) {
                this.tableData2[i].surplusGprs = "0";
              }
            }
          } else if (type === 3) {
            this.tableData3 = res.data;
            this.tableData = res.data;
            for (let i = 0; i < this.tableData3.length; i++) {
              if (this.tableData3[i].surplusGprs === null) {
                this.tableData3[i].surplusGprs = "0";
              }
            }
          } else if (type === 4) {
            this.tableData4 = res.data;
            this.tableData = res.data;
            for (let i = 0; i < this.tableData4.length; i++) {
              if (this.tableData4[i].surplusGprs === null) {
                this.tableData4[i].surplusGprs = "0";
              }
            }
          }
          this.total = res.total;
        })
        .catch(err => {});
    },
    //给el-table单双行添加不同背景色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 === 1) {
        return "success-row";
      }
      return "";
    },
    //导出4类sim卡
    exportSim(type) {
      //let EXPORT_URL = `http://120.25.254.108/exportExcel/exportRiskSimCard.json?type=${type}&sessionId=${this.$store.state.LOGINUSER.sId}`;
      let EXPORT_URL = `${this.$url}/exportExcel/exportRiskSimCard.json?type=${type}&sessionId=${this.$store.state.LOGINUSER.sId}`;
      if (type === 1) {
        console.log("1:" + this.expireSimCardsF);
        if (this.expireSimCardsF === 0) {
          this.$message({
            message: "无可导出的sim卡",
            type: "warning"
          });
          return;
        } else {
          //  根据筛选项 转化为String参数
          let CROSF = this.exportParams || this.searchSimListByInventoryParams;
          console.log(CROSF, this.searchSimListByInventoryParams);
          for (let i in CROSF) {
            console.log(i);
            EXPORT_URL += `&${i}=${CROSF[i]}`;
          }
        }
      } else if (type === 2) {
        console.log("2:" + this.predictSimCardsF);
        if (this.predictSimCardsF === 0) {
          this.$message({
            message: "无可导出的sim卡",
            type: "warning"
          });
          return;
        } else {
          //  根据筛选项 转化为String参数
          let CROSF = this.exportParams || this.searchSimListByInventoryParams;
          console.log(CROSF, this.searchSimListByInventoryParams);
          for (let i in CROSF) {
            console.log(i);
            EXPORT_URL += `&${i}=${CROSF[i]}`;
          }
        }
      } else if (type === 3) {
        console.log("3:" + this.expireSimGprsF);
        if (this.expireSimGprsF === 0) {
          this.$message({
            message: "无可导出的sim卡",
            type: "warning"
          });
          return;
        } else {
          //  根据筛选项 转化为String参数
          let CROSF = this.exportParams || this.searchSimListByInventoryParams;
          console.log(CROSF, this.searchSimListByInventoryParams);
          for (let i in CROSF) {
            console.log(i);
            EXPORT_URL += `&${i}=${CROSF[i]}`;
          }
        }
      } else if (type === 4) {
        console.log("4:" + this.predictSimGprsF);
        if (this.predictSimGprsF === 0) {
          this.$message({
            message: "无可导出的sim卡",
            type: "warning"
          });
          return;
        } else {
          //  根据筛选项 转化为String参数
          let CROSF = this.exportParams || this.searchSimListByInventoryParams;
          console.log(CROSF, this.searchSimListByInventoryParams);
          for (let i in CROSF) {
            console.log(i);
            EXPORT_URL += `&${i}=${CROSF[i]}`;
          }
        }
      }
      console.log("this.$url:" + EXPORT_URL);
      window.open(EXPORT_URL);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .warning-row {
  background: #33436a;
}
/deep/ .el-table .success-row {
  background: #293656;
}
/deep/ .el-table thead th {
  background-color: #293656;
  border: none;
}

/deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #212e3e !important;
}
//开启操作列后的hover样式
// /deep/.el-table__body tr.hover-row > td {
//   background-color: #1b3658 !important;
// }
/deep/ .el-pagination__editor.el-input .el-input__inner {
  border: 1px solid #bbc8eb;
  background-color: #222c47;
  color: #bbc8eb;
}
/deep/ .el-pagination button:disabled {
  background-color: #222c47;
}
/deep/ .el-pagination .el-pagination__total,
/deep/ .el-pagination__jump {
  color: #bbc8eb;
}
/deep/ .el-pagination .btn-next,
/deep/ .el-pagination .btn-prev,
/deep/ .el-pager li,
/deep/ .el-pager li.btn-quicknext,
/deep/ .el-pager li.btn-quickprev {
  background-color: #222c47;
  color: #bbc8eb;
}
/deep/ .el-table .cell {
  color: rgb(255, 253, 255);
}
/deep/ .el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
}
/deep/ .el-table__empty-block {
  height: 510px;
  background-color: #33436a;
  width: 100% !important;
}
/deep/ .el-pagination .btn-next:hover,
/deep/ .el-pagination .btn-prev:hover,
/deep/ .el-pager li.active,
/deep/ .el-pager li.btn-quicknext:hover,
/deep/ .el-pager li.btn-quickprev:hover {
  color: #409eff;
}

.active {
  background-color: #222c47 !important;
  color: #ffffff !important;
}
.main {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1128px;
  height: 658px;
  margin-left: -564px;
  margin-top: -329px;
  z-index: 9999;
  background: rgba(34, 44, 71, 1);
  border-radius: 3px;
  ul li {
    list-style: none;
    display: inline-block;
    width: 180px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    text-decoration: none;
    margin-bottom: 28px;
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
    background-color: #2a3759;
    color: #56699a;
  }
  .exportBtn {
    width: 80px;
    height: 40px;
    position: absolute;
    right: 43px;
    top: 20px;
    z-index: 9999;
    background: rgba(81, 105, 170, 1);
    border: 0;
    border-radius: 2px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    cursor: pointer;
  }
  .tableBox {
    height: 510px;
    width: 97%;
    margin: auto;
    box-sizing: border-box;
    background: #33436a;
    //overflow: hidden;
    overflow-y: scroll;
  }
}
</style>

