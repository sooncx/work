<template>
  <div class="box">
      <div class="control-cont">
          <div class="col-1" @click="$emit('toggle')">
              <i class="iconfont icon-bofang" v-show="!isPlaying"></i>
              <i class="iconfont icon-zanting"  v-show="isPlaying"></i>
          </div>
          <div class="col-2">
               <el-slider v-model="curValue"></el-slider>
          </div>
          <div class="col-3">
           <el-dropdown @command="handleCommand" trigger="hover" >
              <el-button size="mini" class="ver-ali-m">
                速度:<span class="c-blue">{{speedTxt}}</span><i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="2.5">慢</el-dropdown-item>
                <!-- <el-dropdown-item command="1.5">中</el-dropdown-item> -->
                <!-- <el-dropdown-item command="2">中快</el-dropdown-item> -->
                <el-dropdown-item command="5" >中</el-dropdown-item>
                <el-dropdown-item command="7.5" active>快</el-dropdown-item>
                <el-dropdown-item command="15" active>飙</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
              <!-- <el-popover
              class="speed-popover"
              placement="top-start"
             v-model="visible"
              width="30"
              
             >
             <el-slider
              v-model="speedVal"
              vertical
              :step="20"
              :min="20"
              width="50px"
              height="200px">
            </el-slider>
              <el-button slot="reference" @click="visible = !visible">速度</el-button>
            </el-popover> -->

              
          </div>
      </div>
  </div>
</template>
<script>
export default {
  props:{
    value:{
       type:Number,
       default:0
    },
    isPlaying:{
      type:Boolean,
      default:false
    },
    speed:{
      type:Number,
      default:5
    }
  },
  data() {
    
    return {
      curValue:0,
      curSpeed:this.speed,
      visible:true
    }
  },
  created(){

  },
  computed:{
    speedTxt(){
      var result=""
      switch(this.curSpeed){
        case 2.5:
          result="慢"
          break;
        case 5:
          result="中"
          break
        case 7.5:
          result="快"
          break;
        case 15:
          result="飙"
          break;
        
      }
      return result;
    }
  },
  methods:{
    handleCommand(val){
      this.curSpeed=Number(val);
      this.$emit("update:speed", this.curSpeed)
    }
  },
  watch:{
    curValue(val){
      if(this.curValue!==this.value){
        this.$emit("input",val)
        this.$emit("change",val)
      }
    },
    value(val){
      this.curValue=val
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  background-color: #fff;
  padding:5px 10px;
  box-shadow: -3px 4px 9px #dedede;
  width: 500px;
}
.control-cont{
  display: flex;
  justify-content: center;
  align-content: center;
  >.col-1{
    padding-right:10px ;
    cursor: pointer;
    .iconfont{
       font-size: 24px; 
       color: #2A7EE5;

    }
  }
  >.col-2{
    flex: 1;
  }
  >.col-3{
    padding-left: 20px;
    width: 90px;
    text-align: center;
    align-items: center;
    display: flex;
    .el-button--mini, .el-button--mini.is-round{
       padding: 7px;
    }
  }
}
 .speed-popover /deep/ .el-popover{
    min-width: 20px;
  }
</style>
