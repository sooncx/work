function deepClone(vnodes, createElement) {

  function cloneVNode (vnode) {
    const clonedChildren = vnode.children && vnode.children.map(vnode => cloneVNode(vnode));
    const cloned = createElement(vnode.tag, vnode.data, clonedChildren);
    cloned.text = vnode.text;
    cloned.isComment = vnode.isComment;
    cloned.componentOptions = vnode.componentOptions;
    cloned.elm = vnode.elm;
    cloned.context = vnode.context;
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;

    return cloned;
  }

  const clonedVNodes = vnodes.map(vnode => cloneVNode(vnode))
  return clonedVNodes;
}
Vue.component('treeItem', {
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
    markIcons:{
      type:Object,
      required:1
    }
  },
  data: function() {
    return {
      isOpen: false,
      isActive: false,
      isInitHtml: false,
      currentValue: JSON.parse(JSON.stringify(this.value)),
    };
  },
  created() {
    this.setDefault();
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
    statusIcon(){
      if(this.isOpen){
        return this.markIcons.open
      }else{
        return this.markIcons.close
      }
    },
    paddingLeftSize(){
      return (this.lv+1)*10+"px"
    }
  },
  methods: {
   
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
    changeType: function() {
      if (!this.isFolder) {
        Vue.set(this.model, "chindren", []);
        this.addChild();
        this.open = true;
      }
    },
    addChild: function() {
      this.model.chindren.push({
        name: "new stuff"
      });
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
          if(idInIndex !==-1){
             this.currentValue.splice(idInIndex, 1);
          }
          break;
        case "selected":
          if(idInIndex===-1){
            this.currentValue.push(itemData[this.idKey]);
          }
          break;
      }

      this.$emit("input", this.currentValue);
      this.$emit("change", {data:itemData,eventType:eventType});
    },
    change(params){
      this.$emit("change", params);
    },
    oncancel(item) {
      this.changeCurValue(item, "cancel");
      this.$emit("oncancel", item);
    
    },
    onselected(item) {
      this.changeCurValue(item, "selected");
      this.$emit("onselected", item);
    },
    modelInput(value){
      this.currentValue=value;
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
  },
  render (h) { 
    
    let subLists =null;
    if(this.model&&this.isFolder){
      subLists=this.model.chindren.map(item => {
        return (
          <tree-item value={this.currentValue}  markIcons={this.markIcons} on-input={this.modelInput} on-oncancel={this.oncancel} on-onselected={this.onselected} lv={this.lv+1} isRadio={false} model={item} on-change={this.change}  idKey={this.idKey}  nameKey={this.nameKey}    >
              {}
          </tree-item>
          )
      })
    }
     
    return(
      <div class="bsj-tree-item" class={ this.isActive&&this.isChecked ?  'active bsj-tree-item':' bsj-tree-item' }>
          <div class="item-cont"  style={'paddingLeft:'+this.paddingLeftSize}  >
              <i   style={'display:'+(this.isFolder?'inline-block':'none')}  class= {'iconfont '+this.statusIcon}  on-click={this.toggle} ></i>
              <span   on-click={this.selectCur.bind(this,this.model)}  style={'paddingLeft:'+this.isFolder?'0px':'20px'} >
                {this.$slots.default}
              </span >
          </div>
          {  this.isFolder&&this.isInitHtml ?  <ul style={'display:'+(this.isOpen?'block':'none')} class="sub-tree-ul">
            {subLists}
          </ul>:""}
         
      </div>
    )
  }
});

