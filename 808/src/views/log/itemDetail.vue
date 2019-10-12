<template>
  <div
    v-loading="initStatus==='loading'"
    v-bError="initStatus==='error'"
    bError-msg="网络异常"
    class="detail-box"
    @bError-onReset="findOneById"
  >
    <div class="display-row">
      <div class="col-left">
        检测编号:
      </div>
      <div class="col-right">
        {{ displayData.checkNo }}
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        检测时间:
      </div>
      <div class="col-right">
        {{ displayData.checkTime }}
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        检测功能:
      </div>
      <div class="col-right">
        {{ displayData.function }}
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        检测流水号:
      </div>
      <div class="col-right">
        {{ displayData.msgSerial }}
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        手机号:
      </div>
      <div class="col-right">
        {{ displayData.phone }}
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        日志来源:
      </div>
      <div class="col-right">
        {{ displayData.source }}
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        消息id:
      </div>
      <div class="col-right">
        {{ displayData.msgNo }}
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        原始数据:
      </div>
      <div class="col-right">
        <div class="textarea-div">
          {{ displayData.originalData||'---' }}
        </div>
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        日志描述:
      </div>
      <div class="col-right">
        <div class="textarea-div">
          {{ displayData.descp ||'---' }}
        </div>
      </div>
    </div>
    <div class="display-row">
      <div class="col-left">
        备注:
      </div>
      <div class="col-right">
        <div class="textarea-div">
          {{ displayData.remark ||'---' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { findOneById } from "@/api/log";
export default {
  data() {
    return {
      initStatus: "loading",
      data: this.$route.params.detailData,
      displayData: {}
    };
  },
  created() {
    if (!this.data) {
      this.$router.push({ path: "/" });
    } else {
      this.findOneById();
    }
  },
  methods: {
    findOneById() {
      this.initStatus = "loading";
      findOneById({ id: this.data.id })
        .then(rst => {
          if (rst.code === 0) {
            this.$set(this, "displayData", rst.data);
            this.initStatus = "success";
          } else {
            this.initStatus = "error";
          }
        })
        .catch(e => {
          this.initStatus = "error";
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.detail-box {
  margin-top: 20px;
}
.display-row {
  display: flex;
  padding: 5px 50px;
  > .col-left {
    text-align: right;
    width: 90px;
    margin-right: 5px;
    color: #999;
  }
  > .col-right {
    flex: 1;
  }
}
.textarea-div {
  padding: 5px;
  width: 80%;
  background: #f5f9fd;
  max-height: 300px;
  overflow-y: auto;
  word-break: break-all;
  // line-height: 16px;
}
</style>
