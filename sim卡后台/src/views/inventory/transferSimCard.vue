<template>
  <!-- 转移sim卡 -->
  <div>
    <el-dialog
      :visible.sync="visible"
      width="400px"
      title="转移"
      class="huabo"
      @closed="initParams()"
    >
      <my-tree
        icon="icon-fangdajing"
        @node-dblclick="node => activeNode = node"
        :treeData="treeData"
        :defaultProps="defaultProps"
        selecttree
        ref="selectTree"
        placeholder="请选择客户"
      ></my-tree>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="openComfir()"
          size="small"
        >确认划拨</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="comfirVisible"
      width="300px"
    >
      <div class="tranfer-comfir">
        <div class="tansfer-img">
          <img :src="require('@/public/img/other/transfer.png')">
        </div>
        <div>即将转移<span class="red">{{total}}</span>张卡至<span class="blue">({{activeNode && activeNode.name}})</span></div>
        <div class="desc">注意：转移成功后不可恢复</div>
      </div>
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
  </div>
</template>

<script>
import myTree from "@/components/myTree/";
import comfirDialog from "@/components/comfir/";
export default {
  components: {
    myTree,
    comfirDialog
  },

  data() {
    return {
      selectIccids: null,
      visible: false,
      treeData: null,
      activeNode: null,
      defaultProps: {
        children: "children",
        label: "name"
      },
      total: 0,
      comfirVisible: false,
      searchSimListByInventoryParams: null
    };
  },

  watch: {
    userList: {
      handler: function(val) {
        this.treeData = [
          {
            name: "我的客户",
            img: "/other/kehu.png",
            children: val,
            isparent: true
          }
        ];
      },
      immediate: true
    }
  },

  computed: {
    userList() {
      return this.$store.state.userList;
    }
  },

  mounted() {
    this.getTreeData();
  },

  methods: {
    initParams() {
      this.activeNode = null;
      this.$refs.selectTree.fileterText = "";
    },
    openComfir() {
      try {
        if (!this.activeNode) throw "请选择划拨用户！";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }
      // console.log(this.activeNode);
      this.comfirVisible = true;
    },
    comfirTransferSim() {
      try {
        if (!this.searchSimListByInventoryParams) throw "请输入搜索条件！";
        if (this.total === 0) throw "请搜索出SIN卡！";
        if (!this.activeNode) throw "请选择划拨用户！";
      } catch (error) {
        this.$msg({
          message: error,
          type: "warning"
        });
        return;
      }
      let params = {
        targetUserId: this.activeNode.userId,
        ...this.searchSimListByInventoryParams,
        iccids: this.selectIccids
      };
      // if (this.selectIccids != null) {

      // } else {
      //   delete params.iccids;
      // }
      if (params.iccids == null || params.iccids == "") {
        delete params.iccids;
      }
      //删除不必要的参数
      delete params.pageNumber;
      delete params.pageSize;
      //console.log("转移参数:" + JSON.stringify(params));
      console.log("传递的iccid:" + params.iccids);
      const loading = this.$loading({
        lock: true,
        text: "Loading"
      });
      this.$API
        .transferEquative(params)
        .then(res => {
          if (res.code === 0) {
            this.$msg({
              message: res.msg,
              type: "success"
            });
            this.comfirVisible = false;
            this.visible = false;
            loading.close();
          } else {
            this.$msg({
              message: res.msg,
              type: "error"
            });
            loading.close();
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    getTreeData() {
      if (this.userList > 0) return;
      this.$API.getSimMarkUserList().then(res => {
        if (res.code === 0) {
          this.$store.commit("GETUSERLIST", res.data);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
.tranfer-comfir {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  & > div {
    & + div {
      margin-top: 20px;
    }
  }
  .red {
    color: #d61c1c;
  }
  .blue {
    color: $btnColor;
  }
  .desc {
    color: #98a4b9;
  }
  .tansfer-img {
    text-align: center;
    img {
      width: 80%;
    }
  }
}

/deep/ .el-dialog {
  .el-dialog__header {
    border: none;
  }
  .el-dialog__body {
    padding: 20px;
  }
}
</style>
