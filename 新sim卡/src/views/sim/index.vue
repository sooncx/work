<template>
  <div class="sim">
    <div class="sim-left">
      <div class="sim-left-top">
        <my-tree
          @selectClick="selectClick"
          @node-click="handleNodeClick"
          :selectButton="true"
          :treeData="treeData"
          :defaultProps="defaultProps"
          :selectText="selectbtnText"
          @pushTree="pushTree"
        ></my-tree>

      </div>
      <!-- <div
        class="sim-left-footer"
      >
        <my-tree
          :treeData="grounpsTree"
          @node-click="handlegroupClcik"
          :defaultProps="grounpProps"
          @pushTree="pushTree"
          :tree-icon="'icon-guanliyuan1'"
        ></my-tree>
      </div> -->
    </div>
    <div class="sim-right">
      <div class="search_tableBox">
        <div class="search_tab">
          <el-radio-group
            v-model="selectNum"
            @change="clearData"
          >
            <el-radio :label="1">根据号码</el-radio>
            <el-radio :label="2">根据号段</el-radio>
          </el-radio-group>
        </div>
        <div
          class="search_text"
          v-if="selectNum === 1"
        >
          <textarea
            placeholder="请粘贴ICCID或SIM卡号"
            v-model="simprops.simCards"
          />
          </div>
          <div class="search_sim" v-else>
               <input
                  placeholder="ICCID号字段"
                  class="filter-type-input"
                  style="margin-left:10px"
                  v-model="simprops.startIccid"
                />
                <span class="split-line"></span>
                <input
                  placeholder="ICCID号字段"
                  class="filter-type-input"
                  v-model="simprops.endIccid"
                />
          </div>
          <el-popover
            placement="bottom"
            width="420px"
            trigger="click">
            <div class="popover_col">
              <span class="popover_font">开卡日期</span>
              <el-date-picker
                v-model="pickTime.startOpenTime"
                type="date"
                class="date_picker"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
              <span class="split-line"></span>
              <el-date-picker
                v-model="pickTime.endOpenTime"
                type="date"
                class="date_picker"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
            </div>
                        <div class="popover_col">
              <span class="popover_font">到期日期</span>
              <el-date-picker
                v-model="pickTime.startExpireTime"
                type="date"
                class="date_picker"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
              <span class="split-line"></span>
              <el-date-picker
                v-model="pickTime.endExpireTime"
                type="date"
                class="date_picker"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
            </div>
                        <!-- <div class="popover_col">
              <span class="popover_font">续费日期</span>
              <el-date-picker
                v-model="pickTime.renewStartTime"
                type="date"
                class="date_picker"
                placeholder="请选择日期">
              </el-date-picker>
              <span class="split-line"></span>
              <el-date-picker
                v-model="pickTime.renewEndTime"
                type="date"
                class="date_picker"
                placeholder="请选择日期">
              </el-date-picker>
            </div> -->
            <span class="cus_btn cub_gray" slot="reference">
              日期筛选
              <i class="iconfont icon-more" style="font-size:12px"></i>
            </span>

          </el-popover>

          <div class="search_btn">
              <div @click="searchSim">查询</div>
          </div>
      </div>
      <div class="filter-table-wrap">
              <filter-type
        @handleResult="handleResult"
        :selectCheck="isSelect"
        @outSim="handleOutSim"
        @searchResult="searchResult"
        :isUpdate="uploadFlag"
        @searchCommit="searchCommit"
        @duanxin="allSmsDialog()"
        @shuaxin="uploadSim"
        :grounpsTree="getTreeData || []"
        :selectArr="multipleSelection"
        :tableData="tableData"
        ref="filterType"
      ></filter-type>
        <el-table
          :data="tableData"
          stripe
          empty-text="该批次无库存"
          @selection-change="handleSelectionChange"
          v-loading="loadingTable"
          style="width: 100%;border:1px solid #EBF0F6;"
          height="calc(100vh - 310px)"
        >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            fixed
            prop="simCard"
            align="center"
            label="SIM卡号"
            min-width="130"
          >
          </el-table-column>
          <el-table-column
            prop="iccid"
            align="center"
            label="ICCID"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            width="100"
            prop="outOrIn"
            align="center"
            label="库存状态"
            v-if="!isGrounps"
          >
          <template slot-scope="scope">
                <my-badge :outOrIn="scope.row.outOrIn"></my-badge>
              </template>
          </el-table-column>
                    <el-table-column
            width="100"
            prop="simState"
            align="center"
            label="sim卡状态"
          >
            <template slot-scope="scope">
                <my-badge :simState="scope.row.simState"></my-badge>
              </template>
          </el-table-column>
           
          <el-table-column
            width="100"
            prop="traffic"
            align="center"
            label="总流量"
            :formatter="formatterTraffic"
          >
          </el-table-column>
          <el-table-column
            width="100"
            prop="surplusGprs"
            align="center"
            label="剩余流量"
            :formatter="formatterSurplusGprs"
          >
          </el-table-column>

          <el-table-column
            width="100"
            prop="simType"
            align="center"
            :formatter="formatterType"
            label="套餐类型"
          >
          </el-table-column>
          <el-table-column
            prop="openTime"
            align="center"
            label="	开卡日期"
            width="120"
          >
          </el-table-column>

          <el-table-column
            prop="activationTime"
            align="center"
            label="	激活日期"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="expireTime"
            align="center"
            width="130"
            label="过期日期"
          >
          </el-table-column>
          <el-table-column
            align="center"
            width="130"
            label="续费日期"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.renewDate">{{scope.row.renewDate}}</span>
            <span v-else>暂无数据</span>
          </template>
          </el-table-column>

           <el-table-column
            prop="userName"
            align="center"
            width="130"
            label="所属客户"
          >
          </el-table-column>
          
          <el-table-column
            prop="extend"
            align="center"
            label="	价格"
            :formatter="fotmatterPrice"
          >
          </el-table-column>
          <el-table-column
            prop="traffic"
            width="120"
            align="center"
            label="	当月已发短信"
            :formatter="fotmatterSms"
          >
          </el-table-column>
         

          <el-table-column
            label="操作"
            fixed="right"
            width="170"
          >
            <template slot-scope="scope">
              <div class="cus_box">
                <span class="cus_btn" @click="getIotLlcx(scope.row.iccid)">刷新</span>
                <span
                  class="cus_btn"
                  v-if="!isGrounps &&getUserType() !== 'monitoring'"
                  @click="huabo(scope.row,scope.$index)"
                >划拨</span>
                          <el-dropdown
            placement="bottom"
            trigger="hover"
          >
            <span class="cus_btn">
              更多
              <i class="iconfont icon-more" style="font-size:12px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
              style="padding:0;"
              >
              <span
                  class="cus_btn cus_wd"
                  @click="singelSmsDialog(scope.row,scope.$index)"
                >短信</span>
              </el-dropdown-item>
                        <el-dropdown-item style="padding:0;">
            <span
              class="cus_btn cus_wd"
              @click="$refs.filterType.dialog.xufei = true;$refs.filterType.row = scope.row;$refs.filterType.price = scope.row.prices;$refs.filterType.iccCard = scope.row.iccid"
            >续费
                </span>
              </el-dropdown-item>

              <el-dropdown-item
              style="padding:0;"
              >
              <span
                  class="cus_btn cus_wd"
                  @click="_RemarkerDialog(scope.row,scope.$index)"
                >备注</span>
              </el-dropdown-item>
              <!-- <el-dropdown-item style="padding:0;"
              >
             <span
                  class="cus_btn cus_wd"
                  @click="$refs.filterType.dialog.liuliang = true"
                >叠加包</span>
              </el-dropdown-item> -->
              <el-dropdown-item
              style="padding:0;"
              >
              <span
                  class="cus_btn cus_wd"
                  @click="getDetail(scope.row,scope.$index)"
                >详情</span>
              </el-dropdown-item>
                            <el-dropdown-item
              style="padding:0;"
              >
              <span
                  class="cus_btn cus_wd"
                  v-if="getUserType() === true"
                  @click="typeUpdate(scope.row,scope.$index)"
                >套餐升级</span>
              </el-dropdown-item>
              <!-- <el-dropdown-item style="padding:0;">
             <span
                  class="cus_btn cus_wd"
                  v-if="getUserType() !== 'monitoring'"
                  @click="batchForflow = true"
                >流量设置</span>
              </el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="pageNumber"
          :page-sizes="[50,100]"
          :page-size.sync="pageSize"
          @current-change="currentChange"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <!-- 流量设置 -->
        <el-dialog
          title="流量设置"
          :visible.sync="batchForflow"
          width="320px"
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
            <div class="fontColor1 marginStyle">关停流量: 设置该值后，SIM卡的流量只要少于该流量就会自动关停。</div>
            <div class="fontColor1 marginStyle">预超流量: 设置该值后，剩余流量低于该值首页会有风控警报提醒。</div>
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
            保存
          </div>
        </el-dialog>
            <el-dialog
      title="详情"
      :visible.sync="dialoDetail"
      width="550px"
      class="dialog_detail"
    > 

    <div class="detail_row">
      <div class="detail_col" v-for="(item,index) in detailData" :key="index" >
      <span class="detail_label">{{index}}</span>
      <input type="text" class="detail_input" readonly :value="item">
    </div>
    </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialoDetail = false"
          size="small"
        >确定</el-button>
      </span>
    </el-dialog>

      </div>
    </div>
    <!-- 短信下发 -->
    <smsDialog
      ref="smsDialog"
    ></smsDialog>
  </div>
</template>


<script>
import filterType from "./filterType";
import myTree from "@/components/myTree/";
import myBadge from "@/components/myBadge/";
import { handleTree, toTreeData } from "@/util/handTree";
import { getUserType } from "@/util/common";
import smsDialog from "./smsDialog";
export default {
  mounted() {},
  methods: {
    getUserType,
    async uploadSim() {
      if (this.uploadFlag || this.tableData.length == 0) return;
      this.uploadFlag = true;

      if (this.tableData.length !== 0) {
        let params = this.tableData.map(data => data.iccid);
        this.$message("正在更新数据");
        let res = await this.$API.getIotLlcxAll({ iccid: params.join(",") });
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < res.data.length; j++) {
            if (this.tableData[i].iccid === res.data[j].iccid) {
              this.tableData[i].traffic = res.data[j].traffic;
              this.tableData[i].surplusGprs = res.data[j].surplusGprs;
            }
          }
        }
        this.uploadFlag = false;
      }
      //
    },
    getDetail(data) {
      this.detailData = {
        iccid: data.iccid,
        SIM卡号: data.simCard,
        库存状态: data.outOrIn === 0 ? "未出库" : "出库",
        SIM卡状态: this.fomatterSimstate(data.simState),
        总流量: this.formatterTraffic(data),
        剩余流量: this.formatterSurplusGprs(data),
        套餐类型: this.formatterType(data),
        开卡日期: data.openTime,
        激活日期: data.activationTime,
        过期时间: data.expireTime,
        价格: this.fotmatterPrice(data),
        当月短信: data.traffic
      };

      this.dialoDetail = true;
    },
    fomatterSimstate(simState) {
      if (simState !== undefined) {
        switch (simState) {
          case 0:
            return "正常";
          case 1:
            return "正常";
          case 2:
            return "过期";
          case 3:
            return "销卡";
        }
      }
    },
    _RemarkerDialog(row) {
      // 打开备注信息
      this.$refs.filterType.dialog.remark = true;
      this.$refs.filterType.row = row;
    },
    typeUpdate(data) {
      this.$refs.filterType.dialog.taocan = true;
      this.$refs.filterType.typeData = {
        changeType: data.simType,
        allIccid: data.iccid
      };
    },
    async handleOutSim(len) {
      let allIccid = "";
      this.multipleSelection.map(item => {
        allIccid += item.iccid + ",";
      });
      try {
        let data = await this.$API.restockUserSim({ allIccid });
        this.multipleSelection.map(data => {
          this.tableData.map((item, index) => {
            if (item.iccid == data.iccid) {
              this.tableData.splice(index, 1);
            }
          });
        });

        this.$message({
          message: "退卡成功",
          type: "success"
        });
      } catch (error) {
        this.$message({
          message: "退卡失败",
          type: "warning"
        });
        console.log(error);
      }
    },
    getIotLlcx(iccid) {
      this.$API.getIotLlcx({ iccid }).then(res => {
        for (let i in this.tableData) {
          if (iccid === this.tableData[i].iccid) {
            this.tableData[i] = Object.assign(this.tableData[i], res.data);
            break;
          }
        }
        this.$message({
          message: res.msg,
          type: "success"
        });
      });
    },
    singelSmsDialog(row, index) {
      this.$refs.smsDialog.row = row;
      this.$refs.smsDialog.isSingle = true;
      this.$refs.smsDialog.visible = true;
    },
    allSmsDialog() {
      if (!this.multipleSelection.length) {
        this.$message({
          message: "请选择SIM卡！",
          type: "warning"
        });
        return;
      }
      this.$refs.smsDialog.selectArr = JSON.parse(
        JSON.stringify(this.multipleSelection)
      );
      this.$refs.smsDialog.activeIndex = 0;
      this.$refs.smsDialog.row = this.$refs.smsDialog.selectArr[0];
      this.$refs.smsDialog.isSingle = false;
      this.$refs.smsDialog.visible = true;
    },
    fotmatterPrice(row) {
      return row.prices ? "¥" + row.prices : "¥" + 0;
    },
    fotmatterSms(row) {
      return row.sms + "条";
    },
    fotmatterSim(row) {
      return row.traffic + "/kb";
    },
    searchResult(res) {
      this.pageNumber = 1;
      this.tableData = res.data;
      this.total = res.total;
    },
    searchSim() {
      // console.log(this.simprops.simCards)
      this.simprops.simCards = this.simprops.simCards
        .split(/[\n\s+,]/g)
        .join(",");
      let params = Object.assign(this.simprops, this.pickTime);
      this.$refs.filterType.searchSimList(params);
    },
    // 过滤套餐类型
    formatterType(row) {
      return row.simType + "M";
    },
    formatterTabel(row, column) {
      return ["正常", "正常", "过期", "销卡"][row.simState];
    },
    formatterTraffic(row) {
      return row.traffic + "/kb";
    },
    formatterSurplusGprs(row) {
      if (!row.surplusGprs) return "0kb";
      return row.surplusGprs + "kb";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //  1.是否是单条数据更新  2.剩下未出库的数据  3.转入的卡组ID 4.上级gounpID
    handleResult(data, selectData, gid, selfgid) {
      // 如果有的话ICCID  则是单条数据更新
      let islen = typeof selectData == "number" ? true : false;
      let len = islen ? selectData : selectData.length;
      if (data) {
        len = 1;
        this.tableData[this.rowIndex].outOrIn = len;
      } else {
        if (islen) {
          this.tableData.map(item => {
            item.outOrIn = 1;
          });
        } else {
          selectData.map(item => {
            item.outOrIn = 1;
          });
        }
      }
      this.upDateZn(len, selfgid);
      if (gid) {
        this.upDateTree(this.grounpsTree[0].children, gid, len);
      }
    },
    upDateZn(count, grounp) {
      console.log(count);
      this.selectOneTree[0].children[0].children.map(item => {
        if (item.groupId == grounp) {
          item.name = `${item.pid}-${item.id} (${(item.kucun -= count)} / ${
            item.innum
          })`;
        }
      });
    },
    upDateTree(tree, gid, num, label = "name") {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].groupId == gid) {
          let splData = tree[i][label].split("(");
          let gn = splData[0];
          let oldNum = parseInt(splData[1].slice(0, -1));
          tree[i][label] = `${gn} (${oldNum + num})`;
        }
      }
    },
    huabo(data, index) {
      //有groupId为单条数据
      let arr = "";
      this.rowIndex = index;
      this.$refs.filterType.iccid = data.iccid;
      this.$refs.filterType.parentId = data.inventoryTime;
      this.$refs.filterType.dialog.huabo = true;
    },
    //   1 库存 2为处理出售
    handleNodeClick(data) {
      console.log(data);
      this.pageNumber = 1;
      if (data.isparent) return;
      if (this.isSelect === 1) {
        this.isGrounps = false;
        this.handleTreeOneData(data);
      } else {
        this.isGrounps = true;
        this.handleTreeTwoData(data);
      }
    },
    async handlegroupClcik(data) {
      if (data.groupId) {
        this.$refs.filterType.parentId = data.groupId;
        this.$refs.filterType.searchSimListByInventoryParams = null;
        let params = {
          groups: data.groupId,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        };
        this.paramsData = params;
        this.getTableFn = "getGrounpData";
        this.getGrounpData(params);
      }
    },
    async getGrounpData(params) {
      try {
        let res = await this.$API.searchSimListByGroups(params);
        this.loadingTable = false;
        this.tableData = res.data;
        this.isGrounps = true;
        this.total = res.total;
      } catch (error) {
        this.loadingTable = false;
        console.error("错误信息:", error);
      }
    },
    handleTreeOneData(data) {
      // if (!data.id || data.name === "我的库存" ) {
      //   return;
      // }
      if (data.children || !data.params) {
        return;
      }
      let params = {};
      // this.$refs.filterType.parentId = data;
      this.$refs.filterType.parentId = data.groupId;
      this.$refs.filterType.activeType.type = 2;

      params = {
        startTime: data.params + " 00:00:00",
        endTime: data.params + " 23:59:59",
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };

      this.$refs.filterType.searchSimListByGroupsParams = null;
      this.$refs.filterType.exportParams = null;
      this.$refs.filterType.searchSimListByInventoryParams = params;
      this.$refs.filterType.outcount = data.innum - data.outnum;
      params.searchType = 2;
      this.getSimData(params);
    },
    handleTreeTwoData(data) {
      if (data.simNum) {
        this.handlegroupClcik(data);
        return;
      }
      this.getUserData({ userId: data.userId });
    },
    getUserData(params) {
      this.loadingTable = true;
      this.paramsData = params;
      this.getTableFn = "getUserData";
      this.$API
        .sellSimList(params)
        .then(res => {
          this.tableData = res.data;
          this.total = res.total;
          // this.$message({
          //   message: "查询成功",
          //   type: "success"
          // });
          this.loadingTable = false;
        })
        .catch(error => {
          console.error("错误信息:", error);
          this.loadingTable = false;
        });
    },
    getSimData(params) {
      this.loadingTable = true;
      this.paramsData = params;
      this.getTableFn = "getSimData";
      this.$API
        .searchSimListByInventory(params)
        .then(res => {
          this.tableData = res.data;
          this.total = res.total;
          this.loadingTable = false;
        })
        .catch(err => {
          this.loadingTable = false;
        });
    },
    clearData() {
      for (var i in this.simprops) {
        this.simprops[i] = "";
      }
    },
    searchCommit(val) {
      this.getSimData({
        simCards: val,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      });
    },
    async loadGroupsData() {
      let res = await this.$API.loadInventoryData();

      let InNum = 0;
      let OutNum = 0;
      res.data.map(item => {
        item.outnum += item.outNum;
        InNum += parseInt(item.totalNum);
        OutNum += parseInt(item.outNum);
      });
      this.selectbtnText[0] = `库存(${InNum - OutNum})`;
      let treeData = toTreeData(res.data);
      this.selectOneTree = [
        {
          name: "我的库存",
          img: "/other/kucun.png",
          children: treeData,
          id: -1
        }
      ];
      this.treeData = this.selectOneTree;
      this.loadcustomerData(OutNum);
    },
    async loadcustomerData(OutNum) {
      let res = await this.$API.loadGroupsData();
      let pNum = OutNum;
      res.data.map(item => {
        item.groupName += ` (${item.simNum})`;
        item.name = item.groupName;
        item.icon = "icon-pinglunbankexingxing-copy";
        pNum -= item.simNum;
      });
      this.$set(this.selectbtnText, 1, `已出售(${pNum})`);
      this.grounpsTree = [
        {
          name: "我的卡组",
          img: "/other/cards.png",
          plus: true,
          children: res.data,
          isparent: true
        }
      ];
    },
    currentChange(page) {
      this.paramsData = Object.assign(this.paramsData, { pageNumber: page });
      this[this.getTableFn](this.paramsData);
    },
    selectClick(select) {
      this.isSelect = select;
      if (this.isSelect == 2) {
        this.treeData = this.getTreeData;
      } else {
        this.treeData = this.selectOneTree;
      }
    },
    pushTree(treeData) {
      this.$prompt("请输入卡组名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: val => {
          return val.length > 12 ? false : true;
        },
        inputErrorMessage: "不能超过12位"
      })
        .then(async ({ value }) => {
          let params = {
            parentId: -1,
            groupName: value,
            userId: this.$store.state.LOGINUSER.id
          };
          let data = await this.$API.addSimGroup(params);
          this.addTree(treeData, data.data.data);
          this.$message({
            type: "success",
            message: "添加成功"
          });
        })
        .catch(() => {});
    },
    addTree(treeData, data) {
      const newChild = {
        groupId: data.groupId,
        name: data.groupName + " (0)",
        icon: "icon-pinglunbankexingxing-copy"
      };
      if (!this.grounpsTree[0].children) {
        this.$set(this.grounpsTree[0], "children", []);
      }
      this.grounpsTree[0].children.push(newChild);
    },
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
      console.log(data);
    },
    async getUser() {
      var user = await this.$API.getNextUserInfo({
        userId: this.$store.state.LOGINUSER.id
      });
      return user.data;
    }
  },

  created() {
    this.loadGroupsData();
  },
  data() {
    return {
      isShowHelpLL: false,

      uploadFlag: false, // 是否刷新完成
      pickTime: {
        startOpenTime: "", //开卡日期 Start
        endOpenTime: "", // 开卡日期 End
        startExpireTime: "", //到期日期 Start
        endExpireTime: "" // 到期日期 End
        // renewStartTime3: "", //续费日期 Start
        // renewEndTime4: "" // 续费日期 End
      },
      rowIndex: 0,
      dialoDetail: false,
      getTableFn: "", // 分页请求的方法
      isGrounps: false,
      loadingTable: false,
      detailData: {},
      selectNum: 1,
      selectOneTree: [],
      selectbtnText: ["库存", "已出售"], // 库存数量
      grounpProps: {
        children: "children",
        label: "groupName"
      },
      simprops: {
        simCards: "",
        startIccid: "", //开始iccid号	string
        endIccid: "" //结束iccid号	string
      },
      riskParams: {
        exceedGprs: "",
        overGprs: "",
        simType: "请选择套餐类型",
        riskType: 2
      },
      batchForflow: false,
      filterText: "",
      isSelect: 1,
      grounpsTree: null,
      gid: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableData: [], // 表格数据
      pageNumber: 1,
      pageSize: 50,
      total: 0,
      multipleSelection: [],
      statusType: {
        options: [
          {
            value: "选项1",
            label: "全部状态"
          },
          {
            value: "选项2",
            label: "沉默"
          },
          {
            value: "选项3",
            label: "激活"
          }
        ],
        value: "选项1"
      }
    };
  },

  components: {
    filterType,
    myTree,
    myBadge,
    smsDialog
  },
  computed: {
    getTreeData() {
      return [
        {
          name: "我的客户",
          img: "/other/kehu.png",
          children: this.getUserList,
          isparent: true
        },
        this.grounpsTree ? this.grounpsTree[0] : []
      ];
    },

    simList() {
      return this.$store.state.simList;
    },
    getUserList() {
      return this.$store.state.userList.length
        ? this.$store.state.userList
        : this.getUser();
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
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
@import "@/public/css/mixin.scss";
.sim {
  display: flex;
  overflow: hidden;
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;

  .dialog_detail {
    & /deep/ .el-dialog__body {
      padding: 30px 30px 5px;
    }
    .detail_row {
      display: flex;
      flex-wrap: wrap;
      .detail_col {
        margin-bottom: 20px;

        &:nth-child(even) {
          margin-left: auto;
        }
        .detail_input {
          @extend .inputBg;
          width: 140px;
        }
        .detail_label {
          display: inline-block;
          font-size: 12px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: rgba(88, 97, 108, 1);
          width: 80px;
        }
      }
    }
  }
  .sim-left {
    width: 230px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    #simTop {
      height: 100%;
    }
    .sim-left-top {
      height: 100%;
      // padding: 0 20px 20px;
      background: #fff;
      overflow: hidden;
    }
    .sim-left-footer {
      height: 50%;
      padding: 20px;
      background: #fff;
      margin-top: 20px;
      overflow: hidden;
      & /deep/ .selecttree {
        height: 100%;
      }
    }
  }
  .sim-right {
    // background: #fff;
    flex: 1;
    min-width: 900px;
    position: relative;
    .search_tableBox {
      // height: 90px;
      background: #fff;
      box-sizing: border-box;
      margin-bottom: 10px;
      padding: 15px 0;
      display: flex;
      .search_sim {
        display: flex;
        width: 460px;
        align-items: center;
        .filter-type-input {
          background: #edf2f8;
          color: #828588;
          border: none;
          outline: 0;
          padding: 0 15px;
          height: 32px;
        }
      }
      .cub_gray {
        color: #58616c;
        line-height: 55px;
        margin: 0 10px;
        display: inline;
      }
      .search_btn {
        width: 8%;
        justify-content: center;
        display: flex;
        align-items: center;
        div {
          width: 70%;
          line-height: 27px;
          font-size: 13px;
          height: 27px;
          @include btn1;
        }
      }
      .search_text {
        // flex: 1;
        width: 460px;
        overflow: hidden;
        textarea {
          // width: 500px;
          height: 100%;
        }
      }
      .search_tab {
        display: flex;
        width: 10%;
        height: 55px;
        justify-content: center;
        .el-radio-group {
          display: flex;
          flex-direction: column;
          & /deep/ .el-radio__label {
            font-size: 12px;
          }
          .el-radio + .el-radio {
            margin-left: 0;
            margin-top: auto;
          }
        }
      }
    }
    .filter-table-wrap {
      // border: 1px solid #ebf0f6;
      // position: absolute;
      padding: 0 20px;
      background: #fff;
      // top: 84px;
      // left: 20px;
      // right: 20px;
      // bottom: 20px;
    }
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
  .guanStyle {
    color: #000 !important;
    font-weight: normal !important;
  }
  .noBorderRadius {
    border-radius: 0;
  }
  /deep/ .el-dialog__title {
    color: #4b88f6;
    font-size: 14px;
    font-weight: bold;
  }
  .titleStyle {
    position: relative;
    top: -61px;
    left: 60px;
    width: 190px;
  }
  .wenhao {
    color: #9ba3ab;
  }
  .helpStyle2 {
    position: absolute;
    top: 40px;
    left: 80px;
    background: #f2f9ff;
    width: 390px;
  }
  .fontColor1 {
    color: #818ea5;
    font-size: 12px;
  }
  .marginStyle {
    margin: 10px;
  }
}
</style>

