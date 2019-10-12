<template>
  <div id="app">
    <!-- 分页弹窗 -->
    <monitorDialog
      :show=show
      @hide=hideDialog
    ></monitorDialog>
    <div class="head">
      <!-- logal navbar -->
      <headNavbar></headNavbar>
    </div>

    <div class="content">
      <div class="left">
        <!-- 左navbar -->
        <navBar @toggle=toggle></navBar>
      </div>
      <div :class="['right',this.flag?'show':'hide']">
        <headBar
          :type=1
          @exportFromS=exportFromF
          @searchFromS=searchFromF
        ></headBar>
        <annual
          :type=1
          :data=tableList
          @handleCurrentChange=handleCurrentChange
          @handleSizeChange=handleSizeChange
        ></annual>
        <integral-Operation></integral-Operation>
        <button @click="showDialog">按钮</button>
      </div>
    </div>

  </div>
</template>
<script>
import navBar from "../../../components/navBar/navBar";
import headNavbar from "../../../components/headNavbar/headNavbar";
import annual from "../../../components/annualCollect/annualCollect";
import headBar from "../../../components/headBar/headBar";
import integralOperation from "../../../components/integralOperation/integralOperation";
import monitorDialog from "../../../components/monitorCenterDialog/monitorCenterDialog";
export default {
  data() {
    return {
      radio: 1,
      tableList: [],
      flag: null,
      show: false
    };
  },
  methods: {
    showDialog() {
      this.show = true;
    },
    hideDialog() {
      this.show = false;
    },
    toggle(data) {
      this.flag = data;
    },
    find(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    //年审和按揭信息 报表导出
    exporeRemindInfo(data) {
      let urls = `${window.location.href.slice(
        0,
        this.find(window.location.href, "/", 2)
      )}${
        this.HOST
      }/http/ClientFp247/ExportExcelOfRemindInfo.json?cycle=${data}&sessionId=cee3c5a7-d8b4-4293-a2cc-e86d5da404c8&loginToken=4cdb8094-09a0-5272-c4bc-905bfefb50e3`;
      window.open(urls, "_blank");
    },
    //查询年审和按揭提醒信息
    getMortgageAndRemindInfo(data, currentPage, pageSize) {
      this.$api
        .getMortgageAndRemindInfoApi({
          cycle: data || 1,
          pageNumber: currentPage || 1,
          pageSize: pageSize || 10
        })
        .then(res => {
          this.tableList = res.obj;
        })
        .catch(e => {});
    },
    exportFromF(data) {
      this.exporeRemindInfo(data);
    },
    searchFromF(data, currentPage, pageSize) {
      this.radio = data;
      this.getMortgageAndRemindInfo(data, currentPage, pageSize);
    },
    handleSizeChange(pageSize) {
      this.getMortgageAndRemindInfo(this.radio, 1, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.getMortgageAndRemindInfo(this.radio, currentPage, 10);
    }
  },
  created() {
    this.getMortgageAndRemindInfo();
  },
  mounted() {},
  components: {
    navBar,
    headNavbar,
    annual,
    headBar,
    integralOperation,
    monitorDialog
  }
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.head {
  width: 100%;
  height: 5%;
}
.content {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: flex-start;

  .left {
    height: 100%;
    position: relative;
  }
  .right {
    right: 0;
    padding: 0 20px;
  }
  .show {
    width: 100%;
  }
  .hide {
    width: 89%;
    transition: 0.5s;
  }
}
</style>