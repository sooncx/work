
<template>
  <div class="logScroll-box">
    <!-- <div class="logScroll-header">

    </div> -->
    <div
      v-if="socketStatus!=='wait'"
      class="logScroll-cont"
    >
      <RecycleScroller
        class="scroller"
        :items="logData"
        :item-size="25"
        :buffer="100"
        key-field="_index"
      >
        <template slot="before">
          <section class="log-row log-row-header">
            <div class="log-row-col w50">序号</div>
            <div class="log-row-col w67">消息来源</div>
            <div class="log-row-col  w80">流水号</div>
            <div class="log-row-col  w80">消息ID</div>
            <div class="log-row-col  w160">上报时间</div>
            <div class="log-row-col w160">
              消息描述
            </div>
            <div class="log-row-col flex">
              消息内容
            </div>
          </section>
        </template>
        <template v-slot="{ item }">
          <!-- [item._index%2===0?'even':'odd',(item.pass !== null && item.pass !== undefined) || item.source === '系统'?'row-red':''] -->
          <section
            class="log-row"
            :class="setRowClassName(item)"
            @click="onRowClick(item)"
          >
            <div class="log-row-col w50">{{ item._index }}</div>
            <div class="log-row-col w67">{{ item.source }}</div>
            <div class="log-row-col  w80">{{ item.msgSerial }}</div>
            <div class="log-row-col  w80">{{ item.msgNo }}</div>
            <div class="log-row-col  w160">{{ item.time }}</div>
            <div class="log-row-col  w160">{{ item.descp }}</div>
            <div class="log-row-col flex">
              <div
                v-bsjPopover="item"
                class="wen-oh-p wen-oh"
              >{{ item.remark |filterBr }}</div>
              <!-- <el-popover
                placement="top-start"
                title="详细"
                width="400"
                trigger="hover"
                transition="w"
                effect="light"
              >
                <div slot="reference" class="wen-oh-p wen-oh">{{ item.remark |filterBr }}</div>
                <div v-html="getPopverRemark(item.remark)" v-bsjPopover="item"  />
               <div v-html="item.remark" /> -->

            </div>
          </section>
        </template>
      </RecycleScroller>
    </div>
    <div
      v-else
      class="wait-msg-box"
    >
      <div><img
          src="@/assets/img/tip.svg"
          width="100px"
        ></div>
      <template v-if="hasFunctionResult">
        当前功能已测试完成
      </template>
      <template v-else>
        请先通过第一个步骤
      </template>

    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { stateCodes } from "@/utils/functionUtil";
export default {
  data() {
    return {
      stateCodes
    };
  },
  computed: {
    ...mapState(["testFunction"]),
    logData() {
      return this.testFunction.logData;
    },
    socketStatus() {
      return this.testFunction.socketStatus;
    },
    stepStatusList() {
      return this.$store.state.testFunction.stepStatusList;
    },
    hasFunctionResult() {
      const functionResult = this.stepStatusList[0];
      const functionHasResult = [
        this.stateCodes.success,
        this.stateCodes.error
      ]; // 是否测试通过或者不通过
      return functionHasResult.includes(functionResult);
    }
  },
  filters: {
    filterBr(val) {
      if (!val) return "";

      return val.replace(/<br\/>/g, "").replace(/\r\n/g, "");
    }
  },
  methods: {
    getPopverRemark(val) {
      // 多行超出以省略号显示
      const maxLen = 570;
      if (val.length > maxLen) {
        val = val.substring(0, maxLen) + "...";
      }
      return val;
    },
    onRowClick(row, column, event) {
      this.$popLogDetail.show({
        data: row,
        isNeedGetDetail: false
      });
    },
    setRowClassName(item) {
      var classArr = [];
      if (item._index % 2 === 0) {
        classArr.push("even");
      } else {
        classArr.push("odd");
      }
      if (item.pass !== null && item.pass !== undefined) {
        classArr.push("row-red");
      }
      switch (item.source) {
        case "系统":
          classArr.push("row-red");
          break;
        case "备服":
          classArr.push("row-beifu");
          break;
        case "从服":
          classArr.push("row-congfu");
          break;
      }
      return classArr;
    }
  }
};
</script>
<style lang="scss" scoped>
.wen-oh-p {
  width: 100%;
  color: #46a6ff;
  cursor: help;
}
// .logTable{
//     /deep/ tr.row-red{
//     color: #DB302E;
//   }
//    /deep/ tr.row-beifu{
//     color: #003333;
//   }
//    /deep/ tr.row-congfu{
//     color: #666600;
//   }
// }
.logScroll-box {
  display: flex;
  flex-direction: column;
  .logScroll-cont {
    flex: 1;
    position: relative;
    overflow: hidden;
    .scroller {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .wait-msg-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    text-align: center;
    transform: translate(-50%, -80%);
    font-size: 12px;
    color: #6f5004;
    img {
      margin-bottom: 10px;
    }
  }

  .log-row {
    display: table;
    table-layout: fixed;
    width: 100%;
    white-space: nowrap;
    border-bottom: 1px solid #dfe6ec;
    line-height: 22px;
    height: 24px;
    font-size: 12px;
    color: #606266;
    &.row-red,
    &.row-red .wen-oh-p {
      color: #db302e;
    }
    &.row-beifu,
    &.row-beifu .wen-oh-p {
      color: #11b95c;
    }
    &.row-congfu,
    &.row-congfu .wen-oh-p {
      color: #7a08ec;
    }
    &.log-row-header {
      background-color: #f5f9fd;
      height: 30px;
      line-height: 28px;
      border-top: 1px solid #dfe6ec;
    }
    &.even {
      background: #fafafa;
    }
    .log-row-col {
      display: table-cell;
      padding: 0 10px;
      border-right: 1px solid #dfe6ec;

      &:last-child {
        border: none;
      }
      &.w50 {
        width: 50px;
      }
      &.w67 {
        width: 67px;
      }
      &.w80 {
        width: 80px;
      }
      &.w120 {
        width: 120px;
      }
      &.w160 {
        width: 160px;
      }
      &.w131 {
        width: 131px;
      }
      &.w180 {
        width: 180px;
      }
    }
  }
  /deep/ .vue-recycle-scroller__item-wrapper,
  /deep/ .vue-recycle-scroller__slot {
    min-width: 1200px;
  }
}
</style>
