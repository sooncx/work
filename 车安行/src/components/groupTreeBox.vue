<template>
  <div class="groupTreeBox-wrap">
      <happy-scroll size="6"
            right
            color="rgba(55, 55, 55, .2)"
            resize
            :scroll-top="scrollTop">
        <treeBox ref="treeBox" v-model="currentValue" @input="inputValue"  @change="change" @oncancel="oncancel" @onselected="onselected"  :data="groupsList"  nameKey="gn"  idKey="gi" >
           
        </treeBox>
      </happy-scroll>
  </div>
</template>
<script>
import treeBox from "@/components/treeBox";
export default {
  props: {
    data: {
      type: [Array],
    },
    value:{
      type:Array,
      required:1
    }
  },
  data(){
    return { 
      groupsList:[],
      currentValue:[],
      scrollTop: 0,
      scrollLeft: 0,
      color:'rgba(51,51,51,1)',
      currentValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  created() {
    this.loadGroups();
  },
  components: {
    treeBox,
  },
  methods:{
    loadGroups(){
      this.$apiUtil.loadGroups({
        data:{
          concernNeed:true,
          updateTime:null
        }
      }).then(rst=>{
        if(rst.flag === 1){
          this.groupsList=TransData(rst.obj.data,"gi","pi","chindren");
          this.$nextTick(function(){
            // debugger
            
            if(this.currentValue.length>0){ //默认首次加载
              this.addSelectById(this.currentValue[0]);
            }
          })
        }
      }).catch(e=>{

      })
    },
    change(itemData){
      this.$emit("change",itemData);
      console.log("change",this.currentValue)
    },
    onselected(itemData){
      console.log("选中")
    },
    oncancel(itemData){
      console.log("oncancle")
    },
    inputValue(val){
      this.$emit("input",val)
    },
    setScrollTopById(id){
       this.scrollTop=this.$refs["treeBox"].getByIdScroollTop(id)
    },
    addSelectById(id){ //增加选中车组id，方便外部选中
      // if()
      this.$nextTick(function(){
         if(this.currentValue.indexOf(id) === -1){
          this.currentValue.push(id);
        };
      // this.$emit("doScrollTop",this.$refs["treeBox"].getByIdScroollTop(id))
        this.setScrollTopById(id)
      })
    },
    setToCurTreeTop(val){// 调到对应选中树的高度
      this.scrollTop=Number(val);
    },
   
  },
  watch:{
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
.groupTreeBox-wrap{
      overflow: auto;
  height: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
</style>

