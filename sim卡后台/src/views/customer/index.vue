
<template>
  <div class="customer">
    <div class="customer-left">
      <my-tree
        v-model="filterText"
        @node-click="treeClick"
        :treeData="treeData"
        :defaultProps="defaultProps"
        icon="icon-fangdajing"
        treeIcon="icon-kehu"
      ></my-tree>
    </div>
    <div class="customer-right">
      <div class="filter-type">
        <div
          class="filter-btn filter-btn-primary"
          @click="dialog.addCustomer = true"
        >增加</div>

      </div>
      <div class="filter-table-wrap">
        <el-table
          :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
          stripe
          style="width: 100%"
          height="calc(100% - 70px)"
        >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            type="index"
            min-width="100"
            label="序号"
          >
            <template slot-scope="scope">
              {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="登录账号"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="password"
            label="密码"
          >
          </el-table-column>
          <el-table-column
            prop="corpName"
            label="客户名称"
            width="180"
          >
          </el-table-column>
          <el-table-column
            width="200"
            label="操作"
          >
            <template slot-scope="scope">
              <my-badge
                text="修改密码"
                @click="edit(scope.row)"
              ></my-badge>
              <my-badge
                text="同步数据"
                @click="updateSyncData(scope.row)"
              ></my-badge>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="新增用户"
      :visible.sync="dialog.addCustomer"
      width="430px"
      @close="closedialog"
    >
      <div class="input-item">
        <label>客户代码</label>
        <input
          v-model="fromData.userCode"
          maxlength="15"
        />
      </div>
      <div class="input-item">
        <label>客户名称</label>
        <input
          v-model="fromData.companyName"
          maxlength="15"
        />
      </div>
      <div class="input-item">
        <label>登录账户</label>
        <input
          v-model="fromData.userName"
          @blur="checkForm"
          maxlength="15"
        />
        <span
          class="form_warning"
          v-if="UserTips.user"
        >请填写正确账号</span>
      </div>
      <div class="input-item">
        <label>登录密码</label>
        <input
          type="password"
          v-model="fromData.password"
        />
      </div>
      <!-- <div class="input-item">
        <label>上级客户</label>
        <input />
      </div> -->
      <div
        class="input-item"
        style="height:auto;"
      >
        <label>备注信息</label>
        <textarea
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          maxlength="70"
          rows="5"
          v-model="fromData.remark"
        ></textarea>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="commitUser"
          size="small"
        >确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="dialog.edit"
      width="300px"
    >
      <div class="input-item">
        <label>旧密码</label>
        <input
          v-model="editParams.password"
          maxlength="15"
          type="password"
        />
      </div>
      <div class="input-item">
        <label>新密码</label>
        <input
          v-model="editParams.newPassword"
          maxlength="15"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="editPassword"
          size="small"
        >确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.removeCustomer"
      width="300px"
      class="remove-dialog"
    >
      <div class="removeCustomer">
        <div class="error-icon"><i class="iconfont icon-gantanhao"></i></div>
        <p class="comfir-msg">是否确认删除<span>（{{fromData.companyName}}）</span></p>
        <span class="tips-msg">删除成功后不可恢复</span>
        <!-- <span class="tips-msg">该客户下的SIM卡会回到您卡组</span> -->
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialog.removeCustomer = false"
          size="small"
        >确认删除</el-button>
      </span>
    </el-dialog>

    <sync-data ref="syncData"></sync-data>
  </div>
</template>


<script>
import myTree from "@/components/myTree/";
import { handleTree } from "@/util/common";
import myBadge from "@/components/myBadge/";
import syncData from "./syncData";
export default {
  methods: {
    //同步数据
    updateSyncData({ userId, customCode }) {
      this.$refs.syncData.getDataFromOldTerraceParams.userId = userId;
      this.$refs.syncData.getDataFromOldTerraceParams.customCode = customCode;
      this.$refs.syncData.initParams();
      this.$refs.syncData.visible = true;
    },
    editPassword() {
      if (
        !(
          this.checkpsw(this.editParams.password) &&
          this.checkpsw(this.editParams.newPassword)
        )
      )
        return;

      this.$API.updatePasswordOfA(this.editParams).then(res => {
        if (res.code === 0) {
          this.dialog.edit = false;
          this.$msg({
            message: "修改成功",
            type: "success"
          });
          this.$store.commit("GETUSERLIST", this.treeData[0].children);
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    checkUser(str) {
      var re = /^[a-zA-z]\w{0,15}$/;
      if (re.test(str)) {
        return false;
      } else {
        return true;
      }
    },
    checkpsw(str) {
      if (str.length >= 6) {
        return true;
      } else {
        this.$msg({
          message: "密码长度不能少于6位",
          type: "warning"
        });
        return false;
      }
    },
    checkForm() {
      this.UserTips.user = this.checkUser(this.fromData.userName);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    treeClick(data) {
      if (data.userId === 0) {
        this.tableData = [...this.allTableData];
      } else {
        this.tableData = this.allTableData.filter(
          item => item.userId === data.userId
        );
      }
    },
    // 添加用户
    async commitUser() {
      if (!this.checkAll()) return;
      // let a =  {companyName,name,password,remark} = this.fromData

      this.$API.addCustomOfA(this.fromData).then(res => {
        console.log(res);
        if (res.code === 0) {
          if (!this.treeData[0].children) {
            this.$set(this.treeData[0], "children", []);
          }
          this.treeData[0].children.push(res.data.user);
          this.tableData.push(res.data.user);
          this.dialog.addCustomer = false;
          this.$msg({
            message: "添加成功",
            type: "success"
          });
          this.$store.commit("GETUSERLIST", this.treeData[0].children);
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    checkAll() {
      if (
        this.fromData.companyName == "" ||
        this.fromData.userName == "" ||
        this.fromData.password == ""
      ) {
        this.$msg({
          message: "填写信息不能为空",
          type: "error"
        });
        return false;
      }

      if (!this.UserTips.user && this.checkpsw(this.fromData.password)) {
        return true;
      } else {
        return false;
      }
    },
    edit(data) {
      this.editParams = {
        newPassword: "", //	新密码	string
        password: data.password, //	旧密码	string
        userId: data.userId //	需要更新密码的用户id	number
      };
      this.dialog.edit = true;
    },
    deleteUser(data) {
      this.dialog.removeCustomer = true;
      this.fromData = data;
    },
    //  获取子级用户列表
    async getSimMarkUserList(flag) {
      this.$API.getSimMarkUserList().then(res => {
        if (res.code === 0) {
          this.allTableData = res.data;
          this.tableData = res.data;
          if (flag) {
            this.getUsers();
          }
        }
      });
    },
    // 关闭弹窗清空里面信息
    closedialog() {
      this.fromData = {
        userCode: "", //客户代码
        companyName: "", //客户名称
        userName: "", // 登录账号
        password: "", // 登录密码
        remark: "" //备注
      };
    },
    // 获取用户列表
    async getUsers() {
      let { id, userName, parentId } = this.$store.state.LOGINUSER;
      let infouser = this.tableData.slice(0, this.tableData.length);
      infouser.unshift({
        userId: 0,
        name: userName,
        parentId: parentId
      });
      let data = handleTree(
        infouser,
        this.$store.state.LOGINUSER.parentId,
        "userId",
        "parentId",
        "children"
      );
      this.treeData = data;
    }
  },
  computed: {
    getUserList() {
      return this.$store.state.userList;
    }
  },
  created() {
    this.getSimMarkUserList(true);
  },

  data() {
    return {
      filterText: "",
      UserTips: {
        user: false
      },
      fromData: {
        userCode: "", //客户代码
        companyName: "", //客户名称
        userName: "", // 登录账号
        password: "", // 登录密码
        remark: "" //备注
      },
      treeData: [
        // 用户树形数据
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableData: [], // 用户表格数据
      currentPage: 1,
      pageSize: 50,
      dialog: {
        addCustomer: false,
        removeCustomer: false,
        edit: false
      },
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
      },
      editParams: {
        newPassword: "", //	新密码	string
        password: "", //	旧密码	string
        userId: "" //	需要更新密码的用户id	number
      }
    };
  },

  components: {
    myTree,
    myBadge,
    syncData
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
@import "@/public/css/mixin.scss";
.customer {
  display: flex;
  overflow: hidden;
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;
  .customer-left {
    width: 230px;
    padding: 20px;
    margin-right: 20px;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
  .customer-right {
    background: #fff;
    flex: 1;
    min-width: 900px;
    position: relative;
    .filter-type {
      border-bottom: 1px solid #ebf0f6;
      padding: 16px 20px 14px;
      font-size: 14px;
      display: flex;
      flex-wrap: nowrap;

      .filter-btn {
        color: $btnColor;
        border: 1px solid $btnColor;
        white-space: nowrap;
        cursor: pointer;
        padding: 0 15px;
        height: 26px;
        line-height: 26px;
        font-size: 13px;
        margin-left: 10px;
        &:nth-child(1) {
          margin: 0;
        }
      }
      .filter-btn-primary {
        color: #fff;
        background-color: $btnColor;
      }
    }
    .filter-table-wrap {
      border: 1px solid #ebf0f6;
      position: absolute;
      top: 84px;
      left: 20px;
      right: 20px;
      bottom: 20px;
    }
  }
}
/deep/ .el-dialog {
  .input-item {
    .form_warning {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      margin-left: 10px;
    }
  }
  .removeCustomer {
    .error-icon {
      text-align: center;
      i {
        font-size: 60px;
        color: #dd5e5e;
        margin: 0 auto;
      }
    }
    .comfir-msg {
      color: #5e6571;
      margin: 20px 0;
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
/deep/ .remove-dialog {
  .el-dialog .el-dialog__header {
    border: 0;
  }
}
</style>

