<template>
  <div
    class="bs-content"
    @click="peringatanVisible = false"
  >
    <table-dialog
      @func="getMsgFormSon"
      v-show="peringatanVisible"
      :tag="flag"
      :expireSimGprsF="expireSimGprs"
      :expireSimCardsF="expireSimCards"
      :predictSimGprsF="predictSimGprs"
      :predictSimCardsF="predictSimCards"
      :peringatanVisibleF="peringatanVisible"
    >
    </table-dialog>
    <el-row
      type="flex"
      class="top-box"
    >
      <el-col
        :span="5"
        class="content-box"
      >
        <div class="card-title">SIM卡状态</div>
        <div class="card-content">
          <div class="card-left">
            <div
              class="sim-card"
              @click.stop="peringatanLeft"
            >
              <waves class="waves-dio" />
              <span
                class="card-num"
                v-loading="loadingTable1"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#202C4C"
              >{{this.simGprsCount || 0}}</span>
              <!-- <span class="card-num">{{indexData.beyondTrafficNum || 0}}</span> -->
              <span class="card-dc">预/已超流量</span>
            </div>
            <div
              class="sim-card"
              @click.stop="peringatanRight"
            >
              <waves class="waves-dio" />
              <span
                class="card-num"
                v-loading="loadingTable2"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#202C4C"
              >{{this.simCardsCount || 0}}</span>
              <!-- <span class="card-num">{{indexData.expireNum || 0}}</span> -->
              <span class="card-dc">预/已过期</span>
            </div>
          </div>
          <pie-charts
            class="card-right"
            :data="pieDataOne"
          ></pie-charts>
        </div>
        <div class="card-content">
          <pie-charts
            class="card-left"
            :data="pieDataTwo"
          ></pie-charts>
          <pie-charts
            class="card-right"
            :data="pieDataThree"
          ></pie-charts>
        </div>
      </el-col>
      <el-col
        :span="19"
        class="map-content"
      >
        <!-- 地图组件 -->
        <map-charts></map-charts>

        <!-- SIM卡总数 -->
        <div class="map-sum">
          <span class="map-label">SIM卡总数</span>
          <i
            class="iconfont"
            :class="'icon-num'+item"
            v-for="item in indexData.totalList"
            :key="item"
          ></i>
        </div>

        <!-- 地区排名 -->
        <div class="regionRankbox">
          <div
            class="content-box"
            v-for="item in 5"
            :key="item"
          >
            <div class="radius">{{item}}</div>
            <span>广东省: {{parseInt(Math.random()*100000)}}</span>
          </div>
        </div>

        <!-- 底部统计数 -->
        <footer class="statistics-box">
          <div
            class="footer-box"
            v-for="(item,index) in footerlist"
            :key="index"
          >
            <span class="label">{{item.name}}</span>
            <span class="num">{{item.value}}</span>
          </div>
        </footer>
        <!-- 控制台 -->
        <div
          class="map-ctrl"
          @click="$router.push('/web')"
        >进入控制台<span>》</span></div>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      class="button-box"
    >
      <el-col
        :span="5"
        class="content-box"
      >
        <div class="card-title">客户卡数排名</div>
        <div
          class="ranking-box"
          v-if="indexData.userTop && indexData.userTop.length !== 0"
        >
          <div
            class="rank"
            v-for="(item,index) in indexData.userTop.slice(0,6)"
            :key="index"
          >
            <div class="radius">{{index+1 > 3 ? "" : index + 1}}</div>
            <div class="rank-r">
              <span class="rank-t">{{item.corpName}}</span>
              <div class="progressBox">
                <div class="progress-bar">
                  <span
                    class="progress-bar-inset"
                    :style="{width:item.simNum / 100+'%'}"
                  ></span>
                </div>
                <span>{{item.simNum}}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="ranking-box"
          v-else
        >
          <div class="ranking_nullBox">
            <img
              class="ranking_img"
              src="../../src/public/img/other/nocar.png"
            >
            <span>暂无数据</span>
          </div>
        </div>
      </el-col>
      <el-col
        :span="13"
        class="content-box"
      >
        <div class="card-title">出入库数据</div>
        <div class="line-btns">
          <button
            :class="{'btns_active':btnActive === 1}"
            @click="btnActive = 1"
          >本周</button>
          <button
            :class="{'btns_active':btnActive === 2}"
            @click="btnActive = 2"
          >本月</button>
        </div>
        <div class="line-box">
          <line-charts :message="btnActive?btnActive:1"></line-charts>
        </div>
      </el-col>
      <el-col
        :span="6"
        class="content-box"
      >
        <div class="client-f">
          <div class="card-title">客户数据</div>
          <div class="Mon-box">
            <div
              class="Mon-content"
              v-for="(item,index) in remarkList"
              :key="index"
            >
              <span class="num">{{item.num}}</span>
              <span class="description">{{item.name}}</span>
              <waves
                class="waves-dio"
                :color="item.color"
              />
            </div>
          </div>
        </div>
        <div class="client-f">
          <div class="card-title">风控警报</div>
          <div
            class="risk-box"
            v-if="indexData.beyondTrafficList && indexData.beyondTrafficList.length !== 0"
          >
            <marquee>
              <div
                class="risk-content"
                v-for="item in 10"
                :key="item"
              >
                <i class="icon-kongjian iconfont"></i>
                <span class="type">超流量</span>
                <span class="carNum">SIM卡号：211551486595</span>
              </div>
            </marquee>

          </div>
          <div class="risk_nullBox">
            <img
              class="risk_img"
              src="../../src/public/img/other/nodata.png"
            >
            <span>暂无数据</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
let echarts = require("echarts");
import mapCharts from "@/components/mapcharts/mapChart";
import lineCharts from "@/components/linecharts/";
import waves from "@/components/waves/";
import marquee from "@/components/marquee/";
import pieCharts from "@/components/piecharts/";
import tableDialog from "@/components/tabledialog";
export default {
  data() {
    return {
      flag: 0,
      expireSimGprs: 0,
      predictSimGprs: 0,
      simGprsCount: 0,
      expireSimCards: 0,
      predictSimCards: 0,
      simCardsCount: 0,
      loadingTable1: false,
      loadingTable2: false,
      indexData: {},
      btnActive: 1,
      peringatanVisible: false,
      footerlist: [],
      remarkList: [
        { color: "#D2336B", num: 0, name: "当月续费数量" },
        { color: "#3733D2", num: 0, name: "当月已开叠加包" },
        { color: "#33D29C", num: 0, name: "当月已发短信" }
      ],
      pieDataOne: [],
      pieDataTwo: [],
      pieDataThree: []
    };
  },
  components: {
    mapCharts,
    lineCharts,
    marquee,
    waves,
    pieCharts,
    tableDialog
  },

  created() {
    this.getSimGprsCount();
    this.getSimCardsCount();
  },
  methods: {
    //子组件关闭弹窗的值赋值给父组件
    getMsgFormSon(data) {
      this.peringatanVisible = data;
    },
    //预/以超流量按钮
    peringatanLeft() {
      this.peringatanVisible = true;
      this.flag = 1;
      //弹窗显示
    },
    //预/已过期卡按钮
    peringatanRight() {
      this.flag = 2;
      this.peringatanVisible = true;
    },
    //获取预/已超流量sim卡总数
    getSimGprsCount() {
      this.loadingTable1 = true;
      this.$API
        .getSimGprsCount()
        .then(res => {
          this.expireSimGprs = res.data.expireCount;
          this.predictSimGprs = res.data.predictCount;
          this.simGprsCount = res.data.expireCount + res.data.predictCount;
          this.loadingTable1 = false;
        })
        .catch(err => {});
    },
    //获取预/已过期sim卡总数
    getSimCardsCount() {
      this.loadingTable2 = true;
      this.$API
        .getSimCardsCount()
        .then(res => {
          this.expireSimCards = res.data.expireCount;
          this.predictSimCards = res.data.predictCount;
          this.simCardsCount = res.data.expireCount + res.data.predictCount;
          this.loadingTable2 = false;
        })
        .catch(err => {});
    },
    async getindexData() {
      let data = await Promise.all([
        this.$API.getIndexStopData(),
        this.$API.getIndexRunData()
      ]);

      if (data[0].code === 0 && data[1].code === 0) {
        this.indexData = Object.assign(data[0].data, data[1].data);
        this.indexData.totalList = this.indexData.totalNum.toString().split("");
        this.getpieData(this.indexData);
      }
    },
    getpieData(data) {
      this.pieDataOne = [
        {
          name: "出卡",
          value: data.outNum,
          color: "#554BFB"
        },
        {
          name: "未出卡",
          value: data.totalNum - data.outNum,
          color: "#5992F3"
        }
      ];
      this.pieDataThree = [
        {
          value: data.activationNum,
          name: "激活",
          color: "#25E5E3"
        },
        {
          value: data.disableNum,
          name: "停用",
          color: "#FD9C34"
        }
      ];
      this.pieDataTwo = [
        {
          value: data.onLineNum,
          name: "在线",
          color: "#155CEC"
        },
        {
          value: data.offlineNum,
          name: "离线",
          color: "#8A8C93"
        }
      ];

      this.remarkList = [
        { color: "#D2336B", num: data.renewalNum, name: "当月续费数量" },
        { color: "#3733D2", num: data.trafficNum, name: "当月已开叠加包" },
        { color: "#33D29C", num: data.smsNum, name: "当月已发短信" }
      ];
      this.footerlist = [
        {
          name: "客户数量：",
          value: data.userTop.length
        },
        {
          name: "城市接入数：",
          value: data.areaList ? data.areaList.length : 0
        },
        {
          name: "在线率：",
          value:
            (parseInt(data.onLineNum) / parseInt(data.totalNum)) * 100 + "%"
        }
      ];
    }
  },
  mounted() {
    this.getindexData();
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
@import "@/public/css/mixin.scss";
@import "@/public/css/animation.scss";

.bs-content {
  position: relative;
  height: 100%;
  min-height: 650px;
  min-width: 1200px;
  background: #0e1321;
  padding: 6px 4px 5px 5px;
  font-family: PingFangSC-Semibold, sans-serif;
  // .footer-box {
  // }
  .top-box {
    height: 60%;
    margin-bottom: 3px;
    .map-content {
      position: relative;
      .map-sum {
        position: absolute;
        color: #5e89d6;
        display: flex;
        top: 30px;
        left: 17px;
        align-items: center;
        i {
          font-size: 20px;
          color: #fff;
        }
        .map-label {
          font-size: 14px;
          margin-right: 12px;
        }
      }
    }
    .content-box {
      margin-right: 4px;

      .card-content {
        margin-top: 40px;
        display: flex;
        height: 35%;
        .card-right {
          width: 50%;
          margin: 0 10px;
        }
        .card-left {
          width: 50%;
          margin: 0 10px;
          .sim-card {
            width: 80%;
            height: 48%;
            background: rgba(32, 44, 76, 1);
            margin: auto;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            cursor: pointer;
            .waves-dio {
              left: 12%;
              top: 37%;
            }
            .card-num {
              font-size: 20px;
              font-weight: bold;
              color: $white;
            }
            .card-dc {
              color: #6877a2;
              margin-top: 5px;
              font-size: 12px;
            }
            &:last-child {
              margin-top: 7px;
            }
          }
        }
      }
    }
  }
  .card-title {
    @extend .t-center;
    background: url("../public/img/other/ctop.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: $tcolor;
    font-size: 14px;
    margin: auto;
    width: 130px;
    height: 28px;
    line-height: 28px;
  }
  .button-box {
    height: 38%;
    & > .content-box:nth-child(2) {
      margin: 0 4px;
    }
    .client-f {
      height: 45%;
      position: relative;
      .risk_nullBox {
        @extend .fix-center;
        display: flex;
        margin-top: 10px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .risk_img {
          width: 63px;
          height: 63px;
        }
        span {
          font-size: 15px;
          margin-top: 20px;
          font-family: PingFang-SC-Medium;
          font-weight: bold;
          color: rgba(85, 117, 200, 1);
        }
      }
      .Mon-box {
        display: flex;
        height: 75%;
        // margin-top: 30px;
        justify-content: space-around;
        .Mon-content {
          display: flex;
          position: relative;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .waves-dio {
            left: -5%;
            top: 37%;
          }
          .num {
            color: $white;
            font-size: 22px;
          }
          .description {
            font-size: 12px;
            color: #6877a2;
            margin-top: 9px;
          }
        }
      }
      &:last-child {
        height: 54.5%;
        border-top: 4px solid #0e1321;
        .risk-box {
          display: flex;
          flex-direction: column;
          height: 60%;
          margin-top: 20px;
          justify-content: center;
          .risk-content {
            display: flex;
            align-items: center;
            height: 40px;
            width: 86%;
            margin: 10px auto;
            background: #153166;
            font-size: 13px;
            .type {
              color: #fd9c34;
              margin-right: auto;
            }
            i {
              color: #fd9c34;
              margin: 0 8px;
            }
            .carNum {
              color: #ffffff;
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
  .content-box {
    background: $Ibox;
    position: relative;
    overflow: hidden;
  }
  .line-btns {
    position: absolute;
    z-index: 11;
    right: 4%;
    top: 12%;
    .btns_active {
      background: #3a508a;
      color: #bccefe;
    }
    button {
      background: #1d2b50;
      cursor: pointer;
      border: 0;
      color: #bccefe;
      width: 50px;

      outline: none;
      height: 20px;
      line-height: 20px;
    }
  }
  .regionRankbox {
    position: absolute;
    top: 100px;
    left: 17px;
    .content-box {
      width: 200px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      height: 25px;
      background: #1f3382;
      opacity: 0;
      @extend .fade-in;
      &:nth-child(2) {
        width: 185px;
        animation-delay: 0.2s;
      }
      &:nth-child(3) {
        width: 160px;
        animation-delay: 0.3s;
      }
      &:nth-child(4) {
        width: 145px;
        animation-delay: 0.4s;
      }
      &:nth-child(5) {
        width: 130px;
        animation-delay: 0.5s;
      }
      &:not(:first-child) {
        margin-top: 15px;
      }
      .radius {
        @include radius(25px, 25px);
        color: #1f3382;
        background: $white;
      }
      span {
        font-size: 12px;
        color: $white;
        margin-left: 10px;
      }
    }
  }
  .map-ctrl {
    position: absolute;
    right: 19px;
    top: 30px;
    width: 105px;
    height: 30px;
    text-align: center;
    border-radius: 11px;
    background: #0d3580;
    color: #fff;
    font-size: 12px;
    line-height: 30px;
    cursor: pointer;
    span {
      margin-left: 5px;
      font-size: 12px;
    }
  }
  .statistics-box {
    position: absolute;
    bottom: 10px;
    left: 17px;
    display: flex;
    .footer-box {
      font-size: 12px;
      &:not(:first-child) {
        margin-left: 5px;
      }
      .label {
        color: #526cb4;
      }
      .num {
        color: #fff;
      }
    }
  }
  .line-box {
    height: 90%;
  }
  .ranking-box {
    margin-top: 20px;
    .ranking_nullBox {
      @extend .fix-center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .ranking_img {
        width: 87px;
        height: 116px;
      }
      span {
        font-size: 15px;
        margin-top: 20px;
        font-family: PingFang-SC-Medium;
        font-weight: bold;
        color: rgba(85, 117, 200, 1);
      }
    }

    .rank {
      transform: translateX(-110%);
      @extend .fade-Left;
      &:nth-child(1) {
        animation-delay: 0.3s;
        .radius {
          background: #df4442;
        }
      }
      &:nth-child(2) {
        animation-delay: 0.4s;
        .radius {
          background: #fd9c34;
        }
      }
      &:nth-child(3) {
        animation-delay: 0.5s;
        .radius {
          background: #6334fd;
        }
      }
      &:nth-child(4) {
        animation-delay: 0.6s;
      }
      &:nth-child(5) {
        animation-delay: 0.7s;
      }
      &:nth-child(6) {
        animation-delay: 0.8s;
      }
      &:nth-child(1n + 4) {
        .rank-r {
          padding-left: 32px;
        }
      }
      &:nth-child(-n + 3) {
        background: #153166;
        .radius {
          @include radius(20px, 20px);
          color: #fff;
          margin: 8px 7px;
          // background: #df4442;
        }
      }
      width: 90%;
      margin: auto;
      height: 29px;
      padding: 6px 6px 7px 0;
      margin-top: 7px;
      display: flex;
      align-items: center;
      .rank-t {
        color: #b0ccff;
        font-size: 12px;
      }
      .rank-r {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .progressBox {
        margin-top: 5px;
        display: flex;
        align-items: center;
        height: 5px;
        .progress-bar {
          height: 4px;
          background: $blank;
          position: relative;
          width: 100%;
          margin-right: 11px;
          overflow: hidden;
          .progress-bar-inset {
            width: 96%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: linear-gradient(
              90deg,
              rgba(0, 124, 229, 1),
              rgba(74, 172, 255, 1)
            );
          }
        }
        & > span {
          font-size: 12px;
          color: #4889ff;
        }
      }
    }
  }
}
</style>

