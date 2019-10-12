<template>
  <div
    style="position:relative"
    class="filterType_box"
    @click.stop="stops"
  >
    <div class="filter-type">
      <div class="select_box">
        <div class="select_row">

          <div class="select_col">
            <span class="select_label">库存状态：</span>
            <span
              class="select_font"
              :class="{'activefont':index == activeType.type}"
              @click="searchSimListParams.searchType = item.value;activeType.type = index;searchSimList()"
              v-for="(item,index) in inventoryOptions"
              :key="item.value"
            >{{item.label}}</span>
          </div>
          <div>
            <span class="select_label">状态类型：</span>
            <span
              class="select_font"
              :class="{'activefont':index == activeType.state}"
              @click="searchSimListParams.simState = item.value;activeType.state = index;searchSimList()"
              v-for="(item,index) in statusOptions"
              :key="item.value"
            >{{item.label}}</span>
          </div>
        </div>
        <div class="select_row">
          <div class="select_col">
            <span class="select_label">套餐类型：</span>
            <span
              class="select_font"
              :class="{'activefont':index == activeType.num}"
              @click="searchSimListParams.simType = item.value;activeType.num = index;searchSimList()"
              v-for="(item,index) in simList.length? simList.slice(0,6):simList"
              :key="item.value"
            >{{item.label}}</span>
            <span
              class="select_font "
              v-if="simList.length > 6"
            >
              更多
              <i class="iconfont icon-more"></i>
              <div class="select_down">
                <span
                  @click="searchSimListParams.simType = item.value;activeType.num = index;searchSimList()"
                  v-for="(item,index) in simList.slice(6,simList.length)"
                  :key="index"
                >{{item.label}}</span>
              </div>
            </span>
          </div>
        </div>
      </div>

      <div
        class="filter-btn  filter-btn-primary btn-gray"
        v-on:mouseover="ShowExport=true"
        @mouseout="ShowExport=false"
      >
        <i class="iconfont icon-daochu"></i>
        <transition name="el-zoom-in-top">
          <div
            class="export_dialog"
            v-show="ShowExport"
          >
            <ul>
              <li @click="exportSim(1)">导出筛选项</li>
              <li @click="exportSim">导出全部卡</li>
            </ul>
          </div>
        </transition>
      </div>
      <div
        class="filter-btn  filter-btn-primary btn-gray"
        @click="$emit('shuaxin')"
      >
        <i
          class="iconfont icon-sync"
          :class="{rotate:isUpdate}"
        ></i>
      </div>
      <div
        class="filter-btn filter-btn-primary"
        @click="PutSim"
        v-if="selectCheck === 1&&getUserType() !== 'monitoring'"
      >划拨</div>
      <div
        class="filter-btn filter-btn-primary"
        @click="outSim"
        v-else-if="selectCheck !== 1"
      >退卡入库</div>
      <div
        class="filter-btn filter-btn-primary"
        @click="$emit('duanxin')"
      >批量短信</div>
      <div
        class="filter-btn filter-btn-primary"
        @click="openUserDialog"
        v-if="getUserType() === true"
      >套餐升级</div>
      <div
        class="filter-btn filter-btn-primary"
        @click="handleRenew"
      >批量续费</div>
      <!-- <div
        class="filter-btn filter-btn-primary"
        @click="dialog.liuliang = true"
      >叠加包</div> -->

      <!-- v-if="getUserType() !== 'monitoring'" 控制风控设置显示隐藏-->
      <div
        style="margin-left:10px;"
        @mouseenter="isShowFK=true"
        @mouseleave="isShowFK=false"
        v-if=false
      >
        <div class="filter-btn filter-btn-primary">风控设置</div>
        <div
          class="fengkongKuang"
          v-show="isShowFK"
        >
          <div
            class="fengkongStyle"
            :class="{'hoverBg':isHover1}"
            @mouseenter="isHover1=true"
            @mouseleave="isHover1=false"
            @click="batchForflow = true;isShowFK=false"
          >批量设置</div>
          <div
            class="fengkongStyle"
            :class="{'hoverBg':isHover2}"
            @mouseenter="isHover2=true"
            @mouseleave="isHover2=false"
            @click="dialogVisible = true;isShowFK=false"
          >关停日期</div>
          <div
            class="fengkongStyle"
            :class="{'hoverBg':isHover3}"
            @mouseenter="isHover3=true"
            @mouseleave="isHover3=false"
            @click="riskForflow = true;isShowFK=false"
          >流量风控</div>
        </div>
      </div>
    </div>
    <transition>
      <div
        v-show="filterMore"
        class="filter-type-more"
      >
        <el-select
          v-model="searchSimListParams.simType"
          placeholder="请选择"
          size="small"
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
          v-model="searchSimListParams.simState"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchSimListParams.searchType"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in inventoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <input
          placeholder="ICCID号字段"
          class="filter-type-input"
          style="margin-left:10px"
          v-model="searchSimListParams.startIccid"
        />
        <span class="split-line"></span>
        <input
          placeholder="ICCID号字段"
          class="filter-type-input"
          v-model="searchSimListParams.endIccid"
        />

      </div>
    </transition>

    <!-- ___________________Dialog__________________ -->

    <!-- 批量搜索Start -->

    <el-dialog
      title="批量搜索"
      :visible.sync="dialog.sousuo"
      width="40%"
    >
      <textarea
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        placeholder="请粘贴内容"
        width="100%"
        rows="20"
        v-model="searchVal"
      ></textarea>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="$emit('searchCommit',searchVal);dialog.sousuo = false"
          size="small"
        >开始搜索</el-button>
      </span>
    </el-dialog>

    <!-- 批量搜索End -->

    <!-- 备注 -->
    <el-dialog
      :visible.sync="dialog.remark"
      width="400px"
      title="备注"
      class="huabo"
      @open="getDetailRemark"
    >
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="remarkArea"
        :autosize="{ minRows: 4, maxRows: 8}"
      />
      <el-button
        type="primary"
        class="remark_btn"
        size="medium"
        @click="submitRemark"
      >确定</el-button>
    </el-dialog>
    <!-- 备注End -->

    <!-- 划拨 -->

    <el-dialog
      :visible.sync="dialog.huabo"
      width="400px"
      title="划拨"
      class="huabo"
      @open="closeHuabo"
    >
      <span class="select_num">已选卡数：{{ outCardNum}}张</span>
      <div
        class="select_radio"
        v-if="!iccid"
      >
        <span class="select_label">划拨对象</span>
        <el-radio-group v-model="selectNum">
          <el-radio
            :disabled="selectArr.length == 0"
            :label="1"
          >已勾选卡</el-radio>
          <el-radio
            :disabled="checkallcard"
            :label="2"
          >批次未出库卡</el-radio>
        </el-radio-group>
      </div>
      <select-tree
        class="select_input"
        size="medium"
        :defaultProps="defaultProps"
        ref="selectTree"
        :type="transferSimType"
        @node-dblclick="node => activeNode = node"
        :treeData="grounpsTree"
      >
      </select-tree>

      <div
        v-if="activeNode && activeNode.userId"
        class="huabo_input"
      ><input
          type="text"
          class="filter-type-input"
          v-model="hprice"
          placeholder="输入单价"
        ></div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="comfirTransferSim()"
          size="small"
        >确认划拨</el-button>
      </span>
    </el-dialog>

    <!-- 划拨End -->

    <!-- 续费 -->

    <el-dialog
      title="续费"
      :visible.sync="dialog.xufei"
      width="500px"
      @close="price=null;searchSimListParams.simType = '';priceValue='';isChange=false;iccCard=''"
    >
      <div
        class="price_box"
        v-show="!isChange"
      >
        <div class="price_row">
          <span class="price_label">已选时长:</span>
          <el-select
            v-model="searchSimListParams.simType"
            placeholder="请选择"
            @change="changeRenew"
          >
            <el-option
              v-for="item in priceTime"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="price_row">
          <span class="price_label">续费价格：</span>
          <span class="price_Num">{{priceValue}} 元</span>
        </div>
        <div
          class="price_row"
          v-if="isParent != 1"
        >
          <div
            class="price_code"
            v-for="item in fileList"
            :key="item"
          >
            <img :src="'data:image/png;base64,'+item.payCode" />
            <span>支付宝</span>
          </div>
          <span class="price_tips">转账成功后请及时联系谢谢。</span>
        </div>
        <div v-else>
          <div
            class="renew_btn"
            @click="handleOrder"
          >提交订单</div>
        </div>
      </div>
      <div v-show="isChange">
        <div class="success_box">
          <i class="el-icon-success"></i>
          <span>提交成功</span>
          <span class="price_tips">转账成功后请及时联系业务员</span>
        </div>

      </div>
    </el-dialog>

    <!-- 续费End -->

    <!-- 套餐升级 -->

    <el-dialog
      title="套餐升级"
      :visible.sync="dialog.taocan"
      @close="typeData.allIccid = null;updateTypeData=''"
      width="10%"
      class="dialog-t"
    >

      <span
        class="dialog-tfont"
        v-if="typeData.allIccid"
      >
        原套餐：{{typeData.changeType}}流量套餐
      </span>
      <el-select
        v-model="updateTypeData"
        placeholder="选择升级为"
      >
        <el-option
          v-for="item in getSimtype"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="UpdateType"
          size="small"
        >确认下单</el-button>
      </span>
    </el-dialog>

    <!-- 套餐升级End -->

    <!-- 流量叠加包 -->
    <el-dialog
      title="流量叠加包"
      :visible.sync="dialog.liuliang"
      width="10%"
    >
      <el-select
        v-model="searchSimListParams.simType"
        placeholder="请选择"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialog.liuliang = false"
          size="small"
        >确认下单</el-button>
      </span>
    </el-dialog>

    <!-- 流量叠加包End -->

    <el-dialog
      :visible.sync="dialog.comfirHuabo"
      width="400px"
      @close="closeHuabo"
      class="comfirHuabo-dialog"
    >
      <div class="comfirHuabo">
        <div class="arrow-icon"><img :src="require('@/public/img/other/arrow.png')"></div>
        <p class="comfir-msg">即将划拨
          <span>{{ outCardNum }}</span> 张卡至
          <span>（{{ activeNode && (activeNode.groupName || activeNode.name) }}）</span>
        </p>
        <span class="tips-msg">注意：划拨成功后不可恢复</span>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="transferSim()"
          size="small"
        >确认</el-button>
      </span>
    </el-dialog>
    <!-- 关停日期 -->
    <el-dialog
      title="关停日期"
      :visible.sync="dialogVisible"
      width="350px"
    >
      <div class="titleStyle">
        <span
          class="iconfont icon-wenhao wenhao"
          @mouseover="isShowHelp=true"
          @mouseout="isShowHelp=false"
        ></span>
        <span class="titleFont">该设置将对所有SIM卡生效</span>
      </div>
      <div
        class="helpStyle"
        v-show="isShowHelp"
      >
        <span class="fontColor1">关停日期: 选择日期后,每月到该日期后会自动关停，次月自动开启。</span>
        <!-- <span class="fontColor2">每月到该日期后会自动关停，次月自动开启</span> -->
      </div>
      <div class="dialog-item">
        <span class="item-left">关停日期</span>
        <div class="item-right">
          <el-date-picker
            v-model="outTime"
            format="当月dd号"
            value-format="dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>

      </div>
      <div
        class="dialog-btn noBorderRadius"
        @click="commitRisk"
      >
        保存
      </div>
    </el-dialog>
    <!-- 流量风控 -->
    <el-dialog
      title="流量风控"
      :visible.sync="riskForflow"
      width="350px"
    >
      <div class="titleStyle">
        <span
          class="iconfont icon-wenhao wenhao"
          @mouseover="isShowHelpLL=true"
          @mouseout="isShowHelpLL=false"
        ></span>
      </div>
      <div
        class="helpStyle2"
        v-show="isShowHelpLL"
      >
        <div class="fontColor1 marginStyle">关停流量： 设置该值后，SIM卡的流量只要少于该流量就会自动关停。</div>
        <div class="fontColor1 marginStyle">预超流量： 设置该值后，剩余流量低于该值首页会有风控警报提醒。</div>
      </div>
      <div class="dialog-item">
        <span class="item-left">设置对象</span>
        <div class="item-right">
          <el-dropdown
            placement="bottom-start"
            @command="handleCommand"
            trigger="click"
          >
            <div class="inputBg select">
              {{riskParams.simType}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="item.gprsType"
                v-for="(item,index) in simList"
                :key="index"
              >{{item.gprsType}}</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="dialog-item">
        <div class="item-left">关停流量≤</div>
        <input
          type="text"
          v-model="overGprs"
          class="inputBg item-last item-right"
        />
        <span>M</span>
      </div>
      <div class="dialog-item">
        <div class="item-left">预超流量≤</div>
        <input
          type="text"
          v-model="exceedGprs"
          class="inputBg item-last item-right"
        />
        <span>M</span>
      </div>
      <div
        class="dialog-btn noBorderRadius"
        @click="setGlobalRisk"
      >
        保存
      </div>
    </el-dialog>
    <!-- 批量设置 -->
    <el-dialog
      title="批量设置"
      :visible.sync="batchForflow"
      width="320px"
    >
      <div class="titleStyle">
        <span class="titleFont">该设置将对查询结果生效</span>
      </div>
      <div class="dialog-item">
        <div class="item-left">关停流量≤</div>
        <input
          type="text"
          v-model="overGprs"
          class="inputBg item-last item-right guanStyle"
        />
        <span>M</span>
      </div>
      <div class="dialog-item">
        <div class="item-left">预超流量≤</div>
        <input
          type="text"
          v-model="exceedGprs"
          class="inputBg item-last item-right"
        />
        <span>M</span>
      </div>
      <div
        class="dialog-btn noBorderRadius"
        @click="setGlobalRisk"
      >
      </div>
    </el-dialog>
    <comfirDialog
      ref="outSimdialog"
      @comfir="outSimComfir"
    >
      <p class="outSim_font">是否确定对已选卡进行退卡入库</p>
      <p class="outSim_font">退卡成功将退回<span class="select_font">原批次</span></p>
      <div class="outSim_font outSim_bower">
        <span style="color:#96A1B3">
          已选卡数
        </span>
        <span class="select_font">
          {{selectArr.length}}
        </span>
      </div>
    </comfirDialog>
  </div>
</template>
<script>
import selectTree from "@/components/selectTree/";
import myTree from "@/components/myTree/";
import { getUserType } from "@/util/common";
import comfirDialog from "@/components/dialog/comfir";
export default {
  data() {
    return {
      searchVal: "",
      ShowExport: false,

      radioData: "1",
      typeData: {}, //  当前套餐
      updateTypeData: "", // 升级套餐
      hprice: "", // 划拨给客户的单价
      iccCard: "",
      activeType: {
        type: 2,
        state: 0,
        num: 0
      },
      remarkArea: "", // 备注信息
      isShowHelpLL: false,
      isChange: false,
      isShowHelp: false,
      selectNum: 1,
      isHover1: false,
      isHover2: false,
      exportParams: null, //导出数据
      isHover3: false,
      isShowFK: false,
      isChang: false,
      isShow: false,
      riskForflow: false,
      batchForflow: false,
      dialogVisible: false,
      outcount: 0,
      forFlow: false,
      filterText: "",
      outTime: "",
      riskParams: {
        exceedGprs: "",
        overGprs: "",
        simType: "请选择套餐类型",
        riskType: 2
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeData: null,
      filterMore: false,
      price: null,
      priceValue: "",
      dialog: {
        taocan: false,
        sousuo: false,
        huabo: false,
        remark: false,
        duanxin: false,
        xufei: false,
        liuliang: false,
        comfirHuabo: false
      },
      transferSimType: 1,
      activeNode: null,
      searchSimListParams: {
        endIccid: "", //结束iccid号	string
        endTime: "", //结束时间	string
        searchType: "2", //不传入库，1出库，2未出库	number
        simCards: "", //sim卡号	string
        simState: "", //sim卡状态	number
        simType: "", //sim卡类型	number
        startIccid: "", //开始iccid号	string
        startTime: "" //开始时间	string
      },
      fileList: [],
      priceTime: [
        {
          value: 1,
          label: "1年"
        },
        {
          value: 2,
          label: "2年"
        },
        {
          value: 3,
          label: "3年"
        }
      ],
      statusOptions: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: 1,
          label: "正常"
        },
        {
          value: 2,
          label: "过期"
        },
        {
          value: 3,
          label: "销卡"
        }
      ],
      inventoryOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "出库"
        },
        {
          value: 2,
          label: "未出库"
        }
      ],
      searchSimListByGroupsParams: null,
      searchSimListByInventoryParams: null,
      parentId: null,
      row: null,
      iccid: null
    };
  },

  mounted() {
    let _this = this;
    // this.$root.$on("visible",()=>{
    //   _this.filterMore = false;
    // })
    this.getPayCode();
    document.onclick = function(e) {
      _this.filterMore = false;
    };
  },
  props: {
    grounpsTree: [Array],
    isUpdate: [Boolean],
    selectCheck: [Number],
    selectArr: [Array],
    tableData: {
      type: Array,
      default: new Array()
    }
  },
  watch: {
    hprice(val) {
      this.hprice = this.hprice.replace(/[^0-9]+/g, "");
    }
  },
  methods: {
    async handleOrder() {
      //  allIccid  没有的话 allIccid就是批量套餐升级
      if (!this.searchSimListParams.simType) {
        this.$message({
          message: "请选择年限",
          type: "warning"
        });
        return;
      }
      let arr = [];

      this.selectArr.map(item =>
        arr.indexOf(item.simType + "M") == -1
          ? arr.push(item.simType + "M")
          : ""
      );
      let params = {
        orderType: 3,
        count: this.iccCard ? 1 : this.selectArr.length,
        type: this.iccCard ? this.row.simType + "M" : arr.join(","),
        userCode: this.$store.state.LOGINUSER.userCode,
        allIccid: this.iccCard
          ? this.iccCard
          : this.selectArr.map(item => item.iccid).join(","),
        exYears: this.searchSimListParams.simType,
        orderPrice: this.priceValue
      };

      let data = await this.$API.pushCustomerOrder(params);

      this.isChange = true;
      this.$message({
        message: "提交成功,请等待客服审核",
        type: "success"
      });

      this.dialog.taocan = false;
    },
    changeRenew(val) {
      let Num = 0;
      if (this.price) {
        this.priceValue = parseInt(this.price) * val;
      } else if (this.selectArr.length) {
        this.selectArr.map(item => {
          Num += parseInt(item.prices);
        });
        this.priceValue = Num * val;
      }
    },
    handleRenew() {
      if (!this.selectArr.length) {
        this.$message({
          message: "请选择SIM卡！",
          type: "warning"
        });
        return;
      }
      console.log(this.selectArr);
      this.dialog.xufei = true;
    },
    async getPayCode() {
      let res = await this.$API.getCustomPayCode({ type: 2 });
      this.fileList = res.data;
      // for (let i = 0; i < res.data.length; i++) {
      //   this.$set(
      //     this.ImgList,
      //     res.data[i].type,
      //     "data:image/png;base64," + res.data[i].payCode
      //   );
      // }
    },
    openUserDialog() {
      if (this.selectArr.length === 0) {
        this.$message({
          message: "请先选择SIM卡",
          type: "warning"
        });
      } else {
        this.dialog.taocan = true;
      }
    },
    getUserType,
    exportSim(flag) {
      this.ShowExport = false;
      let EXPORT_URL = `${this.$url}/exportExcel/exportCustomerSim.json?sessionId=${this.$store.state.LOGINUSER.sId}`;
      if (flag === 1) {
        if (this.tableData.length === 0) {
          this.$message({
            message: "无可导出的sim卡",
            type: "warning"
          });
          return;
        } else {
          //  根据筛选项 转化为String参数
          let CROSF = this.exportParams || this.searchSimListByInventoryParams;
          console.log(CROSF, this.searchSimListByInventoryParams);
          for (let i in CROSF) {
            console.log(i);
            EXPORT_URL += `&${i}=${CROSF[i]}`;
          }
        }
      }
      window.open(EXPORT_URL);
    },
    async UpdateType() {
      //  allIccid  没有的话 allIccid就是批量套餐升级
      if (!this.updateTypeData) {
        this.$message({
          message: "请选择套餐",
          type: "warning"
        });
        return;
      }
      let params = {
        orderType: 4,
        userCode: this.$store.state.LOGINUSER.userCode,
        allIccid: this.typeData.allIccid
          ? this.typeData.allIccid
          : this.selectArr.map(item => item.iccid).join(","),
        changeType: this._handleType(this.updateTypeData)
      };

      let data = await this.$API.pushCustomerOrder(params);

      this.$message({
        message: "提交成功,请等待客服审核",
        type: "success"
      });

      this.dialog.taocan = false;
    },
    outSimComfir() {
      this.$emit("outSim");
      this.$refs.outSimdialog.visible = false;
    },
    outSim() {
      if (!this.selectArr.length) {
        this.$message({
          message: "请选择SIM卡！",
          type: "warning"
        });
        return;
      }
      this.$refs.outSimdialog.visible = true;
    },
    PutSim() {
      this.iccid = null;
      if (!this.selectArr.length) {
        this.$message({
          message: "请选择SIM卡！",
          type: "warning"
        });
        return;
      }
      this.dialog.huabo = true;
    },
    closeHuabo() {
      let len = this.selectArr.length;
      if (len != 0) {
        this.selectNum = 1;
      } else {
        this.selectNum = 2;
      }
      this.$nextTick(() => {
        this.$refs.selectTree.clearData();
        this.hprice = "";
        this.activeNode = null;
      });
    },
    async searchSimList(obj) {
      if (obj) {
        if (this.searchSimListByInventoryParams) {
          this.pageNumber = 1;
          this.searchSimListByInventoryParams.startTime = "";

          this.searchSimListByInventoryParams.endTime = "";
        }
        this.searchSimListParams = Object.assign(this.searchSimListParams, obj);
      }
      if (this.searchSimListByInventoryParams) {
        this.searchSimListByInventoryParams.searchType = this.searchSimListParams.searchType;
      }

      if (this.searchSimListParams) {
        let simType = this.searchSimListParams.simType;
        if (simType.indexOf("G") !== -1) {
          this.searchSimListParams.simType =
            parseInt(simType.split("G")[0]) * 1024;
        } else {
          this.searchSimListParams.simType = simType.split("M")[0];
        }
      }

      let res = new Object();

      if (this.searchSimListByGroupsParams) {
        let params = this.searchSimListParams;
        !params.searchType && delete params.searchType;
        params = Object.assign(params, this.searchSimListByGroupsParams);
        this.exportParams = params;
        res = await this.$API.searchSimListByGroups(params);
      } else {
        let params = this.searchSimListParams;
        !params.searchType && delete params.searchType;
        params = Object.assign(params, this.searchSimListByInventoryParams);
        this.exportParams = params;
        res = await this.$API.searchSimListByInventory(params);
      }

      this.$emit("searchResult", res);
    },
    comfirTransferSim() {
      try {
        if (!this.activeNode) throw "请选择库存！";
        if (!this.iccid && !this.tableData.length) throw "SIM卡为空！";
        if (!this.selectData.length && this.checkallcard) throw "无可划拨卡数";
        if (this.hprice == "" && this.activeNode.simNum == null)
          throw "请填写金额";
      } catch (error) {
        this.$message({
          message: error,
          type: "warning"
        });
        return;
      }
      this.dialog.huabo = false;
      this.dialog.comfirHuabo = true;
    },
    async transferSim() {
      //flag为1时是单条数据
      let res = new Object();
      var obj = {};
      let arr = ["selectArr", "selectData"][this.selectNum - 1];
      // 有ICCID为单张出  没有就出所有
      if (this.iccid) {
        obj[this.parentId] = this.iccid;
      } else {
        if (this[arr].length && this.selectNum === 1) {
          this[arr].map(item => {
            if (!obj[item.inventoryTime]) {
              obj[item.inventoryTime] = item.iccid;
            } else {
              obj[item.inventoryTime] += "," + item.iccid;
            }
          });
        }
      }
      let ischeck = null;
      if (!this.checkallcard && this.selectNum == 2 && !this.iccid) {
        let { startTime, endTime } = this.searchSimListByInventoryParams;
        ischeck = {
          startTime,
          endTime
        };
      }
      if (this.activeNode.simNum != null) {
        let params = {
          groupId: this.activeNode.groupId
        };
        params = Object.assign(params, ischeck || { batch: obj });
        res = await this.$API.transferGroupSim(params);
      } else {
        let params = {
          price: this.hprice,
          userId: this.activeNode.userId
        };
        params = Object.assign(params, ischeck || { batch: obj });
        res = await this.$API.transferUserSim(params);
      }

      if (res.data.code === 0) {
        this.$message({
          message: res.data.msg,
          type: "success"
        });

        this.$emit(
          "handleResult",
          this.iccid,
          !this.checkallcard && this.selectNum == 2 ? this.outcount : this[arr],
          this.activeNode.groupId,
          this.parentId
        );
      } else {
        this.$message({
          message: res.data.msg,
          type: "error"
        });
      }
      this.dialog.comfirHuabo = false;
    },
    treeDataChange(type) {
      this.transferSimType = type;
      if (type === 1) {
        this.treeData = this.grounpsTree;
        this.defaultProps.label = "groupName";
      } else {
        this.treeData = this.$store.state.userList;
        this.defaultProps.label = "name";
      }
    },
    //  设置全局日期
    async commitRisk() {
      if (this.outTime == "") {
        alert("请选择时间");
      }
      let params = {
        fixDate: this.outTime,
        riskType: 1
      };

      let data = await this.$API.setGlobalRisk(params);

      this.dialogVisible = false;
    },
    stops() {},
    handleCommand(command) {
      this.riskParams.simType = command;
    },
    // 获取详细备注
    getDetailRemark() {
      this.remarkArea = this.row.remark || ""; //  初始化备注值
    },
    // 提交备注
    async submitRemark() {
      if (!this.remarkArea && this.row) return; //  没有备注就不添加
      let { iccid } = this.row;

      try {
        let res = await this.$API.addRemarkOfSim({
          iccid: iccid,
          remark: this.remarkArea
        });
        this.$message({
          message: res.msg,
          type: "success"
        });
        setTimeout(() => {
          this.dialog.remark = false;
        }, 200);
        // this.$parent.searchSim();
      } catch (error) {
        console.error(error);
      }
      this.$parent.searchSim();
    },
    //  设置流量风控
    async setGlobalRisk() {
      let simType = this.riskParams.simType;
      if (this.riskParams.simType.indexOf("G") !== -1) {
        simType = parseInt(this.riskParams.simType.split("G")[0]) * 1024;
      } else {
        simType = this.riskParams.simType.split("M")[0];
      }
      let params = {
        exceedGprs: this.exceedGprs,
        overGprs: this.overGprs,
        simType: simType,
        riskType: this.riskParams.riskType
      };
      let data = await this.$API.setGlobalRisk(params);
      this.riskForflow = false;
    },
    _handleType(type) {
      if (type.indexOf("G") !== -1) {
        return parseInt(type.split("G")[0]) * 1024;
      } else {
        return parseInt(type.split("M")[0]);
      }
    },
    isHide() {
      this.isShowFK = false;
      this.isChang = false;
      this.isShow = false;
    }
  },
  computed: {
    isParent() {
      return this.$store.state.LOGINUSER.parentId;
    },
    getSimtype() {
      let type = this.typeData.changeType || "";
      let types = this.simList.slice(1, this.simList.length);
      if (!this.typeData.allIccid) {
        type = this.selectArr.map(item => item.simType).sort((a, b) => a - b)[
          this.selectArr.length - 1
        ];
      }
      return types.filter(item => {
        return this._handleType(item.gprsType) > type;
      });
    },

    outCardNum() {
      if (this.iccid) {
        return 1;
      } else if (this.selectArr.length && this.selectNum == 1)
        return this.selectArr.length;
      else if (!this.checkallcard) {
        return this.outcount;
      }
    },
    checkallcard() {
      return this.selectArr.length != this.tableData.length &&
        this.selectArr.length != 0
        ? true
        : false;
    },

    simList() {
      return this.$store.state.simList;
    },
    selectData() {
      if (this.tableData) {
        return this.tableData.filter(item => !item.outOrIn);
      } else {
        return [];
      }
    },
    exceedGprs: {
      set: function(value) {
        this.riskParams.exceedGprs = value;
      },
      get: function() {
        return this.riskParams.exceedGprs == ""
          ? "1"
          : this.riskParams.exceedGprs.replace(/[^0-9]+/g, "");
      }
    },
    overGprs: {
      set: function(value) {
        this.riskParams.overGprs = value;
      },
      get: function() {
        return this.riskParams.overGprs == ""
          ? "1"
          : this.riskParams.overGprs.replace(/[^0-9]+/g, "");
      }
    }
  },
  components: {
    selectTree,
    myTree,
    comfirDialog
  }
};
</script>
<style lang="scss" scoped>
@import "@/public/css/base.scss";
@import "@/public/css/mixin.scss";
@import "@/public/css/ele-reset.scss";
.remark_btn {
  margin: 20px auto;
  display: block;
  overflow: hidden;
}
.success_box {
  display: flex;
  align-items: cemter;
  text-align: center;
  flex-direction: column;
  i {
    font-size: 50px;
    color: #b0df11;
    // color:
  }
  span {
    margin-top: 30px;
    color: #665555;
    font-size: 16px;
    font-weight: bold;
  }
  .price_tips {
    padding-top: 35px;
    text-align: center;
    width: 100%;
    margin: auto;
    display: inline-block;
  }
}
.price_tips {
  font-size: 14px !important;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(28, 94, 214, 1) !important;
}
.price_box {
  .renew_btn {
    width: 90px;
    height: 30px;
    background: #eb5b5b;
    color: #fff;
    text-align: center;
    line-height: 30px;
    margin: auto;
    border-radius: 6px;
    cursor: pointer;
  }
  // margin:

  .price_Num {
    font-size: 14px;
    font-family: PingFang-SC-Bold;
    // font-weight: bold;

    color: #d61c1c;
  }
  .price_row {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .price_code {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      // text-align: center;
      align-items: center;
      &:nth-child(2) {
        margin-left: 50px;
      }
      span {
        font-size: 12px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
      img {
        width: 148px;
        height: 148px;
      }
    }
  }
  .price_label {
    font-size: 14px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  & /deep/ .input__suffix {
    top: 5px;
  }
  & /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
.filterType_box {
  .dialog-t {
    .el-dialog__body {
      padding: 20px 20px;
    }
    .dialog-tfont {
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: #6e737b;
      margin-left: 10px;
      font-size: 12px;
      display: inline-block;
      margin-bottom: 15px;
    }
    .el-select {
      & /deep/ .el-input__icon {
        line-height: 30px;
      }
      & /deep/ .el-input__inner {
        height: 30px !important;
        line-height: 30px !important;
        font-size: 12px;
      }
    }
  }
  .outSim_bower {
    display: flex;
    justify-content: space-between;
  }
  .outSim_font {
    font-size: 14px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    line-height: 30px;
    .select_font {
      color: #1c5ed6;
    }
  }
}
.select_box {
  .select_row {
    display: flex;
    line-height: 25px;
    .select_col {
      &:nth-child(2) {
        margin-left: 10px;
      }
    }
    .select_label {
      font-size: 12px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(186, 192, 203, 1);
    }
    .activefont {
      @extend .cus_btn;
      margin-left: 0;
      display: inline;
      color: #4b88f6 !important;
    }
    .select_down {
      display: flex;
      flex-direction: column;
    }
    .select_font {
      font-size: 12px;
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      display: inline-block;

      color: rgba(88, 97, 108, 1);
      position: relative;
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        & > div {
          visibility: visible;
        }
      }
      div {
        position: absolute;
        visibility: hidden;
        transition: visibility 300ms;
        left: -10px;
        background: #fff;
        box-shadow: 0px 0px 2px 0px #ddd;
        z-index: 11;
        span {
          &:hover {
            color: #4b88f6;
          }
          padding: 0 17px;
        }
      }
      .icon-more {
        font-size: 12px;
      }
    }
  }
}
.marginStyle {
  margin: 10px;
}
.fontColor1 {
  color: #818ea5;
  font-size: 12px;
}
.fontColor2 {
  color: #f2f9ff;
}
.helpStyle {
  position: absolute;
  top: 35px;
  left: 80px;
  background: #f2f9ff;
  height: 39px;
  line-height: 39px;
  width: 390px;
  text-align: center;
}
.helpStyle2 {
  position: absolute;
  top: 32px;
  left: 80px;
  background: #f2f9ff;
  width: 390px;
}
.wenhao {
  color: #9ba3ab;
}
.titleFont {
  color: red;
  font-size: 12px;
  margin-left: 10px;
}
.titleStyle {
  position: relative;
  top: -61px;
  left: 60px;
  width: 190px;
}
.guanStyle {
  color: #000 !important;
  font-weight: normal !important;
}
.noBorderRadius {
  border-radius: 0 !important;
}
.dialog-btn {
  width: 90px;
  cursor: pointer;
  height: 30px;
  background: #1c5ed6;
  border-radius: 3px;
  line-height: 30px;
  margin: 20px auto;
  color: #fff;
  text-align: center;
}
.dialog-item {
  display: flex;
  align-items: center;
  margin: 0 0 25px 0px;
  // &:nth-child(3) {
  //   .item-right {
  //     margin-right: 10px;
  //     width: 150px;
  //   }
  // }
  .item-last {
    margin-right: 10px;
    width: 150px !important;
  }
  &:first-child {
    margin: 0 0 20px 0;
    // padding: 20px 0;
    .item-right {
      font-weight: Bold;
      color: #1c5ed6;
    }
  }
  .item-left {
    width: 80px;
    .el-radio__label {
      font-size: 12px;
    }
  }
  .item-right {
    margin-left: 10px;
    width: 160px;

    .select {
      height: 30px;
      line-height: 30px;
      width: 150px;
      color: #bdc6d0;
    }
    .el-date-editor.el-input {
      width: auto;
    }
    .el-input__inner {
      padding-left: 30px;
      height: 30px;
      width: 160px;
      border-radius: 0;
      @extend .inputBg;
    }
    .el-input__icon {
      line-height: 30px;
    }
  }
}
.filter-type {
  border-bottom: 1px solid #ebf0f6;
  padding: 5px 0 5px;
  font-size: 14px;
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  .filter-more-btn {
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    color: $fgray;
    cursor: pointer;
    font-size: 12px !important;
    i {
      margin-right: 5px;
      font-size: 12px;
      display: inline-block;
    }
  }
  .filter-more-btn.on {
    color: $btnColor;
    i {
      transform: rotate(180deg);
    }
  }
  .filter-btn {
    color: $btnColor;
    border: 1px solid $btnColor;
    white-space: nowrap;
    cursor: pointer;
    padding: 0 15px;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    margin-left: 15px;
    &:hover {
      background: #4770ea;
      border-color: #4770ea;
    }
    &:nth-child(1) {
      margin: 0;
    }
    &:nth-child(2) {
      margin-left: auto;
    }
  }
  .btn-gray {
    background: #ebedef !important;
    border-color: #ebedef !important;
    color: #bac2c9 !important;
    position: relative;
    &:hover {
      .export_dialog {
        // visibility: visible;
        display: block;
      }
    }
    .export_dialog {
      position: absolute;
      z-index: 11111;

      left: 0;
      // transition: all 0.5s;
      // visibility: hidden;
      // display: none;
      // transition: visibility 300ms;
      top: 100%;

      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(230, 234, 239, 1);
      box-shadow: 0px 4px 8px 0px rgba(179, 179, 179, 0.24);
      li {
        color: #58616c;
        padding: 5px 10px;
        &:hover {
          background: #caddff;
        }
      }
    }
  }
  .filter-btn-primary {
    color: #fff;
    background-color: $btnColor;
  }
}
.filter-type-more {
  position: absolute;
  top: 70px;
  z-index: 9;
  display: flex;
  padding: 20px;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  .split-line {
    width: 20px;
    height: 3px;
    margin: auto 10px;
    background: #b5c0ce;
  }
}
.filter-type-input {
  background: #edf2f8;
  color: #828588;
  border: none;
  outline: 0;
  padding: 0 15px;
}
/deep/ .huabo.el-dialog__wrapper {
  .select_num {
    font-size: 12px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(108, 154, 237, 1);
    position: absolute;
    top: 15px;
    left: 75px;
  }
  .select_radio {
    display: flex;
    .select_label {
      font-size: 12px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: #667289;
    }
    & /deep/ .el-radio__label {
      font-size: 12px;
      padding-left: 5px;
    }
    .el-radio {
      margin-left: 30px;
    }
  }
  .el-dialog__header {
    border: 0;
    padding: 10px 0 30px 20px;
    .el-dialog__title {
      font-size: 16px;
    }
  }
  .el-dialog__body {
    padding: 0 18px;
    overflow: hidden;
  }
  .select_input {
    margin: 20px 0;
  }
  .select_type {
    display: flex;
    .select_label {
      margin-right: 20px;
    }
  }
  .huabo_input {
    text-align: center;
    margin-bottom: 20px;
    input {
      width: 100%;
      height: 30px;

      &::-webkit-input-placeholder {
        color: #d4dbe8;
      }
      box-sizing: border-box;
    }
  }
  .myTree {
    .el-tree {
      padding: 10px 0;
      box-sizing: border-box;
      & > .el-tree-node {
        &:nth-last-child(1) {
          padding-bottom: 20px;
        }
      }
    }
    .tree_select {
      border-top: 1px solid #f3f4f8;
      padding: 20px 20px 0;
      margin: 0;
    }
    .filter-input {
      padding: 0 0 0 20px;
      margin-bottom: 10px;
      width: 50%;
      display: flex;
      align-items: center;
      &::before {
        content: "划拨";
        color: $btnColor;
        font-size: 14px;
        font-weight: bold;
        line-height: 24px;
        margin-right: 20px;
        white-space: nowrap;
      }
      input {
        border-radius: 12px;
        height: 25px;
        line-height: 25px;
        background: #f2f3f3;
      }
      .iconfont {
        font-size: 14px;
      }
    }
  }
}
/deep/ .comfirHuabo-dialog {
  .el-dialog .el-dialog__header {
    border: 0;
  }
  .comfirHuabo {
    text-align: center;
    .arrow-icon {
      img {
        width: 182px;
        height: 29.109px;
      }
    }
    .comfir-msg {
      color: #5e6571;
      margin: 50px 0 20px;
      span {
        color: $btnColor;
      }
    }
    .tips-msg {
      margin-bottom: 10px;
      color: #98a4b9;
      font-size: 12px;
      display: block;
      &:last-child {
        margin: 0;
      }
    }
  }
}
.fengkong {
  position: relative;
}
.fengkongKuang {
  position: absolute;
  background: #fff;
  z-index: 99999999;
  box-shadow: 0px 0px 10px #ddd;
  top: 46px;
  width: 84px;
  text-align: center;
}
.fengkongStyle {
  padding: 5px;
  color: #58616c;
  font-size: 12px;
}
.hoverBg {
  background: #f1f6ff;
  color: #4b88f6;
}
/deep/ .filter-type .filter-btn-primary.changeBg {
  background: #2b6de2;
}
</style>

