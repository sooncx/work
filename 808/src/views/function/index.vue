<template>
  <div
    v-loading="initStatus==='loading'"
    v-bError="initStatus==='error'"
    bError-msg="网络异常,"
    class="page-wrap test-page"
    @bError-onReset="onReset"
  >
    <section class="device-header-function">
      <pTitle
        title="测试终端信息"
        class="header-info"
      >
        <div
          slot="right"
          class="header-info-right"
        >
          <el-button
            type="primary"
            size="mini"
            plain
            @click="confirmCloseChangeState"
          >本轮结束</el-button>
          <div
            v-if="deviceData"
            class="clr device-info"
          >
            <div class="col-property">
              <span class="sp-title">手机号:</span>
              <span class="sp-cont">{{ deviceData.sim }}</span>
            </div>
            <div class="col-property clear">
              <span class="sp-title">终端型号:</span>
              <span class="sp-cont">{{ deviceData.terminalType }}</span>
            </div>
            <div class="col-property clear">
              <span class="sp-title">终端编号:</span>
              <span class="sp-cont">{{ deviceData.terminalNo }}</span>
            </div>
            <div class="col-property clear">
              <span class="sp-title">最后上报时间:</span>
              <span class="sp-cont">{{ deviceData.lastUpDataTime }}</span>
            </div>
            <div class="col-property clear">
              <span class="sp-title">状态:</span>
              <span class="sp-cont">{{ deviceData.vehStatusTxt||'离线' }}</span>
            </div>
          </div>
        </div>
      </pTitle>
    </section>
    <div
      v-if="deviceData"
      class="test-cont"
    >
      <div class="test-cont-left">
        <el-scrollbar
          v-if="initStatus==='success'"
          class="leftMenuScroll"
          wrap-class="scrollbar-wrapper"
        >
          <functionMenu
            :active-type="activeType"
            :data="getterFunctionList"
            :flag="flag"
            @toTestPage="afterLeaveFunctionConfirm"
          />
        </el-scrollbar>
      </div>
      <div
        v-loading="getHistoryLogStatus==='loading'"
        v-bError="getHistoryLogStatus==='error'"
        class="test-cont-right"
        b-error-msg="获取历史记录失败"
        @bError-onReset="getHistoryLog"
      >
        <transition
          name="fade-transform"
          mode="out-in"
        >
          <router-view
            :key="activeType"
            class="text-item-page"
          />
        </transition>
      </div>
    </div>
    <!--  -->
    <el-dialog
      title="结束检测"
      :visible.sync="isShowEndTestDialog"
      width="700px"
      center
    >
      <el-form
        size="mini"
        label-width="90px"
      >
        <el-form-item label="检测结果">
          <el-select
            v-model="endTestForm.checkName"
            placeholder="请选择测试结果"
          >
            <el-option
              v-for="(item,index) in checkNameOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述内容">
          <el-input
            v-model="endTestForm.remark"
            type="textarea"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isShowEndTestDialog = false">取 消</el-button>
        <el-button
          v-loading="isSubmitEndTest"
          type="primary"
          @click="doCloseChangeState(endTestForm,getterFunctionList,endTestForm.checkName)"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { stateCodes } from "@/utils/functionUtil";
import functionList from "@/json/functionList/index.js";
import devLongRemark from "@/json/devLongRemark.js";
import pTitle from "@/components/pTitle";
import functionMenu from "./components/functionMenu";
import { terminalInfo, changeState, getHistoryLog } from "@/api/testFunction";
import { getStateTxt } from "@/utils/functionUtil";

export default {
  name: "FunctionIndex",
  components: {
    pTitle,
    functionMenu
  },
  data() {
    const checkNameOptions = [
      {
        label: "不通过",
        value: "0"
      }
    ];
    Object.keys(functionList).map(key => {
      var itemFunction = functionList[key];
      var itemValue = String(itemFunction.function);
      if (itemFunction.children) {
        var subValues = [];
        Object.keys(itemFunction.children).map(subKey => {
          subValues.push(itemFunction.children[subKey].function);
        });
        subValues.sort((a, b) => {
          return Number(a) - Number(b);
        });
        itemValue = subValues.join(",");
      }
      checkNameOptions.push({
        label: itemFunction.title + "通过",
        value: itemValue
      });
    });
    return {
      cx: null,
      pass: [],
      unpass: [],
      passNum: null,
      unpassNum: null,
      test: null,
      flag: true,
      stateCodes,
      functionList,
      checkNameOptions,
      isShowEndTestDialog: false, // 是否显示结束检测未通过项表达
      isSubmitEndTest: false, // 是否在提交结束检测中
      endTestForm: {
        checkName: "",
        remark: ""
      },
      deviceData: JSON.parse(this.$route.query.deviceData),
      activeType: "",
      initStatus: "loading",
      isShowSocketAlart: false, // 避免重新弹出确认
      getHistoryLogStatus: "loading", // 切换功能的时候获取当前的webSocket历史记录
      /** ****轮询获取车辆在线状态***** */
      vehStatus: "offline",
      autoUpdateVehStatusTime: {
        online: 50000,
        offline: 10000
      },
      autoUpdateVehStatusTimer: null,
      isDestroyed: false // 是否已经销毁
    };
  },
  computed: {
    activeFuntion() {
      if (!this.activeType) return {};
      var result = this.getterFunctionList;
      var keyArr = String(this.activeType).split("/");

      keyArr.map((item, index) => {
        if (index > 0) {
          result = result["children"];
        }
        result = result[item];
      });

      return result;
    },
    functionStateList() {
      return this.$store.state.testFunction.functionStateList;
    },
    getterFunctionList() {
      var result = {};
      Object.keys(this.functionList).map(key => {
        var item = this.functionList[key];
        if (item.children) {
          var subResult = {};
          var successNum = 0;
          Object.keys(item.children).map(subKey => {
            var subItem = item.children[subKey];
            var newSubItem = Object.assign(
              {},
              this.functionStateList[subItem.function],
              subItem
            );
            newSubItem.subKey = subKey;
            newSubItem.stateTxt = getStateTxt({ state: newSubItem.state });
            subResult[subKey] = newSubItem;
            if (newSubItem.state === this.stateCodes.success) {
              successNum++;
            }
            this.test = successNum;
          });
          result[key] = Object.assign({}, item, {
            children: subResult,
            successNum
          });
        } else {
          var newItem = Object.assign(
            {},
            this.functionStateList[item.function],
            item
          );
          newItem.key = key;
          newItem.stateTxt = getStateTxt({ state: newItem.state });
          result[key] = newItem;
        }
      });
      return result;
    },
    stepStatusList() {
      return this.$store.state.testFunction.stepStatusList;
    },
    socketStatus() {
      return this.$store.state.testFunction.socketStatus;
    }
  },
  watch: {
    initStatus(val) {
      this.$store.commit("testFunction/SET_IS_INIT", val);
    },

    deviceData: {
      deep: true,
      handler(val) {
        this.$store.commit("testFunction/SET_DEVICE_DATA", val);
      }
    },
    activeFuntion: {
      deep: true,
      handler(val) {
        this.$store.commit("testFunction/SET_ACTIVE_FUNCTION", val);
      }
    },
    activeType(val, oldVal) {
      this.resetLogData();
      this.changeWsFunction();
    }
  },
  created() {
    this.$root.$on("onWebScoketError", () => {
      this.$confirm("此设备正在测试中，是否顶替", "提示", {
        confirmButtonText: "顶替",
        cancelButtonText: "返回",
        type: "warning",
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false
      })
        .then(() => {
          this.openSocket();
        })
        .catch(e => {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push({ name: "TestManag" });
        });
    });
    window.f = this;
    if (!this.deviceData) {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({
        path: "/"
      });
    } else {
      this.$store.commit("testFunction/SET_DEVICE_DATA", this.deviceData);
      this.$nextTick(() => {
        this.init();
      });
    }
  },
  activated() {
    this.isDestroyed = false;
    const routeDeviceData = JSON.parse(this.$route.query.deviceData);
    if (
      !this.deviceData ||
      this.deviceData.terminalVehicleId !== routeDeviceData.terminalVehicleId
    ) {
      // 重新测试不同设备 刷新当前界面
      this.deviceData = routeDeviceData;
      this.$store.commit("testFunction/SET_DEVICE_DATA", this.deviceData);
      this.activeType = "";
      this.closeSocket();
      this.clearAutoUpdateVehStatusTimer();
      this.init();
    } else {
      this.autoUpdateVehStatus();
    }
  },
  deactivated() {
    this.isDestroyed = true;
    this.clearAutoUpdateVehStatusTimer();
  },
  destroyed() {
    this.isDestroyed = true;
    this.clearAutoUpdateVehStatusTimer();
    this.closeSocket();
    this.resetStore();
  },
  methods: {
    changeCheckName(data) {
      if (data) {
        let arr = data.split(",");
        if (arr[0] == 0) {
          return "不通过";
        } else if (arr[0] == 19) {
          return "定位通过";
        } else if (arr[0] == 23) {
          return "盲区补传通过";
        } else if (arr[0] == 4) {
          return "警示通过";
        } else if (arr[0] == 10) {
          return "设备操作通过";
        } else if (arr[0] == 14) {
          return "信息采集通过";
        } else if (arr[0] == 1) {
          return "多媒体通过";
        }
      } else {
        return "请选择";
      }
    },
    sendPassNum(data, data2) {
      var num = 0;
      for (var i in data) {
        //console.log(JSON.stringify(data[i]));
        if (data[i].children) {
          for (var j in data[i].children) {
            if (data[i].children[j].stateTxt == "检测通过") {
              this.pass.push(data[i].children[j].function);
              // console.log(
              //   "状态:" +
              //     JSON.stringify(data[i].children[j].title) +
              //     "---" +
              //     JSON.stringify(data[i].children[j].stateTxt) +
              //     "---" +
              //     JSON.stringify(data[i].children[j].function)
              // );
            } else if (data[i].children[j].stateTxt == "检测不通过 ") {
              this.unpass.push(data[i].children[j].function);
              // console.log(
              //   "状态:" +
              //     JSON.stringify(data[i].children[j].title) +
              //     "---" +
              //     JSON.stringify(data[i].children[j].stateTxt) +
              //     "---" +
              //     JSON.stringify(data[i].children[j].function)
              // );
            }
          }
        } else {
          if (data[i].stateTxt == "检测通过") {
            this.pass.push(data[i].function);
            // console.log(
            //   "状态:" +
            //     JSON.stringify(data[i].title) +
            //     "---" +
            //     JSON.stringify(data[i].stateTxt) +
            //     "---" +
            //     JSON.stringify(data[i].function)
            // );
          } else if (data[i].stateTxt == "检测不通过 ") {
            this.unpass.push(data[i].function);
            // console.log(
            //   "状态:" +
            //     JSON.stringify(data[i].title) +
            //     "---" +
            //     JSON.stringify(data[i].stateTxt) +
            //     "---" +
            //     JSON.stringify(data[i].function)
            // );
          }
        }
      }
      var arr = [];
      this.pass.filter(function(element, index, self) {
        if (self.indexOf(element) === index) {
          arr.push(element);
        }
      });
      this.pass = arr;
      var arr2 = [];
      arr2 = data2.split(",");
      var arr3 = [];
      for (let x = 0; x < arr.length; x++) {
        for (let y = 0; y < arr2.length; y++) {
          if (arr[x] == arr2[y]) {
            arr3.push(arr[x]);
          }
        }
      }
      this.passNum = arr3.join(",");
      //console.log("pass:" + this.passNum);

      var unarr = [];
      this.unpass.filter(function(element, index, self) {
        if (self.indexOf(element) === index) {
          unarr.push(element);
        }
      });
      this.unpass = unarr;
      var unarr2 = [];
      unarr2 = data2.split(",");
      var unarr3 = [];
      for (let x = 0; x < unarr.length; x++) {
        for (let y = 0; y < unarr2.length; y++) {
          if (unarr[x] == unarr2[y]) {
            unarr3.push(unarr[x]);
          }
        }
      }
      this.unpassNum = unarr3.join(",");
      //console.log("unpass:" + this.unpassNum);
    },
    devStartAutoAddLog() {
      setTimeout(() => {
        // var data = { 'checkLogId': 790, 'descp': '位置信息汇报', 'externData': '{"areaId":0,"posInfo":{"devTime":"2019-08-09 14:44:14","high":88.0,"lat":39.97461,"lon":116.323143,"speed":0.0},"roadId":0}', 'function': '行驶记录', 'logTime': 1565333054651, 'msgNo': '0200', 'msgSerial': 2298, 'originalData': '7E0200403C010000000001532106431308FA00000000000C00030261F6D206EEF34700580000000019080914441401040000000002020000030200002504000000002B0400000000300117310115B17E', 'remark': '位置信息:{时间:2019-08-09 14:44:14,速度:0.0,经度:116.323143,纬度:39.97461,高程:88.0,方向:0.0},<br/>报警信息：无,<br/>状态信息:{acc状态:开,定位状态:定位,经度:北纬,纬度:东经,经纬度加密:未加密,载重状态:空车,油路状态:正常,运营状态:运营,电路状态:正常,车门状态:车门解锁,前门(门1):关,中门(门2):关,中门(门3):关,驾驶度门(门4):关,自定义(门5):关,行驶状态:停车},<br/>定位模式:{GPS定位:使用,北斗定位:使用,GLONASS定位:未使用,Galileo定位:未使用},<br/>附加信息:{里程:0.0,油量:0.0,速度:0.0,模拟量:模拟量AD0:0,模拟量AD1:0}<br/>无线通信网络信号强度:23<br/>GNSS定位卫星数: 21', 'sim': '15321064313', 'source': '设备', 'terminalLogTime': 1565333054000, 'time': '2019-08-09 14:44:14 651' }
        // var b = Object.assign({}, devLongRemark, {
        //   remark: devLongRemark.remark ? devLongRemark.remark.substring(0, 2000) : '',
        //   allRemark: devLongRemark.remark
        // })
        this.$store.commit("testFunction/UNSHIFT_LOGDATA", devLongRemark);
        // this.devStartAutoAddLog()
      }, 100);
    },
    devAddLogCount(count) {
      var data = {
        count,
        checkLogId: 170,
        descp: "设置终端参数",
        function: "定位精度",
        logTime: 1562119909899,
        msgNo: "8103",
        msgSerial: 39,
        originalData: "7E810300070000000000013120190621005A01000000900102637E",
        packNo: 0,
        packTotal: 0,
        remark: "设置终端参数（单北斗“单DB2”模式）（步骤2）",
        sim: "13120190621",
        source: "系统",
        time: "2019-07-03 10:11:49",
        type: "19-2-1"
      };
      var remark = "12345678";
      for (var i = 0; i < 10; i++) {
        remark = remark + "" + remark;
      }
      console.log(remark.length);
      data.remark = remark;
      this.$store.commit("testFunction/UNSHIFT_LOGDATA", data);
    },
    init() {
      this.isShowSocketAlart = false;
      this.initStatus = "loading";
      this.getTerminalInfo()
        .then(rst => {
          // 不能同时请求，必须先获取最新的数据
          if (rst.code === 0) {
            if (rst.data.websocketState) {
              // true当前车辆正在连接中
              this.$confirm("此设备正在测试中，是否顶替", "提示", {
                confirmButtonText: "顶替",
                cancelButtonText: "返回",
                type: "warning",
                showClose: false,
                closeOnPressEscape: false,
                closeOnClickModal: false
              })
                .then(() => {
                  this.initSetTerminalInfoAfter(rst);
                })
                .catch(e => {
                  this.$store.dispatch("tagsView/delView", this.$route);
                  this.$router.push({ name: "TestManag" });
                });
            } else {
              this.initSetTerminalInfoAfter(rst);
            }
          }
        })
        .catch(e => {
          console.error(e);
          this.initStatus = "error";
        });
    },
    onReset() {
      this.init();
    },
    initSetTerminalInfoAfter(rst) {
      // rst.data.function = rst.data.function || 22;
      rst.data.function = 22;
      //进入任意测试选项锁定默认显示22号
      if (!this.getterFunctionList[rst.data.function]) {
        // 如果是包含在children里面的
        Object.keys(this.getterFunctionList).map(fKey => {
          var item = this.getterFunctionList[fKey];
          if (item.children) {
            Object.keys(item.children).map(subKey => {
              if (Number(subKey) === Number(rst.data.function)) {
                rst.data.function = fKey + "/" + subKey;
              }
            });
          }
        });
      }
      this.activeType = rst.data.function;
      this.$store.commit("testFunction/SET_ACTIVE_TYPE", this.activeType);
      if (this.activeType) {
        this.$router.push({
          name: "FunctionStandard",
          query: {
            type: this.activeType,
            deviceData: JSON.stringify(this.deviceData)
          }
        });
      }
      this.checkStateList()
        .then(rst => {
          if (rst.code === 0) {
            this.initStatus = "success";
            this.autoUpdateVehStatus();
          } else {
            this.initStatus = "error";
          }
        })
        .catch(e => {
          console.error(e);
          this.initStatus = "error";
        });
    },
    resetLogData() {
      this.$store.commit("testFunction/RESET_LOGDATA");
    },
    resetStore() {
      // 退出当前重置所有
      this.$store.dispatch("testFunction/reset");
    },
    closeSocket() {
      this.$store.dispatch("testFunction/closeWs");
    },
    openSocket() {
      console.log("openSocket");
      this.$store.dispatch("testFunction/openWs");
    },
    changeWsFunction() {
      if (this.activeType) {
        this.getHistoryLog();
      }
    },
    getHistoryLog() {
      // 先获取日志详细日志
      this.getHistoryLogStatus = "loading";
      // console.log(
      //   "this.activeFuntion.function:" + JSON.stringify(this.activeFuntion)
      // );
      // console.log("this.deviceData.sim:" + this.deviceData.sim);
      getHistoryLog({
        function: this.activeFuntion.function,
        sim: this.deviceData.sim
      })
        .then(rst => {
          if (rst.code === 0) {
            if (rst.data && rst.data.length > 0) {
              this.$store.commit("testFunction/SET_LOGDATA", rst.data);
            }
            this.getHistoryLogStatus = "success";
          } else {
            this.getHistoryLogStatus = "error";
          }
        })
        .catch(e => {
          this.getHistoryLogStatus = "error";
        });
    },
    getTerminalInfo() {
      // 获取设备详情
      return new Promise((succCall, failCall) => {
        terminalInfo({
          num: this.deviceData.num,
          terminalVehicleId: this.deviceData.terminalVehicleId
        })
          .then(rst => {
            if (rst.code === 0 && rst.data) {
              rst.data.stateTxt = getStateTxt({ state: rst.data.state });
              rst.data.vehStatusTxt = rst.data.vehicleState ? "在线" : "离线";
              this.$set(
                this,
                "deviceData",
                Object.assign(this.deviceData, rst.data)
              );
              this.vehStatus = rst.data.vehicleState ? "online" : "offline";
            }

            succCall(rst);
          })
          .catch(e => {
            failCall(e);
          });
      });
    },
    afterLeaveFunctionConfirm({ data, key }) {
      // 切换功能前 限制切换
      const notTestCondition = [
        undefined,
        this.stateCodes.undetected,
        this.stateCodes.process
      ]; // 当前功能未测试
      const stepSuccessCondition = [this.stateCodes.success]; // 第一个步骤通过
      console.log(1);
      /**
       * 可以切换的前提：
       *    1.已有测试结果（测试通过|测试不通过）+第一个步骤通过-切换功能
       *    2.未测试+第一个步骤不通过
       *
       */
      if (
        !notTestCondition.includes(this.stepStatusList[0]) ||
        (notTestCondition.includes(this.stepStatusList[0]) &&
          !stepSuccessCondition.includes(this.stepStatusList[1]))
      ) {
        this.toTestPage({ data, key });
      } else {
        this.$message({
          type: "info",
          message: "请先测试完本轮功能"
        });
      }
    },
    toTestPage({ data, key }) {
      // 切换测试功能
      this.activeType = key;
      this.$store.commit("testFunction/SET_ACTIVE_TYPE", this.activeType);
      this.$router.push({
        name: data.routerName,
        query: {
          type: this.activeType,
          deviceData: JSON.stringify(this.deviceData)
        }
      });
      this.$store.dispatch("testFunction/closeWs");
    },
    checkStateList() {
      // 获取功能列表检测状态
      return this.$store.dispatch("testFunction/getFunctionStateList", {
        num: this.deviceData.num,
        terminalVehicleId: this.deviceData.terminalVehicleId
      });
    },
    confirmCloseChangeState() {
      var undetectedList = {};
      Object.keys(this.getterFunctionList).map(key => {
        var item = this.getterFunctionList[key];
        this.cx = item;
        if (item.children) {
          var subUndetectedList = {};
          Object.keys(item.children).map(subKey => {
            var subItem = item.children[subKey];

            if (
              subItem.state === this.stateCodes.undetected ||
              subItem.state === undefined
            ) {
              subUndetectedList[key] = Object.assign({}, subItem);
            }
          });
          if (JSON.stringify(subUndetectedList) !== "{}") {
            undetectedList[key] = subUndetectedList;
          }
        } else {
          if (
            item.state === undefined ||
            item.state === this.stateCodes.undetected
          ) {
            undetectedList[key] = Object.assign({}, item);
          }
        }
      });
      if (JSON.stringify(undetectedList) !== "{}") {
        this.$confirm("还有未检测功能，您确认结束检测？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.isShowEndTestDialog = true;
          })
          .catch(() => {});
      } else {
        this.isShowEndTestDialog = true;
        //this.doCloseChangeState(this.endTestForm);
      }

      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     });
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     });
      //   });
    },
    doCloseChangeState(params, data, data2) {
      this.sendPassNum(data, data2);
      // 结束检测 如果params不为空 则是填写表单通过方式
      if (params.checkName === "") {
        this.$message({
          message: "请选择测试结果",
          type: "warning"
        });
        return;
      }
      this.isSubmitEndTest = true;
      changeState(
        Object.assign(
          {
            state: this.$store.getters.switch,
            checkName: "",
            id: this.deviceData.checkLogId,
            remark: "",
            passNum: this.passNum,
            notPassNum: this.unpassNum,
            passName: this.changeCheckName(data2)
          },
          params
        )
      )
        .then(rst => {
          if (rst.code === 0) {
            this.$message({
              message: "本轮测试结束",
              type: "success"
            });
            // this.endTestForm.checkName = "";
            this.endTestForm.remark = "";
            this.isShowEndTestDialog = false;
            this.$store.dispatch("tagsView/delCachedView", {
              name: "FunctionIndex"
            });
            this.$store.commit("tagsView/DEL_VISITED_VIEW", this.$route);

            this.$router.push({ name: "TestManag" });
          } else {
            this.isSubmitEndTest = false;
          }
        })
        .catch(e => {
          this.isSubmitEndTest = false;
        });
    },
    clearAutoUpdateVehStatusTimer() {
      this.autoUpdateVehStatusTimer &&
        clearTimeout(this.autoUpdateVehStatusTimer);
      this.autoUpdateVehStatusTimer = null;
    },
    autoUpdateVehStatus() {
      if (this.isDestroyed) {
        return;
      }
      this.clearAutoUpdateVehStatusTimer();
      this.autoUpdateVehStatusTimer = setTimeout(() => {
        this.getTerminalInfo()
          .then(() => {
            this.autoUpdateVehStatus();
          })
          .catch(e => {
            this.autoUpdateVehStatus();
          });
      }, this.autoUpdateVehStatusTime[this.vehStatus] || this.autoUpdateVehStatusTime.online);
    }
  }
};
</script>

<style lang="scss" scoped>
.test-page {
  display: flex;
  flex-direction: column;
  padding: 0;
  background: #f3f3f3;
}
.text-item-page {
}
.test-cont {
  padding: 0;
  display: flex;
  flex: 1;
  > .test-cont-left {
    font-size: 12px;
    width: 260px;
    margin-right: 10px;
    background: #fff;
    // background: #999;
    // height: 3000px;
    height: 100%;
    overflow-x: hidden;
    position: relative;
    .leftMenuScroll {
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
      height: 100%;
    }
  }
  > .test-cont-right {
    flex: 1;
    overflow: hidden;
    height: 100%;
    position: relative;
    > .text-item-page {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
    }
  }
}

.device-info {
  background: #fff;
  padding: 0 15px;
  line-height: 24px;
  font-size: 12px;
  .col-property {
    float: left;
    color: #333;
    & + .col-property {
      margin-left: 16px;
    }
    .sp-title {
      vertical-align: middle;
      text-align: right;
      display: inline-block;
    }
    .sp-cont {
      vertical-align: middle;
      display: inline-block;
    }
  }
}
.device-header-function {
  // margin-top: 8px;
  padding: 0 8px;
  margin-bottom: 8px;
  background: #fff;
}
.header-info {
  padding-top: 4px;
  padding-bottom: 4px;

  .header-info-right {
    padding-left: 30px;
    display: flex;
    align-items: center;
    .device-info {
      margin-left: 10px;
    }
  }
}
</style>

