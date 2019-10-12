<template>
  <div class="myTree">
    <el-input
      v-if="icon"
      class="filter-input"
      :placeholder="placeholder"
      v-model="fileterText"
    >
      <i
        class="iconfont" :class="icon"
        slot="suffix"
      >
      </i>
    </el-input>
    <div class="tree_select" v-if="selectButton">
      <div class="tree_select_btn" @click="selectActive = 1;$emit('selectClick',selectActive);" :active="selectActive=== 1">
        {{ selectText ? selectText[0] : "库存 (999)"}}
      </div>
      <div class="tree_select_btn" @click="selectActive = 2;$emit('selectClick',selectActive);" :active="selectActive === 2">
        {{ selectText ? selectText[1] : "已出售 (999)"}}
      </div>
    </div>
    <el-tree
      class="filter-tree"
      :class="{'selecttree':selectButton | !icon}"
      :data="treeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      node-key="id"
      :default-expanded-keys="[-1]"
      ref="tree"
      render-after-expand
      highlight-current
      @node-click="handleNodeClick"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
      >
        <i v-if="treeIcon" class="iconfont" :class="treeIcon"></i>
        <img v-if="data.img" :src="require('@/public/img'+data.img)" >
        <span>{{ node.label }}</span>
        <i  v-if="data.plus" class="iconfont plusicon icon-zengjia" @click.stop="$emit('pushTree',data)"></i>
        <i  v-if="data.simNum != null" class="iconfont plusicon icon-xiugai2" @click.stop="editTree(data)"></i>
        <!-- <i  v-if="data.simNum != null" class="iconfont plusicon icon-shanchu3" @click.stop="$emit('pushTree',data)"></i> -->
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  watch: {
    fileterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    filterNode(value, data) {
      console.log(data, value);
      if (!value) return true;
      return (data.name || data.groupName).indexOf(value) !== -1;
    },

    handleNodeClick(data) {
      this.nodeDblclick(data);
      this.$emit("node-click", data);
    },
    editTree (item) {
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
            groupId: item.groupId,
            groupName: value
          };
          let data = await this.$API.updateSimGroup(params);
          item.name = `${value} (${item.simNum})`
          this.$message({
            type: "success",
            message: "修改成功"
          });
        })
        .catch(() => {});
    },
    nodeDblclick(data) {
      let curId = this.curNodeClick.nodeId;
      let nowId = data.$treeNodeId;
      let curTime = this.curNodeClick.timestamp;
      let nowTime = new Date().getTime();
      if (curId !== nowId || !curTime) {
        this.curNodeClick.nodeId = data.$treeNodeId;
        this.curNodeClick.timestamp = nowTime;
        return;
      }
      let dateSpan = (nowTime - curTime) / 1000;
      dateSpan < 0.3 && this.$emit("node-dblclick", data);
      this.curNodeClick.timestamp = nowTime;
    }
  },

  data() {
    return {
      selectActive: 1,
      fileterText: "",
      curNodeClick: {
        timestamp: null,
        nodeId: null
      }
    };
  },

  props: {
    treeData: [Array],
    defaultProps: [Object],
    icon: [String],
    treeIcon: {
      type: String
    },
    selectButton: [Boolean],
    placeholder: {
      type: String,
      default: "输入关键字进行过滤"
    },
    selectText: [Array]
  }
};
</script>
<style lang="scss" scoped>
@import "@/public/css/base.scss";
@import "@/public/css/mixin.scss";
/deep/ .filter-input {
  margin-bottom: 20px;
  input {
    border-radius: 15px;
    height: 30px;
    line-height: 30px;
    background: #f3f7fb;
    font-size: 14px;
    border: none;
  }
  .el-input__suffix {
    display: flex;
    align-items: center;
    margin-right: 10px;
    color: #858f9b;
  }
}
.custom-tree-node {
  display: flex;
  align-items: center;
  img {
    margin-right: 5px;
  }
}
.tree_select {
  display: flex;
  margin-bottom: 20px;
  .tree_select_btn {
    flex: 1;
    cursor: pointer;
    color: #afb7c6;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    background: #e6ebf2;
    text-align: center;
    &[active] {
      background: #fff;
      color: #4b88f6;
    }
  }
}
.filter-tree {
  height: calc(100% - 30px);
  overflow-y: auto;
  flex: 1;
  font-size: 13px;
  color: $fgray;
  .iconfont {
    color: $btnColor;
  }
  .icon-pinglunbankexingxing-copy {
    color: #ffb629;
  }
  .plusicon {
    color: #aab1bd;
    font-size: 13px;
    margin-left: 5px;
  }
}
.myTree {
  height: 100%;
}
.selecttree {
  height: calc(100% - 50px);
  overflow-y: auto;
  padding: 0 5px;
  @include scrollBar;
}
</style>


