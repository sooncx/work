<template>
  <div class="work-page">
    <div class="option">
      <!-- <div class="left">
        <el-button size="small" type="danger" @click="batchDel">批量删除</el-button>
      </div> -->
      <div class="right">
        <el-button
          type="primary"
          size="small"
          @click="showAddUser"
        >新建人员</el-button>
        <el-button
          type="primary"
          style="margin-left:10px;"
          :loading="this.isLoading"
          size="small"
          @click="getAllUser()"
        >查询</el-button>
      </div>
    </div>

    <div class="content">
      <div class="table">
        <el-table
          v-loading="isLoading"
          :data="tableData"
          style="width: 100%;"
          height="100%"
          size="small"
          :stripe="true"
        >
          <!-- <el-table-column type="selection" width="50" /> -->
          <el-table-column
            type="index"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="name"
            label="姓名"
          />
          <el-table-column
            prop="company"
            label="所在单位"
            min-width="180"
          />
          <el-table-column
            prop="username"
            label="账号"
          />
          <el-table-column
            prop="password"
            label="密码"
          />
          <el-table-column
            prop="createTime"
            label="创建日期"
            min-width="180"
          />
          <el-table-column
            prop="remark"
            label="备注"
            min-width="180"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="editShow(scope.row)"
              >修改</el-button>
              <el-button
                type="text"
                size="small"
                @click="delShow(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="table-page">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size="searchParams.pageSize"
          :current-page.sync="searchParams.pageNumber"
          :total="total"
          @current-change="changePage"
        />
      </div> -->
    </div>

    <el-dialog
      :title="isAdd==true?'新建人员':'人员编辑'"
      :visible.sync="isVisible"
      width="600px"
    >
      <el-form
        v-if="isVisible"
        ref="userInfo"
        :model="userInfo"
        :rules="rules"
        label-width="100px"
        class="ruleForm"
      >
        <el-form-item
          label="人员姓名"
          prop="name"
        >
          <el-input
            v-model="userInfo.name"
            placeholder="请填写人员真实姓名"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item
          label="所在单位"
          prop="company"
        >
          <el-input
            v-model="userInfo.company"
            placeholder="请填写所在单位"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input
            v-model="userInfo.username"
            placeholder="请填写账号,首字母英文"
            :disabled="!isAdd"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="userInfo.password"
            placeholder="英文或数字，6-12位"
            :clearable="true"
          />
        </el-form-item>

        <el-form-item
          label="备注信息"
          prop="remark"
        >
          <el-input
            v-model="userInfo.remark"
            type="textarea"
          />
        </el-form-item>
        <el-form-item class="right">
          <el-button
            size="small"
            @click="isVisible = false"
          >取 消</el-button>
          <el-button
            v-if="isAdd"
            size="small"
            type="primary"
            :loading="btnLoading"
            @click="addUser"
          >确 定</el-button>
          <el-button
            v-else
            size="small"
            type="primary"
            :loading="btnLoading"
            @click="confirmEdit"
          >确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { GetAllUser, AddUser, DelUser, EditUser } from "@/api/user.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      isLoading: false,
      btnLoading: false,
      isAdd: true,
      total: 0,
      times: "",
      searchParams: {
        pageSize: 50,
        pageNumber: 1,
        name: "",
        startTime: "",
        endTime: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      currentId: "",
      tableData: [],
      userInfo: {
        id: "",
        name: "",
        company: "",
        permissionLevel: 1,
        username: "",
        password: "",
        remark: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入测试人员姓名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]{2,6}$/,
            message: "姓名2~6个字符"
          }
        ],
        company: [
          { required: true, message: "请输入所在单位", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{2,11}$/,
            message: "长度3-12位,首字母英文+英文字母和数字"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{6,12}$/,
            message: "长度6-12位,英文字母+数字"
          }
        ],
        remark: [
          { min: 0, max: 100, message: "备注字符长度不能超过100" }
          // { pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]{0,100}$/, message: "备注字符长度不能超过100" }
        ]
      },
      isVisible: false,
      selectionRow: []
    };
  },
  computed: {},
  watch: {
    times(newVal, oldVal) {
      this.searchParams.startTime = newVal[0] + " 00:00:00";
      this.searchParams.endTime = newVal[1] + " 23:59:59";
    },
    pageNumber(newVal, oldVal) {
      this.searchParams.pageNumber = newVal;
    }
  },
  created() {},
  mounted() {
    this.getAllUser();
  },
  methods: {
    SelectionChange(val) {
      this.selectionRow = val;
    },
    getAllUser() {
      this.isLoading = true;
      var params = {};
      GetAllUser(params)
        .then(res => {
          this.isLoading = false;
          if (res.code === 0 && res.data) {
            this.tableData = res.data;
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "error",
              duration: 2 * 1000
            });
          }
        })
        .catch(error => {
          this.isLoading = false;
          console.log("error", error);
        });
    },
    changePage(val) {
      console.log(`当前页: ${val}`);
      this.getAllUser();
    },
    clearForm() {
      for (const key in this.userInfo) {
        if (this.userInfo.hasOwnProperty(key)) {
          this.userInfo[key] = "";
        }
      }
    },
    showAddUser() {
      this.clearForm();
      this.isAdd = true;
      this.userInfo.permissionLevel = 1;
      this.isVisible = true;
    },
    addUser() {
      this.$refs["userInfo"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          console.log("userInfo", this.userInfo);
          var params = Object.assign({}, this.userInfo);
          AddUser(params)
            .then(res => {
              this.isLoading = false;
              this.btnLoading = false;
              if (res.code === 0) {
                this.getAllUser();
                this.isVisible = false;
              } else {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: "error",
                  duration: 2 * 1000
                });
              }
            })
            .catch(error => {
              this.isLoading = false;
              this.btnLoading = false;
              console.log("error", error);
            });
        }
      });
    },
    batchDel() {
      if (this.selectionRow.length === 0) {
        this.$message({
          showClose: true,
          message: "请先勾选要删除的测试人员",
          type: "warning"
        });
        return false;
      }
      this.$confirm("是否批量删除所选用户？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "批量删除",
        cancelButtonText: "取消删除"
      })
        .then(() => {
          const userIds = [];
          this.selectionRow.forEach(item => {
            userIds.push(item.userId);
          });
          this.confirmBatchDel(userIds);
        })
        .catch(action => {});
    },
    confirmBatchDel(Ids) {
      this.$http({
        url: this.HOST + "/http/InstallWorker/DeleteInstallWorkerByList.json",
        params: { userIds: Ids.join(",") }
      })
        .then(rst => {
          if (rst.code === 1) {
            this.getAllUser();
          } else {
            this.$message({
              showClose: true,
              message: "删除失败，" + rst.msg,
              type: "warning"
            });
          }
          // this.isloadingApi = false;
        })
        .catch(e => {
          // this.isloadingApi = false;
          console.error(e);
          this.$message("网络异常，请稍后再试", {
            // showClose: false,
            // showConfirmButton: false
          });
        });
    },
    delShow(row) {
      const userId = row.id;
      this.$confirm("是否删除用户" + row.name + "？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认删除",
        cancelButtonText: "取消删除"
      })
        .then(() => {
          this.confirmDel(userId);
        })
        .catch(action => {});
    },
    confirmDel(userId) {
      DelUser({ id: userId })
        .then(res => {
          if (res.code === 0) {
            this.getAllUser();
            this.isVisible = false;
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: "删除失败，" + res.msg,
              type: "warning"
            });
          }
        })
        .catch(error => {
          this.isLoading = false;
          console.log("error", error);
        });
    },
    editShow(row) {
      for (const key in this.userInfo) {
        if (this.userInfo.hasOwnProperty(key)) {
          this.userInfo[key] = row[key];
        }
      }
      this.currentId = row.id;
      this.isVisible = true;
      this.btnLoading = false;
      this.isAdd = false;
    },
    confirmEdit() {
      this.$refs["userInfo"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          var params = Object.assign({}, this.userInfo);
          EditUser(params)
            .then(res => {
              if (res.code === 0) {
                this.isVisible = false;
                this.btnLoading = false;
                this.getAllUser();
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: "修改失败，" + res.msg,
                  type: "warning"
                });
              }
            })
            .catch(error => {
              this.isLoading = false;
              this.btnLoading = false;
              console.log("error", error);
            });
        } else {
          return false;
        }
      });
      this.userInfo.userId = this.currentId;
    }
  }
};
</script>
<style lang="scss" scoped>
.work-page {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  /deep/.el-dialog__title {
    font-size: 18px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: #1184e5;
  }
  /deep/.el-table--striped
    .el-table__body
    tr.el-table__row--striped.el-table__row--striped.el-table__row--striped
    td {
    background-color: #f5f8fc; /*替换为你需要的颜色，觉得优先级不够就加!important*/
  }
  .option {
    line-height: 65px;
    padding: 0px 13px;
    .left {
      float: left;
    }
    .right {
      float: right;
    }
    /deep/.el-input {
      max-width: 200px;
    }
  }
  .content {
    flex: 1;
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    .table {
      width: 100%;
      height: 100%;
      border: 1px solid #e8e8e8;
      position: relative;
      /deep/.el-table__fixed-right::before,
      .el-table__fixed::before {
        background-color: transparent;
      }
      .el-table {
        position: absolute;
      }
    }
    .table-page {
      text-align: right;
      padding: 10px;
    }
  }

  .new-work {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /deep/.el-input {
      max-width: 200px;
    }
    /deep/.el-textarea {
      flex: 1;
    }
    .row {
      padding: 12px 15px;
      .item {
        display: flex;
        line-height: 30px;
        font-size: 12px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        label {
          margin-right: 18px;
          min-width: 50px;
        }
        span {
          color: skyblue;
        }
      }
      .left {
        float: left;
      }
      .right {
        float: right;
      }
      .center {
        display: block;
        text-align: center;
        margin-top: 15px;
      }
    }
  }
  .ruleForm {
    .el-form-item {
      margin-bottom: 30px;
    }
  }
  .right {
    text-align: right;
  }
}
</style>
