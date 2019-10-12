<template>
  <header class="header-nav">
    <a class="logo">
      <img src="../../public/img/logo.png" />
    </a>
    <ul class="menu">
      <li
        @click="$router.push(item.path)"
        :class="{'menu-item':true,'menu-active':item.key === activeIndex }"
        v-for="(item,index) in list"
        :key="index"
      >
        {{item.name}}
      </li>
    </ul>

    <el-dropdown @command="handleCommand">
      <!-- <el-button type="primary">
        更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button> -->
      <div class="nav-user">
        <span class="dropdown-menu">
          <i class="el-icon-arrow-down"></i>
          {{ $store.state.LOGINUSER.userName }}
        </span>
        <i class="iconfont icon-guanliyuan"></i>
      </div>
      <input
        ref="File"
        type="file"
        style="display: none;"
        @change="uploadSimExcel($event)"
      >
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          command="mealManage"
          v-if="$store.state.LOGINUSER.userType !== 2"
        >套餐管理</el-dropdown-item>
        <el-dropdown-item
          command="updateData"
          v-if="$store.state.LOGINUSER.userType !== 2"
        >数据更新</el-dropdown-item>
        <el-dropdown-item
          command="editPwd"
          v-if="$store.state.LOGINUSER.userType !== 2"
        >修改密码</el-dropdown-item>
        <el-dropdown-item command="exit">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      :visible.sync="dialog.mealManage"
      width="560px"
      class="mealManage-dialog"
      @closed="dialog.mealCredit = false"
      title="套餐管理"
    >
      <div
        class="mealManage-content"
        v-show="!dialog.mealCredit"
      >
        <div
          class="meal-item"
          v-for="(item, index) in $store.state.simList"
          :key="index"
          v-if="item.gprsType"
        >
          <span>{{item.gprsType + "套餐"}}</span>
          <div class="meal-credit-icon">
            <i
              class="iconfont icon-bianji"
              @click="findByGprsBagInfo(item)"
            ></i>
            <i
              class="iconfont icon-lajitong"
              @click="activeMeal = item;$refs.comfirDialog.visible = true;"
            ></i>
          </div>
        </div>
        <div
          class="meal-item add"
          @click="openCredit"
        >
          <span>新增<i class="iconfont icon-zengjia"></i></span>
        </div>

      </div>
      <div
        class="meal-credit"
        v-show="dialog.mealCredit"
      >
        <div class="input-item">
          <label>套餐规格</label>
          <input
            maxlength="4"
            v-model="addAndUpdateGprsBagParams.gprsType"
            style="margin-right:20px"
          />
          <el-select
            v-model="addAndUpdateGprsBagParams.type"
            placeholder="请选择"
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
        <div
          class="input-item"
          style="height:auto;aligin-items: baseline"
        >
          <label>备注信息</label>
          <textarea
            v-model="addAndUpdateGprsBagParams.remark"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            rows="5"
          ></textarea>
        </div>
        <div style="text-align:center">
          <el-button
            type="primary"
            @click="addAndUpdateGprsBag()"
          >保存</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="修改密码"
      :visible.sync="dialog.editPwd"
      width="350px"
    >
      <div class="input-item">
        <label>旧密码</label>
        <input
          type="password"
          v-model.trim="oldPwd"
        />
      </div>
      <div class="input-item">
        <label>新密码</label>
        <input
          type="password"
          v-model.trim="newPwd"
        />
      </div>
      <div class="input-item">
        <label>确认密码</label>
        <input
          type="password"
          @keyup.enter="updatePwd()"
          v-model.trim="comfirPwd"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="updatePwd()"
          size="small"
        >确认</el-button>
      </span>
    </el-dialog>

    <comfirDialog
      ref="comfirDialog"
      text="是否删除?"
      @comfir="delGprsBagInfo()"
    ></comfirDialog>
  </header>
</template>


<script>
import { findByGprsBagList } from "@/util/common";
import comfirDialog from "@/components/comfir/";
export default {
  methods: {
    uploadSimExcel(e) {
      if (e.target.files.length === 0) {
        this.$msg({
          message: "请选择文件!",
          type: "warning"
        });
        return;
      }

      let params = new FormData();
      let time = new Date().getTime();
      params.append("type", 2);
      params.append("upfile", e.target.files[0]);
      params.append("time", time);
      this.$refs.File.value = "";
      this.$API.uploadSimExcel(params).then(res => {
        if (res.data.code === 0) {
          this.getUploadStatus(time);
        } else {
          this.$msg({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getUploadStatus(time) {
      let timer = setInterval(() => {
        this.$API
          .getUploadStatus({ time })
          .then(res => {
            clearInterval(timer);
            if (res.code !== 0) {
              this.$msg({
                message: res.data.msg,
                type: "error"
              });
              return;
            }
          })
          .catch(err => {
            clearInterval(timer);
          });
      }, 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    addAndUpdateGprsBagParamsInit() {
      //params reset
      for (let key in this.addAndUpdateGprsBagParams) {
        this.addAndUpdateGprsBagParams[key] = "";
      }
      this.addAndUpdateGprsBagParams.type = 1;
    },
    openCredit() {
      this.addAndUpdateGprsBagParamsInit();
      this.dialog.mealCredit = true;
    },
    addAndUpdateGprsBag() {
      try {
        if (this.addAndUpdateGprsBagParams.gprsType === "")
          throw "请填写套餐规格！";
        if (!/^[1-9]\d{0,3}$/.test(this.addAndUpdateGprsBagParams.gprsType))
          throw "请输入1-4位数！";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }

      this.$API
        .addAndUpdateGprsBag(this.addAndUpdateGprsBagParams)
        .then(res => {
          if (res.code === 0) {
            this.findByGprsBagList();
            this.addAndUpdateGprsBagParamsInit();
            this.dialog.mealManage = false;
            this.$msg({
              message: res.msg,
              type: "success"
            });
          } else {
            this.$msg({
              message: res.msg,
              type: "error"
            });
          }
        });
    },
    delGprsBagInfo() {
      this.$API.delGprsBagInfo({ gprsId: this.activeMeal.gprsId }).then(res => {
        if (res.code === 0) {
          this.findByGprsBagList();
          this.$refs.comfirDialog.visible = false;
          this.$msg({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    findByGprsBagInfo(item) {
      this.$API.findByGprsBagInfo({ gprsId: item.gprsId }).then(res => {
        if (res.code === 0) {
          this.addAndUpdateGprsBagParams.gprsId = res.data.gprsId;
          this.addAndUpdateGprsBagParams.gprsType = res.data.gprsType;
          this.addAndUpdateGprsBagParams.remark = res.data.remark;
          this.dialog.mealCredit = true;
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    updatePwd() {
      let params = {
        oldPwd: this.oldPwd,
        newPwd: this.newPwd,
        userId: this.$store.state.LOGINUSER.id
      };

      try {
        if (this.newPwd === "" || this.oldPwd === "" || this.comfirPwd === "")
          throw "密码不能为空!";
        if (this.newPwd !== this.comfirPwd) throw "两次密码不一致!";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }

      this.$API.updatePwd(params).then(res => {
        if (res.code === 0) {
          this.$msg({
            message: res.msg,
            type: "success"
          });
          this.dialog.editPwd = false;
          this.oldPwd = "";
          this.newPwd = "";
          this.comfirPwd = "";
        } else {
          this.$msg({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    handleCommand(command) {
      switch (command) {
        case "mealManage":
          this.dialog.mealManage = true;
          break;
        case "updateData":
          this.$refs.File.click();
          break;
        case "editPwd":
          this.dialog.editPwd = true;
          break;
        case "exit":
          this.$router.push("/login");
          break;
      }
    }
  },
  watch: {
    "$route.path": function(val) {
      this.list.map(item => {
        if (`/${item.path}` === val) {
          this.activeIndex = item.key;
        }
      });
    }
  },
  data() {
    return {
      activeIndex: this.$route.name,
      list: [
        { name: "首页", key: "home", path: "home" },
        { name: "库存管理", key: "inventory", path: "inventory" },
        { name: "订单历史", key: "order", path: "order" },
        // { name: "风控设置", key: "risk", path: "risk" },
        { name: "客户管理", key: "customer", path: "customer" },
      ],
      dialog: {
        editPwd: false,
        mealManage: false,
        mealCredit: false
      },
      mealOptions: [
        {
          value: 1,
          label: "M"
        },
        {
          value: 2,
          label: "G"
        }
      ],
      addAndUpdateGprsBagParams: {
        gprsId: "", //套餐ID	number	为空就是新增，不为空就是修改
        gprsType: "", //套餐量	string
        remark: "", //套餐说明	string
        type: 1 //套餐单位	number	1:MB 2:GB
      },
      findByGprsBagList,
      activeMeal: null,
      oldPwd: "",
      newPwd: "",
      comfirPwd: ""
    };
  },
  created() {
    if (this.$route.name === "marketing") {
      this.list = [];
    }
  },
  mounted() {},
  components: {
    comfirDialog
  }
};
</script>


<style lang="scss" scoped>
@import "@/public/css/base.scss";
.header-nav {
  background: #5160d4;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  position: relative;
  .logo {
    height: 40px;
    margin: 0 20px;
    img {
      height: 100%;
      width: 100%;
      // width: 100px;
    }
  }
  .el-dropdown {
    margin-right: 20px;
    .nav-user {
      display: flex;
      align-items: center;
      outline: 0;
      cursor: pointer;
      .dropdown-menu {
        color: #fff;
        margin-right: 10px;
        i {
          font-size: 12px;
        }
      }
      .icon-guanliyuan {
        color: #fff;
        font-size: 24px;
      }
    }
  }

  .menu {
    margin: 0 auto 0 50px;
    .menu-active {
      color: #fff !important;
      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: 0;
        left: 0;
        background: #fff;
      }
    }
    .menu-item {
      float: left;
      list-style: none;
      cursor: pointer;
      color: #aab2ec;
      font-size: 14px;
      // padding: 0 13px;
      width: 85px;
      position: relative;
      text-align: center;
    }
  }
}
.el-dropdown-menu {
  margin-top: 0;
  /deep/ .popper__arrow {
    left: auto !important;
    right: 0;
    margin: 0;
  }
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 15px;
    color: #828588;
  }
}
/deep/ .mealManage-dialog {
  .el-dialog {
    min-width: 400px;
  }
  .el-dialog__body {
    padding: 20px;
  }
  .mealManage-title {
    border-bottom: 1px solid #f3f4f8;
    padding: 0 20px;
    color: $btnColor;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    i {
      color: #b8c3cd;
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .mealManage-content {
    .meal-item {
      display: inline-flex;
      width: 64px;
      height: 40px;
      padding: 0 10px;
      border: 1px solid #e0e5eb;
      background: #f3f7fb;
      justify-content: center;
      align-items: center;
      color: #9fa7af;
      font-size: 12px;
      cursor: pointer;
      position: relative;
      margin-left: 20px;
      &:nth-child(5n + 1) {
        margin: 0;
      }
      &:hover {
        .meal-credit-icon {
          display: flex;
        }
      }
      .meal-credit-icon {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        padding: 0 10px;
        align-items: center;
        justify-content: space-between;
        display: none;
        i {
          flex: 1;
          text-align: center;
          color: #fff;
        }
      }
    }
    .meal-item.add {
      background: $btnColor;
      color: #fff;
      i {
        margin-left: 10px;
        position: relative;
        top: 1px;
      }
    }
  }
}
/deep/ .el-dialog {
  .input-item {
    height: 40px;
    label {
      width: 56px;
    }
    input {
      flex: 1;
    }
  }
}
</style>

