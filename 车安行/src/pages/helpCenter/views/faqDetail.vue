<template>
  <div class="faqDetail-wrap">
      <div class="f-title">{{displayData.title}}</div>
      <div>
        
      </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        
      }
    },
    computed:{
      displayData(){
        return this.$route.params.data
      }
    },
    created(){
      if(this.$route.params.data){

      }else{
        console.log("this.$route.params.data不能为空")
      }
    }
  }  
</script>
<style lang="less">
.faqDetail-wrap{
  >.f-title{

  }
}
</style>

