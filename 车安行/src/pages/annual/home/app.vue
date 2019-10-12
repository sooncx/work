<template>

  <div class="main">
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
  </div>
</template>
<script>
import annual from "../../../components/annualCollect/annualCollect";
import headBar from "../../../components/headBar/headBar";
export default {
  data() {
    return {
      radio: 1,
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
  components: {
    annual,
    headBar
  }
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
}
</style>

