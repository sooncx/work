<template>
  <div class="groupTreeBox-wrap">
    <happy-scroll
      size="6"
      class="scrollTree"
      right
      color="rgba(55, 55, 55, .2)"
      resize
      ref="scroll"
      :scroll-top="scrollTop"
    >
      <el-tree
        class="group-tree"
        v-loading="isLoading"
        ref="tree"
        node-key="gi"
        :default-expanded-keys="curDefaultExpandedKeys"
        :data="grouTreeData"
        :props="defaultProps"
        :highlight-current="true"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
        <div slot-scope="_">
         
              <template v-if="_.data.gi !==-1&&_.data.gi !==-2">
                <span class="iconfont icon-chezu"></span>
                {{_.data.gn}}
              </template>
              <template v-else-if="_.data.gi ===-1">
                <span class="iconfont icon-zdgz"></span>
                {{_.data.gn}}
              </template>
              <template v-else-if="_.data.gi ===-2">
                <span class="iconfont icon-wuxianAP"></span>
                {{_.data.gn}}
              </template>
              ({{_.data.tt+"/"+_.data.an}})
          
        </div>
      </el-tree>
    </happy-scroll>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    data: {
      type: [Array]
    },
    value: {
      type: Array
      // required:1
    },
    defaultExpandedKeys: {
      //设置默认打开的节点 参考el
      type: Array,
      default: function() {
        return [];
      }
    },
    groupCheckedValue: {
      //当前车组选择值 以node-key="gi"为唯一标识
      type: [String, Number],
      default: ""
    },
    isMultiple:{ //是否是多选 多选则显示checkBox
      type:Boolean,
      default:false
    },
    isShowConcernNeed:{ //是否显示（重点关注，无线追车）车组
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        disabled: "disabled",
        icon: "icon",
        label: "gn"
      },
      scrollTop: 0,
      groupsList: [],
      scrollLeft: 0,
      currentValue: JSON.parse(JSON.stringify(this.value || [])),
      curGroupCheckedValue: this.groupCheckedValue,
      curDefaultExpandedKeys: this.defaultExpandedKeys,
      clickTimer: null, //检查单击还是双击的
      clickTime: 300, //检查单击还是双击的的时间
      clickPrevGroupId: null, //上次点击选中的车组id
      clickCount: 0
    };
  },
  computed: {
    isLoading() {
      //车组是否在加载中
      if (this.$store.state.grouTreeData === null) {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters({
      grouTreeData: "grouTreeData"
    })
  },
  mounted(){
     this.$refs.tree.filter(this.isShowConcernNeed);
  },
  methods: {
    filterNode(value,data){
      if(this.isShowConcernNeed){
        return true
      }else{
        if(data.gi===-1||data.gi===-2){
          return false
        }else{
          return true
        }
      }
    },
    handleNodeClick(itemData, node) {
      this.judgeDbTapkOrTap({ 
        itemData,
        node,
        dbTapCall:this.doNodeDbTap,
        tapCall:this.doNodeTap
      });
    },
    judgeDbTapkOrTap({ itemData, node, dbTapCall, tapCall }) {
      //判断当前是单击还是双击
      if (itemData.gi !== this.clickPrevGroupId || this.clickCount === 0) {
        //如果点击不同车组或第一次点击，取消之前的延时
        clearTimeout(this.clickTimer);
        this.clickCount = 1;
        this.clickPrevGroupId=itemData.gi
        this.clickTimer = setTimeout(() => {
          //判断当前是单击还是双击
          this.clickCount = 0;
            this.clickPrevGroupId=null
          if(typeof tapCall === "function"){
            
            tapCall(itemData, node)
          }
        }, this.clickTime);
      } else if (this.clickCount === 1) {
        //之前点击过一次，现在再次点击就进入双击处理
        clearTimeout(this.clickTimer);
        this.clickPrevGroupId=itemData.gi
        this.clickCount = 0;
        this.clickPrevGroupId=null
        if(typeof dbTapCall === "function"){
            dbTapCall(itemData, node)
          }
      }
    },
    doNodeTap(itemData, node){ //tree单击事件
      this.currentChange(itemData, node)
    },
    doNodeDbTap(itemData, node){ //tree双击事件
      if(!this.isMultiple){//tree单选的时候双击选中
          this.$emit("dbClick",itemData)
          this.curGroupCheckedValue = itemData.gi;
      }
    },
    setScrollTopById(id) {
      //  this.scrollTop=this.$refs["treeBox"].getByIdScroollTop(id)
    },
    addSelectById(id) {
      //增加选中车组id，方便外部选中
      // if()
      this.$nextTick(function() {
        if (this.currentValue.indexOf(id) === -1) {
          this.currentValue = [id];
        }
        // this.$emit("doScrollTop",this.$refs["treeBox"].getByIdScroollTop(id))
        this.setScrollTopById(id);
      });
    },
    setToCurTreeTop(val) {
      // 调到对应选中树的高度
      this.scrollTop = Number(val);
    },
    reset() {
      //重置滚动条容器的大小；修复css3动画效果导致的问题
      this.$refs["scroll"] && this.$refs["scroll"].setContainerSize();
    },
    currentChange(selectData, node) {
      //tree选中车组的回调
      this.$emit("currentChange", selectData);
      this.curGroupCheckedValue = selectData.gi;
    },
    setDefaultGroup(val) {
      //设置默认选中车组
      this.$refs.tree&&this.$refs.tree.setCurrentKey(val);
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.currentValue)) {
          this.currentValue = JSON.parse(JSON.stringify(val));
        }
      }
    },
    grouTreeData: {
      deep: true,
      handler(val) {
        this.$nextTick(function() {
          this.setDefaultGroup(this.curGroupCheckedValue);
           this.$refs.tree.filter(this.isShowConcernNeed);
        });
      }
    },
    groupCheckedValue(val) {
      if (this.curGroupCheckedValue !== val) {
        this.curGroupCheckedValue=val
        this.setDefaultGroup(val);
      }
    },
    defaultExpandedKeys: {
      deep: true,
      handler(val) {
        if (JSON.stringify(this.curDefaultExpandedKeys) !== JSON.stringify(val)) {
          this.$set(this, "curDefaultExpandedKeys", Object.assign(val));
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.groupTreeBox-wrap {
  height: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
.scrollTree {
  min-height: 100%;
}
.sp-plate,
.sp-cont {
  white-space: nowrap;
}
.sp-cont {
  color: #999;
  padding-right: 10px;
}
/deep/ .el-tree,
/deep/ .happy-scroll-content {
  width: 100%;
}
.group-tree {
  padding: 10px 0;
}
</style>

