<template>

  <div class="main">
    <headBar
      :type=2
      @exportFromS=exportFromF
    ></headBar>
    <annual
      :data=tableList
      :type=2
      @handleCurrentChange=handleCurrentChange
      @handleSizeChange=handleSizeChange
    ></annual>
    <integral-Operation></integral-Operation>
  </div>
</template>
<script>
import annual from "../../../components/annualCollect/annualCollect";
import headBar from "../../../components/headBar/headBar";
import integralOperation from "../../../components/integralOperation/integralOperation";
export default {
  data() {
    return {
      tableList: []
    };
  },
  methods: {
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

    //获取积分记录
    getIntegralInfo(currentPage, pageSize, id) {
      this.$api
        .getIntegralInfoApi({
          pageNumber: currentPage || 1,
          pageSize: pageSize || 10,
          targetId: id || ""
        })
        .then(res => {
          this.tableList = res.obj.reconds;
        })
        .catch(e => {
          console.log(e, "车辆类型统计数据获取失败");
        });
    },
    exportFromF(data) {
      this.exporeRemindInfo(data);
    },

    handleSizeChange(pageSize) {
      this.getIntegralInfo(1, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.getIntegralInfo(currentPage, 10);
    }
  },
  created() {
    this.getIntegralInfo();
  },
  components: {
    annual,
    headBar,
    integralOperation
  }
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
}
</style>

