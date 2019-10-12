<template>
  <el-dialog
    :visible.sync="visible"
    width="600px"
    title="同步数据"
    @open="initParams"
  >
    <el-row>
      <el-col
        :span="12"
        v-for="(item, index) in simList"
        :key="index"
      >
        <div class="input-item">
          <label> {{ item.gprsType }}</label>
          <input
            :value="item.price"
            @input="e => ($set(simList[index], 'price', handelNumber(e)))"
          />
        </div>
      </el-col>
    </el-row>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        size="small"
        @click="getDataFromOldTerrace()"
      >更新</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      simList: [],
      getDataFromOldTerraceParams: {
        customCode: "", //	客户代码	string
        data: "",
        userId: "" //	客户代码	number
      }
    };
  },

  methods: {
    initParams() {
      const oldSimList = [...this.$store.state.simList];
      let newSimList = [];
      oldSimList.map(item => {
        if (!item.gprsType) return;
        item.price = "0";
        newSimList.push(item);
      });
      this.simList = newSimList;
    },
    getDataFromOldTerrace() {
      let params = { ...this.getDataFromOldTerraceParams };
      let reg = /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/;
      let data = {};
      try {
        this.simList.map(item => {
          if (!reg.test(Number(item.price)) && Number(item.price) !== 0) {
            throw "单价请输入数字！"
          };
          data[item.gprsType] = String(item.price);
        });
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }

      params.data = JSON.stringify(data);
      params.pushTime = Date.now();

      this.$API.getDataFromOldTerrace(params).then(res => {
        if (res.code === 0) {
          this.visible = false;
          this.getUploadStatus(params.pushTime);
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getUploadStatus(time) {
      let timer = setInterval(() => {
        this.$API
          .getUploadStatus({ time })
          .then(res => {
            if (res.code !== 0) {
              clearInterval(timer);
              this.$msg({
                message: res.data.msg,
                type: "error"
              });
              return;
            }
            if (JSON.stringify(res.data) === "{}") return;
            clearInterval(timer);
            if (res.data.status === 0) {
              this.$msg({
                message: res.data.msg,
                type: "success"
              });
            } else {
              this.$msg({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            clearInterval(timer);
          });
      }, 10 * 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    handelNumber(e) {
      e.target.value = String(e.target.value).replace(/[^\d+(\.\d+)*]+/, "");
      return String(e.target.value).replace(/[^\d+(\.\d+)*]+/, "");
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  font-size: 14px;
  .el-row {
    margin-bottom: 20px;
  }
  .input-item {
    height: 30px;
    margin-bottom: 10px!important;
    label {
      width: 56px;
    }
  }
}
</style>
