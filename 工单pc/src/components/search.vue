<template>
    <div class="p-search">
        <div class="s-input-box">
            <input class="s-input" type="text" v-model="curValue" :placeholder="placeholder" :style="{'min-width':minWidth+'px'}">
            <i class="iconfont s-input-icon" :class="icon"></i>
        </div>
    </div>
</template>
<script>
export default{
    props:{
        value:{
            type:String,
            required:true
        },
        placeholder:{
            type:String
        },
        icon:{
            type:String,
            default:"icon-fangdajing"
        },
        minWidth:{
            type:Number,
            default:150
        }
    },
    data(){
        return {
            curValue:this.value
        }
    },
    watch:{
        curValue:function(val){
            this.$emit("change",val);
        }
    }
}
</script>
<style lang="less">
@import "~assets/css/lessKey";
    .p-search{
       .s-input{
          height: 26px;
          width: 26px;
          text-indent: 10px;
          background:@c-body; 
          border-radius: 3px;
       }
       .s-input-box{
           position: relative;
            .s-input-icon{
                position: absolute;
                right:10px;
                top:50%;
                transform: translateY(-50%)
            }
       }
      
    }
</style>

