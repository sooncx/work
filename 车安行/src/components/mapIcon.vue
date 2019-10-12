<template>
  <div class="item-marker">
    <i class="iconfont " @click="iconClick" :class="[displayIcon]">
    </i>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: 1
    }
  },
  data: function() {
    return {
    };
  },
  computed:{
    displayIcon(){
      if(this.data.icon1&&this.data.value){
        return this.data.icon1
      }
      return this.data.icon
    }
  },
  methods: {
    iconClick() {
      if (typeof this.data.callBack === "function") {
        this.data.callBack();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.item-marker{
      width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 4px;
    background-color:  rgba(0,0,0,.4);
    color: #fff;
    &+.item-marker{
      margin-top:10px;
    }
    &>.active.iconfont{
      color: #3d92fb
    }
    &:active {
        transition: all 300ms cubic-bezier(0.1, 0.1, 0.9, 0.9);
        transform: scale(1.2);
      }
    
}
</style>
