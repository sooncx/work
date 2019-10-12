<template>
  <div class="treeBox-wrap">
      <tree-item @input="inputValue"  v-model="currentValue" :markIcons="markIcons"
             @onselected="onselected" @oncancel="oncancel" :isRadio="isRadio" :model="item" 
                @change="change" 
                :idKey="idKey"  
                :nameKey="nameKey"   v-if="data&&data.length>0" v-for="item in data">    
        <template slot-scope="_"  slot="main">
           <slot :vm="_.vm" :model="_.model" name="main"  >
              <i class="iconfont  " v-show="_.vm.curItemIcon" :itemIcon="_.vm.curItemIcon"></i>
               <span >{{ _.model[_.vm.nameKey] }}</span> 
           </slot>
        </template>
      </tree-item>
  </div>
</template>
<script>
import treeItem from "./treeItem";
export default {
  props: {
    data: {
      type: [Array]
    },
    idKey: {
      type: String,
      default: "vehGroupID"
    },
    nameKey: {
      type: String,
      default: "vehGroupName"
    },
    value:{
      type:Array,
      required:1
    },
    itemIcon:{
      type:String,
      default:"icon-che"
    },
    markIcons:{ //树状图左边的图标 仅支持iconfont图标 就这么任性
      type:Object,
      default:function(){
        return {
          close:"icon-sanx",
          open:"icon-sanb",
        }
      }
    },
    isRadio:{ //判断是否是单选
      type:Boolean,
      default:true
    }
  },
  data(){
    return { 
      currentValue:JSON.parse(JSON.stringify(this.value)),
      dataIdIndexes:{}
    }
  },
  created() {
    // this.dataIdIndexes();
  },
  components: {
    treeItem
  },
  methods:{
    change(params){
      this.$emit("change",params);
    },
    getDataIdIndexes(){
      this.dataIdIndexes={};
      if(this.data){
        this.data.forEach(item => {
          var newItem=Object.assign({},item)
          
          delete newItem.chindren
          this.dataIdIndexes [item[[this.idKey]]]= newItem
        });
      }
    },
    getNodeById(id){
      return dataIdIndexes[id];
    },
    onselected(itemData){
      this.$emit("onselected",itemData) 
    },
    oncancel(itemData){
      this.$emit("oncancel",itemData) 
    },
    inputValue(val){
      this.$emit("input",val)
    },
    getByIdScroollTop(id){
         var itemEl=this.$el.getElementsByClassName('bsj-tree-item-'+id);
         var itemElTop=0;
         var wrapTop=this.$el.offsetTop
         if(itemEl&&itemEl[0]){
           itemElTop=itemEl[0].offsetTop
         }
         return itemElTop-wrapTop
    },
    xFind_Name(name, dom) {  
      if (dom.attributes.name.value == name) {  
          //找到则返回dom  
          return dom;  
      }  
      //没有找到此元素  
      if (dom.length == 0) {  
          return null;  
      }  
      if (dom.children.length == 0) {  
          return null;  
      }  
      for (var i = 0; i < dom.children.length; i++) {  
          if (dom.children.length > 0) {  
              var result = this.xFind_Name(name, dom.children[i]);  
              if (result != null) {  
                  return result;  
              }  
          } else {  
              return null;  
          }  
      }  
      return null;  
    }
  },
  watch:{
    data:{
      deep:true,
      handler:function(val){
        this.getDataIdIndexes()
      }
    },
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
<style lang="less" scoped>
.treeBox-wrap{
  // overflow: auto;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
</style>

