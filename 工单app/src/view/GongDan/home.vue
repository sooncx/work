<template>
  <div class="home">
    <div class="header">
      <div
        class="iconfont icon-xinzeng"
        v-show="isShowAdd"
        @click="addNew()"
      ></div>
      <div
        class="back iconfont icon-fanhui"
        v-if="!isShowTitle"
        @click="back_search()"
      ></div>
      <div
        class="header_title"
        v-if="isShowTitle"
      >
        <span
          v-show="isShowTitle"
          class="header_titleStyle"
        >
          <span v-if="$store.state.newGongDanLoading==1">正在加载中...</span>
          <span v-else>GPS安装助手</span>
        </span>
      </div>
      <div v-if="!isShowTitle">
        <input
          class="inputStyle"
          v-model="searchValue"
          placeholder="设备号/安装地点/车主/设备类型"
          type="text"
        >
      </div>

    </div>
    <div
      class="search iconfont icon-weibiaoti--"
      v-show="isShowSearch"
      @click="searchChange"
    ></div>
    <div
      class="search iconfont icon-weibiaoti--"
      v-show="!isShowSearch"
      @click="search"
    ></div>
    <!-- tab -->
    <div class="tab">
      <tab
        :line-width="2"
        active-color='#0866f6'
        :scroll-threshold="6"
      >
        <tab-item
          selected
          @on-item-click="onItemClick"
        >全部</tab-item>
        <tab-item @on-item-click="onItemClick">待确认</tab-item>
        <tab-item @on-item-click="onItemClick">待安装</tab-item>
        <tab-item @on-item-click="onItemClick">已安装</tab-item>
        <tab-item @on-item-click="onItemClick">已完成</tab-item>
        <tab-item @on-item-click="onItemClick">已取消</tab-item>
      </tab>
    </div>
    <!-- tab end-->

    <!-- tab列表 -->
    <ByScroll
      ref='scroll'
      id="scroll"
      :pullUp='true'
      :pullUpLoading='pullUpLoading'
      @scrollToEnd="handlerPullUp"
      :pullDown="{threshold: 90,stop: 50}"
      @pullingDown="resfull()"
      style="height:77vh"
    >
      <div class="tabKuang ">
        <div
          class="list"
          v-for="(list,index) in $store.state.GongDanList"
          :key="index"
          @click="showContant(list.status,list,index)"
        >
          <div class="cellStyle">
            <span class="left_text">

              <div class="title_header">
                <span
                  v-show="list.readFlag==1"
                  class="readStatu"
                >.</span>创建人：{{list.name}}
                <span class="orangeStyle statuStyle1">{{status(list.status)}}</span>
              </div>

              <div class="boxx">
                <span class="left_pic">
                  <img
                    src="@/assets/image/gd_pic.png"
                    alt=""
                  >
                </span>
                <span class="right_contant">
                  <div class="installStyle">
                    <span class="installText"> 安装设备：</span>
                    <span class="installNum"> {{deviceVos(list.deviceVos)}}</span>
                  </div>
                  <!-- createTime -->
                  <div class="time_text">创建时间&nbsp;:&nbsp;{{list.createTime}}</div>
                  <!-- updateTime -->
                  <div class="time_text">{{TimeTitle(list.status,list)}}&nbsp;:&nbsp;{{TimeData(list.status,list)}}</div>
                </span>
              </div>
            </span>
            <!-- <span class="right_text orangeStyle">{{status(list.status)}}</span> -->
          </div>
        </div>
        <!-- <div style="color:#ddd;text-align:center;padding:.2rem">{{alarmData}}</div> -->
      </div>

    </ByScroll>
    <!-- tab列表 end-->

    <!-- 搜索出后的列表 -->
    <div
      class="search_contant"
      v-if="!isShowTitle"
    >
      <div
        class="noData"
        v-show="isNoData"
      >
        <div><img
            src="@/assets/image/noData.png"
            alt=""
          ></div>
        <div style="color:#999">暂无工单数据</div>
      </div>

      <div
        class="list"
        v-for="(list,indexss) in searchData"
        :key="indexss"
        @click="showContant(list.status,list,indexss)"
      >
        <div class="cellStyle">
          <span class="left_text">
            <!-- <div class="title_header">创建人：{{list.name}}</div> -->
            <div class="title_header"><span
                v-show="list.readFlag==1"
                class="readStatu"
              >.</span>创建人：{{list.name}} </div>
            <div class="boxx">
              <span class="left_pic">
                <img
                  src="@/assets/image/gd_pic.png"
                  alt=""
                >
              </span>
              <span class="right_contant">
                <div class="installStyle">
                  <span class="installText"> 安装设备：</span>
                  <span class="installNum"> {{deviceVos(list.deviceVos)}}</span>
                </div>
                <!-- createTime -->
                <div class="time_text">创建时间&nbsp;:&nbsp;{{list.createTime}}</div>
                <!-- updateTime -->
                <div class="time_text">{{TimeTitle(list.status,list)}}&nbsp;:&nbsp;{{TimeData(list.status,list)}}</div>
              </span>
            </div>
          </span>
          <span class="right_text orangeStyle">{{status(list.status)}}</span>
        </div>
      </div>
    </div>`
    <!-- 搜索出后的列表 end -->

    <!-- <div
      class="noData"
      v-show="this.gd_list.length==0?true:false"
    > -->
    <div
      class="noData"
      v-show="isNoDatas"
    >
      <div><img
          src="@/assets/image/noData.png"
          alt=""
        ></div>
      <div style="color:#999">暂无工单数据</div>
    </div>

    <toast
      v-model="showValue"
      type="text"
      :time="1500"
      is-show-mask
      :text="msg"
      width="5rem"
      position="middle"
    >{{ msg }}</toast>
    <div
      class="loadingStyles"
      v-show="isShowloding"
    >
      <img src="@/assets/image/loadHome.svg">
    </div>
    <div
      class="refreshStyle"
      v-show="isShowRefresh"
      @click="refreshGD"
    >点击我刷新</div>
  </div>
</template>

<script>
import ByScroll from "@/components/scroll";
import { Tab, TabItem, Toast } from "vux";
export default {
  name: "home",
  data() {
    return {
      isShowloding: false,
      isShowRefresh: false,
      isNoDatas: false,
      pullUpLoading: "",
      isShowAdd: true,
      isShowTitle: true,
      gd_list: [],
      current_GDlist: [],
      searchValue: "",
      msg: "",
      showValue: false,
      showPosition: null,
      isShowSearch: true,
      isNoData: false,
      searchData: "",
      scroll: null
    };
  },
  // beforeRouteLeave(to, from, next) {
  //   console.log(to,from)
  //   to.meta.keepAlive = true;
  //      // 设置下一个路由的 meta
  //     //  if(to.name=='Details'){
  //     //   to.meta.keepAlive = true;
  //     //  }else if(to.name=='InstallInfo'){

  //     //  }
  //     //  else{
  //     //   to.meta.keepAlive = false;
  //     //  }
  //     next();
  // },
  activated() {
    // this.$store.commit("GongDanList", null);
    console.log(22222);
    this.reloadHome();
    this.reloadDaiQueRen();
    this.reloadInstall();
    let index = localStorage.getItem("GD_index");
    if (this.current_GDlist[index]) {
      this.current_GDlist[index].readFlag = 2;
    }
    if (this.searchData[index]) {
      this.searchData[index].readFlag = 2;
    }
  },
  created() {
    this.$store.commit("GongDanList", null);
    this.isShowloding = true;
    console.log(11111);
    this.getCountsOfNoRead();
    let param = {
      status: 0 ////订单状态
    };
    console.log("getWorkSheetByStatus------0-------");
    this.$byApi
      .getWorkSheetByStatus(param)
      .then(res => {
        console.log("getWorkSheetByStatus---res-", res);
        if (res.data.flag == 1) {
          this.isShowRefresh = false;
          this.isShowloding = false;
          this.gd_list = res.data.obj;
          if (this.gd_list.length == 0) {
            this.isNoDatas = true;
          } else {
            this.isNoDatas = false;
          }

          let list = this.gd_list.slice(0, 5);
          this.$store.commit("GongDanList", list);
          this.current_GDlist = this.$store.state.GongDanList;
        }
      })
      .catch(e => {
        console.error(e);
        this.isShowloding = false;
        this.isShowRefresh = true;
      });
  },
  components: {
    Tab,
    Toast,
    TabItem,
    ByScroll
  },
  methods: {
    refreshGD() {
      this.isShowRefresh = false;
      this.onItemClick(Number(localStorage.getItem("tabIndex")));
    },
    reloadInstall() {
      if (localStorage.getItem("isInstall") == "true") {
        this.onItemClick(Number(localStorage.getItem("tabIndex")));
      }
    },
    reloadDaiQueRen() {
      if (localStorage.getItem("isQueRen") == "true") {
        localStorage.setItem("isQueRen", false);
        this.getCountsOfNoRead();

        this.onItemClick(Number(localStorage.getItem("tabIndex")));
      }
    },
    reloadHome() {
      if (localStorage.getItem("addSuccess") == "true") {
        localStorage.setItem("addSuccess", false);
        this.onItemClick(Number(localStorage.getItem("tabIndex")));
      }
    },
    getCountsOfNoRead() {
      this.$byApi.getCountsOfNoRead().then(res => {
        if (res && res.data) {
          this.$store.commit("GetCountOfNoread", res.data.obj);
        }
      });
    },
    resfull() {
      setTimeout(() => {
        this.$refs.scroll.SuccessPullDown();
      }, 500);
    },
    handlerPullUp() {
      // let allData = this.allAdasData;
      let allData = this.gd_list;
      // let data = this.adasData;
      let data = this.current_GDlist;
      let pageSum = Math.ceil(allData.length / 5);
      let pageIndex = Math.ceil(data.length / 5);
      if (pageIndex >= pageSum) return;
      this.pullUpLoading = "loading";

      setTimeout(() => {
        let newData = allData.slice(pageIndex * 5, (pageIndex + 1) * 5);
        // this.current_GDlist = data.concat(newData);

        this.$store.commit("GongDanList", data.concat(newData));
        this.current_GDlist = this.$store.state.GongDanList;

        pageIndex === pageSum - 1
          ? (this.pullUpLoading = "end")
          : (this.pullUpLoading = "start");
        this.$refs.scroll.refresh();
      }, 500);
    },
    deviceVos(data) {
      if (data) {
        var list = [];
        for (var i = 0; i < data.length; i++) {
          list.push(data[i].terminalNo);
        }

        var tt = list.join("/");

        return tt;
      } else {
        return "";
      }
    },
    status(key) {
      switch (Number(key)) {
        case 1:
          return "待确认";
          break;
        case 2:
          return "待安装";
          break;
        case 3:
          return "已安装";
          break;
        case 4:
          return "已完成";
          break;
        case 5:
          return "已取消";
          break;
      }
    },
    TimeTitle(key, list) {
      switch (Number(key)) {
        case 1:
          return "预安装时间";
          break;
        case 2:
          return "确认时间";
          break;
        case 3:
          return "安装时间";
          break;
        case 4:
          return "完成时间";
          break;
        case 5:
          return "取消时间";
          break;
      }
    },
    TimeData(key, list) {
      switch (Number(key)) {
        case 1:
          return list.installTime; //"预安装时间";
          break;
        case 2:
          return list.confirmTime; //"确认时间";
          break;
        case 3:
          return list.installedTime; //"安装时间";
          break;
        case 4:
          return list.finishTime; //"完成时间";
          break;
        case 5:
          return list.cancelTime; //"取消时间";
          break;
      }
    },
    request() {},

    onItemClick(index) {
      this.isNoDatas = false;
      this.isShowloding = true;
      this.$store.commit("GongDanList", null);
      this.getCountsOfNoRead();
      localStorage.setItem("tabIndex", index);
      this.pullUpLoading = "";

      document.getElementById("scroll").style.height = "77vh";

      let param = {
        status: Number(index) ////订单状态
      };
      console.log("getWorkSheetByStatus---------index---------");
      this.$byApi
        .getWorkSheetByStatus(param)
        .then(res => {
          console.log("getWorkSheetByStatus", res);
          if (res.data.flag == 1) {
            this.isShowRefresh = false;
            this.isShowloding = false;
            this.gd_list = res.data.obj;
            if (this.gd_list.length == 0) {
              this.isNoDatas = true;
            } else {
              this.isNoDatas = false;
            }
            // this.current_GDlist = this.gd_list.slice(0, 5);
            this.$store.commit("GongDanList", this.gd_list.slice(0, 5));
            this.current_GDlist = this.$store.state.GongDanList;
          }
        })
        .catch(e => {
          console.error(e);
          this.isShowloding = false;
          this.isShowRefresh = true;
        });
    },
    addNew() {
      this.$router.push("/AddNew");
    },
    searchChange() {
      this.isShowTitle = false;
      this.isShowAdd = false;
      this.isShowSearch = false;
    },
    search() {
      if (this.searchValue == "") {
        this.msg = "请先输入要查询的数据！";
        this.showValue = true;
        this.showPosition = "middle";
        return;
      }
      let param = {
        searchValue: this.searchValue
      };

      this.$byApi
        .getWorkSheetByCondition(param)
        .then(res => {
          if (!res.data.obj) {
            this.isNoData = true;
            this.searchData = [];
            return;
          }
          if (res.data.obj.length == 0) {
            this.isNoData = true;
            this.searchData = [];
          } else {
            this.isNoData = false;
            this.searchData = res.data.obj;
          }
        })
        .catch(function(error) {});
    },
    back_search() {
      this.isShowTitle = true;
      this.isShowAdd = true;
      this.isShowSearch = true;
      this.isNoData = false;
      this.searchValue = "";
      this.searchData = [];
    },
    showContant(key, datas, index) {
      this.changeReadFlag(datas.id);
      if (
        localStorage.getItem("isNewGongDan") != null &&
        localStorage.getItem("isNewGongDan") != "true"
      ) {
        localStorage.getItem("isNewGongDan", false);
      } else {
        localStorage.setItem("GD_data", JSON.stringify(datas));
        localStorage.getItem("isNewGongDan", false);
      }
      localStorage.setItem("GD_index", index);
      this.$router.push("/Details");
    },
    changeReadFlag(id) {
      let param = {
        id: id
      };
      this.$byApi.changeReadFlag(param).then(res => {
        this.getCountsOfNoRead();
      });
    }
  }
};
</script>

<style lang="less">
.home {
  font-size: 0.25rem;
  .loadingStyles img {
    position: absolute;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.8rem;
    z-index: 999999999999;
  }
  .refreshStyle {
    position: absolute;
    top: 51%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.3rem;
    color: #0866f6;
    z-index: 99;
  }
  .noData {
    text-align: center;
    z-index: -9;
    position: absolute;
    left: 50%; /* 定位父级的50% */
    top: 50%;
    transform: translate(-50%, -50%); /*自己的50% */
  }
  .search_contant {
    position: fixed;
    top: 1rem;
    bottom: 0;
    z-index: 99;
    width: 100%;
    background: #eef3f5;
    font-size: 0.28rem;
    max-height: calc(85vh);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    display: block;
  }
  // .tabKuang {
  //   position: fixed;
  //   top: 1.9rem;
  //   bottom: 1.1rem;
  //   z-index: 99;
  //   width: 100%;
  //   font-size: 0.28rem;
  //   max-height: calc(100vh - 1rem);
  //   // overflow: scroll;
  //   -webkit-overflow-scrolling: touch;
  //   display: block;
  // }
  .tab {
    // margin-top: 0.1rem;
    /deep/ .vux-tab .vux-tab-item.vux-tab-selected {
      // color: #0866f6;
      // border-bottom: 3px solid #0866f6;
    }
    /deep/ .vux-tab-ink-bar {
      // background-color: #0866f6;
      text-align: center;
    }
    /deep/ .scrollable .vux-tab-item {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 22%;
      flex: 0 0 20%;
    }
  }
  .header {
    border-bottom: 1px solid #e1e5e9;
    position: relative;
    background: #fff;
    text-align: center;
    padding: 0.1rem 0.2rem;
    height: 0.8rem;
    .icon-xinzeng {
      font-size: 0.43rem;
      float: left;
      padding: 0.05rem 0.05rem 0.1rem 0.05rem;
    }
    .back {
      font-size: 0.35rem;
      float: left;
      font-weight: 600;
      // margin-top:.1rem;
      padding: 0.1rem 0.15rem 0.2rem 0;
    }
    .inputStyle {
      height: 0.55rem;
      margin-top: 0.1rem;
      border: none;
      background: #f5f5f5;
      width: 74%;
      padding-left: 0.2rem;
    }
    ::-webkit-input-placeholder {
      color: #999;
    }
    input,
    textarea,
    select,
    a:focus {
      outline: none;
    }
    .header_title {
      .header_titleStyle {
        margin-right: 0.35rem;
      }
      height: 0.7rem;
      color: #333333;
      font-size: 0.4rem;
      margin-top: 0.08rem;
    }
  }
  .search {
    font-size: 0.5rem;
    color: #333333;
    position: absolute;
    right: 0.2rem;
    top: 0.1rem;
  }
  .list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .cellStyle {
      width: 90%;
      background: #fff;
      margin-top: 0.25rem;
      border-radius: 3%;
      padding: 0.15rem 0.15rem 0.15rem 0.3rem;
      .boxx {
        display: flex;
        flex-direction: row;
        margin-top: 0.1rem;
      }
      .left_text {
        // position: relative;
        display: inline-block;
        // width: 82%;
        width: 100%;
        .title_header {
          position: relative;
          color: #333;
          font-weight: 600;
          // margin-left:.05rem;
          .readStatu {
            position: absolute;
            top: -0.85rem;
            left: -0.3rem;
            font-size: 0.9rem;
            color: red;
            // background: #ffefef;
            border-radius: 5px;
            padding: 0.07rem;
          }
        }
        .left_pic {
          display: flex;
          justify-content: center;
          align-items: Center;
          width: 1.3rem;
          height: 1.3rem;
          border: 1px solid #e1e5e9;
        }
        .right_contant {
          font-size: 0.2rem;
          color: #999;
          display: inline-block;
          //  border:1px solid #000;
          width: 5rem;
          margin-left: 0.3rem;
          .time_text {
            margin-top: 0.2rem;
          }
          .installStyle {
            display: flex;
            flex-direction: row;
            .installText {
              white-space: nowrap;
            }
            .installNum {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
      .right_text {
        display: inline-block;
        // width: 13%;
        // float: right;
        text-align: center;
        font-weight: 600;
        position: relative;
        bottom: 1.86rem;
        left: 88%;
        // top:-86%;
        // left:88%;
      }
      .orangeStyle {
        color: #f68029;
      }
      .statuStyle1 {
        float: right;
      }
    }
  }
}
</style>