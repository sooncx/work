<template>
  <div class="bs-pages">
    <bs-nav />
    <div class="bs-content">
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
                  @click="$refs.createDialog.visible = true"
                >创建</el-button>
              </div>
            </div>
            <div class="marketing-header-filter">
              <el-select
                v-model="lgetOrderListParams.serMeal"
                placeholder="套餐规格"
                size="small"
                style="width:165px;"
              >
                <el-option
                  v-for="item in $store.state.simList"
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
                @click="initParams()"
              >重置</el-button>
            </div>
          </div>
          <div class="filter-table-wrap">
            <el-table
              :data="ltableData"
              stripe
              style="width: 100%"
              height="calc(100% - 70px)"
              :default-sort="{prop: 'createTime', order: 'descending'}"
            >
              <el-table-column
              type="index"
              min-width="100"
              label="序号"
            >
              <template slot-scope="scope">
                {{ (lgetOrderListParams.pageNumber - 1) * lgetOrderListParams.pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
              <el-table-column
                prop="userCode"
                label="客户代码"
              >
              </el-table-column>
              <el-table-column
                prop="orderNum"
                label="订单号"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                min-width="80"
                label="订单类型"
                prop="orderType"
              >
                <template slot-scope="scope">
                  <orderType
                    :orderType="scope.row.orderType"
                    :plain="true"
                  ></orderType>
                </template>
              </el-table-column>
              <el-table-column
                min-width="80"
                label="状态"
                prop="orderStatus"
              >
                <template slot-scope="scope">
                  <my-badge :orderStatus="scope.row.orderStatus"></my-badge>
                </template>
              </el-table-column>
              <el-table-column
                min-width="180"
                prop="createTime"
                label="时间"
                sortable
              >
              </el-table-column>
              <el-table-column
                prop="serMeal"
                label="套餐规格"
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
                label="操作"
                fixed="right"
              >
                <template slot-scope="scope">
                  <my-badge
                    text="处理"
                    @click="getOrderDetail(scope.row, true)"
                  ></my-badge>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="lgetOrderListParams.pageNumber"
              @size-change="getOrderList(1)"
              @current-change="getOrderList(1)"
              :page-sizes="[50, 100]"
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
                  v-for="item in $store.state.simList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <input
                placeholder="客户代码 / 订单号"
                class="filter-type-input"
                style="margin:0 auto 0 20px;width:30%"
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
              :default-sort="{prop: 'createTime', order: 'descending'}"
            >
              <el-table-column
              type="index"
              min-width="100"
              label="序号"
            >
              <template slot-scope="scope">
                {{ (rgetOrderListParams.pageNumber - 1) * rgetOrderListParams.pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
              <el-table-column
                prop="userCode"
                label="客户代码"
              >
              </el-table-column>
              <el-table-column
                prop="orderNum"
                label="订单号"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                min-width="80"
                label="订单类型"
                prop="orderType"
              >
                <template slot-scope="scope">
                  <orderType
                    :orderType="scope.row.orderType"
                    :plain="true"
                  ></orderType>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                prop="orderStatus"
                min-width="80"
              >
                <template slot-scope="scope">
                  <my-badge :orderStatus="scope.row.orderStatus"></my-badge>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="时间"
                min-width="180"
                sortable
              >
              </el-table-column>
              <el-table-column
                width="100"
                label="操作"
                fixed="right"
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
              :total="rtotal"
              :current-page.sync="rgetOrderListParams.pageNumber"
              @current-change="getOrderList(2)"
              @size-change="getOrderList(2)"
              :page-sizes="[50, 100]"
              :page-size.sync="rgetOrderListParams.pageSize"
            >
            </el-pagination>
          </div>
        </div>
        <!-- 以下两个为当前目录下的dialog， 并不是components目录 -->
        <order-dialog ref="orderDialog" @refresh="init"></order-dialog>
        <create-dialog ref="createDialog" @refresh="init"></create-dialog>
      </div>
    </div>
  </div>
</template>


<script>
import myTree from "@/components/myTree/";
import myBadge from "@/components/myBadge/";
import bsNav from "@/components/nav/";
import simNotification from "@/util/notification";
import { findByGprsBagList } from "@/util/common";
import orderDialog from "./dialog/order";
import createDialog from "./dialog/createOrder";
import orderType from "@/components/orderType/";

export default {
  methods: {
    pollingRefresh() {
      this.init();
      let timer = setInterval(() => {
        this.init();
      }, 30 * 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    getOrderDetail(row, flag) {
      this.$refs.orderDialog.visible = true;
      this.$refs.orderDialog.defaultParams = row;
      this.$refs.orderDialog.handlerOperating();
    },
    handleCurrentChange(type) {
      this.getOrderList(type);
    },
    handleClick(row) {
      console.log(row);
    },
    getOrderList(type) {
      let params =
        type === 1 ? this.lgetOrderListParams : this.rgetOrderListParams;
      this.$API.getOrderList(params).then(res => {
        if (res.code === 0) {
          if (type === 1) {
            this.ltableData = res.data;
            this.ltotal = res.total;
          } else {
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
    initParams() {
      this.customerOrderParams = {
        count: "",
        orderPrice: "",
        remark: "",
        userCode: "",
        type: "",
        orderType: 1,
        exYears: 1,
        sellStatus: 1,
        file: "",
        ifInstall: 1,
        sellType: 1
      };

      this.lgetOrderListParams = {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: "", //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 100, //条数	number
        serMeal: "" //套餐规格	string
      };
    },
    async init() {
      await this.getOrderList(1);
      await this.getOrderList(2);
    }
  },

  watch: {
    ltotal(newVal, curVal) {
      if (curVal === 0 || curVal >= newVal || !this.simNotification) return;
      this.simNotification.sendMsg("新的订单！", {
        icon: require("@/public/img/other/desktop_tip.png"),
        body: `您有${newVal - curVal}个订单`
      });
    }
  },

  created() {
    this.pollingRefresh();
    this.findByGprsBagList();
  },

  mounted() {
    this.simNotification = new simNotification();
  },

  data() {
    return {
      simNotification: null,
      findByGprsBagList,
      ltableData: [],
      rtableData: [],
      ltotal: 0,
      rtotal: 0,
      lgetOrderListParams: {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: '', //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 50, //条数	number
        serMeal: "" //套餐规格	string
      },
      rgetOrderListParams: {
        findCode: "", //模糊搜索（客户代码/订单号）	string
        orderStatus: 4, //订单状态	number
        pageNumber: 1, //当前页	number
        pageSize: 50, //条数	number
        serMeal: "" //套餐规格	string
      },
      statusOptions: [
        {
          value: 0,
          label: "待处理"
        },
        {
          value: 2,
          label: "驳回"
        }
      ],
    };
  },

  beforeRouteEnter(to, from, next) {
    let LOGINUSER = localStorage.getItem("LOGINUSER")
      ? JSON.parse(localStorage.getItem("LOGINUSER"))
      : null;

    if (!LOGINUSER) {
      next("/login");
      return;
    }

    switch (LOGINUSER.userType) {
      case 1:
        next("/");
        break;
      case 2:
        next();
        break;
      default:
        next("/login");
    }
  },

  components: {
    myTree,
    myBadge,
    bsNav,
    orderType,
    orderDialog,
    createDialog
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
.bs-pages {
  height: 100%;
  overflow: hidden;
  min-height: 650px;
  min-width: 1250px;
  .bs-content {
    background: #eef1f5;
    height: calc(100% - 90px);
    overflow: hidden;
    padding: 20px;
    position: relative;
  }
}
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
    overflow: hidden;
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
    }
    .filter-type-input {
      background: #f3f7fb;
      color: #828588;
      border: none;
      outline: 0;
      padding: 0 15px;
      height: 30px;
    }
  }
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
}

/deep/ .el-dialog {
  min-width: 300px;
  font-size: 14px;
  .el-dialog__footer {
    padding: 60px 0 40px;
}
  textarea {
    font: 400 13.3333px Arial;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .input-item {
    height: 30px;
    margin-bottom: 10px;
    .el-radio {
      line-height: 30px;
    }
    label {
      width: 56px;
    }
    .money {
      margin-left: 10px;
      color: #b9c4d1;
    }
    .upload-wrap {
      p {
        position: absolute;
        margin-top: 5px;
        font-size: 10px;
        span {
          cursor: pointer;
          color: rgb(86, 146, 228);
        }
      }
    }
    .el-radio + .el-radio {
      margin-left: 0;
    }
  }
}

/deep/ .order-dialog{
  [class*=el-col-] {
    margin-bottom: 20px
  }
  .el-dialog__footer {
    padding: 40px 0 40px;
}
}
</style>

