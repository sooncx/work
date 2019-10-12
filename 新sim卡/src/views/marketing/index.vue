<template>
  <div class="marketing">
    <div class="marketing-left">
      <div class="marketing-header">
        <div class="marketing-header-title">
          <div class="marketing-header-left">
            待处理订单<span>（{{ ltotal }}）</span>
          </div>
          <div class="marketing-header-right">
            <el-button
              type="primary"
              size="small"
              @click="openCreate()"
            >创建</el-button>
          </div>
        </div>
        <div class="marketing-header-filter">
          <el-select
            v-model="lgetOrderListParams.serMeal"
            placeholder="套餐类型"
            size="small"
            style="width:165px;"
          >
            <el-option
              v-for="item in mealOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="lgetOrderListParams.orderStatus"
            placeholder="状态类型"
            size="small"
            style="width:165px;margin:0 0 0 20px"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <input
            placeholder="客户代码 / 订单号"
            class="filter-type-input"
            v-model="lgetOrderListParams.findCode"
            style="margin:0 auto 0 20px;width:20%"
          />
          <el-button
            type="primary"
            size="small"
            @click="getOrderList(1)"
          >查询</el-button>
          <el-button
            type="primary"
            size="small"
          >重置</el-button>
        </div>
      </div>
      <div class="filter-table-wrap">
        <el-table
          :data="ltableData"
          stripe
          style="width: 100%"
          height="calc(100% - 70px)"
          :default-sort="{prop: 'orderStatus', order: 'descending'}"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            width="100"
            prop="userCode"
            label="客户代码"
          >
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="订单号"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="时间"
          >
          </el-table-column>
          <el-table-column
            width="100"
            prop="serMeal"
            label="套餐类型"
          >
          </el-table-column>
          <el-table-column
            width="100"
            prop="counts"
            label="数量"
          >
          </el-table-column>
          <el-table-column
            width="100"
            label="状态"
            prop="orderStatus"
            sortable
          >
            <template slot-scope="scope">
              <my-badge :orderStatus="scope.row.orderStatus"></my-badge>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="操作"
          >
            <template slot-scope="scope">
              <my-badge
                text="处理"
                type="success-fill"
                @click="getOrderDetail(scope.row, true)"
              ></my-badge>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange(1)"
          :current-page.sync="lgetOrderListParams.pageNumber"
          :page-sizes="[100, 200, 300, 400]"
          :page-size.sync="lgetOrderListParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ltotal"
        >
        </el-pagination>
      </div>
    </div>
    <div class="marketing-right">
      <div class="marketing-header">
        <div class="marketing-header-title">
          <div class="marketing-header-left">
            已处理订单<span>（{{ rtotal }}）</span>
          </div>
        </div>
        <div class="marketing-header-filter">
          <el-select
            v-model="rgetOrderListParams.serMeal"
            placeholder="请选择"
            size="small"
            style="width:165px;"
          >
            <el-option
              v-for="item in mealOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <input
            placeholder="客户代码 / 订单号"
            class="filter-type-input"
            style="margin:0 auto 0 20px;width:20%"
            v-model="rgetOrderListParams.findCode"
          />
          <el-button
            type="primary"
            size="small"
            @click="getOrderList(2)"
          >查询</el-button>
        </div>
      </div>
      <div class="filter-table-wrap">
        <el-table
          :data="rtableData"
          stripe
          style="width: 100%"
          height="calc(100% - 70px)"
          :default-sort="{prop: 'name', order: 'descending'}"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            width="100"
            prop="userCode"
            label="客户代码"
          >
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="订单号"
          >
          </el-table-column>
          <el-table-column
            width="100"
            label="状态"
            prop="orderStatus"
            sortable
          >
            <template slot-scope="scope">
              <my-badge :orderStatus="scope.row.orderStatus"></my-badge>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="时间"
          >
          </el-table-column>
          <el-table-column
            width="100"
            label="操作"
          >
            <template slot-scope="scope">
              <my-badge
                text="详情"
                @click="getOrderDetail(scope.row, false)"
              ></my-badge>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          style="justify-content: flex-end;"
          @size-change="handleSizeChange(2)"
          :total="rtotal"
          :current-page.sync="rgetOrderListParams.pageNumber"
          :page-sizes="[100, 200, 300, 400]"
          :page-size.sync="rgetOrderListParams.pageSize"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="操作订单"
      :visible.sync="dialog.operating"
      width="700px"
      v-if="dialog.operating"
    >
      <el-row>
        <el-col :span="12">
          <div class="input-item">
            <label>客户代码</label>
            <input
              v-model="orderDetail.userCode"
              disabled
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item">
            <label>订单号</label>
            <input
              v-model="orderDetail.orderNum"
              disabled
            />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="input-item">
            <label>购买数量</label>
            <input
              v-model="orderDetail.counts"
              :disabled="!isOperating"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item">
            <label>套餐类型</label>
            <el-select
              v-model="orderDetail.serMeal"
              placeholder="请选择"
              size="small"
              style="width:auto;margin:0"
              disabled
            >
              <el-option
                v-for="item in mealOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="input-item">
            <label>购买单价</label>
            <input
              v-model="orderDetail.orderPrice"
              :disabled="!isOperating"
            />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div
            class="input-item"
            style="align-items:baseline"
          >
            <label>备注信息</label>
            <textarea
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              width="100%"
              rows="5"
              v-model="orderDetail.remark"
              :disabled="!isOperating"
            ></textarea>
          </div>
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="isOperating"
      >
        <el-button
          type="primary"
          size="small"
          @click="runOrderInfo()"
        >提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="创建订单"
      :visible.sync="dialog.create"
      width="400px"
    >
      <el-row>
        <el-col :span="18">
          <div class="input-item">
            <label>客户代码</label>
            <input v-model="customerOrderParams.userCode" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="input-item">
            <label>购买数量</label>
            <input v-model="customerOrderParams.counts" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="input-item">
            <label>套餐类型</label>
            <el-select
              v-model="customerOrderParams.type"
              placeholder="请选择"
              size="small"
              style="width:auto;margin:0"
            >
              <el-option
                v-for="item in mealOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="input-item">
            <label>购买单价</label>
            <input v-model="customerOrderParams.orderPrice" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div
            class="input-item"
            style="align-items:baseline"
          >
            <label>备注信息</label>
            <textarea
              v-model="customerOrderParams.remark"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              width="100%"
              rows="5"
            ></textarea>
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
          @click="pushCustomerOrder()"
        >提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import myTree from "@/components/myTree/";
import myBadge from "@/components/myBadge/";

export default {
  methods: {
    openCreate() {
      for (let key in this.customerOrderParams) {
        this.customerOrderParams[key] = "";
      }
      this.dialog.create = true;
    },
    pushCustomerOrder() {
      this.$API.pushCustomerOrder(this.customerOrderParams).then(res => {
        if (res.code === 0) {
          this.$msg({
            message: res.msg,
            type: "success"
          });
          this.dialog.create = false;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    outPutCardChange(orderId){//订单出库时左右table数据变化
      let row = new Object;
      for(let i = 0;i < this.ltableData.length; i++){
        if(this.ltableData[i].orderId === orderId){
          row = this.ltableData[i];
          row.orderStatus = 4;
          this.ltableData.splice(i,1);
          break;
        }
      }
      this.rtableData.unshift(row);
    },
    runOrderInfo() {
      if(!this.orderDetail.orderPrice){
        this.$msg({
            message: "请填写单价",
            type: "warning"
          });
          return;
      }
      let params = {
        counts: this.orderDetail.counts, //数量	string
        orderPrice: this.orderDetail.orderPrice, //单价	string
        remark: this.orderDetail.remark, //备注	string
        type: this.orderDetail.serMeal, //套餐	string
        orderId: this.orderDetail.orderId //订单ID	number
      };
      this.$API.runOrderInfo(params).then(res => {
        if (res.code === 0) {
          this.outPutCardChange(params.orderId)
          this.$msg({
            message: res.msg,
            type: "success"
          });
          this.dialog.operating = false;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getOrderDetail(row, flag) {
      this.isOperating = flag;
      let params = {
        orderId: row.orderId
      };
      this.$API.getOrderDetail(params).then(res => {
        if (res.code === 0) {
          this.orderDetail = res.data;
          this.dialog.operating = true;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    handleCurrentChange(type) {
      this.getOrderList(type);
    },
    handleClick(row) {
      console.log(row);
    },
    getOrderList(type) {
      let params = type === 1 ? this.lgetOrderListParams : this.rgetOrderListParams;
      this.$API.getOrderList(params).then(res => {
        if (res.code === 0) {
          if(type === 1){
            this.ltableData = res.data;
            this.ltotal = res.total;
          }else{
            this.rtableData = res.data;
            this.rtotal = res.total;
          }
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    findByGprsBagList() {
      this.$API.findByGprsBagList().then(res => {
        if (res.code === 0) {
          this.mealOptions = [
            {
              value: "",
              label: "全部套餐"
            }
          ];
          res.data.map(item => {
            this.mealOptions.push({
              value: item.gprsType,
              label: item.gprsType
            });
          });
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    async init(){
      await this.getOrderList(1);
      await this.getOrderList(2);
      await this.findByGprsBagList();
    }
  },
  
  created() {
    this.init()
  },

  data() {
    return {
      ltableData: [],
      rtableData: [],
      ltotal: 0,
      rtotal: 0,
      lgetOrderListParams: {
        findCode: '', //模糊搜索（客户代码/订单号）	string
        orderStatus: '', //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 100, //条数	number
        serMeal: '' //套餐类型	string
      },
      rgetOrderListParams: {
        findCode: '', //模糊搜索（客户代码/订单号）	string
          orderStatus: 4, //订单状态	number
          pageNumber: 1, //当前页	number
          pageSize: 100, //条数	number
          serMeal: '' //套餐类型	string
      },
      dialog: {
        operating: false,
        create: false
      },
      mealOptions: null,
      statusOptions: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: 0,
          label: "待处理"
        },
        {
          value: 1,
          label: "已出库"
        },
        {
          value: 2,
          label: "驳回"
        },
        {
          value: 3,
          label: "删除"
        },
        {
          value: 4,
          label: "处理中"
        }
      ],
      activeName: "first",
      btnLoading: false,
      orderDetail: null,
      isOperating: false,
      customerOrderParams: {
        counts: "",
        orderPrice: "",
        remark: "",
        type: "",
        userCode: ""
      }
    };
  },

  beforeRouteEnter(to, from, next) {
    let LOGINUSER = localStorage.getItem('LOGINUSER') ? JSON.parse(localStorage.getItem('LOGINUSER')) : null;
    LOGINUSER && LOGINUSER.userType === 2 ? next() : next(false);
  },

  components: {
    myTree,
    myBadge
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
.marketing {
  display: flex;
  overflow: hidden;
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;
  .marketing-left {
    width: 58%;
    padding: 0 20px 20px;
    margin-right: 20px;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
  .marketing-right {
    padding: 0 20px 20px;
    background: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .marketing-header {
    height: 156px;
    box-sizing: border-box;
    .marketing-header-title {
      height: 70px;
      border-bottom: 1px solid #e6ebf2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .marketing-header-left {
        font-size: 16px;
        font-weight: bold;
        span {
          color: $btnColor;
        }
      }
      .marketing-header-right {
        margin-left: auto;
      }
    }
    .marketing-header-filter {
      height: 86px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .filter-type-input {
      background: #edf2f8;
      color: #828588;
      border: none;
      outline: 0;
      padding: 0 15px;
      height: 30px;
    }
  }
}
.split-line {
  width: 20px;
  height: 3px;
  margin: auto 10px;
  background: #b5c0ce;
}
.filter-table-wrap {
  flex: 1;
  border: 1px solid #ebf0f6;
  /deep/ .el-pagination {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    & > span {
      margin: 0;
    }
    .el-pagination__total {
      margin-right: auto;
    }
  }
  /deep/ .el-table {
    font-size: 14px;
    .cell {
      line-height: 26px;
    }
    &::before {
      display: none;
    }
    thead {
      th {
        background: #f5f8fc;
        div {
          line-height: 1;
          text-align: center;
          color: $fgray;
        }
      }
    }
    tbody {
      overflow: auto;
      tr {
        td {
          text-align: center;
          border: none;
          color: $fgray;
        }
      }
      tr.el-table__row--striped {
        td {
          background: #f5f8fc;
        }
      }
    }
  }
}

/deep/ .el-select {
  width: 200px;
  margin-left: 10px;
  &:nth-child(1) {
    margin: 0;
  }
  .el-input--suffix {
    .el-input__inner {
      background: #f3f7fb;
      color: #828588;
      border: none;
    }
  }
}
.el-select-dropdown {
  .el-select-dropdown__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 15px;
    color: #828588;
  }
  .el-select-dropdown__item.selected {
    color: $btnColor;
  }
}
/deep/ .el-dialog {
  min-width: 300px;
  font-size: 14px;
  .el-dialog__header {
    border-bottom: 1px solid #f3f4f8;
    padding: 10px 20px;
    .el-dialog__title {
      color: $btnColor;
      font-size: 14px;
      font-weight: bold;
    }
    .el-dialog__headerbtn {
      top: 15px;
      right: 20px;
      .el-dialog__close:hover {
        color: $btnColor;
      }
    }
  }
  .el-dialog__footer {
    text-align: center;
    padding-bottom: 40px;
  }
  textarea {
    width: 100%;
    resize: none;
    background: #f3f7fb;
    border: none;
    text-indent: 10px;
    padding: 10px 5px;
    outline: 0;
    color: #828588;
    font: 400 13.3333px Arial;
  }
  .el-row {
    margin-bottom: 20px;
    &:nth-last-child(1) {
      margin: 0;
    }
  }
  .input-item {
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    &:nth-last-child(1) {
      margin: 0;
    }
    .money {
      margin-left: 10px;
      color: #b9c4d1;
    }
    label {
      width: 56px;
      color: #5a5c6f;
      margin-right: 10px;
    }
    input {
      background: #f3f7fb;
      color: #828588;
      border: none;
      outline: 0;
      padding: 0 15px;
      height: 30px;
    }
    textarea {
      flex: 1;
    }
  }
}
</style>

