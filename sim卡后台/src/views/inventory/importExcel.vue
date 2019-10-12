<template>
  <div class="import-wrap">
    <input
      ref="File"
      type="file"
      style="display: none;"
      @change="uploadSimExcel($event)"
    >
    <div
      class="import"
      v-if="loadingType === 1"
      @click="$refs.File.click()"
    >
      <i class="iconfont icon-ruku"></i>
      <span>SIM卡入库</span>
    </div>
    <div
      class="importLoading"
      v-if="loadingType === 2"
    >
      <span>
        <i class="iconfont icon-shenqing01"></i>
        <b
          v-for="(item,index) in loadingList"
          :key="index"
          :style="{'background': item === loadingNum ? '#e14343' : '#5160D4'}"
        ></b>
        <i class="iconfont icon-heziwenjiangongzuocaidanmianxing"></i>
      </span>
      <span>入库中</span>
    </div>

    <div
      class="importSucceess"
      v-if="loadingType === 3"
    >
      <i class="iconfont icon-zhengque"></i>
      导入成功，
      <span @click="loadingType = 1;$emit('loadInventoryData')">请刷新</span>
    </div>

    <el-dialog
      :visible.sync="excelErrorVisible"
      width="40%"
      class="daoru"
      v-if="excelErrorObj"
    >
      <div
        class="daoru-title"
        slot="title"
      >
        <div>错误信息：{{ `${excelErrorObj.msg}(${excelErrorObj.data && excelErrorObj.data.length}条)` }}</div>
      </div>
      <div class="daoru-table">
        <el-table
          :data="excelErrorObj.data.slice((pageNumber-1)*pageSize, pageNumber*pageSize)"
          stripe
          style="width: 100%"
          height="400px"
          size="small"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="iccid"
            label="ICCID"
          >
          </el-table-column>
          <el-table-column
            prop="simCard"
            label="SIM卡号"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          small
          layout="prev, pager, next"
          :current-page.sync="pageNumber"
          :page-size.sync="pageSize"
          :total.sync="excelErrorObj.data && excelErrorObj.data.length"
          style="text-align:right;margin-top:10px"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted() {},
  methods: {
    loadingNumChange() {
      let timer = setInterval(() => {
        if (this.loadingType !== 2) {
          clearInterval(timer);
          this.loadingNum = 0;
          return;
        }
        if (this.loadingNum === 6) this.loadingNum = 0;
        this.loadingNum++;
        console.log(this.loadingNum);
      }, 0.5 * 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    uploadSimExcel(e) {
      if (e.target.files.length === 0) {
        this.$msg({
          message: "请选择文件",
          type: "warning"
        });
        return;
      }

      this.loadingType = 2;

      let params = new FormData();
      let time = new Date().getTime();
      params.append("type", 1);
      params.append("upfile", e.target.files[0]);
      params.append("time", time);
      this.$refs.File.value = "";
      this.$API
        .uploadSimExcel(params)
        .then(res => {
          if (res.data.code === 0) {
            this.getUploadStatus(time);
          } else {
            this.$msg({
              message: res.data.msg,
              type: "error"
            });
            this.loadingType = 1;
          }
        })
        .catch(err => {
          this.loadingType = 1;
        });
    },
    getUploadStatus(time) {
      let timer = setInterval(() => {
        this.$API
          .getUploadStatus({ time })
          .then(res => {
            if (res.code !== 0) {
              clearInterval(timer);
              this.loadingType = 1;
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
              this.loadingType = 3;
            } else {
              if (this.$route.path === "/inventory") {
                //在库存页面则显示表格
                this.excelErrorObj = res.data;
                this.excelErrorVisible = true;
              } else {
                this.$msg({
                  message: res.data.msg,
                  type: "error"
                });
              }
              this.loadingType = 1;
            }
          })
          .catch(err => {
            clearInterval(timer);
            this.loadingType = 1;
          });
      }, 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    }
  },

  watch: {
    loadingType(val) {
      if (val === 2) this.loadingNumChange();
    }
  },

  data() {
    return {
      loadingType: 1, //1 为导入 2为导入中 3为导入成功
      loadingNum: 0,
      loadingList: [1, 2, 3, 4, 5, 6],
      excelErrorObj: null,
      excelErrorVisible: false,
      pageNumber: 1,
      pageSize: 100
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
.import-wrap {
  .import {
    color: $btnColor;
    cursor: pointer;
    span {
      margin: 0;
    }
  }
  .importLoading {
    display: flex;
    flex-direction: column;
    span {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      &:nth-child(1) {
        i {
          font-size: 18px;
          &:nth-child(1) {
            color: #e14343;
            margin-right: 10px;
          }
          &:nth-last-child(1) {
            margin-left: 10px;
          }
        }
        b {
          width: 4px;
          height: 4px;
          border-radius: 5px;
          background: $btnColor;
          &:not(:nth-of-type(1)) {
            margin-left: 5px;
          }
        }
      }
      &:nth-child(2) {
        color: #333;
        font-size: 12px;
      }
    }
  }
  .importSucceess {
    display: flex;
    align-items: center;
    i {
      color: #17d587;
      margin-right: 5px;
    }
    span {
      cursor: pointer;
      color: $btnColor;
    }
  }
}
/deep/ .el-dialog__wrapper.daoru {
  .daoru-title {
    color: #c60f0f;
    padding: 10px 20px 10px 0;
    font-size: 14px;
    font-weight: bold;
  }
  .daoru-table {
    border: 1px solid #ebf0f6;
    padding-bottom: 10px;
  }
  .el-pagination {
    justify-content: flex-end;
  }
}
</style>


