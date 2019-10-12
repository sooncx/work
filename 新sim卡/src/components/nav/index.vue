<template>
  <header class="header-nav">
    <router-link
      class="logo"
      to="/"
    >
      <img src="../../public/img/logo.png" />
    </router-link>
    <ul class="menu">
      <li
        @click="activeIndex =item.key;$router.push(item.path)"
        :class="{'menu-item':true,'menu-active':item.key === activeIndex }"
        v-for="(item,index) in list"
        v-show="isTopUser(item)"
        :key="index"
      >
        {{item.name}}
      </li>
    </ul>

    <el-dropdown
      trigger="click"
      @command="handleCommand"
    >
      <div class="nav-user">
        <span class="dropdown-menu">
          <i class="el-icon-arrow-down"></i>
          {{ $store.state.LOGINUSER ? $store.state.LOGINUSER.userName : ""}}
        </span>
        <i class="iconfont icon-guanliyuan"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="SettingCode">收款码设置</el-dropdown-item>
        <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
        <el-dropdown-item command="outLogin">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      title="收款码设置"
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
    <!-- // H -->

    <el-dialog
      title="收款二维码设置"
      :visible.sync="dialog.settingCode"
      width="400px"
    >
      <div class="code_box">
        <div class="code_alipaly">
          <span>支付宝收款码</span>
          <input
            type="file"
            style="display:none"
            ref="alipay"
            @change="onchangeFile(1,$event)"
          >
          <div
            class="uploadFile"
            @click="$refs.alipay.click()"
            v-if="!ImgList[1]"
          >
            <i class="el-icon-plus"></i>
          </div>
          <div
            class="fileimg"
            v-else
          >
            <img :src="ImgList[1]">
            <span class="item_actions">
              <i
                class="el-icon-delete"
                @click="ImgList[1] = null;delpayCode(1)"
              ></i>
            </span>
          </div>
        </div>
        <div class="code_wechatpaly">
          <span>微信支付收款码</span>
          <input
            type="file"
            style="display:none"
            ref="wechatpay"
            @change="onchangeFile(2,$event)"
          >
          <div
            class="uploadFile"
            @click="$refs.wechatpay.click()"
            v-if="!ImgList[2]"
          >
            <i class="el-icon-plus"></i>
          </div>
          <div
            class="fileimg"
            v-else
          >
            <img :src="ImgList[2]">
            <span class="item_actions">
              <i
                class="el-icon-delete"
                @click="ImgList[2] = null;delpayCode(2)"
              ></i>
            </span>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialog.settingCode = false"
          size="small"
        >确定</el-button>
      </span>
    </el-dialog>
  </header>
</template>


<script>
export default {
  computed: {
    isParent() {
      return this.$store.state.LOGINUSER.parentId;
    },
    isCheckSim() {
      return this.$store.state.LOGINUSER.checkSim;
    }
  },
  mounted() {
    this.getPayCode();
  },
  methods: {
    async delpayCode(flag) {
      let fromData = new FormData();
      fromData.append("operateType", 1);
      fromData.append("type", flag);
      let res = await this.$API.uploadPayCode(fromData);
    },
    async getPayCode() {
      let res = await this.$API.getCustomPayCode({ type: 1 });
      this.filelist = res.data;
      if (this.filelist.length) {
        for (let i = 0; i < this.filelist.length; i++) {
          this.$set(
            this.ImgList,
            this.filelist[i].type,
            "data:image/png;base64," + this.filelist[i].payCode
          );
        }
      }
      //  console.log(this.filelist)
      //  res.map((item,index)=>{

      // })
    },
    async onchangeFile(flag, file) {
      let fileData = file.target.files[0];

      if (!fileData) return;

      let fromData = new FormData();
      fromData.append("payCode", fileData);
      fromData.append("type", flag);
      console.log(this.filelist);
      let res = await this.$API.uploadPayCode(fromData);
      if (res.data.code === 0) {
        this.$set(this.ImgList, flag, "data:image/png;base64," + res.data.data);
        this.$message({
          message: res.data.msg,
          type: "success"
        });
      } else {
        this.$message({
          message: res.data.msg,
          type: "warning"
        });
      }
    },
    isTopUser(item) {
      if (item.key === "purchase" && this.isParent !== 1) {
        return false;
      } else if (item.key === "customer" && this.isCheckSim === 2) {
        return false;
      } else {
        return true;
      }
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
        this.$message({
          message: error,
          type: "warning"
        });
        return;
      }

      this.$API.updatePwd(params).then(res => {
        if (res.code === 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.dialog.editPwd = false;
          this.oldPwd = "";
          this.newPwd = "";
          this.comfirPwd = "";
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    handleCommand(command) {
      console.log(command);
      switch (command) {
        case "editPwd":
          this.dialog.editPwd = true;
          break;
        case "outLogin":
          localStorage.removeItem("LOGINUSER");
          this.$store.commit("GETLOGINUSER", null);
          this.$router.push("/login");
          break;
        case "SettingCode":
          this.dialog.settingCode = true;
          break;
      }
    }
  },

  data() {
    return {
      ImgList: {},
      filelist: [],
      activeIndex: this.$route.name,
      list: [
        { name: "SIM卡管理", key: "sim", path: "sim" },
        // { name: "购卡", key: "purchase", path: "purchase" },
        { name: "客户管理", key: "customer", path: "customer" }
        // { name: "风控设置", key: "risk", path: "risk" },
        // { name: "操作记录", key: "record", path: "record" }
      ],
      dialog: {
        editPwd: false,
        settingCode: false
      },
      oldPwd: "",
      newPwd: "",
      comfirPwd: ""
    };
  }
};
</script>


<style lang="scss" scoped>
@import "@/public/css/base.scss";
.code_box {
  display: flex;
  .code_wechatpaly {
    margin-left: auto;
  }
  .item_actions {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    i {
      cursor: pointer;
    }
  }
  .fileimg {
    width: 148px;
    height: 148px;
    position: relative;
    &:hover {
      .item_actions {
        opacity: 1;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .uploadFile {
    background-color: #fbfdff;
    text-align: center;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
    font-size: 28px;
    &:hover {
      border-color: #409eff;
      i {
        color: #409eff;
      }
    }
  }
}
.header-nav {
  background: #0c3b87;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  position: relative;
  .logo {
    height: 45px;
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
      color: #5082ce;
      font-size: 14px;
      // padding: 0 13px;
      width: 85px;
      position: relative;
      text-align: center;
      &:hover {
        color: #fff;
      }
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

