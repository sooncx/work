<template>
  <el-dialog
    :visible.sync="visible"
    :width="isSingle ? '490px' : '700px'"
    title="短信下发"
    @open="paramsInit()"
  >
    <div class="dialog-content">
      <div class="dialog-left">
        <div
          class="sms-content"
          ref="smsContent"
        >
          <div
            class="dialog-item"
            v-for="(item,index) in smsDialogue"
            :key="index"
            :class="item.type"
          >
            <div class="timestamp">{{ item.timestamp }}</div>
            <div class="dialog">
              <div class="user-icon">
                <img :src="item.type === 'left' ? require('@/public/img/other/sms_sim.png') : require('@/public/img/other/sms_header.png')">
              </div>
              <div
                class="error-icon"
                v-if="item.type === 'right'"
              >
                <i
                  v-if="item.status === 1"
                  class="iconfont icon-sync rotate"
                ></i>
                <i
                  v-if="item.status === 2"
                  class="iconfont icon-gantanhao"
                ></i>
              </div>
              <div class="sms-content">{{ item.text }}</div>
            </div>
          </div>
        </div>
        <div class="sms-footer">
          <div class="send-option">
            <div @click="handleCommand('查询参数')">查询参数</div>
            <div @click="handleCommand('查询版本')">查询版本</div>
            <div @click="handleCommand('查询终端参数')">查询终端参数</div>
            <div @click="handleCommand('超长待机指令')">超长待机指令</div>
          </div>
          <div class="send-msg">
            <textarea
              rows="5"
              v-model="smsContent"
              placeholder="请输入下发内容"
            ></textarea>
            <div class="btn-wrap">
              <el-checkbox v-model="isGroupSend">群发</el-checkbox>
              <el-button
                size="small"
                type="primary"
                @click="sendBatchSms()"
              >下发</el-button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="dialog-right simList"
        v-if="!isSingle"
      >
        <div
          class="sim-item"
          v-for="(item, index) in selectArr"
          :key="index"
          @click="handlerSimNodeClick(item, index)"
          :class="{'active': activeIndex === index}"
        >
          <span>SIM卡号：</span>
          <my-badge
            :type="item.type"
            :text="item.simCard"
            :breath="true"
          ></my-badge>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { toDate } from "@/util/common";
import myBadge from "@/components/myBadge/";
export default {
  methods: {
    handleCommand(command) {
      switch (command) {
        case "查询参数":
          this.smsContent = "<CKBSJ>";
          break;
        case "查询版本":
          this.smsContent = "<CKVER>";
          break;
        case "查询终端参数":
          this.smsContent =
            "<SPBSJ*P:BSJGPS*T:219.133.034.198,7788*U:000.000.000.000,0000*A:CMNET*N:13418181818>";
          break;
        case "超长待机指令":
          this.smsContent =
            "<SPBSJ*P:BSJGPS*U:120.025.232.237,6688*A:CMNET*N:18800000001*R:1200*D:060* G:00*W:1,16,0000*O:1>";
          break;
      }
    },
    sendBatchSms() {
      try {
        if (this.smsContent === "") throw "请输入下发内容！";
        if (!this.row && !this.isGroupSend) throw "请选择SIM卡！";
      } catch (error) {
        this.$message({
          message: error,
          type: "warning"
        });
        return;
      }

      let params = {
        content: this.smsContent
      };

      if (this.isGroupSend) {
        let iccidArr = new Array();
        this.selectArr.map((item, index) => {
          this.$set(this.selectArr[index], 'type', "warning")
          iccidArr.push(item.iccid);
        });
        params.iccids = iccidArr.join(",");
      } else {
        params.iccids = this.row.iccid;
      }

      let createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
      this.nowSendMsgData.push({
        createTime,
        status: 1,
        msg: this.smsContent
      });
      

      let smsIndex = this.nowSendMsgData.length - 1; //存下push进去的位置
      this.smsContent = ""; //发送之前清空输入框
      // return;
      this.$API
        .sendBatchSms(params)
        .then(res => {
          this.setNowSendMsgData(smsIndex, res.data, 1); //增加loading状态
          this.getSendSmsStatus(smsIndex, res.data, params.iccids, createTime); //轮询接口
        })
        .catch(err => {
          this.setNowSendMsgData(smsIndex, err.data, 2); //发送错误
        });
    },
    getSendSmsStatus(smsIndex, contentId, iccids, createTime) {
      let timer = setInterval(() => {
        let params = {
          contentId, //内容ID	string	短信下发时返回的内容ID
          iccids //物联网卡ICCID	string	多个用逗号隔开
        };
        if (!this.visible) clearInterval(timer);
        this.$API
          .getSendSmsStatus(params)
          .then(res => {
            if (!res.data.length) return;
            clearInterval(timer);
            this.setNowSendMsgData(smsIndex, contentId, 0);

            let arr = new Array();
            res.data.map(item => {
              arr.push(item.dest_id);
            });
            arr.length > 1
              ? this.getDevReplyNewOne(arr.join(","), 10, createTime)
              : this.getDevReply(arr[0], 10);
          })
          .catch(err => {
            clearInterval(timer);
            this.setNowSendMsgData(smsIndex, contentId, 2);
          });
      }, 1000);
      this.$once("hook:beforeDestory", () => {
        clearInterval(timer);
      });
    },
    getDevReplyNewOne(cardNo, counts, createTime) {
      //counts 轮询次数
      let num = 0;
      let timer = setInterval(() => {
        num++;
        if (num === counts) clearInterval(timer);
        if (!this.visible) clearInterval(timer);
        this.$API
          .getDevReplyNewOne({ cardNo })
          .then(res => {
            this.selectArrChange(res.data, createTime);
          })
          .catch(err => {
            clearInterval(timer);
          });
      }, 1000);
      this.$once("hook:beforeDestory", () => {
        clearInterval(timer);
      });
    },
    getDevReply(cardNo, counts) {
      //counts 轮询次数
      let num = 0;
      let timer = setInterval(() => {
        num++;
        if (num === counts) clearInterval(timer);
        if (!this.visible) clearInterval(timer);
        this.$API
          .getDevReply({ cardNo })
          .then(res => {
            if (!res.data.length) return;
            clearInterval(timer);
            this.devReplyData = res.data;
          })
          .catch(err => {
            clearInterval(timer);
          });
      }, 1000);
      this.$once("hook:beforeDestory", () => {
        clearInterval(timer);
      });
    },
    selectArrChange(data, createTime) {
      let arr = new Array();
      //建立映射
      this.selectArr.map((item, index) => {
        arr.push(item.simCard);
      });
      data.map(item => {
        let type = "";
        let nowTime = toDate(createTime).getTime();
        let recvTime = toDate(item.recv_time).getTime();
        if (recvTime > nowTime) {
          let i = arr.indexOf(item.dest_id);
          let type = i === -1 ? "warning" : "success";
          this.$set(this.selectArr[i], 'type', type)
        } 
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (!this.$refs.smsContent) return;
        this.$refs.smsContent.scrollTop = this.$refs.smsContent.scrollHeight; //自动滚动到底部
      });
    },
    handlerSimNodeClick(item, index) {
      this.row = item;
      this.activeIndex = index;
      this.msgInit();
    },
    setNowSendMsgData(smsIndex, contentId, status) {
      if (this.nowSendMsgData[smsIndex]) {
        let obj = this.nowSendMsgData[smsIndex];
        obj.status = status;
        this.$set(this.nowSendMsgData, smsIndex, obj);
      }
      //请求成功时才将contentId存起来
      if (typeof contentId === "string") {
        this.$set(this.contentIdObj, contentId, { status });
      }
    },
    paramsInit() {
      this.isGroupSend = false;
      this.contentIdArr = [];
      this.smsContent = "";
      this.nowSendMsgData = [];
      this.sendMsgData = [];
      this.devReplyData = [];
    },
    async msgInit() {
      this.nowSendMsgData = [];
      this.sendMsgData = [];
      this.devReplyData = [];

      let devReplyRes = await this.$API.getDevReply({
        cardNo: this.row.simCard
      });

      let sendMsgRes = await this.$API.getSendMsg({
        simCard: this.row.simCard
      });

      try {
        if (devReplyRes.code !== 0) throw devReplyRes.msg;
        this.devReplyData = devReplyRes.data;
        if (sendMsgRes.code !== 0) throw sendMsgRes.msg;
        this.sendMsgData = sendMsgRes.data;
      } catch (error) {
        return;
      }
    }
  },

  watch: {
    visible(val) {
      if (val && this.isSingle) {
        this.msgInit();
      }
    }
  },

  computed: {
    smsDialogue() {
      //item.status 0正常 1Loading 2错误
      this.sendMsgData.map(item => {
        if (this.contentIdObj[item.contentId]) {
          item.status = this.contentIdObj[item.contentId].status;
        }
      });

      let defaultArr = [
        ...this.sendMsgData,
        ...this.devReplyData,
        ...this.nowSendMsgData
      ];

      defaultArr.sort((a, b) => {
        let x = a.createTime
          ? toDate(a.createTime).getTime()
          : toDate(a.recv_time).getTime();

        let y = b.createTime
          ? toDate(b.createTime).getTime()
          : toDate(b.recv_time).getTime();

        return x - y;
      });

      let arr = new Array();

      defaultArr.map(item => {
        if (item.msg_id) {
          arr.push({
            type: "left",
            text: item.msg_content,
            timestamp: item.recv_time
          });
        } else {
          arr.push({
            type: "right",
            status: item.status ? item.status : 0,
            text: item.msg,
            timestamp: item.createTime
          });
        }
      });

      this.scrollToBottom();

      return arr;
    }
  },

  data() {
    return {
      visible: false,
      smsContent: "", //下发内容	string
      row: null,
      isSingle: false, //判断是否单条数据
      isGroupSend: false, //在批量状态下判断是否群发
      activeIndex: null,
      nowSendMsgData: [],
      sendMsgData: [],
      devReplyData: [],
      contentIdObj: {}, //储存下发状态,如果切换则在这里面找是否loading状态
      selectArr: []
    };
  },

  components: {
    myBadge
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/mixin.scss";


/deep/ .el-dialog {
  .el-dialog__body {
    background: #f7f9fb;
    padding: 0;
  }
  .el-dialog__footer {
    border-top: 1px solid #ebf0f4;
    padding: 20px 20px 20px;
    background: #f7f9fb;
  }
}

.dialog-content {
  height: 500px;
  display: flex;
}

.dialog-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  .sms-content {
    flex: 1;
    padding: 50px 20px 20px;
    overflow: auto;
    @include scrollBar;
    .dialog-item {
      display: flex;
      padding: 0 60px;
      position: relative;
      .timestamp {
        padding: 10px 0;
        font-size: 12px;
        color: #999ea8;
        text-align: center;
        position: absolute;
        top: -40px;
        width: 100%;
        right: 0;
      }
      .dialog {
        position: relative;
        border-radius: 4px;
        min-height: 40px;
        &:after {
          content: "";
          position: absolute;
          top: 12px;
          border: solid transparent;
          border-width: 8px;
        }
        .user-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .sms-content {
          padding: 10px;
          font-size: 14px;
          color: #333;
          word-break: break-word;
        }
      }
      &:not(:nth-last-child(1)) {
        margin-bottom: 60px;
      }
    }
    .dialog-item.left {
      .dialog {
        background: #ffffff;
        &:after {
          left: -15px;
          border-right-color: #ffffff;
        }
        .user-icon {
          left: -40px;
          img {
            width: 19px;
            height: 26px;
          }
        }
        .sms-content {
          padding-left: 20px;
        }
      }
    }
    .dialog-item.right {
      flex-direction: row-reverse;
      .dialog {
        background: #98e165;
        &:after {
          right: -15px;
          border-left-color: #98e165;
        }
        .user-icon {
          right: -40px;
          img {
            width: 18px;
            height: 22px;
          }
        }
        .error-icon {
          position: absolute;
          left: -25px;
          top: 50%;
          transform: translateY(-50%);
          .icon-gantanhao {
            color: #d91414;
          }
        }
        .sms-content {
          max-width: 300px;
          padding-right: 20px;
        }
      }
    }
  }
  .sms-footer {
    border-top: 1px solid #ebf0f4;
    padding: 0 10px 10px;
    background: #f7f9fb;
    .send-option {
      display: flex;
      padding: 10px 0;
      div {
        display: inline-flex;
        align-items: center;
        padding: 0 5px;
        height: 30px;
        color: #999;
        background: #EBF0F4;
        cursor: pointer;
        &:not(:nth-child(1)) {
          margin-left: 10px;
        }
        &:hover{
          color: $btnColor;
          background: #E2F2FF;
        }
      }
    }
    .send-msg {
      display: flex;
      textarea {
        flex: 1;
        margin-right: 10px;
        background: #ebf0f4;
      }
      .btn-wrap {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
      }
      .el-button {
        margin-top: 30px;
        width: 70px;
      }
    }
  }
}
.dialog-right.simList {
  width: 210px;
  border-left: 1px solid #ebf0f4;
  overflow: auto;
  @include scrollBar;
  .sim-item {
    cursor: pointer;
    padding: 10px;
    display: flex;
    align-items: center;
    &:hover {
      background: #e2f2ff;
    }
    // &:not(:nth-child(1)) {
    //   margin-top: 10px;
    // }
    & > span:nth-child(1) {
      color: #9ba5af;
      font-size: 12px;
    }
    /deep/ & > span:nth-child(2) {
      padding-left: 10px;
      color: #333;
      i {
        left: auto;
        right: -7px;
      }
    }
  }
  .sim-item.active {
    background: #e2f2ff;
  }
}
</style>


