<template>
  <div
    v-loading="initStatus==='loading'&&parentIsInit==='success'"
    v-bError="initStatus==='error'&&parentIsInit==='success'"
    bError-msg="网络异常"
    class="info-wrap"
    @bError-onReset="init"
  >
    <!-- <div class="result-box">
      <pTitle title="测试结果">
        <div slot="right" v-loading="isSetResulting" class="result-btns">
          <span v-show="stepStatusList[0]===statusCode.success || stepStatusList[0]===statusCode.error" class="result-sp">
            当前测试结果为
            <span class="result-txt" :class="[stepStatusList[0]===statusCode.success?'green':'red']">{{ stepStatusList[0]===statusCode.success?"通过":"不通过" }}</span>，
            改为
          </span>
          <span v-show="stepStatusList[0]!==statusCode.success" class="result-btn green" @click="setResult(1)">测试通过</span>
          <span v-show="stepStatusList[0]!==statusCode.error" class="result-btn red" @click="setResult(2)">测试不通过</span>

        </div>
      </pTitle>
    </div> -->
    <div
      v-if="data"
      class="info-box result-box"
    >
      <pTitle title="测试内容">
        <div
          slot="right"
          v-loading="isSetResulting"
          class="result-btns"
        >
          <span
            v-show="stepStatusList[0]===statusCode.success || stepStatusList[0]===statusCode.error"
            class="result-sp"
          >
            当前测试结果为
            <span
              class="result-txt"
              :class="[stepStatusList[0]===statusCode.success?'green':'red']"
            >{{ stepStatusList[0]===statusCode.success?"通过":"不通过" }}</span>
            {{!stepStatusList[0]===statusCode.success?",改为":''}}
          </span>
          <span
            v-show="stepStatusList[0]!==statusCode.success"
            class="result-btn green"
            @click="setResult(1)"
          >测试通过</span>
          <span
            v-show="stepStatusList[0]!==statusCode.error&&!stepStatusList[0]||stepStatusList[0]===statusCode.wait===statusCode.success"
            class="result-btn red"
            @click="setResult(2)"
          >测试不通过</span>

        </div>
      </pTitle>
      <div class="info-cont">
        <section class="info-row">
          <div class="info-row-left">
            目的：
          </div>
          <div class="info-row-right">
            {{ data.info.goal }}
          </div>
        </section>
        <section class="info-row">
          <div class="info-row-left">
            设备：
          </div>
          <div class="info-row-right">
            {{ data.info.device }}
          </div>
        </section>
        <section class="info-row">
          <div class="info-row-left">
            准则：
          </div>
          <div class="info-row-right">
            {{ data.info.criterion }}
          </div>
        </section>
        <section class="info-row vertical">
          <div class="info-row-left">
            测试步骤：
          </div>
          <div class="flow-wrap ">
            <el-row :gutter="20">
              <el-col
                :span="20"
                :xs="24"
              >
                <div class="flow-Steps">
                  <el-steps :active="activeStepIndex">
                    <el-step
                      v-for="(item,index) in data.flows"
                      :key="index"
                      :status="displayStepStatusList[index+1]||'wait '"
                      @click.native="doSwitchStepIndex(item,index)"
                    />
                  </el-steps>
                </div>
                <div class="flow-Steps-dsc">
                  <div
                    v-show="activeStepData.title"
                    class="dec-p"
                  >{{ activeStepData.title }}</div>
                  <describe
                    :dsc="activeStepData.describe"
                    @buttonClick="onButtonClick"
                  />
                  <div class="switch-box">
                    <!-- :disabled="isUpdateStepState||(activeStepIndex===1&&stepStatusList[1]===statusCode.success)" -->
                    <el-switch
                      v-model="activeStepStatus"
                      :disabled="isUpdateStepState"
                      active-text="通过"
                      inactive-text="不通过"
                      @change="changeStepStatus"
                    />
                    <i
                      v-show="isUpdateStepState"
                      class="switch-status-loading el-icon-loading"
                    />
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
import { stateCodes } from "@/utils/functionUtil";

import pTitle from "@/components/pTitle";
import describe from "./describeItem";
import {
  addOrUpdate,
  selectByCheckLogIdFunction,
  orderDown
} from "@/api/testFunction";

/** ************ */
export default {
  components: { pTitle, describe },
  props: {
    title: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      required: 1,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      btnShow: true,
      initStatus: "loading", // 当前界面是否已经初始化 success error loading
      isSetResulting: false, // 是否在设置本功能测试结果
      isUpdateStepState: false,
      activeStepIndex: 1,
      activeStepStatus: false, // 当前选中步骤是否通过
      stepStatusList: {
        // 步骤状态
        0: 0
      },
      checkLogData: {}, // 存储api/checkState/selectByCheckLogIdFunction.json，但修改后不会实时更新
      statusCode: stateCodes
    };
  },
  computed: {
    displayStepStatusList() {
      var result = [];
      // result[this.activeStepIndex] = 'process'
      this.data.flows.map((item, index) => {
        index = index + 1;
        if (this.activeStepIndex !== index) {
          const statusCode = this.stepStatusList[index];
          switch (
            statusCode // 0:检测中 1：检测通过 2检测不通过 3未检测
          ) {
            case 0:
              result[index] = "process";
              break;
            case 1:
              result[index] = "success";
              break;
            case 2:
              result[index] = "wait";
              break;
            case 3:
              result[index] = "wait";
              break;
            default:
              result[index] = "wait";
          }
        } else {
          result[index] = "process";
        }
      });
      return result;
    },
    activeStepData() {
      return this.data.flows[this.activeStepIndex - 1];
    },
    functionData() {
      return this.$store.state.testFunction.activeFunction;
    },
    deviceData() {
      return this.$store.state.testFunction.deviceData;
    },
    parentIsInit() {
      return this.$store.state.testFunction.isInit;
    }
  },
  watch: {
    parentIsInit(val) {
      if (val === "success" && this.initStatus !== "success") {
        this.init();
      }
    },
    stepStatusList: {
      deep: true,
      handler(val) {
        this.setStoreStepstatusList();
      }
    }
  },
  created() {
    if (this.parentIsInit === "success") {
      this.init();
    }
  },
  methods: {
    init() {
      if (this.initStatus !== "success") {
        this.initStatus = "loading";
        // console.log("this.deviceData.checkLogId:" + this.deviceData.checkLogId);
        // console.log("this.functionData.function:" + this.functionData.function);
        // console.log("this.deviceData.num:" + this.deviceData.num);
        selectByCheckLogIdFunction({
          // 获取当前功能的测试结果、具体步骤的测试结果
          checkLogId: this.deviceData.checkLogId,
          function: this.functionData.function,
          num: this.deviceData.num
        })
          .then(rst => {
            if (rst.code === 0) {
              if (rst.data) {
                var checkLogData = {};
                rst.data.map(item => {
                  checkLogData[item.num] = item;
                  this.$set(this.stepStatusList, item.num, item.state);
                });
                this.$set(
                  this,
                  "activeStepStatus",
                  this.stepStatusList[1] === 1
                );
                this.$set(this, "checkLogData", checkLogData);
                this.setStoreStepstatusList();
                this.confirmOpenWs();
              }
              this.initStatus = "success";
            } else {
              this.initStatus = "error";
            }
          })
          .catch(e => {
            console.error(e);
            this.initStatus = "error";
          });
      }
      this.setStoreStepstatusList();
    },
    setResult(state) {
      //this.$store.dispatch("switchFooter", false);
      // 设置本功能的测试结果
      if (state === 1) {
        this.btnShow = false;
      } else {
        this.btnShow = true;
      }
      if (this.isSetResulting) {
        return false;
      }
      this.isSetResulting = true;
      var params = {
        state: state,
        num: 0,
        checkLogId: this.deviceData.checkLogId,
        function: this.functionData.function
      };

      if (this.checkLogData[0]) {
        params["id"] = this.checkLogData[0].id;
      }
      // /** ********暂时不调接口 ********/
      // this.isSetResulting = false
      // this.stepStatusList[0] = state
      // this.checkLogData[0] = {
      //   id: '',
      //   state: state
      // }
      // this.$store.commit('testFunction/SET_ITEM_FUNCTION_STATE', {
      //   key: this.functionData.function,
      //   state
      // })
      // this.setStoreStepstatusList()
      // this.confirmOpenWs()
      // return
      // /** ********暂时不调接口 ********/

      addOrUpdate(params)
        .then(rst => {
          if (rst.code === 0) {
            this.stepStatusList[0] = state;
            this.checkLogData[0] = {
              id: rst.data,
              state: state
            };
            this.$store.commit("testFunction/SET_ITEM_FUNCTION_STATE", {
              key: this.functionData.function,
              state
            });
            this.setStoreStepstatusList();
            this.confirmOpenWs();
          }
          this.isSetResulting = false;
        })
        .catch(e => {
          this.isSetResulting = false;
        });
    },
    changeStepStatus(val) {
      //this.$store.dispatch("switchFooter", this.activeStepStatus);
      // 用户点击修改当前步骤状态
      this.addOrUpdate({
        num: this.activeStepIndex, // 当前的步骤
        state: this.activeStepStatus ? 1 : 2
      });
    },
    doSwitchStepIndex(data, index) {
      // 切换步骤条的index
      var prevData = this.data.flows[this.activeStepIndex - 1];

      if (this.stepStatusList[1] === 1) {
        // 第一步必须通过后，才可自由切换到其他步骤
        if (prevData.beforeLeave) {
          // 如果有配置切换之前的限制
          prevData.beforeLeave(prevData, () => {
            this.activeStepStatus = this.stepStatusList[index + 1] === 1;
            this.activeStepIndex = index + 1;
          });
        } else {
          this.activeStepStatus = this.stepStatusList[index + 1] === 1;
          this.activeStepIndex = index + 1;
        }
      } else {
        this.$message({
          message: "请先通过1步骤准备开始",
          type: "warning"
        });
      }
    },
    addOrUpdate({ state, num }) {
      // 添加或修改当前步骤检测状态 num=0为当前检测功能，num>=1为当前检测功能步骤
      // state 0:检测中 1：检测通过 2检测不通过 3未检测

      if (!this.isUpdateStepState) {
        this.isUpdateStepState = true;
        addOrUpdate({
          checkLogId: this.deviceData.checkLogId,
          function: this.functionData.function,
          state,
          num,
          id: this.checkLogData[num] ? this.checkLogData[num].id : ""
        })
          .then(rst => {
            if (rst.code !== 0) {
              // 修改状态失败 还原
              this.activeStepStatus = this.activeStepStatus === false;
            } else {
              this.checkLogData[num] = Object({}, this.checkLogData[num], {
                id: rst.data, // checkState表的记录id
                state: state === true ? 1 : 2
              });
              this.stepStatusList[num] = state;
              this.setStoreStepstatusList();
              if (num === 1) {
                this.confirmOpenWs();
              }
            }
            this.isUpdateStepState = false;
          })
          .catch(e => {
            this.activeStepStatus = this.activeStepStatus === false;
            this.isUpdateStepState = false;
          });
      }
    },
    onButtonClick(data) {
      // 描述里面的点击按钮指令事件
      switch (
        data.handlerType // 点击触发后的处理类型 默认指令
      ) {
        default:
          orderDown(Object.assign({ sim: this.deviceData.sim }, data.params))
            .then(rst => {
              if (rst.code === 0) {
                this.$message({
                  message: "指令下发成功",
                  type: "success"
                });
              } else {
                // this.$message({
                //   message: '指令下发失败',
                //   type: 'error'
                // })
              }
            })
            .catch(e => {
              // this.$message({
              //   message: '指令下发失败',
              //   type: 'error'
              // })
              console.error(e);
            });
      }
      // debugger
      // switch (data.value) {
      //   case 'phoneCall':
      //     phoneCall({
      //       devidStr: this.deviceData.terminalNumber,
      //       flag: 0, //	0: 普通通话 1：监听
      //       phoneNumber: '13750261152'
      //     }).then(rst => {
      //       if (rst.code === 0) {
      //         this.$message({
      //           message: '下发指令成功',
      //           type: 'success'
      //         })
      //       }
      //     })
      //     break
      //   case 'phoneMonitor':
      //     phoneCall({
      //       devidStr: this.deviceData.terminalNumber,
      //       flag: 1, //	0: 普通通话 1：监听
      //       phoneNumber: '13750261152'
      //     }).then(rst => {
      //       if (rst.code === 0) {
      //         this.$message({
      //           message: '下发指令成功',
      //           type: 'success'
      //         })
      //       }
      //     })
      //     break
      // }
    },
    setStoreStepstatusList() {
      console.log("cxcxxxx:" + this.stepStatusList[0]);
      this.$store.dispatch(
        //传递测试结果
        "switchFooter",
        this.stepStatusList[0] === 0
          ? 0
          : this.stepStatusList[0] === this.statusCode.success
          ? 1
          : 2
      );
      this.$store.dispatch(
        "testFunction/setStepStatusList",
        this.stepStatusList
      );
    },
    confirmOpenWs() {
      this.$store.dispatch("testFunction/confirmOpenWs");
    }
  }
};
</script>
<style lang="scss" scoped>
$c-green: #1890ff;
.info-wrap {
  padding: 10px;
  background: #fff;
}
.info-box {
  > .info-cont {
    margin-top: 10px;
  }
}
.info-row {
  margin-left: 10px;
  font-size: 12px;
  color: $c-green;
  display: flex;
  &.vertical {
    flex-direction: column;
  }
  & + .info-row {
    margin-top: 5px;
  }
  > .info-row-right {
    color: #333;
  }
  > .info-row-left {
    white-space: nowrap;
  }
}
.flow-wrap {
  display: table;
  width: 100%;
  margin-top: 5px;
  .flow-Steps {
  }
  .flow-cmds {
    // background:
  }
  .flow-cmds-title {
    margin-bottom: 10px;
  }
  .flow-Steps-dsc {
    margin-top: 15px;
    padding: 8px;
    background-color: #f5f9fd;
    color: #333;
    .dec-p {
      line-height: 20px;
    }
  }
  /deep/ .el-step__head.is-process {
    color: #1890ff;
    border-color: #1890ff;
  }
}
.result-box {
  margin-bottom: 10px;
  .result-btns {
    margin-left: 30px;
  }
  .result-btn {
    display: inline-block;
    color: #1890ff;
    padding: 6px 20px;
    border: 1px solid #eeeeee;
    border-radius: 2px;
    vertical-align: middle;
    font-size: 14px;
    transition: all 0.5s;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      border-color: #1890ff;
    }
    &.red {
      color: #db302e;
      &:hover {
        border-color: #db302e;
      }
    }
    &.green {
      color: #5ae676;
      &:hover {
        border-color: #5ae676;
      }
    }
    & + .result-btn {
      margin-left: 10px;
    }
  }
}
.switch-box {
  margin-top: 10px;
  .switch-status-loading {
    color: #1890ff;
  }
}
.result-sp {
  display: inline-block;
  vertical-align: middle;
  color: #666;
  font-size: 12px;
  .result-txt {
    font-weight: 600;
    font-size: 16px;
    &.green {
      color: #5ae676;
    }
    &.red {
      color: #db302e;
    }
  }
}
</style>

