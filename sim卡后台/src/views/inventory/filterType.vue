<template>
  <div style="position:relative">
    <div class="filter-type">
      <input
        class="filter-type-input"
        style="width:20%"
        placeholder="SIM卡号"
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
      <el-dropdown @command="exportOrder">
        <div class="export">
          <i class="iconfont icon-daochu"></i>订单导出
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="导出筛选项">导出筛选项</el-dropdown-item>
          <el-dropdown-item command="导出全部卡">导出全部卡</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="primary"
        size="small"
        @click="$emit('transferSIM')"
        style="margin-right:10px"
      >转移</el-button>
      <el-popover
        placement="bottom"
        width="320"
        trigger="hover"
      >
        <el-button
          type="primary"
          size="small"
          @click="$emit('xufei')"
        >续费</el-button>
        <el-button
          type="primary"
          size="small"
          @click="$emit('duanxin')"
        >短信</el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialog.piliang = true"
        >入库</el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialog.tingka = true"
        >停卡</el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialog.kaika = true"
        >开卡</el-button>
        <el-button
          type="primary"
          size="small"
          @click="initParams();getDestroyCardInfo();dialog.xiaoka = true"
        >销卡</el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialog.sousuo = true"
        >搜索</el-button>
        <el-button
          type="primary"
          size="small"
          @click="$emit('danjia')"
        >修改单价</el-button>
        <el-button slot="reference">批量选项</el-button>
      </el-popover>

      <!-- <el-button
        type="primary"
        size="small"
        @click="loadInventoryData()"
      >卡段入库</el-button> -->

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
            v-for="(item, index) in $store.state.simList"
            :key="index"
            :label="item.label"
            :value="item.inventoryValue"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchSimListByInventoryParams.simState"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in $store.state.simStateOptions"
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
      </div>
    </transition>
    <el-dialog
      title="批量搜索"
      :visible.sync="dialog.sousuo"
      width="40%"
    >
      <textarea
        v-model="searchSimListByInventoryParams.simCardStr"
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
          @click="dialog.sousuo = false;searchSimListByInventory()"
          size="small"
        >开始搜索</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="卡段入库"
      :visible.sync="dialog.kaduan"
      width="350px"
      @open="initParams()"
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
          slot-scope="{ node }"
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
      title="批量入库"
      :visible.sync="dialog.piliang"
      width="40%"
      @open="initParams()"
    >
      <textarea
        v-model="pushNumSegmentParams.allDate"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        placeholder='请粘贴ICCID,数据用“回车”隔开'
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
      title="批量停卡"
      :visible.sync="dialog.tingka"
      width="40%"
      @open="initParams()"
    >
      <textarea
        v-model="shutDownPhoneByListParams.simCard"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        placeholder='请粘贴SIM卡号,数据用“回车”隔开'
        width="100%"
        rows="20"
      ></textarea>
      <div
        class="input-item"
        style="margin-top:20px;justify-content:center"
      >
        <el-button
          type="primary"
          @click="shutDownPhoneByList()"
          size="small"
        >停卡</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="批量开卡"
      :visible.sync="dialog.kaika"
      width="40%"
      @open="initParams()"
    >
      <textarea
        v-model="openPhoneBySimCardParams.simCard"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        placeholder='请粘贴SIM卡号,数据用“回车”隔开'
        width="100%"
        rows="20"
      ></textarea>
      <div
        class="input-item"
        style="margin-top:20px;justify-content:center"
      >
        <el-button
          type="primary"
          @click="openPhoneBySimCard()"
          size="small"
        >开卡</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="shutDownErr.visible"
      width="40%"
      class="daoru"
    >
      <div
        class="daoru-title"
        slot="title"
      >
        <div>错误信息：{{ `停卡失败(${shutDownErr.data.length}条)` }}</div>
      </div>
      <div class="daoru-table">
        <el-table
          :data="shutDownErr.data.slice((shutDownErr.pageNumber-1)*shutDownErr.pageSize, shutDownErr.pageNumber*shutDownErr.pageSize)"
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
            prop="simCard"
            label="SIM卡号"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          small
          layout="prev, pager, next"
          :current-page.sync="shutDownErr.pageNumber"
          :page-size.sync="shutDownErr.pageSize"
          :total.sync="shutDownErr.data.length"
          style="text-align:right;margin-top:10px"
        >
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.xiaoka"
      width="700px"
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
            prop="iccid"
            label="ICCID"
          >
          </el-table-column>
          <el-table-column
            prop="simCard"
            label="SIM卡号"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="日期"
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
  </div>
</template>
<script>
import comfirDialog from "@/components/comfir/";
import { toTreeData, exportFile } from "@/util/common";

export default {
  methods: {
    exportOrder(command) {
      const json = "exportExcel/exportCustomerSim.json";
      let params = {
        sessionId: this.$store.state.LOGINUSER.sId //	sessionId	string
      };

      if (command === "导出筛选项") {
        params = { ...params, ...this.searchSimListByInventoryParams };
        delete params.pageSize;
        delete params.pageNumber;
      } else {
        if (this.total === 0) {
          this.$msg({
            message: "无可导出的sim卡",
            type: "warning"
          });
        }
      }

      exportFile(json, params);
    },
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
          this.treeData = toTreeData(res.data);
          this.dialog.kaduan = true;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    searchSimListByInventory() {
      this.searchSimListByInventoryParams.simCardStr = this.searchSimListByInventoryParams.simCardStr
        .split(/[\n\s+,]/g)
        .join(",");
      let params = this.searchSimListByInventoryParams;
      //console.log("查询:" + JSON.stringify(params));
      this.$emit("updateSearchSimListByInventoryParams", params);
      !params.searchType && delete params.searchType; //为空时不传searchType
      this.$API.searchSimListByInventory(params).then(res => {
        if (res.code === 0) {
          this.$emit("updateSimList", res);
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
      this.pushNumSegmentParams.allDate = this.pushNumSegmentParams.allDate
        .split(/[\n\s+,]/g)
        .join(",");
      this.pushNumSegmentParams.pushType = type;
      let params = Object.assign({}, this.pushNumSegmentParams);
      try {
        if (type === 1) {
          if (!params.startCard) throw "请填写起始卡号！";
          if (!params.endCard) throw "请填写结束卡号！";
          if (params.batch) {
            //不为空（即已选择却未选对格式）时判断是否选择了“YYMMDD”格式
            if (params.batch.length !== 8) throw "请选择正确的批次！";
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

            params.batch = Y + M + D;
          }
        } else {
          if (!params.allDate) throw "请填写批量入库卡号！";
        }
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }

      this.$API.pushNumSegment(params).then(res => {
        if (res.code === 0) {
          this.dialog.kaduan = false;
          this.dialog.piliang = false;
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
    shutDownPhoneByList() {
      this.shutDownPhoneByListParams.simCard = this.shutDownPhoneByListParams.simCard
        .split(/[\n\s+,]/g)
        .join(",");

      this.$API
        .shutDownPhoneByList(this.shutDownPhoneByListParams)
        .then(res => {
          if (res.code === 0) {
            this.dialog.tingka = false;
            if (res.data && res.data.length > 0) {
              this.shutDownErr.data = res.data.map(item => {
                return { simCard: item };
              });
              this.shutDownErr.pageNumber = 1;
              this.shutDownErr.visible = true;
            } else {
              this.$msg({
                message: res.msg,
                type: "success"
              });
            }
          } else {
            this.$msg({
              message: res.msg,
              type: "error"
            });
          }
        });
    },
    openPhoneBySimCard() {
      this.openPhoneBySimCardParams.simCard = this.openPhoneBySimCardParams.simCard
        .split(/[\n\s+,]/g)
        .join(",");

      this.$API.shutDownPhoneByList(this.openPhoneBySimCardParams).then(res => {
        if (res.code === 0) {
          this.dialog.kaika = false;
          if (res.data && res.data.length > 0) {
            this.shutDownErr.data = res.data.map(item => {
              return { simCard: item };
            });
            this.shutDownErr.pageNumber = 1;
            this.shutDownErr.visible = true;
          } else {
            this.$msg({
              message: res.msg,
              type: "success"
            });
          }
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

      this.chargeOffCardParams = {
        cardNo: "", //卡号	string
        remark: "" //销卡说明	string
      };

      this.chargeOffCardParams = {
        cardNo: "", //卡号	string
        remark: "" //销卡说明	string
      };

      this.shutDownPhoneByListParams = {
        simCard: ""
      };

      this.openPhoneBySimCardParams = {
        simCard: ""
      };
    }
  },

  data() {
    return {
      filterMore: false,
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
        piliang: false,
        xiaoka: false,
        duanxin: false,
        zhuanyi: false,
        tingka: false,
        kaika: false
      },
      activeNode: null,
      activeName: "first",
      pushNumSegmentParams: {
        allDate: "", //批量入库卡号	string	数据用 逗号"," 隔开
        batch: "", //入库批次	string	卡段入库时选择的批次
        endCard: "", //结束卡号	string
        pushType: "", //入库类型	number	1:卡段入库 2:批量入库
        startCard: "" //起始卡号	string
      },
      treeData: null,
      defaultProps: {
        children: "children",
        label: "label"
      },
      searchSimListByInventoryParams: {
        batch: "", //批次	string,
        endIccid: "", //结束iccid号	string
        endTime: "", //结束时间	string
        searchType: "", //不传入库，1出库，2未出库	number
        simCard: "", //sim卡号	string
        simState: 0, //sim卡状态	number
        simType: "", //sim卡类型	string
        startIccid: "", //开始iccid号	string
        startTime: "", //开始时间	string
        simCardStr: "", //	sim卡集合
        pageNumber: 1, //当前页	number
        pageSize: 50 //条数	number
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
      DestroyCardTotal: 0,
      shutDownPhoneByListParams: {
        simCard: ""
      },
      shutDownErr: {
        data: [],
        pageSize: 50,
        pageNumber: 1,
        visible: false
      },
      openPhoneBySimCardParams: {
        simCard: ""
      }
    };
  },

  components: {
    comfirDialog
  }
};
</script>
<style lang="scss" scoped>
@import "@/public/css/base.scss";
.select_input {
  margin: 20px 0;
  position: relative;
}
.filter-type-input {
  background: #f3f7fb;
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
    height: 40px;
    line-height: 40px;
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
  .export {
    padding: 0 10px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bac2c9;
    cursor: pointer;
    height: 100%;
    background: #f5f6ff;
    margin-right: 10px;
    &:hover {
      background: #ebedef;
    }
    i {
      margin-right: 10px;
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
  .el-pagination {
    justify-content: flex-end;
  }
}

.el-popover {
  .el-button {
    margin: 10px 10px 0 0;
  }
}
</style>

