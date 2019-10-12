<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="300px"
      title="批量修改单价"
    >
      <div class="input-item">
        <label>单价</label>
        <input
          :value="price"
          @input="e => (price = handelNumber(e))"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="comfirVisible = true"
          size="small"
        >确认修改</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="comfirVisible"
      width="300px"
      title="批量修改单价"
    >
      <div class="tranfer-comfir">
        <div>即将修改<span class="red">{{total}}</span>张卡单价为<span class="blue">{{price}}元</span></div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="updatePriceByList()"
          size="small"
        >确认修改</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="err.visible"
      width="40%"
      class="daoru"
    >
      <div
        class="daoru-title"
        slot="title"
      >
        <div>错误信息：{{ `修改单价失败(${err.data.length}条)` }}</div>
      </div>
      <div class="daoru-table">
        <el-table
          :data="err.data.slice((err.pageNumber-1)*err.pageSize, err.pageNumber*err.pageSize)"
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
            prop="ICCID"
            label="ICCID"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          small
          layout="prev, pager, next"
          :current-page.sync="err.pageNumber"
          :page-size.sync="err.pageSize"
          :total.sync="err.data.length"
          style="text-align:right;margin-top:10px"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      comfirVisible: false,
      total: 0,
      searchSimListByInventoryParams: null,
      multipleSelection: [],
      price: "",
      err: {
          visible: false,
          data: [],
          pageNumber: 1,
          pageSize: 50,
      }
    };
  },

  methods: {
    updatePriceByList() {
      let params = {};
      params.price = this.price;
      params.type = this.multipleSelection.length > 0 ? 2 : 1;
      if (params.type === 2) {
        params.iccids = this.multipleSelection
          .map(item => item.iccid)
          .join(",");
      } else {
        params = { ...params, ...this.searchSimListByInventoryParams };
        delete params.pageNumber;
        delete params.pageSize;
      }

      const loading = this.$loading({
        lock: true,
        text: "Loading"
      });
      this.$API
        .updatePriceByList(params)
        .then(res => {
          loading.close();
          if (res.code === 0) {
            this.visible = false;
            this.comfirVisible = false;
            this.$msg({
              message: res.msg,
              type: "success"
            });
            this.$emit('refresh')

            if(res.data.length > 0) {
                this.err.data = res.data.map(item => ({'ICCID': item}));
                this.err.pageNumber = 1;
                this.err.visible = true;
            }
          } else {
            this.$msg({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    handelNumber(e) {
      e.target.value = String(e.target.value).replace(/[^\d+(\.\d+)*]+/, "");
      return String(e.target.value).replace(/[^\d+(\.\d+)*]+/, "");
    }
  }
};
</script>

<style lang="scss">
@import "@/public/css/base.scss";
.tranfer-comfir {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .red {
    color: #d61c1c;
  }
  .blue {
    color: $btnColor;
  }
}

.el-dialog__wrapper.daoru {
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
