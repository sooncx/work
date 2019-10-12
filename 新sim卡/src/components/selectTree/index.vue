<template>
    <div>
        <div class="select-btn" :class="[size]" @click.stop="showSelect =!showSelect">{{userText}}</div>
        <div class="content-box" v-show="showSelect" @click.stop="showSelect= true">
        <div class="tree-box">  
            <my-tree class="select_tree"  v-model="filterText" @node-dblclick="nodeClick" :treeData="treeData" :defaultProps="defaultProps"></my-tree>
        </div>
        </div>
    </div>    
</template>


<script>
import myTree from "@/components/myTree/";
import { SIGTTIN } from "constants";
import {message} from '@/util/message'
export default {
  props: {
    size: {
      type: String,
      default: "small"
    },
    treeData: [Array],
    defaultProps: [Object],
    type: {
      type: Number,
      default: 1
    }
  },
  watch: {
    type() {
      this.userText = "请选择";
      this.showSelect = false;
    }
  },
  data() {
    return {
      showSelect: false,
      filterText: "",
      userText: "请选择"
    };
  },
  methods: {
    nodeClick(node) {
      if(node.isparent) {
        message(-1,'不可选择此选项')
        return 
      }
      this.$emit("node-dblclick", node);
      this.showSelect = false;
      this.userText = node.groupName || node.name;
    },
    clearData () {
      this.userText = '请选择'
      this.showSelect = false
    }
  },
  components: {
    myTree
  },
  mounted() {
    this.$root.$on("visible", () => {
      this.showSelect = false;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/mixin.scss";
.select-btn {
  width: 100%;
  font-size: 13px;
  color: #d4dbe8;
  position: relative;
  height: 30px !important;
  line-height: 30px !important;
  box-sizing: border-box;
  cursor: pointer;
  @extend .inputBg;
}
.select-btn.small {
  height: 25px;
  line-height: 25px;
}
.select-btn.medium {
  height: 26px;
  line-height: 26px;
}
.content-box {
  margin-top: 3px;
  position: absolute;
  // top: 100%;
  width: 90%;
  color: #767e8b;
  background: #fff;
  z-index: 10;
  height: 350px;
  overflow: hidden;
  border: 1px solid rgba(225, 229, 237, 1);
  box-shadow: 0px 6px 8px 0px rgba(179, 179, 179, 0.24);
  border-radius: 4px;
  .tree-box {
    height: 100%;
    & /deep/ .selecttree {
      height: 100%;
    }
  }
  .content-title {
    text-align: center;
    padding: 12px 0;
    font-size: 14px;
    span {
      color: #1c5ed6;
    }
  }
}
</style>

