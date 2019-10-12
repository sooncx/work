<template>
  <div class="myTree">
    <el-input
      class="filter-input"
      :placeholder="placeholder"
      v-model="fileterText"
      @click.native.stop="selecttree && (treeVisble = !treeVisble)"
    >
      <i
        class="iconfont"
        :class="icon"
        slot="suffix"
      >
      </i>
    </el-input>
    <transition name="slide_top">
      <div
        @click.stop="() => {}"
        v-show="treeVisble"
        :class="{'selecttree': selecttree}"
      >
        <el-tree
          class="filter-tree"
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
            <i
              v-if="treeIcon"
              class="iconfont"
              :class="treeIcon"
            ></i>
            <img
              v-if="data.img"
              :src="require('@/public/img'+data.img)"
            >
            <span>{{ node.label }}</span>
            <i
              v-if="data.plus"
              class="iconfont plusicon icon-zengjia"
              @click.stop="$emit('pushTree',data)"
            ></i>
            <i
              v-if="data.simNum != null"
              class="iconfont plusicon icon-xiugai2"
              @click.stop="editTree(data)"
            ></i>
          </span>
        </el-tree>
      </div>
    </transition>
  </div>
</template>
<script>
import { throttle } from "@/util/common";
export default {
  watch: {
    fileterText(val) {
      this.$refs.tree.filter(val);
      //接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数
    }
  },

  mounted() {
    //选择客户时默认不显示
    this.selecttree && (this.treeVisble = false);
    let _this = this;
    document.onclick = function(e) {
      _this.selecttree && (_this.treeVisble = false);
      e.stopPropagation();
    };
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return (
        (data.label || data.name).indexOf(value) !== -1 ||
        (data.label || data.name).indexOf(value.toUpperCase()) !== -1
      );
      //当输入框输入内容在tree的label中找到，返回true，反之返回false，即没找到的隐藏，找到的显示，配合watch监听实现tree节点“实时”搜索
    },

    handleNodeClick(data) {
      this.nodeDblclick(data);
      this.$emit("node-click", data);
    },
    editTree(item) {
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
          item.name = `${value} (${item.simNum})`;
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
      if (dateSpan < 0.3) {
        if (this.selecttree) {
          if (data.name === "我的客户") {
            this.$msg({
              message: "不可选择此选项",
              type: "warning"
            });
            return;
          }
          this.treeVisble = false;
          this.fileterText = data.name;
        }
        this.$emit("node-dblclick", data);
      }
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
      },
      treeVisble: true
    };
  },

  props: {
    treeData: [Array],
    defaultProps: [Object],
    icon: [String],
    treeIcon: {
      type: String
    },
    selecttree: {
      type: Boolean,
      default: false
    },
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
.slide_top-enter-active,
.slide_top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}
.slide_top-enter,
.slide_top-leave-active {
  opacity: 0;
  -webkit-transform: scaleY(0);
  transform: scaleY(0);
}
/deep/ .filter-input {
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
.filter-tree {
  margin-top: 20px;
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
  overflow: auto;
}
.selecttree {
  margin-top: 3px;
  position: absolute;
  width: 90%;
  color: #767e8b;
  background: #fff;
  z-index: 10;
  height: 350px;
  overflow: hidden;
  border: 1px solid rgba(225, 229, 237, 1);
  box-shadow: 0px 6px 8px 0px rgba(179, 179, 179, 0.24);
  border-radius: 4px;
  /deep/ .el-tree {
    height: calc(100% - 50px);
    overflow-y: auto;
    padding: 0 5px;
    @include scrollBar;
  }
}
</style>


