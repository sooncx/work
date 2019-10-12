<template>
  <div
    class="page_box"
    @click="close"
  >

    <!-- top -->
    <el-row
      type="flex"
      class="row-header"
    >
      <!-- top-left -->
      <el-col
        :span="6"
        class="header_left"
      >
        <div class="left_risk">
          <gridbox
            title="车辆本月年审及保险提醒"
            :height=1
          >
            <cTable
              :data="tableData"
              :type=2
              :color=2
            />
          </gridbox>
        </div>
        <div class="left_outTime">
          <gridbox
            title="预期未年审车辆提醒"
            :height=2
          >
            <cTable
              :data="tableData2"
              :type=2
              :color=1
            />
          </gridbox>
        </div>
      </el-col>
      <!-- top-mapChart -->
      <el-col
        :span="12"
        class="row-content"
      >
        <span
          class="btn"
          @click.stop="open"
        >控制台</span>
        <map-Chart></map-Chart>
        <div>
          <div class="left">
            <div
              class="leftBox"
              v-for="(item,index) in leftData"
              :key="index"
            >
              <span class="leftName">{{item.name}}</span>
              <span class="leftValue">{{item.value||0}}</span>
            </div>
          </div>
          <div class="footer">
            <div
              class="footLeft"
              v-for="(item,index) in footData"
              :key="index"
            >
              <span class="footName">
                {{item.name}}
              </span>
              <span class="footValue">
                {{item.value||0}}
              </span>
            </div>
            <div class="footRight">
              <gridbox :btnText="false">
                <cTable
                  :data="alarmData"
                  :type=4
                />
              </gridbox>
            </div>
          </div>
        </div>
      </el-col>
      <!-- top-right -->
      <el-col
        :span="6"
        class="header_left"
      >
        <div class="left_risk">
          <gridbox
            title="实时监控车辆"
            :height=1
          >
            <cTable
              :data="monitorData"
              :type=1
            />
          </gridbox>
        </div>
        <div class="left_outTime">
          <gridbox
            title="车辆管理"
            :height=2
          >
            <car-Manage :data="carManageData"></car-Manage>
          </gridbox>
        </div>
      </el-col>
    </el-row>
    <!-- top - end -->

    <el-row
      type="flex"
      class="row-footer"
    >
      <el-col
        :span="6"
        class="left_risk"
      >
        <gridbox
          title="必备资料下载"
          style="overflow:hidden"
          :data="list"
          @dowload="dowload"
          :height=3
          :btnText="btnTxt"
        >
          <carDataDowload
            :data="carDataDowloadData"
            @getCheckList="getCheckList"
          ></carDataDowload>
        </gridbox>
      </el-col>
      <el-col
        :span="12"
        class="footer_mid"
      >
        <div class="mid_box">
          <gridbox
            title="车辆状态统计"
            :btnText="false"
            :height=3
          >
            <div class="card-content">
              <pie-charts
                class="card-right"
                :data="pieData"
              ></pie-charts>
            </div>
          </gridbox>
        </div>
        <div class="mid_box">
          <gridbox
            title="车辆还款提醒"
            :height=3
          >
            <cTable
              :data="OverdueData"
              :type=3
            />
          </gridbox>

        </div>
      </el-col>
      <el-col
        :span="6"
        class="left_risk"
      >
        <gridbox
          title="风控评估"
          btnText="更多"
          style="overflow:hidden"
          :height=3
        >
          <car-Risk :data="carRiskData"></car-Risk>
        </gridbox>
      </el-col>
    </el-row>
    <div
      class="dialog"
      v-show=falg
      @click.stop
      v-dialog
    >
      <p>提醒设置</p>
      <i
        class="el-icon-close"
        @click="close"
      ></i>
      <span class="dialogContent">
        <el-radio
          v-model="radio"
          label="30"
        >30天</el-radio>
        <el-radio
          v-model="radio"
          label="60"
        >60天</el-radio>
        <el-radio
          v-model="radio"
          label="90"
        >90天</el-radio>
      </span>
      <span
        class="dialogCancel"
        @click="close"
      >取消</span>
      <span
        class="dialogComfirm"
        @click="test"
      >确定</span>
    </div>
    <input
      v-show="flase"
      type="file"
      ref="filElem"
      @change="tirggerFile($event)"
    >
    <button @click="upload">
      上传
    </button>
  </div>
</template>
<script>
import gridbox from "@/components/gridBox";
import cTable from "@/components/ctable";
import pieCharts from "@/components/piecharts";
import carManage from "@/components/carManage";
import carRisk from "@/components/carRisk";
import carDataDowload from "@/components/carDataDowload";
import mapChart from "@/components/mapcharts/mapChart";
export default {
  data() {
    return {
      btnTxt: "下载",
      falg: false,
      radio: "30",
      monitorData: [],
      OverdueData: [],
      footData: [
        { name: "有线设备", value: 0 },
        { name: "无线设备", value: 0 },
        { name: "过期设备", value: 0 }
      ],
      leftData: [
        { name: "公司车辆总数", value: 0 },
        { name: "本月年审车辆数", value: 0 },
        { name: "预期未年审车辆数", value: 0 },
        { name: "上月新增车辆数", value: 0 },
        { name: "本年新增车辆数", value: 0 }
      ],
      carDataDowloadData: [],
      carManageData: [
        {
          imgurl: require("@/assets/img/carManage/icons8-tractor.png"),
          name: "牵引车",
          value: null
        },
        {
          imgurl: require("@/assets/img/carManage/truck.png"),
          name: "卸货车",
          value: null
        },
        {
          imgurl: require("@/assets/img/carManage/dump-truck.png"),
          name: "自卸车",
          value: null
        },
        {
          imgurl: require("@/assets/img/carManage/steering-wheel.png"),
          name: "其他车型",
          value: null
        }
      ],
      carRiskData: [
        {
          imgurl: require("@/assets/img/carRisk/car1.png"),
          name: "驾驶证查询"
        },
        {
          imgurl: require("@/assets/img/carRisk/car2.png"),
          name: "违章查询"
        },
        {
          imgurl: require("@/assets/img/carRisk/car3.png"),
          name: "出险查询"
        },
        {
          imgurl: require("@/assets/img/carRisk/car4.png"),
          name: "多头借贷"
        }
      ],
      pieData: [],
      alarmData: [],
      tableData: [],
      tableData2: [],
      carTypeList: [],
      homePageData: [],
      carTypeCount: {},
      list: [],
      filename: null
    };
  },
  directives: {
    dialog(el, bindings) {
      el.onmousedown = function(e) {
        let mouseX = e.clientX - el.offsetLeft - 281.5;
        let mouseY = e.clientY - el.offsetTop - 144;
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

  methods: {
    upload() {
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
    },
    dowload() {
      if (this.list.length > 0) {
        for (let item of this.list) {
          this.downloadFile(item);
        }
        //this.downloadFile(this.list[0]);
      } else {
        this.$message({
          message: "请选择要下载的文件",
          type: "warning"
        });
      }
    },
    getCheckList(DowloadList) {
      this.list = DowloadList;
    },
    open() {
      this.falg = true;
    },
    close() {
      this.falg = false;
    },
    test() {
      console.log("radio:" + this.radio);
    },
    //获取车辆类型类别数据
    getCartype() {
      this.$api
        .getCarTypeApi({
          isTrailer: 2
        })
        .then(res => {
          this.carTypeList = res.data;
        })
        .catch(e => {
          console.log(e, "车辆类型类别数据获取失败");
        });
    },
    //获取首页数据
    getHomePageData() {
      this.$api
        .getIndexCountApi()
        .then(res => {
          this.footData[0].value = res.obj.wiredNum;
          this.footData[1].value = res.obj.wirelessNum;
          this.footData[2].value = res.obj.expireNum;
          this.leftData[0].value = res.obj.total;
          this.leftData[1].value = res.obj.thisMonth;
          this.leftData[2].value = res.obj.overDue;
          this.leftData[3].value = res.obj.nextMonth;
          this.leftData[4].value = res.obj.increaseCount;
        })
        .catch(e => {
          console.log(e, "首页数据获取失败");
        });
    },
    //车辆类型统计
    getCarTypeCount() {
      this.$api
        .getCarTypeCountApi()
        .then(res => {
          this.carTypeCount = res.obj;
          this.carManageData[0].value = res.obj.tractor;
          this.carManageData[1].value = res.obj.van;
          this.carManageData[2].value = res.obj.tipper;
          this.carManageData[3].value = res.obj.otherModels;
        })
        .catch(e => {
          console.log(e, "车辆类型统计数据获取失败");
        });
    },
    //设置提现提成积分、提成积分转消费积分比例
    setRadio() {
      this.$api
        .setRadioApi({
          comsumeRatio: 2,
          integralRatio: 2,
          moneyRatio: 2,
          rewardRatio: 2
        })
        .then(res => {})
        .catch(e => {
          console.log(e, "车辆类型统计数据获取失败");
        });
    },
    //设置子级账户积分用户类型
    setUserType() {
      this.$api
        .setUserTypeApi({
          targetId: 1,
          userType: ""
        })
        .then(res => {})
        .catch(e => {
          console.log(e, "车辆类型统计数据获取失败");
        });
    },

    //实时车辆监控
    getMonitorInfo() {
      this.$api
        .getMonitorInfoApi({
          pageNumber: 1,
          pageSize: 5
        })
        .then(res => {
          this.monitorData = [
            {
              itemData: ["车牌号", "时间", "速度(km/h)", "位置"],
              tableData: res.obj
            }
          ];
          console.log("this.monitorData:" + JSON.stringify(this.monitorData));
        })
        .catch(e => {
          console.log(e, "实时车辆监控数据获取失败");
        });
    },

    // /计算按揭还款信息
    calcMortgageRecond() {
      this.$api
        .calcMortgageRecondApi({
          interestType: 0,
          loanDate: 0,
          repaymentCycle: 1,
          repaymentType: 1,
          trailerDate: 0
        })
        .then(res => {})
        .catch(e => {
          console.log(e);
        });
    },
    //获取报警数据
    getWarningData() {
      this.$api
        .getWarningDataApi({
          callback: "",
          updateTime: "",
          pageSize: 5,
          pageNumber: 1
        })
        .then(res => {
          this.alarmData = [
            {
              itemData: ["车牌号", "报警类型", "报警时间"],
              tableData: res.obj.alarm
            }
          ];
        })
        .catch(e => {
          console.log(e);
        });
    },
    //获取年审过期提醒
    getRemindExamineInfo(type) {
      this.$api
        .getRemindExamineInfoApi({
          cycle: 1,
          pageNumber: 1,
          pageSize: 5,
          type: type
        })
        .then(res => {
          if (type == 1) {
            this.tableData = [
              {
                itemData: ["车牌号", "年审时间", "年审类型"],
                tableData: res.obj
              }
            ];
          } else if (type == 2) {
            this.tableData2 = [
              {
                itemData: ["车牌号", "年审时间", "年审类型"],
                tableData: res.obj
              }
            ];
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //获取保险公司列表
    getInsuranceCompany() {
      this.$api
        .getInsuranceCompanyApi()
        .then(res => {})
        .catch(e => {
          console.log(e);
        });
    },
    // 获取下载文件列表
    getDowloadList() {
      this.$api
        .getDowloadListApi()
        .then(res => {
          this.carDataDowloadData = res.obj;
        })
        .catch(e => {
          console.log(e);
        });
    },
    tirggerFile(event) {
      this.filename = event.target.files[0];
      console.log(this.filename);
      this.uploadFile(this.filename);
    },
    //上传文件
    uploadFile(fileName) {
      let formData = new FormData();
      formData.append("sessionId", "cfb1c1b4-54f8-4039-87a1-c881c39a39ed");
      formData.append("loginToken", "4cdb8094-09a0-5272-c4bc-905bfefb50e3");
      formData.append("file", fileName);
      // let params = Object.assign(formData, file);
      this.$api
        .uploadFileApi(formData)
        .then(res => {})
        .catch(e => {
          console.log(e);
        });
    },
    //统计车辆行驶状态
    getCountOfCarStatus() {
      this.$api
        .getCountOfCarStatusApi()
        .then(res => {
          this.pieData = [
            {
              name: "行驶",
              value: res.obj.drivingNum,
              color: "#12C376"
            },
            {
              name: "停止",
              value: res.obj.stopNum,
              color: "#1265C3"
            },
            {
              name: "离线",
              value: res.obj.offLineNum,
              color: "#211AAC"
            },
            {
              name: "过期",
              value: res.obj.expiredNum,
              color: "#505456"
            }
          ];
        })
        .catch(e => {});
    },
    //点击续费年审
    changeExamine() {
      this.$api
        .changeExamineApi({
          carId: 1,
          examineType: 2
        })
        .then(res => {})
        .catch(e => {});
    },
    //添加用户积分操作记录
    addOperateRecond() {
      this.$api
        .addOperateRecondApi({
          jsonStr: ""
        })
        .then(res => {})
        .catch(e => {});
    },

    //根据车辆id获取车辆年审信息
    getExamineInfoByCarid() {
      this.$api
        .getExamineInfoByCaridApi({
          carId: 1
        })
        .then(res => {})
        .catch(e => {});
    },
    //根据车辆id获取车辆信息
    getCarInfoByCarid() {
      this.$api
        .getCarInfoByCaridApi({
          carId: 1
        })
        .then(res => {})
        .catch(e => {});
    },
    //根据按揭记录修改还款或提醒状态
    changeStateOfMortgage() {
      this.$api
        .changeStateOfMortgageApi({
          mortgageId: 1,
          state: 2,
          type: 1
        })
        .then(res => {})
        .catch(e => {});
    },
    //查询按揭记录信息
    getMortgageRecondInfo() {
      this.$api
        .getMortgageRecondInfoApi({
          carId: 1
        })
        .then(res => {})
        .catch(e => {});
    },
    //查询所有的操作积分类型
    getIntegralType() {
      this.$api
        .getIntegralTypeApi()
        .then(res => {})
        .catch(e => {});
    },

    //提现提成积分 客户使用
    transferRewardToMoney() {
      this.$api
        .transferRewardToMoneyApi({
          rewardIntegral: 1
        })
        .then(res => {})
        .catch(e => {});
    },

    //提前7天和逾期的还款记录
    getOverdueInfo() {
      this.$api
        .getOverdueInfoApi({
          pageNumber: 1,
          pageSize: 5
        })
        .then(res => {
          this.OverdueData = [
            {
              itemData: ["车牌号", "还款时间", "逾期天数"],
              tableData: res.obj
            }
          ];
        })
        .catch(e => {});
    },
    //录入设备信息
    saveVehicle() {
      this.$api
        .saveVehicleApi({
          jsonStr: ""
        })
        .then(res => {})
        .catch(e => {});
    },
    //录入和修改车辆信息
    saveAndChangeVehicle() {
      this.$api
        .saveAndChangeVehicleApi({
          carPicture: "",
          jsonData: "",
          operateCertificateUrl: "",
          registerUrlOne: "",
          registerUrlTwo: ""
        })
        .then(res => {})
        .catch(e => {});
    },
    //录入和修改车主信息
    saveDriverInfo() {
      this.$api
        .saveDriverInfoApi({
          IDcardUrl: "",
          driverLicenseUrl: "",
          jsonData: "",
          relationIDcardUrl: "",
          residenceBooketUrl: ""
        })
        .then(res => {})
        .catch(e => {});
    },
    //录入和修改年审信息
    saveExamineInfo() {
      this.$api
        .saveExamineInfoApi({
          isTrailer: 1,
          jsonData: "",
          tradeInsUrl: "",
          trafficInsUrl: "",
          type: 1
        })
        .then(res => {})
        .catch(e => {});
    },
    //年审和按揭信息 报表导出
    exporeRemindInfo() {
      this.$api
        .exporeRemindInfoApi({
          cycle: 1
        })
        .then(res => {})
        .catch(e => {});
    },

    //存储按揭计算记录 (包含存储计算参数)
    saveMortgageRecond() {
      this.$api
        .saveMortgageRecondApi({
          carId: "",
          interestType: 1,
          jsonStr: "",
          loanDate: "",
          repaymentCycle: 1,
          repaymentType: 1,
          trailerDate: ""
        })
        .then(res => {})
        .catch(e => {});
    },
    //删除指定文件
    deleteChoseFile() {
      this.$api
        .deleteChoseFileApi({
          fileName: ""
        })
        .then(res => {})
        .catch(e => {});
    },
    //删除图片(单独删除)
    deleteImg() {
      this.$api
        .deleteImgApi({
          carId: 1,
          type: 1,
          url: ""
        })
        .then(res => {})
        .catch(e => {});
    },
    //获取指定字符在字符串中第n次出现下标
    find(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    //下载指定文件
    downloadFile(fileName) {
      // console.log("this.HOST:" + this.find(window.location.href, "/", 2));
      // console.log("this.HOST2:" + window.location.href.indexOf("/", 10));
      let urls = `${window.location.href.slice(
        0,
        this.find(window.location.href, "/", 2)
      )}${
        this.HOST
      }/http/ClientFp247/DownloadFile.json?fileName=${fileName}&sessionId=cfb1c1b4-54f8-4039-87a1-c881c39a39ed&loginToken=4cdb8094-09a0-5272-c4bc-905bfefb50e3`;
      //let urls = `http://localhost:8010/apiAjax/http/ClientFp247/DownloadFile.json?fileName=${fileName}&sessionId="cee3c5a7-d8b4-4293-a2cc-e86d5da404c8"&loginToken:"4cdb8094-09a0-5272-c4bc-905bfefb50e3"`;
      window.open(urls, "_blank");
    }
  },
  created() {
    this.getHomePageData();
    this.getCartype();
    this.getCarTypeCount();
    this.setRadio();
    this.setUserType();
    this.getMonitorInfo();
    this.getInsuranceCompany();
    this.getDowloadList();
    this.getCountOfCarStatus();
    this.changeExamine();
    this.addOperateRecond();
    this.getExamineInfoByCarid();
    this.getCarInfoByCarid();
    this.changeStateOfMortgage();
    this.getMortgageRecondInfo();
    this.getIntegralType();
    this.transferRewardToMoney();
    this.getOverdueInfo();
    this.saveVehicle();
    this.saveAndChangeVehicle();
    this.saveDriverInfo();
    this.saveExamineInfo();
    this.exporeRemindInfo();
    this.saveMortgageRecond();
    this.deleteChoseFile();
    this.deleteImg();
    this.calcMortgageRecond();
    this.getWarningData();
    this.getRemindExamineInfo(1);
    this.getRemindExamineInfo(2);
  },
  mounted() {},
  components: {
    gridbox,
    cTable,
    pieCharts,
    carManage,
    carRisk,
    carDataDowload,
    mapChart
  }
};
</script>

<style lang="less" scoped>
.page_box {
  background: #021b3e;
  height: 100%;
  padding: 24px 21px;

  .row-content {
    overflow: hidden;
    position: relative;
    margin: 0 20px;
    .btn {
      z-index: 999;
      padding: 3px 9px;
      color: #fff;
      position: relative;
      top: 10px;
      left: 90%;
      cursor: pointer;
      background: #1453ba;
      border-radius: 12px;
      text-align: center;
    }
    .left {
      width: 140px;
      height: 325px;
      background: rgba(0, 32, 78, 1);
      border: 1px solid rgba(255, 255, 255, 1);
      margin-top: -18px;
      position: absolute;
      .leftBox {
        position: relative;
        width: 100%;
        margin-top: 10px;
        height: 15%;
        margin-bottom: 15px;
        .leftName {
          position: absolute;
          left: 20px;
          font-size: 14px;
          color: white;
        }
        .leftValue {
          position: absolute;
          left: 20px;
          top: 15px;
          font-size: 28px;
          color: #10cee5;
        }
      }
    }
    .footer {
      width: 100%;
      height: 140px;
      background: rgba(0, 36, 87, 1);
      border: 1px solid rgba(255, 255, 255, 1);
      // opacity: 0.7;
      position: absolute;
      bottom: 0;
      overflow: hidden;
      .footLeft {
        float: left;
        margin-left: 43px;
        color: white;
        .footName {
          position: relative;
          top: 25px;
        }
        .footValue {
          position: relative;
          top: 60px;
          left: -52px;
          color: #10cee5;
          font-size: 30px;
        }
      }
      .footRight {
        * {
          border: none !important;
        }
        position: absolute;
        right: 0;
        top: -25px;
        width: 50%;
      }
    }
  }
  .row-footer {
    height: calc(35% - 20px);
    .footer_mid {
      margin: 0 20px;
      display: flex;
      .mid_box {
        overflow: hidden;
        height: 100%;
        flex: 1;
        &:first-child {
          margin-right: 10px;
        }
        &:last-child {
          margin-left: 10px;
        }
      }
    }
  }
  .row-header {
    height: 65%;
    margin-bottom: 20px;
    .header_left {
      display: flex;
      flex-direction: column;
      .left_risk {
        overflow: hidden;
        height: 40%;
      }
      .left_outTime {
        margin-top: 20px;
        overflow: hidden;
        // height: 55%;
        flex: 1;
      }
    }
  }
}
.card-content {
  display: flex;
  width: 100%;
  height: 200px;
  .card-right {
    width: 100%;
    height: 100%;
    margin: 0 10px;
  }
}
.dialog {
  position: absolute;
  z-index: 9999;
  width: 563px;
  height: 288px;
  background: rgba(0, 24, 59, 1);
  top: 50%;
  left: 50%;
  margin-left: -281.5px;
  margin-top: -144px;
  p,
  i {
    position: absolute;
    top: 20px;
    color: #fff;
  }
  p {
    left: 20px;
  }
  i {
    right: 20px;
    cursor: pointer;
  }
  .dialogContent {
    position: absolute;
    top: 60px;
    left: 20px;
  }
  .dialogCancel,
  .dialogComfirm {
    cursor: pointer;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 20px;
    right: 100px;
    width: 73px;
    height: 30px;
  }
  .dialogCancel {
    border: 1px solid rgba(2, 80, 193, 1);
  }
  .dialogComfirm {
    right: 20px;
    background: rgba(2, 80, 193, 1);
  }
}
</style>

