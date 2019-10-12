<template>
  <div style="position:relative">
    <div class="filter-type">
      <input
        class="filter-type-input"
        style="width:20%"
        placeholder="客户代码 / SIM卡号"
        v-model="searchSimListByInventoryParams.simCard"
      />
      <div
        class="filter-more-btn"
        @click="filterMore = !filterMore"
        :class="{'on':filterMore}"
      ><i class="iconfont icon-more"></i>更多</div>
      <el-button
        type="primary"
        size="small"
        style="margin-right:auto"
        @click="searchSimListByInventory()"
      >查询</el-button>
      <input
        ref="File"
        type="file"
        style="display: none;"
        @change="uploadSimExcel($event)"
      >
      <el-button
        type="primary"
        size="small"
        :loading="daoruLoading"
        @click="$refs.File.click()"
      >文件导入</el-button>
      <el-button
        type="primary"
        size="small"
        @click="dialog.piliang = true"
      >批量入库</el-button>
      <el-button
        type="primary"
        size="small"
        @click="loadInventoryData()"
      >卡段入库</el-button>
      <el-button
        type="primary"
        size="small"
        @click="dialog.tuika = true"
      >退卡入库</el-button>
      <el-button
        type="primary"
        size="small"
        @click="initParams();getDestroyCardInfo();dialog.xiaoka = true"
      >销卡</el-button>
    </div>
    <transition>
      <div
        v-show="filterMore"
        class="filter-type-more"
      >
        <input
          placeholder="ICCID号字段"
          class="filter-type-input"
          style="width:15%;margin-left:10px"
          v-model="searchSimListByInventoryParams.startIccid"
        />
        <span class="split-line"></span>
        <input
          placeholder="ICCID号字段"
          class="filter-type-input"
          style="width:15%;"
          v-model="searchSimListByInventoryParams.endIccid"
        />
        <el-select
          v-model="searchSimListByInventoryParams.simType"
          placeholder="请选择"
          style="margin-left:20px"
          size="small"
        >
          <el-option
            v-for="item in mealOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchSimListByInventoryParams.simState"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchSimListByInventoryParams.searchType"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in inventoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          @click="dialog.sousuo = true"
          style="margin-left:20px"
        >批量搜索</el-button>
      </div>
    </transition>
    <el-dialog
      title="批量搜索"
      :visible.sync="dialog.sousuo"
      width="40%"
    >
      <textarea
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        placeholder="请粘贴内容"
        width="100%"
        rows="20"
      ></textarea>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialog.sousuo = false"
          size="small"
        >开始搜索</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="卡段入库"
      :visible.sync="dialog.kaduan"
      width="350px"
      @closed="initParams()"
    >
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        render-after-expand
        highlight-current
        @node-click="node => pushNumSegmentParams.batch = node.id"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
        >
          <i class="iconfont icon-shenqing01"></i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
      <div class="input-item">
        <label>开始号段</label>
        <input
          placeholder="ICCID号字段"
          class="filter-type-input"
          style="width:calc(50% - 10px);"
          v-model="pushNumSegmentParams.startCard"
        />
      </div>
      <div class="input-item">
        <label>结束号段</label>
        <input
          placeholder="ICCID号字段"
          class="filter-type-input"
          style="width:calc(50% - 10px);"
          v-model="pushNumSegmentParams.endCard"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="pushNumSegment(1)"
          size="small"
        >入库</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.daoru"
      width="40%"
      class="daoru"
      v-if="excelErrorObj"
    >
      <div
        class="daoru-title"
        slot="title"
      >
        <div>错误信息：{{ `${excelErrorObj.msg}(${excelErrorObj.data.length}条)` }}</div>
      </div>
      <div class="daoru-table">
        <el-table
          :data="excelErrorObj.data.slice((excelErrorObj.pageNumber-1)*excelErrorObj.pageSize,excelErrorObj.pageNumber*excelErrorObj.pageSize)"
          stripe
          style="width: 100%"
          height="400px"
          size="small"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="iccid"
            label="ICCID"
          >
          </el-table-column>
          <el-table-column
            prop="simCard"
            label="SIM卡号"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          small
          layout="prev, pager, next"
          :current-page.sync="excelErrorObj.pageNumber"
          :page-size.sync="excelErrorObj.pageSize"
          :total.sync="excelErrorObj.data.length"
          style="text-align:right;margin-top:10px"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      title="批量入库"
      :visible.sync="dialog.piliang"
      width="40%"
      @closed="initParams()"
    >
      <textarea
        v-model="pushNumSegmentParams.allDate"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        placeholder='请粘贴ICCID,数据用 逗号"," 隔开'
        width="100%"
        rows="20"
      ></textarea>
      <div
        class="input-item"
        style="margin-top:20px;justify-content:center"
      >
        <el-button
          type="primary"
          @click="pushNumSegment(2)"
          size="small"
        >入库</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.xiaoka"
      width="40%"
      class="xiaoka"
    >
      <div
        class="xiaoka-title"
        slot="title"
      >
        <div
          class="xiaoka-tab-item"
          @click="activeName = 'first'"
          :class="{'on': activeName === 'first'}"
        >销卡</div>
        <div
          class="xiaoka-tab-item"
          @click="activeName = 'history'"
          :class="{'on': activeName === 'history'}"
        >销卡历史</div>
      </div>
      <div
        class="xiaoka-first"
        v-show="activeName === 'first'"
      >
        <div style="font-weight:bold;margin: 0 0 20px">输入卡号</div>
        <textarea
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          placeholder="请粘贴卡号"
          width="100%"
          rows="10"
          v-model="chargeOffCardParams.cardNo"
        ></textarea>
        <div style="font-weight:bold;margin: 20px 0">备注信息</div>
        <textarea
          v-model="chargeOffCardParams.remark"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          placeholder="请输入备注信息"
          width="100%"
          rows="5"
        ></textarea>
        <div
          class="input-item"
          style="margin-top:20px;justify-content: center;"
        >
          <el-button
          type="primary"
          @click="comfirChargeOffCard();"
          size="small"
        >确认销卡</el-button>
        </div>
      </div>
      <div
        class="xiaoka-history"
        v-show="activeName === 'history'"
      >
        <el-table
          :data="DestroyCardTableData"
          stripe
          style="width: 100%"
          height="400px"
          size="small"
        >
          <el-table-column
            prop="date"
            label="数量"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="日期"
          >
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          small
          layout="prev, pager, next"
          :total="DestroyCardTotal"
          style="text-align:right;margin-top:10px"
          :current-page.sync="getDestroyCardInfoParams.pageNumber"
          :page-sizes="[100, 200, 300, 400]"
          :page-size.sync="getDestroyCardInfoParams.pageSize"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 确认销卡框 -->
    <comfir-dialog
      @comfir="chargeOffCard()"
      ref="dialogComfir"
      :text="`是否确认销卡<span>${chargeOffCardParams.cardNo.indexOf(',') === -1 ? 1 : chargeOffCardParams.cardNo.split(',').length}张</span>`"
    ></comfir-dialog>
    <el-dialog
      title="退卡入库"
      :visible.sync="dialog.tuika"
      width="40%"
      @closed="initParams()"
    >
      <textarea
        v-model="backCardParams.cardNo"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        placeholder='请粘贴ICCID,数据用 逗号"," 隔开'
        width="100%"
        rows="20"
      ></textarea>
      <div
        class="input-item"
        style="margin-top:20px;justify-content:center"
      >
        <el-button
          type="primary"
          @click="backCard()"
          size="small"
        >入库</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import comfirDialog from "@/components/dialog/comfir";
export default {
  methods: {
    getDestroyCardInfo() {
      this.$API.getDestroyCardInfo(this.getDestroyCardInfoParams).then(res => {
        if (res.code === 0) {
          this.DestroyCardTableData = res.data;
          this.DestroyCardTotal = res.total;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    comfirChargeOffCard() {
      if (!this.chargeOffCardParams.cardNo) {
        this.$msg({
          message: "请粘贴卡号！",
          type: "warning"
        });
        return;
      }
      this.$refs.dialogComfir.visible = true;
    },
    chargeOffCard() {
      this.$API.chargeOffCard(this.chargeOffCardParams).then(res => {
        if (res.code === 0) {
          this.$emit("chargeOffCardChange", this.chargeOffCardParams.cardNo);
          this.$msg({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    loadInventoryData() {
      this.$API.loadInventoryData().then(res => {
        if (res.code === 0) {
          this.defaultTreeData = res.data;
          this.treeData = this.toTreeData(res.data);
          this.dialog.kaduan = true;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    toTreeData(data) {
      let result = [];
      let resultKeys = {};
      data.map(item => {
        let yearKey = item.groupName.substring(0, 4);
        let monthKey = item.groupName.substring(0, 6);
        let daykey = item.groupName;

        if (!resultKeys[yearKey]) {
          result.push({
            id: yearKey,
            pid: -1,
            label: yearKey
          });
          resultKeys[yearKey] = true;
        }
        if (!resultKeys[monthKey]) {
          result.push({
            id: monthKey,
            pid: yearKey,
            label: monthKey
          });
          resultKeys[monthKey] = true;
        }
        result.push({
          id: daykey,
          groupName: item.groupName,
          pid: monthKey,
          label: daykey
        });
      });

      //toTree
      result.map(item => {
        delete item.children;
      });
      var map = {};
      result.map(item => {
        map[item.id] = item;
      });
      var newData = [];
      result.map((item, index) => {
        var parent = map[item.pid];
        if (parent) {
          (parent.children || (parent.children = [])).push(item); // parent 引用 item
        } else {
          newData.push(item);
        }
      });
      return newData;
    },
    uploadSimExcel(e) {
      if (e.target.files.length === 0) {
        this.$msg({
          message: "请选择文件",
          type: "warning"
        });
        return;
      }
      this.daoruLoading = true;

      let params = new FormData();
      params.append("type", 1);
      params.append("upfile", e.target.files[0]);
      this.$refs.File.value = "";
      this.$API
        .uploadSimExcel(params)
        .then(res => {
          if (res.data.code === 0) {
            this.$emit('loadInventoryData')
            this.$msg({
              message: res.data.msg,
              type: "success"
            });
          } else {
            this.excelErrorObj = res.data;
            this.excelErrorObj.pageNumber = 1;
            this.excelErrorObj.pageSize = 50;
            this.dialog.daoru = true;
          }
          this.daoruLoading = false;
        })
        .catch(rst => {
          this.daoruLoading = false;
        });
    },
    searchSimListByInventory() {
      let params = this.searchSimListByInventoryParams;
      !params.searchType && delete params.searchType; //为空时不传searchType
      this.$API.searchSimListByInventory(params).then(res => {
        if (res.code === 0) {
          this.$emit("updateSimList", res.data);
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    backCard() {
      this.$API.backCard(this.backCardParams).then(res => {
        if (res.code === 0) {
          this.dialog.tuika = false;
          this.$msg({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    pushNumSegment(type) {
      //type  1:卡段入库 2:批量入库
      this.pushNumSegmentParams.pushType = type;
      let msg = "";

      if ((type = 1)) {
        !this.pushNumSegmentParams.startCard && (msg = "请填写起始卡号！");
        !this.pushNumSegmentParams.endCard && (msg = "请填写结束卡号！");
        if (this.pushNumSegmentParams.batch) {
          //不为空（即已选择却未选对格式）时判断是否选择了“YYMMDD”格式
          this.pushNumSegmentParams.batch.length !== 8 &&
            (msg = "请选择正确的批次！");
        } else {
          //为空时默认为当天
          let date = new Date();
          let Y = date.getFullYear();
          let M =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let D =
            date.getDate() < 10 ? "0" + date.getDate() : date.getMonth() + 1;

          this.pushNumSegmentParams.batch = Y + M + D;
        }
      } else {
        !this.pushNumSegmentParams.allDate && (msg = "请填写批量入库卡号！");
      }
      if (msg) {
        this.$msg({
          message: msg,
          type: "warning"
        });
        return;
      }
      this.$API.pushNumSegment(this.pushNumSegmentParams).then(res => {
        if (res.code === 0) {
          this.dialog.kaduan = false;
          this.$msg({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    findByGprsBagList() {
      this.$API.findByGprsBagList().then(res => {
        if (res.code === 0) {
          this.mealOptions = [
            {
              value: "",
              label: "全部套餐"
            }
          ];
          res.data.map(item => {
            this.mealOptions.push({
              value: item.gprsType,
              label: item.gprsType
            });
          });
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    initParams() {
      this.pushNumSegmentParams = {
        allDate: "", //批量入库卡号	string	数据用 逗号"," 隔开
        batch: "", //入库批次	string	卡段入库时选择的批次
        endCard: "", //结束卡号	string
        pushType: "", //入库类型	number	1:卡段入库 2:批量入库
        startCard: "" //起始卡号	string
      };

      this.backCardParams = {
        cardNo: "" //卡号	string
      };

      this.chargeOffCardParams = {
        cardNo: "", //卡号	string
        remark: "" //销卡说明	string
      };
    }
  },

  created() {
    this.findByGprsBagList();
  },

  data() {
    return {
      daoruLoading: false,
      filterMore: false,
      mealOptions: null,
      statusOptions: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: 1,
          label: "正常"
        },
        {
          value: 2,
          label: "过期"
        },
        {
          value: 3,
          label: "销卡"
        }
      ],
      inventoryOptions: [
        {
          value: "",
          label: "入库"
        },
        {
          value: 1,
          label: "出库"
        },
        {
          value: 2,
          label: "未出库"
        }
      ],
      dialog: {
        sousuo: false,
        kaduan: false,
        daoru: false,
        piliang: false,
        xiaoka: false,
        tuika: false
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      activeName: "first",
      pushNumSegmentParams: {
        allDate: "", //批量入库卡号	string	数据用 逗号"," 隔开
        batch: "", //入库批次	string	卡段入库时选择的批次
        endCard: "", //结束卡号	string
        pushType: "", //入库类型	number	1:卡段入库 2:批量入库
        startCard: "" //起始卡号	string
      },
      backCardParams: {
        cardNo: "" //卡号	string
      },
      treeData: null,
      defaultProps: {
        children: "children",
        label: "label"
      },
      excelErrorObj: null,
      searchSimListByInventoryParams: {
        batch: "", //批次	string,
        endIccid: "", //结束iccid号	string
        endTime: "", //结束时间	string
        searchType: "", //不传入库，1出库，2未出库	number
        simCard: "", //sim卡号	string
        simState: "", //sim卡状态	number
        simType: "", //sim卡类型	string
        startIccid: "", //开始iccid号	string
        startTime: "" //开始时间	string
      },
      chargeOffCardParams: {
        cardNo: "",
        remark: ""
      },
      getDestroyCardInfoParams: {
        pageNumber: 1, //当前页	number
        pageSize: 100 //条数	number
      },
      DestroyCardTableData: [],
      DestroyCardTotal: 0
    };
  },

  components: {
    comfirDialog
  }
};
</script>
<style lang="scss" scoped>
@import "@/public/css/base.scss";
.filter-type-input {
  background: #edf2f8;
  color: #828588;
  border: none;
  outline: 0;
  padding: 0 15px;
}
.filter-type {
  border-bottom: 1px solid #ebf0f6;
  padding: 16px 20px 14px;
  font-size: 14px;
  display: flex;
  flex-wrap: nowrap;
  .filter-more-btn {
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    color: $fgray;
    cursor: pointer;
    i {
      margin-right: 5px;
      display: inline-block;
    }
  }
  .filter-more-btn.on {
    color: $btnColor;
    i {
      transform: rotate(180deg);
    }
  }
}
.filter-type-more {
  position: absolute;
  top: 70px;
  z-index: 9;
  display: flex;
  padding: 20px 10px;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  .split-line {
    width: 20px;
    height: 3px;
    margin: auto 10px;
    background: #b5c0ce;
  }
}

/deep/ .el-select {
  width: 110px;
  margin-left: 10px;
  &:nth-child(1) {
    margin: 0;
  }
  .el-input--suffix {
    .el-input__inner {
      background: #f3f7fb;
      color: #828588;
      border: none;
    }
  }
}
.el-select-dropdown {
  .el-select-dropdown__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 15px;
    color: #828588;
  }
  .el-select-dropdown__item.selected {
    color: $btnColor;
  }
}
/deep/ .el-dialog {
  min-width: 300px;
  font-size: 14px;
  .el-dialog__header {
    border-bottom: 1px solid #f3f4f8;
    padding: 10px 20px;
    .el-dialog__title {
      color: $btnColor;
      font-size: 14px;
      font-weight: bold;
    }
    .el-dialog__headerbtn {
      top: 15px;
      right: 20px;
      .el-dialog__close:hover {
        color: $btnColor;
      }
    }
  }
  .el-dialog__footer {
    text-align: center;
    padding-bottom: 40px;
  }
  textarea {
    width: 100%;
    resize: none;
    background: #f1f2f9;
    border: none;
    font-size: 14px;
    text-indent: 10px;
    padding: 10px 0;
    outline: 0;
  }
  .input-item {
    height: 30px;
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    &:nth-last-child(1) {
      margin: 0;
    }
    label {
      color: #5a5c6f;
      margin-right: 10px;
    }
    input {
      background: #f3f7fb;
      color: #828588;
      border: none;
      outline: 0;
      padding: 0 15px;
      height: 30px;
    }
    textarea {
      flex: 1;
    }
    .split-line {
      width: 20px;
      height: 3px;
      margin: auto 10px;
      background: #b5c0ce;
    }
  }
}
/deep/ .el-dialog__wrapper.daoru {
  .daoru-title {
    color: #c60f0f;
    padding: 10px 20px 10px 0;
    font-size: 14px;
    font-weight: bold;
  }
  .daoru-table {
    border: 1px solid #ebf0f6;
    padding-bottom: 10px;
  }
}
/deep/ .el-dialog__wrapper.xiaoka {
  .el-dialog {
    .el-dialog__header {
      border: 0;
      padding: 0 10px 0 0;
    }
    .el-dialog__body {
      padding: 20px 20px 50px;
    }
  }
  .xiaoka-title {
    display: flex;
    .xiaoka-tab-item {
      width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #b9c2cc;
      font-weight: bold;
      color: #b9c2cc;
      background: #f5f7f9;
      cursor: pointer;
      border-radius: 4px;
    }
    .xiaoka-tab-item.on {
      color: $btnColor;
      background: #fff;
    }
  }
  .xiaoka-history {
    border: 1px solid #ebf0f6;
    padding-bottom: 10px;
  }
}
.filter-tree {
  flex: 1;
  font-size: 13px;
  color: $fgray;
  padding: 20px 0;
  .iconfont {
    color: $btnColor;
  }
}
</style>

