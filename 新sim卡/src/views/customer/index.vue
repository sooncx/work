
<template>
  <div class="customer">
    <div class="customer-left">
      <my-tree v-model="filterText" @node-click="treeClick" :treeData="treeData" :defaultProps="defaultProps" icon="icon-fangdajing" treeIcon="icon-kehu"></my-tree>
    </div>
    <div class="customer-right">
      <div class="filter-type">
        <div
          class="filter-btn filter-btn-primary"
          @click="fromData.dialogType = 1;dialog.addCustomer = true"
        >增加</div>

      </div>
      <div class="filter-table-wrap">
        <el-table
          :data="tableData.slice((currentPage-1)* currentPageSize,currentPageSize * currentPage)"
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
            width="50"
            label="序号"
          >
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
          label="操作"
          >
             <template slot-scope="scope">
                <div class="cus_box">
                  <div class="cus_btn" @click="edit(scope.row)">修改资料</div>
                  <!-- <div class="cus_btn" @click="deleteUser(scope.row)">删除</div> -->
                </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="currentPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="fromData.dialogType == 1?'新增用户':'修改用户'"
      :visible.sync="dialog.addCustomer"
      width="430px" 
      @close="closedialog"
    >
      <div class="input-item">
        <label>客户名称</label>
        <input v-model="fromData.corpName" maxlength="15"/>
      </div>
      <div class="input-item">
        <label>登录账户</label>
        <input v-model="fromData.name" @blur="checkForm" maxlength="15"/>
        <span class="form_warning" v-if="UserTips.user">请填写正确账号</span>
      </div>
      <div class="input-item">
        <label>登录密码</label>
        <input type="password" v-model="fromData.password"/>
      </div>
      <div class="input-item" v-show="fromData.dialogType === 1">
        <label>权限</label>
        <el-radio-group v-model="fromData.checkSim">
          <el-radio :label="1">客户</el-radio>
          <el-radio :label="2">监控员</el-radio>
        </el-radio-group>
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
        >{{fromData.dialogType === 1 ? '确定':'修改'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog.removeCustomer"
      width="300px"
      class="remove-dialog"
    >
      <div class="removeCustomer">
        <div class="error-icon"><i class="iconfont icon-gantanhao"></i></div>
        <p class="comfir-msg">是否确认删除<span>（{{fromData.corpName}}）</span></p>
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
  </div>
</template>


<script>
import myTree from "@/components/myTree/";
import { handleTree } from "@/util/handTree";
import { message } from "@/util/message";
export default {
  methods: {
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
        message(-1, "密码长度不能少于6位");
        return false;
      }
    },
    checkForm() {
      this.UserTips.user = this.checkUser(this.fromData.name);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    treeClick(data) {
      this.getNextUsers(data.userId);
    },
    // 添加用户
    async commitUser() {
      if (this.checkAll()) {
        // let a =  {corpName,name,password,remark} = this.fromData
        console.log(this.fromData);

        if (this.fromData.dialogType === 1) {
          try {
            let data = await this.$API.addUser(this.fromData);
            if (!this.treeData[0].children) {
              this.$set(this.treeData[0], "children", []);
            }
            this.treeData[0].children.push(data.data.user);
            this.tableData.push(data.data.user);
            message(0, "添加成功");
            this.$store.commit("GETUSERLIST", this.treeData[0].children);
          } catch (error) {
            console.error("错误信息:", error);
          }
        } else {
          let data = await this.$API.updateUser(this.fromData);
        }
      } else {
        return;
      }

      this.dialog.addCustomer = false;
    },
    checkAll() {
      if (
        this.fromData.corpName == "" ||
        this.fromData.name == "" ||
        this.fromData.password == ""
      ) {
        message(-1, "填写信息不能为空");
        return false;
      }

      if (!this.UserTips.user && this.checkpsw(this.fromData.password)) {
        return true;
      } else {
        return false;
      }
    },
    edit(data) {
      this.fromData.corpName = data.corpName;
      this.fromData.userId = data.userId;
      this.fromData.name = data.name;
      this.fromData.password = data.password;
      this.fromData.remark = data.remark;
      this.fromData.dialogType = 2; // 1为增加用户  2为修改资料
      this.dialog.addCustomer = true;
      // this.fromData = data
    },
    deleteUser(data) {
      this.dialog.removeCustomer = true;
      this.fromData = data;
    },
    //  获取子级用户列表
    async getNextUsers(uid, flag) {
      var user = await this.$API.getNextUserInfo({
        userId: uid
      });

      this.tableData = user.data;
      if (flag) {
        this.getUsers();
      }
    },
    // 关闭弹窗清空里面信息
    closedialog() {
      this.fromData = {
        corpName: "",
        name: "",
        password: "",
        remark: ""
      };
    },
    // 获取用户列表
    async getUsers() {
      let { id, userName, parentId } = this.$store.state.LOGINUSER;
      let infouser = this.tableData.slice(0, this.tableData.length);
      infouser.push({
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
    this.getNextUsers(this.$store.state.LOGINUSER.id, true);
  },

  data() {
    return {
      filterText: "",
      currentPageSize:50,
      UserTips: {
        user: false
      },
      fromData: {
        corpName: "", //客户名称
        name: "", // 登录账号
        checkSim:1,//  权限
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
      dialog: {
        addCustomer: false,
        removeCustomer: false
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
      }
    };
  },

  components: {
    myTree
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
      .cus_box {
        display: flex;
        justify-content: center;
      }
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

