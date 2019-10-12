import {
  checkStateList
} from "@/api/testFunction";
import {
  stateCodes,
  handlerItemLogData
} from "@/utils/functionUtil";

import Vue from "vue";
import wsUtil from "@/utils/wsUtil";
const state = {
  isInit: "", // test主页面是否已经准备完毕，子界面只有在主界面初始化后才可初始化
  logData: [], // 检测功能页面table日志列表，根据当前的测试功能和测试步骤 activeStepIndex决定
  activeFunction: {
    // 当前选中的测试功能项 包括当前项的检测状态和默认配置json
    title: "",
    info: {},
    flows: [{}]
  },
  activeType: "", // 当前选择测试的功能名称 必须function里面的各个modules里面的mixins一致
  deviceData: {}, // 选中的终端数据
  socketStatus: "wait",
  functionStateList: {
    // 从服务器获取的功能列表的测试结果、
  },
  count: 0, // 开始计数的数量
  lensId: null, // 多媒体通道id
  stepStatusList: {}, // 当前功能的测试步骤状态。
  socketCtrol: null
};
const mutations = {
  SET_IS_INIT(state, val) {
    state.isInit = val;
  },
  SET_ACTIVE_TYPE(state, val) {
    state.activeType = val;
  },
  RESET_LOGDATA(state) {
    state.logData = [];
    this.commit("testFunction/getterCount");
  },
  UNSHIFT_LOGDATA(state, newRow) {
    // 添加单条数据
    newRow["_index"] = state.logData.length + 1;
    handlerItemLogData(newRow);
    state.logData.unshift(newRow);
    this.commit("testFunction/getterCount");
  },
  SET_LOGDATA(state, data) {
    // 设置日志数据
    var len = data.length;
    data.map((item, index) => {
      item["_index"] = len - index;
      handlerItemLogData(item);
    });
    state.logData = data;
    this.commit("testFunction/getterCount");
  },
  SET_ACTIVE_FUNCTION: (state, data) => {
    state.activeFunction = data;
  },
  SET_DEVICE_DATA(state, data) {
    state.deviceData = data;
  },
  SET_SOCKET_STATUS(state, status) {
    state.socketStatus = status;
  },
  setSocketCtrol(state, socket) {
    state.socketCtrol = socket;
  },
  setFunctionStateList(state, data) {
    Vue.set(state, "functionStateList", data);
  },
  SET_ITEM_FUNCTION_STATE(state, data) {
    // 设置某项功能测试不通过
    Vue.set(
      state.functionStateList,
      data.key,
      Object.assign({}, state.functionStateList[data.key], {
        state: data.state
      })
    );
    this.commit("testFunction/setFunctionStateList", state.functionStateList);
  },
  getterCount(state) {
    const len = state.logData.length;
    if (len === 0) {
      state.count = 0;
      return;
    }
    console.log(state.logData[0]);
    state.count =
      state.logData[0].count === undefined || state.logData[0].count === null ?
      state.count :
      state.logData[0].count;
  },

  resetCount(state) {
    state.count = 0;
  },
  setStepStatusList(state, data) {
    state.stepStatusList = data;
  }
};
const actions = {
  getFunctionStateList({
    commit
  }, params) {
    //
    return new Promise((succCall, failCall) => {
      checkStateList(params)
        .then(rst => {
          if (rst.code === 0) {
            if (rst.data && rst.data.length > 0) {
              var result = {};
              rst.data.map(item => {
                result[item.function] = item;
              });
              commit("setFunctionStateList", result);
            }
          }
          succCall(rst);
        })
        .catch(e => {
          failCall(e);
        });
    });
  },
  reset({
    commit
  }) {
    // 重置当前所有状态
    commit("SET_SOCKET_STATUS", "wait");
    commit("SET_IS_INIT", false);
    commit("RESET_LOGDATA", []);
    commit("SET_ACTIVE_FUNCTION", {
      title: "",
      info: {},
      flows: [{}]
    });
    commit("SET_DEVICE_DATA", {});
    commit("SET_SOCKET_STATUS", "loading");
    commit("setFunctionStateList", {});
  },
  resetCount({
    commit
  }) {
    commit("resetCount");
  },
  setStepStatusList({
    commit
  }, data) {
    commit("setStepStatusList", data);
  },
  openWs({
    commit
  }) {
    // 开启ws
    var socketCtrol = new wsUtil({
      url: "ws://" + "119.57.120.107" + ":8011/websocket/jt808" + "?sid=" + this.getters.sessionId + "&sim=" + this.state.testFunction.deviceData.sim + "&function=" + this.state.testFunction.activeFunction.function,
      //url: 'ws://' + window.location.hostname + ':8011/websocket/jt808' + '?sid=' + this.getters.sessionId + '&sim=' + this.state.testFunction.deviceData.sim + '&function=' + this.state.testFunction.activeFunction.function,
      isNotRelink: true,
      onopen: () => {
        commit("setSocketCtrol", socketCtrol);
        commit("SET_SOCKET_STATUS", "success");
      },
      onerror: () => {
        commit("SET_SOCKET_STATUS", "error");
        commit("setSocketCtrol", null);
        Vue.$vm.$emit("onWebScoketError");
      },
      onclose: () => {
        commit("setSocketCtrol", null);
        commit("SET_SOCKET_STATUS", "wait");
      },
      onmessage: data => {
        if (typeof data === "object") {
          // 只有object才是数据
          switch (
            data.socketType // 消息类型
          ) {
            case "vehStatus": // 设备状态(弃用)
              break;
            default:
              commit("UNSHIFT_LOGDATA", data);
          }
        }
      }
    });
  },
  closeWs({
    commit
  }) {
    var socketCtrol = this.state.testFunction.socketCtrol;
    socketCtrol && socketCtrol.close();
  },
  confirmOpenWs({
    commit
  }) {
    // 判断是否可以开启ws
    var stepStatusList = this.state.testFunction.stepStatusList;
    const functionResult = stepStatusList[0];
    const step1Result = stepStatusList[1];
    const functionHasResult = [stateCodes.success, stateCodes.error]; // 是否测试通过或者不通过
    console.log("step1Result", step1Result);
    if (
      functionHasResult.includes(functionResult) ||
      stateCodes.success !== step1Result
    ) {
      // 有测试结果或第一步骤不通过的时候不连接webSocket
      this.dispatch("testFunction/closeWs");
    } else if (stateCodes.success === step1Result) {
      this.dispatch("testFunction/openWs");
    }
  }
};
const getter = {
  count: state => {
    console.log(state);
    return 1;
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getter
};
