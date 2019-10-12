<template>
    <div class="bsj-tree-item" :class="{'active':isActive&&isChecked}">
      <div class="item-cont" :class="[boxCls]"  :style="{paddingLeft:lv*16+'px'}"   >
          <span class="item-cont-col">
              <i class="iconfont iconFolder"  v-if="isFolder" :class="statusIcon" @click="toggle" ></i>
          </span>
          <span  class="item-cont-col item-cont-col-name"  :class="{'noneFolder':!isFolder}" @click="selectCur(model)" >
            <!-- :style="{paddingLeft:isFolder?'0px':'16px'}" -->
            <slot :vm="this" :model="model">
                <i class="iconfont icon-chezu iconmarkItem"></i>
                <span :title="model[nameKey]">{{ model[nameKey] }}</span> 
                <span >({{model.tt}}台)</span>
            </slot>
              
          </span>
      </div>
      <ul v-if="isFolder&&isInitHtml" v-show="isOpen" class="sub-tree-ul">
        <li  v-for="(item,index) in model.chindren" :key="index">
            <treeItem :idKey="idKey" :markIcons="markIcons" :nameKey="nameKey" :isRadio="isRadio" v-model="currentValue" :lv="lv+1" :model="item" @oncancel="oncancel" @onselected="onselected">
                 
            </treeItem>
        </li>
      </ul>
    </div>
</template>
<script>
import treeItem from "@/components/treeItem";
export default {
  // render:function(createElement) {
  //   return createElement('div', [
  //     ...this.$slots.default
  //   ])
  // },
  name: "treeItem",
  components: {
    treeItem
  },
  props: {
    model: {
      type: Object,
      require: 1
    },
    lv: {
      //当前树状图等级
      type: Number,
      default: 0
    },
    isRadio: {
      //是否是单选
      type: Boolean,
      default: false
    },
    value: {
      //当前树状图选中的值，为了可以多选，所以是数组类型
      type: Array,
      required: 1
    },
    idKey: {
      type: String,
      required: 1
    },
    nameKey: {
      type: String,
      required: 1
    },
    markIcons: {
      type: Object,
      required: 1
    }
  },
  data: function() {
    return {
      isOpen: false,
      isActive: false,
      isInitHtml: false,
      currentValue: JSON.parse(JSON.stringify(this.value))
    };
  },
  created() {
    this.setDefault();
  },
  components: {
    treeItem
  },
  computed: {
    isFolder: function() {
      return Boolean(this.model.chindren && this.model.chindren.length);
    },
    isChecked() {
      return this.currentValue.indexOf(this.model[this.idKey]) !== -1;
    },
    itemId() {
      return this.model[this.idKey];
    },
    statusIcon() {
      if (this.isOpen) {
        return this.markIcons.open;
      } else {
        return this.markIcons.close;
      }
    },
    boxCls(){
      return 'bsj-tree-item-'+this.model[this.idKey]
    }
  },
  methods: {
    // deepClone(vnodes, createElement) {
    //   function cloneVNode(vnode) {
    //     const clonedChildren =
    //       vnode.children && vnode.children.map(vnode => cloneVNode(vnode));
    //     const cloned = createElement(vnode.tag, vnode.data, clonedChildren);
    //     cloned.text = vnode.text;
    //     cloned.isComment = vnode.isComment;
    //     cloned.componentOptions = vnode.componentOptions;
    //     cloned.elm = vnode.elm;
    //     cloned.context = vnode.context;
    //     cloned.ns = vnode.ns;
    //     cloned.isStatic = vnode.isStatic;
    //     cloned.key = vnode.key;

    //     return cloned;
    //   }

    //   const clonedVNodes = vnodes.map(vnode => cloneVNode(vnode));
    //   return clonedVNodes;
    // },
    hasChindrenId(ids, itemModel) {
      //判断当前或者子集是否包含选中的id
      var isHas = false;
      // isHas
      if (itemModel.chindren) {
        var len = itemModel.chindren.length;
        for (var i = 0; i < len; i++) {
          var itemChindren = itemModel.chindren[i];
          if (ids.indexOf(itemChindren[this.idKey]) !== -1) {
            isHas = true;
            break;
          } else if (
            itemChindren.chindren &&
            itemChindren.chindren.length > 0
          ) {
            isHas = this.hasChindrenId(ids, itemChindren);
            if (isHas) {
              break;
            }
          }
        }
      }
      return isHas;
    },
    setDefault() {
      if (this.isChecked) {
        this.isOpen = true;
        this.isInitHtml = true;
        this.isActive = true;
      } else if (this.hasChindrenId(this.currentValue, this.model)) {
        this.isOpen = true;
        this.isInitHtml = true;
      }
    },
    toggle: function() {
      this.isInitHtml = true;
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    selectCur: function(itemData) {
      if (this.isRadio) {
        //判断是否单选
        this.isActive = true;
      } else {
        this.isActive = !this.isActive;
      }
      this.isInitHtml = true;
      if (this.isActive) {
        this.onselected(itemData);
      } else {
        this.oncancel(itemData);
      }
    },
    changeCurValue(itemData, eventType) {
      var idInIndex = this.currentValue.indexOf(itemData[this.idKey]);
      switch (eventType) {
        case "cancel":
          if (idInIndex !== -1) {
            this.currentValue.splice(idInIndex, 1);
          }
          break;
        case "selected":
          if (idInIndex === -1) {
            this.currentValue.push(itemData[this.idKey]);
          }
          break;
      }
      this.$emit("input", this.currentValue);
      this.$emit("change", { itemData: itemData, eventType: eventType,value:this.currentValue });
    },
    change(params) {
      this.$emit("change", params);
    },
    oncancel(item) {
      this.changeCurValue(item, "cancel");
      this.$emit("oncancel", item);
    },
    onselected(item) {
      this.changeCurValue(item, "selected");
      this.$emit("onselected", item);
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
    }
  }
};
</script>
<style scoped  lang="less">
@import "~@/assets/css/lessKey";
.bsj-tree-item {
  > .item-cont {
    cursor: pointer;
    // border-bottom: 1px solid @c-bor;
    display: flex;
    align-items: center;
    .item-cont-col-name{
         margin:2px 0 ;
         padding:2px 6px  ;
             display: flex;
          align-items: center;
          // display: 
          &.noneFolder{
            padding-left: 4px;
          }
    }
    i.iconfont {
      color: #999;
      width: 16px;
    }
    i.iconFolder{
      color: #4480D8
    }
    i.iconmarkItem{
      // padding-left:5px;
      margin-right: 5px;
      color: #017CE4;
    }
  }
  &.active {

    > .item-cont {
      .item-cont-col-name{background: #E7F3FF;}
      // color: #fff;
    }
  }
  .sub-tree-ul {
    li {
      border-top: none !important;
    }
  }
}
</style>
